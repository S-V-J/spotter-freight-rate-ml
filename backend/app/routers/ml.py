import os
import shutil
import subprocess
import uuid
import re
import pandas as pd
from pathlib import Path
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel

router = APIRouter(prefix="/ml", tags=["Machine Learning"])

class PipelineRequest(BaseModel):
    train_file: str
    validation_file: str
    template_file: str
    december_file: str

class ScorerRequest(BaseModel):
    predictions_file: str
    december_file: str

PREDICTIONS_PATH = Path("/app/validation_predictions.csv")
CHART_PATH = Path("/app/scorer_results/candidate_december.png")
LOGS_PATH = Path("/app/scorer_results/scorer_log.txt")
LIVE_LOG_PATH = Path("/app/pipeline_live_log.txt")

# Global state to track if pipeline is running
pipeline_status = {"running": False}

@router.post("/run-pipeline")
async def run_pipeline(req: PipelineRequest, background_tasks: BackgroundTasks):
    if pipeline_status["running"]:
        raise HTTPException(status_code=400, detail="Pipeline is already running.")
        
    job_id = str(uuid.uuid4())
    
    def execute_pipeline():
        pipeline_status["running"] = True
        try:
            LIVE_LOG_PATH.write_text("")
            data_dir = Path("/app/data")
            data_dir.mkdir(parents=True, exist_ok=True)
            uploads_dir = Path("/app/uploads")
            
            file_mapping = {
                req.train_file: "train_test.csv",
                req.validation_file: "validation.csv",
                req.template_file: "validation_predictions_template.csv",
                req.december_file: "december_chart_inputs.csv"
            }
            
            with open(LIVE_LOG_PATH, "a") as log_file:
                log_file.write(">>> Initializing pipeline...\n")
                log_file.write(">>> Copying files to data directory...\n")
                log_file.flush()
                
                for src_name, dst_name in file_mapping.items():
                    src_path = uploads_dir / src_name
                    dst_path = data_dir / dst_name
                    if src_path.exists():
                        shutil.copy2(src_path, dst_path)
                        log_file.write(f">>> Copied {src_name} to {dst_name}\n")
                        log_file.flush()
                    else:
                        log_file.write(f">>> Warning: Source file {src_path} not found.\n")
                        log_file.flush()

                log_file.write(">>> Starting background training...\n")
                log_file.flush()

                # Use Popen to stream output in real-time
                process = subprocess.Popen(
                    ["python3", "/app/src/train_predict.py"],
                    cwd="/app",
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1
                )
                
                for line in process.stdout:
                    log_file.write(line)
                    log_file.flush()
                    
                process.wait()
                
                if process.returncode != 0:
                    log_file.write(f"\n>>> Pipeline failed with code {process.returncode}\n")
                else:
                    log_file.write("\n>>> Pipeline complete.\n")
                log_file.flush()
                
        except Exception as e:
            with open(LIVE_LOG_PATH, "a") as log_file:
                log_file.write(f"\n>>> Pipeline error: {str(e)}\n")
        finally:
            pipeline_status["running"] = False

    background_tasks.add_task(execute_pipeline)
    
    return {
        "job_id": job_id, 
        "status": "started", 
        "message": "Pipeline execution initiated in background."
    }

@router.get("/status")
async def get_pipeline_status():
    return {"running": pipeline_status["running"]}

@router.get("/logs/stream")
async def stream_logs():
    if not LIVE_LOG_PATH.exists():
        return {"logs": ""}
    return {"logs": LIVE_LOG_PATH.read_text()}

@router.post("/run-scorer")
async def run_scorer(req: ScorerRequest):
    try:
        result = subprocess.run(
            [
                "python3", "/app/score.py", 
                "--predictions", str(PREDICTIONS_PATH), 
                "--december-predictions", "/app/data/december_chart_inputs.csv"
            ],
            cwd="/app",
            capture_output=True,
            text=True,
            timeout=60
        )
        
        LOGS_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(LOGS_PATH, "w") as f:
            f.write(result.stdout if result.returncode == 0 else result.stderr)
        
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Scorer failed: {result.stderr}")
        
        return {
            "status": "success",
            "message": "Scorer validated files successfully.",
            "log": result.stdout
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results")
async def get_results():
    return {
        "predictions_ready": PREDICTIONS_PATH.exists(),
        "chart_ready": CHART_PATH.exists(),
        "log_ready": LOGS_PATH.exists()
    }

@router.get("/download/predictions")
async def download_predictions():
    if not PREDICTIONS_PATH.exists():
        raise HTTPException(status_code=404, detail="Predictions file not found.")
    return FileResponse(PREDICTIONS_PATH, filename="validation_predictions.csv", media_type="text/csv")

@router.get("/download/chart")
async def download_chart():
    if not CHART_PATH.exists():
        raise HTTPException(status_code=404, detail="Chart file not found.")
    return FileResponse(CHART_PATH, filename="candidate_december.png", media_type="image/png")

@router.get("/logs")
async def get_scorer_logs():
    if not LOGS_PATH.exists():
        return {"log": "No scorer logs available yet."}
    with open(LOGS_PATH, "r") as f:
        return {"log": f.read()}

@router.get("/metrics")
async def get_model_metrics():
    metrics_path = Path("/app/report/metrics.txt")
    features_path = Path("/app/report/feature_importances.csv")
    
    mae, rmse, mape = 0.0, 0.0, 0.0
    features = []
    
    if metrics_path.exists():
        try:
            content = metrics_path.read_text()
            match = re.search(r"MAE=\$([\d.]+)\s+RMSE=\$([\d.]+)\s+MAPE=([\d.]+)%", content)
            if match:
                mae = float(match.group(1))
                rmse = float(match.group(2))
                mape = float(match.group(3))
        except Exception as e:
            print(f"Error parsing metrics.txt: {e}")
            
    if features_path.exists():
        try:
            df = pd.read_csv(features_path)
            cols = df.columns.tolist()
            if len(cols) >= 2:
                for _, row in df.head(10).iterrows():
                    features.append({
                        "name": str(row[cols[0]]),
                        "importance": float(row[cols[1]])
                    })
        except Exception as e:
            print(f"Error parsing feature_importances.csv: {e}")

    return {
        "mae": mae,
        "rmse": rmse,
        "mape": mape,
        "features": features,
        "available": len(features) > 0
    }
