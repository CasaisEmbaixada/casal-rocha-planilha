import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Target, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface PersonalizedRecommendationsProps {
  percentage: number;
  type: 'planning' | 'transactions';
  totalIncome: number;
  totalExpenses: number;
}

const getRecommendationData = (percentage: number, type: 'planning' | 'transactions') => {
  const absPercentage = Math.abs(percentage);
  const isPositive = percentage >= 0;
  
  // Definer which range the percentage falls into (10%, 20%, etc.)
  const range = Math.min(Math.ceil(absPercentage / 10) * 10, 100);
  
  if (isPositive) {
    // Positive recommendations
    const positiveMessages = {
      planning: {
        10: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", title: "Bom planejamento!", message: "Excelente! Você está com uma margem positiva de 10%. Continue assim e considere reservar esse extra para emergências." },
        20: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", title: "Planejamento sólido!", message: "Ótimo controle! Com 20% de sobra, você pode pensar em objetivos de médio prazo ou aumentar sua reserva de emergência." },
        30: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", title: "Margem excelente!", message: "Fantástico! 30% de margem mostra disciplina financeira. Considere investimentos para fazer seu dinheiro render mais." },
        40: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", title: "Superávit robusto!", message: "Impressionante! Com 40% de sobra, você tem espaço para diversificar investimentos e acelerar seus objetivos financeiros." },
        50: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Controle excepcional!", message: "Parabéns! 50% de margem é excepcional. Hora de pensar em grandes objetivos: imóveis, aposentadoria ou empreendimentos." },
        60: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Situação privilegiada!", message: "Incrível! Com 60% de sobra, você está em posição privilegiada. Considere consultoria financeira para maximizar seus rendimentos." },
        70: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Planejamento exemplar!", message: "Extraordinário! 70% de margem permite estratégias avançadas de investimento e realização de sonhos maiores." },
        80: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Excelência financeira!", message: "Fenomenal! Com 80% de sobra, você pode pensar em múltiplas fontes de renda e projetos de alto impacto." },
        90: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Maestria total!", message: "Perfeito! 90% de margem mostra maestria financeira. Considere mentorear outros ou explorar oportunidades de negócio." },
        100: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Controle absoluto!", message: "Impressionante! Você alcançou o controle absoluto. Agora é hora de pensar em legado e impacto social." }
      },
      transactions: {
        10: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", title: "Mês positivo!", message: "Parabéns! Você fechou o mês com 10% de sobra. Continue controlando os gastos e mantenha essa disciplina." },
        20: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", title: "Resultado sólido!", message: "Excelente! 20% de sobra real mostra que seu planejamento funcionou. Considere investir esse excesso." },
        30: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", title: "Mês excelente!", message: "Ótimo trabalho! 30% de economia real é impressionante. Você está no caminho certo para seus objetivos." },
        40: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", title: "Performance excepcional!", message: "Fantástico! 40% de sobra real demonstra excelente controle financeiro. Acelere seus investimentos!" },
        50: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Controle impressionante!", message: "Incrível! Economizar 50% da renda é um feito notável. Você está construindo um futuro sólido." },
        60: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Resultado extraordinário!", message: "Excepcional! 60% de economia real coloca você entre os melhores gestores de finanças pessoais." },
        70: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Mês exemplar!", message: "Surpreendente! 70% de sobra real é um resultado que poucos alcançam. Mantenha essa excelência!" },
        80: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Performance elite!", message: "Fenomenal! 80% de economia real demonstra disciplina e visão de futuro extraordinárias." },
        90: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Maestria comprovada!", message: "Impressionante! 90% de sobra real confirma sua maestria em gestão financeira pessoal." },
        100: { icon: Target, color: "text-success", bg: "bg-success/10", title: "Perfeição alcançada!", message: "Extraordinário! Você alcançou a perfeição no controle financeiro. Um exemplo a ser seguido!" }
      }
    };
    
    return positiveMessages[type][range as keyof typeof positiveMessages[typeof type]] || positiveMessages[type][100];
  } else {
    // Negative recommendations
    const negativeMessages = {
      planning: {
        10: { icon: AlertCircle, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", title: "Atenção ao planejamento", message: "Cuidado! Você está planejando gastar 10% a mais do que ganha. Revise alguns gastos para evitar problemas futuros." },
        20: { icon: AlertCircle, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", title: "Ajustes necessários", message: "Alerta! 20% de déficit planejado pode gerar dívidas. Corte gastos não essenciais e priorize apenas o fundamental." },
        30: { icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", title: "Situação preocupante", message: "Atenção! 30% de déficit é preocupante. Revise urgentemente seu orçamento e considere fontes extras de renda." },
        40: { icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", title: "Risco elevado", message: "Cuidado! 40% de déficit pode levar ao endividamento. Corte gastos drásticos e busque orientação financeira." },
        50: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Situação crítica", message: "Alerta máximo! 50% de déficit é insustentável. Reestruture completamente seu orçamento e busque ajuda profissional." },
        60: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Emergência financeira", message: "Situação crítica! 60% de déficit exige ação imediata. Corte todos os gastos supérfluos e busque renda extra urgentemente." },
        70: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Risco extremo", message: "Perigo! 70% de déficit pode levar à falência pessoal. Tome medidas drásticas de corte e procure ajuda especializada." },
        80: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Colapso iminente", message: "Situação desesperadora! 80% de déficit indica colapso financeiro iminente. Ação emergencial é necessária agora!" },
        90: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-950/30 dark:bg-red-950/30", title: "Catástrofe anunciada", message: "Estado crítico! 90% de déficit é catastrófico. Pare tudo e reorganize sua vida financeira completamente." },
        100: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Falência total", message: "Colapso total! Você está gastando o dobro do que ganha. Busque ajuda profissional urgente e reestruture tudo." }
      },
      transactions: {
        10: { icon: AlertCircle, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", title: "Mês no vermelho", message: "Atenção! Você gastou 10% a mais do que ganhou. Ajuste os gastos do próximo mês para compensar." },
        20: { icon: AlertCircle, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", title: "Déficit preocupante", message: "Cuidado! 20% de déficit real afeta sua estabilidade. Revise seus gastos e seja mais rigoroso no orçamento." },
        30: { icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", title: "Situação complicada", message: "Alerta! 30% de déficit real compromete suas finanças. Faça ajustes urgentes e evite novos gastos desnecessários." },
        40: { icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", title: "Mês muito difícil", message: "Situação grave! 40% de déficit real exige medidas corretivas imediatas. Reavalie todas as suas despesas." },
        50: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Mês catastrófico", message: "Crítico! 50% de déficit real é insustentável. Você precisa de um plano de recuperação urgente." },
        60: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Colapso financeiro", message: "Emergência! 60% de déficit real indica perda total de controle. Busque ajuda profissional imediatamente." },
        70: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Desastre completo", message: "Situação desesperadora! 70% de déficit real exige reestruturação total da sua vida financeira." },
        80: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Falência pessoal", message: "Estado crítico! 80% de déficit real indica falência pessoal. Tome medidas extremas agora!" },
        90: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Ruína financeira", message: "Colapso total! 90% de déficit real representa ruína financeira. Reorganize sua vida completamente." },
        100: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", title: "Catástrofe absoluta", message: "Situação impossível! Você gastou o dobro da sua renda. Busque ajuda especializada urgentemente!" }
      }
    };
    
    return negativeMessages[type][range as keyof typeof negativeMessages[typeof type]] || negativeMessages[type][100];
  }
};

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  percentage,
  type,
  totalIncome,
  totalExpenses
}) => {
  // Only show recommendations if there's data
  if (totalIncome === 0 && totalExpenses === 0) {
    return null;
  }

  const recommendation = getRecommendationData(percentage, type);
  const Icon = recommendation.icon;

  return (
    <Card className={`shadow-soft border-l-4 ${
      percentage >= 0 ? 'border-l-success' : 
      Math.abs(percentage) <= 30 ? 'border-l-yellow-500' :
      Math.abs(percentage) <= 50 ? 'border-l-orange-500' : 'border-l-red-500'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Icon className={`h-5 w-5 ${recommendation.color}`} />
          <span>Recomendações Personalizadas</span>
        </CardTitle>
        <CardDescription>
          Insights automáticos baseados no seu {type === 'planning' ? 'planejamento' : 'desempenho real'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg ${recommendation.bg}`}>
          <h4 className={`font-semibold mb-2 ${recommendation.color}`}>
            {recommendation.title}
          </h4>
          <p className="text-sm text-foreground/80">
            {recommendation.message}
          </p>
          
          <div className="mt-3 pt-3 border-t border-current/20">
            <div className="flex justify-between text-xs">
              <span>
                {type === 'planning' ? 'Receitas Planejadas' : 'Receitas Reais'}: 
                <span className="font-medium ml-1">
                  R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </span>
              <span>
                {type === 'planning' ? 'Despesas Planejadas' : 'Despesas Reais'}: 
                <span className="font-medium ml-1">
                  R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </span>
            </div>
            <div className="mt-1 text-xs font-medium">
              Variação: {percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};