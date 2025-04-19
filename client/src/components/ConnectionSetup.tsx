import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConnectionIndicator } from '@/components/ui/connection-indicator';
import { useConnection } from '@/hooks/use-connection';
import { 
  VehicleType, 
  ConnectionMethod, 
  ProtocolType,
  ConnectionSettings 
} from '@/lib/vehicleTypes';

export default function ConnectionSetup() {
  const { 
    connectionStatus, 
    connect, 
    disconnect, 
    isServerRunning 
  } = useConnection();
  
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.AUTO_DETECT);
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>(ConnectionMethod.USB);
  const [protocol, setProtocol] = useState<ProtocolType>(ProtocolType.AUTO_DETECT);

  const handleConnect = () => {
    if (connectionStatus === 'connected') {
      disconnect();
      return;
    }
    
    const settings: ConnectionSettings = {
      vehicleType,
      connectionMethod,
      protocol
    };
    
    connect(settings);
  };

  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-dark-blue mb-1">Connect to Vehicle</h2>
          <p className="text-sm text-gray-600">Configure your connection to begin diagnostics</p>
        </div>
        <Button 
          onClick={handleConnect}
          disabled={isConnecting}
          variant={isConnected ? "outline" : "default"}
          className={isConnected ? "bg-gray-500 text-white hover:bg-gray-600" : ""}
        >
          {isConnecting ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-1.5"></i>
              Connecting...
            </>
          ) : isConnected ? (
            <>
              <i className="ri-plug-line mr-1.5"></i>
              Disconnect
            </>
          ) : (
            <>
              <i className="ri-plug-line mr-1.5"></i>
              Connect
            </>
          )}
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vehicle Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
          <Select 
            value={vehicleType} 
            onValueChange={(value) => setVehicleType(value as VehicleType)}
            disabled={isConnected || isConnecting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={VehicleType.AUTO_DETECT}>Auto Detect</SelectItem>
              <SelectItem value={VehicleType.ICE}>Internal Combustion (ICE)</SelectItem>
              <SelectItem value={VehicleType.EV}>Electric Vehicle (EV)</SelectItem>
              <SelectItem value={VehicleType.HYBRID}>Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Connection Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Connection Method</label>
          <Select 
            value={connectionMethod} 
            onValueChange={(value) => setConnectionMethod(value as ConnectionMethod)}
            disabled={isConnected || isConnecting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select connection method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ConnectionMethod.USB}>USB</SelectItem>
              <SelectItem value={ConnectionMethod.USBC}>USB-C</SelectItem>
              <SelectItem value={ConnectionMethod.BLUETOOTH}>Bluetooth</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Protocol Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
          <Select 
            value={protocol} 
            onValueChange={(value) => setProtocol(value as ProtocolType)}
            disabled={isConnected || isConnecting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProtocolType.AUTO_DETECT}>Auto Detect</SelectItem>
              <SelectItem value={ProtocolType.OBD2}>OBD2 (ISO 15765-4)</SelectItem>
              <SelectItem value={ProtocolType.CAN}>CAN Bus (ISO 11898)</SelectItem>
              <SelectItem value={ProtocolType.J1850}>SAE J1850</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Server Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Local Server Status</label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-2">
            <span className={`h-2.5 w-2.5 rounded-full ${isServerRunning ? 'bg-secondary' : 'bg-gray-400'} mr-2`}></span>
            <span className="text-sm text-gray-600">{isServerRunning ? 'Running' : 'Not Running'}</span>
            <a 
              href="https://github.com/yourusername/vehicle-diagnostics-server" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-auto text-primary text-sm font-medium"
            >
              Setup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
