import { useEffect, useMemo, useState } from "react";

const stages = [
  "Initializing System...",
  "Loading Security Modules...",
  "Establishing Secure Environment...",
  "System Ready",
];

const CyberDashboardLoader = () => {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => Math.min(s + 1, stages.length - 1));
      setProgress((p) => Math.min(100, p + 24));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const ready = useMemo(() => stage >= stages.length - 1, [stage]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0a0f1c]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-0 animate-[scan_3s_linear_infinite] bg-[linear-gradient(to_bottom,transparent,rgba(0,229,255,0.18),transparent)]" />

      <div className="relative flex h-full flex-col items-center justify-center gap-10">
        <div className="text-center">
          <h1 className="animate-pulse text-5xl font-semibold tracking-[0.35em] text-cyan-300 [text-shadow:0_0_22px_rgba(0,229,255,0.8)]">E-VARA</h1>
        </div>

        <div className="relative h-44 w-44">
          <div className="absolute inset-0 rounded-full border border-cyan-300/30" />
          <div className="absolute inset-3 rounded-full border border-cyan-300/50" />
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-300 animate-spin" />
          <div className="absolute inset-[38%] rounded-full bg-cyan-300 shadow-[0_0_26px_rgba(0,229,255,0.9)]" />
        </div>

        <div className="w-[90%] max-w-xl rounded-xl border border-cyan-400/30 bg-slate-900/70 p-5">
          <p className="text-center text-cyan-100">{stages[stage]}</p>
          <div className="mt-4 h-1.5 rounded bg-slate-800">
            <div className="h-full rounded bg-cyan-300 transition-all duration-700" style={{ width: `${progress}%`, boxShadow: "0 0 16px #00e5ff" }} />
          </div>
          {ready && <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-cyan-200">System Ready</p>}
        </div>
      </div>
      <style>{`@keyframes scan {0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}`}</style>
    </div>
  );
};

export default CyberDashboardLoader;
