import type { LinkedInFounderResult } from "./types";

export interface GoogleXRayParams {
  role?: string;
  niche?: string;
  location?: string;
  company?: string;
}

/**
 * Builds the exact Google Search query that discovers LinkedIn founder profiles.
 */
export function buildGoogleXRayQuery(params: GoogleXRayParams): {
  rawQuery: string;
  googleSearchUrl: string;
} {
  const parts: string[] = ["site:linkedin.com/in/"];

  const role = params.role?.trim() || "Founder OR CEO OR 'Managing Director'";
  parts.push(`(${role})`);

  if (params.niche?.trim()) {
    parts.push(`"${params.niche.trim()}"`);
  }

  if (params.location?.trim()) {
    parts.push(`"${params.location.trim()}"`);
  }

  if (params.company?.trim()) {
    parts.push(`"${params.company.trim()}"`);
  }

  const rawQuery = parts.join(" ");
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(rawQuery)}`;

  return { rawQuery, googleSearchUrl };
}

/**
 * Parses raw text pasted from Google search results (or LinkedIn snippets)
 * into clean, structured LinkedIn founder leads.
 */
export function parsePastedGoogleSnippets(text: string): LinkedInFounderResult[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const results: LinkedInFounderResult[] = [];

  // Match LinkedIn URLs in text
  const urlMatches = text.matchAll(/https:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi);
  const foundUrls = Array.from(new Set(Array.from(urlMatches, (m) => m[0])));

  for (let i = 0; i < foundUrls.length; i++) {
    const url = foundUrls[i];
    const slug = url.split("/in/")[1]?.replace(/\/$/, "") || `lead_${i + 1}`;
    
    // Guess name from slug if not found in text
    const cleanNameFromSlug = slug
      .split("-")
      .filter((part) => !/^[0-9a-f]{6,}$/i.test(part))
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    results.push({
      id: `li_${Date.now()}_${i}`,
      name: cleanNameFromSlug || "Founder",
      role: "Founder / Executive",
      companyName: "Target Company",
      location: "United Kingdom",
      linkedinUrl: url,
      snippet: `Public LinkedIn profile for ${cleanNameFromSlug}`,
      extractedKeywords: ["founder", "linkedin-profile"],
    });
  }

  return results;
}

/**
 * High-intent starter founder seeds for instant testing
 */
export const POPULAR_FOUNDER_SEARCHES: {
  title: string;
  niche: string;
  location: string;
  role: string;
  leads: LinkedInFounderResult[];
}[] = [
  {
    title: "UK Performance Marketing Agency Founders",
    niche: "performance marketing agency",
    location: "London, UK",
    role: "Founder OR CEO",
    leads: [
      {
        id: "uk_agency_1",
        name: "Harry Sanders",
        role: "Founder & CEO",
        companyName: "Studio Seven Growth",
        location: "London, UK",
        linkedinUrl: "https://www.linkedin.com/in/harrysanders-agency",
        snippet: "Founder at Studio Seven Growth. Helping DTC & service brands scale paid traffic and social funnels.",
        extractedKeywords: ["growth", "agency", "paid-traffic"],
      },
      {
        id: "uk_agency_2",
        name: "Chloe Evans",
        role: "Managing Director & Co-Founder",
        companyName: "Vantage Social Media",
        location: "Manchester, UK",
        linkedinUrl: "https://www.linkedin.com/in/chloeevans-social",
        snippet: "Co-Founder at Vantage Social. Inbound social strategy, creative campaigns, and influencer management.",
        extractedKeywords: ["social-media", "inbound", "agency"],
      },
      {
        id: "uk_agency_3",
        name: "Oliver Wright",
        role: "Founder",
        companyName: "Apex B2B Media",
        location: "Bristol, UK",
        linkedinUrl: "https://www.linkedin.com/in/oliverwright-b2b",
        snippet: "Founder of Apex B2B Media. Appointment generation, cold outbound, and pipeline scaling for SaaS.",
        extractedKeywords: ["b2b", "appointment-generation", "saas"],
      },
    ],
  },
  {
    title: "Online Coaches & High-Ticket Consultants",
    niche: "executive coach OR business consultant",
    location: "United Kingdom",
    role: "Founder OR Principal",
    leads: [
      {
        id: "uk_coach_1",
        name: "Marcus Vance",
        role: "Founder & Head Coach",
        companyName: "Elevate Executive Advisory",
        location: "London, UK",
        linkedinUrl: "https://www.linkedin.com/in/marcusvance-advisory",
        snippet: "High-performance business coach. Working with 7-figure founders on leadership and operational scale.",
        extractedKeywords: ["coaching", "consulting", "advisory"],
      },
      {
        id: "uk_coach_2",
        name: "Sarah Jenkins",
        role: "Founder",
        companyName: "The Scale Blueprint",
        location: "Birmingham, UK",
        linkedinUrl: "https://www.linkedin.com/in/sarahjenkins-blueprint",
        snippet: "Founder at The Scale Blueprint. Helping consultants turn social content into booked discovery calls.",
        extractedKeywords: ["consulting", "funnels", "coaching"],
      },
    ],
  },
  {
    title: "E-Commerce & Shopify Brand Founders",
    niche: "shopify OR ecommerce brand",
    location: "United Kingdom",
    role: "Founder OR Co-Founder",
    leads: [
      {
        id: "uk_ecom_1",
        name: "Tom Gallagher",
        role: "Founder & Director",
        companyName: "Aura Apparel Co",
        location: "London, UK",
        linkedinUrl: "https://www.linkedin.com/in/tomgallagher-ecommerce",
        snippet: "Founder of Aura Apparel Co. Direct-to-consumer sustainable apparel scaling across UK and Europe.",
        extractedKeywords: ["dtc", "ecommerce", "retail"],
      },
    ],
  },
];
