import { useState } from 'react';
import { useConnection } from '@/hooks/use-connection';
import { useVehicleData } from '@/hooks/use-vehicle-data';
import { TroubleCode } from '@/lib/vehicleTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import ConnectionSetup from '@/components/ConnectionSetup';

export default function Diagnostics() {
  const { connectionStatus } = useConnection();
  const { vehicleData } = useVehicleData();
  const [activeTab, setActiveTab] = useState('trouble-codes');
  
  const isConnected = connectionStatus === 'connected';
  const troubleCodes = vehicleData?.troubleCodes || [];
  
  const severityInfo = {
    low: { icon: 'ri-information-line', color: 'text-blue-500' },
    medium: { icon: 'ri-alert-line', color: 'text-yellow-500' },
    high: { icon: 'ri-error-warning-line', color: 'text-red-500' },
  };

  const downloadDiagnosticReport = () => {
    if (!vehicleData) return;
    
    const reportData = {
      timestamp: new Date().toISOString(),
      vehicleInfo: vehicleData.vehicleInfo,
      diagnostics: {
        troubleCodes: vehicleData.troubleCodes,
        milStatus: vehicleData.milStatus,
        readiness: vehicleData.readiness,
      },
      engineData: vehicleData.engineData,
      batteryStatus: vehicleData.batteryStatus,
      sensorData: vehicleData.sensorData,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostic-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      <ConnectionSetup />
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
              <i className="ri-error-warning-line text-primary text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Diagnostics</h1>
              <p className="text-gray-600 dark:text-gray-400">Analyze and troubleshoot vehicle issues</p>
            </div>
          </div>
          <Button 
            onClick={downloadDiagnosticReport}
            disabled={!isConnected || !vehicleData}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <i className="ri-file-download-line mr-1.5"></i>
            Export Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 p-1">
          <TabsTrigger value="trouble-codes" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <i className="ri-error-warning-line text-lg"></i>
            Trouble Codes
          </TabsTrigger>
          <TabsTrigger value="sensor-data" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <i className="ri-dashboard-3-line text-lg"></i>
            Sensor Data
          </TabsTrigger>
          <TabsTrigger value="readiness" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <i className="ri-checkbox-circle-line text-lg"></i>
            Readiness Monitors
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trouble-codes">
          <Card className="shadow-md border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Diagnostic Trouble Codes (DTCs)</span>
                <StatusBadge status={isConnected ? 'success' : 'default'}>
                  {isConnected ? 'Connected' : 'Not Connected'}
                </StatusBadge>
              </CardTitle>
              <CardDescription>
                {isConnected ? 
                  troubleCodes.length > 0 ? 
                    `Found ${troubleCodes.length} trouble codes` : 
                    'No trouble codes detected' :
                  'Connect to vehicle to scan for trouble codes'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="p-8 text-center">
                  <i className="ri-plug-line text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">Connect to your vehicle to scan for trouble codes</p>
                </div>
              ) : troubleCodes.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="ri-check-double-line text-4xl text-green-300 mb-2"></i>
                  <p className="text-gray-500">No trouble codes detected. Your vehicle appears to be running normally.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {troubleCodes.map((code, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary/50 transition-colors bg-white dark:bg-gray-900">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <i className={`${severityInfo[code.severity].icon} ${severityInfo[code.severity].color} text-lg mr-2`}></i>
                          <div>
                            <h3 className="font-medium">{code.code}</h3>
                            <p className="text-sm text-gray-600">{code.description}</p>
                          </div>
                        </div>
                        <StatusBadge 
                          status={
                            code.severity === 'high' ? 'error' : 
                            code.severity === 'medium' ? 'warning' : 
                            'info'
                          }
                        >
                          {code.severity} severity
                        </StatusBadge>
                      </div>
                      <div className="mt-3 pt-3 border-t text-sm">
                        <h4 className="font-medium mb-1">Possible causes:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>Faulty sensor or wiring</li>
                          <li>Component malfunction</li>
                          <li>System irregularity</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sensor-data">
          <Card className="shadow-md border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Real-time Sensor Data</span>
                <StatusBadge status={isConnected ? 'success' : 'default'}>
                  {isConnected ? 'Connected' : 'Not Connected'}
                </StatusBadge>
              </CardTitle>
              <CardDescription>
                Detailed sensor readings from your vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="p-8 text-center">
                  <i className="ri-dashboard-3-line text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">Connect to your vehicle to view sensor data</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 mb-1">Engine RPM</p>
                    <p className="text-xl font-semibold">{vehicleData?.engineData?.rpm?.toFixed(0) || '--'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Vehicle Speed</p>
                    <p className="text-xl font-semibold">{vehicleData?.engineData?.speed ? `${vehicleData.engineData.speed.toFixed(0)} km/h` : '--'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Coolant Temperature</p>
                    <p className="text-xl font-semibold">{vehicleData?.engineData?.coolantTemp ? `${vehicleData.engineData.coolantTemp.toFixed(0)} °C` : '--'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Battery Voltage</p>
                    <p className="text-xl font-semibold">{vehicleData?.batteryStatus?.voltage ? `${vehicleData.batteryStatus.voltage.toFixed(1)} V` : '--'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Battery State of Charge</p>
                    <p className="text-xl font-semibold">{vehicleData?.batteryStatus?.stateOfCharge ? `${vehicleData.batteryStatus.stateOfCharge.toFixed(0)}%` : '--'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Throttle Position</p>
                    <p className="text-xl font-semibold">{vehicleData?.sensorData?.throttle ? `${vehicleData.sensorData.throttle.toFixed(0)}%` : '--'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="readiness">
          <Card className="shadow-md border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Readiness Monitors</span>
                <StatusBadge status={isConnected ? 'success' : 'default'}>
                  {isConnected ? 'Connected' : 'Not Connected'}
                </StatusBadge>
              </CardTitle>
              <CardDescription>
                System readiness status for emissions testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="p-8 text-center">
                  <i className="ri-checkbox-circle-line text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">Connect to your vehicle to view readiness status</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">MIL Status</span>
                    <span className={vehicleData?.milStatus === 'ON' ? 'text-red-500' : 'text-green-500'}>
                      {vehicleData?.milStatus || '--'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Readiness Tests</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Catalyst Monitor</span>
                        <span className="text-sm text-green-500">Ready</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Heated Catalyst</span>
                        <span className="text-sm text-green-500">Ready</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Evaporative System</span>
                        <span className="text-sm text-yellow-500">Not Ready</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Secondary Air System</span>
                        <span className="text-sm text-green-500">Ready</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">A/C System Refrigerant</span>
                        <span className="text-sm text-gray-400">N/A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Oxygen Sensor</span>
                        <span className="text-sm text-green-500">Ready</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Oxygen Sensor Heater</span>
                        <span className="text-sm text-green-500">Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
