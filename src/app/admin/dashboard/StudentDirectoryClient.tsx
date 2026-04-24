"use client";

import { useState, useMemo } from "react";
import { Search, Edit3, ShieldAlert, Save, X, Activity, Filter, ArrowUpDown, Download } from "lucide-react";
import { updateStudentProfile, toggleProxyFlag } from "@/actions/admin";

export default function StudentDirectoryClient({ students }: { students: any[] }) {
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [proxyFilter, setProxyFilter] = useState("ALL");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredStudents = useMemo(() => {
    let result = students.filter(s => 
      s.name?.toLowerCase().includes(search.toLowerCase()) || 
      s.enrollmentId?.toLowerCase().includes(search.toLowerCase())
    );

    if (proxyFilter !== "ALL") {
      result = result.filter(s => s.proxyFlag === (proxyFilter === "FLAGGED"));
    }

    result.sort((a, b) => {
      let valA, valB;
      if (sortField === "marks") {
        valA = a.marks?.[0] ? (((a.marks[0].midTerm || 0) / 2) + (a.marks[0].endSem || 0) + (a.marks[0].cap || 0) + (a.marks[0].etip || 0)) : 0;
        valB = b.marks?.[0] ? (((b.marks[0].midTerm || 0) / 2) + (b.marks[0].endSem || 0) + (b.marks[0].cap || 0) + (b.marks[0].etip || 0)) : 0;
      } else {
        valA = a[sortField] || "";
        valB = b[sortField] || "";
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, search, proxyFilter, sortField, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleExport = () => {
    const headers = ["Name", "Enrollment ID", "Total Score", "Proxy Status"];
    const rows = filteredStudents.map(s => {
      const marks = s.marks?.[0];
      const totalScore = marks ? (((marks.midTerm || 0) / 2) + (marks.endSem || 0) + (marks.cap || 0) + (marks.etip || 0)) : 0;
      return [
        s.name,
        s.enrollmentId,
        totalScore.toFixed(1),
        s.proxyFlag ? "FLAGGED" : "SECURE"
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `DevOps_Registry_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      enrollmentId: formData.get("enrollmentId"),
      marks: {
        midTerm: formData.get("midTerm"),
        endSem: formData.get("endSem"),
        cap: formData.get("cap"),
        etip: formData.get("etip"),
      }
    };
    
    await updateStudentProfile(editingStudent.id, data);
    setEditingStudent(null);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 flex items-center gap-2">
          <Activity className="w-4 h-4" /> [Database] Student Directory Security Registry
        </h2>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-900 font-black text-[10px] uppercase hover:bg-gray-900 hover:text-white transition-all shadow-md active:translate-y-1"
        >
          <Download className="w-3.5 h-3.5" /> Export DB (CSV)
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 border border-gray-300 shadow-sm mb-6">
        <div className="flex-1 min-w-[250px] flex items-center gap-2 border border-gray-300 px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-indigo-600 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Student Identity..." 
            className="bg-transparent outline-none text-xs font-bold w-full uppercase"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 bg-gray-50">
          <ShieldAlert className="w-4 h-4 text-gray-400" />
          <select 
            className="bg-transparent outline-none text-[10px] font-black uppercase cursor-pointer"
            value={proxyFilter}
            onChange={(e) => setProxyFilter(e.target.value)}
          >
            <option value="ALL">All Accounts</option>
            <option value="FLAGGED">Flagged Only</option>
            <option value="CLEAN">Clean Only</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 uppercase text-[10px] font-black text-gray-500 border-b-2 border-gray-900">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => toggleSort("name")}>
                <div className="flex items-center gap-2">Name / Enrollment <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-6 py-4">Security Level</th>
              <th className="px-6 py-4 text-right">System Console</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest bg-gray-50/50">
                  No Student Records Matched
                </td>
              </tr>
            )}
            {filteredStudents.map((stu: any) => {
              const marksList = stu.marks || [];
              const marks = marksList.length > 0 ? marksList[0] : null;
              const totalScore = marks ? (((marks.midTerm || 0) / 2) + (marks.endSem || 0) + (marks.cap || 0) + (marks.etip || 0)) : 0;
              
              return (
                <tr key={stu.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-black text-gray-900 uppercase">{stu.name}</div>
                    <div className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">{stu.enrollmentId}</div>
                  </td>
                  <td className="px-6 py-4">
                     <button 
                       onClick={() => toggleProxyFlag(stu.id, stu.proxyFlag)}
                       className={`flex items-center gap-1.5 px-3 py-1.5 font-black text-[9px] uppercase border-2 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${
                         stu.proxyFlag 
                         ? "bg-red-500 text-white border-black" 
                         : "bg-green-500 text-white border-black"
                       }`}
                     >
                       <ShieldAlert className="w-3.5 h-3.5" />
                       {stu.proxyFlag ? "FLAGGED" : "CLEAN"}
                     </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingStudent(stu)}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-black text-[10px] uppercase hover:bg-indigo-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                      <Edit3 className="w-4 h-4" /> Open Record
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-2xl border-4 border-gray-900">
             <form onSubmit={handleEditSubmit}>
                <div className="p-6 border-b-4 border-gray-900 flex justify-between items-center bg-gray-900 text-white">
                  <div>
                    <h3 className="font-black uppercase tracking-[0.2em] text-lg">System Registry Update</h3>
                    <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest leading-none mt-1">
                      UID_{editingStudent.id} • AGG_SCORE: {(() => {
                        const m = editingStudent.marks?.[0];
                        return m ? (((m.midTerm || 0) / 2) + (m.endSem || 0) + (m.cap || 0) + (m.etip || 0)).toFixed(1) : "0.0";
                      })()}
                    </p>
                  </div>
                  <button type="button" onClick={() => setEditingStudent(null)} className="hover:rotate-90 transition-transform"><X className="w-8 h-8 text-white hover:text-red-500" /></button>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-indigo-700 flex items-center gap-2 border-b border-indigo-100 pb-2">
                       <Activity className="w-4 h-4" /> Profile Integrity
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Legal Student Name</label>
                        <input name="name" defaultValue={editingStudent.name} className="w-full border-2 border-gray-200 px-4 py-3 outline-none focus:border-indigo-600 focus:bg-indigo-50 font-black transition-colors" required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Enrollment ID (Roll No.)</label>
                        <input name="enrollmentId" defaultValue={editingStudent.enrollmentId} className="w-full border-2 border-gray-200 px-4 py-3 outline-none focus:border-indigo-600 focus:bg-indigo-50 font-mono text-sm uppercase transition-colors" required />
                      </div>
                    </div>
                  </div>

                  {/* Academic Marks */}
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-indigo-700 flex items-center gap-2 border-b border-indigo-100 pb-2">
                       <Activity className="w-4 h-4" /> Academic Performance
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Mid-Term (30)</label>
                        <input name="midTerm" type="number" step="0.5" defaultValue={editingStudent.marks?.[0]?.midTerm || 0} className="w-full border-2 border-gray-200 px-4 py-3 outline-none focus:border-indigo-600 font-black" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">End-Term (60)</label>
                        <input name="endSem" type="number" step="0.5" defaultValue={editingStudent.marks?.[0]?.endSem || 0} className="w-full border-2 border-gray-200 px-4 py-3 outline-none focus:border-indigo-600 font-black" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">CAP (10)</label>
                        <input name="cap" type="number" step="0.5" defaultValue={editingStudent.marks?.[0]?.cap || 0} className="w-full border-2 border-gray-200 px-4 py-3 outline-none focus:border-indigo-600 font-black" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">ETIP (15)</label>
                        <input name="etip" type="number" step="0.5" defaultValue={editingStudent.marks?.[0]?.etip || 0} className="w-full border-2 border-gray-200 px-4 py-3 outline-none focus:border-indigo-600 font-black" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gray-50 border-t-4 border-gray-900 flex justify-end gap-3">
                   <button type="button" onClick={() => setEditingStudent(null)} className="px-8 py-3 border-4 border-gray-900 font-black uppercase text-xs hover:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">Discard Changes</button>
                   <button type="submit" className="px-12 py-3 bg-indigo-700 text-white font-black uppercase text-xs hover:bg-black transition-all flex items-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
                      <Save className="w-5 h-5" /> Commit to Registry
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </section>
  );
}
