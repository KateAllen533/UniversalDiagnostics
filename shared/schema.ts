import { pgTable, text, serial, integer, boolean, timestamp, jsonb, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Vehicle profiles table
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: text("year").notNull(),
  vin: text("vin"),
  engineType: text("engine_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
  diagnosticSessions: many(diagnosticSessions),
}));

export const insertVehicleSchema = createInsertSchema(vehicles).pick({
  userId: true,
  make: true,
  model: true,
  year: true,
  vin: true,
  engineType: true,
});

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

// Diagnostic sessions table
export const diagnosticSessions = pgTable("diagnostic_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  connectionMethod: text("connection_method").notNull(),
  protocol: text("protocol").notNull(),
  vehicleType: text("vehicle_type").notNull(),
});

export const diagnosticSessionsRelations = relations(diagnosticSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [diagnosticSessions.userId],
    references: [users.id],
  }),
  vehicle: one(vehicles, {
    fields: [diagnosticSessions.vehicleId],
    references: [vehicles.id],
  }),
  troubleCodes: many(troubleCodes),
  vehicleDataPoints: many(vehicleDataPoints),
}));

export const insertDiagnosticSessionSchema = createInsertSchema(diagnosticSessions).pick({
  userId: true,
  vehicleId: true,
  connectionMethod: true,
  protocol: true,
  vehicleType: true,
});

export type InsertDiagnosticSession = z.infer<typeof insertDiagnosticSessionSchema>;
export type DiagnosticSession = typeof diagnosticSessions.$inferSelect;

// Trouble codes table
export const troubleCodes = pgTable("trouble_codes", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => diagnosticSessions.id),
  code: text("code").notNull(),
  description: text("description"),
  severity: text("severity").notNull(), // low, medium, high
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const troubleCodesRelations = relations(troubleCodes, ({ one }) => ({
  session: one(diagnosticSessions, {
    fields: [troubleCodes.sessionId],
    references: [diagnosticSessions.id],
  }),
}));

export const insertTroubleCodeSchema = createInsertSchema(troubleCodes).pick({
  sessionId: true,
  code: true,
  description: true,
  severity: true,
});

export type InsertTroubleCode = z.infer<typeof insertTroubleCodeSchema>;
export type TroubleCodeRecord = typeof troubleCodes.$inferSelect;

// Vehicle data points table
export const vehicleDataPoints = pgTable("vehicle_data_points", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => diagnosticSessions.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  engineData: jsonb("engine_data"),
  batteryStatus: jsonb("battery_status"),
  sensorData: jsonb("sensor_data"),
  milStatus: text("mil_status"),
  readiness: text("readiness"),
});

export const vehicleDataPointsRelations = relations(vehicleDataPoints, ({ one }) => ({
  session: one(diagnosticSessions, {
    fields: [vehicleDataPoints.sessionId],
    references: [diagnosticSessions.id],
  }),
}));

export const insertVehicleDataPointSchema = createInsertSchema(vehicleDataPoints).pick({
  sessionId: true,
  engineData: true,
  batteryStatus: true,
  sensorData: true,
  milStatus: true,
  readiness: true,
});

export type InsertVehicleDataPoint = z.infer<typeof insertVehicleDataPointSchema>;
export type VehicleDataPoint = typeof vehicleDataPoints.$inferSelect;

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
