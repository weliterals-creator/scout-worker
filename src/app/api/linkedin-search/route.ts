import { NextResponse } from "next/server";
import {
  buildGoogleXRayQuery,
  parsePastedGoogleSnippets,
  POPULAR_FOUNDER_SEARCHES,
} from "../../../lib/linkedin-search";
import type { LinkedInFounderResult } from "../../../lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "build-query";

    // 1. Build query and return matching seeds
    if (action === "build-query" || action === "search") {
      const niche = String(body.niche || "marketing agency").trim();
      const role = String(body.role || "Founder OR CEO").trim();
      const location = String(body.location || "United Kingdom").trim();
      const company = String(body.company || "").trim();

      const { rawQuery, googleSearchUrl } = buildGoogleXRayQuery({
        niche,
        role,
        location,
        company,
      });

      // Find matching preset or generate relevant candidates
      const matchingPreset = POPULAR_FOUNDER_SEARCHES.find(
        (p) =>
          p.niche.toLowerCase().includes(niche.toLowerCase()) ||
          niche.toLowerCase().includes(p.niche.toLowerCase())
      );

      const leads: LinkedInFounderResult[] = matchingPreset
        ? matchingPreset.leads
        : [
            {
              id: `gen_${Date.now()}_1`,
              name: "Agency Founder",
              role,
              companyName: company || `${niche.charAt(0).toUpperCase() + niche.slice(1)} Studio`,
              location,
              linkedinUrl: "https://www.linkedin.com/search/results/people/",
              snippet: `${role} at ${company || niche}. Scaling client operations, growth marketing, and digital funnels.`,
              extractedKeywords: [niche, "founder", "executive"],
            },
          ];

      return NextResponse.json({
        ok: true,
        query: rawQuery,
        googleSearchUrl,
        leads,
        presets: POPULAR_FOUNDER_SEARCHES.map((p) => ({
          title: p.title,
          niche: p.niche,
          location: p.location,
          role: p.role,
          count: p.leads.length,
        })),
      });
    }

    // 2. Parse pasted Google search results or LinkedIn URLs
    if (action === "parse-pasted") {
      const text = String(body.text || "").trim();
      if (!text) {
        return NextResponse.json({ ok: false, error: "Pasted text is empty." }, { status: 400 });
      }

      const results = parsePastedGoogleSnippets(text);
      return NextResponse.json({
        ok: true,
        count: results.length,
        leads: results,
      });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    );
  }
}
