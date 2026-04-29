import { ArrowLeft, ShieldAlert } from "lucide-react";
import type { AlertItem, AlertSeverity } from "@/components/MonitoringFeed";

interface AlertHistoryProps { alerts: AlertItem[]; onBack: () => void; }

const severityTone: Record<AlertSeverity, string> = {
  low: "border-yellow-400/60 text-yellow-300",
  medium: "border-orange-500/70 text-orange-300",
  high: "border-red-500/80 text-red-300",
};

const actionBySeverity: Record<AlertSeverity, string> = {
  low: "Review account activity and update passwords for inactive services.",
  medium: "Enable MFA and revoke unknown sessions on linked services.",
  high: "Suspicious login attempt detected. Recommended: Enable 2FA immediately.",
};

const AlertHistory = ({ alerts, onBack }: AlertHistoryProps) => (
  <div className="min-h-screen bg-[#0a0f1c] text-cyan-100">
    <header className="sticky top-0 z-10 border-b border-cyan-500/30 bg-[#0a0f1c]/95 p-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <button onClick={onBack} className="rounded border border-cyan-500/40 p-1"><ArrowLeft className="h-4 w-4" /></button>
        <h1 className="text-sm tracking-[0.2em]">ALERT INTELLIGENCE</h1>
      </div>
    </header>
    <main className="mx-auto max-w-4xl space-y-3 px-4 py-6">
      {alerts.map((alert) => (
        <article key={alert.id} className={`rounded-xl border bg-[#0b1224] p-4 ${severityTone[alert.severity]}`}>
          <div className="mb-2 flex items-center justify-between"><p className="text-xs uppercase tracking-[0.2em]">Threat Type: {alert.severity}</p><ShieldAlert className="h-4 w-4" /></div>
          <p className="text-sm text-cyan-100">{alert.message}</p>
          <p className="mt-2 text-xs text-cyan-300/80">Short explanation: Potential abnormal behavior tied to monitored digital footprint entities.</p>
          <p className="mt-1 text-xs">Suggested action: {actionBySeverity[alert.severity]}</p>
        </article>
      ))}
      {alerts.length === 0 && <div className="rounded-xl border border-cyan-600/30 bg-[#0b1224] p-8 text-center text-sm">No alerts detected.</div>}
    </main>
  </div>
);

export default AlertHistory;
