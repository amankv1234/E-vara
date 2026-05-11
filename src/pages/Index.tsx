import { useState } from "react";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import AdvancedSplash from "@/components/AdvancedSplash";

const Index = () => {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("evara-session"));
  const [ready, setReady] = useState(false);

  if (!ready) {
    return <AdvancedSplash onComplete={() => setReady(true)} />;
  }

  if (!authed) {
    return <AuthPage onAuth={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={() => setAuthed(false)} />;
};

export default Index;
