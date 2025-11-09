import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Diagnostics from "@/pages/diagnostics";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import ReportIssue from "@/pages/report-issue";
import AdvancedDiagnostics from "@/pages/advanced-diagnostics";
import Help from "@/pages/help";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import DisclaimerOverlay from "@/components/DisclaimerOverlay";
import Header from "@/components/Header";
import { trackPageView } from "./lib/metrics";
import SetupDefaultUser from "@/components/setup-default-user";

function Router() {
  const [location] = useLocation();
  
  // Track page views when location changes
  useEffect(() => {
    // Get page name from path
    const path = location || '/';
    const pageName = path === '/' ? 'home' : path.substring(1);
    
    // Track the page view
    trackPageView(pageName);
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath={location} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/diagnostics" component={Diagnostics} />
        <Route path="/advanced-diagnostics" component={AdvancedDiagnostics} />
        <Route path="/history" component={History} />
        <Route path="/settings" component={Settings} />
        <Route path="/report-issue" component={ReportIssue} />
        <Route path="/help" component={Help} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <i className="ri-car-line text-primary text-xl"></i>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Universal Vehicle Diagnostics &copy; {new Date().getFullYear()}
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Powered by{" "}
                <a 
                  href="https://www.s-tecm.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Novarisai
                </a>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="/help" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                <i className="ri-question-line"></i>
                Help
              </a>
              <a href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                <i className="ri-shield-line"></i>
                Privacy
              </a>
              <a href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                <i className="ri-file-text-line"></i>
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);

  useEffect(() => {
    const accepted = localStorage.getItem("disclaimerAccepted") === "true";
    setDisclaimerAccepted(accepted);
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("disclaimerAccepted", "true");
    setDisclaimerAccepted(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vehicle-diagnostics-theme">
        <TooltipProvider>
          <Toaster />
          <DisclaimerOverlay 
            isVisible={!disclaimerAccepted} 
            onAccept={handleAcceptDisclaimer} 
          />
          <SetupDefaultUser />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
