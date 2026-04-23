import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  User as UserIcon, 
  Calendar, 
  BookOpen, 
  ChevronLeft,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import VersionFooter from "@/components/VersionFooter";

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!admin || admin.role !== "ADMIN") return <div>Unauthorized Access</div>;

  const student = await prisma.user.findUnique({
    where: { id: resolvedParams.id, role: "STUDENT" },
    include: {
      attendance: {
        include: { session: true },
        orderBy: { timestamp: 'desc' }
      },
      assignments: {
        orderBy: { deadline: 'asc' }
      }
    }
  });

  if (!student) return <div>Student not found</div>;

  const totalSessions = await prisma.session.count();
  const presentCount = student.attendance.filter((a: import("@prisma/client").AttendanceRecord) => a.status === "PRESENT").length;
  const attendanceRate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 glass p-8 rounded-3xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5">
              <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
              <p className="text-muted text-sm flex items-center gap-2">
                {student.email} • {student.enrollmentId} • {student.branch} • Sem {student.semester}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {student.proxyFlag && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-semibold italic">Proxy Flag Alert</span>
              </div>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 className="w-24 h-24" />
            </div>
            <p className="text-muted text-sm mb-1">Overall Attendance</p>
            <h2 className="text-4xl font-bold mb-4">{attendanceRate.toFixed(1)}%</h2>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${attendanceRate < 75 ? 'bg-accent' : 'bg-gradient-to-r from-primary to-secondary'}`}
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>

          <div className="glass p-6 rounded-3xl group">
             <p className="text-muted text-sm mb-1">Assignments Progress</p>
             <h2 className="text-4xl font-bold flex items-center gap-3">
               {student.assignments.filter((a: import("@prisma/client").Assignment) => a.status === "SUBMITTED").length} / {student.assignments.length}
             </h2>
             <p className="text-xs text-muted mt-4">Submitted vs Total</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Log */}
          <section className="glass rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Attendance Record
              </h3>
            </div>
            <div className="space-y-4">
              {student.attendance.map((record: import("@prisma/client").AttendanceRecord & { session: import("@prisma/client").Session }) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover-lift">
                  <div>
                    <h4 className="font-semibold">{record.session.subject}</h4>
                    <p className="text-xs text-muted mt-1">
                      {new Date(record.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    record.status === "PRESENT" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                  }`}>
                    {record.status}
                  </span>
                </div>
              ))}
              {student.attendance.length === 0 && <p className="text-muted text-sm text-center">No attendance records found</p>}
            </div>
          </section>

          {/* Assignments */}
          <section className="glass rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                Assignment Tracker
              </h3>
            </div>
            <div className="space-y-4">
              {student.assignments.map((assignment: import("@prisma/client").Assignment) => (
                <div key={assignment.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover-lift">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{assignment.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      assignment.status === "SUBMITTED" ? "text-primary bg-primary/20" : "text-accent bg-accent/20"
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">{assignment.subject}</p>
                    <p className="text-xs text-muted">Due: {new Date(assignment.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {student.assignments.length === 0 && <p className="text-muted text-sm text-center">No assignments found</p>}
            </div>
          </section>
        </div>

        <VersionFooter />
      </div>
    </div>
  );
}
