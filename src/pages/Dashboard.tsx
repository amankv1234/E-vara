import { useState, useCallback, useMemo, useEffect } from "react";
import { Shield, LogOut, History, Sun, Moon, TrendingUp, TriangleAlert, Clock3 } from "lucide-react";
import { Cell, Pie, PieChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import FaceScan from "@/components/FaceScan";
import IdentityForm from "@/components/IdentityForm";
import MonitoringFeed, { type AlertItem } from "@/components/MonitoringFeed";
import ToolsPanel from "@/components/ToolsPanel";
import { SearchResultsIntelligence } from "@/components/SearchResultsIntelligence";
import AlertHistory from "@/pages/AlertHistory";
import CyberIntelligenceSuite from "@/components/CyberIntelligenceSuite";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import ScanStep from "@/components/ScanStep";

interface DashboardProps { onLogout: () => void; }

const scanPhases = ["Scanning Digital Footprint...", "Tracking Data Sources...", "Analyzing Behavioral Patterns...", "Detecting Threat Signatures..."];

const Dashboard = ({ onLogout }: DashboardProps) => {
  const { user, logout, getIdentity, saveIdentity } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const [identity, setIdentity] = useState(getIdentity());
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [scanCount, setScanCount] = useState(() => (getIdentity()?.faceImage ? 1 : 0));
  const [monitoringActive, setMonitoringActive] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
  const [scanStage, setScanStage] = useState(0);

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

  if (showHistory) return <AlertHistory alerts={alerts} onBack={() => setShowHistory(false)} />;

  const pieData = [
    { name: "Safe", value: Math.max(10, 100 - riskScore), color: "#00e5ff" },
    { name: "Vulnerable", value: Math.min(45, Math.round(riskScore * 0.6)), color: "#1d4ed8" },
    { name: "High Risk", value: Math.min(40, Math.round(riskScore * 0.4)), color: "#f97316" },
  ];
  const barData = [
    { name: "Social", risk: Math.min(100, riskScore + 8) },
    { name: "Email", risk: Math.min(100, riskScore - 4) },
    { name: "Password", risk: Math.max(10, riskScore - 12) },
    { name: "Device", risk: Math.min(100, riskScore + 3) },
  ];

  return <div className="min-h-screen bg-[#0a0f1c] text-white">
    <header className="sticky top-0 z-10 border-b border-cyan-500/20 bg-[#0a0f1c]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-cyan-300" /><h1 className="text-sm font-semibold tracking-[0.2em]">E-VARA</h1></div>
        <div className="flex items-center gap-2"><button onClick={toggleTheme}>{theme === "dark" ? <Sun className="h-4 w-4 text-cyan-200" /> : <Moon className="h-4 w-4 text-cyan-200" />}</button><button onClick={() => setShowHistory(true)}><History className="h-4 w-4 text-cyan-200" /></button><button onClick={handleLogout}><LogOut className="h-4 w-4 text-cyan-200" /></button></div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={<TriangleAlert className="h-4 w-4" />} label="Threats detected" value={String(alerts.length)} accent={threatLevel === "HIGH" ? "red" : "orange"} />
        <StatCard icon={<Clock3 className="h-4 w-4" />} label="Last scan time" value={new Date().toLocaleTimeString()} subtext="Most recent telemetry" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Risk trend" value={riskScore > 60 ? "Rising" : "Stable"} subtext={`Your Digital Risk Level: ${threatLevel}`} />
      </div>

      <div className="rounded-xl border border-cyan-500/30 bg-[#0b1324] p-4">
        <p className="text-xs tracking-[0.2em] text-cyan-200">MILITARY-STYLE SCAN SCREEN</p>
        <p className="mt-2 text-lg text-cyan-100">{scanPhases[Math.min(scanStage, scanPhases.length - 1)]}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">{scanPhases.map((step, i) => <ScanStep key={step} text={step} active={i === scanStage % scanPhases.length} done={i < (scanStage % (scanPhases.length + 1))} />)}</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-xs text-slate-400">Threat Level</p><p className={`text-xl font-semibold ${threatColor}`}>{threatLevel}</p></div>
          <div><p className="text-xs text-slate-400">Risk Score</p><p className="text-xl font-semibold text-cyan-300">{riskScore}%</p></div>
          <div><p className="text-xs text-slate-400">Chance of Account Compromise</p><p className="text-orange-300">{Math.min(95, riskScore - 4)}%</p></div>
          <div><p className="text-xs text-slate-400">Data Exposure / Identity Misuse</p><p className="text-rose-300">{Math.round(riskScore * 0.75)}% / {Math.round(riskScore * 0.57)}%</p></div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Risk Distribution"><div className="h-64"><ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>{pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></ChartCard>
        <ChartCard title="Security Category Analysis"><div className="h-64"><ResponsiveContainer><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2f48" /><XAxis dataKey="name" stroke="#9adfff" /><YAxis stroke="#9adfff" /><Tooltip /><Bar dataKey="risk" fill="#00e5ff" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]"><div className="space-y-4"><FaceScan onComplete={handleFaceComplete} existingImage={identity?.faceImage || null} /><IdentityForm onSave={handleIdentitySave} initial={identity} /><ToolsPanel identity={identity} /></div><div className="space-y-4"><CyberIntelligenceSuite fullName={identity?.fullName || ""} username={identity?.username || ""} alertCount={alerts.length} monitoringActive={monitoringActive} /><MonitoringFeed fullName={identity?.fullName || "Unknown"} username={identity?.username || "unknown"} keywords={identity?.keywords || ""} onAlertsChange={setAlerts} onMonitoringChange={(a) => { setMonitoringActive(a); }} /><SearchResultsIntelligence fullName={identity?.fullName || ""} username={identity?.username || ""} /></div></div>
    </main>
  </div>;
};

export default Dashboard;
