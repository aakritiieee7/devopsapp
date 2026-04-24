"use client";

import { useState } from "react";
import { Lock, Loader2, ShieldCheck, Activity, Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtpAndResetPassword } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const res = await sendOtp(email);
    if (res.success) {
      setStep(2);
    } else {
      setError("IDENTITY_NOT_FOUND_IN_REGISTRY");
    }
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const res = await verifyOtpAndResetPassword(email, otp, newPassword);
    if (res.success) {
      router.push("/login?reset=true");
    } else {
      setError(res.error || "RESET_PROTOCOL_FAILURE");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-lg bg-white border-4 border-gray-900 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 rotate-45 opacity-20 -translate-y-12 translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10 border-b-4 border-gray-900 pb-6">
            <div className="bg-gray-900 p-4 shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                Key Reset
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-1">
                Access Recovery Protocol
              </p>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Registered Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-4 border-gray-900 px-6 py-4 outline-none font-black text-xs uppercase focus:bg-yellow-50 focus:border-yellow-600 transition-all placeholder:text-gray-300"
                  placeholder="USER@IGDTUW.AC.IN"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white font-black py-5 uppercase tracking-widest hover:bg-yellow-600 transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Request Reset Token"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
               <div className="p-4 bg-yellow-50 border-2 border-yellow-200 text-center mb-8">
                  <p className="text-[10px] font-black text-yellow-800 uppercase">Input Token Sent To {email}</p>
               </div>

               <div className="space-y-2 text-center">
                  <input 
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-48 border-b-8 border-gray-900 text-center text-4xl font-black tracking-[0.4em] outline-none focus:text-yellow-600 transition-colors py-4 uppercase"
                    placeholder="000000"
                  />
               </div>

               <div className="space-y-2 pt-6">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3" /> New Access Pin
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border-4 border-gray-900 px-6 py-4 outline-none font-black text-xs uppercase focus:bg-yellow-50 transition-all placeholder:text-gray-300"
                  placeholder="••••••••"
                />
              </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-white font-black py-5 uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Finalize Key Rotation"}
                </button>
            </form>
          )}

          {error && (
            <div className="mt-8 bg-red-50 border-2 border-red-600 p-4 flex items-center gap-3 text-red-600 font-black text-[10px] uppercase">
              <Activity className="w-4 h-4" />
              {error}
            </div>
          )}

          <footer className="mt-12 pt-8 border-t-2 border-gray-100 flex justify-between items-center">
             <p className="text-[10px] font-black text-gray-400 uppercase cursor-pointer hover:text-indigo-600" onClick={() => setStep(1)}>← Re-enter Email</p>
             <p className="text-[10px] font-black text-gray-400 uppercase cursor-pointer hover:text-indigo-600" onClick={() => router.push("/login")}>Back to login</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
