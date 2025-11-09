import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, TrendingUp, Target, Calculator, FileText, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Tutorial = () => {
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
                <GraduationCap className="h-6 w-6" />
                Tutorial
              </h1>
              <p className="text-white/80">Aprenda a usar todas as funcionalidades</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Introdução */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Bem-vindo ao Casais Na Rocha!</CardTitle>
            <CardDescription>
              Um guia completo para gerenciar suas finanças em casal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Este aplicativo foi desenvolvido especialmente para casais que desejam ter um controle
              financeiro eficiente e transparente. Aqui você encontrará todas as ferramentas necessárias
              para planejar, acompanhar e conquistar suas metas financeiras juntos.
            </p>
          </CardContent>
        </Card>

        {/* Painel Principal */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              1. Painel Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Visão Geral Financeira</h4>
              <p className="text-sm text-muted-foreground">
                No painel principal você encontra um resumo completo das suas finanças:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li><strong>Rendas do Mês:</strong> Total de entradas financeiras</li>
                <li><strong>Despesas do Mês:</strong> Total de gastos realizados</li>
                <li><strong>Saldo Total:</strong> Resultado acumulado + saldo mensal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Ações Rápidas</h4>
              <p className="text-sm text-muted-foreground">
                Use os botões de ação rápida para adicionar rendas, despesas ou criar novas metas
                de forma ágil, sem precisar navegar para outras seções.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lançamentos */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              2. Lançamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gerencie todas as suas transações financeiras em um só lugar:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Visualize todas as rendas e despesas do mês</li>
              <li>Edite ou exclua transações existentes</li>
              <li>Filtre por tipo (renda ou despesa)</li>
              <li>Exporte seus dados para Excel</li>
            </ul>
            <div className="bg-muted p-3 rounded-lg mt-2">
              <p className="text-sm font-medium">💡 Dica:</p>
              <p className="text-sm text-muted-foreground">
                Seja detalhado nas descrições! Isso facilita a análise dos gastos no futuro.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Planejamento */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              3. Planejamento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Defina limites de gastos por categoria e acompanhe seu orçamento:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Crie categorias personalizadas de despesas</li>
              <li>Estabeleça valores máximos para cada categoria</li>
              <li>Acompanhe em tempo real quanto já foi gasto</li>
              <li>Receba alertas visuais quando estiver próximo do limite</li>
            </ul>
          </CardContent>
        </Card>

        {/* Metas */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              4. Metas Financeiras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Defina e acompanhe suas metas financeiras como casal:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Crie metas com valor alvo e prazo</li>
              <li>Adicione contribuições gradualmente</li>
              <li>Acompanhe o progresso com barra visual</li>
              <li>Marque metas como concluídas</li>
            </ul>
            <div className="bg-muted p-3 rounded-lg mt-2">
              <p className="text-sm font-medium">💡 Exemplo de Metas:</p>
              <p className="text-sm text-muted-foreground">
                Fundo de emergência, viagem, reforma da casa, compra de veículo, etc.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Anotações */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              5. Anotações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use o bloco de anotações para guardar informações importantes:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Lembretes de pagamentos</li>
              <li>Ideias para economizar</li>
              <li>Planos financeiros de longo prazo</li>
              <li>Observações sobre gastos recorrentes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Navegação entre Meses */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Navegação entre Meses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Use as setas no topo da página para navegar entre diferentes meses.
              Isso permite visualizar histórico completo e fazer comparações entre períodos.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">📊 Análise Histórica</p>
              <p className="text-sm text-muted-foreground mt-1">
                Compare seus gastos mês a mês para identificar padrões e oportunidades de economia!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card className="shadow-soft bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <p className="text-sm">Comece registrando todas as rendas e despesas do mês atual</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <p className="text-sm">Defina um planejamento mensal com limites por categoria</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <p className="text-sm">Crie suas primeiras metas financeiras como casal</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </div>
              <p className="text-sm">Revise semanalmente o progresso e ajuste conforme necessário</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => navigate("/")} size="lg" className="gap-2">
            Começar a Usar o App
          </Button>
        </div>
      </div>
    </div>
  );
};
