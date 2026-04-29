import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, TrendingUp } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const scanFlow = [
  "Scanning Digital Footprint...",
  "Tracking Data Sources...",
  "Analyzing Behavioral Patterns...",
  "Detecting Threat Signatures...",
];

const pieData = [
  { name: "Safe", value: 36, color: "#22d3ee" },
  { name: "Vulnerable", value: 38, color: "#2563eb" },
  { name: "High Risk", value: 26, color: "#f97316" },
];

const barData = [
  { category: "Social Media Risk", value: 78 },
  { category: "Email Security", value: 65 },
  { category: "Password Strength", value: 52 },
  { category: "Device Exposure", value: 69 },
];

const ThreatScanPanel = () => {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next >= scanFlow.length) {
          setComplete(true);
          clearInterval(id);
          return prev;
        }
        return next;
      });
    }, 1300);

    return () => clearInterval(id);
  }, []);

  return <div className="rounded-xl border border-cyan-500/30 bg-[#0a0f1c] p-4 text-cyan-100 shadow-[0_0_24px_rgba(0,229,255,.08)]">
    <h2 className="mb-3 text-sm uppercase tracking-[0.25em] text-cyan-300">Threat Scan Engine</h2>
    {!complete ? <div className="space-y-2">{scanFlow.map((s, i) => <div key={s} className={`rounded border p-2 text-xs tracking-wider transition-all ${i <= step ? "border-cyan-400/70 bg-cyan-500/10 shadow-[0_0_14px_rgba(0,229,255,.18)]" : "border-cyan-900/70 bg-transparent text-cyan-900"}`}>{s}</div>)}</div> :
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <StatCard icon={ShieldAlert} label="Threat Level" value="HIGH" tone="text-orange-400" />
          <StatCard icon={TrendingUp} label="Risk Score" value="72%" tone="text-cyan-300" />
        </div>
        <div className="rounded border border-cyan-900/60 p-3 text-xs">
          <p>Chance of Account Compromise: <span className="text-orange-300">68%</span></p>
          <p>Data Exposure Risk: <span className="text-orange-300">54%</span></p>
          <p>Identity Misuse Risk: <span className="text-orange-300">41%</span></p>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <ChartCard title="Risk Distribution"><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>{pieData.map((e) => <Cell key={e.name} fill={e.color} />)}</Pie></PieChart></ResponsiveContainer></ChartCard>
          <ChartCard title="Security Surface"><ResponsiveContainer width="100%" height={220}><BarChart data={barData}><XAxis dataKey="category" tick={{ fill: "#8fdfff", fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={56} /><YAxis tick={{ fill: "#8fdfff", fontSize: 10 }} /><Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#00e5ff" /></BarChart></ResponsiveContainer></ChartCard>
        </div>
      </div>}
  </div>;
};

const StatCard = ({ icon: Icon, label, value, tone }: { icon: typeof AlertTriangle; label: string; value: string; tone: string }) => (
  <div className="rounded border border-cyan-600/40 bg-cyan-950/10 p-3">
    <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cyan-400"><Icon className="h-4 w-4" />{label}</div>
    <div className={`text-2xl font-semibold tracking-widest ${tone}`}>{value}</div>
  </div>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded border border-cyan-900/80 bg-[#070b15] p-2">
    <p className="mb-2 px-2 text-[11px] uppercase tracking-[0.18em] text-cyan-300">{title}</p>
    {children}
  </div>
);

export default ThreatScanPanel;
