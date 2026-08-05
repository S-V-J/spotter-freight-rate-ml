"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Cpu, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login: authLogin } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const data = await login(email, password);
      authLogin(data.access_token, data.is_superuser);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      {/* Back to Home Button */}
      <nav className="absolute top-0 left-0 p-6 lg:p-8 z-50">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </nav>

      {/* Main Login Form */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 lg:p-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-600/20 w-16 h-16 flex items-center justify-center mx-auto">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-slate-500 mt-1">Sign in to access your ML workbench.</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center animate-in fade-in slide-in-from-top-2"> 
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white" 
                placeholder="admin@spotter.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" /> 
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
