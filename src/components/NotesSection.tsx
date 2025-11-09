import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit3, Trash2, StickyNote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const NotesSection = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as anotações",
        variant: "destructive"
      });
    }
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      toast({
        title: "Erro",
        description: "O título não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

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

      if (editingNote) {
        // Atualiza nota existente
        const { error } = await supabase
          .from('notes')
          .update({
            title: noteTitle,
            content: noteContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNote.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Anotação atualizada com sucesso"
        });
      } else {
        // Cria nova nota
        const { error } = await supabase
          .from('notes')
          .insert({
            user_id: user.data.user.id,
            title: noteTitle,
            content: noteContent
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Anotação criada com sucesso"
        });
      }

      setIsDialogOpen(false);
      setEditingNote(null);
      setNoteTitle("");
      setNoteContent("");
      loadNotes();
    } catch (error: any) {
      console.error('Error saving note:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a anotação",
        variant: "destructive"
      });
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setIsDialogOpen(true);
  };

  const handleDeleteNote = async () => {
    if (!deleteNoteId) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', deleteNoteId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Anotação excluída com sucesso"
      });

      setDeleteNoteId(null);
      loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a anotação",
        variant: "destructive"
      });
    }
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
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
                <StickyNote className="h-5 w-5 text-primary" />
                <span>Bloco de Anotações</span>
              </CardTitle>
              <CardDescription>
                Gerencie suas anotações financeiras
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewNote} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Anotação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingNote ? "Editar Anotação" : "Nova Anotação"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingNote ? "Edite sua anotação" : "Crie uma nova anotação"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Título
                    </label>
                    <Input
                      id="title"
                      placeholder="Ex: Planejamento de Férias"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      Conteúdo
                    </label>
                    <Textarea
                      id="content"
                      placeholder="Digite o conteúdo da sua anotação..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingNote(null);
                      setNoteTitle("");
                      setNoteContent("");
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveNote}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Nenhuma anotação criada ainda.</p>
              <p className="text-sm">Clique em "Nova Anotação" para começar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold line-clamp-1">
                        {note.title}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteNoteId(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {formatDate(note.updated_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                      {note.content || "Sem conteúdo"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteNoteId} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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