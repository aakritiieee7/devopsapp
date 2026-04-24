export default function VersionFooter() {
  const version = "1.0.4-devops";
  const env = process.env.NODE_ENV || "development";
  
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-900 border-t-2 border-indigo-500 py-1.5 px-4 z-50 flex items-center justify-between pointer-events-none opacity-80">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">System Output:</span>
          <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">v{version}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Registry Status:</span>
          <span className="text-[10px] font-mono font-bold text-green-400 tracking-widest uppercase">Operational</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Environment:</span>
        <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">env: production</span>
      </div>
    </footer>
  );
}
