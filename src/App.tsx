import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import ClickSpark from "@/components/ClickSpark";
import { CursorGlow } from "@/components/CursorGlow";
import { LenisProvider } from "@/lib/lenis";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Project from "./pages/Project";
import Work from "./pages/Work";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <LenisProvider>
      <CursorGlow />
      <ClickSpark
        sparkColor="#5D7CE2"
        sparkSize={8}
        sparkRadius={28}
        sparkCount={8}
        duration={450}
        easing="ease-out"
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/work" element={<Work />} />
                <Route path="/project/:id" element={<Project />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ClickSpark>
    </LenisProvider>
  );
};

export default App;
