import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { DiagnosticModuleType } from "../../../shared/schema";

// Define interfaces for the specific function parameter types
interface KeyProgrammingParams {
  vehicleMake?: string;
  vehicleModel?: string;
  keyType?: string;
  immobilizerStatus?: string;
  keyAlreadyProgrammed?: boolean;
  remoteType?: string;
  chipType?: string;
  originalKeyData?: string;
  ecuType?: string;
  protocol?: string;
}

interface EepromOperationParams {
  chipType?: string;
  pinoutMap?: string;
  targetAddress?: string;
  hexData?: string;
  electricalSignature?: string;
  eepromData?: string;
  chipID?: string;
}

interface VehicleDiagnosticsParams {
  vehicleMake?: string;
  systemModule?: string;
  moduleList?: string[];
  componentID?: string;
  sensorIDs?: string[];
  vehicleVIN?: string;
}

interface SystemAdaptationParams {
  vehicleMake?: string;
  vehicleModel?: string;
  brakeModuleVersion?: string;
  steeringSensor?: string;
  injectorSerials?: string[];
  ecuType?: string;
  batteryID?: string;
  resetCondition?: string;
}

interface AdvancedControlParams {
  vehicleMake?: string;
  vehicleYear?: string;
  ecuID?: string;
  newVIN?: string;
  clusterID?: string;
  newValue?: number;
  moduleID?: string;
}

interface SystemInfoParams {
  vehicleMake?: string;
  vehicleVIN?: string;
  region?: string;
}

