import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-foreground">
              Política de Privacidade - Casais na Rocha
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="text-lg font-semibold text-primary">1. Informações Coletadas</h3>
                <p>
                  Coletamos as seguintes informações para proporcionar a melhor experiência:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nome da família e e-mail para identificação</li>
                  <li>Dados financeiros inseridos voluntariamente (receitas, gastos, metas)</li>
                  <li>Número de WhatsApp para comunicação e discipulado</li>
                  <li>Informações de uso da plataforma para melhorias</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">2. Como Utilizamos Suas Informações</h3>
                <p>
                  Suas informações são utilizadas para:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fornecer acesso personalizado à plataforma</li>
                  <li>Calcular relatórios financeiros e recomendações</li>
                  <li>Enviar conteúdos de discipulado via WhatsApp</li>
                  <li>Melhorar nossos serviços e funcionalidades</li>
                  <li>Comunicar atualizações importantes da plataforma</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">3. Proteção de Dados</h3>
                <p>
                  Implementamos medidas de segurança robustas para proteger suas informações:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Criptografia de dados sensíveis</li>
                  <li>Acesso restrito apenas à sua família</li>
                  <li>Servidores seguros e monitorados</li>
                  <li>Backups regulares para prevenir perda de dados</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">4. Compartilhamento de Dados</h3>
                <p>
                  Seus dados pessoais e financeiros são tratados com absoluta confidencialidade. 
                  Não compartilhamos, vendemos ou cedemos suas informações a terceiros, exceto:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Quando exigido por lei ou ordem judicial</li>
                  <li>Para provedores de serviços essenciais (hospedagem, segurança)</li>
                  <li>Com sua autorização expressa</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">5. Comunicação via WhatsApp</h3>
                <p>
                  Ao fornecer seu WhatsApp, você autoriza:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Recebimento de materiais de discipulado</li>
                  <li>Lembretes sobre metas financeiras</li>
                  <li>Convites para eventos e atividades</li>
                  <li>Suporte técnico quando necessário</li>
                </ul>
                <p>
                  Você pode solicitar a remoção da lista de comunicação a qualquer momento.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">6. Seus Direitos</h3>
                <p>Você tem direito a:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incorretos</li>
                  <li>Solicitar exclusão de sua conta e dados</li>
                  <li>Revogar consentimentos dados anteriormente</li>
                  <li>Portabilidade de seus dados</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">7. Retenção de Dados</h3>
                <p>
                  Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário 
                  para cumprir obrigações legais. Após a exclusão da conta, os dados são 
                  removidos de nossos sistemas dentro de 30 dias.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">8. Contato</h3>
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                  entre em contato através dos canais oficiais do Casais na Rocha.
                </p>
              </section>

              <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-center text-primary font-medium italic">
                  "Sua privacidade é importante para nós."
                </p>
                <p className="text-center text-sm text-muted-foreground mt-1">
                  — Equipe Casais na Rocha
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};