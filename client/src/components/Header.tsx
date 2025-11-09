import { Link } from 'wouter';
import { ConnectionIndicator } from '@/components/ui/connection-indicator';
import { useConnection } from '@/hooks/use-connection';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

type NavItem = {
  path: string;
  label: string;
  icon: string;
};

interface HeaderProps {
  currentPath: string;
}

export default function Header({ currentPath }: HeaderProps) {
  const { connectionStatus, connectionInfo } = useConnection();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { path: '/diagnostics', label: 'Diagnostics', icon: 'ri-error-warning-line' },
    { path: '/advanced-diagnostics', label: 'G2 Turbo', icon: 'ri-tools-line' },
    { path: '/history', label: 'History', icon: 'ri-history-line' },
    { path: '/settings', label: 'Settings', icon: 'ri-settings-line' },
    { path: '/report-issue', label: 'Report Issue', icon: 'ri-feedback-line' },
  ];

  const connectionText = connectionInfo ? 
    `Connected via ${connectionInfo.protocol}` :
    undefined;

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-30 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 flex justify-between items-center py-3">
        <div className="flex items-center space-x-2">
          <i className="ri-car-line text-primary text-2xl"></i>
          <h1 className="text-xl font-bold text-foreground">Universal Diagnostics</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {/* Connection Status Badge */}
          <div className="flex items-center gap-2 bg-muted py-1.5 px-3 rounded-full">
            <ConnectionIndicator 
              status={connectionStatus} 
              connectionInfo={connectionText}
            />
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 border-b border-border">
        <nav className="flex overflow-x-auto hide-scrollbar">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
            >
              <a 
                className={`px-4 py-3 font-medium border-b-2 flex items-center transition-colors ${
                  currentPath === item.path 
                    ? 'text-primary border-primary' 
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                <i className={`${item.icon} mr-1.5`}></i>
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
