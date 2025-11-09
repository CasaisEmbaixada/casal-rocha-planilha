import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TermosUso } from "./pages/TermosUso";
import { PoliticaPrivacidade } from "./pages/PoliticaPrivacidade";
import { PoliticaCookies } from "./pages/PoliticaCookies";
import { Ajuda } from "./pages/Ajuda";
import { Tutorial } from "./pages/Tutorial";
import { Sobre } from "./pages/Sobre";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/termos" element={<TermosUso />} />
          <Route path="/politica" element={<PoliticaPrivacidade />} />
          <Route path="/cookies" element={<PoliticaCookies />} />
          <Route path="/ajuda" element={<Ajuda />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/sobre" element={<Sobre />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
