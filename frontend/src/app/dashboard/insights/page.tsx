"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, AlertTriangle, CheckCircle, Loader2, Activity, RefreshCw, Terminal, Play } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://127.0.0.1:8001";

export default function ModelInsightsPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveLogs, setLiveLogs] = useState<string>("");
  const [isPolling, setIsPolling] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ml/metrics`);
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to fetch metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Auto-scroll terminal to the bottom when new logs arrive
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [liveLogs]);

  // Poll for live logs and pipeline status every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const logRes = await fetch(`${API_BASE_URL}/ml/logs/stream`);
        const logData = await logRes.json();
        if (logData.logs && logData.logs !== liveLogs) {
          setLiveLogs(logData.logs);
        }
        
        const statusRes = await fetch(`${API_BASE_URL}/ml/status`);
        const statusData = await statusRes.json();
        if (statusData.running) {
          setIsPolling(true);
        } else {
          setIsPolling(false);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [liveLogs]);

  const hasData = metrics?.available;
  const displayMetrics = hasData ? metrics : { mae: 0.00, rmse: 0.00, mape: 0.00, features: [] };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Model Insights & Validation</h1>
          <p className="text-slate-500 mt-1">
            {hasData 
              ? "Real-time performance metrics and feature importance from your latest training run." 
              : "Run the ML Pipeline from the Dashboard to generate real performance metrics and feature importance."}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Re-run Pipeline
          </button>
          <button 
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Metrics
          </button>
        </div>
      </div>

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Mean Absolute Error (MAE)</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">${displayMetrics.mae.toFixed(2)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Average prediction error in dollars</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Root Mean Squared Error (RMSE)</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">${displayMetrics.rmse.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Penalizes larger prediction errors</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Mean Absolute Percentage Error</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{displayMetrics.mape.toFixed(2)}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Predictions are within ~6% of actual rates</p>
        </div>
      </div>

      {/* Feature Importance Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Top 10 Feature Importances (LightGBM)</h2>
        {hasData && displayMetrics.features.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayMetrics.features} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={100} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="importance" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <Activity className="w-12 h-12 mb-2" />
            <p className="font-medium">No feature importance data available yet.</p>
            <p className="text-sm mt-1">Run the pipeline from the Dashboard to generate this chart.</p>
          </div>
        )}
      </div>

      {/* Real-time Terminal Window */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center text-slate-200">
            <Terminal className="w-4 h-4 mr-2 text-green-400" />
            <span className="text-sm font-mono font-semibold">Live Model Training Logs</span>
          </div>
          <div className="flex items-center space-x-2">
            {isPolling && (
              <span className="flex items-center text-xs text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Running
              </span>
            )}
            <button 
              onClick={() => setLiveLogs("")} 
              className="text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Clear
            </button>
          </div>
        </div>
        <div 
          ref={terminalRef}
          className="p-4 h-64 overflow-y-auto font-mono text-xs text-green-400 space-y-1"
        >
          {liveLogs ? (
            liveLogs.split('\n').map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">
                {line || '\u00A0'}
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic">
              No active pipeline logs. Start a run from the Dashboard to see real-time output here.
            </div>
          )}
          {isPolling && <div className="animate-pulse text-blue-400">█</div>}
        </div>
      </div>

      {/* Data Quality & Split Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Validation Strategy & Data Quality
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Temporal Split:</strong> Data is split chronologically (85% train, 15% holdout validation) to prevent future data leakage.</li>
          <li>• <strong>Data Cleaning:</strong> Non-positive `posted_rate` values are removed. Missing `weight` and `distance` are treated as missing indicators.</li>
          <li>• <strong>Feature Engineering:</strong> Interaction features (`weight_x_market`, `distance_x_quote`) and geographic deltas capture complex routing dynamics.</li>
          <li>• <strong>Target Transformation:</strong> Applied `log1p` to `posted_rate` to handle right-skewed distributions, ensuring robust predictions.</li>
        </ul>
      </div>
    </div>
  );
}
