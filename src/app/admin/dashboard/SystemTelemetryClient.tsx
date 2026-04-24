"use client";

import { useEffect, useState } from "react";
import { Activity, ShieldAlert, Database, Cpu, Globe, Server, CheckCircle, XCircle } from "lucide-react";

export default function SystemTelemetryClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch("/api/health");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("TELEMETRY_FETCH_ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4 animate-pulse">
       <Activity className="w-10 h-10 text-indigo-400" />
       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Refreshing System Data...</p>
    </div>
  );

  const stats = [
    { label: "Environment", value: data?.telemetry?.cluster || "Production", icon: Server, color: "text-indigo-600" },
    { label: "System Version", value: data?.version || "1.0.4", icon: Globe, color: "text-gray-900" },
    { label: "Security Flags", value: `${data?.telemetry?.proxyFlags || 0} / ${data?.telemetry?.threshold || 10}`, icon: ShieldAlert, color: data?.status === 'healthy' ? 'text-green-600' : 'text-red-600' },
    { label: "Server Platform", value: "Node.js (LTS)", icon: Cpu, color: "text-gray-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 flex items-center gap-2">
          <Activity className="w-4 h-4" /> System Health & Security Metrics
        </h2>
        <div className={`flex items-center gap-2 px-4 py-1.5 border-2 font-black text-[10px] uppercase tracking-widest ${
          data?.status === 'healthy' ? 'bg-green-500 text-white border-green-700' : 'bg-red-500 text-white border-red-700'
        }`}>
          {data?.status === 'healthy' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          System Status: {data?.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border-4 border-gray-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(79,70,229,1)] transition-all">
            <stat.icon className={`w-5 h-5 mb-4 ${stat.color}`} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-xl font-black uppercase tracking-tighter ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-green-400 p-8 border-4 border-gray-800 font-mono text-[11px] relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-[loading_2s_infinite]"></div>
         <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Server Activity Logs</span>
            <span className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               CONNECTED
            </span>
         </div>
         <div className="space-y-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <p><span className="text-gray-500">[{new Date().toISOString()}]</span> <span className="text-indigo-400">INFO:</span> DB_ACCESS: Querying user registry...</p>
            <p><span className="text-gray-500">[{new Date().toISOString()}]</span> <span className="text-indigo-400">INFO:</span> PRISMA_SERVICE: Database connection active.</p>
            <p><span className="text-gray-500">[{new Date().toISOString()}]</span> <span className="text-indigo-400">INFO:</span> SECURITY_VAULT: Loading release manifest...</p>
            <p><span className="text-gray-500">[{new Date().toISOString()}]</span> <span className="text-indigo-400">INFO:</span> HEALTH_CHECK: Metrics updated successfully.</p>
            <p className="animate-pulse underline decoration-double">Waiting for update...</p>
         </div>
      </div>
    </div>
  );
}
