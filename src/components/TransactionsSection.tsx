import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { FinanceForm } from "./FinanceForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface TransactionsSectionProps {
  selectedMonth: Date;
}

export const TransactionsSection = ({ selectedMonth }: TransactionsSectionProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const transactionsPerPage = 5;

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth]);

  // Recarregar transações quando a seção for exibida
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadTransactions();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [selectedMonth]);

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
      setCurrentPage(1);
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

      // Só adiciona à lista se for do mês selecionado
      const transactionDate = new Date(transaction.date);
      const currentMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const nextMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1);
      
      if (transactionDate >= currentMonth && transactionDate < nextMonth) {
        setTransactions([newTransaction, ...transactions]);
      }
      
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

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const exportToExcel = () => {
    const exportData = transactions.map(transaction => ({
      'Data': new Date(transaction.date).toLocaleDateString('pt-BR'),
      'Tipo': transaction.type === 'income' ? 'Renda' : 'Despesa',
      'Categoria': transaction.category,
      'Descrição': transaction.description,
      'Valor': transaction.amount
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações');
    
    const fileName = `transacoes_${selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(' ', '_')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    toast({
      title: "Sucesso",
      description: "Transações exportadas com sucesso!"
    });
  };

  return (
    <div className="space-y-6">
      {/* Resumo do Mês */}
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
            <p className="text-xs text-muted-foreground">{incomeTransactions.length} transações</p>
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
            <p className="text-xs text-muted-foreground">{expenseTransactions.length} transações</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {transactions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Adicionar Transações</CardTitle>
          <CardDescription>
            Registre suas rendas e despesas para {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setShowIncomeForm(true)}
            className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Renda
          </Button>
          <Button 
            onClick={() => setShowExpenseForm(true)}
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Minus className="h-4 w-4 mr-2" />
            Adicionar Despesa
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transações do Mês</CardTitle>
              <CardDescription>
                Todas as movimentações de {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </div>
            {transactions.length > 0 && (
              <Button 
                onClick={exportToExcel}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Excel</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Carregando transações...</p>
          ) : transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma transação registrada para este mês. Comece adicionando uma renda ou despesa!
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {currentTransactions.map((transaction) => (
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
                        <p className="text-sm text-muted-foreground">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
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

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

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