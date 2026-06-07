# E-VARA: Personal Defense & Intelligence OS

E-VARA is a high-end, futuristic Cyber Intelligence platform designed for real-time identity monitoring, threat surface analysis, and executive security auditing.

## 🚀 Vision
To provide individuals and organizations with a military-grade "Operational Awareness" dashboard of their digital footprint. E-VARA moves beyond simple breach alerts by correlating identity markers across the surface and deep web.

## 💎 High-Multiplier Features (10k+ Valuation)
- **Advanced Identity Intelligence Engine**: Correlates emails, handles, and legal names to map exposure across 5+ major social platforms.
- **Executive Threat Auditing**: Automated multi-page PDF generation producing professional-grade "Identity Dossiers" for high-net-worth individuals and corporate executives.
- **Dark Web Breach Integration**: Deep integration with historical leak databases (HaveIBeenPwned, DeHashed, etc.) via secure Edge Functions.
- **Attack Vector Simulation**: Real-time visualization of potential traversal paths an attacker might take using public metadata.
- **Futuristic HUD Interface**: A custom-engineered, ultra-modern UI built with Tailwind CSS, Framer Motion, and Shadcn UI, optimized for high-end presentation.
- **SaaS-Ready Monetization**: Pre-built multi-tier pricing structure (Tactical, Executive, Enterprise) with secure billing entry points.

## 🛠 Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v3
- **Backend/Infrastructure**: Supabase (Auth, Postgres, Edge Functions)
- **UI Components**: Shadcn/UI, Lucide Icons, Recharts (Visualizations)
- **Reporting**: jsPDF, AutoTable

## 📦 Setup & Deployment

### Environment Variables
Create a `.env` file in the root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (Supabase)
1. **Migrations**: Run the SQL scripts found in `supabase/migrations/` to set up the `monitored_identities` and `threat_findings` tables.
2. **Edge Functions**: Deploy the `breach-check` function:
   ```bash
   supabase functions deploy breach-check
   ```

### Installation
```bash
npm install
npm run dev
```

## 📈 Commercial Potential
This project is architected for immediate acquisition. It serves a high-growth niche (Cybersecurity SaaS) and features a polished, enterprise-ready aesthetic that justifies premium pricing.

**Suggested Sale Price**: $10,000 - $15,000
**Target Platforms**: Acquire.com, Flippa, MicroAcquire

---
*Built for security-conscious professionals who require absolute operational awareness.*
