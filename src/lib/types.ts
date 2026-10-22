export interface FounderLead {
  id: string;
  name: string;
  companyName: string;
  website: string;
  role: string;
  email?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  location?: string;
  niche?: string;
}

export type PitchOfferType = "crm" | "services" | "hybrid";

export interface FounderPitchResult {
  offerType: PitchOfferType;
  founderName: string;
  companyName: string;
  role: string;
  headline?: string;
  linkedinUrl?: string;

  // Pitches crafted in Vinayak's founder voice
  linkedinConnectionNote: string; // Under 300 chars
  linkedinDirectMessage: string;  // Short & punchy
  coldEmailSubject: string;
  coldEmailBody: string;
  followUpMessage: string;
}

export interface LinkedInFounderResult {
  id: string;
  name: string;
  role: string;
  companyName: string;
  location: string;
  linkedinUrl: string;
  snippet: string;
  extractedKeywords: string[];
}

export interface BusinessAuditReport {
  id: string;
  companyName: string;
  website: string;
  founderName: string;
  founderRole: string;
  generatedAt: string;
  
  // Executive Overview
  overview: {
    niche: string;
    estimatedTeamSize: string;
    tradingStatus: string;
    primaryOffer: string;
    summary: string;
  };

  // Funnel & Lead Health
  funnelHealth: {
    socialChannelsFound: string[];
    hasLeadMagnet: boolean;
    hasBookingSystem: boolean;
    inboundResponseFriction: "High" | "Medium" | "Low";
    identifiedBottlenecks: string[];
  };

  // Revenue Leak & Opportunity
  commercialImpact: {
    estimatedMonthlyLeads: number;
    estimatedLeakedLeadPct: number;
    estimatedRecoverableRevenueMonthly: string;
    litengineSolution: string;
  };

  // Generated Outreach Hooks (Vinayak's founder-to-founder voice)
  outreachPitch: {
    emailSubject: string;
    emailBody: string;
    linkedinConnectionNote: string;
  };
}
