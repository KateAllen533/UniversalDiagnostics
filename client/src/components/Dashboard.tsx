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
    <div className="container mx-auto px-4 py-6">
      <ConnectionSetup />
      
      <h2 className="text-xl font-semibold text-dark-blue mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <VehicleInfoCard 
          vehicleInfo={vehicleData?.vehicleInfo} 
          isConnected={isConnected} 
        />
        
        <DiagnosticSummaryCard 
          troubleCodes={vehicleData?.troubleCodes} 
          milStatus={vehicleData?.milStatus} 
          readiness={vehicleData?.readiness} 
          isConnected={isConnected} 
        />
        
        <BatteryStatusCard 
          batteryStatus={vehicleData?.batteryStatus} 
          isConnected={isConnected} 
        />
        
        <EngineDataCard 
          engineData={vehicleData?.engineData} 
          isConnected={isConnected} 
        />
        
        <SensorDataCard 
          sensorData={vehicleData?.sensorData} 
          isConnected={isConnected} 
        />
        
        <DataMonitoringCard 
          vehicleData={vehicleData} 
          isConnected={isConnected} 
          dataHistory={dataHistory}
        />
      </div>

      <PerformanceMetrics 
        vehicleData={vehicleData} 
        isConnected={isConnected} 
        dataHistory={dataHistory}
      />
    </div>
  );
}
