import ConnectionSetup from '@/components/ConnectionSetup';
import VehicleInfoCard from '@/components/dashboard/VehicleInfoCard';
import DiagnosticSummaryCard from '@/components/dashboard/DiagnosticSummaryCard';
import BatteryStatusCard from '@/components/dashboard/BatteryStatusCard';
import EngineDataCard from '@/components/dashboard/EngineDataCard';
import SensorDataCard from '@/components/dashboard/SensorDataCard';
import DataMonitoringCard from '@/components/dashboard/DataMonitoringCard';
import PerformanceMetrics from '@/components/dashboard/PerformanceMetrics';
import { useConnection } from '@/hooks/use-connection';
import { useVehicleData } from '@/hooks/use-vehicle-data';

export default function Dashboard() {
  const { connectionStatus } = useConnection();
  const { vehicleData, dataHistory } = useVehicleData();
  
  const isConnected = connectionStatus === 'connected';

  return (
    <div className="page-container">
      <ConnectionSetup />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
            <i className="ri-dashboard-line text-primary text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Real-time vehicle diagnostics and monitoring</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card-hover">
          <VehicleInfoCard 
            vehicleInfo={vehicleData?.vehicleInfo} 
            isConnected={isConnected} 
          />
        </div>
        
        <div className="card-hover">
          <DiagnosticSummaryCard 
            troubleCodes={vehicleData?.troubleCodes} 
            milStatus={vehicleData?.milStatus} 
            readiness={vehicleData?.readiness} 
            isConnected={isConnected} 
          />
        </div>
        
        <div className="card-hover">
          <BatteryStatusCard 
            batteryStatus={vehicleData?.batteryStatus} 
            isConnected={isConnected} 
          />
        </div>
        
        <div className="card-hover">
          <EngineDataCard 
            engineData={vehicleData?.engineData} 
            isConnected={isConnected} 
          />
        </div>
        
        <div className="card-hover">
          <SensorDataCard 
            sensorData={vehicleData?.sensorData} 
            isConnected={isConnected} 
          />
        </div>
        
        <div className="card-hover">
          <DataMonitoringCard 
            vehicleData={vehicleData} 
            isConnected={isConnected} 
            dataHistory={dataHistory}
          />
        </div>
      </div>

      <div className="card-hover">
        <PerformanceMetrics 
          vehicleData={vehicleData} 
          isConnected={isConnected} 
          dataHistory={dataHistory}
        />
      </div>
    </div>
  );
}
