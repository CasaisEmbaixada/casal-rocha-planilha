import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle, MessageCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Ajuda = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-muted">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-6 w-6" />
                Central de Ajuda
              </h1>
              <p className="text-white/80">Encontre respostas para suas dúvidas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-soft mb-6">
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
            <CardDescription>
              Respostas para as dúvidas mais comuns sobre o app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Como adicionar uma transação?</AccordionTrigger>
                <AccordionContent>
                  No painel principal, clique em "Adicionar Renda" ou "Adicionar Despesa". 
                  Preencha os campos necessários (valor, categoria, descrição e data) e clique em salvar.
                  Todas as transações ficam organizadas por mês.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Como criar uma meta financeira?</AccordionTrigger>
                <AccordionContent>
                  Vá para a aba "Metas" no menu e clique em "Nova Meta". 
                  Defina o nome da meta, valor alvo e data limite. 
                  Você pode acompanhar o progresso e adicionar valores conforme consegue economizar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Como funciona o planejamento mensal?</AccordionTrigger>
                <AccordionContent>
                  Na aba "Planejamento", você pode definir limites de gastos para cada categoria.
                  O app mostra quanto já foi gasto e quanto ainda resta do orçamento planejado,
                  ajudando você a manter o controle financeiro.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Como usar as anotações?</AccordionTrigger>
                <AccordionContent>
                  A seção de Anotações funciona como um bloco de notas onde você pode guardar
                  informações importantes sobre suas finanças, como metas de longo prazo,
                  lembretes de pagamentos, ou qualquer observação relevante.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Como navegar entre meses diferentes?</AccordionTrigger>
                <AccordionContent>
                  Use as setas de navegação no topo da página para alternar entre os meses.
                  Você pode visualizar e gerenciar transações de qualquer mês, permitindo
                  um acompanhamento histórico das suas finanças.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>O que significa o Saldo Total?</AccordionTrigger>
                <AccordionContent>
                  O Saldo Total é a soma do saldo acumulado de meses anteriores com o resultado
                  do mês atual (rendas - despesas). Isso permite visualizar a saúde financeira
                  completa do casal ao longo do tempo.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Suporte via Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Tem alguma dúvida que não foi respondida aqui? Entre em contato conosco.
              </p>
              <Button className="w-full">
                Iniciar Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email de Suporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Envie um email com sua dúvida ou sugestão para nossa equipe.
              </p>
              <Button variant="outline" className="w-full">
                casais@embaixadadoreino.com
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
