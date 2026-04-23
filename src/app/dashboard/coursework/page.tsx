import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Assignment } from "@prisma/client";
import { BookOpen, FileText, CheckSquare, Clock, Filter, AlertTriangle } from "lucide-react";
import FileAttachClient from "./FileAttachClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CourseworkPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams?.filter || "ALL";

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      assignments: {
        orderBy: { deadline: 'asc' }
      }
    }
  });

  if (!user) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  // Smart Filtering
  let displayAssignments = user.assignments;
  if (filter === "PENDING") {
    displayAssignments = displayAssignments.filter((a: any) => a.status === "PENDING");
  } else if (filter === "SUBMITTED") {
    displayAssignments = displayAssignments.filter((a: any) => a.status === "SUBMITTED" || a.status === "GRADED");
  }

  const getPriority = (deadline: Date, status: string) => {
    if (status !== "PENDING") return null;
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (days < 0) return { label: "OVERDUE", color: "text-red-700 bg-red-100 border-red-200" };
    if (days <= 3) return { label: "HIGH PRIORITY", color: "text-orange-700 bg-orange-100 border-orange-200" };
    if (days <= 7) return { label: "MEDIUM PRIORITY", color: "text-yellow-700 bg-yellow-100 border-yellow-200" };
    return { label: "LOW PRIORITY", color: "text-gray-700 bg-gray-100 border-gray-200" };
  };

  const getCountdown = (deadline: Date, status: string) => {
    if (status !== "PENDING") return null;
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (days < 0) return `Due ${Math.abs(days)} days ago`;
    if (days === 0) return "Due today!";
    return `Due in ${days} days`;
  };

  return (
    <div>
      <header className="mb-8 border-b border-gray-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-700 block" />
              Assignment Tracker
            </h1>
            <p className="text-gray-500 text-sm">Submit your DevOps practicals and lab assignments below.</p>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 border border-gray-200 text-xs font-bold uppercase tracking-wider">
            <Filter className="w-4 h-4 text-gray-500 ml-2" />
            <Link href="/dashboard/coursework?filter=ALL" className={`px-4 py-2 ${filter === "ALL" ? "bg-white text-indigo-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-800"}`}>All</Link>
            <Link href="/dashboard/coursework?filter=PENDING" className={`px-4 py-2 ${filter === "PENDING" ? "bg-white text-indigo-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-800"}`}>Pending</Link>
            <Link href="/dashboard/coursework?filter=SUBMITTED" className={`px-4 py-2 ${filter === "SUBMITTED" ? "bg-white text-indigo-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-800"}`}>Submitted</Link>
          </div>
        </div>
      </header>

      {displayAssignments.length === 0 && (
         <div className="card p-12 text-center rounded-none border border-dashed border-gray-300">
           <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">No assignments found</p>
           <p className="text-gray-400 text-xs">You might be fully caught up based on this filter.</p>
         </div>
      )}

      <div className="space-y-6">
        {displayAssignments.map((assignment: any) => {
          const priority = getPriority(assignment.deadline, assignment.status);
          const countdown = getCountdown(assignment.deadline, assignment.status);

          return (
            <div key={assignment.id} className="card p-0 flex flex-col rounded-none hover-lift border border-gray-300 shadow-sm">
              <div className="p-6 border-b border-gray-200 flex items-start justify-between bg-white relative">
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{assignment.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(assignment.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      {countdown && (
                        <span className="text-indigo-600 font-bold text-xs uppercase bg-indigo-50 px-2 py-0.5 border border-indigo-100">
                          {countdown}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold px-3 py-1 uppercase border ${
                    assignment.status === "SUBMITTED" ? "bg-blue-100 text-blue-800 border-blue-200" : 
                    assignment.status === "GRADED" ? "bg-green-100 text-green-800 border-green-200" :
                    "bg-gray-50 text-gray-700 border-gray-300 shadow-inner"
                  }`}>
                    {assignment.status === "SUBMITTED" ? "TURNED IN, PENDING" : assignment.status}
                  </span>
                  
                  {priority && (
                    <span className={`text-[10px] font-black px-2 py-0.5 uppercase border ${priority.color}`}>
                      {priority.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col md:flex-row gap-8 bg-gray-50">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2 border-b border-gray-200 pb-2">Instructions</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {assignment.description || "Refer to the standard syllabus guidelines for this unit."}
                  </p>

                  {assignment.status === "SUBMITTED" && (
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mt-4 border-t border-gray-200 pt-4 uppercase tracking-widest">
                      <CheckSquare className="w-4 h-4 text-green-600" />
                      Status: Successfully Transmitted to Faculty Log
                    </div>
                  )}
                </div>

                <div className="w-full md:w-80 bg-white border border-gray-300 p-4 shadow-sm relative">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
                    Your Work
                    <span className={`text-xs font-normal ${assignment.status === "SUBMITTED" ? "text-blue-700 font-bold" : assignment.status === "GRADED" ? "text-green-700 font-bold" : "text-gray-500 font-mono"}`}>
                      {assignment.status === "SUBMITTED" ? "File Received" : assignment.status === "GRADED" ? "Evaluated" : "No File Attached"}
                    </span>
                  </h4>
                  
                  <FileAttachClient assignmentId={assignment.id} isSubmitted={assignment.status === "SUBMITTED"} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
