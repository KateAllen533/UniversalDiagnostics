import { StatusBadge } from '@/components/ui/status-badge';
import { EngineData } from '@/lib/vehicleTypes';

interface EngineDataCardProps {
  engineData?: EngineData;
  isConnected: boolean;
}

export default function EngineDataCard({ engineData, isConnected }: EngineDataCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-blue">Engine Data</h3>
          <p className="text-sm text-gray-500">Real-time performance metrics</p>
        </div>
        <StatusBadge status={isConnected ? 'success' : 'default'}>
          <i className={`${isConnected ? 'ri-checkbox-circle-line' : 'ri-information-line'} mr-1`}></i>
          {isConnected ? 'Connected' : 'Not Available'}
        </StatusBadge>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">RPM</p>
            <p className="text-sm font-medium text-gray-800">
              {engineData?.rpm ? `${engineData.rpm.toFixed(0)}` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Speed</p>
            <p className="text-sm font-medium text-gray-800">
              {engineData?.speed ? `${engineData.speed.toFixed(0)} km/h` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Coolant Temp</p>
            <p className="text-sm font-medium text-gray-800">
              {engineData?.coolantTemp ? `${engineData.coolantTemp.toFixed(0)} °C` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Intake Temp</p>
            <p className="text-sm font-medium text-gray-800">
              {engineData?.intakeTemp ? `${engineData.intakeTemp.toFixed(0)} °C` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Load</p>
            <p className="text-sm font-medium text-gray-800">
              {engineData?.load ? `${engineData.load.toFixed(0)}%` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Timing</p>
            <p className="text-sm font-medium text-gray-800">
              {engineData?.timing ? `${engineData.timing.toFixed(1)}°` : '--'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
