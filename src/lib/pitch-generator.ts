import { generateGeminiJson } from "./gemini";
import type { FounderPitchResult, PitchOfferType } from "./types";

interface PitchInput {
  founderName: string;
  companyName: string;
  role?: string;
  headline?: string;
  niche?: string;
  linkedinUrl?: string;
  offerType: PitchOfferType;
}

const PITCH_SYSTEM_PROMPT = `You write outbound pitches for LITERALS and LitEngine — founded by Vinayak Gautam.
LITERALS builds high-performing websites, AI agents, business automations, and sales funnels.
LitEngine is LITERALS' proprietary AI DM & social selling CRM that turns post comments and social messages into booked sales calls 24/7.

Voice guidelines (Vinayak Gautam):
- Founder-to-founder: direct, confident, human, curious, slightly challenging.
- NEVER use "I hope this email finds you well", "I came across your profile", "I was impressed by...", or robotic sales lines.
- Open with a specific observation about their business or role.
- Keep it tight: 2-3 short sentences. No corporate fluff.
- One clear, low-friction ask at the end.

PITCH TYPES:
- "crm": Pitches LitEngine — automating inbound DMs & post comments, stopping warm lead drop-off, booking appointments 24/7.
- "services": Pitches LITERALS services — custom AI agents, business workflow automations, high-performing websites, and revenue software.
- "hybrid": Combines both — full growth stack (custom web/funnel + AI social CRM closing clients in DMs).

Respond with JSON only:
{
  "linkedinConnectionNote": "under 280 characters, warm, direct, founder-to-founder",
  "linkedinDirectMessage": "short 2-3 sentence DM opening the conversation",
  "coldEmailSubject": "under 6 words, sentence case, no spam keywords",
  "coldEmailBody": "under 100 words, direct observation, value proposition, low friction CTA",
  "followUpMessage": "1-2 sentence polite bump 3 days later"
}`;

export async function generateFounderPitch(input: PitchInput): Promise<FounderPitchResult> {
  const role = input.role || "Founder";
  const company = input.companyName || "your company";
  const name = input.founderName || "there";

  const userPrompt = `
TARGET FOUNDER: ${name}
ROLE: ${role}
COMPANY: ${company}
HEADLINE / FOCUS: ${input.headline || input.niche || "Business growth"}
LINKEDIN: ${input.linkedinUrl || "N/A"}
OFFER TYPE REQUESTED: ${input.offerType.toUpperCase()}
`;

  const aiResult = await generateGeminiJson<{
    linkedinConnectionNote: string;
    linkedinDirectMessage: string;
    coldEmailSubject: string;
    coldEmailBody: string;
    followUpMessage: string;
  }>(PITCH_SYSTEM_PROMPT, userPrompt);

  if (aiResult) {
    return {
      offerType: input.offerType,
      founderName: name,
      companyName: company,
      role,
      headline: input.headline,
      linkedinUrl: input.linkedinUrl,
      ...aiResult,
    };
  }

  // High-converting deterministic fallback written strictly in Vinayak's voice
  return getFallbackPitch(input);
}

