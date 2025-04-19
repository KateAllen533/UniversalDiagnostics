import { pgTable, text, serial, integer, boolean, timestamp, jsonb, foreignKey, primaryKey, varchar } from "drizzle-orm/pg-core";
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

// Issue report table
export const issueReports = pgTable("issue_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // low, medium, high, critical
  status: varchar("status", { length: 20 }).default("open").notNull(), // open, in-progress, resolved, closed
  deviceInfo: jsonb("device_info"),
  appVersion: varchar("app_version", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const issueReportsRelations = relations(issueReports, ({ one }) => ({
  user: one(users, {
    fields: [issueReports.userId],
    references: [users.id],
  }),
}));

export const insertIssueReportSchema = createInsertSchema(issueReports).pick({
  userId: true,
  title: true,
  description: true,
  category: true,
  severity: true,
  deviceInfo: true,
  appVersion: true,
});

export type InsertIssueReport = z.infer<typeof insertIssueReportSchema>;
export type IssueReport = typeof issueReports.$inferSelect;

// User metrics table
export const userMetrics = pgTable("user_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(), // client-side session ID
  eventType: varchar("event_type", { length: 50 }).notNull(), // pageview, connection, diagnostics, etc.
  eventData: jsonb("event_data"),
  deviceInfo: jsonb("device_info"),
  browserInfo: jsonb("browser_info"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const userMetricsRelations = relations(userMetrics, ({ one }) => ({
  user: one(users, {
    fields: [userMetrics.userId],
    references: [users.id],
  }),
}));

export const insertUserMetricSchema = createInsertSchema(userMetrics).pick({
  userId: true,
  sessionId: true,
  eventType: true,
  eventData: true,
  deviceInfo: true,
  browserInfo: true,
  ipAddress: true,
  userAgent: true,
});

export type InsertUserMetric = z.infer<typeof insertUserMetricSchema>;
export type UserMetric = typeof userMetrics.$inferSelect;

// Issue category enum
export enum IssueCategory {
  CONNECTION = 'connection',
  DIAGNOSTICS = 'diagnostics',
  INTERFACE = 'interface',
  PERFORMANCE = 'performance',
  COMPATIBILITY = 'compatibility',
  OTHER = 'other'
}

// Issue severity enum
export enum IssueSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Issue status enum
export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

// User event types enum
export enum UserEventType {
  PAGE_VIEW = 'pageview',
  CONNECTION_ATTEMPT = 'connection-attempt',
  CONNECTION_SUCCESS = 'connection-success',
  CONNECTION_FAILURE = 'connection-failure',
  DIAGNOSTICS_RUN = 'diagnostics-run',
  TROUBLE_CODE_SCAN = 'trouble-code-scan',
  EXPORT_DATA = 'export-data',
  FORM_SUBMISSION = 'form-submission',
  ERROR = 'error',
  FEATURE_USAGE = 'feature-usage'
}

// Advanced Diagnostic Module Types
export enum DiagnosticModuleType {
  KEY_PROGRAMMING = 'key_programming',
  EEPROM_OPERATIONS = 'eeprom_operations',
  VEHICLE_DIAGNOSTICS = 'vehicle_diagnostics',
  SYSTEM_ADAPTATION = 'system_adaptation',
  ADVANCED_CONTROL = 'advanced_control',
  SYSTEM_INFO = 'system_info'
}

// Key Programming Function Types
export enum KeyProgrammingFunction {
  PROGRAM_NEW_KEY = 'program_new_key',
  ADD_SPARE_KEY = 'add_spare_key',
  PROGRAM_REMOTE = 'program_remote',
  CLONE_TRANSPONDER = 'clone_transponder',
  READ_PIN_CODE = 'read_pin_code'
}

// EEPROM Operations Function Types
export enum EepromOperationFunction {
  READ_EEPROM = 'read_eeprom',
  WRITE_EEPROM = 'write_eeprom',
  IDENTIFY_EEPROM_CHIP = 'identify_eeprom_chip',
  MODIFY_IMMO_DATA = 'modify_immo_data',
  BACKUP_EEPROM = 'backup_eeprom'
}

// Vehicle Diagnostics Function Types
export enum VehicleDiagnosticsFunction {
  READ_DTCS = 'read_dtcs',
  CLEAR_DTCS = 'clear_dtcs',
  PERFORM_ACTIVE_TEST = 'perform_active_test',
  STREAM_LIVE_DATA = 'stream_live_data',
  RUN_MODULE_SCAN = 'run_module_scan'
}

// System Adaptation Function Types
export enum SystemAdaptationFunction {
  RESET_OIL_SERVICE = 'reset_oil_service',
  EPB_MAINTENANCE_MODE = 'epb_maintenance_mode',
  CALIBRATE_STEERING_ANGLE = 'calibrate_steering_angle',
  INJECTOR_CODING = 'injector_coding',
  BMS_RESET = 'bms_reset'
}

// Advanced Control Function Types
export enum AdvancedControlFunction {
  ENABLE_SGW_BYPASS = 'enable_sgw_bypass',
  MODIFY_VIN = 'modify_vin',
  ODOMETER_ADJUST = 'odometer_adjust',
  AIRBAG_CRASH_RESET = 'airbag_crash_reset'
}

// System Information Function Types
export enum SystemInfoFunction {
  GET_SUPPORTED_PROTOCOLS = 'get_supported_protocols',
  QUERY_IMMO_STATUS = 'query_immo_status',
  LIST_SUPPORTED_VEHICLES = 'list_supported_vehicles'
}

// Generic Diagnostic Function Interface
export interface DiagnosticFunction {
  moduleType: DiagnosticModuleType;
  functionName: string;
  inputs: Record<string, any>;
  output?: Record<string, any>;
  successFlag?: boolean;
  timestamp: Date;
}

// Key Programming Function Interfaces
export interface KeyProgrammingParams {
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

// EEPROM Operations Function Interfaces
export interface EepromOperationParams {
  chipType?: string;
  pinoutMap?: string;
  targetAddress?: string;
  hexData?: string;
  electricalSignature?: string;
  eepromData?: string;
  chipID?: string;
}

// Vehicle Diagnostics Function Interfaces
export interface VehicleDiagnosticsParams {
  vehicleMake?: string;
  systemModule?: string;
  moduleList?: string[];
  componentID?: string;
  sensorIDs?: string[];
  vehicleVIN?: string;
}

// System Adaptation Function Interfaces
export interface SystemAdaptationParams {
  vehicleMake?: string;
  vehicleModel?: string;
  brakeModuleVersion?: string;
  steeringSensor?: string;
  injectorSerials?: string[];
  ecuType?: string;
  batteryID?: string;
  resetCondition?: string;
}

// Advanced Control Function Interfaces
export interface AdvancedControlParams {
  vehicleMake?: string;
  vehicleYear?: string;
  ecuID?: string;
  newVIN?: string;
  clusterID?: string;
  newValue?: number;
  moduleID?: string;
}

// System Information Function Interfaces
export interface SystemInfoParams {
  vehicleMake?: string;
  vehicleVIN?: string;
  region?: string;
}

// Database table for advanced diagnostic operations
export const advancedDiagnostics = pgTable("advanced_diagnostics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: integer("session_id").references(() => diagnosticSessions.id),
  moduleType: varchar("module_type", { length: 50 }).notNull(),
  functionName: varchar("function_name", { length: 100 }).notNull(),
  inputParams: jsonb("input_params"),
  outputResult: jsonb("output_result"),
  successFlag: boolean("success_flag"),
  executionTime: timestamp("execution_time").defaultNow().notNull(),
  vehicleVin: varchar("vehicle_vin", { length: 20 }),
  vehicleMake: varchar("vehicle_make", { length: 50 }),
  vehicleModel: varchar("vehicle_model", { length: 50 }),
  notes: text("notes"),
});

// Relations for advanced diagnostics
export const advancedDiagnosticsRelations = relations(advancedDiagnostics, ({ one }) => ({
  user: one(users, {
    fields: [advancedDiagnostics.userId],
    references: [users.id],
  }),
  session: one(diagnosticSessions, {
    fields: [advancedDiagnostics.sessionId],
    references: [diagnosticSessions.id],
  }),
}));

// Insert schema for advanced diagnostics
export const insertAdvancedDiagnosticSchema = createInsertSchema(advancedDiagnostics).pick({
  userId: true,
  sessionId: true,
  moduleType: true,
  functionName: true,
  inputParams: true,
  outputResult: true,
  successFlag: true,
  vehicleVin: true,
  vehicleMake: true,
  vehicleModel: true,
  notes: true,
});

export type InsertAdvancedDiagnostic = z.infer<typeof insertAdvancedDiagnosticSchema>;
export type AdvancedDiagnostic = typeof advancedDiagnostics.$inferSelect;
