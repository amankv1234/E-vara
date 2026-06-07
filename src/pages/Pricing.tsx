
import { Check, Shield, Zap, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const PricingPage = () => {
  const plans = [
    {
      name: "Tactical",
      price: "$0",
      description: "Basic identity monitoring for personal security",
      features: [
        "1 Primary Email Target",
        "Weekly Breach Scans",
        "Basic Threat Feed",
        "PDF Security Audit (Basic)",
      ],
      icon: <Shield className="h-5 w-5 text-primary" />,
      cta: "Current Plan",
      highlight: false
    },
    {
      name: "Executive",
      price: "$29",
      description: "Advanced intelligence for digital high-net-worth",
      features: [
        "5 Identity Targets",
        "Daily Real-time Scans",
        "AI-Powered Risk Analysis",
        "Professional Audit Reports",
        "SMS/Slack Alerts",
        "Priority Support"
      ],
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      cta: "Upgrade to Pro",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Organizational threat surface management",
      features: [
        "Unlimited Identity Targets",
        "Organization Dashboard",
        "Custom Webhook Integration",
        "Compliance Reporting (SOC2/GDPR)",
        "Dedicated Account Lead",
        "White-label Reports"
      ],
      icon: <Globe className="h-5 w-5 text-blue-500" />,
      cta: "Contact Intel",
      highlight: false
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
          INTELLIGENCE <span className="text-primary">TIERS</span>
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-[700px] mx-auto font-mono">
          Select the level of operational awareness required for your digital footprint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative flex flex-col transition-all duration-300 hover:shadow-primary/10 hover:shadow-2xl border-primary/20 bg-card/50 backdrop-blur-sm ${plan.highlight ? 'ring-2 ring-primary scale-105 z-10' : ''}`}>
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase py-1 px-4 rounded-full tracking-widest">
                Recommended
              </div>
            )}
            <CardHeader>
              <div className="p-3 w-fit rounded-lg bg-primary/10 mb-4">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-mono uppercase tracking-widest">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-muted-foreground font-mono">/mo</span>}
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={plan.highlight ? "default" : "outline"} 
                className={`w-full font-bold uppercase tracking-widest text-xs py-6 transition-all ${plan.highlight ? 'hover:scale-105' : 'hover:bg-primary/10'}`}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-primary/10 bg-primary/5 p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-primary/10 rounded-full">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center md:text-left flex-grow">
          <h3 className="text-xl font-bold uppercase tracking-widest font-mono">Military-Grade Encryption</h3>
          <p className="text-muted-foreground text-sm mt-1 font-mono">
            All intelligence data is encrypted at rest and in transit. We do not store plain-text passwords or sensitive identity markers beyond required telemetry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
