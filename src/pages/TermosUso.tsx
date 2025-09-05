import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const TermosUso = () => {
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
              Termos de Uso - Casais na Rocha
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="text-lg font-semibold text-primary">1. Aceitação dos Termos</h3>
                <p>
                  Ao utilizar a plataforma Casais na Rocha, você concorda com os presentes termos de uso. 
                  Esta plataforma foi desenvolvida para auxiliar casais no gerenciamento financeiro e 
                  crescimento espiritual através de ferramentas práticas e orientações bíblicas.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">2. Propósito da Plataforma</h3>
                <p>
                  O Casais na Rocha oferece ferramentas para:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Gerenciamento financeiro colaborativo entre casais</li>
                  <li>Planejamento de metas financeiras e pessoais</li>
                  <li>Acompanhamento de gastos e receitas</li>
                  <li>Acesso a conteúdos de discipulado e crescimento espiritual</li>
                  <li>Comunicação via WhatsApp para orientações e discipulado</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">3. Uso Responsável</h3>
                <p>
                  O usuário compromete-se a utilizar a plataforma de forma responsável, inserindo 
                  informações verdadeiras e mantendo a confidencialidade de seus dados de acesso. 
                  É vedado o uso da plataforma para fins ilícitos ou que contrariem os princípios 
                  cristãos que norteiam o projeto.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">4. Comunicação e Discipulado</h3>
                <p>
                  Ao se cadastrar, você autoriza o contato via WhatsApp para:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Envio de materiais de discipulado</li>
                  <li>Orientações sobre gestão financeira cristã</li>
                  <li>Convites para eventos e atividades da comunidade</li>
                  <li>Suporte técnico da plataforma</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">5. Proteção de Dados</h3>
                <p>
                  Respeitamos sua privacidade e protegemos suas informações pessoais e financeiras 
                  conforme nossa Política de Privacidade. Seus dados não serão compartilhados com 
                  terceiros sem sua autorização expressa.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">6. Modificações</h3>
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após sua publicação na plataforma.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">7. Contato</h3>
                <p>
                  Para dúvidas sobre estes termos, entre em contato conosco através dos canais 
                  oficiais do Casais na Rocha.
                </p>
              </section>

              <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-center text-primary font-medium italic">
                  "Onde há acordo, há prosperidade."
                </p>
                <p className="text-center text-sm text-muted-foreground mt-1">
                  — Casais na Rocha
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};