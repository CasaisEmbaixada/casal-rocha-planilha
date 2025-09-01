import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlanItem {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
}

interface MonthlyPlanningSectionProps {
  selectedMonth: Date;
}

const incomeCategories = [
  "Salário", "Freelance", "Vendas", "Investimentos", "Aluguel", "Outros"
];

const expenseCategories = [
  "Alimentação", "Transporte", "Moradia", "Saúde", "Educação", "Lazer", 
  "Roupas", "Investimentos", "Cartão de Crédito", "Outros"
];

export const MonthlyPlanningSection = ({ selectedMonth }: MonthlyPlanningSectionProps) => {
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [newItem, setNewItem] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    description: '',
    amount: ''
  });
  const { toast } = useToast();

  const addPlanItem = () => {
    if (!newItem.category || !newItem.description || !newItem.amount) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    const item: PlanItem = {
      id: Date.now().toString(),
      type: newItem.type,
      category: newItem.category,
      description: newItem.description,
      amount: parseFloat(newItem.amount.replace(',', '.'))
    };

    setPlanItems([...planItems, item]);
    setNewItem({
      type: 'expense',
      category: '',
      description: '',
      amount: ''
    });

    toast({
      title: "Sucesso",
      description: "Item adicionado ao planejamento"
    });
  };

  const removePlanItem = (id: string) => {
    setPlanItems(planItems.filter(item => item.id !== id));
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    const formattedValue = (parseFloat(numericValue) / 100).toFixed(2);
    return formattedValue.replace('.', ',');
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    setNewItem({ ...newItem, amount: formatted });
  };

  const totalPlannedIncome = planItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPlannedExpenses = planItems
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const plannedBalance = totalPlannedIncome - totalPlannedExpenses;

  const incomeItems = planItems.filter(item => item.type === 'income');
  const expenseItems = planItems.filter(item => item.type === 'expense');

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Planejamento para {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          </CardTitle>
          <CardDescription>
            Planeje suas receitas e despesas para este mês. Estes dados não afetam seu painel principal.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Resumo do Planejamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas Planejadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalPlannedIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{incomeItems.length} itens</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas Planejadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {totalPlannedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{expenseItems.length} itens</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Planejado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${plannedBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
              R$ {plannedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {plannedBalance >= 0 ? 'Superávit' : 'Déficit'} planejado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formulário para Adicionar Item */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Adicionar ao Planejamento</CardTitle>
          <CardDescription>
            Adicione receitas e despesas previstas para este mês
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={newItem.type} onValueChange={(value: 'income' | 'expense') => setNewItem({ ...newItem, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(newItem.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o item do planejamento"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              placeholder="0,00"
              value={newItem.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>

          <Button onClick={addPlanItem} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar ao Planejamento
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Itens Planejados */}
      {planItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receitas Planejadas */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-success">Receitas Planejadas</CardTitle>
            </CardHeader>
            <CardContent>
              {incomeItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma receita planejada
                </p>
              ) : (
                <div className="space-y-3">
                  {incomeItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-success">
                          R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePlanItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Despesas Planejadas */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-destructive">Despesas Planejadas</CardTitle>
            </CardHeader>
            <CardContent>
              {expenseItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma despesa planejada
                </p>
              ) : (
                <div className="space-y-3">
                  {expenseItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-destructive">
                          R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePlanItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};