import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleData } from '@/lib/vehicleTypes';
import { Area, Legend, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ReChart } from '@/components/ui/chart';

interface PerformanceMetricsProps {
  vehicleData?: VehicleData;
  isConnected: boolean;
  dataHistory: VehicleData[];
}

type TimeRange = '5min' | '15min' | '1hour' | 'custom';
type Parameter = 'rpm' | 'speed' | 'battery' | 'custom';

export default function PerformanceMetrics({ vehicleData, isConnected, dataHistory }: PerformanceMetricsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('5min');
  const [selectedParameters, setSelectedParameters] = useState<Parameter[]>(['rpm']);
  const [chartData, setChartData] = useState<any[]>([]);
  const [showAddParameter, setShowAddParameter] = useState(false);

  useEffect(() => {
    if (dataHistory.length === 0) {
      setChartData([]);
      return;
    }

    // Filter data based on selected time range
    const now = Date.now();
    let filteredHistory = dataHistory;
    
    if (timeRange === '5min') {
      filteredHistory = dataHistory.filter(d => (now - d.timestamp) <= 5 * 60 * 1000);
    } else if (timeRange === '15min') {
      filteredHistory = dataHistory.filter(d => (now - d.timestamp) <= 15 * 60 * 1000);
    } else if (timeRange === '1hour') {
      filteredHistory = dataHistory.filter(d => (now - d.timestamp) <= 60 * 60 * 1000);
    }

    // Prepare data for chart
    const newChartData = filteredHistory.map(data => {
      const dataPoint: any = {
        timestamp: new Date(data.timestamp).toLocaleTimeString(),
      };
      
      if (selectedParameters.includes('rpm') && data.engineData?.rpm) {
        dataPoint.rpm = data.engineData.rpm;
      }
      
      if (selectedParameters.includes('speed') && data.engineData?.speed) {
        dataPoint.speed = data.engineData.speed;
      }
      
      if (selectedParameters.includes('battery') && data.batteryStatus?.stateOfCharge) {
        dataPoint.battery = data.batteryStatus.stateOfCharge;
      }
      
      return dataPoint;
    });

    setChartData(newChartData);
  }, [dataHistory, timeRange, selectedParameters]);

  const handleParameterToggle = (param: Parameter) => {
    setSelectedParameters(prev => {
      if (prev.includes(param)) {
        return prev.filter(p => p !== param);
      } else {
        return [...prev, param];
      }
    });
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-blue">Performance Metrics</h3>
          <p className="text-sm text-gray-500">Historical and real-time data visualization</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[150px] text-sm">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5min">Last 5 Minutes</SelectItem>
              <SelectItem value="15min">Last 15 Minutes</SelectItem>
              <SelectItem value="1hour">Last Hour</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <button className="text-gray-500 hover:text-primary p-1 rounded">
            <i className="ri-refresh-line"></i>
          </button>
        </div>
      </div>
      
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        {!isConnected || chartData.length === 0 ? (
          <p className="text-sm text-gray-500">Connect to vehicle to view performance metrics</p>
        ) : (
          <ReChart className="w-full h-full" data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="timestamp" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            
            {selectedParameters.includes('rpm') && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="rpm" 
                name="RPM"
                stroke="#1E63EB" 
                strokeWidth={2}
                dot={false} 
              />
            )}
            
            {selectedParameters.includes('speed') && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="speed" 
                name="Speed (km/h)"
                stroke="#22C55E" 
                strokeWidth={2}
                dot={false} 
              />
            )}
            
            {selectedParameters.includes('battery') && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="battery"
                name="Battery (%)"
                stroke="#EAB308"
                fill="#EAB30820"
                strokeWidth={2}
                dot={false}
              />
            )}
          </ReChart>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <Button
          variant={selectedParameters.includes('rpm') ? 'default' : 'outline'}
          className={`flex items-center justify-center py-2 px-3 text-sm font-medium ${
            selectedParameters.includes('rpm') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => handleParameterToggle('rpm')}
        >
          <i className="ri-line-chart-line mr-1.5"></i>
          RPM
        </Button>
        
        <Button
          variant={selectedParameters.includes('speed') ? 'default' : 'outline'}
          className={`flex items-center justify-center py-2 px-3 text-sm font-medium ${
            selectedParameters.includes('speed') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => handleParameterToggle('speed')}
        >
          <i className="ri-line-chart-line mr-1.5"></i>
          Speed
        </Button>
        
        <Button
          variant={selectedParameters.includes('battery') ? 'default' : 'outline'}
          className={`flex items-center justify-center py-2 px-3 text-sm font-medium ${
            selectedParameters.includes('battery') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => handleParameterToggle('battery')}
        >
          <i className="ri-battery-2-charge-line mr-1.5"></i>
          Battery
        </Button>
        
        <Button
          variant="default"
          className="flex items-center justify-center py-2 px-3 bg-primary text-white rounded-md text-sm font-medium"
          onClick={() => setShowAddParameter(!showAddParameter)}
        >
          <i className="ri-add-line mr-1.5"></i>
          Add Parameter
        </Button>
      </div>
    </div>
  );
}
