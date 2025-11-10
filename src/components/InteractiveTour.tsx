import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='welcome']",
    title: "Bem-vindo ao Casais Na Rocha! 👋",
    description: "Vamos fazer um tour rápido pelas principais funcionalidades para você começar a gerenciar suas finanças em casal.",
    position: "bottom"
  },
  {
    target: "[data-tour='summary']",
    title: "Resumo Financeiro",
    description: "Aqui você vê um resumo completo: receitas, despesas e saldo do mês. Acompanhe sua saúde financeira em tempo real.",
    position: "bottom"
  },
  {
    target: "[data-tour='add-transaction']",
    title: "Adicionar Transações",
    description: "Use este formulário para registrar suas receitas e despesas. Categorize e adicione descrições para melhor organização.",
    position: "left"
  },
  {
    target: "[data-tour='transactions']",
    title: "Lista de Transações",
    description: "Visualize todas as suas transações aqui. Você pode editar, excluir e filtrar por categoria ou tipo.",
    position: "top"
  },
  {
    target: "[data-tour='planning']",
    title: "Planejamento Mensal",
    description: "Defina limites de gastos por categoria. O sistema alertará quando você estiver próximo do limite.",
    position: "top"
  },
  {
    target: "[data-tour='goals']",
    title: "Metas Financeiras",
    description: "Crie metas para seus objetivos: viagem, reforma, reserva de emergência. Acompanhe o progresso visualmente.",
    position: "top"
  },
  {
    target: "[data-tour='notes']",
    title: "Anotações",
    description: "Registre lembretes, datas de pagamento ou qualquer informação financeira importante.",
    position: "top"
  },
  {
    target: "[data-tour='month-nav']",
    title: "Navegação Mensal",
    description: "Navegue entre meses para analisar seu histórico financeiro e comparar períodos.",
    position: "bottom"
  },
  {
    target: "[data-tour='settings']",
    title: "Configurações",
    description: "Acesse suas configurações, ajuda, tutorial e informações sobre o app. Pronto para começar! 🎉",
    position: "left"
  }
];

interface InteractiveTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function InteractiveTour({ onComplete, onSkip }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [tooltipPosition, setTooltipPosition] = useState<"top" | "bottom" | "left" | "right">("bottom");

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [currentStep]);

  const updatePosition = () => {
    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      });
      setTooltipPosition(step.position);
      
      // Scroll to element
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const step = tourSteps[currentStep];
  const element = document.querySelector(step.target);
  
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const highlightStyle = {
    top: `${position.top - 8}px`,
    left: `${position.left - 8}px`,
    width: `${rect.width + 16}px`,
    height: `${rect.height + 16}px`
  };

  const getTooltipStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      zIndex: 60,
      maxWidth: "400px"
    };

    switch (tooltipPosition) {
      case "top":
        return {
          ...baseStyle,
          top: `${position.top - 20}px`,
          left: `${position.left + rect.width / 2}px`,
          transform: "translate(-50%, -100%)"
        };
      case "bottom":
        return {
          ...baseStyle,
          top: `${position.top + rect.height + 20}px`,
          left: `${position.left + rect.width / 2}px`,
          transform: "translateX(-50%)"
        };
      case "left":
        return {
          ...baseStyle,
          top: `${position.top + rect.height / 2}px`,
          left: `${position.left - 20}px`,
          transform: "translate(-100%, -50%)"
        };
      case "right":
        return {
          ...baseStyle,
          top: `${position.top + rect.height / 2}px`,
          left: `${position.left + rect.width + 20}px`,
          transform: "translateY(-50%)"
        };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
      
      {/* Highlight */}
      <div
        className="fixed z-50 rounded-lg border-4 border-primary shadow-lg shadow-primary/50 transition-all duration-300 pointer-events-none"
        style={highlightStyle}
      />

      {/* Tooltip Card */}
      <div style={getTooltipStyle()}>
        <Card className="shadow-xl border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Passo {currentStep + 1} de {tourSteps.length}
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                )}
                <Button size="sm" onClick={handleNext}>
                  {currentStep < tourSteps.length - 1 ? (
                    <>
                      Próximo
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Finalizar"
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-1 mt-4">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
