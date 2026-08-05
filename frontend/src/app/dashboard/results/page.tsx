"use client";

import { useState, useEffect } from "react";
import { Download, FileText, BarChart3, CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8001";

export default function ResultsPage() {
  const [results, setResults] = useState({ predictions_ready: false, chart_ready: false, log_ready: false });
  const [logs, setLogs] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<"predictions" | "chart" | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ml/results`);
      const data = await res.json();
      setResults(data);

      if (data.log_ready) {
        const logRes = await fetch(`${API_BASE_URL}/ml/logs`);
        const logData = await logRes.json();
        setLogs(logData.log);
      }
    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // Poll every 5 seconds in case the user arrives while the pipeline is still running
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (type: "predictions" | "chart") => {
    setDownloading(type);
    try {
      const endpoint = type === "predictions" ? "predictions" : "chart";
      const filename = type === "predictions" ? "validation_predictions.csv" : "candidate_december.png";
      
      const response = await fetch(`${API_BASE_URL}/ml/download/${endpoint}`);
      if (!response.ok) throw new Error("File not ready");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Failed to download ${type}. Ensure the pipeline/scorer has completed.`);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-600">Checking pipeline outputs...</p>
      </div>
    );
  }

  if (!results.predictions_ready && !results.chart_ready) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Results & Deliverables</h1>
          <button onClick={fetchResults} className="flex items-center text-sm text-blue-600 hover:underline">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh Status
          </button>
        </div>
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Results Generated Yet</h2>
          <p className="text-slate-600 mb-6">
            Please return to the <a href="/dashboard" className="text-blue-600 hover:underline font-medium">Pipeline Wizard</a>, 
            select your files, and execute the ML Pipeline and Scorer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Results & Deliverables</h1>
          <p className="text-slate-500 mt-1">Generated artifacts from the completed ML pipeline and official scorer.</p>
        </div>
        <button onClick={fetchResults} className="flex items-center text-sm text-blue-600 hover:underline">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </button>
      </div>

      {/* Artifacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Predictions CSV Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Validation Predictions</h3>
              <p className="text-xs text-slate-500">12,000 predicted freight rates</p>
            </div>
          </div>
          {results.predictions_ready ? (
            <button
              onClick={() => handleDownload("predictions")}
              disabled={downloading === "predictions"}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition"
            >
              {downloading === "predictions" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download CSV
            </button>
          ) : (
            <div className="flex items-center text-amber-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
              <AlertCircle className="w-4 h-4 mr-2" /> Pending pipeline completion
            </div>
          )}
        </div>

        {/* December Chart Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">December Rate Chart</h3>
              <p className="text-xs text-slate-500">31-day fixed route visualization</p>
            </div>
          </div>
          {results.chart_ready ? (
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                <img 
                  src={`${API_BASE_URL}/ml/download/chart`} 
                  alt="December Predictions Chart" 
                  className="max-w-full h-auto max-h-48 object-contain"
                />
              </div>
              <button
                onClick={() => handleDownload("chart")}
                disabled={downloading === "chart"}
                className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition"
              >
                {downloading === "chart" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download PNG Chart
              </button>
            </div>
          ) : (
            <div className="flex items-center text-amber-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
              <AlertCircle className="w-4 h-4 mr-2" /> Pending scorer completion
            </div>
          )}
        </div>
      </div>

      {/* Scorer Logs */}
      {results.log_ready && logs && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-slate-900">Official Scorer Validation Log</h3>
          </div>
          <div className="p-6">
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              {logs}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
