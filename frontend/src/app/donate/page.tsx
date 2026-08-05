"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Code, Coffee, Star, ShieldCheck } from "lucide-react";

export default function DonatePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition font-medium px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <span className="text-sm font-semibold text-slate-500">Support the Project</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-pink-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">Support Open-Source Engineering</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The Spotter Universal ML Platform is 100% free and open-source. Your support helps fund cloud credits, GPU resources for AI training, and the production of the "Zero to Hero" educational course.
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GitHub Sponsors */}
          <a 
            href="https://github.com/sponsors/S-V-J" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:border-pink-300 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">GitHub Sponsors</h3>
            <p className="text-sm text-slate-600 mb-4">Recurring or one-time support directly through GitHub. Best for developers.</p>
            <span className="mt-auto px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg group-hover:bg-pink-600 transition-colors">
              Sponsor on GitHub
            </span>
          </a>

          {/* Buy Me a Coffee */}
          <a 
            href="https://www.buymeacoffee.com/sidkumar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:border-yellow-300 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Coffee className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Buy Me a Coffee</h3>
            <p className="text-sm text-slate-600 mb-4">A quick, one-time contribution to say thanks and keep the caffeine flowing.</p>
            <span className="mt-auto px-4 py-2 bg-yellow-400 text-slate-900 text-sm font-medium rounded-lg group-hover:bg-yellow-500 transition-colors">
              Buy a Coffee
            </span>
          </a>

          {/* Ko-fi */}
          <a 
            href="https://ko-fi.com/sidkumar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ko-fi</h3>
            <p className="text-sm text-slate-600 mb-4">Support the project with zero fees. Every bit helps maintain the infrastructure.</p>
            <span className="mt-auto px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg group-hover:bg-blue-600 transition-colors">
              Support on Ko-fi
            </span>
          </a>
        </div>

        {/* Why Sponsor Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
            <ShieldCheck className="w-6 h-6 mr-2" />
            Where Your Support Goes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Infrastructure & Cloud</h4>
              <p className="text-sm text-blue-800">Funding VoIP lab servers (Asterisk/Kamailio clusters) and GPU credits for AI model training and evaluation.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Open-Source Education</h4>
              <p className="text-sm text-blue-800">Maintaining production quality for the "Zero to Hero" course, keeping all code, tutorials, and guides 100% free and MIT-licensed.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Security & Testing</h4>
              <p className="text-sm text-blue-800">Running SAST/DAST scans, VoIP pentesting, and dependency scanning to ensure enterprise-grade security.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Community Building</h4>
              <p className="text-sm text-blue-800">Supporting Discord community management, scholarships, and regional translations for global accessibility.</p>
            </div>
          </div>
        </div>

        {/* GitHub Sponsor Embed */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Or sponsor directly via GitHub:</h3>
          <div className="flex justify-center">
            <iframe 
              src="https://github.com/sponsors/S-V-J/button" 
              title="Sponsor S-V-J" 
              height="32" 
              width="114" 
              style={{ border: 0, borderRadius: '6px' }}
            ></iframe>
          </div>
          <p className="text-sm text-slate-500">
            Even a small contribution (e.g., $2) or a ⭐ star on the repository is highly appreciated. Thank you for believing in practical, open-source engineering!
          </p>
        </div>

      </main>
    </div>
  );
}
