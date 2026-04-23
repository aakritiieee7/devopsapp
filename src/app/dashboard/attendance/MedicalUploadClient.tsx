"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function MedicalUploadClient({ recordId, initialStatus }: { recordId: string, initialStatus: string }) {
  const [uploaded, setUploaded] = useState(initialStatus !== "NONE");

  const handleUpload = async () => {
    // Hidden file picker mock
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,image/*';
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        try {
          const { submitJustification } = await import("./attendanceActions");
          const formData = new FormData();
          formData.append("file", file);
          await submitJustification(recordId, formData);
          setUploaded(true);
        } catch (err) {
          console.error(err);
          alert("Upload failed. Please try again.");
        }
      }
    };
    input.click();
  };

  if (uploaded) {
    return (
      <span className="flex items-center gap-2 text-xs font-bold text-yellow-800 bg-yellow-100 px-3 py-1.5 border border-yellow-300">
        <CheckCircle2 className="w-4 h-4" /> Justification Under Review (Pending Prof.)
      </span>
    );
  }

  return (
    <button onClick={handleUpload} className="flex items-center gap-2 text-xs font-bold bg-white border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer w-full justify-center">
      <UploadCloud className="w-4 h-4 text-indigo-600" />
      Attach Medical / Leave Doc
    </button>
  );
}
