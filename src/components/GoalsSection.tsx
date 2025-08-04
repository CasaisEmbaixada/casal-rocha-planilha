import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Trash2, CheckCircle } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  description: string;
  targetDate: string;
  completed: boolean;
}

export const GoalsSection = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    targetAmount: "",
    description: "",
    targetDate: ""
  });

  const categories = [
    "Casa",
    "Carro",
    "Apartamento",
    "Viagem",
    "Emergência",
    "Investimento",
    "Outros"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      description: formData.description,
      targetDate: formData.targetDate,
      completed: false
    };

    setGoals([...goals, newGoal]);
    setFormData({
      title: "",
      category: "",
      targetAmount: "",
      description: "",
      targetDate: ""
    });
    setShowGoalForm(false);
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            currentAmount: Math.min(amount, goal.targetAmount),
            completed: amount >= goal.targetAmount
          }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Metas a Conquistar</span>
            </CardTitle>
            <CardDescription>
              Defina e acompanhe seus objetivos financeiros
            </CardDescription>
          </div>
          <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90">
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Nova Meta</DialogTitle>
                <DialogDescription>
                  Defina um objetivo financeiro para sua família
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Meta</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Comprar casa própria"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Valor Objetivo (R$)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetDate">Data Objetivo</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Input
                    id="description"
                    placeholder="Detalhes sobre sua meta..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGoalForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90">
                    Criar Meta
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma meta criada ainda. Comece definindo seus objetivos!
          </p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 rounded-lg bg-muted space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {goal.completed ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <Target className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <h4 className="font-semibold">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">{goal.category}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>
                      R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / 
                      R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}%
                  </div>
                </div>

                {!goal.completed && (
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Valor a adicionar"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseFloat((e.target as HTMLInputElement).value);
                          if (value > 0) {
                            updateGoalProgress(goal.id, goal.currentAmount + value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const value = parseFloat(input.value);
                        if (value > 0) {
                          updateGoalProgress(goal.id, goal.currentAmount + value);
                          input.value = '';
                        }
                      }}
                    >
                      Adicionar
                    </Button>
                  </div>
                )}

                {goal.description && (
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};