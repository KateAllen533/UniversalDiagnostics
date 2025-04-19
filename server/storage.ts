import { users, type User, type InsertUser, 
         vehicles, type Vehicle, type InsertVehicle,
         diagnosticSessions, type DiagnosticSession, type InsertDiagnosticSession,
         troubleCodes, type TroubleCodeRecord, type InsertTroubleCode,
         vehicleDataPoints, type VehicleDataPoint, type InsertVehicleDataPoint,
         issueReports, type IssueReport, type InsertIssueReport, IssueStatus,
         userMetrics, type UserMetric, type InsertUserMetric, UserEventType,
         advancedDiagnostics, type AdvancedDiagnostic, type InsertAdvancedDiagnostic, DiagnosticModuleType } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vehicle methods
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehiclesByUser(userId: number): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, updateData: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  
  // Diagnostic session methods
  getDiagnosticSession(id: number): Promise<DiagnosticSession | undefined>;
  getDiagnosticSessionsByUser(userId: number): Promise<DiagnosticSession[]>;
  getDiagnosticSessionsByVehicle(vehicleId: number): Promise<DiagnosticSession[]>;
  createDiagnosticSession(session: InsertDiagnosticSession): Promise<DiagnosticSession>;
  updateDiagnosticSession(id: number, updateData: Partial<InsertDiagnosticSession>): Promise<DiagnosticSession | undefined>;
  endDiagnosticSession(id: number): Promise<DiagnosticSession | undefined>;
  
  // Trouble code methods
  getTroubleCodesBySession(sessionId: number): Promise<TroubleCodeRecord[]>;
  createTroubleCode(troubleCode: InsertTroubleCode): Promise<TroubleCodeRecord>;
  
  // Vehicle data methods
  getVehicleDataPointsBySession(sessionId: number): Promise<VehicleDataPoint[]>;
  createVehicleDataPoint(dataPoint: InsertVehicleDataPoint): Promise<VehicleDataPoint>;
  
  // Issue report methods
  getIssueReport(id: number): Promise<IssueReport | undefined>;
  getIssueReportsByUser(userId: number): Promise<IssueReport[]>;
  getIssueReportsByStatus(status: IssueStatus): Promise<IssueReport[]>;
  createIssueReport(report: InsertIssueReport): Promise<IssueReport>;
  updateIssueReport(id: number, updateData: Partial<InsertIssueReport>): Promise<IssueReport | undefined>;
  updateIssueStatus(id: number, status: IssueStatus): Promise<IssueReport | undefined>;
  
  // User metrics methods
  getUserMetricsByUser(userId: number): Promise<UserMetric[]>;
  getUserMetricsBySessionId(sessionId: string): Promise<UserMetric[]>;
  getUserMetricsByEventType(eventType: UserEventType): Promise<UserMetric[]>;
  createUserMetric(metric: InsertUserMetric): Promise<UserMetric>;
  
  // Advanced diagnostics methods
  getAdvancedDiagnostic(id: number): Promise<AdvancedDiagnostic | undefined>;
  getAdvancedDiagnosticsByUser(userId: number): Promise<AdvancedDiagnostic[]>;
  getAdvancedDiagnosticsBySession(sessionId: number): Promise<AdvancedDiagnostic[]>;
  getAdvancedDiagnosticsByModule(moduleType: DiagnosticModuleType): Promise<AdvancedDiagnostic[]>;
  getAdvancedDiagnosticsByFunction(functionName: string): Promise<AdvancedDiagnostic[]>;
  createAdvancedDiagnostic(diagnostic: InsertAdvancedDiagnostic): Promise<AdvancedDiagnostic>;
  updateAdvancedDiagnostic(id: number, updateData: Partial<InsertAdvancedDiagnostic>): Promise<AdvancedDiagnostic | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Vehicle methods
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || undefined;
  }
  
  async getVehiclesByUser(userId: number): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.userId, userId));
  }
  
  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [newVehicle] = await db
      .insert(vehicles)
      .values(vehicle)
      .returning();
    return newVehicle;
  }
  
  async updateVehicle(id: number, updateData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [updatedVehicle] = await db
      .update(vehicles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle || undefined;
  }
  
  async deleteVehicle(id: number): Promise<boolean> {
    const result = await db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning({ id: vehicles.id });
    return result.length > 0;
  }
  
  // Diagnostic session methods
  async getDiagnosticSession(id: number): Promise<DiagnosticSession | undefined> {
    const [session] = await db.select().from(diagnosticSessions).where(eq(diagnosticSessions.id, id));
    return session || undefined;
  }
  
  async getDiagnosticSessionsByUser(userId: number): Promise<DiagnosticSession[]> {
    return await db.select().from(diagnosticSessions).where(eq(diagnosticSessions.userId, userId));
  }
  
  async getDiagnosticSessionsByVehicle(vehicleId: number): Promise<DiagnosticSession[]> {
    return await db.select().from(diagnosticSessions).where(eq(diagnosticSessions.vehicleId, vehicleId));
  }
  
  async createDiagnosticSession(session: InsertDiagnosticSession): Promise<DiagnosticSession> {
    const [newSession] = await db
      .insert(diagnosticSessions)
      .values(session)
      .returning();
    return newSession;
  }
  
  async updateDiagnosticSession(id: number, updateData: Partial<InsertDiagnosticSession>): Promise<DiagnosticSession | undefined> {
    const [updatedSession] = await db
      .update(diagnosticSessions)
      .set(updateData)
      .where(eq(diagnosticSessions.id, id))
      .returning();
    return updatedSession || undefined;
  }
  
  async endDiagnosticSession(id: number): Promise<DiagnosticSession | undefined> {
    const [endedSession] = await db
      .update(diagnosticSessions)
      .set({ endTime: new Date() })
      .where(eq(diagnosticSessions.id, id))
      .returning();
    return endedSession || undefined;
  }
  
  // Trouble code methods
  async getTroubleCodesBySession(sessionId: number): Promise<TroubleCodeRecord[]> {
    return await db.select().from(troubleCodes).where(eq(troubleCodes.sessionId, sessionId));
  }
  
  async createTroubleCode(troubleCode: InsertTroubleCode): Promise<TroubleCodeRecord> {
    const [newTroubleCode] = await db
      .insert(troubleCodes)
      .values(troubleCode)
      .returning();
    return newTroubleCode;
  }
  
  // Vehicle data methods
  async getVehicleDataPointsBySession(sessionId: number): Promise<VehicleDataPoint[]> {
    return await db.select().from(vehicleDataPoints).where(eq(vehicleDataPoints.sessionId, sessionId));
  }
  
  async createVehicleDataPoint(dataPoint: InsertVehicleDataPoint): Promise<VehicleDataPoint> {
    const [newDataPoint] = await db
      .insert(vehicleDataPoints)
      .values(dataPoint)
      .returning();
    return newDataPoint;
  }

  // Issue report methods
  async getIssueReport(id: number): Promise<IssueReport | undefined> {
    const [report] = await db.select().from(issueReports).where(eq(issueReports.id, id));
    return report || undefined;
  }

  async getIssueReportsByUser(userId: number): Promise<IssueReport[]> {
    return await db.select().from(issueReports).where(eq(issueReports.userId, userId));
  }

  async getIssueReportsByStatus(status: IssueStatus): Promise<IssueReport[]> {
    return await db.select().from(issueReports).where(eq(issueReports.status, status));
  }

  async createIssueReport(report: InsertIssueReport): Promise<IssueReport> {
    const [newReport] = await db
      .insert(issueReports)
      .values(report)
      .returning();
    return newReport;
  }

  async updateIssueReport(id: number, updateData: Partial<InsertIssueReport>): Promise<IssueReport | undefined> {
    const [updatedReport] = await db
      .update(issueReports)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(issueReports.id, id))
      .returning();
    return updatedReport || undefined;
  }

  async updateIssueStatus(id: number, status: IssueStatus): Promise<IssueReport | undefined> {
    const [updatedReport] = await db
      .update(issueReports)
      .set({ 
        status: status, 
        updatedAt: new Date(),
        resolvedAt: (status === IssueStatus.RESOLVED || status === IssueStatus.CLOSED) ? new Date() : undefined
      })
      .where(eq(issueReports.id, id))
      .returning();
    return updatedReport || undefined;
  }

  // User metrics methods
  async getUserMetricsByUser(userId: number): Promise<UserMetric[]> {
    return await db.select().from(userMetrics).where(eq(userMetrics.userId, userId));
  }

  async getUserMetricsBySessionId(sessionId: string): Promise<UserMetric[]> {
    return await db.select().from(userMetrics).where(eq(userMetrics.sessionId, sessionId));
  }

  async getUserMetricsByEventType(eventType: UserEventType): Promise<UserMetric[]> {
    return await db.select().from(userMetrics).where(eq(userMetrics.eventType, eventType));
  }

  async createUserMetric(metric: InsertUserMetric): Promise<UserMetric> {
    const [newMetric] = await db
      .insert(userMetrics)
      .values(metric)
      .returning();
    return newMetric;
  }

  // Advanced diagnostics methods
  async getAdvancedDiagnostic(id: number): Promise<AdvancedDiagnostic | undefined> {
    const [diagnostic] = await db.select().from(advancedDiagnostics).where(eq(advancedDiagnostics.id, id));
    return diagnostic || undefined;
  }

  async getAdvancedDiagnosticsByUser(userId: number): Promise<AdvancedDiagnostic[]> {
    return await db.select().from(advancedDiagnostics).where(eq(advancedDiagnostics.userId, userId));
  }

  async getAdvancedDiagnosticsBySession(sessionId: number): Promise<AdvancedDiagnostic[]> {
    return await db.select().from(advancedDiagnostics).where(eq(advancedDiagnostics.sessionId, sessionId));
  }

  async getAdvancedDiagnosticsByModule(moduleType: DiagnosticModuleType): Promise<AdvancedDiagnostic[]> {
    return await db.select().from(advancedDiagnostics).where(eq(advancedDiagnostics.moduleType, moduleType));
  }

  async getAdvancedDiagnosticsByFunction(functionName: string): Promise<AdvancedDiagnostic[]> {
    return await db.select().from(advancedDiagnostics).where(eq(advancedDiagnostics.functionName, functionName));
  }

  async createAdvancedDiagnostic(diagnostic: InsertAdvancedDiagnostic): Promise<AdvancedDiagnostic> {
    const [newDiagnostic] = await db
      .insert(advancedDiagnostics)
      .values(diagnostic)
      .returning();
    return newDiagnostic;
  }

  async updateAdvancedDiagnostic(id: number, updateData: Partial<InsertAdvancedDiagnostic>): Promise<AdvancedDiagnostic | undefined> {
    const [updatedDiagnostic] = await db
      .update(advancedDiagnostics)
      .set(updateData)
      .where(eq(advancedDiagnostics.id, id))
      .returning();
    return updatedDiagnostic || undefined;
  }
}

export const storage = new DatabaseStorage();
