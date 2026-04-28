import { useState, useEffect } from "react";
import { Bell, ScanFace, Clock } from "lucide-react";

interface StatsCardsProps {
  alertCount: number;
  scanCount: number;
  monitoringActive: boolean;
  monitoringStartTime: Date | null;
}

const Ring = ({ value, color }: { value: number; color: string }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, value) / 100) * circumference;

  return (
    <svg className="h-14 w-14 -rotate-90" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r={radius} stroke="hsl(var(--border)/0.4)" strokeWidth="6" fill="none" />
      <circle cx="32" cy="32" r={radius} stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} />
    </svg>
  );
};

const StatsCards = ({ alertCount, scanCount, monitoringActive, monitoringStartTime }: StatsCardsProps) => {
  const [uptime, setUptime] = useState("00:00:00");
  const [liveAlertCount, setLiveAlertCount] = useState(alertCount);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveAlertCount((prev) => {
        if (!monitoringActive) return alertCount;
        if (prev < alertCount) return prev + 1;
        return prev;
      });
    }, 250);
    return () => clearInterval(id);
  }, [alertCount, monitoringActive]);

  useEffect(() => {
    if (!monitoringActive || !monitoringStartTime) {
      setUptime("00:00:00");
      return;
    }
    const tick = () => {
      const diff = Math.floor((Date.now() - monitoringStartTime.getTime()) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [monitoringActive, monitoringStartTime]);

  const cards = [
    { icon: Bell, label: "Total Alerts", value: String(liveAlertCount), ring: Math.min(100, liveAlertCount * 10), color: "hsl(var(--severity-high))" },
    { icon: ScanFace, label: "Scans Complete", value: String(scanCount), ring: Math.min(100, scanCount * 20), color: "hsl(var(--primary))" },
    { icon: Clock, label: "Uptime", value: uptime, ring: monitoringActive ? 85 : 10, color: "hsl(var(--severity-low))" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((card, i) => (
        <div key={card.label} className="neon-panel lift-3d relative overflow-hidden rounded-xl border border-primary/25 p-4" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}>
          <div className="scanline" />
          <div className="mb-2 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <card.icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{card.label}</span>
            </div>
            {card.label === "Uptime" && monitoringActive && <span className="monitor-pulse h-2 w-2 rounded-full bg-primary" />}
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg font-mono font-bold tabular-nums text-foreground">{card.value}</p>
            <Ring value={card.ring} color={card.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
