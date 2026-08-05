"use client";

import { useState } from "react";
import { User, Mail, Lock, Save, CheckCircle, MapPin } from "lucide-react";

export default function AccountPage() {
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
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile, email, and password.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Siddhant Kumar</h3>
              <p className="text-sm text-slate-500 flex items-center">
                Superuser <span className="mx-2">•</span> Full-Stack AI Developer
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center"><Mail className="w-4 h-4 mr-2" /> Email Address</label>
              <input type="email" defaultValue="stjl093@gmail.com" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location</label>
              <input type="text" defaultValue="Bihar, India" className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-500" readOnly />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center"><Lock className="w-4 h-4 mr-2" /> Change Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Current Password</label>
                <input type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">New Password</label>
                <input type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          {success ? (
            <span className="text-green-600 text-sm font-medium flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Settings saved successfully</span>
          ) : <span></span>}
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-medium flex items-center transition">
            {saving ? "Saving..." : "Save Changes"} <Save className="w-4 h-4 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}
