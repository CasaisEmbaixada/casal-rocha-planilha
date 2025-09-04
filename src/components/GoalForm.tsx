import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GoalForm = ({ open, onClose, onSuccess }: GoalFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    targetAmount: "",
    description: "",
    targetDate: ""
  });
  const { toast } = useToast();

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

      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user.data.user.id,
          title: formData.title,
          category: formData.category,
          target_amount: parseFloat(formData.targetAmount.replace(/[^\d,]/g, '').replace(',', '.')),
          description: formData.description,
          target_date: formData.targetDate || null
        });

      if (error) throw error;

      setFormData({
        title: "",
        category: "",
        targetAmount: "",
        description: "",
        targetDate: ""
      });
      
      toast({
        title: "Sucesso",
        description: "Meta criada com sucesso!"
      });

      onSuccess?.();
      onClose();
      
    } catch (error: any) {
      console.error('Error saving goal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a meta",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      category: "",
      targetAmount: "",
      description: "",
      targetDate: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="targetAmount"
                type="text"
                placeholder="0,00"
                className="pl-10"
                value={formData.targetAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/[^\d]/g, '');
                  if (numericValue) {
                    const formattedValue = parseFloat(numericValue) / 100;
                    setFormData({
                      ...formData, 
                      targetAmount: formattedValue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    });
                  } else {
                    setFormData({...formData, targetAmount: ''});
                  }
                }}
                required
              />
            </div>
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
              onClick={handleClose}
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
  );
};