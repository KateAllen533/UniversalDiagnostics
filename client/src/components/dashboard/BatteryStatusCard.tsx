import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { BatteryStatus } from '@/lib/vehicleTypes';

interface BatteryStatusCardProps {
  batteryStatus?: BatteryStatus;
  isConnected: boolean;
}

export default function BatteryStatusCard({ batteryStatus, isConnected }: BatteryStatusCardProps) {
  const chargePercentage = batteryStatus?.stateOfCharge || 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-blue">Battery Status</h3>
          <p className="text-sm text-gray-500">Power system health</p>
        </div>
        <StatusBadge status={isConnected ? 'success' : 'default'}>
          <i className={`${isConnected ? 'ri-checkbox-circle-line' : 'ri-information-line'} mr-1`}></i>
          {isConnected ? 'Connected' : 'Not Available'}
        </StatusBadge>
      </div>
      <div className="space-y-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-primary">
                State of Charge
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary">
                {batteryStatus ? `${chargePercentage}%` : '--'}
              </span>
            </div>
          </div>
          <Progress 
            value={chargePercentage}
            className="h-2 mb-4"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Voltage</p>
            <p className="text-sm font-medium text-gray-800">
              {batteryStatus?.voltage ? `${batteryStatus.voltage.toFixed(1)} V` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Current</p>
            <p className="text-sm font-medium text-gray-800">
              {batteryStatus?.current ? `${batteryStatus.current.toFixed(1)} A` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Temperature</p>
            <p className="text-sm font-medium text-gray-800">
              {batteryStatus?.temperature ? `${batteryStatus.temperature.toFixed(1)} °C` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Health</p>
            <p className="text-sm font-medium text-gray-800">
              {batteryStatus?.health || '--'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
