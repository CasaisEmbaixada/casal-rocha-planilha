import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Plus, Minus, TrendingUp, Target, FileText, LogOut } from "lucide-react";
import { FinanceForm } from "./FinanceForm";
import { FinanceChart } from "./FinanceChart";
import { NotesSection } from "./NotesSection";
import { GoalsSection } from "./GoalsSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface DashboardProps {
  onLogout: () => void;
  familyName?: string;
}

export const Dashboard = ({ onLogout, familyName = "Família" }: DashboardProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedTransactions = data?.map(transaction => ({
        id: transaction.id,
        type: transaction.type as 'income' | 'expense',
        amount: Number(transaction.amount),
        category: transaction.category,
        description: transaction.description || '',
        date: transaction.date
      })) || [];

      setTransactions(formattedTransactions);
    } catch (error: any) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as transações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.data.user.id,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction = {
        id: data.id,
        type: data.type as 'income' | 'expense',
        amount: Number(data.amount),
        category: data.category,
        description: data.description || '',
        date: data.date
      };

      setTransactions([newTransaction, ...transactions]);
      setShowIncomeForm(false);
      setShowExpenseForm(false);
      
      toast({
        title: "Sucesso",
        description: `${transaction.type === 'income' ? 'Renda' : 'Despesa'} adicionada com sucesso!`
      });
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a transação",
        variant: "destructive"
      });
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  console.log("Dashboard rendered for:", familyName);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-muted">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-white fill-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Casais na Rocha</h1>
                <p className="text-white/80">Olá, {familyName}!</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Painel</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Metas</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Anotações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Rendas do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Despesas do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saldo do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                    R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ações Rápidas */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>
                    Adicione suas rendas e despesas facilmente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setShowIncomeForm(true)}
                    className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Renda
                  </Button>
                  <Button 
                    onClick={() => setShowExpenseForm(true)}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Adicionar Despesa
                  </Button>
                </CardContent>
              </Card>

              {/* Gráfico de Despesas */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Distribuição de Despesas</CardTitle>
                  <CardDescription>
                    Visualize como seus gastos estão distribuídos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FinanceChart transactions={transactions.filter(t => t.type === 'expense')} />
                </CardContent>
              </Card>

              {/* Transações Recentes */}
              <Card className="shadow-soft lg:col-span-2">
                <CardHeader>
                  <CardTitle>Transações Recentes</CardTitle>
                  <CardDescription>
                    Suas últimas movimentações financeiras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma transação registrada ainda. Comece adicionando uma renda ou despesa!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => (
                        <div 
                          key={transaction.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'income' 
                                ? 'bg-success/20 text-success' 
                                : 'bg-destructive/20 text-destructive'
                            }`}>
                              {transaction.type === 'income' ? 
                                <Plus className="h-4 w-4" /> : 
                                <Minus className="h-4 w-4" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">{transaction.category}</p>
                            </div>
                          </div>
                          <div className={`font-semibold ${
                            transaction.type === 'income' ? 'text-success' : 'text-destructive'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals">
            <GoalsSection />
          </TabsContent>

          <TabsContent value="notes">
            <NotesSection />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modais de Formulário */}
      {showIncomeForm && (
        <FinanceForm
          type="income"
          onSubmit={addTransaction}
          onClose={() => setShowIncomeForm(false)}
        />
      )}

      {showExpenseForm && (
        <FinanceForm
          type="expense"
          onSubmit={addTransaction}
          onClose={() => setShowExpenseForm(false)}
        />
      )}
    </div>
  );
};