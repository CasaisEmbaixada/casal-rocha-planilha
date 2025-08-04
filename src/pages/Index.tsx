import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [familyName, setFamilyName] = useState<string>("");

  const handleLogin = (email: string, password: string) => {
    // Simulação de login - em produção, isso seria feito via Supabase
    console.log("Login attempt:", { email, password });
    setFamilyName("Família Silva"); // Mockado por enquanto
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFamilyName("");
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} familyName={familyName} />;
  }

  return (
    <LoginForm 
      onLogin={handleLogin} 
      onToggleMode={toggleMode}
      isLoginMode={isLoginMode}
    />
  );
};

export default Index;
