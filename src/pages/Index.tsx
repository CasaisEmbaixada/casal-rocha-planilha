import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [familyName, setFamilyName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch family name from user metadata or profile
          const savedFamilyName = localStorage.getItem('familyName') || 
                                 session.user.user_metadata?.family_name || 
                                 "Família Silva";
          setFamilyName(savedFamilyName);
        } else {
          setFamilyName("");
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const savedFamilyName = localStorage.getItem('familyName') || 
                               session.user.user_metadata?.family_name || 
                               "Família Silva";
        setFamilyName(savedFamilyName);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string, inputFamilyName?: string) => {
    try {
      setLoading(true);
      
      if (isLoginMode) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          const savedFamilyName = localStorage.getItem('familyName') || 
                                 data.user.user_metadata?.family_name || 
                                 "Família Silva";
          setFamilyName(savedFamilyName);
        }
      } else {
        // Signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              family_name: inputFamilyName
            }
          }
        });
        
        if (error) throw error;
        
        if (inputFamilyName) {
          setFamilyName(inputFamilyName);
          localStorage.setItem('familyName', inputFamilyName);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setFamilyName("");
      localStorage.removeItem('familyName');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent to-muted flex items-center justify-center">
        <div className="text-primary">Carregando...</div>
      </div>
    );
  }

  if (user && session) {
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
