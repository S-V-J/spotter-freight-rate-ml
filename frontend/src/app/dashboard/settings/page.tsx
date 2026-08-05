"use client";

import { useState } from "react";
import { Settings, Database, Cpu, Save, CheckCircle, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Mock API call
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500 mt-1">Superuser controls for system paths and ML hyperparameters.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* System Paths */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
            <Database className="w-5 h-5 text-slate-600 mr-2" />
            <h3 className="font-semibold text-slate-900">Storage Paths</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Upload Directory</label>
              <input type="text" defaultValue="/app/uploads" className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-500" readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Output Directory</label>
              <input type="text" defaultValue="/app/outputs" className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-500" readOnly />
            </div>
          </div>
        </div>

        {/* ML Hyperparameters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
            <Cpu className="w-5 h-5 text-slate-600 mr-2" />
            <h3 className="font-semibold text-slate-900">ML Hyperparameters (LightGBM)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Max Depth</label>
                <input type="number" defaultValue={8} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Num Leaves</label>
                <input type="number" defaultValue={63} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Learning Rate</label>
                <input type="number" step="0.01" defaultValue={0.05} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">N Estimators</label>
                <input type="number" defaultValue={500} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>Changing hyperparameters requires retraining the model. Ensure you have sufficient compute resources before applying changes.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-lg font-medium flex items-center transition shadow-sm">
            {saving ? "Saving..." : "Save System Settings"} <Save className="w-4 h-4 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}
