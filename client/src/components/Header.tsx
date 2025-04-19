import { Link } from 'wouter';
import { ConnectionIndicator } from '@/components/ui/connection-indicator';
import { useConnection } from '@/hooks/use-connection';

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
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 flex justify-between items-center py-3">
        <div className="flex items-center space-x-2">
          <i className="ri-car-line text-primary text-2xl"></i>
          <h1 className="text-xl font-bold text-dark-blue">Universal Diagnostics</h1>
        </div>
        
        {/* Connection Status Badge */}
        <div className="flex items-center gap-2 bg-gray-100 py-1.5 px-3 rounded-full">
          <ConnectionIndicator 
            status={connectionStatus} 
            connectionInfo={connectionText}
          />
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 border-b border-gray-200">
        <nav className="flex overflow-x-auto hide-scrollbar">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
            >
              <a 
                className={`px-4 py-3 font-medium border-b-2 flex items-center ${
                  currentPath === item.path 
                    ? 'text-primary border-primary' 
                    : 'text-gray-500 border-transparent hover:text-gray-700'
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
