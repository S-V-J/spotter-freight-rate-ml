"use client";

import { useState, useEffect, useRef } from "react";
import { Play, FileText, CheckCircle, AlertTriangle, Loader2, Lock, ChevronRight, RefreshCw } from "lucide-react";
import { listFiles, runPipeline, runScorer } from "@/lib/api";

const API_BASE_URL = "http://127.0.0.1:8001";

type ValidationStatus = "idle" | "validating" | "valid" | "invalid";

interface StepBase {
  step: number;
  title: string;
  description: string;
  requiredCondition: (data: any) => boolean;
  successMessage: string;
  errorMessage: string;
}

interface StepData extends StepBase {
  selectedFile: string;
  status: ValidationStatus;
  message: string;
}

interface StoredStep {
  selectedFile: string;
  status: ValidationStatus;
  message: string;
}

const INITIAL_STEPS: StepBase[] = [
  { step: 1, title: "1. Training Data", description: "Select the labeled training dataset (e.g., train_test.csv).", requiredCondition: (data: any) => data.is_training_data === true, successMessage: "Validated: Target variable (`posted_rate`) detected.", errorMessage: "Schema Mismatch: Missing `posted_rate` column. This must be training data." },
  { step: 2, title: "2. Validation Data", description: "Select the unlabeled validation dataset (e.g., validation.csv).", requiredCondition: (data: any) => data.is_training_data === false && data.columns.includes("load_id"), successMessage: "Validated: Inference data with `load_id` detected. No data leakage.", errorMessage: "Schema Mismatch: Must contain `load_id` and NO `posted_rate` column." },
  { step: 3, title: "3. Prediction Template", description: "Select the template to format the final predictions.", requiredCondition: (data: any) => data.columns.includes("load_id"), successMessage: "Validated: Template contains required `load_id` column.", errorMessage: "Schema Mismatch: Missing `load_id` column." },
  { step: 4, title: "4. Chart Inputs", description: "Select the fixed route inputs for chart generation.", requiredCondition: (data: any) => data.columns.includes("date") && data.columns.includes("pickup"), successMessage: "Validated: Chart route data detected.", errorMessage: "Schema Mismatch: Missing `date` or `pickup` columns." }
];