// Define the form schema
const formSchema = z.object({
  moduleType: z.string().min(1, "Module type is required"),
  functionName: z.string().min(1, "Function name is required"),
  params: z.record(z.any()).optional(),
  vehicleVin: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AdvancedDiagnostics = () => {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moduleType: "",
      functionName: "",
      params: {},
      vehicleVin: "",
      vehicleMake: "",
      vehicleModel: "",
      notes: ""
    }
  });

  // Function options for each module
  const functionOptions = {
    [DiagnosticModuleType.KEY_PROGRAMMING]: [
      { value: "program_new_key", label: "Program New Key" },
      { value: "add_spare_key", label: "Add Spare Key" },
      { value: "program_remote", label: "Program Remote" },
      { value: "clone_transponder", label: "Clone Transponder" },
      { value: "read_pin_code", label: "Read PIN Code" }
    ],
    [DiagnosticModuleType.EEPROM_OPERATIONS]: [
      { value: "read_eeprom", label: "Read EEPROM" },
      { value: "write_eeprom", label: "Write EEPROM" },
      { value: "identify_eeprom_chip", label: "Identify EEPROM Chip" },
      { value: "modify_immo_data", label: "Modify IMMO Data" },
      { value: "backup_eeprom", label: "Backup EEPROM" }
    ],
    [DiagnosticModuleType.VEHICLE_DIAGNOSTICS]: [
      { value: "read_dtcs", label: "Read DTCs" },
      { value: "clear_dtcs", label: "Clear DTCs" },
      { value: "perform_active_test", label: "Perform Active Test" },
      { value: "stream_live_data", label: "Stream Live Data" },
      { value: "run_module_scan", label: "Run Module Scan" }
    ],
    [DiagnosticModuleType.SYSTEM_ADAPTATION]: [
      { value: "reset_oil_service", label: "Reset Oil Service" },
      { value: "epb_maintenance_mode", label: "EPB Maintenance Mode" },
      { value: "calibrate_steering_angle", label: "Calibrate Steering Angle" },
      { value: "injector_coding", label: "Injector Coding" },
      { value: "bms_reset", label: "BMS Reset" }
    ],
    [DiagnosticModuleType.ADVANCED_CONTROL]: [
      { value: "enable_sgw_bypass", label: "Enable SGW Bypass" },
      { value: "modify_vin", label: "Modify VIN" },
      { value: "odometer_adjust", label: "Odometer Adjust" },
      { value: "airbag_crash_reset", label: "Airbag Crash Reset" }
    ],
    [DiagnosticModuleType.SYSTEM_INFO]: [
      { value: "get_supported_protocols", label: "Get Supported Protocols" },
      { value: "query_immo_status", label: "Query Immobilizer Status" },
      { value: "list_supported_vehicles", label: "List Supported Vehicles" }
    ]
  };

  // Define the parameter fields for each function
  const paramFields = {
    // Key Programming
    program_new_key: [
      { name: "vehicleMake", label: "Vehicle Make", type: "text" },
      { name: "vehicleModel", label: "Vehicle Model", type: "text" },
      { name: "keyType", label: "Key Type", type: "text" },
      { name: "immobilizerStatus", label: "Immobilizer Status", type: "text" }
    ],
    add_spare_key: [
      { name: "vehicleMake", label: "Vehicle Make", type: "text" },
      { name: "vehicleModel", label: "Vehicle Model", type: "text" },
      { name: "keyAlreadyProgrammed", label: "Key Already Programmed", type: "checkbox" }
    ],
    program_remote: [
      { name: "remoteType", label: "Remote Type", type: "text" },
      { name: "vehicleMake", label: "Vehicle Make", type: "text" },
      { name: "vehicleModel", label: "Vehicle Model", type: "text" }
    ],
    clone_transponder: [
      { name: "chipType", label: "Chip Type", type: "text" },
      { name: "originalKeyData", label: "Original Key Data", type: "text" }
    ],
    read_pin_code: [
      { name: "ecuType", label: "ECU Type", type: "text" },
      { name: "protocol", label: "Protocol", type: "text" }
    ],

    // EEPROM Operations
    read_eeprom: [
      { name: "chipType", label: "Chip Type", type: "text" },
      { name: "pinoutMap", label: "Pinout Map", type: "text" }
    ],
    write_eeprom: [
      { name: "targetAddress", label: "Target Address", type: "text" },
      { name: "hexData", label: "Hex Data", type: "text" }
    ],
    identify_eeprom_chip: [
      { name: "electricalSignature", label: "Electrical Signature", type: "text" }
    ],
    modify_immo_data: [
      { name: "eepromData", label: "EEPROM Data", type: "text" }
    ],
    backup_eeprom: [
      { name: "chipID", label: "Chip ID", type: "text" }
    ],

    // Vehicle Diagnostics
    read_dtcs: [
      { name: "vehicleMake", label: "Vehicle Make", type: "text" },
      { name: "systemModule", label: "System Module", type: "text" }
    ],
    clear_dtcs: [
      { name: "moduleList", label: "Module List (comma separated)", type: "text" }
    ],
    perform_active_test: [
      { name: "componentID", label: "Component ID", type: "text" }
    ],
    stream_live_data: [
      { name: "sensorIDs", label: "Sensor IDs (comma separated)", type: "text" }
    ],
    run_module_scan: [
      { name: "vehicleVIN", label: "Vehicle VIN", type: "text" }
    ],

    // System Adaptation
    reset_oil_service: [
      { name: "vehicleMake", label: "Vehicle Make", type: "text" },
      { name: "vehicleModel", label: "Vehicle Model", type: "text" }
    ],
    epb_maintenance_mode: [
      { name: "brakeModuleVersion", label: "Brake Module Version", type: "text" }
    ],
    calibrate_steering_angle: [
      { name: "steeringSensor", label: "Steering Sensor", type: "text" }
    ],
    injector_coding: [
      { name: "injectorSerials", label: "Injector Serials (comma separated)", type: "text" },
      { name: "ecuType", label: "ECU Type", type: "text" }
    ],
    bms_reset: [
      { name: "batteryID", label: "Battery ID", type: "text" },
      { name: "resetCondition", label: "Reset Condition", type: "text" }
    ],

    // Advanced Control
    enable_sgw_bypass: [
      { name: "vehicleMake", label: "Vehicle Make", type: "text" },
      { name: "vehicleYear", label: "Vehicle Year", type: "text" }
    ],
    modify_vin: [
      { name: "ecuID", label: "ECU ID", type: "text" },
      { name: "newVIN", label: "New VIN", type: "text" }
    ],
    odometer_adjust: [
      { name: "clusterID", label: "Cluster ID", type: "text" },
      { name: "newValue", label: "New Value", type: "number" }
    ],
    airbag_crash_reset: [
      { name: "moduleID", label: "Module ID", type: "text" }
    ],

    // System Info
    get_supported_protocols: [
      { name: "vehicleMake", label: "Vehicle Make", type: "text" }
    ],
    query_immo_status: [
      { name: "vehicleVIN", label: "Vehicle VIN", type: "text" }
    ],
    list_supported_vehicles: [
      { name: "region", label: "Region", type: "text" }
    ]
  };

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    form.setValue("moduleType", value);
    form.setValue("functionName", "");
    form.setValue("params", {});
  };

  const handleFunctionChange = (value: string) => {
    form.setValue("functionName", value);
    form.setValue("params", {});
  };

  const handleParamChange = (name: string, value: any) => {
    const currentParams = form.getValues("params") || {};
    form.setValue("params", {
      ...currentParams,
      [name]: value
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsExecuting(true);
    setExecutionResult(null);
    
    try {
      // Parse string arrays if needed
      const processedParams: any = { ...data.params };
      
      // Process special fields like arrays
      if (data.functionName === "clear_dtcs" && typeof processedParams.moduleList === "string") {
        processedParams.moduleList = processedParams.moduleList.split(",").map((item: string) => item.trim());
      }
      
      if (data.functionName === "stream_live_data" && typeof processedParams.sensorIDs === "string") {
        processedParams.sensorIDs = processedParams.sensorIDs.split(",").map((item: string) => item.trim());
      }
      
      if (data.functionName === "injector_coding" && typeof processedParams.injectorSerials === "string") {
        processedParams.injectorSerials = processedParams.injectorSerials.split(",").map((item: string) => item.trim());
      }
      
      const diagnosticData = {
        userId: 1, // Default user for demo
        moduleType: data.moduleType,
        functionName: data.functionName,
        inputParams: processedParams,
        vehicleVin: data.vehicleVin,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        notes: data.notes
      };
      
      // Execute the diagnostic operation
      const result: any = await apiRequest("POST", "/api/advanced-diagnostics", diagnosticData);
      
      // Update with the mock output result since we don't have real hardware
      const mockOutputResult = generateMockResult(data.moduleType, data.functionName, processedParams);
      
      // Update the result in the database
      await apiRequest("PATCH", `/api/advanced-diagnostics/${result.id}`, {
        outputResult: mockOutputResult,
        successFlag: true
      });
      
      setExecutionResult({
        ...result,
        outputResult: mockOutputResult,
        successFlag: true
      });
      
      toast({
        title: "Diagnostic operation completed",
        description: "The function was executed successfully",
      });
    } catch (error) {
      console.error("Error executing diagnostic function:", error);
      
      toast({
        title: "Error",
        description: "Failed to execute diagnostic function",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const generateMockResult = (moduleType: string, functionName: string, params: any) => {
    // This function generates mock results for demonstration purposes
    // In a real application, this would come from actual hardware/device
    
    switch (functionName) {
      case "program_new_key":
        return { 
          success: true, 
          message: `Successfully programmed new ${params.keyType} key for ${params.vehicleMake} ${params.vehicleModel}`,
          keyId: Math.floor(Math.random() * 1000000).toString(16).toUpperCase()
        };
        
      case "add_spare_key":
        return {
          success: true,
          message: `Spare key added for ${params.vehicleMake} ${params.vehicleModel}`,
          keyId: Math.floor(Math.random() * 1000000).toString(16).toUpperCase()
        };
        
      case "program_remote":
        return {
          success: true,
          message: `Remote type ${params.remoteType} programmed for ${params.vehicleMake} ${params.vehicleModel}`,
          frequency: "433.92 MHz"
        };
        
      case "clone_transponder":
        return {
          success: true,
          message: `Transponder ${params.chipType} cloned successfully`,
          hexData: Array.from({length: 8}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ')
        };
        
      case "read_pin_code":
        return {
          success: true,
          pin: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
          securityCode: Math.floor(Math.random() * 1000000).toString(16).toUpperCase()
        };
        
      case "read_eeprom":
        return {
          success: true,
          data: Array.from({length: 16}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' '),
          chipSize: "256KB"
        };
        
      case "identify_eeprom_chip":
        return {
          chipType: "AT24C" + Math.floor(Math.random() * 512),
          manufacturer: "Atmel",
          pinout: "8-PIN SOIC"
        };
        
      case "read_dtcs":
        return {
          codes: [
            { code: "P0" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'), description: "Oxygen Sensor Circuit Malfunction" },
            { code: "P0" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'), description: "Fuel Rail Pressure Sensor Circuit" }
          ],
          totalCodes: 2
        };
        
      case "run_module_scan":
        return {
          modules: [
            { id: "ECM", name: "Engine Control Module", status: "Online" },
            { id: "TCM", name: "Transmission Control Module", status: "Online" },
            { id: "ABS", name: "Anti-lock Brake System", status: "Online" },
            { id: "SRS", name: "Supplemental Restraint System", status: "Online" }
          ]
        };
        
      default:
        return {
          success: true,
          message: `Function ${functionName} executed successfully`,
          timestamp: new Date().toISOString()
        };
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
            <i className="ri-tools-line text-primary text-2xl"></i>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Diagnostics</h1>
            <p className="text-gray-600 dark:text-gray-400">AutoProPAD G2 Turbo professional functions</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 shadow-md border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle>Diagnostic Function Selection</CardTitle>
            <CardDescription>
              Select a diagnostic module and function to execute.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="moduleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module Type</FormLabel>
                        <Select
                          onValueChange={(value) => handleModuleChange(value)}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a module" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Diagnostic Modules</SelectLabel>
                              <SelectItem value={DiagnosticModuleType.KEY_PROGRAMMING}>Key Programming</SelectItem>
                              <SelectItem value={DiagnosticModuleType.EEPROM_OPERATIONS}>EEPROM Operations</SelectItem>
                              <SelectItem value={DiagnosticModuleType.VEHICLE_DIAGNOSTICS}>Vehicle Diagnostics</SelectItem>
                              <SelectItem value={DiagnosticModuleType.SYSTEM_ADAPTATION}>System Adaptation</SelectItem>
                              <SelectItem value={DiagnosticModuleType.ADVANCED_CONTROL}>Advanced Control</SelectItem>
                              <SelectItem value={DiagnosticModuleType.SYSTEM_INFO}>System Information</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {selectedModule && (
                    <FormField
                      control={form.control}
                      name="functionName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Function</FormLabel>
                          <Select
                            onValueChange={(value) => handleFunctionChange(value)}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a function" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Available Functions</SelectLabel>
                                {functionOptions[selectedModule as keyof typeof functionOptions]?.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {form.watch("functionName") && (
                    <div className="space-y-4 border p-4 rounded-md">
                      <h3 className="font-semibold">Function Parameters</h3>
                      {paramFields[form.watch("functionName") as keyof typeof paramFields]?.map((param) => (
                        <div key={param.name} className="space-y-2">
                          <Label htmlFor={param.name}>{param.label}</Label>
                          {param.type === "checkbox" ? (
                            <div className="flex items-center space-x-2">
                              <input
                                id={param.name}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                onChange={(e) => handleParamChange(param.name, e.target.checked)}
                              />
                              <Label htmlFor={param.name}>{param.label}</Label>
                            </div>
                          ) : (
                            <Input
                              id={param.name}
                              type={param.type}
                              onChange={(e) => handleParamChange(param.name, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="space-y-4 border p-4 rounded-md">
                    <h3 className="font-semibold">Vehicle Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleVin">VIN</Label>
                      <Input 
                        id="vehicleVin" 
                        {...form.register("vehicleVin")} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleMake">Make</Label>
                      <Input 
                        id="vehicleMake" 
                        {...form.register("vehicleMake")} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleModel">Model</Label>
                      <Input 
                        id="vehicleModel" 
                        {...form.register("vehicleModel")} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input 
                      id="notes" 
                      {...form.register("notes")} 
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isExecuting || !form.formState.isValid}
                >
                  {isExecuting ? "Executing..." : "Execute Function"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 shadow-md border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle>Execution Results</CardTitle>
            <CardDescription>
              View the results of the diagnostic operation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isExecuting ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Executing diagnostic function...</p>
                </div>
              </div>
            ) : executionResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="font-bold text-green-700 mb-2">Operation Completed</h3>
                  <p className="text-green-600">Function executed successfully</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Function Details</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-gray-600">Module:</div>
                    <div>{executionResult.moduleType}</div>
                    
                    <div className="text-gray-600">Function:</div>
                    <div>{executionResult.functionName}</div>
                    
                    <div className="text-gray-600">Execution Time:</div>
                    <div>{new Date(executionResult.executionTime).toLocaleString()}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Input Parameters</h3>
                  <div className="bg-gray-50 p-3 rounded border overflow-auto max-h-[150px]">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(executionResult.inputParams, null, 2)}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Output Result</h3>
                  <div className="bg-gray-50 p-3 rounded border overflow-auto max-h-[200px]">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(executionResult.outputResult, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-500">
                <div className="text-center p-6">
                  <p>Select a module and function, then click Execute to see results here.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedDiagnostics;