import { generateGeminiJson } from "./gemini";
import type { BusinessAuditReport } from "./types";
import type { WebExtractionResult } from "./web-scraper";

const AUDIT_SYSTEM_PROMPT = `You are the lead technical auditor and growth strategist for LITERALS — an elite studio founded by Vinayak Gautam that builds high-performing websites, AI agents, business automations, and sales CRM workflows (LitEngine).

Your job is to analyze a target business from their public website/signals and produce a sharp, credible "Business & Inbound Sales Health Report".

Rules:
1. Be realistic, sharp, and founder-to-founder. No fluff, no generic corporate compliments, no buzzwords.
2. Specifically evaluate how they handle inbound demand: Do they drive people to generic contact forms? Are they missing automated DM capture for their social traffic?
3. Calculate an estimated recoverable revenue figure (e.g. "£3,500/mo" or "$5,000/mo") based on their niche and likely lost lead volume.
4. For the outreach pitch, write strictly in Vinayak Gautam's authentic founder voice:
   - Direct, confident, human, curious.
   - Never use "I hope this email finds you well", "I came across your profile", or robotic sales lines.
   - Start from a specific observation about their setup.
   - Keep it 2 to 3 short sentences.
   - Mention the attached/linked 1-page audit report as the value deliverable.

Output JSON matching this exact structure:
{
  "overview": {
    "niche": "e.g. Boutique Performance Marketing Agency",
    "estimatedTeamSize": "e.g. 5-15 team members",
    "tradingStatus": "e.g. Established & Actively Scaling",
    "primaryOffer": "Summary of their core service or product",
    "summary": "2-sentence executive summary of what this business does and how they position themselves"
  },
  "funnelHealth": {
    "socialChannelsFound": ["LinkedIn", "Instagram"],
    "hasLeadMagnet": true,
    "hasBookingSystem": false,
    "inboundResponseFriction": "High",
    "identifiedBottlenecks": [
      "No automated qualification on inbound social inquiries",
      "Manual contact form creates drop-off before booking a discovery call",
      "No instant DM capture for social campaign traffic"
    ]
  },
  "commercialImpact": {
    "estimatedMonthlyLeads": 40,
    "estimatedLeakedLeadPct": 35,
    "estimatedRecoverableRevenueMonthly": "£4,200/mo",
    "litengineSolution": "Deploy LitEngine AI social selling engine to capture, qualify, and book inbound DM/comment leads in under 60 seconds."
  },
  "outreachPitch": {
    "emailSubject": "Quick inbound audit for [Company Name]",
    "emailBody": "Hi [Name], put together a 1-page audit of [Company]'s inbound sales funnel. You've got strong traffic, but without instant DM qualification, our numbers estimate ~30% of warm inbound leads are leaking through. Made a breakdown showing how to capture them on autopilot: [Report Link]. Worth a 3-min look?",
    "linkedinConnectionNote": "Hi [Name], put together a quick 1-page inbound sales audit for [Company]—found where ~30% of warm social leads might be dropping off. Would love to send the link over."
  }
}`;

export async function generateBusinessAudit(
  companyName: string,
  website: string,
  founderName: string = "Founder",
  signals: WebExtractionResult
): Promise<BusinessAuditReport> {
  const id = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const userPrompt = `
COMPANY: ${companyName}
WEBSITE: ${website}
FOUNDER NAME: ${founderName}
TITLE: ${signals.title}
DESCRIPTION: ${signals.description}
HEADINGS: ${signals.headings.join(" | ")}
SOCIAL CHANNELS: ${Object.keys(signals.socialLinks).join(", ") || "None clearly visible"}
HAS DIRECT CALENDAR BOOKING: ${signals.hasCalendlyOrBooking ? "Yes" : "No"}
CONTENT SNIPPET: ${signals.rawSnippet}
`;

  const aiResult = await generateGeminiJson<Omit<BusinessAuditReport, "id" | "companyName" | "website" | "founderName" | "founderRole" | "generatedAt">>(
    AUDIT_SYSTEM_PROMPT,
    userPrompt
  );

  if (aiResult) {
    return {
      id,
      companyName,
      website: signals.url,
      founderName,
      founderRole: "Founder / Managing Director",
      generatedAt: new Date().toISOString(),
      ...aiResult,
    };
  }

  // Fallback report if Gemini key isn't provided or rate-limited
  return {
    id,
    companyName,
    website: signals.url,
    founderName,
    founderRole: "Founder / Managing Director",
    generatedAt: new Date().toISOString(),
    overview: {
      niche: "Digital & Professional Services",
      estimatedTeamSize: "5-20 team members",
      tradingStatus: "Active",
      primaryOffer: signals.description || "Digital solutions & client services",
      summary: `${companyName} is an active business operating online at ${signals.url}.`,
    },
    funnelHealth: {
      socialChannelsFound: Object.keys(signals.socialLinks),
      hasLeadMagnet: false,
      hasBookingSystem: signals.hasCalendlyOrBooking,
      inboundResponseFriction: signals.hasCalendlyOrBooking ? "Medium" : "High",
      identifiedBottlenecks: [
        "Inbound interest relies on manual contact forms with slow turnaround",
        "Social media visitors have no instant automated qualification",
        "Lead loss estimated at 25-35% between first impression and booked discovery call",
      ],
    },
    commercialImpact: {
      estimatedMonthlyLeads: 35,
      estimatedLeakedLeadPct: 30,
      estimatedRecoverableRevenueMonthly: "£3,500/mo",
      litengineSolution: "Automate inbound DM capture and calendar bookings 24/7 with LitEngine.",
    },
    outreachPitch: {
      emailSubject: `Inbound sales audit for ${companyName}`,
      emailBody: `Hi ${founderName}, put together a 1-page audit of ${companyName}'s inbound sales funnel. You've got solid positioning, but our numbers estimate ~30% of warm inbound inquiries are slipping through manual forms. Put together a 1-page breakdown: [Report Link]. Worth a 3-min look?`,
      linkedinConnectionNote: `Hi ${founderName}, ran a quick 1-page inbound sales audit for ${companyName}. Found where warm inbound leads might be leaking. Would love to send the link over.`,
    },
  };
}
