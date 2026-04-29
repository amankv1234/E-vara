import { useState, useCallback, useMemo, useEffect } from "react";
import { Shield, LogOut, History, Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
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
  const { theme, toggle: toggleTheme } = useTheme();
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
    <div className="neon-bg min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/70 backdrop-blur-md neon-outline">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Shield className="h-5 w-5 shrink-0 text-primary" />
            <h1 className="neon-title truncate text-sm font-bold tracking-tight text-foreground">E-Vara</h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleTheme}
              className="neon-button inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1.5 text-[10px] text-muted-foreground transition-colors hover:border-foregr[...]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="neon-button inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1.5 text-[10px] text-muted-foreground transition-colors hover:border-foregr[...]"
            >
              <History className="h-3 w-3" />
              <span className="hidden sm:inline">History</span>
            </button>
            <span className="hidden text-xs text-muted-foreground lg:inline">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="neon-button inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1.5 text-[10px] text-muted-foreground transition-colors hover:border-foreg[...]"
            >
              <LogOut className="h-3 w-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
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

            <div className="glass-panel rounded-xl p-4">
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                E-Vara is a prototype monitoring tool designed to help users identify potential identity misuse online.
                No real web scraping occurs during this demonstration.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
