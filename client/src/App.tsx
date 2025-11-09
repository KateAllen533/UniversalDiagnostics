import { Switch, Route, useLocation, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Diagnostics from "@/pages/diagnostics";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import ReportIssue from "@/pages/report-issue";
import AdvancedDiagnostics from "@/pages/advanced-diagnostics";
import Help from "@/pages/help";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfUse from "@/pages/terms-of-use";
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
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-use" component={TermsOfUse} />
        <Route component={NotFound} />
      </Switch>
      <footer className="bg-background border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Universal Vehicle Diagnostics &copy; {new Date().getFullYear()}. All rights reserved. 
              Powered by <a href="https://www.s-tecm.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">NovarisAI</a>
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/help">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Help</a>
              </Link>
              <Link href="/privacy-policy">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              </Link>
              <Link href="/terms-of-use">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Use</a>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const accepted = localStorage.getItem("disclaimerAccepted") === "true";
    setDisclaimerAccepted(accepted);
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("disclaimerAccepted", "true");
    setDisclaimerAccepted(true);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false} suppressHydrationWarning>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <DisclaimerOverlay 
            isVisible={!disclaimerAccepted} 
            onAccept={handleAcceptDisclaimer} 
          />
          <SetupDefaultUser />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
