import { useState, useCallback, useMemo } from "react";
import { Shield, LogOut, History } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import FaceScan from "@/components/FaceScan";
import IdentityForm from "@/components/IdentityForm";
import MonitoringFeed, { type AlertItem } from "@/components/MonitoringFeed";
import ToolsPanel from "@/components/ToolsPanel";
import { SearchResultsIntelligence } from "@/components/SearchResultsIntelligence";
import AlertHistory from "@/pages/AlertHistory";
import FuturisticSplash from "@/components/FuturisticSplash";
import ThreatScanPanel from "@/components/ThreatScanPanel";

interface DashboardProps { onLogout: () => void; }

const Dashboard = ({ onLogout }: DashboardProps) => {
  const { user, logout, getIdentity, saveIdentity } = useAuth();
  const [identity, setIdentity] = useState(getIdentity());
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [scanCount, setScanCount] = useState(() => (getIdentity()?.faceImage ? 1 : 0));
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [monitoringStart, setMonitoringStart] = useState<Date | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [booting, setBooting] = useState(true);

  const riskScore = useMemo(() => Math.min(100, 32 + alerts.length * 6 + (monitoringActive ? 16 : 0) + scanCount * 4), [alerts.length, monitoringActive, scanCount]);
  const riskLevel = riskScore >= 70 ? "High" : riskScore >= 45 ? "Medium" : "Low";

  const handleFaceComplete = useCallback((imageData: string) => {
    const current = getIdentity();
    const updated = { ...(current || { fullName: "", username: "", socialLink: "", keywords: "" }), faceImage: imageData };
    saveIdentity(updated); setIdentity(updated); setScanCount((c) => c + 1);
  }, [getIdentity, saveIdentity]);

  const handleIdentitySave = useCallback((data: { fullName: string; username: string; socialLink: string; keywords: string }) => {
    const updated = { ...data, faceImage: getIdentity()?.faceImage || null };
    saveIdentity(updated); setIdentity(updated);
  }, [getIdentity, saveIdentity]);

  if (showHistory) return <AlertHistory alerts={alerts} onBack={() => setShowHistory(false)} />;

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-cyan-100">
      {booting && <FuturisticSplash onDone={() => setBooting(false)} />}
      <header className="sticky top-0 z-10 border-b border-cyan-500/30 bg-[#0a0f1c]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-cyan-300" /><h1 className="text-sm font-semibold tracking-[0.2em]">E-VARA</h1></div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHistory(true)} className="rounded border border-cyan-500/40 px-2 py-1 text-xs"> <History className="h-3 w-3" /> </button>
            <span className="hidden text-xs text-cyan-300/70 lg:inline">{user?.email}</span>
            <button onClick={() => { logout(); onLogout(); }} className="rounded border border-cyan-500/40 px-2 py-1 text-xs"> <LogOut className="h-3 w-3" /> </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
        <section className="grid gap-3 rounded-xl border border-cyan-500/30 bg-[#0b1224] p-4 md:grid-cols-[150px_1fr_1fr_1fr]">
          <div className="relative mx-auto h-28 w-28 rounded-full border-4 border-cyan-500/40">
            <div className="absolute inset-1 rounded-full border border-cyan-300/40" />
            <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">{riskScore}%</div>
          </div>
          <div className="md:col-span-3 grid gap-2 sm:grid-cols-3">
            <QuickStat label="Your Digital Risk Level" value={riskLevel} />
            <QuickStat label="Threats detected" value={String(alerts.length)} />
            <QuickStat label="Last scan time" value={monitoringStart ? monitoringStart.toLocaleTimeString() : "N/A"} />
          </div>
        </section>

        <ThreatScanPanel />

        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4"><FaceScan onComplete={handleFaceComplete} existingImage={identity?.faceImage || null} /><IdentityForm onSave={handleIdentitySave} initial={identity} /><ToolsPanel identity={identity} /></div>
          <div className="space-y-4"><MonitoringFeed fullName={identity?.fullName || ""} username={identity?.username || ""} keywords={identity?.keywords || ""} onAlertsChange={setAlerts} onMonitoringChange={(a, t) => { setMonitoringActive(a); setMonitoringStart(t); }} /><SearchResultsIntelligence fullName={identity?.fullName || ""} username={identity?.username || ""} /></div>
        </div>
      </main>
    </div>
  );
};

const QuickStat = ({ label, value }: { label: string; value: string }) => <div className="rounded border border-cyan-600/30 bg-cyan-950/10 p-3"><p className="text-[10px] uppercase tracking-[0.15em] text-cyan-300">{label}</p><p className="text-lg text-cyan-100">{value}</p></div>;

export default Dashboard;
