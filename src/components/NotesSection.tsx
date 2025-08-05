import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Edit3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const NotesSection = () => {
  const [notes, setNotes] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Carrega as notas do Supabase ao montar o componente
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading notes:', error);
        return;
      }

      if (data) {
        setNotes(data.content || '');
        setNoteId(data.id);
        setLastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  // Auto-save das notas
  useEffect(() => {
    if (notes.trim() && isEditing) {
      const timeoutId = setTimeout(() => {
        saveNotes();
      }, 2000); // Salva após 2 segundos de inatividade

      return () => clearTimeout(timeoutId);
    }
  }, [notes, isEditing]);

  const saveNotes = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        });
        return;
      }

      if (noteId) {
        // Atualiza nota existente
        const { error } = await supabase
          .from('notes')
          .update({
            content: notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', noteId);

        if (error) throw error;
      } else {
        // Cria nova nota
        const { data, error } = await supabase
          .from('notes')
          .insert({
            user_id: user.data.user.id,
            title: 'Anotações Financeiras',
            content: notes
          })
          .select()
          .single();

        if (error) throw error;
        setNoteId(data.id);
      }

      setLastSaved(new Date());
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as anotações",
        variant: "destructive"
      });
    }
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setIsEditing(true);
  };

  const formatLastSaved = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Edit3 className="h-5 w-5 text-primary" />
                <span>Nossas Anotações Financeiras</span>
              </CardTitle>
              <CardDescription>
                Use este espaço para registrar decisões importantes, ideias e insights sobre suas finanças
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Badge variant="secondary" className="text-xs">
                  <Edit3 className="h-3 w-3 mr-1" />
                  Editando...
                </Badge>
              ) : lastSaved ? (
                <Badge variant="outline" className="text-xs">
                  <Save className="h-3 w-3 mr-1" />
                  Salvo
                </Badge>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Digite aqui suas reflexões sobre finanças, decisões importantes que tomaram como casal, metas alcançadas, insights das sessões do curso, ideias para otimizar o orçamento..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            
            {lastSaved && (
              <p className="text-xs text-muted-foreground flex items-center space-x-1">
                <Save className="h-3 w-3" />
                <span>Última atualização: {formatLastSaved(lastSaved)}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dicas para uso das anotações */}
      <Card className="border-accent bg-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">💡 Dicas para suas anotações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-primary mb-2">📊 Análise Financeira</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Padrões de gastos identificados</li>
                <li>• Categorias que consomem mais</li>
                <li>• Oportunidades de economia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">🎯 Metas e Objetivos</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Próximas metas financeiras</li>
                <li>• Estratégias para alcançá-las</li>
                <li>• Prazos e valores específicos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">💬 Decisões do Casal</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Acordos financeiros importantes</li>
                <li>• Divisão de responsabilidades</li>
                <li>• Regras de gastos estabelecidas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">📚 Aprendizados</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Insights do curso</li>
                <li>• Lições aprendidas</li>
                <li>• Mudanças de comportamento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};