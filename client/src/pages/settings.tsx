import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useConnection } from '@/hooks/use-connection';
import { VehicleType, ConnectionMethod, ProtocolType } from '@/lib/vehicleTypes';

export default function Settings() {
  const { isServerRunning } = useConnection();
  
  const [activeTab, setActiveTab] = useState('connection');
  const [autoStartServer, setAutoStartServer] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);
  const [defaultVehicleType, setDefaultVehicleType] = useState<VehicleType>(VehicleType.AUTO_DETECT);
  const [defaultConnectionMethod, setDefaultConnectionMethod] = useState<ConnectionMethod>(ConnectionMethod.USB);
  const [defaultProtocol, setDefaultProtocol] = useState<ProtocolType>(ProtocolType.AUTO_DETECT);
  const [dataLoggingEnabled, setDataLoggingEnabled] = useState(true);
  const [logRetentionDays, setLogRetentionDays] = useState('30');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleVin, setVehicleVin] = useState('');
  
  const saveConnectionSettings = () => {
    const settings = {
      defaultVehicleType,
      defaultConnectionMethod,
      defaultProtocol,
      autoConnect,
      autoStartServer
    };
    
    localStorage.setItem('connectionSettings', JSON.stringify(settings));
    alert('Connection settings saved successfully!');
  };
  
  const saveDataSettings = () => {
    const settings = {
      dataLoggingEnabled,
      logRetentionDays: parseInt(logRetentionDays)
    };
    
    localStorage.setItem('dataSettings', JSON.stringify(settings));
    alert('Data settings saved successfully!');
  };
  
  const saveVehicleSettings = () => {
    const settings = {
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleVin
    };
    
    localStorage.setItem('vehicleSettings', JSON.stringify(settings));
    alert('Vehicle settings saved successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-dark-blue mb-6">Settings</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="connection" className="flex items-center">
            <i className="ri-plug-line mr-1.5"></i>
            Connection
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center">
            <i className="ri-database-2-line mr-1.5"></i>
            Data & Storage
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="flex items-center">
            <i className="ri-car-line mr-1.5"></i>
            Vehicle
          </TabsTrigger>
          <TabsTrigger value="installation" className="flex items-center">
            <i className="ri-git-branch-line mr-1.5"></i>
            Installation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <i className="ri-brain-line mr-1.5"></i>
            AI Analytics
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center">
            <i className="ri-information-line mr-1.5"></i>
            About
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle>Connection Settings</CardTitle>
              <CardDescription>
                Configure how the diagnostic tool connects to your vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Default Connection Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Default Vehicle Type</Label>
                    <Select 
                      value={defaultVehicleType} 
                      onValueChange={(value) => setDefaultVehicleType(value as VehicleType)}
                    >
                      <SelectTrigger id="vehicleType">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="connectionMethod">Default Connection Method</Label>
                    <Select 
                      value={defaultConnectionMethod} 
                      onValueChange={(value) => setDefaultConnectionMethod(value as ConnectionMethod)}
                    >
                      <SelectTrigger id="connectionMethod">
                        <SelectValue placeholder="Select connection method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ConnectionMethod.USB}>USB</SelectItem>
                        <SelectItem value={ConnectionMethod.USBC}>USB-C</SelectItem>
                        <SelectItem value={ConnectionMethod.BLUETOOTH}>Bluetooth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="protocol">Default Protocol</Label>
                    <Select 
                      value={defaultProtocol} 
                      onValueChange={(value) => setDefaultProtocol(value as ProtocolType)}
                    >
                      <SelectTrigger id="protocol">
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
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Startup Behavior</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoStartServer">Auto-start diagnostic server</Label>
                    <p className="text-sm text-gray-500">Automatically start the local server when the application loads</p>
                  </div>
                  <Switch 
                    id="autoStartServer" 
                    checked={autoStartServer}
                    onCheckedChange={setAutoStartServer}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoConnect">Auto-connect to vehicle</Label>
                    <p className="text-sm text-gray-500">Automatically attempt to connect when the application starts</p>
                  </div>
                  <Switch 
                    id="autoConnect" 
                    checked={autoConnect}
                    onCheckedChange={setAutoConnect}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Server Status</h3>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${isServerRunning ? 'bg-secondary' : 'bg-gray-400'} mr-2`}></span>
                  <span className="text-sm">{isServerRunning ? 'Server is running' : 'Server is not running'}</span>
                  <a 
                    href="https://github.com/yourusername/vehicle-diagnostics-server" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-auto text-primary text-sm font-medium"
                  >
                    Download Server
                  </a>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConnectionSettings}>Save Connection Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data & Storage Settings</CardTitle>
              <CardDescription>
                Manage how diagnostic data is stored and processed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Data Logging</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dataLogging">Enable data logging</Label>
                    <p className="text-sm text-gray-500">Store diagnostic session data for later analysis</p>
                  </div>
                  <Switch 
                    id="dataLogging" 
                    checked={dataLoggingEnabled}
                    onCheckedChange={setDataLoggingEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logRetention">Log retention period (days)</Label>
                  <Input 
                    id="logRetention" 
                    type="number" 
                    value={logRetentionDays}
                    onChange={(e) => setLogRetentionDays(e.target.value)}
                    min="1" 
                    max="365"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Storage Usage</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Diagnostic Data</span>
                    <span className="text-sm">0.5 MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">5% of storage used (10 MB limit)</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="mr-2">
                  <i className="ri-delete-bin-line mr-1.5"></i>
                  Clear All Data
                </Button>
                <Button variant="outline">
                  <i className="ri-download-line mr-1.5"></i>
                  Export All Data
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveDataSettings}>Save Data Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicle">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Settings</CardTitle>
              <CardDescription>
                Configure your default vehicle information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Default Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Make</Label>
                    <Input 
                      id="vehicleMake" 
                      placeholder="e.g. Toyota, Tesla" 
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Model</Label>
                    <Input 
                      id="vehicleModel" 
                      placeholder="e.g. Corolla, Model 3" 
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear">Year</Label>
                    <Input 
                      id="vehicleYear" 
                      placeholder="e.g. 2022" 
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleVin">VIN (Vehicle Identification Number)</Label>
                    <Input 
                      id="vehicleVin" 
                      placeholder="e.g. 1HGCM82633A123456" 
                      value={vehicleVin}
                      onChange={(e) => setVehicleVin(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Diagnostic Preferences</h3>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="metricUnits">Use metric units</Label>
                    <p className="text-sm text-gray-500">Display values in metric (°C, km/h) instead of imperial (°F, mph)</p>
                  </div>
                  <Switch id="metricUnits" defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="realTimeMonitoring">Real-time monitoring</Label>
                    <p className="text-sm text-gray-500">Continuously poll vehicle data when connected</p>
                  </div>
                  <Switch id="realTimeMonitoring" defaultChecked={true} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveVehicleSettings}>Save Vehicle Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="installation">
          <Card>
            <CardHeader>
              <CardTitle>Installation & Deployment</CardTitle>
              <CardDescription>
                Deploy and run the application on your own server or local machine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">GitHub Installation</h3>
                <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
                  <p className="text-sm mb-2">
                    You can deploy Universal Vehicle Diagnostics from our GitHub repository to run it on your own server or local machine.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">1. Clone the Repository</h4>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono">
                    git clone https://github.com/KateAllen533/UniversalDiagnostics.git
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">2. Automated Installation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    We provide convenient build scripts that automate the installation process:
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono">
                    # On Linux/macOS<br />
                    cd UniversalDiagnostics<br />
                    chmod +x build.sh<br />
                    ./build.sh<br /><br />
                    # On Windows<br />
                    cd UniversalDiagnostics<br />
                    build.bat
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">3. Manual Installation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    If you prefer to install manually:
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono">
                    cd UniversalDiagnostics<br />
                    npm install<br /><br />
                    # Setup a PostgreSQL database<br />
                    # Create .env file with your database credentials<br />
                    npm run db:push<br /><br />
                    # Start the development server<br />
                    npm run dev
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">4. Production Deployment</h4>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono">
                    # Build for production<br />
                    npm run build<br /><br />
                    # Start production server<br />
                    npm start
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Custom Deployment</h3>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Deploying to a Custom Domain</h4>
                  <p className="text-sm text-gray-600">
                    To deploy to a custom domain instead of replit.dev:
                  </p>
                  <ol className="text-sm space-y-2 list-decimal pl-5">
                    <li>Build the application with <code className="bg-gray-100 px-1 rounded">npm run build</code></li>
                    <li>The built files will be in the <code className="bg-gray-100 px-1 rounded">dist</code> folder</li>
                    <li>Configure your web server (Nginx, Apache, etc.) to serve these static files</li>
                    <li>Ensure you set up a proxy for the API endpoints to the Express server</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Running as a Local Server</h4>
                  <p className="text-sm text-gray-600">
                    To run the application as a local server accessible on your network:
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono">
                    # In server/index.ts, update the host binding<br />
                    const PORT = process.env.PORT || 3000;<br />
                    app.listen(PORT, '0.0.0.0', () =&gt; &#123;<br />
                    {'  '}console.log(`Server running at http://0.0.0.0:${'${PORT}'}`);<br />
                    &#125;);
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    This will make the server accessible from other devices on your local network using your computer's IP address.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics with Ollama</CardTitle>
              <CardDescription>
                Integrate with local Ollama AI models to analyze diagnostic data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-md border border-blue-100">
                  <h3 className="font-medium text-blue-800 flex items-center">
                    <i className="ri-brain-line mr-2"></i>
                    AI-Powered Diagnostics
                  </h3>
                  <p className="text-sm text-gray-700 mt-2">
                    Universal Vehicle Diagnostics can integrate with local Ollama AI models to provide advanced analytics and insights for your diagnostic data.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Ollama Configuration</h3>
                <div className="space-y-2">
                  <Label htmlFor="ollamaEndpoint">Ollama API Endpoint</Label>
                  <Input 
                    id="ollamaEndpoint" 
                    placeholder="http://localhost:11434/api/generate" 
                    defaultValue="http://localhost:11434/api/generate"
                  />
                  <p className="text-xs text-gray-500">
                    The default endpoint for a local Ollama instance is http://localhost:11434/api/generate
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ollamaModel">Ollama Model</Label>
                  <Select defaultValue="llama2:latest">
                    <SelectTrigger id="ollamaModel">
                      <SelectValue placeholder="Select an Ollama model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Quantized Models (INT4)</SelectLabel>
                        <SelectItem value="llama2:4b-q4_K_M">llama2:4b-q4_K_M</SelectItem>
                        <SelectItem value="mistral:7b-q4_K_M">mistral:7b-q4_K_M</SelectItem>
                        <SelectItem value="codellama:7b-q4_K_M">codellama:7b-q4_K_M</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Quantized Models (INT8)</SelectLabel>
                        <SelectItem value="llama2:7b-q8_0">llama2:7b-q8_0</SelectItem>
                        <SelectItem value="mistral:7b-q8_0">mistral:7b-q8_0</SelectItem>
                        <SelectItem value="llama2:13b-q8_0">llama2:13b-q8_0</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Standard Models</SelectLabel>
                        <SelectItem value="llama2:latest">llama2:latest</SelectItem>
                        <SelectItem value="mistral:latest">mistral:latest</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Quantized models (INT4/INT8) require less memory but may have slightly reduced accuracy
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Analytics Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoAnalyze">Auto-analyze diagnostic sessions</Label>
                    <p className="text-sm text-gray-500">Automatically analyze diagnostic data after each session</p>
                  </div>
                  <Switch id="autoAnalyze" defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="saveAnalytics">Save AI analysis results</Label>
                    <p className="text-sm text-gray-500">Store the results of AI analysis for future reference</p>
                  </div>
                  <Switch id="saveAnalytics" defaultChecked={true} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="analyticsDept">Analysis Depth</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger id="analyticsDept">
                      <SelectValue placeholder="Select analysis depth" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Fast)</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="detailed">Detailed (Slower)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Installation Instructions</h3>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">1. Install Ollama</h4>
                  <p className="text-sm text-gray-600">
                    Install Ollama on your local machine from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-primary">ollama.ai</a>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">2. Pull Required Models</h4>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono">
                    # Install a quantized INT4 model (smaller file size)<br />
                    ollama pull llama2:7b-q4_K_M<br /><br />
                    # Or install a quantized INT8 model (better quality)<br />
                    ollama pull llama2:7b-q8_0
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">3. Start Ollama Server</h4>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono">
                    ollama serve
                  </div>
                </div>
              </div>
              
              <Button className="mt-4">
                <i className="ri-brain-line mr-1.5"></i>
                Save Analytics Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Universal Vehicle Diagnostics</CardTitle>
              <CardDescription>
                Application information and resources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <i className="ri-car-line text-primary text-5xl mb-4"></i>
                <h2 className="text-2xl font-bold mb-2">Universal Vehicle Diagnostics</h2>
                <p className="text-gray-500">Version 1.0.0</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-gray-600">
                    Universal Vehicle Diagnostics is a comprehensive tool for diagnosing and monitoring both 
                    traditional combustion engine vehicles and electric vehicles. Connect via various 
                    methods (USB, USB-C, Bluetooth) to access diagnostic data.
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Supported Protocols</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• OBD2 (ISO 15765-4) for ICE vehicles</li>
                    <li>• CAN Bus (ISO 11898) for modern vehicles</li>
                    <li>• SAE J1850 for older vehicles</li>
                    <li>• Proprietary EV protocols</li>
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Resources</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <i className="ri-github-line text-lg mr-2"></i>
                      <a href="https://github.com/KateAllen533/UniversalDiagnostics" target="_blank" rel="noopener noreferrer" className="text-primary">GitHub Repository</a>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-question-line text-lg mr-2"></i>
                      <a href="https://github.com/KateAllen533/UniversalDiagnostics/wiki" target="_blank" rel="noopener noreferrer" className="text-primary">Documentation</a>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-bug-line text-lg mr-2"></i>
                      <a href="https://github.com/KateAllen533/UniversalDiagnostics/issues" target="_blank" rel="noopener noreferrer" className="text-primary">Report an Issue</a>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Disclaimer</h3>
                  <p className="text-sm text-gray-600">
                    This tool is provided as-is without warranty of any kind. Users are responsible for 
                    ensuring compliance with vehicle manufacturer requirements. Use at your own risk.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
