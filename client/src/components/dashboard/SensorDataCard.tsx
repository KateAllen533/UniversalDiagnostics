import { StatusBadge } from '@/components/ui/status-badge';
import { SensorData } from '@/lib/vehicleTypes';

interface SensorDataCardProps {
  sensorData?: SensorData;
  isConnected: boolean;
}

export default function SensorDataCard({ sensorData, isConnected }: SensorDataCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-blue">Sensor Data</h3>
          <p className="text-sm text-gray-500">Environmental and system sensors</p>
        </div>
        <StatusBadge status={isConnected ? 'success' : 'default'}>
          <i className={`${isConnected ? 'ri-checkbox-circle-line' : 'ri-information-line'} mr-1`}></i>
          {isConnected ? 'Connected' : 'Not Available'}
        </StatusBadge>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">MAF</p>
            <p className="text-sm font-medium text-gray-800">
              {sensorData?.maf ? `${sensorData.maf.toFixed(1)} g/s` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">MAP</p>
            <p className="text-sm font-medium text-gray-800">
              {sensorData?.map ? `${sensorData.map.toFixed(0)} kPa` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">O2 Sensor</p>
            <p className="text-sm font-medium text-gray-800">
              {sensorData?.o2Sensor ? `${sensorData.o2Sensor.toFixed(2)} V` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Fuel Pressure</p>
            <p className="text-sm font-medium text-gray-800">
              {sensorData?.fuelPressure ? `${sensorData.fuelPressure.toFixed(0)} kPa` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Throttle</p>
            <p className="text-sm font-medium text-gray-800">
              {sensorData?.throttle ? `${sensorData.throttle.toFixed(0)}%` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Short FT</p>
            <p className="text-sm font-medium text-gray-800">
              {sensorData?.shortFuelTrim ? `${sensorData.shortFuelTrim.toFixed(1)}%` : '--'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
