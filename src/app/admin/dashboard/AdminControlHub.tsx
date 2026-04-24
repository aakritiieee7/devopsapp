"use client";

import { useState } from "react";
import { Users, AlertTriangle, ShieldCheck, CheckSquare, LogOut, Layout, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import ApprovalsClient from "./ApprovalsClient";
import StudentDirectoryClient from "./StudentDirectoryClient";
import CourseEvalClient from "./CourseEvalClient";
import SystemTelemetryClient from "./SystemTelemetryClient";

export default function AdminControlHub({ 
  initialStudents, 
  initialMedicalDocs, 
  initialSubmissions 
}: { 
  initialStudents: any[], 
  initialMedicalDocs: any[], 
  initialSubmissions: any[] 
}) {
  const [activeTab, setActiveTab] = useState<'directory' | 'approvals' | 'coursework'>('directory');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 text-white flex flex-col h-screen sticky top-0 shadow-2xl border-r-2 border-indigo-900/30">
        <div className="p-6 border-b border-gray-800 bg-black/40">
          <div className="flex items-center gap-3 mb-1">
            <Layout className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-black tracking-widest uppercase text-white">Faculty</h2>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-3">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-3 px-5 py-4 font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'directory' 
              ? "bg-indigo-600 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]" 
              : "text-gray-400 hover:bg-gray-900 hover:text-white border border-transparent"
            }`}
          >
            <Users className="w-4 h-4" /> Student Registry
          </button>
          
          <button 
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-3 px-5 py-4 font-black text-xs uppercase tracking-widest transition-all relative ${
              activeTab === 'approvals' 
              ? "bg-indigo-600 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]" 
              : "text-gray-400 hover:bg-gray-900 hover:text-white border border-transparent"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Medical Audit
            {initialMedicalDocs.filter((d: any) => d.justificationStatus === 'PENDING').length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab('coursework')}
            className={`flex items-center gap-3 px-5 py-4 font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'coursework' 
              ? "bg-indigo-600 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]" 
              : "text-gray-400 hover:bg-gray-900 hover:text-white border border-transparent"
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Course Evaluation
          </button>

          <button 
            onClick={() => setActiveTab('telemetry' as any)}
            className={`flex items-center gap-3 px-5 py-4 font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'telemetry' as any
              ? "bg-indigo-600 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]" 
              : "text-gray-400 hover:bg-gray-900 hover:text-white border border-transparent"
            }`}
          >
            <RefreshCw className="w-4 h-4" /> System Health
          </button>
        </nav>

        <div className="p-6 border-t border-gray-800 bg-black/40">
           <button 
             onClick={async () => {
               const { signOut } = await import("next-auth/react");
               await signOut({ callbackUrl: "/login" });
             }}
             className="group flex items-center gap-3 text-[10px] font-black text-gray-500 hover:text-red-400 transition-colors uppercase tracking-[0.3em] w-full text-left"
           >
             <LogOut className="w-4 h-4 group-hover:animate-bounce-horizontal" />
             Exit Console
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end border-b-4 border-gray-900 pb-8">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter uppercase leading-none">
              DevOps Control Hub
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                Faculty Administration Console
              </p>
              <button 
                onClick={() => { router.refresh(); }}
                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-900 text-[9px] font-black uppercase hover:bg-gray-100 transition-all active:scale-95 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <RefreshCw className="w-3 h-3 text-indigo-600" /> Refresh Data
              </button>
            </div>
          </div>
          <div className="flex bg-white border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <div className="px-8 py-4 border-r-4 border-gray-900 bg-gray-50 flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase text-gray-400">Database Population</p>
                <p className="text-3xl font-black text-gray-900 font-mono leading-none">{initialStudents.length}</p>
             </div>
             <div className="px-8 py-4 bg-indigo-50 flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase text-indigo-900">Active Evaluated</p>
                <p className="text-3xl font-black text-indigo-600 font-mono leading-none">
                   {initialStudents.length > 0 ? (initialStudents.filter(s => s.marks && s.marks.length > 0).length / initialStudents.length * 100).toFixed(0) : 0}%
                </p>
             </div>
          </div>
        </header>

        {/* Tab Content Display */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'directory' && (
             <StudentDirectoryClient students={initialStudents} />
          )}
          
          {activeTab === 'approvals' && (
             <section className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> [Audit Queue] Medical & Leave Justifications
                </h2>
                <ApprovalsClient pendingDocs={initialMedicalDocs} />
             </section>
          )}

          {activeTab === 'coursework' && (
             <CourseEvalClient submissions={initialSubmissions} />
          )}

          {activeTab === ('telemetry' as any) && (
             <SystemTelemetryClient />
          )}
        </div>
      </main>
    </div>
  );
}
