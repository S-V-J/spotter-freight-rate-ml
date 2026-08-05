"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Upload, Download, Edit2, FileText, Image as ImageIcon, RefreshCw, 
  Eye, AlertTriangle, CheckCircle, Info, Trash2, Loader2, UploadCloud, BarChart3
} from "lucide-react";
import { listFiles, uploadFile, renameFile, downloadFile, deleteFile } from "@/lib/api";

const API_BASE_URL = "http://127.0.0.1:8001";

export default function FileManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [renameModal, setRenameModal] = useState<{ open: boolean; file: any }>({ open: false, file: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; file: any }>({ open: false, file: null });
  const [newName, setNewName] = useState("");
  
  // Inline Inspector State
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [inspectionData, setInspectionData] = useState<Record<string, any>>({});
  const [inspecting, setInspecting] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listFiles();
      setFiles(data);
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUploadFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadFile(file, "upload");
      await fetchFiles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUploadFile(file);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleUploadFile(file);
  };

  const handleRename = async () => {
    if (!renameModal.file || !newName) return;
    try {
      await renameFile(renameModal.file.name, newName);
      setRenameModal({ open: false, file: null });
      setNewName("");
      await fetchFiles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.file) return;
    try {
      await deleteFile(deleteModal.file.name);
      setDeleteModal({ open: false, file: null });
      await fetchFiles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleInspect = async (filename: string) => {
    if (expandedFile === filename) {
      setExpandedFile(null); // Collapse
    } else {
      setExpandedFile(filename); // Expand
      if (!inspectionData[filename]) {
        setInspecting(filename);
        try {
          const response = await fetch(`${API_BASE_URL}/files/inspect?filename=${encodeURIComponent(filename)}`);
          if (!response.ok) throw new Error("Failed to inspect file");
          const data = await response.json();
          setInspectionData(prev => ({ ...prev, [filename]: data }));
        } catch (err) {
          console.error("Inspection failed", err);
          setInspectionData(prev => ({ ...prev, [filename]: { error: true } }));
        } finally {
          setInspecting(null);
        }
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Smart File Manager</h1>
        <button onClick={fetchFiles} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition" title="Refresh">
          <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <input type="file" id="file-upload" className="hidden" onChange={handleFileInputChange} disabled={uploading} />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          {uploading ? <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" /> : <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />}
          <p className="text-sm font-medium text-slate-700">{uploading ? "Uploading..." : "Drag and drop your file here, or click to browse"}</p>
          <p className="text-xs text-slate-500 mt-1">Supports CSV, JSON, and Excel formats</p>
        </label>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (<div key={i} className="flex items-center space-x-4 animate-pulse"><div className="h-10 w-10 bg-slate-200 rounded-full"></div><div className="flex-1 space-y-2"><div className="h-4 bg-slate-200 rounded w-1/3"></div><div className="h-3 bg-slate-200 rounded w-1/4"></div></div><div className="h-8 w-24 bg-slate-200 rounded"></div></div>))}
          </div>
        ) : files.length === 0 ? (
          <div className="p-8 text-center text-slate-500"><FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>No files found. Upload a file to get started.</p></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-slate-700">Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-slate-700">Category</th>
                <th className="px-6 py-3 text-sm font-semibold text-slate-700">Size</th>
                <th className="px-6 py-3 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.map((file: any) => {
                const isExpanded = expandedFile === file.name;
                const data = inspectionData[file.name];
                const isLoading = inspecting === file.name;

                return (
                  <>
                    <tr key={file.name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 flex items-center">
                        {file.name.endsWith('.png') ? <ImageIcon className="w-4 h-4 mr-2 text-purple-500"/> : <FileText className="w-4 h-4 mr-2 text-blue-500"/>}
                        <span className="font-medium text-slate-900">{file.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{file.category}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{(file.size / 1024).toFixed(2)} KB</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button 
                          onClick={() => toggleInspect(file.name)} 
                          className={`p-1.5 rounded transition ${isExpanded ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 text-blue-600'}`} 
                          title={isExpanded ? "Collapse Details" : "Inspect Data"}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => downloadFile(file.name)} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition" title="Download"><Download className="w-4 h-4" /></button>
                        <button onClick={() => { setRenameModal({ open: true, file }); setNewName(file.name); }} className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition" title="Rename"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteModal({ open: true, file })} className="p-1.5 hover:bg-red-100 rounded text-red-600 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                    
                    {/* Inline Expanding Inspector Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={4} className="px-6 py-6 bg-slate-50 border-b border-slate-200 shadow-inner">
                          {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                              <Loader2 className="w-6 h-6 animate-spin mb-2" />
                              <p className="text-sm">Analyzing dataset structure...</p>
                            </div>
                          ) : data?.error ? (
                            <div className="text-red-600 text-sm flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Failed to inspect file. Ensure it is a valid format.</div>
                          ) : data ? (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column: File Info & ML Rec */}
                                <div className="lg:col-span-2 space-y-4">
                                  <div>
                                    <h4 className="text-lg font-semibold text-slate-900">{data.filename}</h4>
                                    <p className="text-xs text-slate-500 font-mono mt-1">Format: {data.format} • {data.total_rows?.toLocaleString()} rows • {data.total_columns} columns</p>
                                  </div>
                                  
                                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                    <p className="text-sm font-semibold text-indigo-900 mb-1 flex items-center"><BarChart3 className="w-4 h-4 mr-1" /> ML Recommendation</p>
                                    <p className="text-sm text-indigo-800 leading-relaxed mb-3">{data.ml_recommendation}</p>
                                    <div className="mt-3 pt-3 border-t border-indigo-200">
                                      <p className="text-xs font-semibold text-indigo-700 mb-2">Recommended Pipeline Step:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {data.is_training_data && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium border border-green-200">1. Training Data</span>}
                                        {!data.is_training_data && data.columns.includes("load_id") && !data.columns.includes("posted_rate") && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium border border-blue-200">2. Validation Data</span>}
                                        {data.columns.includes("load_id") && !data.columns.includes("posted_rate") && !data.columns.includes("distance") && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md font-medium border border-purple-200">3. Prediction Template</span>}
                                        {data.columns.includes("date") && data.columns.includes("pickup") && <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-md font-medium border border-amber-200">4. Chart Inputs</span>}
                                        {!data.is_training_data && !data.columns.includes("load_id") && !data.columns.includes("date") && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium border border-slate-200">Unrecognized Schema</span>}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Column: Stats & Missing Values */}
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                                      <p className="text-xs font-semibold text-slate-500">Total Rows</p>
                                      <p className="text-xl font-bold text-slate-900">{data.total_rows?.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                                      <p className="text-xs font-semibold text-slate-500">Total Columns</p>
                                      <p className="text-xl font-bold text-slate-900">{data.total_columns}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                                    <p className="text-xs font-semibold text-slate-500 mb-2">Date Range</p>
                                    <p className="text-sm text-slate-900 font-mono bg-slate-50 p-2 rounded">{data.date_range}</p>
                                  </div>

                                  {Object.keys(data.missing_values || {}).length > 0 && (
                                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                                      <p className="text-xs font-semibold text-amber-700 flex items-center mb-2"><AlertTriangle className="w-3 h-3 mr-1" /> Missing Values</p>
                                      <ul className="text-xs text-slate-600 space-y-1 max-h-32 overflow-y-auto pr-1">
                                        {Object.entries(data.missing_values).map(([col, count]: [string, any]) => (
                                          <li key={col} className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                                            <span className="font-mono">{col}</span>
                                            <span className="font-semibold text-amber-600">{count}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Bottom: Numeric Summary */}
                              {data.numeric_summary && Object.keys(data.numeric_summary).length > 0 && (
                                <div className="border-t border-slate-200 pt-4">
                                  <p className="text-sm font-semibold text-slate-700 mb-3">Numeric Column Stats (Sample)</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {Object.entries(data.numeric_summary).map(([col, stats]: [string, any]) => (
                                      <div key={col} className="bg-white p-3 rounded border border-slate-200">
                                        <p className="font-semibold text-slate-700 mb-2 text-sm">{col}</p>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                          <div>
                                            <p className="text-[10px] text-slate-500 uppercase">Min</p>
                                            <p className="text-xs font-mono font-medium text-slate-900">{stats.min?.toLocaleString() || 'N/A'}</p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] text-slate-500 uppercase">Mean</p>
                                            <p className="text-xs font-mono font-medium text-slate-900">{stats.mean?.toLocaleString() || 'N/A'}</p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] text-slate-500 uppercase">Max</p>
                                            <p className="text-xs font-mono font-medium text-slate-900">{stats.max?.toLocaleString() || 'N/A'}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Rename Modal */}
      {renameModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 border border-slate-200">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Rename File</h3>
            <input className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter new filename" />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setRenameModal({ open: false, file: null })} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
              <button onClick={handleRename} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 border border-slate-200">
            <div className="flex items-center mb-4 text-red-600"><AlertTriangle className="w-6 h-6 mr-2" /><h3 className="text-lg font-bold">Delete File?</h3></div>
            <p className="text-slate-600 mb-6">Are you sure you want to delete <span className="font-semibold text-slate-900">"{deleteModal.file?.name}"</span>? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setDeleteModal({ open: false, file: null })} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
