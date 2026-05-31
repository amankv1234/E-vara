import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useThreatMonitor = () => {
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const { data, error } = await supabase
          .from('threat_findings')
          .select('*')
          .order('found_at', { ascending: false });
        
        if (error) throw error;
        setFindings(data || []);
      } catch (err) {
        console.error('Error fetching threat findings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();

    // Real-time subscription
    const channel = supabase
      .channel('threat-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'threat_findings' }, 
        (payload) => {
          setFindings(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { findings, loading };
};
