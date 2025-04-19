import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from "ws";
import {
  MessageType,
  ConnectionSettings,
  WebSocketMessage,
  ConnectRequestPayload,
  ConnectResponsePayload,
  DataUpdatePayload,
  VehicleType,
  InsertDiagnosticSession,
  InsertVehicleDataPoint,
  VehicleData,
  TroubleCode
} from "../shared/schema";

const MOCK_SERVER_RUNNING = true;

// Simulated vehicle data for demonstration purposes
function generateMockVehicleData(vehicleType: string) {
  const timestamp = Date.now();
  
  if (vehicleType === 'ev' || vehicleType === 'auto') {
    return {
      vehicleInfo: {
        make: "Tesla",
        model: "Model 3",
        year: "2022",
        vin: "5YJ3E1EAXNF123456",
        engineType: "Electric"
      },
      troubleCodes: [],
      milStatus: "OFF",
      readiness: "Ready",
      batteryStatus: {
        stateOfCharge: Math.floor(75 + Math.random() * 10),
        voltage: 350 + Math.random() * 10,
        current: Math.floor(-10 + Math.random() * 20),
        temperature: Math.floor(20 + Math.random() * 10),
        health: "Good"
      },
      sensorData: {
        maf: 0,
        map: 0,
        o2Sensor: 0,
        fuelPressure: 0,
        throttle: Math.floor(Math.random() * 30),
        shortFuelTrim: 0
      },
      engineData: {
        rpm: 0,
        speed: Math.floor(Math.random() * 60),
        coolantTemp: 0,
        intakeTemp: Math.floor(20 + Math.random() * 5),
        load: Math.floor(Math.random() * 20),
        timing: 0
      },
      timestamp
    };
  } else {
    return {
      vehicleInfo: {
        make: "Toyota",
        model: "Corolla",
        year: "2020",
        vin: "JTDEPRAE1LJ123456",
        engineType: "1.8L I4"
      },
      troubleCodes: [],
      milStatus: "OFF",
      readiness: "Ready",
      batteryStatus: {
        stateOfCharge: Math.floor(80 + Math.random() * 10),
        voltage: 12 + Math.random(),
        current: Math.floor(-5 + Math.random() * 10),
        temperature: Math.floor(20 + Math.random() * 10),
        health: "Good"
      },
      engineData: {
        rpm: Math.floor(700 + Math.random() * 1000),
        speed: Math.floor(Math.random() * 60),
        coolantTemp: Math.floor(80 + Math.random() * 10),
        intakeTemp: Math.floor(20 + Math.random() * 10),
        load: Math.floor(20 + Math.random() * 30),
        timing: 10 + Math.random() * 5
      },
      sensorData: {
        maf: 10 + Math.random() * 5,
        map: Math.floor(30 + Math.random() * 10),
        o2Sensor: 0.8 + Math.random() * 0.3,
        fuelPressure: Math.floor(300 + Math.random() * 30),
        throttle: Math.floor(10 + Math.random() * 20),
        shortFuelTrim: Math.floor(-5 + Math.random() * 10)
      },
      timestamp
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API endpoints for diagnostic sessions
  app.post('/api/vehicles', async (req: Request, res: Response) => {
    try {
      const { make, model, year, vin, engineType, userId = 1 } = req.body;
      
      if (!make || !model || !year) {
        return res.status(400).json({ error: 'Make, model, and year are required' });
      }
      
      const vehicle = await storage.createVehicle({
        make,
        model,
        year,
        vin,
        engineType,
        userId
      });
      
      res.status(201).json(vehicle);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  });
  
  app.get('/api/vehicles', async (req: Request, res: Response) => {
    try {
      // Default to user ID 1 for demo
      const userId = parseInt(req.query.userId as string) || 1;
      const vehicles = await storage.getVehiclesByUser(userId);
      res.json(vehicles);
    } catch (error) {
      console.error('Error getting vehicles:', error);
      res.status(500).json({ error: 'Failed to get vehicles' });
    }
  });
  
  app.post('/api/sessions', async (req: Request, res: Response) => {
    try {
      const { vehicleId, connectionMethod, protocol, vehicleType, userId = 1 } = req.body;
      
      if (!vehicleId || !connectionMethod || !protocol || !vehicleType) {
        return res.status(400).json({ error: 'Vehicle ID, connection method, protocol, and vehicle type are required' });
      }
      
      const session = await storage.createDiagnosticSession({
        vehicleId,
        userId,
        connectionMethod,
        protocol,
        vehicleType
      });
      
      res.status(201).json(session);
    } catch (error) {
      console.error('Error creating diagnostic session:', error);
      res.status(500).json({ error: 'Failed to create diagnostic session' });
    }
  });
  
  app.get('/api/sessions', async (req: Request, res: Response) => {
    try {
      let sessions;
      // Default to user ID 1 for demo
      const userId = parseInt(req.query.userId as string) || 1;
      
      if (req.query.vehicleId) {
        const vehicleId = parseInt(req.query.vehicleId as string);
        sessions = await storage.getDiagnosticSessionsByVehicle(vehicleId);
      } else {
        sessions = await storage.getDiagnosticSessionsByUser(userId);
      }
      
      res.json(sessions);
    } catch (error) {
      console.error('Error getting diagnostic sessions:', error);
      res.status(500).json({ error: 'Failed to get diagnostic sessions' });
    }
  });
  
  app.patch('/api/sessions/:id/end', async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const endedSession = await storage.endDiagnosticSession(sessionId);
      
      if (!endedSession) {
        return res.status(404).json({ error: 'Diagnostic session not found' });
      }
      
      res.json(endedSession);
    } catch (error) {
      console.error('Error ending diagnostic session:', error);
      res.status(500).json({ error: 'Failed to end diagnostic session' });
    }
  });
  
  app.post('/api/sessions/:id/data', async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const { engineData, batteryStatus, sensorData, milStatus, readiness } = req.body;
      
      const dataPoint = await storage.createVehicleDataPoint({
        sessionId,
        engineData,
        batteryStatus,
        sensorData,
        milStatus,
        readiness
      });
      
      res.status(201).json(dataPoint);
    } catch (error) {
      console.error('Error creating vehicle data point:', error);
      res.status(500).json({ error: 'Failed to create vehicle data point' });
    }
  });
  
  app.get('/api/sessions/:id/data', async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const dataPoints = await storage.getVehicleDataPointsBySession(sessionId);
      res.json(dataPoints);
    } catch (error) {
      console.error('Error getting vehicle data points:', error);
      res.status(500).json({ error: 'Failed to get vehicle data points' });
    }
  });
  
  app.post('/api/sessions/:id/codes', async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const { code, description, severity } = req.body;
      
      if (!code || !severity) {
        return res.status(400).json({ error: 'Code and severity are required' });
      }
      
      const troubleCode = await storage.createTroubleCode({
        sessionId,
        code,
        description,
        severity
      });
      
      res.status(201).json(troubleCode);
    } catch (error) {
      console.error('Error creating trouble code:', error);
      res.status(500).json({ error: 'Failed to create trouble code' });
    }
  });
  
  app.get('/api/sessions/:id/codes', async (req: Request, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const troubleCodes = await storage.getTroubleCodesBySession(sessionId);
      res.json(troubleCodes);
    } catch (error) {
      console.error('Error getting trouble codes:', error);
      res.status(500).json({ error: 'Failed to get trouble codes' });
    }
  });
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<WebSocket, {
    isConnected: boolean;
    settings?: ConnectionSettings;
    dataInterval?: NodeJS.Timeout;
    diagnosticSessionId?: number;
  }>();
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Initialize client state
    clients.set(ws, { isConnected: false });
    
    // Send server status on connection
    const serverStatusMessage: WebSocketMessage = {
      type: MessageType.SERVER_STATUS,
      payload: {
        status: {
          isRunning: MOCK_SERVER_RUNNING,
          message: MOCK_SERVER_RUNNING ? 'Server is running' : 'Server is not running'
        }
      }
    };
    
    ws.send(JSON.stringify(serverStatusMessage));
    
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
        const clientState = clients.get(ws);
        
        if (!clientState) {
          console.error('Client state not found');
          return;
        }
        
        switch (parsedMessage.type) {
          case MessageType.CONNECT_REQUEST:
            const connectRequest = parsedMessage.payload as ConnectRequestPayload;
            const { settings } = connectRequest;
            
            console.log('Connect request received:', settings);
            
            // Clear existing data interval if any
            if (clientState.dataInterval) {
              clearInterval(clientState.dataInterval);
            }
            
            // Simulate connecting to vehicle
            setTimeout(() => {
              const success = true; // In a real implementation, this would depend on successful connection
              
              // Store settings if connected successfully
              if (success) {
                // Create a diagnostic session in the database
                let activeDiagnosticSessionId: number | null = null;
                
                // For demo purposes, we'll use a default vehicle ID of 1
                // In a real application, this would be selected by the user
                const createSession = async () => {
                  try {
                    // First, check if we have any vehicles in the database
                    const vehicles = await storage.getVehiclesByUser(1);
                    let vehicleId = 1;
                    
                    // If no vehicles exist, create a default one
                    if (vehicles.length === 0) {
                      const defaultVehicle = await storage.createVehicle({
                        userId: 1,
                        make: settings.vehicleType === VehicleType.EV ? 'Tesla' : 'Toyota',
                        model: settings.vehicleType === VehicleType.EV ? 'Model 3' : 'Corolla',
                        year: '2022',
                        vin: settings.vehicleType === VehicleType.EV ? '5YJ3E1EAXNF123456' : 'JTDEPRAE1LJ123456',
                        engineType: settings.vehicleType === VehicleType.EV ? 'Electric' : '1.8L I4'
                      });
                      vehicleId = defaultVehicle.id;
                    } else {
                      vehicleId = vehicles[0].id;
                    }
                    
                    const session = await storage.createDiagnosticSession({
                      userId: 1,
                      vehicleId,
                      connectionMethod: settings.connectionMethod,
                      protocol: settings.protocol,
                      vehicleType: settings.vehicleType
                    });
                    
                    activeDiagnosticSessionId = session.id;
                    console.log(`Created diagnostic session with ID: ${activeDiagnosticSessionId}`);
                  } catch (error) {
                    console.error('Error creating diagnostic session:', error);
                  }
                };
                
                createSession();
                
                clients.set(ws, {
                  isConnected: true,
                  settings,
                  dataInterval: setInterval(async () => {
                    if (ws.readyState === WebSocket.OPEN) {
                      const vehicleData = generateMockVehicleData(settings.vehicleType);
                      
                      // Store the data in the database if we have an active session
                      if (activeDiagnosticSessionId !== null) {
                        try {
                          // Save the vehicle data point
                          await storage.createVehicleDataPoint({
                            sessionId: activeDiagnosticSessionId,
                            engineData: vehicleData.engineData,
                            batteryStatus: vehicleData.batteryStatus,
                            sensorData: vehicleData.sensorData,
                            milStatus: vehicleData.milStatus,
                            readiness: vehicleData.readiness
                          });
                          
                          // If we have trouble codes, save them too
                          if (vehicleData.troubleCodes && vehicleData.troubleCodes.length > 0) {
                            for (const code of vehicleData.troubleCodes) {
                              await storage.createTroubleCode({
                                sessionId: activeDiagnosticSessionId,
                                code: code.code,
                                description: code.description,
                                severity: code.severity
                              });
                            }
                          }
                        } catch (error) {
                          console.error('Error saving vehicle data:', error);
                        }
                      }
                      
                      const dataUpdateMessage: WebSocketMessage = {
                        type: MessageType.DATA_UPDATE,
                        payload: {
                          vehicleData
                        } as DataUpdatePayload
                      };
                      
                      ws.send(JSON.stringify(dataUpdateMessage));
                    }
                  }, 1000) // Send data every second
                });
              }
              
              // Send connection response
              const connectResponse: WebSocketMessage = {
                type: MessageType.CONNECT_RESPONSE,
                payload: {
                  success,
                  message: success ? 'Connected successfully' : 'Failed to connect',
                  connectionInfo: success ? {
                    deviceName: `OBD Adapter (${settings.connectionMethod.toUpperCase()})`,
                    protocol: settings.protocol === 'auto' ? 'OBD2' : settings.protocol.toUpperCase()
                  } : undefined
                } as ConnectResponsePayload
              };
              
              ws.send(JSON.stringify(connectResponse));
            }, 1000); // Simulate 1 second connection delay
            break;
            
          case MessageType.DISCONNECT_REQUEST:
            console.log('Disconnect request received');
            
            // Clear data interval
            if (clientState.dataInterval) {
              clearInterval(clientState.dataInterval);
            }
            
            // Update client state
            clients.set(ws, {
              isConnected: false
            });
            
            // Send disconnect response
            const disconnectResponse: WebSocketMessage = {
              type: MessageType.DISCONNECT_RESPONSE,
              payload: {
                success: true,
                message: 'Disconnected successfully'
              }
            };
            
            ws.send(JSON.stringify(disconnectResponse));
            break;
            
          default:
            console.log('Unknown message type:', parsedMessage.type);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      
      // Clean up intervals when client disconnects
      const clientState = clients.get(ws);
      if (clientState?.dataInterval) {
        clearInterval(clientState.dataInterval);
      }
      
      clients.delete(ws);
    });
  });
  
  return httpServer;
}
