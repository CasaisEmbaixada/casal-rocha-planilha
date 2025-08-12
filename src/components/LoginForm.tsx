import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-accent to-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 hidden lg:block">
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
          <div>
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
                "Onde há acordo, há prosperidade."
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

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-all duration-300"
            >
              {isLoginMode ? "Entrar" : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
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
          </div>

          {isLoginMode && (
            <div className="mt-2 text-center">
              <p className="text-xs text-muted-foreground">
                Problemas para entrar? Entre em contato conosco
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
