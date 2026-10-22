import { NextResponse } from "next/server";
import type { FounderLead } from "../../../lib/types";

// Curated starter seeds across major agency/creator/founder categories
const SAMPLE_FOUNDER_SEEDS: FounderLead[] = [
  {
    id: "lead_1",
    name: "James Thornton",
    companyName: "Nexus Growth Agency",
    website: "https://nexusgrowth.io",
    role: "Founder & Managing Director",
    email: "james@nexusgrowth.io",
    linkedinUrl: "https://linkedin.com/in/jamesthornton-growth",
    location: "London, UK",
    niche: "B2B Lead Generation & Paid Media",
  },
  {
    id: "lead_2",
    name: "Sophie Vance",
    companyName: "Vance Media Lab",
    website: "https://vancemedialab.com",
    role: "Agency Founder & CEO",
    email: "sophie@vancemedialab.com",
    linkedinUrl: "https://linkedin.com/in/sophievance",
    location: "Manchester, UK",
    niche: "Creative Performance Agency",
  },
  {
    id: "lead_3",
    name: "Marcus Bell",
    companyName: "ScaleVelocity Consulting",
    website: "https://scalevelocity.co",
    role: "Co-Founder",
    email: "marcus@scalevelocity.co",
    linkedinUrl: "https://linkedin.com/in/marcusbell-scale",
    location: "Austin, TX, US",
    niche: "SaaS Sales & GTM Advisory",
  },
  {
    id: "lead_4",
    name: "Elena Rostova",
    companyName: "Aura Commerce Studio",
    website: "https://auracommercestudio.com",
    role: "Founder",
    email: "elena@auracommercestudio.com",
    linkedinUrl: "https://linkedin.com/in/elenarostova",
    location: "London, UK",
    niche: "DTC & Shopify Optimization",
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query || "").trim().toLowerCase();

    // If query matches a URL directly, return single target
    if (/^https?:\/\/|^(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i.test(query)) {
      const cleanUrl = query.startsWith("http") ? query : `https://${query}`;
      const domain = cleanUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const companyName = domain.split(".")[0].toUpperCase();
      return NextResponse.json({
        ok: true,
        leads: [
          {
            id: `custom_${Date.now()}`,
            name: "Founder / Managing Director",
            companyName,
            website: cleanUrl,
            role: "Founder",
            location: "Online",
            niche: "Target Business",
          },
        ],
      });
    }

    // Filter seeds or generate mock tailored results based on niche
    let filtered = SAMPLE_FOUNDER_SEEDS;
    if (query) {
      filtered = SAMPLE_FOUNDER_SEEDS.filter(
        (s) =>
          s.companyName.toLowerCase().includes(query) ||
          s.niche?.toLowerCase().includes(query) ||
          s.location?.toLowerCase().includes(query) ||
          s.name.toLowerCase().includes(query)
      );
      if (filtered.length === 0) {
        // Synthesize relevant prospects matching the search query
        filtered = [
          {
            id: `gen_${Date.now()}_1`,
            name: "Founder",
            companyName: `${query.charAt(0).toUpperCase() + query.slice(1)} Collective`,
            website: `https://${query.replace(/\s+/g, "")}.com`,
            role: "Founder & CEO",
            location: "United Kingdom",
            niche: query,
          },
        ];
      }
    }

    return NextResponse.json({ ok: true, leads: filtered });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    );
  }
}