export default function PipelineWizard() {
  const [files, setFiles] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [liveLogs, setLiveLogs] = useState<string>("");
  const [isPolling, setIsPolling] = useState(false);
  const [scorerResult, setScorerResult] = useState<any>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const [steps, setSteps] = useState<StepData[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("pipeline_steps");
      if (stored) {
        try {
          const parsed: StoredStep[] = JSON.parse(stored);
          return INITIAL_STEPS.map((base, idx) => {
            const saved = parsed[idx];
            const status = saved?.status === "validating" ? "idle" : (saved?.status || "idle");
            const message = status === "idle" ? "" : (saved?.message || "");
            return { ...base, selectedFile: saved?.selectedFile || "", status, message };
          });
        } catch (e) { console.error("Failed to parse stored steps", e); }
      }
    }
    return INITIAL_STEPS.map(base => ({ ...base, selectedFile: "", status: "idle", message: "" }));
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const toStore: StoredStep[] = steps.map(({ selectedFile, status, message }) => ({ selectedFile, status, message }));
      sessionStorage.setItem("pipeline_steps", JSON.stringify(toStore));
    }
  }, [steps]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [liveLogs]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await listFiles();
        const csvFiles = data.filter((f: any) => f.name.toLowerCase().endsWith('.csv'));
        setFiles(csvFiles);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, []);

  const getFilesForStep = (stepIndex: number) => {
    if (stepIndex === 0) return files.filter((f: any) => f.recommended_step === "Training Data");
    if (stepIndex === 1) return files.filter((f: any) => f.recommended_step === "Validation/Template" || f.recommended_step === "Validation Data");
    if (stepIndex === 2) return files.filter((f: any) => f.recommended_step === "Validation/Template" || f.recommended_step === "Prediction Template");
    if (stepIndex === 3) return files.filter((f: any) => f.recommended_step === "Chart Inputs");
    return files;
  };

  const validateFile = async (stepIndex: number, filename: string) => {
    if (!filename) {
      setSteps(prev => prev.map((step, idx) => idx === stepIndex ? { ...step, selectedFile: "", status: "idle", message: "" } : step));
      return;
    }
    setSteps(prev => prev.map((step, idx) => idx === stepIndex ? { ...step, selectedFile: filename, status: "validating", message: "Inspecting schema..." } : step));
    try {
      const response = await fetch(`${API_BASE_URL}/files/inspect?filename=${encodeURIComponent(filename)}`);
      if (!response.ok) throw new Error("Failed to inspect");
      const data = await response.json();
      setSteps(prev => prev.map((step, idx) => {
        if (idx === stepIndex) {
          const isValid = step.requiredCondition(data);
          return { ...step, status: isValid ? "valid" : "invalid", message: isValid ? step.successMessage : step.errorMessage };
        }
        return step;
      }));
    } catch (err) {
      console.error("Validation error:", err);
      setSteps(prev => prev.map((step, idx) => idx === stepIndex ? { ...step, status: "invalid", message: "Error inspecting file. Ensure it is a valid CSV." } : step));
    }
  };

  const isStepLocked = (stepIndex: number) => {
    if (stepIndex === 0) return false;
    return steps[stepIndex - 1].status !== "valid";
  };

  const allStepsValid = steps.every(s => s.status === "valid");

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setLiveLogs("");
    setIsPolling(true);
    
    try {
      await runPipeline(steps[0].selectedFile, steps[1].selectedFile, steps[2].selectedFile, steps[3].selectedFile);
      
      const interval = setInterval(async () => {
        try {
          const logRes = await fetch(`${API_BASE_URL}/ml/logs/stream`);
          const logData = await logRes.json();
          setLiveLogs(logData.logs);
          
          const statusRes = await fetch(`${API_BASE_URL}/ml/status`);
          const statusData = await statusRes.json();
          
          if (!statusData.running && logData.logs.includes("Pipeline complete")) {
            clearInterval(interval);
            setIsPolling(false);
            setIsRunning(false);
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 1000);
      
    } catch (err: any) {
      setLiveLogs(`❌ Error: ${err.message}`);
      setIsRunning(false);
      setIsPolling(false);
    }
  };

  const handleRunScorer = async () => {
    setIsRunning(true);
    setLiveLogs(prev => prev + "\n>>> Running official Spotter scorer...\n");
    try {
      const res = await runScorer("validation_predictions.csv", "december_chart_inputs.csv");
      setLiveLogs(prev => prev + ">>> ✅ Scorer completed successfully!\n");
      setScorerResult(res);
      setIsRunning(false);
    } catch (err: any) {
      setLiveLogs(prev => prev + `>>> ❌ Scorer Error: ${err.message}\n`);
      setIsRunning(false);
    }
  };

  const clearPipelineState = () => {
    if (typeof window !== "undefined") sessionStorage.removeItem("pipeline_steps");
    setSteps(INITIAL_STEPS.map(base => ({ ...base, selectedFile: "", status: "idle", message: "" })));
    setLiveLogs("");
    setScorerResult(null);
  };

  if (scorerResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Pipeline Results & Scoring</h1>
          <button onClick={clearPipelineState} className="text-blue-600 hover:underline text-sm flex items-center">← Back to Pipeline Setup</button>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-slate-900">Generated Outputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <FileText className="w-8 h-8 text-blue-500 mr-3" />
              <div><p className="font-semibold text-slate-900">validation_predictions.csv</p><p className="text-xs text-slate-500">12,000 predicted rates</p></div>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <FileText className="w-8 h-8 text-blue-500 mr-3" />
              <div><p className="font-semibold text-slate-900">december_chart_inputs.csv</p><p className="text-xs text-slate-500">31 December predictions</p></div>
            </div>
          </div>
          <button onClick={handleRunScorer} disabled={isRunning} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center">
            {isRunning ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
            {isRunning ? "Running Scorer..." : "Run Official Scorer"}
          </button>
          {liveLogs && (
            <div ref={terminalRef} className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-xs h-48 overflow-y-auto shadow-inner border border-slate-700">
              {liveLogs.split('\n').map((line, i) => <div key={i} className="whitespace-pre-wrap leading-5">{line || '\u00A0'}</div>)}
            </div>
          )}
          {scorerResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-700 font-semibold mb-2"><CheckCircle className="w-5 h-5 mr-2" />Scorer Validation Passed</div>
              <pre className="text-sm text-green-800 whitespace-pre-wrap">{scorerResult.log}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ML Prediction Pipeline</h1>
          <p className="text-slate-500 mt-1">Select your pre-uploaded files to execute the training and prediction workflow.</p>
        </div>
        <button onClick={clearPipelineState} className="mb-1 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-red-600 transition flex items-center shadow-sm">
          <RefreshCw className="w-4 h-4 mr-2" /> Reset Pipeline
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((stepData, index) => {
          const locked = isStepLocked(index);
          const validFiles = getFilesForStep(index);
          return (
            <div key={stepData.step} className={`bg-white rounded-xl border transition-all duration-300 ${locked ? 'border-slate-200 opacity-75' : 'border-blue-200 shadow-sm'}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {locked ? (<div className="p-2 bg-slate-100 rounded-full"><Lock className="w-5 h-5 text-slate-400" /></div>) : stepData.status === "valid" ? (<div className="p-2 bg-green-100 rounded-full"><CheckCircle className="w-5 h-5 text-green-600" /></div>) : (<div className="p-2 bg-blue-100 rounded-full"><span className="text-blue-600 font-bold text-sm w-5 h-5 flex items-center justify-center">{stepData.step}</span></div>)}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{stepData.title}</h3>
                      <p className="text-sm text-slate-500">{stepData.description}</p>
                    </div>
                  </div>
                </div>
                {!locked && (
                  <div className="space-y-4 pl-14">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={stepData.selectedFile} onChange={(e) => validateFile(index, e.target.value)} disabled={stepData.status === "validating"}>
                          <option value="">-- Select an uploaded file --</option>
                          {validFiles.map((f: any) => (<option key={f.name} value={f.name}>{f.name}</option>))}
                        </select>
                        {validFiles.length === 0 && stepData.status === "idle" && (<p className="text-xs text-amber-600 mt-2 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> No valid files found for this step.</p>)}
                      </div>
                    </div>
                    {stepData.status !== "idle" && (
                      <div className={`flex items-center p-3 rounded-lg text-sm ${stepData.status === "validating" ? "bg-blue-50 text-blue-700 border border-blue-200" : stepData.status === "valid" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        {stepData.status === "validating" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {stepData.status === "valid" && <CheckCircle className="w-4 h-4 mr-2" />}
                        {stepData.status === "invalid" && <AlertTriangle className="w-4 h-4 mr-2" />}
                        {stepData.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button onClick={handleRunPipeline} disabled={!allStepsValid || isRunning} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center shadow-sm">
          {isRunning ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
          {isRunning ? "Starting Pipeline..." : "Execute Pipeline"}
        </button>
      </div>

      {liveLogs && (
        <div ref={terminalRef} className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-xs h-80 overflow-y-auto shadow-inner border border-slate-700">
          {liveLogs.split('\n').map((line, i) => (
            <div key={i} className="whitespace-pre-wrap leading-5">{line || '\u00A0'}</div>
          ))}
          {isPolling && <div className="animate-pulse text-blue-400">█</div>}
        </div>
      )}
      
      {liveLogs.includes("Pipeline complete") && !isPolling && (
        <div className="flex justify-end">
          <button onClick={() => window.location.href="/dashboard/results"} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center shadow-sm">
            View Results & Deliverables <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}
