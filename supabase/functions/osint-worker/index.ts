import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // This function should be triggered via pg_net or cron
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const workerId = crypto.randomUUID();

  // 1. Claim Jobs (Lease Locking)
  // Calculate lease expiry as 2 minutes from now.
  const leaseExpiry = new Date(Date.now() + 120000).toISOString();

  const { data: jobs, error: claimError } = await supabase
    .from('osint_jobs')
    .update({ 
      status: 'processing', 
      locked_by: workerId, 
      locked_at: new Date().toISOString(),
      lease_expiry_at: leaseExpiry,
      last_heartbeat_at: new Date().toISOString()
    })
    .eq('status', 'pending')
    .lte('next_run_at', new Date().toISOString())
    .is('locked_by', null)
    .select('*')
    .limit(10);

  if (claimError || !jobs || jobs.length === 0) {
    return new Response(JSON.stringify({ status: 'idle', count: 0 }), { status: 200 })
  }

  const osintApiKey = Deno.env.get('EXTERNAL_OSINT_API_KEY');
  let processed = 0;

  // 2. Process Jobs
  for (const job of jobs) {
    try {
      if (!osintApiKey) {
        throw new Error('MISSING_API_KEY');
      }

      // Simulated external call
      const osintRes = await fetch(\https://api.external-osint-provider.com/v1/search?hash=\\, {
        headers: {
          'Authorization': \Bearer \\,
          'Accept': 'application/json'
        }
      });

      if (!osintRes.ok) {
        throw new Error('API_UNAVAILABLE');
      }

      const osintData = await osintRes.json();
      const findings = [];

      if (osintData.breaches && Array.isArray(osintData.breaches)) {
        for (const breach of osintData.breaches) {
          findings.push({
            user_id: job.user_id,
            source_name: breach.source || 'Dark Web',
            leak_date: breach.leak_date || new Date().toISOString().split('T')[0],
            severity: breach.severity || 'medium',
            description: breach.description || 'Exposed records found.'
          });
        }
      }

      if (findings.length > 0) {
        await supabase.from('identity_breaches').insert(findings);
      }

      // Mark complete
      await supabase.from('osint_jobs').update({ status: 'completed' }).eq('id', job.id);
      processed++;

    } catch (err) {
      // Exponential Backoff
      const nextRun = new Date(Date.now() + (Math.pow(2, job.attempts) * 60000));
      await supabase.from('osint_jobs').update({ 
        status: job.attempts >= 3 ? 'failed' : 'pending',
        attempts: job.attempts + 1,
        next_run_at: nextRun.toISOString(),
        error_log: err.message,
        locked_by: null,
        locked_at: null
      }).eq('id', job.id);
    }
  }

  return new Response(JSON.stringify({ status: 'processed', count: processed }), { status: 200 })
})
