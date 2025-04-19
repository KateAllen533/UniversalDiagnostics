import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { VehicleData } from '@/lib/vehicleTypes';
import { Line } from 'recharts';
import { Card } from '@/components/ui/card';
import { ReChart } from '@/components/ui/chart';

interface DataMonitoringCardProps {
  vehicleData?: VehicleData;
  isConnected: boolean;
  dataHistory: VehicleData[];
}

export default function DataMonitoringCard({ 
  vehicleData, 
  isConnected, 
  dataHistory 
}: DataMonitoringCardProps) {
  const [selectedParameter, setSelectedParameter] = useState<string>('rpm');
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Update chart data when vehicle data changes
  useEffect(() => {
    if (dataHistory.length === 0) {
      setChartData([]);
      return;
    }

    // Convert the vehicle data history to chart data
    const newChartData = dataHistory.map((data) => {
      let value;
      
      switch (selectedParameter) {
        case 'rpm':
          value = data.engineData?.rpm;
          break;
        case 'speed':
          value = data.engineData?.speed;
          break;
        case 'soc':
          value = data.batteryStatus?.stateOfCharge;
          break;
        case 'voltage':
          value = data.batteryStatus?.voltage;
          break;
        case 'coolantTemp':
          value = data.engineData?.coolantTemp;
          break;
        default:
          value = null;
      }
      
      return {
        timestamp: data.timestamp,
        value: value ?? 0,
      };
    });

    // Keep only the last 20 data points
    setChartData(newChartData.slice(-20));
  }, [dataHistory, selectedParameter]);

  const handleExportData = () => {
    if (dataHistory.length === 0) return;
    
    const dataStr = JSON.stringify(dataHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vehicle-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parameter labels
  const parameters = [
    { id: 'rpm', label: 'RPM', icon: 'ri-line-chart-line' },
    { id: 'speed', label: 'Speed', icon: 'ri-speed-line' },
    { id: 'soc', label: 'Battery SoC', icon: 'ri-battery-2-charge-line' },
    { id: 'voltage', label: 'Voltage', icon: 'ri-pulse-line' },
    { id: 'coolantTemp', label: 'Coolant Temp', icon: 'ri-temp-hot-line' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-blue">Data Monitoring</h3>
          <p className="text-sm text-gray-500">Live performance tracking</p>
        </div>
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-primary p-1 rounded">
            <i className="ri-restart-line"></i>
          </button>
          <button className="text-gray-500 hover:text-primary p-1 rounded">
            <i className="ri-more-2-fill"></i>
          </button>
        </div>
      </div>

      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
        {!isConnected || chartData.length === 0 ? (
          <p className="text-sm text-gray-500">Connect to vehicle to view data charts</p>
        ) : (
          <ReChart className="w-full h-full" data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1E63EB"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </ReChart>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Parameter:</span>
          <select 
            className="text-primary text-sm font-medium bg-transparent border-none focus:ring-0"
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value)}
          >
            {parameters.map((param) => (
              <option key={param.id} value={param.id}>{param.label}</option>
            ))}
          </select>
        </div>
        <button 
          className="text-primary text-sm font-medium flex items-center"
          onClick={handleExportData}
          disabled={!isConnected || dataHistory.length === 0}
        >
          <i className="ri-download-line mr-1"></i>
          Export Data
        </button>
      </div>
    </div>
  );
}
