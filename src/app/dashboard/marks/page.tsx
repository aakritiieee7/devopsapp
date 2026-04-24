import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BarChart3, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MarksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      marks: true,
    } as any
  });

  if (!user) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  const marks: any = user.marks && user.marks.length > 0 ? user.marks[0] : null;

  let totalScore = 0;
  let grade = "N/A";
  let gradeColor = "text-gray-900";

  if (marks && !user.proxyFlag) {
    totalScore = ((marks.midTerm || 0) / 2) + (marks.endSem || 0) + (marks.cap || 0) + (marks.etip || 0);
    
    if (totalScore >= 93) { grade = "A+"; gradeColor = "text-green-600"; }
    else if (totalScore >= 85) { grade = "A"; gradeColor = "text-green-600"; }
    else if (totalScore >= 77) { grade = "B+"; gradeColor = "text-indigo-600"; }
    else if (totalScore >= 69) { grade = "B"; gradeColor = "text-indigo-600"; }
    else if (totalScore >= 61) { grade = "C+"; gradeColor = "text-yellow-600"; }
    else if (totalScore >= 53) { grade = "C"; gradeColor = "text-yellow-600"; }
    else if (totalScore >= 45) { grade = "D"; gradeColor = "text-orange-600"; }
    else { grade = "F"; gradeColor = "text-red-600"; }
  } else if (user.proxyFlag) {
    grade = "F"; 
    gradeColor = "text-red-600";
  }

  return (
    <div>
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-700 block" />
          Marks & Evaluation
        </h1>
        <p className="text-gray-500 text-sm">Official assessment scores. Evaluated out of rigorous university standards.</p>
      </header>

      {user.proxyFlag && (
         <div className="mb-8 flex items-center justify-between px-6 py-4 rounded-none bg-black text-white border-l-4 border-l-red-600">
           <div className="flex items-center gap-3">
             <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
             <div>
               <h3 className="font-bold uppercase tracking-wider text-sm">Proxy Policy Violation</h3>
               <p className="text-sm text-gray-300">All evaluation scores are locked to 0.0 per strict administrative rules.</p>
             </div>
           </div>
         </div>
      )}

      {marks ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-6 rounded-none flex flex-col justify-between border-t-4 border-t-indigo-700">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Mid-Term</h3>
              <div>
                <p className={`text-4xl font-black tracking-tight ${user.proxyFlag ? 'text-red-600 line-through' : 'text-gray-900'}`}>
                  {user.proxyFlag ? '0.0' : marks.midTerm?.toFixed(1)}
                </p>
                <p className="text-sm font-bold text-gray-400 mt-1">/ 30.0</p>
              </div>
            </div>
            
            <div className="card p-6 rounded-none flex flex-col justify-between border-t-4 border-t-indigo-700">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">End-Term</h3>
              <div>
                <p className={`text-4xl font-black tracking-tight ${user.proxyFlag ? 'text-red-600 line-through' : 'text-gray-900'}`}>
                  {user.proxyFlag ? '0.0' : marks.endSem?.toFixed(1)}
                </p>
                <p className="text-sm font-bold text-gray-400 mt-1">/ 60.0</p>
              </div>
            </div>

            <div className="card p-6 rounded-none flex flex-col justify-between border-t-4 border-t-green-700">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">CAP</h3>
              <div>
                 <p className={`text-4xl font-black tracking-tight ${user.proxyFlag ? 'text-red-600 line-through' : 'text-gray-900'}`}>
                  {user.proxyFlag ? '0.0' : marks.cap?.toFixed(1)}
                </p>
                <p className="text-sm font-bold text-gray-400 mt-1">/ 10.0</p>
              </div>
            </div>

            <div className="card p-6 rounded-none flex flex-col justify-between border-t-4 border-t-green-700 bg-gray-50">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">ETIP</h3>
              <div>
                 <p className={`text-4xl font-black tracking-tight ${user.proxyFlag ? 'text-red-600' : 'text-indigo-700'}`}>
                  {user.proxyFlag ? '0.0' : marks.etip?.toFixed(1)}
                </p>
                <p className="text-sm font-bold text-gray-400 mt-1">/ 15.0</p>
              </div>
            </div>
          </div>

          <div className="card p-8 rounded-none border-t-8 border-t-gray-900 bg-gray-50 flex items-center justify-between mb-8">
             <div>
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Final Calculated Grade</h3>
             </div>
             <div className="text-right flex items-center gap-4">
               <div className="text-right mr-4 border-r border-gray-300 pr-6 hidden sm:block">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Score</p>
                  <p className="text-2xl font-black text-gray-800">{totalScore.toFixed(1)} <span className="text-sm font-bold text-gray-400">/ 100</span></p>
               </div>
               <span className={`text-6xl font-black ${gradeColor}`}>{grade}</span>
             </div>
          </div>

          <div className="card rounded-none overflow-hidden border border-gray-200">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
               <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Evaluation Grading Matrix</h3>
            </div>
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200">Marks Range</th>
                  <th className="px-6 py-3 border-b border-gray-200">Letter Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className={`${grade === "A+" ? "bg-green-50" : ""}`}>
                  <td className="px-6 py-3 font-mono">≥ 93</td>
                  <td className="px-6 py-3 font-bold text-green-700">A+</td>
                </tr>
                <tr className={`${grade === "A" ? "bg-green-50" : ""}`}>
                  <td className="px-6 py-3 font-mono">85 - 92</td>
                  <td className="px-6 py-3 font-bold text-green-700">A</td>
                </tr>
                <tr className={`${grade === "B+" ? "bg-indigo-50" : ""}`}>
                  <td className="px-6 py-3 font-mono">77 - 84</td>
                  <td className="px-6 py-3 font-bold text-indigo-700">B+</td>
                </tr>
                <tr className={`${grade === "B" ? "bg-indigo-50" : ""}`}>
                  <td className="px-6 py-3 font-mono">69 - 76</td>
                  <td className="px-6 py-3 font-bold text-indigo-700">B</td>
                </tr>
                <tr className={`${grade === "C+" ? "bg-yellow-50" : ""}`}>
                  <td className="px-6 py-3 font-mono">61 - 68</td>
                  <td className="px-6 py-3 font-bold text-yellow-700">C+</td>
                </tr>
                <tr className={`${grade === "C" ? "bg-yellow-50" : ""}`}>
                  <td className="px-6 py-3 font-mono">53 - 60</td>
                  <td className="px-6 py-3 font-bold text-yellow-700">C</td>
                </tr>
                <tr className={`${grade === "D" ? "bg-orange-50" : ""}`}>
                  <td className="px-6 py-3 font-mono">45 - 52</td>
                  <td className="px-6 py-3 font-bold text-orange-700">D</td>
                </tr>
                <tr className={`${grade === "F" ? "bg-red-50" : ""}`}>
                  <td className="px-6 py-3 font-mono">&lt; 45</td>
                  <td className="px-6 py-3 font-bold text-red-700">F</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="card p-12 text-center rounded-none border border-dashed border-gray-300">
          <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">Marks Not Released Yet</p>
        </div>
      )}
    </div>
  );
}
