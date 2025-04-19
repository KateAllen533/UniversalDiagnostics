import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Diagnostics from "@/pages/diagnostics";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import DisclaimerOverlay from "@/components/DisclaimerOverlay";
import Header from "@/components/Header";

function Router() {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath={location} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/diagnostics" component={Diagnostics} />
        <Route path="/history" component={History} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-2 md:mb-0">
              Universal Vehicle Diagnostics &copy; {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-primary">Help</a>
              <a href="#" className="text-sm text-gray-600 hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-primary">Terms of Use</a>
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
      <TooltipProvider>
        <Toaster />
        <DisclaimerOverlay 
          isVisible={!disclaimerAccepted} 
          onAccept={handleAcceptDisclaimer} 
        />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
