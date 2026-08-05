"use client";
import { useRouter } from "next/navigation";
import { Cpu, LogIn, User, FileText, Heart, AlertTriangle, CheckCircle, Layers, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-12 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Spotter ML</span>
        </div>

        <div className="flex items-center space-x-6">
          <button 
            onClick={() => router.push('/login')}
            className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 font-medium transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button 
            onClick={() => router.push('/about-dev')}
            className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 font-medium transition"
          >
            <User className="w-4 h-4" />
            <span>About Developer</span>
          </button>
          <button 
            onClick={() => router.push('/license')}
            className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 font-medium transition"
          >
            <FileText className="w-4 h-4" />
            <span>License</span>
          </button>
          <button 
            onClick={() => router.push('/donate')}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold transition bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
          >
            <Heart className="w-4 h-4" />
            <span>Sponsor</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-6 lg:px-12 py-12 max-w-7xl mx-auto w-full space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Universal ML Platform
          </h1>
          <p className="text-2xl text-blue-600 font-medium">
            Bring Your Own Data. Build Your Own Future.
          </p>
        </div>

        {/* Executive Summary */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Executive Summary</h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-4xl">
            The Spotter Universal ML Platform is a domain-agnostic, enterprise-grade data science workbench designed to orchestrate the entire machine learning lifecycle. Rather than being a rigid, single-purpose script, Spotter provides a robust, modular infrastructure that allows data scientists, ML engineers, and business analysts to upload data, validate schemas, execute background training pipelines, evaluate model performance, and manage system configurations through a polished, intuitive, and secure web interface.
          </p>
        </section>

        {/* The Problem We Solve & The Spotter Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-3 text-amber-500" /> The Problem We Solve
            </h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 rounded-full bg-red-500 mr-3 flex-shrink-0"></span>
                <span><strong className="text-slate-900">Data Leakage Risks:</strong> Manual file handling often mixes training and inference data.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 rounded-full bg-red-500 mr-3 flex-shrink-0"></span>
                <span><strong className="text-slate-900">Opaque Pipelines:</strong> Background training processes are "black boxes" with no real-time visibility.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 rounded-full bg-red-500 mr-3 flex-shrink-0"></span>
                <span><strong className="text-slate-900">High Friction:</strong> Non-technical users cannot easily validate data or retrieve model artifacts.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-3 text-emerald-500" /> The Spotter Solution
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Spotter bridges the gap between complex ML engineering and intuitive user experience. It operates on a <span className="text-slate-900 font-semibold">"Bring Your Own Data, Bring Your Own Model"</span> philosophy. The platform provides the orchestration, validation, and visualization; your custom scripts dictate the domain logic.
            </p>
          </section>
        </div>

        {/* Core Capabilities */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <Layers className="w-6 h-6 mr-3 text-purple-500" /> Core Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                <Cpu className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Smart Auto-Schema Detection</h3>
                <p className="text-sm text-slate-600">The File Manager reads headers and automatically deduces file roles.</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-amber-100 rounded-lg mr-4 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Guided, Lock-Step Pipeline Wizard</h3>
                <p className="text-sm text-slate-600">A visual stepper that prevents user error by locking subsequent steps.</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-emerald-100 rounded-lg mr-4 flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Dynamic Insights Dashboard</h3>
                <p className="text-sm text-slate-600">Zero hardcoded metrics. The UI dynamically parses generated metrics.</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-purple-100 rounded-lg mr-4 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Enterprise-Grade Security</h3>
                <p className="text-sm text-slate-600">Secure authentication, role-based access control, and robust backend protection.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who Is This For? */}
        <section className="space-y-6 pb-8">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <User className="w-6 h-6 mr-3 text-pink-500" /> Who Is This For?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Data Scientists</h3>
              <p className="text-sm text-blue-800">To rapidly prototype, validate, and track model training without building custom UIs.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-2">ML Engineers</h3>
              <p className="text-sm text-purple-800">As a foundational, production-ready template for deploying internal ML tools.</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="font-semibold text-emerald-900 mb-2">Business Analysts</h3>
              <p className="text-sm text-emerald-800">To safely upload inference data and view dynamic performance insights without writing code.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