function getFallbackPitch(input: PitchInput): FounderPitchResult {
  const name = input.founderName?.split(" ")[0] || "there";
  const company = input.companyName || "your team";

  if (input.offerType === "crm") {
    return {
      offerType: "crm",
      founderName: input.founderName,
      companyName: input.companyName,
      role: input.role || "Founder",
      headline: input.headline,
      linkedinUrl: input.linkedinUrl,
      linkedinConnectionNote: `Hi ${name}, saw what you're building at ${company}. We built an AI CRM (LitEngine) that turns social post comments and DMs into booked sales calls on autopilot. Thought of you.`,
      linkedinDirectMessage: `Hi ${name}, quick question: how are you currently handling warm inbound interest on LinkedIn and Instagram? We built LitEngine to automatically triage DMs, qualify leads in your voice, and book them straight into your calendar 24/7. Mind if I share a 45-sec preview?`,
      coldEmailSubject: `Quick question about inbound DMs at ${company}`,
      coldEmailBody: `Hi ${name},\n\nNoticed ${company} is putting out strong content. Most founders lose 25-35% of warm inbound interest because manual DM replies are slow or slip through the cracks.\n\nWe built an AI social selling CRM (LitEngine) that reads incoming comments and DMs, qualifies prospects in your exact tone, and books qualified discovery calls into your calendar automatically.\n\nMade a quick 45-second preview of how it would look for ${company}—worth a 2-min look?\n\nBest,\nVinayak Gautam\nFounder, LITERALS · LitEngine`,
      followUpMessage: `Hey ${name}, bumping this quickly—did you get a chance to see my note about automating ${company}'s inbound social pipeline?`,
    };
  }

  if (input.offerType === "services") {
    return {
      offerType: "services",
      founderName: input.founderName,
      companyName: input.companyName,
      role: input.role || "Founder",
      headline: input.headline,
      linkedinUrl: input.linkedinUrl,
      linkedinConnectionNote: `Hi ${name}, love your focus at ${company}. At LITERALS, we engineer high-performing web platforms, AI agents, and business workflow automations for growing companies. Would love to connect.`,
      linkedinDirectMessage: `Hi ${name}, noticed the scaling trajectory at ${company}. We run LITERALS — building custom AI agents, automated workflow pipelines, and revenue-focused web apps that save teams 20+ hours a week and remove operational bottlenecks. Open to comparing notes on your current tech stack?`,
      coldEmailSubject: `Engineering leverage for ${company}`,
      coldEmailBody: `Hi ${name},\n\nSaw how ${company} is expanding. As teams scale, operational bottlenecks usually pop up around repetitive workflows, client onboarding, and disconnected tools.\n\nAt LITERALS, we engineer bespoke AI agents, custom workflow automations, and high-performance software designed to save hours of manual work and create direct leverage.\n\nOpen to a brief 10-minute exchange on what you're building this quarter?\n\nBest,\nVinayak Gautam\nFounder, LITERALS`,
      followUpMessage: `Hey ${name}, floating this back to the top—open to a quick founder-to-founder chat about ${company}'s software & automation roadmap?`,
    };
  }

  // Hybrid (CRM + Custom Studio Services)
  return {
    offerType: "hybrid",
    founderName: input.founderName,
    companyName: input.companyName,
    role: input.role || "Founder",
    headline: input.headline,
    linkedinUrl: input.linkedinUrl,
    linkedinConnectionNote: `Hi ${name}, saw your work at ${company}. We build full-stack growth systems — custom web platforms paired with an AI social CRM that turns DMs into clients. Would love to connect.`,
    linkedinDirectMessage: `Hi ${name}, noticed ${company}'s growth. We engineer end-to-end client acquisition engines for founders: bespoke high-converting web apps + our AI social CRM (LitEngine) that automatically qualifies inbound DMs and books appointments 24/7. Mind if I share a 1-page overview?`,
    coldEmailSubject: `Automated client acquisition for ${company}`,
    coldEmailBody: `Hi ${name},\n\nRan a quick look over ${company}'s digital setup. You've got great positioning, but most businesses lose significant revenue from friction between first social impression and booked call.\n\nWe build full-stack growth systems at LITERALS: high-performing web platforms paired with LitEngine, our AI social selling engine that turns comments and DMs into booked sales calls around the clock.\n\nPut together a short 1-page breakdown of where you could add immediate leverage—worth a 2-min look?\n\nBest,\nVinayak Gautam\nFounder, LITERALS · LitEngine`,
    followUpMessage: `Hey ${name}, just following up on this—happy to send over a 1-page breakdown of how we'd streamline ${company}'s inbound sales funnel if useful?`,
  };
}
