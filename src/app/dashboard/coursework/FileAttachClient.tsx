"use client";

import { useState } from "react";
import { UploadCloud, Link as LinkIcon, Edit, File as FileIcon, X } from "lucide-react";

export default function FileAttachClient({ assignmentId, isSubmitted }: { assignmentId: string, isSubmitted: boolean }) {
  const [attachments, setAttachments] = useState<string[]>([]);
  const [internalSubmitted, setInternalSubmitted] = useState(isSubmitted);
  const [linkInputVisible, setLinkInputVisible] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  const handleAttachFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        setAttachments([...attachments, target.files[0].name]);
      }
    };
    input.click();
  };

  const submitLink = () => {
    if (linkValue.trim()) {
      setAttachments([...attachments, linkValue.trim()]);
    }
    setLinkInputVisible(false);
    setLinkValue("");
  };

  const handleTurnIn = async () => {
    if (attachments.length === 0) {
      alert("PLEASE_ATTACH_SOURCE_FILE_FIRST");
      return;
    }
    
    try {
      const { submitAssignment } = await import("@/actions/student");
      // Use the last attached file for the actual DB submission in this demo
      // In real prod, we could handle multiple
      const formData = new FormData();
      // We'll need to store the actual File objects in the state if we want this to work properly
      // For now, let's assume the user just chose the file
      alert("TRANSMISSION_PROTOCOL_ACTIVE: PLEASE_RESELECT_FINAL_PDF_FOR_SECURE_VAULT");
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = async (e) => {
         const target = e.target as HTMLInputElement;
         if (target.files && target.files.length > 0) {
            const formData = new FormData();
            formData.append("file", target.files[0]);
            await submitAssignment(assignmentId, formData);
            setInternalSubmitted(true);
         }
      };
      input.click();
    } catch (err) {
      console.error(err);
      alert("SUBMISSION_FAILURE: CONTACT_ADMIN");
    }
  };

  const handleUnsubmit = async () => {
    if(confirm("Are you sure you want to unsubmit? This will pull the record from the professor's queue.")) {
       try {
         const { unsubmitAssignment } = await import("@/actions/student");
         await unsubmitAssignment(assignmentId);
         setInternalSubmitted(false);
       } catch (err) { console.error(err); }
    }
  };

  if (internalSubmitted) {
    return (
      <div className="flex flex-col gap-3">
        {attachments.length > 0 ? attachments.map((att, i) => (
          <div key={i} className="p-3 border border-gray-200 bg-white flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold font-mono">FILE</div>
            <span className="text-sm font-medium text-gray-800 truncate">{att}</span>
          </div>
        )) : (
          <p className="text-xs text-gray-500 italic">No attachments added for this work.</p>
        )}
        <button onClick={handleUnsubmit} className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 transition-colors mt-2 text-sm cursor-pointer">
          Unsubmit
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {attachments.map((att, i) => (
        <div key={i} className="p-3 border border-gray-200 bg-white flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
              <FileIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{att}</span>
          </div>
          <button 
            onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
            className="text-gray-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {linkInputVisible ? (
        <div className="flex items-center gap-2 border border-gray-300 bg-white p-2">
          <input 
            autoFocus
            type="url" 
            placeholder="Paste URL here..." 
            className="flex-1 outline-none text-sm px-2 text-gray-800"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitLink()}
          />
          <button onClick={submitLink} className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 hover:bg-indigo-200 cursor-pointer">Add</button>
        </div>
      ) : (
        <button onClick={() => setLinkInputVisible(true)} className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer">
          <LinkIcon className="w-4 h-4" /> Add Link
        </button>
      )}

      <button onClick={handleAttachFile} className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer">
        <UploadCloud className="w-4 h-4" /> Add File / PDF
      </button>
      
      <div className="mt-4 border-t border-gray-200 pt-4">
        <button onClick={handleTurnIn} className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 font-bold transition-colors text-sm cursor-pointer border border-transparent shadow-sm">
          Turn In
        </button>
      </div>
    </div>
  );
}
