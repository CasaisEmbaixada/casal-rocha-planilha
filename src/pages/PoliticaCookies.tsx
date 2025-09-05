import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const PoliticaCookies = () => {
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
              Política de Cookies - Casais na Rocha
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="text-lg font-semibold text-primary">1. O que são Cookies</h3>
                <p>
                  Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando 
                  você visita nosso site. Eles nos ajudam a melhorar sua experiência, lembrar 
                  suas preferências e fornecer funcionalidades personalizadas.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">2. Tipos de Cookies Utilizados</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary">Cookies Essenciais</h4>
                    <p>
                      Necessários para o funcionamento básico da plataforma:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Autenticação e sessão do usuário</li>
                      <li>Preferências de segurança</li>
                      <li>Carregar a interface corretamente</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary">Cookies de Funcionalidade</h4>
                    <p>
                      Melhoram sua experiência na plataforma:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Lembrar preferências de tema (claro/escuro)</li>
                      <li>Configurações de visualização</li>
                      <li>Idioma preferido</li>
                      <li>Últimas páginas visitadas</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary">Cookies Analíticos</h4>
                    <p>
                      Nos ajudam a entender como você usa a plataforma:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Páginas mais visitadas</li>
                      <li>Tempo de permanência</li>
                      <li>Funcionalidades mais utilizadas</li>
                      <li>Identificação de erros técnicos</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">3. Finalidades dos Cookies</h3>
                <p>
                  Utilizamos cookies para:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Manter você logado em sua conta</li>
                  <li>Personalizar sua experiência na plataforma</li>
                  <li>Lembrar suas configurações e preferências</li>
                  <li>Analisar o desempenho da plataforma</li>
                  <li>Identificar e corrigir problemas técnicos</li>
                  <li>Melhorar nossos serviços continuamente</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">4. Gerenciamento de Cookies</h3>
                <p>
                  Você pode controlar os cookies através:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Configurações do seu navegador</li>
                  <li>Ferramentas de privacidade do dispositivo</li>
                  <li>Extensões de bloqueio de cookies</li>
                </ul>
                <p>
                  <strong>Atenção:</strong> Desabilitar cookies essenciais pode afetar o 
                  funcionamento da plataforma e sua capacidade de acessar determinadas 
                  funcionalidades.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">5. Cookies de Terceiros</h3>
                <p>
                  Podemos utilizar serviços de terceiros que definem seus próprios cookies:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Serviços de análise de tráfego</li>
                  <li>Ferramentas de suporte ao usuário</li>
                  <li>Integrações com redes sociais</li>
                </ul>
                <p>
                  Estes cookies são regidos pelas políticas de privacidade dos respectivos 
                  fornecedores.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">6. Duração dos Cookies</h3>
                <div className="space-y-2">
                  <p><strong>Cookies de Sessão:</strong> Expiram quando você fecha o navegador</p>
                  <p><strong>Cookies Persistentes:</strong> Permanecem por um período determinado (geralmente 30 dias a 1 ano)</p>
                  <p><strong>Cookies de Preferências:</strong> Mantidos até que você os remova ou modifique</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">7. Atualizações</h3>
                <p>
                  Esta política pode ser atualizada periodicamente para refletir mudanças 
                  em nossos serviços ou regulamentações. Recomendamos revisar esta página 
                  regularmente.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary">8. Contato</h3>
                <p>
                  Para dúvidas sobre nossa política de cookies, entre em contato através 
                  dos canais oficiais do Casais na Rocha.
                </p>
              </section>

              <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-center text-primary font-medium italic">
                  "Transparência em cada detalhe."
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