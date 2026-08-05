"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";

export default function LicensePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="p-6 lg:p-8">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 lg:p-12 space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Software License</h1>
              <p className="text-slate-500">MIT License</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed">
              Copyright (c) 2026 Spotter ML Platform
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
            </p>
            <p className="text-slate-600 leading-relaxed mt-4 font-semibold">
              The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
            <span>This platform is built with enterprise-grade security and compliance in mind.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
