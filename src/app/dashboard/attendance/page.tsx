import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AttendanceRecord, Session } from "@prisma/client";
import { Calendar, Clock, UploadCloud, AlertCircle } from "lucide-react";
import MedicalUploadClient from "./MedicalUploadClient";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      attendance: {
        include: { session: true },
        orderBy: { timestamp: 'desc' }
      }
    }
  });

  if (!user) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  const totalSessions = user.attendance.length;
  const presentCount = user.attendance.filter((a: AttendanceRecord) => a.status === "PRESENT").length;
  const attendanceRate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0;

  return (
    <div>
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-700 block" />
          Attendance Tracker
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex flex-col md:flex-row items-start md:items-center justify-between col-span-1 md:col-span-3 rounded-none border-gray-300 border-l-4 border-l-indigo-700">
          <div className="mb-4 md:mb-0">
            <h2 className="text-4xl font-black text-gray-900 mb-1">{attendanceRate.toFixed(1)}%</h2>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Overall Aggregate</p>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center px-0 md:px-8">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
              <span>PROGRESS</span>
              <span>{presentCount} / {totalSessions} Sessions Attended</span>
            </div>
            <div className="w-full h-4 bg-gray-200 overflow-hidden relative">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-1000 ${attendanceRate >= 80 ? 'bg-green-500' : attendanceRate >= 60 ? 'bg-yellow-400' : 'bg-red-500'
                  }`}
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>0%</span>
              <span className="text-red-500">Danger</span>
              <span className="text-yellow-600">Borderline</span>
              <span className="text-green-600">Safe</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-500" />
        Detailed Audit Log
      </h2>
      <div className="card w-full border border-gray-200 bg-white rounded-none">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-900 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Session Context</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {user.attendance.map((record: AttendanceRecord & { session: Session }) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{new Date(record.timestamp).toLocaleDateString()}</span>
                    <span className="text-xs text-gray-500">{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">{record.session.subject}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold border ${record.status === "PRESENT" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {record.status === "ABSENT" ? (
                    <MedicalUploadClient recordId={record.id} initialStatus={record.justificationStatus} />
                  ) : (
                    <span className="text-xs text-gray-400 font-medium italic">Verified</span>
                  )}
                </td>
              </tr>
            ))}
            {user.attendance.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
