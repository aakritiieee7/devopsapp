"use client";

import { useState } from "react";
import { User, Lock, Loader2, ShieldCheck, Activity, Mail, Fingerprint, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtpAndRegister } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrollmentId: "",
    password: "",
    otp: ""
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const res = await sendOtp(formData.email);
    if (res.success) {
      setStep(2);
    } else {
      setError("FAILED_TO_DISPATCH_OTP");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const res = await verifyOtpAndRegister(formData);
    if (res.success) {
      router.push("/login?registered=true");
    } else {
      setError(res.error || "REGISTRATION_FAILURE");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-xl bg-white border-4 border-gray-900 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10 border-b-4 border-gray-900 pb-6">
            <div className="bg-gray-900 p-4 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                System Registry
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-1">
                New Identity Integration
              </p>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border-4 border-gray-900 px-4 py-3 outline-none font-black text-xs uppercase focus:bg-indigo-50 transition-all placeholder:text-gray-300"
                    placeholder="AAKRITI RAJHANS"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Fingerprint className="w-3 h-3" /> Enrollment ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.enrollmentId}
                    onChange={(e) => setFormData({...formData, enrollmentId: e.target.value})}
                    className="w-full border-4 border-gray-900 px-4 py-3 outline-none font-black text-xs uppercase focus:bg-indigo-50 transition-all placeholder:text-gray-300"
                    placeholder="002BTIT24"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border-4 border-gray-900 px-4 py-3 outline-none font-black text-xs uppercase focus:bg-indigo-50 transition-all placeholder:text-gray-300"
                  placeholder="USER@IGDTUW.AC.IN"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Access Pin (Password)
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full border-4 border-gray-900 px-4 py-3 outline-none font-black text-xs uppercase focus:bg-indigo-50 transition-all placeholder:text-gray-300"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white font-black py-4 uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Dispatch Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-10 py-10">
               <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-indigo-50 rounded-none border-2 border-indigo-200">
                    <Activity className="w-12 h-12 text-indigo-600 animate-pulse" />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 uppercase">Input Verification Token</h2>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto font-medium">A 6-digit cryptographic sequence has been dispatched to <span className="text-gray-900 font-bold">{formData.email}</span></p>
               </div>

               <div className="flex justify-center">
                  <input 
                    type="text"
                    maxLength={6}
                    required
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                    className="w-48 border-b-8 border-gray-900 text-center text-4xl font-black tracking-[0.5em] outline-none focus:text-indigo-600 transition-colors py-4 uppercase"
                    placeholder="000000"
                  />
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white font-black py-5 uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify Identity & Initialize"}
                </button>
                <p className="text-center text-[10px] font-black text-gray-400 uppercase cursor-pointer hover:text-indigo-600" onClick={() => setStep(1)}>← Correct Identity Details</p>
            </form>
          )}

          {error && (
            <div className="mt-8 bg-red-50 border-2 border-red-600 p-4 flex items-center gap-3 text-red-600 font-black text-[10px] uppercase">
              <Activity className="w-4 h-4" />
              {error}
            </div>
          )}

          <footer className="mt-12 pt-8 border-t-2 border-gray-100 text-center">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               Identity already in registry? <span className="text-indigo-600 cursor-pointer hover:underline" onClick={() => router.push("/login")}>Enter Portal</span>
             </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
