import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
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
  TroubleCode,
  IssueStatus,
  UserEventType,
  InsertIssueReport,
  IssueReport,
  InsertUserMetric,
  UserMetric,
  issueReports,
  userMetrics
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
  
  // Issue report routes
  app.get('/api/issues', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as IssueStatus | undefined;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      let issues: IssueReport[];
      if (status) {
        issues = await storage.getIssueReportsByStatus(status);
      } else if (userId) {
        issues = await storage.getIssueReportsByUser(userId);
      } else {
        // For simplicity, return all issues when no filter is provided
        // In a real app, you might want to add pagination
        issues = await db.select().from(issueReports).orderBy(issueReports.createdAt);
      }
      
      res.json(issues);
    } catch (error) {
      console.error('Error getting issue reports:', error);
      res.status(500).json({ error: 'Failed to get issue reports' });
    }
  });
  
  app.get('/api/issues/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const issue = await storage.getIssueReport(id);
      
      if (!issue) {
        return res.status(404).json({ error: 'Issue report not found' });
      }
      
      res.json(issue);
    } catch (error) {
      console.error('Error getting issue report:', error);
      res.status(500).json({ error: 'Failed to get issue report' });
    }
  });
  
  app.post('/api/issues', async (req: Request, res: Response) => {
    try {
      // Default to user ID 1 if not authenticated
      const userId = req.body.userId || 1;
      
      // Get browser and device info from request if provided
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;
      
      // Construct the report object
      const report: InsertIssueReport = {
        userId,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        severity: req.body.severity,
        deviceInfo: req.body.deviceInfo || { userAgent, ipAddress },
        appVersion: req.body.appVersion || process.env.npm_package_version || '1.0.0'
      };
      
      const newIssue = await storage.createIssueReport(report);
      
      // Log user metric for issue report
      await storage.createUserMetric({
        userId,
        sessionId: req.body.sessionId || 'unknown',
        eventType: UserEventType.FORM_SUBMISSION,
        eventData: { issueId: newIssue.id, formType: 'issue-report' },
        deviceInfo: req.body.deviceInfo,
        browserInfo: { userAgent },
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined
      });
      
      res.status(201).json(newIssue);
    } catch (error) {
      console.error('Error creating issue report:', error);
      res.status(500).json({ error: 'Failed to create issue report' });
    }
  });
  
  app.patch('/api/issues/:id/status', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!Object.values(IssueStatus).includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      
      const updatedIssue = await storage.updateIssueStatus(id, status);
      
      if (!updatedIssue) {
        return res.status(404).json({ error: 'Issue report not found' });
      }
      
      res.json(updatedIssue);
    } catch (error) {
      console.error('Error updating issue status:', error);
      res.status(500).json({ error: 'Failed to update issue status' });
    }
  });
  
  // User metrics routes
  app.post('/api/metrics', async (req: Request, res: Response) => {
    try {
      // Default to user ID 1 if not authenticated
      const userId = req.body.userId || 1;
      
      // Get browser and device info from request
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;
      
      const metric: InsertUserMetric = {
        userId,
        sessionId: req.body.sessionId || 'unknown',
        eventType: req.body.eventType,
        eventData: req.body.eventData || {},
        deviceInfo: req.body.deviceInfo || {},
        browserInfo: req.body.browserInfo || { userAgent },
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined
      };
      
      const newMetric = await storage.createUserMetric(metric);
      res.status(201).json(newMetric);
    } catch (error) {
      console.error('Error creating user metric:', error);
      res.status(500).json({ error: 'Failed to create user metric' });
    }
  });
  
  app.get('/api/metrics', async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const sessionId = req.query.sessionId as string | undefined;
      const eventType = req.query.eventType as UserEventType | undefined;
      
      let metrics: UserMetric[];
      if (userId) {
        metrics = await storage.getUserMetricsByUser(userId);
      } else if (sessionId) {
        metrics = await storage.getUserMetricsBySessionId(sessionId);
      } else if (eventType) {
        metrics = await storage.getUserMetricsByEventType(eventType);
      } else {
        // For simplicity, return recent metrics when no filter is provided
        // In a real app, you might want to add pagination
        metrics = await db.select().from(userMetrics).orderBy(userMetrics.timestamp).limit(100);
      }
      
      res.json(metrics);
    } catch (error) {
      console.error('Error getting user metrics:', error);
      res.status(500).json({ error: 'Failed to get user metrics' });
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
    
    ws.on('message', async (message) => {
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
            setTimeout(async () => {
              const success = true; // In a real implementation, this would depend on successful connection
              
              // Store settings if connected successfully
              if (success) {
                // For demo purposes, we'll use a default vehicle ID of 1
                // In a real application, this would be selected by the user
                let sessionId: number | undefined;
                
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
                    
                    sessionId = session.id;
                    console.log(`Created diagnostic session with ID: ${sessionId}`);
                    
                    // Update client state with the session ID
                    const updatedClientState = clients.get(ws);
                    if (updatedClientState) {
                      clients.set(ws, {
                        ...updatedClientState,
                        diagnosticSessionId: sessionId
                      });
                    }
                  } catch (error) {
                    console.error('Error creating diagnostic session:', error);
                  }
                };
                
                // Start the creation process
                createSession();
                
                clients.set(ws, {
                  isConnected: true,
                  settings,
                  dataInterval: setInterval(async () => {
                    if (ws.readyState === WebSocket.OPEN) {
                      const vehicleData = generateMockVehicleData(settings.vehicleType);
                      
                      // Get the latest client state to access the diagnosticSessionId
                      const currentClientState = clients.get(ws);
                      if (currentClientState?.diagnosticSessionId) {
                        try {
                          // Save the vehicle data point
                          await storage.createVehicleDataPoint({
                            sessionId: currentClientState.diagnosticSessionId,
                            engineData: vehicleData.engineData,
                            batteryStatus: vehicleData.batteryStatus,
                            sensorData: vehicleData.sensorData,
                            milStatus: vehicleData.milStatus,
                            readiness: vehicleData.readiness
                          });
                          
                          // If we have trouble codes, save them too
                          if (vehicleData.troubleCodes && vehicleData.troubleCodes.length > 0) {
                            for (const code of vehicleData.troubleCodes as TroubleCode[]) {
                              await storage.createTroubleCode({
                                sessionId: currentClientState.diagnosticSessionId,
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
            
            // End the diagnostic session if one was active
            if (clientState.diagnosticSessionId) {
              try {
                const endedSession = await storage.endDiagnosticSession(clientState.diagnosticSessionId);
                console.log(`Ended diagnostic session with ID: ${clientState.diagnosticSessionId}`);
              } catch (error) {
                console.error('Error ending diagnostic session:', error);
              }
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
    
    ws.on('close', async () => {
      console.log('WebSocket client disconnected');
      
      // Clean up intervals when client disconnects
      const clientState = clients.get(ws);
      if (clientState?.dataInterval) {
        clearInterval(clientState.dataInterval);
      }
      
      // End the diagnostic session if one was active
      if (clientState?.diagnosticSessionId) {
        try {
          const endedSession = await storage.endDiagnosticSession(clientState.diagnosticSessionId);
          console.log(`Ended diagnostic session with ID: ${clientState.diagnosticSessionId} due to client disconnect`);
        } catch (error) {
          console.error('Error ending diagnostic session during disconnect:', error);
        }
      }
      
      clients.delete(ws);
    });
  });
  
  return httpServer;
}
