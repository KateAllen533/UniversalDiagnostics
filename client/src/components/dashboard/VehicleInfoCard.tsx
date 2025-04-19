import { StatusBadge } from '@/components/ui/status-badge';
import { VehicleInfo } from '@/lib/vehicleTypes';

interface VehicleInfoCardProps {
  vehicleInfo?: VehicleInfo;
  isConnected: boolean;
}

export default function VehicleInfoCard({ vehicleInfo, isConnected }: VehicleInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-blue">Vehicle Information</h3>
          <p className="text-sm text-gray-500">Basic vehicle data</p>
        </div>
        <StatusBadge status={isConnected ? 'success' : 'default'}>
          <i className={`${isConnected ? 'ri-checkbox-circle-line' : 'ri-information-line'} mr-1`}></i>
          {isConnected ? 'Connected' : 'Not Available'}
        </StatusBadge>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Make</p>
            <p className="text-sm font-medium text-gray-800">{vehicleInfo?.make || '--'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Model</p>
            <p className="text-sm font-medium text-gray-800">{vehicleInfo?.model || '--'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Year</p>
            <p className="text-sm font-medium text-gray-800">{vehicleInfo?.year || '--'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">VIN</p>
            <p className="text-sm font-medium text-gray-800">{vehicleInfo?.vin || '--'}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Engine Type</p>
          <p className="text-sm font-medium text-gray-800">{vehicleInfo?.engineType || '--'}</p>
        </div>
      </div>
    </div>
  );
}
