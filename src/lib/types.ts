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
