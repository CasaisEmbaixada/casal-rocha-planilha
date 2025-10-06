import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoginFormProps {
  onLogin: (email: string, password: string, familyName?: string) => void;
  onToggleMode: () => void;
  isLoginMode: boolean;
}

export const LoginForm = ({ onLogin, onToggleMode, isLoginMode }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/`,
      });
      
      if (error) throw error;
      
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      setIsResetDialogOpen(false);
      setResetEmail("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar e-mail de recuperação");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginMode && password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    onLogin(email, password, familyName);
  };

  console.log("LoginForm rendered");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-muted flex">
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full">
        {/* Left Side - Hero Image */}
        <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-accent/30 to-muted/50 min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/lovable-uploads/0022408e-8418-4498-9739-41e9ef3cd7f7.png" 
              alt="Casal gerenciando finanças juntos" 
              className="w-full h-full object-cover rounded-none shadow-elegant"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-muted/20"></div>
          </div>
        </div>
        
        {/* Right Side - Login Card */}
        <div className="flex-1 flex items-center justify-center px-8">
          <Card className="w-full max-w-md shadow-elegant bg-card">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <img 
                  src="/lovable-uploads/107e1544-50c2-4374-ad68-a2e434641c4e.png" 
                  alt="Favicon" 
                  className="h-8 w-8 object-contain"
                />
                <img 
                  src="/lovable-uploads/5d1f9008-15f4-4aba-8127-092469e48f87.png" 
                  alt="Casais na Rocha" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-xl text-foreground">
                  {isLoginMode ? "Entrar na sua conta" : "Crie sua conta"}
                </CardTitle>
                <CardDescription>
                  {isLoginMode 
                    ? "Acesse seu painel financeiro" 
                    : "Comece a gerenciar as finanças do casal"
                  }
                </CardDescription>
                <div className="mt-4 p-3 bg-primary/10 rounded-md border border-primary/20">
                  <p className="text-primary font-medium text-center italic">
                   "Onde há acordo, há prosperidade."
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    — Casais na Rocha
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                  <div className="space-y-2">
                    <Label htmlFor="familyName">Nome da Família</Label>
                    <Input
                      id="familyName"
                      type="text"
                      placeholder="Ex: Família Silva"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {!isLoginMode && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                {!isLoginMode && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="consent"
                        required
                        className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="consent" className="text-sm text-muted-foreground">
                        Ao criar sua conta, você concorda com nossos{" "}
                        <a href="/termos" target="_blank" className="text-primary hover:underline">
                          Termos de Uso
                        </a>
                        ,{" "}
                        <a href="/politica" target="_blank" className="text-primary hover:underline">
                          Política de Privacidade
                        </a>
                        {" "}e{" "}
                        <a href="/cookies" target="_blank" className="text-primary hover:underline">
                          Política de Cookies
                        </a>
                        .
                      </label>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all duration-300"
                >
                  {isLoginMode ? "Entrar" : "Criar Conta"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <Button 
                  variant="link" 
                  onClick={onToggleMode}
                  className="text-muted-foreground hover:text-primary"
                >
                  {isLoginMode 
                    ? "Não tem uma conta? Criar conta" 
                    : "Já tem conta? Fazer login"
                  }
                </Button>

                {isLoginMode && (
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                        Esqueceu sua senha?
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Recuperar Senha</DialogTitle>
                        <DialogDescription>
                          Digite seu e-mail para receber as instruções de recuperação de senha.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="resetEmail">E-mail</Label>
                          <Input
                            id="resetEmail"
                            type="email"
                            placeholder="seu@email.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                          />
                        </div>
                        <Button onClick={handlePasswordReset} className="w-full">
                          Enviar E-mail de Recuperação
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {isLoginMode && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-muted-foreground">
                    Feito com ❤️ por{" "}
                    <a
                      href="https://agencianooma.com.br"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-primary"
                    >
                      Agência nooma
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex items-center justify-center p-4 relative overflow-hidden w-full">
        {/* Background Hero Image */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/0022408e-8418-4498-9739-41e9ef3cd7f7.png" 
            alt="Casal gerenciando finanças juntos" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/80 to-muted/80"></div>
        </div>
        
        {/* Login Card */}
        <Card className="w-full max-w-md shadow-elegant relative z-10 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <img 
                src="/lovable-uploads/107e1544-50c2-4374-ad68-a2e434641c4e.png" 
                alt="Favicon" 
                className="h-8 w-8 object-contain"
              />
              <img 
                src="/lovable-uploads/5d1f9008-15f4-4aba-8127-092469e48f87.png" 
                alt="Casais na Rocha" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl text-foreground">
                {isLoginMode ? "Acesse suas finanças" : "Crie sua conta"}
              </CardTitle>
              <CardDescription>
                {isLoginMode 
                  ? "Entre com suas credenciais para continuar" 
                  : "Comece a gerenciar as finanças do casal"
                }
              </CardDescription>
              <div className="mt-4 p-3 bg-primary/10 rounded-md border border-primary/20">
                <p className="text-primary font-medium text-center italic">
                 Onde há acordo, há prosperidade!
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="mobileFamilyName">Nome da Família</Label>
                  <Input
                    id="mobileFamilyName"
                    type="text"
                    placeholder="Ex: Família Silva"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="mobileEmail">E-mail</Label>
                <Input
                  id="mobileEmail"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobilePassword">Senha</Label>
                <div className="relative">
                  <Input
                    id="mobilePassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="mobileConfirmPassword">Confirmar Senha</Label>
                  <Input
                    id="mobileConfirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {!isLoginMode && (
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="mobileConsent"
                      required
                      className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="mobileConsent" className="text-sm text-muted-foreground">
                      Ao criar sua conta, você concorda com nossos{" "}
                      <a href="/termos" target="_blank" className="text-primary hover:underline">
                        Termos de Uso
                      </a>
                      ,{" "}
                      <a href="/politica" target="_blank" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>
                      {" "}e{" "}
                      <a href="/cookies" target="_blank" className="text-primary hover:underline">
                        Política de Cookies
                      </a>
                      .
                    </label>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all duration-300"
              >
                {isLoginMode ? "Entrar" : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Button 
                variant="link" 
                onClick={onToggleMode}
                className="text-muted-foreground hover:text-primary"
              >
                {isLoginMode 
                  ? "Ainda não tem conta? Cadastre-se aqui" 
                  : "Já tem conta? Faça login"
                }
              </Button>

              {isLoginMode && (
                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-sm text-muted-foreground hover:text-primary block mx-auto">
                      Esqueceu sua senha?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Recuperar Senha</DialogTitle>
                      <DialogDescription>
                        Digite seu e-mail para receber as instruções de recuperação de senha.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobileResetEmail">E-mail</Label>
                        <Input
                          id="mobileResetEmail"
                          type="email"
                          placeholder="seu@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                      <Button onClick={handlePasswordReset} className="w-full">
                        Enviar E-mail de Recuperação
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {isLoginMode && (
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Feito com ❤️ por{" "}
                  <a
                    href="https://agencianooma.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Agência nooma
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};