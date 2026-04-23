import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          DevOpsAttend
        </div>
        <Link href="/login" className="bg-white/80 px-6 py-2 rounded-full text-sm font-semibold hover:bg-slate-100 transition-all border border-slate-200 shadow-sm text-slate-700">
          Sign In
        </Link>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
          Live DevOps Deployment Active
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
          Modern Attendance <br /> 
          <span className="text-blue-600 italic">Monitoring</span> Reimagined.
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Integrated with a rigorous DevOps lifecycle. Automated builds, containerized deployment, and real-time monitoring for the modern educational workspace.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20">
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all border border-slate-200 shadow-sm flex items-center justify-center">
            View Stack
          </a>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {[
            { icon: ShieldCheck, title: "Secure Auth", desc: "Enterprise-grade NextAuth integration" },
            { icon: Globe, title: "Cloud Edge", desc: "Deployed on a global edge network" },
            { icon: Zap, title: "Real-time", desc: "Instant timestamping & proxy detection" }
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 text-left hover-lift shadow-sm">
              <f.icon className="w-6 h-6 text-blue-600 mb-4" />
              <h3 className="font-bold mb-2 text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 p-8 text-center text-xs text-slate-400 border-t border-slate-200 mt-12 bg-white/50 backdrop-blur-md">
        &copy; 2024 DevOps Attendance Portal • Built with Next.js, Prisma & Docker
      </footer>
    </div>
  );
}
