import { Link } from 'wouter';
import { ConnectionIndicator } from '@/components/ui/connection-indicator';
import { useConnection } from '@/hooks/use-connection';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
            <i className="ri-car-line text-primary text-2xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Universal Diagnostics</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Professional Vehicle Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/80 py-2 px-4 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <ConnectionIndicator 
              status={connectionStatus} 
              connectionInfo={connectionText}
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <nav className="flex overflow-x-auto hide-scrollbar -mb-px">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
            >
              <a 
                className={`px-5 py-3 font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                  currentPath === item.path 
                    ? 'text-primary border-primary bg-primary/5 dark:bg-primary/10' 
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-primary/30'
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="text-sm">{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
