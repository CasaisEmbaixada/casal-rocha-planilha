import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Minus, TrendingUp, Target, FileText, Receipt, Calculator, Settings, Heart, LogOut, HelpCircle, GraduationCap, Info } from "lucide-react";
import { FinanceForm } from "./FinanceForm";
import { FinanceChart } from "./FinanceChart";
import { NotesSection } from "./NotesSection";
import { GoalsSection } from "./GoalsSection";
import { TransactionsSection } from "./TransactionsSection";
import { MonthlyPlanningSection } from "./MonthlyPlanningSection";
import { MonthNavigator } from "./MonthNavigator";
import { SettingsSection } from "./SettingsSection";
import { GoalForm } from "./GoalForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [accumulatedBalance, setAccumulatedBalance] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadTransactions();
    calculateAccumulatedBalance();
  }, [selectedMonth]);

  // Recarregar dados quando trocar de aba
  useEffect(() => {
    if (activeTab === "dashboard") {
      loadTransactions();
    }
  }, [activeTab]);

  const calculateAccumulatedBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .lt('date', new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      const previousBalance = data?.reduce((acc, transaction) => {
        return acc + (transaction.type === 'income' ? Number(transaction.amount) : -Number(transaction.amount));
      }, 0) || 0;

      setAccumulatedBalance(Math.max(0, previousBalance)); // Só acumula se positivo
    } catch (error) {
      console.error('Error calculating accumulated balance:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])
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

  const monthlyBalance = totalIncome - totalExpenses;
  const totalBalance = accumulatedBalance + monthlyBalance;

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
              <div>
                <h1 className="text-2xl font-bold text-white">Casais Na Rocha</h1>
                <p className="text-white/80">Olá, {familyName}!</p>
              </div>
            </div>
            
            {/* Menu Mobile - Heart Menu Icon */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-white p-2">
                    <svg 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="h-12 w-12"
                    >
                      {/* Heart-shaped menu lines */}
                      <path 
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        fill="none"
                      />
                      {/* Menu lines inside the heart */}
                      <line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="10" y1="15" x2="14" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-6 mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Menu</h2>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-foreground"
                      onClick={() => setActiveTab("dashboard")}
                    >
                      <TrendingUp className="h-8 w-8" />
                      <span className="text-xl">Painel</span>
                    </button>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-foreground"
                      onClick={() => setActiveTab("transactions")}
                    >
                      <Receipt className="h-8 w-8" />
                      <span className="text-xl">Lançamentos</span>
                    </button>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-foreground"
                      onClick={() => setActiveTab("planning")}
                    >
                      <Calculator className="h-8 w-8" />
                      <span className="text-xl">Planejamento</span>
                    </button>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-foreground"
                      onClick={() => setActiveTab("goals")}
                    >
                      <Target className="h-8 w-8" />
                      <span className="text-xl">Metas</span>
                    </button>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-foreground"
                      onClick={() => setActiveTab("notes")}
                    >
                      <FileText className="h-8 w-8" />
                      <span className="text-xl">Anotações</span>
                    </button>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-foreground"
                      onClick={() => navigate("/ajuda")}
                    >
                      <HelpCircle className="h-8 w-8" />
                      <span className="text-xl">Ajuda</span>
                    </button>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-foreground"
                      onClick={() => navigate("/tutorial")}
                    >
                      <GraduationCap className="h-8 w-8" />
                      <span className="text-xl">Tutorial</span>
                    </button>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-foreground"
                      onClick={() => navigate("/sobre")}
                    >
                      <Info className="h-8 w-8" />
                      <span className="text-xl">Sobre</span>
                    </button>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-foreground"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-8 w-8" />
                      <span className="text-xl">Configurações</span>
                    </button>
                    <button 
                      className="flex items-center space-x-4 text-left py-2 text-destructive"
                      onClick={onLogout}
                    >
                      <LogOut className="h-8 w-8" />
                      <span className="text-xl">Sair do app</span>
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navegador de Mês */}
        <MonthNavigator 
          selectedMonth={selectedMonth} 
          onMonthChange={setSelectedMonth}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Tabs - Hidden on Mobile */}
          <TabsList className="hidden lg:grid w-full lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Painel</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <Receipt className="h-4 w-4" />
              <span>Lançamentos</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Planejamento</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Metas</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Anotações</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
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
                  <p className="text-xs text-muted-foreground">
                    {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
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
                  <p className="text-xs text-muted-foreground">
                    {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saldo Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
                    R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Acumulado + Mês atual: R$ {monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
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
                  <Button 
                    onClick={() => setShowGoalForm(true)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Criar Meta
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
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Transações Recentes</CardTitle>
                      <CardDescription>
                        Suas últimas movimentações financeiras
                      </CardDescription>
                    </div>
                  </div>
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

          <TabsContent value="transactions">
            <TransactionsSection selectedMonth={selectedMonth} />
          </TabsContent>

          <TabsContent value="planning">
            <MonthlyPlanningSection selectedMonth={selectedMonth} />
          </TabsContent>

          <TabsContent value="goals">
            <GoalsSection />
          </TabsContent>

          <TabsContent value="notes">
            <NotesSection />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsSection onLogout={onLogout} familyName={familyName} />
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

      <GoalForm 
        open={showGoalForm}
        onClose={() => setShowGoalForm(false)}
      />
    </div>
  );
};
