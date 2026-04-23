import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Fingerprint, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AttendancePage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Find active sessions
  const activeSession = await prisma.session.findFirst({
    where: {
      isOpen: true,
      endTime: { gt: new Date() }
    }
  });

  // Check if already marked
  const alreadyMarked = activeSession ? await prisma.attendanceRecord.findUnique({
    where: {
      userId_sessionId: {
        userId: session.user.id,
        sessionId: activeSession.id
      }
    }
  }) : null;

  async function markAttendanceAction() {
    "use server";
    const session = await auth();
    if (!session || !activeSession) return;

    await prisma.attendanceRecord.create({
      data: {
        userId: session.user.id,
        sessionId: activeSession.id,
        status: "PRESENT"
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/attendance");
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="glass p-10 rounded-[3rem] text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <Fingerprint className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Mark Attendance</h1>
          
          {activeSession ? (
            alreadyMarked ? (
              <div className="space-y-6">
                <p className="text-muted">You have already marked your attendance for:</p>
                <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                  <p className="font-bold text-primary">{activeSession.subject}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Marked Successfully
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-muted">Active Session Found:</p>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="font-bold text-white">{activeSession.subject}</p>
                  <p className="text-xs text-muted mt-1">Ends at {new Date(activeSession.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                
                <form action={markAttendanceAction}>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
                  >
                    Confirm Presence
                    <Fingerprint className="w-5 h-5 group-active:scale-90 transition-transform" />
                  </button>
                </form>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div className="bg-accent/10 p-4 rounded-2xl border border-accent/20">
                <p className="text-accent font-semibold">No Active Sessions</p>
              </div>
              <p className="text-sm text-muted">Please wait for your instructor to open the session.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
