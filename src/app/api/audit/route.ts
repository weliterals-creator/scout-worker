import { NextResponse } from "next/server";
import { extractWebsiteSignals } from "../../../lib/web-scraper";
import { generateBusinessAudit } from "../../../lib/audit-generator";
import { saveAuditReport, getAuditReport } from "../../../lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const companyName = String(body.companyName || "Target Company").trim();
    const website = String(body.website || "").trim();
    const founderName = String(body.founderName || "Founder").trim();

    if (!website) {
      return NextResponse.json({ ok: false, error: "Website URL is required." }, { status: 400 });
    }

    // 1. Lightweight extraction (< 2s)
    const signals = await extractWebsiteSignals(website);

    // 2. Generate structured audit with Gemini/AI
    const report = await generateBusinessAudit(companyName, website, founderName, signals);

    // 3. Persist report
    await saveAuditReport(report);

    // 4. Return result with public report link
    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

    const reportUrl = `${baseUrl}/report/${report.id}`;

    return NextResponse.json({
      ok: true,
      report,
      reportUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Audit generation failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  const report = await getAuditReport(id);
  if (!report) return NextResponse.json({ ok: false, error: "Report not found" }, { status: 404 });

  return NextResponse.json({ ok: true, report });
}
