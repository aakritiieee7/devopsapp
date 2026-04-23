"use client";

import { useState, useEffect } from "react";
import { CheckSquare } from "lucide-react";

export default function ClientTimer({ endTime, sessionId }: { endTime: Date, sessionId: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const handleMark = async () => {
    // In a real app this would call a server action
    // We simulate the success state for the UI
    setAttendanceMarked(true);
  };

  return (
    <>
      <p className="text-sm text-gray-500 mb-4 font-mono font-semibold text-indigo-600">
        Time Remaining: {timeLeft}
      </p>
      
      {!attendanceMarked ? (
        <button 
          onClick={handleMark}
          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 rounded-none transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckSquare className="w-5 h-5" />
          Mark Attendance Present
        </button>
      ) : (
        <div className="w-full bg-green-100 border border-green-300 text-green-800 font-bold py-2 rounded-none flex items-center justify-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Attendance Successfully Captured
        </div>
      )}
    </>
  );
}
