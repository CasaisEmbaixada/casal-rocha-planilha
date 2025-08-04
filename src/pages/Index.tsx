import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [familyName, setFamilyName] = useState<string>(() => {
    return localStorage.getItem('familyName') || "";
  });

  console.log("Index component rendered - isLoggedIn:", isLoggedIn);

  const handleLogin = (email: string, password: string, inputFamilyName?: string) => {
    // Simulação de login - em produção, isso seria feito via Supabase
    console.log("Login attempt:", { email, password, familyName: inputFamilyName });
    
    const nameToUse = !isLoginMode && inputFamilyName ? inputFamilyName : familyName || "Família Silva";
    setFamilyName(nameToUse);
    setIsLoggedIn(true);
    
    // Persistir no localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('familyName', nameToUse);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFamilyName("");
    // Limpar do localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('familyName');
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
