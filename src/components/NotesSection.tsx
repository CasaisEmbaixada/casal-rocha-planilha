import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Edit3 } from "lucide-react";

export const NotesSection = () => {
  const [notes, setNotes] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Carrega as notas do localStorage ao montar o componente
  useEffect(() => {
    const savedNotes = localStorage.getItem('financialNotes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  // Auto-save das notas
  useEffect(() => {
    if (notes.trim() && isEditing) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('financialNotes', notes);
        setLastSaved(new Date());
        setIsEditing(false);
      }, 2000); // Salva após 2 segundos de inatividade

      return () => clearTimeout(timeoutId);
    }
  }, [notes, isEditing]);

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