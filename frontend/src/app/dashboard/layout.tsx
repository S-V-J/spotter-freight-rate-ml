"use client";

import { Truck, LayoutDashboard, Folder, BarChart3, Award, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSuperuser, handleLogout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Truck className="w-6 h-6 text-blue-600 mr-2" />
                <span className="font-bold text-xl text-slate-900">Spotter ML</span>
              </div>
              
              {/* Updated: Changed space-x-6 to gap-[0.5cm] for exact 0.5cm spacing */}
              <nav className="flex items-center gap-[0.5cm]">
                <Link href="/dashboard" className="px-2 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition flex items-center">
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Dashboard
                </Link>
                <Link href="/dashboard/files" className="px-2 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition flex items-center">
                  <Folder className="w-4 h-4 mr-1.5" />
                  Files
                </Link>
                <Link href="/dashboard/insights" className="px-2 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1.5" />
                  Insights
                </Link>
                <Link href="/dashboard/results" className="px-2 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition flex items-center">
                  <Award className="w-4 h-4 mr-1.5" />
                  Results
                </Link>
                <Link href="/dashboard/account" className="px-2 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition flex items-center">
                  <User className="w-4 h-4 mr-1.5" />
                  Account
                </Link>
                {isSuperuser && (
                  <Link href="/dashboard/settings" className="px-2 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition flex items-center">
                    <Settings className="w-4 h-4 mr-1.5" />
                    Settings
                  </Link>
                )}
              </nav>

              <div className="flex items-center">
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition flex items-center"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
