// Hardcoded to 127.0.0.1 to avoid localhost resolution quirks in Windows/WSL
const API_BASE_URL = "http://127.0.0.1:8001";

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("is_superuser", data.is_superuser.toString());
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("is_superuser");
}

export async function listFiles() {
  const response = await fetch(`${API_BASE_URL}/files/list`);
  if (!response.ok) throw new Error("Failed to list files");
  return response.json();
}

export async function uploadFile(file: File, category: string) {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_BASE_URL}/files/upload?category=${category}`, {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) throw new Error("Upload failed");
  return response.json();
}

export async function renameFile(oldName: string, newName: string) {
  const response = await fetch(`${API_BASE_URL}/files/rename`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ old_name: oldName, new_name: newName }),
  });
  
  if (!response.ok) throw new Error("Rename failed");
  return response.json();
}

export async function deleteFile(filename: string) {
  const response = await fetch(`${API_BASE_URL}/files/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Delete failed" }));
    throw new Error(errorData.detail || "Delete failed");
  }
  return response.json();
}

export async function downloadFile(filename: string) {
  const response = await fetch(`${API_BASE_URL}/files/download/${encodeURIComponent(filename)}`);
  if (!response.ok) throw new Error("Download failed");
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function runPipeline(train: string, validation: string, template: string, december: string) {
  const response = await fetch(`${API_BASE_URL}/ml/run-pipeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      train_file: train,
      validation_file: validation,
      template_file: template,
      december_file: december,
    }),
  });
  
  if (!response.ok) throw new Error("Pipeline execution failed");
  return response.json();
}

export async function runScorer(predictions: string, december: string) {
  const response = await fetch(`${API_BASE_URL}/ml/run-scorer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      predictions_file: predictions,
      december_file: december,
    }),
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Scorer failed" }));
    throw new Error(err.detail);
  }
  return response.json();
}
