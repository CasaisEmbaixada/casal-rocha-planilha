import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Info, Heart, Shield, Users, Target, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Sobre = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-muted">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Info className="h-6 w-6" />
                Sobre o App
              </h1>
              <p className="text-white/80">Conheça mais sobre o Casais Na Rocha</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Apresentação */}
        <Card className="shadow-soft bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Casais Na Rocha</CardTitle>
            </div>
            <CardDescription className="text-base">
              Fortalecendo relacionamentos através da transparência financeira
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              O Casais Na Rocha é mais do que um simples aplicativo de controle financeiro.
              É uma ferramenta desenvolvida especialmente para casais que desejam construir
              um futuro sólido juntos, com transparência, diálogo e planejamento financeiro.
            </p>
          </CardContent>
        </Card>

        {/* Missão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Nossa Missão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ajudar casais a alcançarem seus objetivos financeiros através de ferramentas
                simples, eficientes e que promovem o diálogo sobre dinheiro de forma saudável
                e construtiva.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Nossos Valores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Transparência financeira</li>
                <li>• Trabalho em equipe</li>
                <li>• Simplicidade e praticidade</li>
                <li>• Crescimento conjunto</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Funcionalidades Principais */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Por que escolher o Casais Na Rocha?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Feito para Casais</h4>
                <p className="text-sm text-muted-foreground">
                  Interface pensada para facilitar o diálogo e a gestão financeira compartilhada.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Segurança e Privacidade</h4>
                <p className="text-sm text-muted-foreground">
                  Seus dados financeiros são protegidos com tecnologia de ponta e criptografia.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Foco em Metas</h4>
                <p className="text-sm text-muted-foreground">
                  Crie e acompanhe metas financeiras juntos, fortalecendo o comprometimento do casal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Simples e Intuitivo</h4>
                <p className="text-sm text-muted-foreground">
                  Interface limpa e fácil de usar, sem complicações técnicas ou recursos desnecessários.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Gratuito</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Disponível</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <p className="text-sm text-muted-foreground">Transações</p>
            </CardContent>
          </Card>
        </div>

        {/* Informações da Versão */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Informações da Versão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Versão:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Última atualização:</span>
              <span className="font-medium">Novembro 2025</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Desenvolvido com:</span>
              <span className="font-medium">React + Supabase</span>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="shadow-soft bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>Entre em Contato</CardTitle>
            <CardDescription>
              Sugestões, dúvidas ou feedback? Adoraríamos ouvir você!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="text-muted-foreground mb-1">Email:</p>
              <p className="font-medium">contato@casaisnarocha.com.br</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground mb-1">Redes Sociais:</p>
              <p className="font-medium">@casaisnarocha</p>
            </div>
          </CardContent>
        </Card>

        {/* Agradecimento */}
        <Card className="shadow-soft text-center">
          <CardContent className="pt-6">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Obrigado por usar o Casais Na Rocha!</h3>
            <p className="text-muted-foreground">
              Juntos construímos relacionamentos mais fortes e futuros mais prósperos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
