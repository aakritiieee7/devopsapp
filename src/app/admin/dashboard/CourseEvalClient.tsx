"use client";

import { useState, useMemo } from "react";
import { FileCheck, Star, MessageSquare, Save, X, ExternalLink, Search, Filter, Book } from "lucide-react";
import { gradeAssignment } from "../adminActions";

export default function CourseEvalClient({ submissions }: { submissions: any[] }) {
  const [evaluating, setEvaluating] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");

  const subjects = useMemo(() => {
    return Array.from(new Set(submissions.map(s => s.subject)));
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = 
        sub.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
        sub.user?.enrollmentId?.toLowerCase().includes(search.toLowerCase()) ||
        sub.title?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
      const matchesSubject = subjectFilter === "ALL" || sub.subject === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [submissions, search, statusFilter, subjectFilter]);

  const handleEvalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      grade: formData.get("grade") as string,
      feedback: formData.get("feedback") as string,
    };
    
    await gradeAssignment(evaluating.id, data);
    setEvaluating(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 flex items-center gap-2 mb-4">
        <FileCheck className="w-4 h-4" /> [Eval Queue] Coursework & Labs Pipeline
      </h2>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 border border-gray-300 shadow-sm mb-6">
        <div className="flex-1 min-w-[250px] flex items-center gap-2 border border-gray-300 px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-indigo-600 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Submission or Student..." 
            className="bg-transparent outline-none text-xs font-bold w-full uppercase"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 bg-gray-50">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            className="bg-transparent outline-none text-[10px] font-black uppercase cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="SUBMITTED">Pending Eval</option>
            <option value="GRADED">Already Graded</option>
          </select>
        </div>

        <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 bg-gray-50">
          <Book className="w-4 h-4 text-gray-400" />
          <select 
            className="bg-transparent outline-none text-[10px] font-black uppercase cursor-pointer"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="ALL">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 uppercase text-[10px] font-black text-gray-500 border-b-2 border-gray-900">
            <tr>
              <th className="px-6 py-4">Submission Identifier</th>
              <th className="px-6 py-4">Evaluation Metric</th>
              <th className="px-6 py-4 text-right">Action Console</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubmissions.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest bg-gray-50/50">
                  No Submissions Found in Current Pipeline
                </td>
              </tr>
            )}
            {filteredSubmissions.map((sub: any) => (
              <tr key={sub.id} className="hover:bg-indigo-50/20 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-black text-gray-900 uppercase text-sm mb-1">{sub.title}</p>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-2">{sub.user?.name} ({sub.user?.enrollmentId})</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 font-bold uppercase">{sub.subject}</span>
                    <span className="text-[10px] border border-gray-300 text-gray-500 px-2 py-0.5 font-bold uppercase tracking-tighter">SUB_ID: {sub.id.slice(-6)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {sub.status === "GRADED" ? (
                    <div className="flex flex-col gap-1">
                       <span className="px-3 py-1 bg-gray-900 text-white font-black text-[10px] uppercase shadow-sm w-fit">GRADE: {sub.grade}</span>
                       <p className="text-[10px] text-gray-400 font-bold line-clamp-1 italic">"{sub.feedback}"</p>
                    </div>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-400 text-black font-black text-[10px] uppercase border border-black shadow-sm flex items-center justify-center w-fit">REQUIRES REVIEW</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setEvaluating(sub)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-black text-[10px] uppercase hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    {sub.status === "GRADED" ? "Edit Eval" : "Begin Eval"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Evaluating Modal */}
      {evaluating && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-xl border-4 border-gray-900">
             <form onSubmit={handleEvalSubmit}>
                <div className="p-6 border-b-4 border-gray-900 flex justify-between items-center bg-indigo-600 text-white shadow-xl">
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-lg flex items-center gap-2">
                       <FileCheck className="w-5 h-5" /> Evaluation Terminal
                    </h3>
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-tighter">{evaluating.title} // REGISTRY_{evaluating.id.slice(-4)}</p>
                  </div>
                  <button type="button" onClick={() => setEvaluating(null)} className="hover:rotate-90 transition-transform active:scale-90"><X className="w-8 h-8 hover:text-red-400" /></button>
                </div>

                <div className="p-8 space-y-6">
                   <div className="bg-gray-100 border border-gray-300 p-6 text-xs text-gray-600 shadow-inner">
                     <p className="font-black text-gray-900 mb-2 uppercase tracking-widest border-b border-gray-200 pb-1">
                        Submission Details
                     </p>
                     <p className="mb-1 font-bold italic truncate">ID: <span className="text-gray-900 font-mono">{evaluating.submissionUrl || "NO_SOURCE_HASH"}</span></p>
                     <p className="mb-4">SOURCE: github.com/igdtuw-student/{evaluating.user?.enrollmentId}</p>
                     <button 
                       type="button" 
                       onClick={() => {
                         if (evaluating.submissionUrl) {
                           window.open(`/api/docs/assignment/${evaluating.id}`, '_blank');
                         } else {
                           alert("Notice: No document file was uploaded with this submission.");
                         }
                       }}
                       className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-black uppercase text-[10px] hover:bg-black transition-colors"
                     >
                       <ExternalLink className="w-3 h-3" /> Audit Actual Source File
                     </button>
                   </div>

                   <div className="space-y-4">
                     <div>
                       <label className="block text-[10px] font-black text-gray-900 uppercase mb-2 flex items-center gap-2">
                         <Star className="w-4 h-4 text-indigo-600" /> Assign Final Grade Index
                       </label>
                       <select 
                         name="grade" 
                         defaultValue={evaluating.grade || "A"} 
                         className="w-full border-4 border-gray-900 px-4 py-4 outline-none font-black text-xl focus:bg-indigo-50 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[right_1.5rem_center] bg-no-repeat"
                       >
                         <option value="A+">A+ (Distinction)</option>
                         <option value="A">A (Commendable)</option>
                         <option value="B+">B+ (Strong)</option>
                         <option value="B">B (Satisfactory)</option>
                         <option value="C">C (Pass)</option>
                         <option value="F">F (Failure)</option>
                       </select>
                     </div>

                     <div>
                       <label className="block text-[10px] font-black text-gray-900 uppercase mb-2 flex items-center gap-2">
                         <MessageSquare className="w-4 h-4 text-indigo-600" /> Formative Assessment Feedback
                       </label>
                       <textarea 
                         name="feedback" 
                         placeholder="Synthesize student performance details here..."
                         defaultValue={evaluating.feedback || ""}
                         className="w-full border-4 border-gray-900 px-4 py-3 outline-none font-bold h-32 focus:bg-indigo-50 resize-none transition-colors"
                       ></textarea>
                     </div>
                   </div>
                </div>

                <div className="p-6 bg-gray-50 border-t-4 border-gray-900 flex justify-end gap-3">
                   <button type="button" onClick={() => setEvaluating(null)} className="px-6 py-2 border-2 border-gray-900 font-black uppercase text-xs hover:bg-white transition-all shadow-md">Discard</button>
                   <button type="submit" className="px-12 py-3 bg-indigo-700 text-white font-black uppercase text-sm hover:bg-black transition-all flex items-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
                      <Save className="w-5 h-5" /> Commit Evaluation
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
