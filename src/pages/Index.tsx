import React, { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [familyName, setFamilyName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const fetchFamilyName = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('family_name')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        setFamilyName("Família Silva");
      } else if (data) {
        setFamilyName(data.family_name);
      }
    } catch (error) {
      console.error('Error:', error);
      setFamilyName("Família Silva");
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'PASSWORD_RECOVERY') {
          setShowResetPassword(true);
        }
        
        if (session?.user) {
          // Fetch family name from profiles table
          fetchFamilyName(session.user.id);
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
        fetchFamilyName(session.user.id);
      } else {
        setLoading(false);
      }
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
          fetchFamilyName(data.user.id);
        }
      } else {
        // Signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              family_name: inputFamilyName
            }
          }
        });
        
        if (error) throw error;
        
        // Family name will be set automatically by the trigger
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = "Erro ao fazer login";
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Verifique seu email e clique no link de confirmação";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Este email já está cadastrado. Tente fazer login";
      } else if (error.message.includes("Password")) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres";
      }
      
      alert(errorMessage);
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
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Senha redefinida com sucesso!");
      setShowResetPassword(false);
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao redefinir senha");
    }
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
    <>
      <LoginForm 
        onLogin={handleLogin} 
        onToggleMode={toggleMode}
        isLoginMode={isLoginMode}
      />
      
      <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir Senha</DialogTitle>
            <DialogDescription>
              Digite sua nova senha abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <Button onClick={handlePasswordReset} className="w-full">
              Redefinir Senha
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Index;
