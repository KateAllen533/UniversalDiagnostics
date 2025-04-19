import { cn } from '@/lib/utils';

type ConnectionIndicatorProps = {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  className?: string;
  showText?: boolean;
  connectionInfo?: string;
};

export function ConnectionIndicator({ 
  status, 
  className, 
  showText = true,
  connectionInfo
}: ConnectionIndicatorProps) {
  const statusConfig = {
    connected: {
      color: 'bg-secondary',
      text: connectionInfo || 'Connected'
    },
    connecting: {
      color: 'bg-warning',
      text: 'Connecting...'
    },
    disconnected: {
      color: 'bg-gray-400',
      text: 'Not Connected'
    },
    error: {
      color: 'bg-danger',
      text: 'Connection Error'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('h-2.5 w-2.5 rounded-full', config.color)} />
      {showText && <span className="text-sm font-medium text-gray-600">{config.text}</span>}
    </div>
  );
}
