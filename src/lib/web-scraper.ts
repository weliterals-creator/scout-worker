export interface WebExtractionResult {
  url: string;
  title: string;
  description: string;
  headings: string[];
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  hasCalendlyOrBooking: boolean;
  contactEmail?: string;
  rawSnippet: string;
}

export async function extractWebsiteSignals(url: string): Promise<WebExtractionResult> {
  const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
  
  try {
    const res = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(4000), // 4 seconds max
    });

    if (!res.ok) {
      return fallbackExtraction(cleanUrl);
    }

    const html = await res.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : "";

    // Extract H1 / H2 headings
    const headings: string[] = [];
    const hMatches = html.matchAll(/<h[1-2][^>]*>([^<]+)<\/h[1-2]>/gi);
    for (const match of hMatches) {
      if (match[1] && match[1].trim().length > 3) {
        headings.push(match[1].trim());
        if (headings.length >= 6) break;
      }
    }

    // Extract social links
    const socialLinks: WebExtractionResult["socialLinks"] = {};
    const linkedinMatch = html.match(/https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[a-zA-Z0-9_-]+/i);
    if (linkedinMatch) socialLinks.linkedin = linkedinMatch[0];

    const igMatch = html.match(/https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+/i);
    if (igMatch) socialLinks.instagram = igMatch[0];

    const fbMatch = html.match(/https?:\/\/(?:www\.)?facebook\.com\/[a-zA-Z0-9_.]+/i);
    if (fbMatch) socialLinks.facebook = fbMatch[0];

    const twMatch = html.match(/https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[a-zA-Z0-9_]+/i);
    if (twMatch) socialLinks.twitter = twMatch[0];

    // Check for Calendly or Cal.com
    const hasCalendlyOrBooking = /calendly\.com|cal\.com|tidycal\.com|hubspot\.com\/meetings/i.test(html);

    // Check for contact email
    const emailMatch = html.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i) ||
                       html.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/i);
    const contactEmail = emailMatch ? emailMatch[1] : undefined;

    // Snippet text (clean out scripts and styles)
    const bodySnippet = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1500);

    return {
      url: cleanUrl,
      title,
      description,
      headings,
      socialLinks,
      hasCalendlyOrBooking,
      contactEmail,
      rawSnippet: bodySnippet,
    };
  } catch {
    return fallbackExtraction(cleanUrl);
  }
}

function fallbackExtraction(url: string): WebExtractionResult {
  const host = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return {
    url,
    title: host,
    description: "Business and digital presence",
    headings: [],
    socialLinks: {},
    hasCalendlyOrBooking: false,
    rawSnippet: `Domain ${host}`,
  };
}
