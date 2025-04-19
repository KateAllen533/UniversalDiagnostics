import type { Express } from "express";
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
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<WebSocket, {
    isConnected: boolean;
    settings?: ConnectionSettings;
    dataInterval?: NodeJS.Timeout;
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
                clients.set(ws, {
                  isConnected: true,
                  settings,
                  dataInterval: setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                      const vehicleData = generateMockVehicleData(settings.vehicleType);
                      
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
