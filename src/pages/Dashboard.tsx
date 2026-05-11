import { useState, useCallback, useMemo, useEffect } from "react";
import { Shield, LogOut, History, Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import FaceScan from "@/components/FaceScan";
import IdentityForm from "@/components/IdentityForm";
import MonitoringFeed, { type AlertItem } from "@/components/MonitoringFeed";
import ToolsPanel from "@/components/ToolsPanel";
import { SearchResultsIntelligence } from "@/components/SearchResultsIntelligence";
import AlertHistory from "@/pages/AlertHistory";
import FuturisticThreatConsole from "@/components/FuturisticThreatConsole";
import CyberDashboardLoader from "@/components/CyberDashboardLoader";

interface DashboardProps { onLogout: () => void; }

const scanPhases = ["Scanning Digital Footprint...", "Tracking Data Sources...", "Analyzing Behavioral Patterns...", "Detecting Threat Signatures..."];

const Dashboard = ({ onLogout }: DashboardProps) => {
  const { user, logout, getIdentity, saveIdentity } = useAuth();
  const [identity, setIdentity] = useState(getIdentity());
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [scanCount, setScanCount] = useState(() => (getIdentity()?.faceImage ? 1 : 0));
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [monitoringStart, setMonitoringStart] = useState<Date | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 5200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setScanStage((s) => (s + 1) % (scanPhases.length + 1)), 2200);
    return () => clearInterval(id);
  }, []);

  const riskScore = useMemo(() => Math.min(100, 32 + alerts.length * 5 + scanCount * 7 + (monitoringActive ? 12 : 0)), [alerts.length, scanCount, monitoringActive]);
  const threatLevel = riskScore > 70 ? "HIGH" : riskScore > 45 ? "MEDIUM" : "LOW";
  const threatColor = threatLevel === "HIGH" ? "text-red-400" : threatLevel === "MEDIUM" ? "text-orange-300" : "text-cyan-300";

  const handleLogout = () => { logout(); onLogout(); };
  const handleFaceComplete = useCallback((imageData: string) => {
    const current = getIdentity();
    const updated = { ...(current || { fullName: "", username: "", socialLink: "", keywords: "" }), faceImage: imageData };
    saveIdentity(updated); setIdentity(updated); setScanCount((c) => c + 1);
  }, [getIdentity, saveIdentity]);
  const handleIdentitySave = useCallback((data: { fullName: string; username: string; socialLink: string; keywords: string }) => {
    const current = getIdentity(); const updated = { ...data, faceImage: current?.faceImage || null }; saveIdentity(updated); setIdentity(updated);
  }, [getIdentity, saveIdentity]);

  const handleAlertsChange = useCallback((newAlerts: AlertItem[]) => {
    setAlerts(newAlerts);
  }, []);

  const handleMonitoringChange = useCallback((active: boolean, startTime: Date | null) => {
    setMonitoringActive(active);
    setMonitoringStart(startTime);
  }, []);

  const isSetupComplete = identity?.faceImage && identity?.fullName;


  if (booting) {
    return <CyberDashboardLoader />;
  }

  if (showHistory) {
    return <AlertHistory alerts={alerts} onBack={() => setShowHistory(false)} />;
  }

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
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Risk Distribution"><div className="h-64"><ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>{pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></ChartCard>
        <ChartCard title="Security Category Analysis"><div className="h-64"><ResponsiveContainer><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2f48" /><XAxis dataKey="name" stroke="#9adfff" /><YAxis stroke="#9adfff" /><Tooltip /><Bar dataKey="risk" fill="#00e5ff" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></ChartCard>
      </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4 lg:sticky lg:top-[57px] lg:self-start">
            <FaceScan onComplete={handleFaceComplete} existingImage={identity?.faceImage || null} />
            <IdentityForm onSave={handleIdentitySave} initial={identity} />
            <ToolsPanel identity={identity} />
          </div>
          <div className="md:col-span-3 grid gap-2 sm:grid-cols-3">
            <QuickStat label="Your Digital Risk Level" value={riskLevel} />
            <QuickStat label="Threats detected" value={String(alerts.length)} />
            <QuickStat label="Last scan time" value={monitoringStart ? monitoringStart.toLocaleTimeString() : "N/A"} />
          </div>
        </section>

          <div className="space-y-4">
            {isSetupComplete ? (
              <>
                <FuturisticThreatConsole alertCount={alerts.length} />
                <MonitoringFeed
                  fullName={identity!.fullName}
                  username={identity!.username}
                  keywords={identity!.keywords || ""}
                  onAlertsChange={handleAlertsChange}
                  onMonitoringChange={handleMonitoringChange}
                />
                <SearchResultsIntelligence fullName={identity!.fullName} username={identity!.username} />
              </>
            ) : (
              <div className="glass-panel rounded-xl p-8 text-center sm:p-12">
                <Shield className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Complete identity verification and profile metadata to activate the cyber intelligence layer.
                </p>
              </div>
            )}

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
