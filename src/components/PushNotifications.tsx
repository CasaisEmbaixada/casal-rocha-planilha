import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const PushNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const { toast } = useToast();

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    if (!("Notification" in window)) {
      return;
    }

    setPermission(Notification.permission);

    if (Notification.permission === "granted") {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPush = async () => {
    try {
      setLoading(true);

      // Solicitar permissão
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== "granted") {
        toast({
          title: "Permissão negada",
          description: "Você precisa permitir notificações para continuar.",
          variant: "destructive"
        });
        return;
      }

      // Obter service worker registration
      const registration = await navigator.serviceWorker.ready;

      // VAPID public key (você precisa gerar suas próprias chaves)
      // Para gerar: npx web-push generate-vapid-keys
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      // Criar subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      // Salvar no Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Verificar se já existe uma subscription
      const { data: existing } = await supabase
        .from('push_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Atualizar subscription existente
        await supabase
          .from('push_subscriptions')
          .update({ subscription: subscription.toJSON() as any })
          .eq('user_id', user.id);
      } else {
        // Criar nova subscription
        await supabase
          .from('push_subscriptions')
          .insert([{
            user_id: user.id,
            subscription: subscription.toJSON() as any
          }]);
      }

      setIsSubscribed(true);
      toast({
        title: "Notificações ativadas",
        description: "Você receberá notificações sobre atualizações e lembretes financeiros."
      });
    } catch (error: any) {
      console.error('Error subscribing to push:', error);
      toast({
        title: "Erro",
        description: "Não foi possível ativar as notificações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      setLoading(true);

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      // Remover do Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id);
      }

      setIsSubscribed(false);
      toast({
        title: "Notificações desativadas",
        description: "Você não receberá mais notificações push."
      });
    } catch (error: any) {
      console.error('Error unsubscribing from push:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desativar as notificações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      await subscribeToPush();
    } else {
      await unsubscribeFromPush();
    }
  };

  if (!("Notification" in window)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSubscribed ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          Notificações Push
        </CardTitle>
        <CardDescription>
          Receba notificações sobre atualizações do app e lembretes financeiros
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">
              Ativar notificações
            </div>
            <div className="text-sm text-muted-foreground">
              {permission === "denied" 
                ? "Permissão bloqueada. Ative nas configurações do navegador."
                : "Receba avisos importantes diretamente no dispositivo"}
            </div>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleToggle}
            disabled={loading || permission === "denied"}
          />
        </div>

        {permission === "denied" && (
          <div className="text-sm text-destructive">
            As notificações foram bloqueadas. Para ativar, vá nas configurações do navegador e permita notificações para este site.
          </div>
        )}

        {isSubscribed && (
          <div className="rounded-lg bg-primary/10 p-3 text-sm">
            ✅ Você está inscrito e receberá notificações sobre:
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>Novas atualizações do aplicativo</li>
              <li>Lembretes para registrar despesas</li>
              <li>Alertas de metas financeiras</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};