import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Assignment } from "@prisma/client";
import { Target, Clock, AlertTriangle, CheckSquare, Calendar, ArrowRight, Activity } from "lucide-react";
import ClientTimer from "./ClientTimer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const basicUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true }
  });

  if (!basicUser) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      attendance: true,
      marks: true,
      assignments: {
        where: { status: "PENDING" },
        orderBy: { deadline: 'asc' }
      }
    } as any
  });

  if (!user) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  // Find active session
  const activeSession = await prisma.session.findFirst({
    where: { isOpen: true, startTime: { lte: new Date() }, endTime: { gte: new Date() } }
  });

  const totalSessions = user.attendance ? user.attendance.length : 0;
  const presentCount = user.attendance ? user.attendance.filter((a: any) => a.status === "PRESENT").length : 0;
  const attendanceRate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0;
  const marks: any = user.marks && user.marks.length > 0 ? user.marks[0] : null;
  const totalScore = marks ? ((marks.midTerm || 0) / 2) + (marks.endSem || 0) + (marks.cap || 0) + (marks.etip || 0) : 0;

  return (
    <div>
      <header className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name?.split(' ')[0]}</h1>
        <p className="text-gray-500">Here is what's happening in your DevOps workspace today.</p>
      </header>

      {/* Smart Alerts System & AI Insights */}
       <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-8 rounded-none border-2 border-gray-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4" /> Academic Performance Summary
              </h2>
              
              <div className="space-y-6">
                {attendanceRate < 75 ? (
                  <div className="flex gap-4 items-start p-4 bg-red-50 border border-red-200">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Attendance Threshold Alert</p>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        Current Rate: <span className="text-red-600 font-black">{attendanceRate.toFixed(1)}%</span>. You are currently below the university requirement (75%).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 items-start p-4 bg-green-50 border border-green-200">
                    <Target className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Record Status</p>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        Attendance: <span className="text-green-600 font-black">{attendanceRate.toFixed(1)}%</span>. Your records are within safe operational limits.
                      </p>
                    </div>
                  </div>
                )}
                
                {marks && totalScore < 45 && (
                  <div className="flex gap-4 items-start p-4 bg-gray-50 border border-gray-200">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Feedback</p>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium italic">
                        Current projected outcome is below 45. Focus on remaining lab deliverables to improve.
                      </p>
                    </div>
                  </div>
                )}
                
                {user.assignments.some((a: any) => new Date(a.deadline).getTime() < Date.now() + 86400000 * 3) && (
                  <div className="flex gap-4 items-start p-4 bg-indigo-50 border border-indigo-200">
                    <Clock className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Deadline Reminder</p>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        High-priority practical submissions due within 72 hours.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

         <div className="card p-6 rounded-none bg-white border border-gray-200">
           <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-4 flex items-center gap-2">
             🔔 Smart Action Notifications
           </h2>
           <div className="space-y-3">
             {user.assignments.slice(0, 2).map((assignment: any) => (
                <div key={assignment.id} className="p-3 bg-red-50 border border-red-200 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-600 bg-red-100 px-2 py-0.5 inline-block mb-1">DEADLINE</span>
                    <p className="text-sm font-bold text-gray-800">{assignment.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Due: {new Date(assignment.deadline).toLocaleString()}</p>
                  </div>
                  <button className="text-red-400 hover:text-red-700 transition-colors">
                    <span className="text-xs font-bold uppercase transition">Dismiss</span>
                  </button>
                </div>
             ))}
             {attendanceRate < 80 && attendanceRate >= 60 && (
                <div className="p-3 bg-orange-50 border border-orange-200 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-100 px-2 py-0.5 inline-block mb-1">ATTENDANCE</span>
                    <p className="text-sm font-bold text-gray-800">Borderline Limit Approaching</p>
                    <p className="text-xs text-gray-500 mt-1">You must not miss the upcoming Friday lab.</p>
                  </div>
                  <button className="text-orange-400 hover:text-orange-700 transition-colors">
                    <span className="text-xs font-bold uppercase transition">Dismiss</span>
                  </button>
                </div>
             )}
             {user.assignments.length === 0 && attendanceRate >= 80 && (
               <div className="p-4 text-center border border-dashed border-gray-300 text-gray-500 text-sm">
                 No active alerts. You are completely caught up!
               </div>
             )}
           </div>
         </div>
      </div>

      {user.proxyFlag && (
         <div className="mb-8 flex items-center gap-2 px-4 py-3 rounded-none bg-red-50 border border-red-200 text-red-600">
           <AlertTriangle className="w-5 h-5 flex-shrink-0" />
           <span className="text-sm font-semibold">Security Alert: Your account has been flagged for Proxy Attendance. Evaluations are currently restricted.</span>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Class Box */}
        <div className="card p-6 rounded-none">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 text-gray-600 font-bold">
               <Target className="w-5 h-5 text-indigo-700" />
               Current Class
             </div>
             {activeSession ? (
                <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded-none border border-green-200">LIVE NOW</span>
             ) : (
                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-none border border-gray-200">NO ACTIVE CLASS</span>
             )}
          </div>
          
          {activeSession ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{activeSession.subject}</h2>
              <ClientTimer endTime={activeSession.endTime} sessionId={activeSession.id} />
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">DevOps & Cloud Computing</h2>
              <p className="text-sm text-gray-500 font-mono">Class starts in: 01H 45M 20S</p>
            </>
          )}
        </div>

        {/* Schedule Calendar */}
        <div className="card p-6 rounded-none col-span-1 md:col-span-2 border-t-4 border-t-gray-800">
          <div className="flex items-center gap-2 text-gray-600 font-bold mb-4">
             <Calendar className="w-5 h-5 text-indigo-700" />
             Weekly Master Schedule
          </div>
          <div className="flex flex-col gap-3">
             <Link href="/dashboard/attendance" className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors group cursor-pointer block w-full">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white border border-gray-300 flex flex-col items-center justify-center font-bold text-gray-800 shadow-sm transition-transform group-hover:scale-105">
                   <span className="text-[10px] uppercase text-gray-500">FRI</span>
                   <span>24</span>
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                     DevOps & Cloud Computing
                     <ArrowRight className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </h4>
                   <p className="text-sm text-gray-500">Weekly lab and lecture session</p>
                 </div>
               </div>
               <div className="text-right">
                 <span className="block font-bold text-indigo-700">11:00 AM - 1:00 PM</span>
                 <span className="text-xs uppercase font-bold text-green-600">Recurring</span>
               </div>
             </Link>
          </div>
        </div>

        {/* Up Next List */}
        <div className="card p-6 rounded-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-600 font-bold">
               <Clock className="w-5 h-5 text-indigo-700" />
               Pending Work
            </div>
            <Link href="/dashboard/coursework" className="text-xs font-bold text-indigo-700 hover:text-indigo-900 uppercase">View All</Link>
          </div>
          {user.assignments.length > 0 ? (
            <ul className="space-y-3">
              {user.assignments.slice(0, 3).map((a: any) => (
                <li key={a.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <Link href="/dashboard/coursework" className="flex flex-col hover:bg-gray-50 p-2 -mx-2 transition-colors rounded-sm group">
                    <span className="font-semibold text-gray-800 text-sm group-hover:text-indigo-700 transition-colors flex items-center justify-between">
                      {a.title}
                      <ArrowRight className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due {new Date(a.deadline).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Everything is up to date. Excellent work!</p>
          )}
        </div>
      </div>
    </div>
  );
}
