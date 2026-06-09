import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { runResilient } from "@/lib/resilient-fetch";

export interface ThreatFinding {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  source: string;
  description: string;
  found_at: string;
}

const MOCK_THREATS: ThreatFinding[] = [
  {
    id: "threat-1",
    severity: "critical",
    title: "Exposure Detected in dark_web_dump_v4",
    source: "dark_web_dump_v4",
    description: "Cleartext credentials linked to enterprise SSO found in pastebin repository.",
    found_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "threat-2",
    severity: "high",
    title: "Exposure Detected in breach_compilation",
    source: "breach_compilation",
    description: "Legacy password hash associated with primary administrative alias indexed.",
    found_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "threat-3",
    severity: "medium",
    title: "Exposure Detected in github_public_commits",
    source: "github_public_commits",
    description: "Commit metadata leaks non-prod API keys and host mapping configurations.",
    found_at: new Date(Date.now() - 86400000 * 14).toISOString()
  }
];

export const useThreatMonitor = () => {
  return useQuery<ThreatFinding[], Error>({
    queryKey: ["threat-findings"],
    queryFn: async () => {
      return runResilient(
        async () => {
          const { data, error } = await supabase
            .from('identity_breaches')
            .select('id, severity, source_name, description, created_at')
            .order('created_at', { ascending: false });
          
          if (error) {
            throw new Error("Unable to securely fetch threat intelligence data.");
          }
          
          return (data || []).map((row) => ({
            id: row.id,
            severity: (row.severity || "medium") as ThreatFinding["severity"],
            title: `Exposure Detected in ${row.source_name || "Unknown Source"}`,
            source: row.source_name || "Unknown Source",
            description: row.description || "Data point leaked.",
            found_at: row.created_at || new Date().toISOString()
          }));
        },
        "e_vara_threat_findings",
        MOCK_THREATS
      );
    },
    staleTime: 30000, // 30 seconds cache
  });
};
