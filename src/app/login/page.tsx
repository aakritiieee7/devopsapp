"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { LogIn, User, Lock, Loader2, ShieldCheck, Activity } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("AUTHENTICATION_FAILURE: INVALID_CREDENTIALS");
      } else {
        // Simple role-based routing for the unified portal
        if (email.toLowerCase().includes("admin")) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (_err) {
      setError("SYSTEM_ERROR: INTERNAL_SERVER_CRITICAL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-lg bg-white border-4 border-gray-900 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600 rotate-45 opacity-10" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10 border-b-4 border-gray-900 pb-6">
            <div className="bg-gray-900 p-4 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                DevOps Hub
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-1">
                Centralized Access Management
              </p>
            </div>
          </div>

          {searchParams.get("registered") && (
            <div className="mb-8 bg-green-50 border-2 border-green-600 p-4 text-green-700 font-black text-[10px] uppercase">
               IDENTITY_REGISTERED_SUCCESSFULLY: READY_FOR_SIGN_IN
            </div>
          )}
          {searchParams.get("reset") && (
            <div className="mb-8 bg-yellow-50 border-2 border-yellow-600 p-4 text-yellow-700 font-black text-[10px] uppercase">
               PASSWORD_RESET_COMPLETE: USE_NEW_ACCESS_PIN
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Identity / Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-4 border-gray-900 px-6 py-4 outline-none font-black text-sm uppercase focus:bg-indigo-50 focus:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] transition-all placeholder:text-gray-300"
                placeholder="USER@IGDTUW.AC.IN"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3" /> Access Credentials
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-4 border-gray-900 px-6 py-4 outline-none font-black text-sm uppercase focus:bg-indigo-50 focus:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] transition-all placeholder:text-gray-300"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-600 p-4 flex items-center gap-3 text-red-600 font-black text-[10px] uppercase">
                <Activity className="w-4 h-4 animate-pulse" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-black py-5 uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Request System Entry
                </>
              )}
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t-2 border-gray-100 flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-[9px] font-bold text-gray-400 uppercase leading-tight">Identity Registry</span>
               <p 
                 onClick={() => router.push("/register")}
                 className="text-[10px] font-black text-gray-900 uppercase cursor-pointer hover:text-indigo-600"
               >
                 Register New Identity
               </p>
             </div>
             <p 
               onClick={() => router.push("/forgot-password")}
               className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer uppercase tracking-tighter"
             >
               Forgot Access? Reset Key
             </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
