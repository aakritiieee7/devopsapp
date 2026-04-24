"use client";

import { FileText, CheckCircle, XCircle, ExternalLink, Search, Calendar, Filter } from "lucide-react";
import { approveMedical, rejectMedical } from "@/actions/admin";
import { useState, useMemo } from "react";

export default function ApprovalsClient({ pendingDocs }: { pendingDocs: any[] }) {
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredDocs = useMemo(() => {
    return pendingDocs.filter(doc => {
      const matchesSearch = 
        doc.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
        doc.user?.enrollmentId?.toLowerCase().includes(search.toLowerCase());
      
      const matchesDate = !dateFilter || new Date(doc.session?.startTime).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
      
      const matchesStatus = statusFilter === "ALL" || doc.justificationStatus === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [pendingDocs, search, dateFilter, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Search & Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 border border-gray-300 shadow-sm">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 border border-gray-300 px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-indigo-600 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Student..." 
            className="bg-transparent outline-none text-xs font-bold w-full uppercase"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-indigo-600 transition-all">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input 
            type="date" 
            className="bg-transparent outline-none text-xs font-bold uppercase cursor-pointer"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-indigo-600 transition-all">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            className="bg-transparent outline-none text-[10px] font-black uppercase cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        { (search || dateFilter || statusFilter !== "ALL") && (
          <button 
            onClick={() => { setSearch(""); setDateFilter(""); setStatusFilter("ALL"); }}
            className="text-[10px] font-black text-red-600 uppercase hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 uppercase text-[10px] font-black text-gray-500 border-b-2 border-gray-900">
            <tr>
              <th className="px-6 py-4">Student Identity</th>
              <th className="px-6 py-4">Missed Session</th>
              <th className="px-6 py-4">Audit Trace</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDocs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest bg-gray-50/50">
                  No Records Matching Current Filters
                </td>
              </tr>
            )}
            {filteredDocs.map((doc: any) => (
              <tr key={doc.id} className={`${doc.justificationStatus === 'PENDING' ? 'bg-indigo-50/20' : ''} hover:bg-gray-50 transition-colors`}>
                <td className="px-6 py-4 font-bold text-gray-900">
                  <p className="uppercase">{doc.user?.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono font-normal uppercase tracking-tighter">{doc.user?.enrollmentId}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-800 uppercase text-xs">{doc.session?.subject}</span>
                  <br/>
                  <span className="text-[10px] text-indigo-700 font-black uppercase tracking-tight">{new Date(doc.session?.startTime).toDateString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    {doc.medicalDocUrl ? (
                      <button 
                        onClick={() => setViewingDoc(doc)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white font-black text-[10px] uppercase hover:bg-indigo-600 transition shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Proof
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-gray-300 italic uppercase">Trace Missing</span>
                    )}
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 border w-fit ${
                      doc.justificationStatus === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                      doc.justificationStatus === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {doc.justificationStatus || 'PENDING'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => approveMedical(doc.id)}
                      disabled={doc.justificationStatus === 'APPROVED'}
                      className="px-4 py-2 bg-green-600 text-white font-black text-[10px] uppercase hover:bg-green-700 transition shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => rejectMedical(doc.id)}
                      disabled={doc.justificationStatus === 'REJECTED'}
                      className="px-4 py-2 bg-red-600 text-white font-black text-[10px] uppercase hover:bg-red-700 transition shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Doc Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-none shadow-2xl max-w-4xl w-full flex flex-col border-4 border-gray-900">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-black uppercase tracking-widest text-gray-900">Medical Certificate Viewer</h3>
              <button 
                onClick={() => setViewingDoc(null)}
                className="text-gray-500 hover:text-red-600 font-bold text-2xl"
              >×</button>
            </div>
            <div className="p-8 flex-1 bg-gray-200 min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="bg-white p-12 border-4 border-gray-900 max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-bold mb-4 italic truncate max-w-full">Asset ID: {viewingDoc.id}</p>
                <div className="p-6 bg-gray-50 border border-gray-300 mb-6 text-sm text-left">
                  <p className="font-bold text-gray-900 mb-2 underline tracking-widest uppercase text-xs">Security Clearance:</p>
                  <p className="text-xs text-gray-600 font-medium italic">Verified link established. Source file is ready to stream from the secure vault.</p>
                </div>
                <button 
                  onClick={() => window.open(`/api/docs/medical/${viewingDoc.id}`, '_blank')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-black uppercase text-xs hover:bg-indigo-600 transition mx-auto shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" /> Stream Source File
                </button>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t-2 border-gray-200 text-right">
               <button onClick={() => setViewingDoc(null)} className="px-8 py-2 border-2 border-gray-900 font-black uppercase text-xs hover:bg-white transition-all shadow-md active:translate-y-1">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
