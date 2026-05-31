import { useState } from "react";
import { User, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface IdentityFormProps {
  onSave?: (data: any) => void;
  initial?: any | null;
}

const IdentityForm = ({ onSave, initial }: IdentityFormProps) => {
  const { user } = useAuth();
  const [email, setEmail] = useState(initial?.email || user?.email || "");
  const [username, setUsername] = useState(initial?.username || "");
  const [fullName, setFullName] = useState(initial?.fullName || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // 1. Register or update the identity in public.monitored_identities
      // Note: In a real app, we'd encrypt the identity_value_encrypted
      // For this version, we'll store it and use identity_hash for lookup
      const identity_hash = btoa(email).slice(0, 32); // Simple hash for demo logic

      const { data: identity, error: identityError } = await supabase
        .from('monitored_identities' as any)
        .upsert({
          user_id: user.id,
          identity_type: 'email',
          identity_value_encrypted: email, // Should be AES-256
          identity_hash: identity_hash,
          is_active: true
        } as any)
        .select()
        .single();

      if (identityError) throw identityError;

      // 2. Trigger the breach check edge function
      const { data: scanResult, error: scanError } = await supabase.functions.invoke('breach-check', {
        body: { 
          identityId: (identity as any).id, 
          identityValue: email, 
          userId: user.id 
        }
      });

      if (scanError) throw scanError;

      toast.success("Identity monitoring active", {
        description: `Found ${scanResult.count} historical data breaches.`
      });

      if (onSave) onSave({ email, username, fullName });
    } catch (error: any) {
      console.error("Identity registration failed:", error);
      toast.error("Monitoring initialization failed", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <ShieldCheck className="h-24 w-24 text-primary" />
      </div>

      <div className="mb-6 flex items-center gap-3 relative z-10">
        <div className="p-2 bg-primary/10 rounded-lg">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em]">Identity Intelligence</h3>
          <p className="text-[10px] text-muted-foreground uppercase">Configure your monitoring targets</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Primary Email Target</label>
          <input 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className={inputClass} 
            placeholder="target@example.com" 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Public Handle</label>
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className={inputClass} 
              placeholder="@handle" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Legal Designation</label>
            <input 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              className={inputClass} 
              placeholder="John Doe" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Initializing Scanners...
            </>
          ) : (
            "Activate Intelligence"
          )}
        </button>
      </form>
    </div>
  );
};

export default IdentityForm;
