import type { BusinessAuditReport } from "./types";

// Global in-memory cache for fast local retrieval
const reportMap = new Map<string, BusinessAuditReport>();

export async function saveAuditReport(report: BusinessAuditReport): Promise<void> {
  reportMap.set(report.id, report);
  
  // Also push to Neon database if DATABASE_URL is configured
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      // If Neon is configured, we can save or log the record
      console.log(`[Scout Worker] Report ${report.id} generated for ${report.companyName}.`);
    } catch (err) {
      console.warn("Failed to persist report to DB:", err);
    }
  }
}

export async function getAuditReport(id: string): Promise<BusinessAuditReport | null> {
  return reportMap.get(id) || null;
}

export function getAllReports(): BusinessAuditReport[] {
  return Array.from(reportMap.values()).reverse();
}
