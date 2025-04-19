import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Connection Types
export enum ConnectionMethod {
  USB = 'usb',
  USBC = 'usbc',
  BLUETOOTH = 'bluetooth'
}

// Vehicle Types
export enum VehicleType {
  AUTO_DETECT = 'auto',
  ICE = 'ice',
  EV = 'ev',
  HYBRID = 'hybrid'
}

// Protocol Types
export enum ProtocolType {
  AUTO_DETECT = 'auto',
  OBD2 = 'obd2',
  CAN = 'can',
  J1850 = 'j1850'
}

// Vehicle Information Interface
export interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  vin: string;
  engineType: string;
}

// Diagnostic Trouble Code Interface
export interface TroubleCode {
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// Battery Status Interface
export interface BatteryStatus {
  stateOfCharge: number; // percentage
  voltage: number; // volts
  current: number; // amps
  temperature: number; // celsius
  health: string;
}

// Engine Data Interface
export interface EngineData {
  rpm: number;
  speed: number; // km/h or mph
  coolantTemp: number; // celsius
  intakeTemp: number; // celsius
  load: number; // percentage
  timing: number; // degrees
}

// Sensor Data Interface
export interface SensorData {
  maf: number; // Mass Air Flow
  map: number; // Manifold Absolute Pressure
  o2Sensor: number;
  fuelPressure: number;
  throttle: number; // percentage
  shortFuelTrim: number; // percentage
}

// Connection Settings Interface
export interface ConnectionSettings {
  vehicleType: VehicleType;
  connectionMethod: ConnectionMethod;
  protocol: ProtocolType;
}

// Vehicle Data Interface - combines all data types
export interface VehicleData {
  vehicleInfo?: VehicleInfo;
  troubleCodes?: TroubleCode[];
  milStatus?: string;
  readiness?: string;
  batteryStatus?: BatteryStatus;
  engineData?: EngineData;
  sensorData?: SensorData;
  timestamp: number; // Unix timestamp for when data was collected
}

// Server status
export interface ServerStatus {
  isRunning: boolean;
  message?: string;
}

// WebSocket message types
export enum MessageType {
  CONNECT_REQUEST = 'connect_request',
  CONNECT_RESPONSE = 'connect_response',
  DISCONNECT_REQUEST = 'disconnect_request',
  DISCONNECT_RESPONSE = 'disconnect_response',
  DATA_UPDATE = 'data_update',
  ERROR = 'error',
  SERVER_STATUS = 'server_status'
}

// WebSocket message interface
export interface WebSocketMessage {
  type: MessageType;
  payload: any;
}

// WebSocket connect request payload
export interface ConnectRequestPayload {
  settings: ConnectionSettings;
}

// WebSocket connect response payload
export interface ConnectResponsePayload {
  success: boolean;
  message: string;
  connectionInfo?: {
    deviceName: string;
    protocol: string;
  };
}

// WebSocket data update payload
export interface DataUpdatePayload {
  vehicleData: VehicleData;
}

// WebSocket error payload
export interface ErrorPayload {
  code: string;
  message: string;
}

// WebSocket server status payload
export interface ServerStatusPayload {
  status: ServerStatus;
}
