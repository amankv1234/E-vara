import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, Cell, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import ScanStep from "@/components/ScanStep";
import ChartCard from "@/components/ChartCard";
import StatCard from "@/components/StatCard";

const scanStages = [
  "Scanning Digital Footprint...",
  "Tracking Data Sources...",
  "Analyzing Behavioral Patterns...",
  "Detecting Threat Signatures...",
];

const pieData = [
  { name: "Safe", value: 34, color: "#00e5ff" },
  { name: "Vulnerable", value: 43, color: "#3d8bff" },
  { name: "High Risk", value: 23, color: "#ff5f3a" },
];

const barData = [
  { name: "Social", value: 74 },
  { name: "Email", value: 57 },
  { name: "Password", value: 48 },
  { name: "Device", value: 68 },
];

const ThreatScanPanel = () => {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStage((s) => (s < scanStages.length ? s + 1 : s)), 900);
    return () => clearInterval(timer);
  }, []);

  const riskScore = 72;
  const level = useMemo(() => (riskScore >= 70 ? "HIGH" : riskScore >= 45 ? "MEDIUM" : "LOW"), [riskScore]);

  return (
    <section className="space-y-4 rounded-xl border border-[#244163] bg-[#0a1224] p-4">
      <h2 className="text-base font-semibold tracking-wide text-[#b7f8ff]">Threat Scan Console</h2>
      <div className="space-y-2">{scanStages.map((s, i) => <ScanStep key={s} label={s} active={i === stage - 1} complete={i < stage - 1} />)}</div>
      {stage > scanStages.length && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid gap-3 md:grid-cols-2">
            <StatCard label="Threat Level" value={level} />
            <StatCard label="Risk Score" value={`${riskScore}%`} />
            <StatCard label="Chance of Account Compromise" value="68%" />
            <StatCard label="Data Exposure Risk" value="54%" />
            <StatCard label="Identity Misuse Risk" value="41%" />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <ChartCard title="Risk Distribution">
              <div className="h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={84} innerRadius={46}>
                      {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Security Category Analysis">
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#8eb3d6" />
                    <YAxis stroke="#8eb3d6" />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((_, i) => <Cell key={i} fill={["#00e5ff", "#3da4ff", "#31d3c6", "#ff7c53"][i]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}
    </section>
  );
};

export default ThreatScanPanel;
