import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Trash2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    targetAmount: "",
    description: "",
    targetDate: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedGoals = data?.map(goal => ({
        id: goal.id,
        title: goal.title,
        category: goal.category,
        targetAmount: Number(goal.target_amount),
        currentAmount: Number(goal.current_amount),
        description: goal.description || '',
        targetDate: goal.target_date || '',
        completed: goal.completed
      })) || [];

      setGoals(formattedGoals);
    } catch (error: any) {
      console.error('Error loading goals:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as metas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Casa",
    "Carro",
    "Apartamento",
    "Viagem",
    "Emergência",
    "Investimento",
    "Outros"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.data.user.id,
          title: formData.title,
          category: formData.category,
          target_amount: parseFloat(formData.targetAmount),
          description: formData.description,
          target_date: formData.targetDate || null
        })
        .select()
        .single();

      if (error) throw error;

      const newGoal: Goal = {
        id: data.id,
        title: data.title,
        category: data.category,
        targetAmount: Number(data.target_amount),
        currentAmount: Number(data.current_amount),
        description: data.description || '',
        targetDate: data.target_date || '',
        completed: data.completed
      };

      setGoals([newGoal, ...goals]);
      setFormData({
        title: "",
        category: "",
        targetAmount: "",
        description: "",
        targetDate: ""
      });
      setShowGoalForm(false);
      
      toast({
        title: "Sucesso",
        description: "Meta criada com sucesso!"
      });
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a meta",
        variant: "destructive"
      });
    }
  };

  const updateGoalProgress = async (goalId: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newAmount = Math.min(amount, goal.targetAmount);
      const isCompleted = newAmount >= goal.targetAmount;

      const { error } = await supabase
        .from('goals')
        .update({
          current_amount: newAmount,
          completed: isCompleted
        })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              currentAmount: newAmount,
              completed: isCompleted
            }
          : goal
      ));

      toast({
        title: "Sucesso",
        description: isCompleted ? "Meta concluída! 🎉" : "Progresso atualizado!"
      });
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a meta",
        variant: "destructive"
      });
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(goals.filter(goal => goal.id !== goalId));
      
      toast({
        title: "Sucesso",
        description: "Meta removida com sucesso!"
      });
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a meta",
        variant: "destructive"
      });
    }
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
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        R$
                      </span>
                      <Input
                        type="text"
                        placeholder="0,00"
                        className="pl-10"
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue = value.replace(/[^\d]/g, '');
                          if (numericValue) {
                            const formattedValue = parseFloat(numericValue) / 100;
                            e.target.value = formattedValue.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            });
                          } else {
                            e.target.value = '';
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = (e.target as HTMLInputElement).value;
                            const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
                            if (numericValue > 0) {
                              updateGoalProgress(goal.id, goal.currentAmount + numericValue);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling?.querySelector('input') as HTMLInputElement;
                        const value = input.value;
                        const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
                        if (numericValue > 0) {
                          updateGoalProgress(goal.id, goal.currentAmount + numericValue);
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