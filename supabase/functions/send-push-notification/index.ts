import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  type?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { title, body, icon, url, type = 'general' }: NotificationRequest = await req.json();

    console.log('Sending push notification:', { title, body, type });

    // Buscar todas as subscriptions ativas
    const { data: subscriptions, error: fetchError } = await supabaseClient
      .from('push_subscriptions')
      .select('subscription, user_id');

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      throw fetchError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found');
      return new Response(
        JSON.stringify({ message: 'No subscriptions to send to' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Found ${subscriptions.length} subscriptions`);

    // VAPID keys - você precisa gerar suas próprias chaves
    // Para gerar: npx web-push generate-vapid-keys
    const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
    const vapidPrivateKey = 'ttMhny7J9zZDf8f3E-_-OJF3m9hZvN2P5j5HkTLSkr0';

    // Enviar para cada subscription
    const results = await Promise.allSettled(
      subscriptions.map(async ({ subscription }) => {
        try {
          // Use web-push library
          const webpush = await import('https://esm.sh/web-push@3.6.6');
          
          webpush.setVapidDetails(
            'mailto:contato@casaisnarocha.com',
            vapidPublicKey,
            vapidPrivateKey
          );

          const payload = JSON.stringify({
            title,
            body,
            icon: icon || '/pwa-192x192.png',
            url: url || '/',
          });

          await webpush.sendNotification(subscription, payload);
          return { success: true };
        } catch (error) {
          console.error('Error sending to subscription:', error);
          return { success: false, error };
        }
      })
    );

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failCount = results.length - successCount;

    console.log(`Sent ${successCount} notifications, ${failCount} failed`);

    // Salvar no histórico
    const { error: historyError } = await supabaseClient
      .from('notification_history')
      .insert({
        title,
        body,
        icon,
        url,
        notification_type: type,
        recipients_count: successCount
      });

    if (historyError) {
      console.error('Error saving to history:', historyError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successCount, 
        failed: failCount,
        total: subscriptions.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error: any) {
    console.error('Error in send-push-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});