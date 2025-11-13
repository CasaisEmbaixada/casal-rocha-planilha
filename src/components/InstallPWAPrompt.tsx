import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPWAPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Verifica se já instalou ou dispensou
    const hasInstalled = localStorage.getItem("pwa-installed");
    const hasDismissed = localStorage.getItem("pwa-dismissed");
    
    if (hasInstalled || hasDismissed) {
      return;
    }

    // Detecta se o app pode ser instalado
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Mostra o prompt após 3 segundos (tempo para usuário ver o dashboard)
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detecta quando o app foi instalado
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("pwa-installed", "true");
      setShowPrompt(false);
      toast.success("App instalado com sucesso! 🎉");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      localStorage.setItem("pwa-installed", "true");
      toast.success("Instalando o app... 📲");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-dismissed", "true");
    setShowPrompt(false);
    toast.info("Você pode instalar o app depois nas configurações");
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl animate-in slide-in-from-top duration-300">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Instalar Casais na Rocha
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione o app à sua tela inicial para acesso rápido e experiência completa! 
                Funciona offline e ocupa pouco espaço. ❤️
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleInstall}
                  className="flex-1 sm:flex-none"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar App
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Agora não
                </Button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
