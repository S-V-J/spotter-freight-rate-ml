import os
import shutil
import uuid
import csv
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.core.config import settings
import pandas as pd

router = APIRouter(prefix="/files", tags=["File Management"])

UPLOAD_DIR = Path(settings.UPLOAD_DIR)
OUTPUT_DIR = Path("/app/outputs")

def get_safe_filename(filename: str) -> str:
    safe_name = Path(filename).name.strip()
    if safe_name != filename.strip() or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename format")
    return safe_name

def find_file_robust(safe_filename: str) -> Path:
    safe_filename = safe_filename.strip()
    for path in UPLOAD_DIR.rglob("*"):
        if path.is_file() and path.name.strip() == safe_filename:
            return path
    direct_path = UPLOAD_DIR / safe_filename
    if direct_path.is_file():
        return direct_path
    return None

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), category: str = Query("train")):
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_ext = Path(file.filename).suffix
    safe_name = f"{category}_{uuid.uuid4().hex}{file_ext}"
    file_path = UPLOAD_DIR / safe_name
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": safe_name, "path": str(file_path), "category": category, "size": file_path.stat().st_size}

@router.get("/list")
async def list_files(category: str = Query(None)):
    files = []
    for path in UPLOAD_DIR.rglob("*"):
        if path.is_file() and (not category or category in path.name):
            recommended_step = "Unknown"
            try:
                if path.suffix.lower() == '.csv':
                    with open(path, 'r', encoding='utf-8') as f:
                        first_line = f.readline()
                        cols = [c.strip().strip('"').strip("'").lower() for c in first_line.split(',')]
                        
                        has_posted_rate = "posted_rate" in cols
                        has_load_id = "load_id" in cols
                        has_date = "date" in cols
                        has_pickup = "pickup" in cols
                        
                        if has_posted_rate:
                            recommended_step = "Training Data"
                        elif has_load_id and not has_posted_rate:
                            recommended_step = "Validation/Template"
                        elif has_date and has_pickup:
                            recommended_step = "Chart Inputs"
            except Exception:
                pass
                
            files.append({
                "name": path.name,
                "path": str(path),
                "size": path.stat().st_size,
                "category": "train" if "train" in path.name else "validation" if "validation" in path.name else "other",
                "recommended_step": recommended_step
            })
    return files

@router.get("/download/{filename}")
async def download_file(filename: str):
    safe_filename = get_safe_filename(filename)
    file_path = find_file_robust(safe_filename)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=safe_filename)

class RenameRequest(BaseModel):
    old_name: str
    new_name: str

@router.post("/rename")
async def rename_file(req: RenameRequest):
    safe_old = get_safe_filename(req.old_name)
    safe_new = get_safe_filename(req.new_name)
    old_path = find_file_robust(safe_old)
    if not old_path:
        raise HTTPException(status_code=404, detail="File not found")
    new_path = old_path.parent / safe_new
    if new_path.exists():
        raise HTTPException(status_code=400, detail="File with new name already exists")
    old_path.rename(new_path)
    return {"message": "File renamed successfully", "new_path": str(new_path)}

@router.delete("/{filename}")
async def delete_file(filename: str):
    safe_filename = get_safe_filename(filename)
    file_path = find_file_robust(safe_filename)
    if not file_path:
        raise HTTPException(status_code=404, detail=f"File '{safe_filename}' not found in storage")
    try:
        file_path.unlink()
        return {"message": f"File '{safe_filename}' deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")

@router.get("/settings/paths")
async def get_path_settings():
    return {"upload_dir": str(UPLOAD_DIR), "output_dir": str(OUTPUT_DIR)}

@router.get("/inspect")
async def inspect_file(filename: str = Query(...)):
    safe_filename = get_safe_filename(filename)
    file_path = find_file_robust(safe_filename)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        file_ext = file_path.suffix.lower()
        if file_ext == '.csv':
            df = pd.read_csv(file_path, nrows=10000)
            total_rows = len(pd.read_csv(file_path, usecols=[0]))
        elif file_ext == '.json':
            df = pd.read_json(file_path, nrows=10000)
            total_rows = len(pd.read_json(file_path))
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(file_path, nrows=10000)
            total_rows = len(pd.read_excel(file_path, usecols=[0]))
        else:
            raise HTTPException(status_code=400, detail="Unsupported format.")
        
        num_cols = df.select_dtypes(include=['number']).columns.tolist()
        cat_cols = df.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
        
        date_cols = []
        date_range = "No date columns detected"
        for col in df.columns:
            if 'date' in col.lower() or 'time' in col.lower():
                try:
                    dates = pd.to_datetime(df[col], errors="coerce").dropna()
                    if not dates.empty:
                        date_cols.append(col)
                        date_range = f"{dates.min().strftime('%Y-%m-%d')} to {dates.max().strftime('%Y-%m-%d')}"
                        break
                except Exception:
                    pass

        missing_counts = df.isnull().sum().to_dict()
        missing_summary = {col: int(count) for col, count in missing_counts.items() if count > 0}
        
        is_training_data = "posted_rate" in df.columns
        if is_training_data:
            ml_recommendation = "This dataset contains a target variable (`posted_rate`). It is suitable for **Regression** tasks. Recommended models: LightGBM, XGBoost, or Random Forest."
        elif "load_id" in df.columns or len(df) > 1000:
            ml_recommendation = "This appears to be an **Inference/Prediction** dataset. Ensure it is joined with trained model artifacts to generate predictions. No target variable detected."
        else:
            ml_recommendation = "Dataset structure detected. Ensure it contains the required features for your ML pipeline."

        numeric_summary = {}
        for col in num_cols[:3]:
            numeric_summary[col] = {
                "mean": round(float(df[col].mean()), 2) if not df[col].isna().all() else None,
                "min": round(float(df[col].min()), 2) if not df[col].isna().all() else None,
                "max": round(float(df[col].max()), 2) if not df[col].isna().all() else None
            }

        return {
            "filename": safe_filename,
            "format": file_ext.replace('.', '').upper(),
            "total_rows": total_rows,
            "total_columns": len(df.columns),
            "numeric_columns": num_cols[:10],
            "categorical_columns": cat_cols[:10],
            "date_columns": date_cols,
            "date_range": date_range,
            "missing_values": missing_summary,
            "numeric_summary": numeric_summary,
            "is_training_data": is_training_data,
            "ml_recommendation": ml_recommendation,
            "columns": list(df.columns)[:20]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to inspect file: {str(e)}")
