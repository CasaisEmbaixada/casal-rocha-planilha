import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NotificationTester = () => {
  const [title, setTitle] = useState("Nova Atualização Disponível! 🎉");
  const [body, setBody] = useState("O aplicativo foi atualizado com novas funcionalidades.");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const sendTestNotification = async () => {
    try {
      setSending(true);

      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          title,
          body,
          icon: '/pwa-192x192.png',
          url: '/',
          type: 'update'
        }
      });

      if (error) throw error;

      toast({
        title: "Notificação enviada!",
        description: `Enviada para ${data.sent || 0} usuários inscritos.`
      });

      console.log('Notification sent:', data);
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast({
        title: "Erro ao enviar",
        description: error.message || "Não foi possível enviar a notificação.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Enviar Notificação (Teste)
        </CardTitle>
        <CardDescription>
          Envie uma notificação de teste para todos os usuários inscritos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notification-title">Título</Label>
          <Input
            id="notification-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da notificação"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notification-body">Mensagem</Label>
          <Textarea
            id="notification-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Corpo da notificação"
            rows={3}
          />
        </div>

        <Button 
          onClick={sendTestNotification} 
          disabled={sending || !title || !body}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {sending ? 'Enviando...' : 'Enviar Notificação'}
        </Button>
      </CardContent>
    </Card>
  );
};