"use client";

import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Building2,
  Send,
  Zap,
  Linkedin,
  Filter,
  CheckCircle2,
  Share2,
} from "lucide-react";
import type {
  FounderLead,
  BusinessAuditReport,
  LinkedInFounderResult,
  FounderPitchResult,
  PitchOfferType,
} from "../lib/types";

export default function ScoutDashboard() {
  const [activeTab, setActiveTab] = useState<"linkedin" | "audit">("linkedin");

  // --- Google LinkedIn X-Ray State ---
  const [niche, setNiche] = useState("performance marketing agency");
  const [role, setRole] = useState("Founder OR CEO");
  const [location, setLocation] = useState("London, UK");
  const [company, setCompany] = useState("");
  const [googleUrl, setGoogleUrl] = useState(
    'https://www.google.com/search?q=site:linkedin.com/in/+(Founder+OR+CEO)+"performance+marketing+agency"+"London,+UK"'
  );
  const [rawGoogleQuery, setRawGoogleQuery] = useState(
    'site:linkedin.com/in/ (Founder OR CEO) "performance marketing agency" "London, UK"'
  );
  const [searchingLi, setSearchingLi] = useState(false);
  const [founderResults, setFounderResults] = useState<LinkedInFounderResult[]>([]);
  const [pastedText, setPastedText] = useState("");

  // Pitch Generation State
  const [selectedOffer, setSelectedOffer] = useState<PitchOfferType>("crm");
  const [generatingPitch, setGeneratingPitch] = useState(false);
  const [activePitch, setActivePitch] = useState<FounderPitchResult | null>(null);

  // --- Direct Audit State ---
  const [directUrl, setDirectUrl] = useState("");
  const [directCompany, setDirectCompany] = useState("");
  const [directFounder, setDirectFounder] = useState("");
  const [auditing, setAuditing] = useState(false);
  const [activeReport, setActiveReport] = useState<BusinessAuditReport | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Build Google X-Ray Search Query
  const handleBuildGoogleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchingLi(true);
    setError(null);
    try {
      const res = await fetch("/api/linkedin-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", niche, role, location, company }),
      });
      const data = await res.json();
      if (data.ok) {
        setGoogleUrl(data.googleSearchUrl);
        setRawGoogleQuery(data.query);
        setFounderResults(data.leads || []);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSearchingLi(false);
    }
  };

  // Parse pasted snippets
  const handleParsePasted = async () => {
    if (!pastedText.trim()) return;
    setSearchingLi(true);
    setError(null);
    try {
      const res = await fetch("/api/linkedin-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "parse-pasted", text: pastedText }),
      });
      const data = await res.json();
      if (data.ok) {
        setFounderResults(data.leads || []);
      } else {
        setError(data.error || "Parsing failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSearchingLi(false);
    }
  };

  // Generate Pitch for a Founder
  const generatePitchFor = async (
    targetName: string,
    targetCompany: string,
    targetRole: string,
    targetLinkedin?: string,
    targetHeadline?: string
  ) => {
    setGeneratingPitch(true);
    setError(null);
    try {
      const res = await fetch("/api/pitch-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          founderName: targetName,
          companyName: targetCompany,
          role: targetRole,
          linkedinUrl: targetLinkedin,
          headline: targetHeadline,
          offerType: selectedOffer,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setActivePitch(data.pitch);
      } else {
        setError(data.error || "Pitch generation failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setGeneratingPitch(false);
    }
  };

  // Direct Website Audit
  const runAudit = async (lead: { companyName: string; website: string; founderName?: string }) => {
    setAuditing(true);
    setError(null);
    setActiveReport(null);
    setReportUrl(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const data = await res.json();
      if (data.ok) {
        setActiveReport(data.report);
        setReportUrl(data.reportUrl);
      } else {
        setError(data.error || "Audit failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setAuditing(false);
    }
  };

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#27272a] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              LITERALS · OUTBOUND RESEARCH WORKER
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Founder Scout &amp; Pitch Generator
            </h1>
            <p className="text-xs md:text-sm text-[#a1a1aa] mt-1">
              Search LinkedIn founder profiles via Google, and pitch LitEngine CRM &amp; LITERALS studio services.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-md bg-[#18181b] border border-[#27272a] text-zinc-300">
              ⚡ Isolated Cloud Worker
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#27272a] pb-3">
          <button
            onClick={() => setActiveTab("linkedin")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "linkedin"
                ? "bg-amber-500 text-black shadow-md"
                : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-white"
            }`}
          >
            <Linkedin className="w-4 h-4" />
            Google LinkedIn X-Ray Hunter
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "audit"
                ? "bg-amber-500 text-black shadow-md"
                : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Website Funnel &amp; Business Audit
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: GOOGLE LINKEDIN X-RAY HUNTER                           */}
        {/* ============================================================== */}
        {activeTab === "linkedin" && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Search Builder Card */}
            <div className="rounded-xl border border-[#27272a] bg-[#121215] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-400" />
                  Target Founder Parameters
                </h2>
                <span className="text-[11px] text-[#71717a]">
                  Bypasses LinkedIn search limits via Google X-Ray
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#a1a1aa] block mb-1">
                    Industry / Niche
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g. performance marketing agency"
                    className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-xs text-white placeholder-[#71717a] focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#a1a1aa] block mb-1">
                    Founder Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Founder OR CEO"
                    className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-xs text-white placeholder-[#71717a] focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#a1a1aa] block mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. London, UK"
                    className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-xs text-white placeholder-[#71717a] focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Generated Query Box */}
              <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="flex-1 font-mono text-[11px] text-amber-300/90 break-all">
                  <span className="text-[#a1a1aa] font-sans">Google Dork: </span>
                  {rawGoogleQuery}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyText("dork", rawGoogleQuery)}
                    className="px-2.5 py-1.5 rounded-md bg-[#27272a] hover:bg-[#3f3f46] text-white text-[11px] font-semibold flex items-center gap-1"
                  >
                    {copied === "dork" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy Query
                  </button>
                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold flex items-center gap-1 shadow-sm"
                  >
                    Search on Google <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#a1a1aa] text-[11px]">Popular Presets:</span>
                <button
                  onClick={() => {
                    setNiche("performance marketing agency");
                    setLocation("London, UK");
                    handleBuildGoogleSearch();
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-[#d4d4d8] hover:border-amber-500 text-[11px]"
                >
                  UK Marketing Agencies
                </button>
                <button
                  onClick={() => {
                    setNiche("executive coach OR business consultant");
                    setLocation("United Kingdom");
                    handleBuildGoogleSearch();
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-[#d4d4d8] hover:border-amber-500 text-[11px]"
                >
                  High-Ticket Coaches
                </button>
                <button
                  onClick={() => {
                    setNiche("shopify OR ecommerce brand");
                    setLocation("United Kingdom");
                    handleBuildGoogleSearch();
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-[#d4d4d8] hover:border-amber-500 text-[11px]"
                >
                  E-Commerce Brands
                </button>
              </div>
            </div>

            {/* Quick Paste or Parse Google Results */}
            <div className="rounded-xl border border-[#27272a] bg-[#121215] p-5 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
                <Copy className="w-4 h-4 text-amber-400" />
                Quick Paste Google Search Snippets or LinkedIn URLs
              </h2>
              <p className="text-[11px] text-[#71717a]">
                Copy text from your Google search results page or paste LinkedIn profile URLs here:
              </p>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste Google search snippet or LinkedIn URLs (e.g. https://www.linkedin.com/in/john-doe)..."
                  className="flex-1 rounded-lg border border-[#27272a] bg-[#18181b] p-2.5 text-xs text-white placeholder-[#71717a] focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={handleParsePasted}
                  disabled={searchingLi || !pastedText.trim()}
                  className="px-4 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold shrink-0 disabled:opacity-50"
                >
                  Extract Leads
                </button>
              </div>
            </div>

            {/* Offer Type Selection & Founder Leads */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  Target Founders Ready to Pitch ({founderResults.length})
                </h3>

                {/* Offer Selector */}
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#18181b] border border-[#27272a] text-xs">
                  <span className="text-[11px] text-[#a1a1aa] px-2 font-semibold">Pitch Offer:</span>
                  <button
                    onClick={() => setSelectedOffer("crm")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      selectedOffer === "crm" ? "bg-amber-500 text-black shadow-xs" : "text-[#a1a1aa] hover:text-white"
                    }`}
                  >
                    LitEngine CRM
                  </button>
                  <button
                    onClick={() => setSelectedOffer("services")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      selectedOffer === "services" ? "bg-amber-500 text-black shadow-xs" : "text-[#a1a1aa] hover:text-white"
                    }`}
                  >
                    LITERALS Services
                  </button>
                  <button
                    onClick={() => setSelectedOffer("hybrid")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      selectedOffer === "hybrid" ? "bg-amber-500 text-black shadow-xs" : "text-[#a1a1aa] hover:text-white"
                    }`}
                  >
                    Hybrid Stack
                  </button>
                </div>
              </div>

              {/* Founder Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {founderResults.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-xl border border-[#27272a] bg-[#121215] space-y-3 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          {lead.name}
                          <a
                            href={lead.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="text-xs text-amber-400/90 font-medium mt-0.5">
                          {lead.role} · {lead.companyName}
                        </div>
                        <div className="text-[11px] text-[#a1a1aa]">{lead.location}</div>
                      </div>

                      <button
                        onClick={() =>
                          generatePitchFor(
                            lead.name,
                            lead.companyName,
                            lead.role,
                            lead.linkedinUrl,
                            lead.snippet
                          )
                        }
                        disabled={generatingPitch}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors shrink-0"
                      >
                        Generate Pitch
                      </button>
                    </div>

                    <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
                      {lead.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Pitch Preview Box */}
            {activePitch && (
              <div className="rounded-xl border border-amber-500/40 bg-[#121215] p-6 space-y-5 shadow-xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27272a] gap-2">
                  <div>
                    <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Generated Pitch for {activePitch.founderName} ({activePitch.companyName})
                    </h4>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">
                      Target Offer: <span className="text-amber-400 uppercase font-semibold">{activePitch.offerType}</span> · Voice: Vinayak Gautam (Founder-to-Founder)
                    </p>
                  </div>
                </div>

                {/* LinkedIn Connection Request Note */}
                <div className="rounded-lg border border-[#27272a] bg-[#18181b] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn Connection Request Note (under 300 chars)
                    </span>
                    <button
                      onClick={() => copyText("li-note", activePitch.linkedinConnectionNote)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white"
                    >
                      {copied === "li-note" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === "li-note" ? "Copied!" : "Copy Note"}
                    </button>
                  </div>
                  <p className="text-xs text-white leading-relaxed bg-[#121215] p-3 rounded-md border border-[#27272a]">
                    {activePitch.linkedinConnectionNote}
                  </p>
                </div>

                {/* Cold Email Pitch */}
                <div className="rounded-lg border border-[#27272a] bg-[#18181b] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" />
                      Personalized Cold Email Pitch
                    </span>
                    <button
                      onClick={() =>
                        copyText(
                          "email",
                          `Subject: ${activePitch.coldEmailSubject}\n\n${activePitch.coldEmailBody}`
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white"
                    >
                      {copied === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === "email" ? "Copied!" : "Copy Email"}
                    </button>
                  </div>
                  <div className="text-xs space-y-2">
                    <div className="p-2.5 rounded-md bg-[#121215] border border-[#27272a]">
                      <span className="text-[#a1a1aa]">Subject: </span>
                      <span className="font-semibold text-white">{activePitch.coldEmailSubject}</span>
                    </div>
                    <div className="p-3 rounded-md bg-[#121215] border border-[#27272a] whitespace-pre-wrap text-zinc-200 leading-relaxed">
                      {activePitch.coldEmailBody}
                    </div>
                  </div>
                </div>

                {/* LinkedIn DM Follow-up */}
                <div className="rounded-lg border border-[#27272a] bg-[#18181b] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Follow-up / InMail (3 Days Later)
                    </span>
                    <button
                      onClick={() => copyText("followup", activePitch.followUpMessage)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white"
                    >
                      {copied === "followup" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === "followup" ? "Copied" : "Copy Follow-up"}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-[#121215] p-3 rounded-md border border-[#27272a]">
                    {activePitch.followUpMessage}
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WEBSITE FUNNEL & BUSINESS AUDIT                         */}
        {/* ============================================================== */}
        {activeTab === "audit" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="rounded-xl border border-[#27272a] bg-[#121215] p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Target Business URL &amp; Founder
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  placeholder="Website: https://exampleagency.com"
                  className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:border-amber-400 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={directCompany}
                    onChange={(e) => setDirectCompany(e.target.value)}
                    placeholder="Company Name (e.g. Apex Media)"
                    className="rounded-lg border border-[#27272a] bg-[#18181b] px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={directFounder}
                    onChange={(e) => setDirectFounder(e.target.value)}
                    placeholder="Founder Name (e.g. David)"
                    className="rounded-lg border border-[#27272a] bg-[#18181b] px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() =>
                    runAudit({
                      website: directUrl,
                      companyName: directCompany || directUrl.replace(/https?:\/\//, "").replace(/\/.*$/, ""),
                      founderName: directFounder || "Founder",
                    })
                  }
                  disabled={auditing || !directUrl.trim()}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-amber-400 disabled:opacity-50"
                >
                  {auditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Run Business Audit & Generate Report"}
                </button>
              </div>
            </div>

            {/* Live Audit Report */}
            {activeReport && (
              <div className="rounded-xl border border-amber-500/30 bg-[#121215] p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27272a] gap-2">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Audit for {activeReport.companyName}
                    </h3>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">
                      Niche: {activeReport.overview.niche} · Team: {activeReport.overview.estimatedTeamSize}
                    </p>
                  </div>

                  {reportUrl && (
                    <a
                      href={reportUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                    >
                      View Public 1-Page Report <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#27272a]">
                    <span className="text-[11px] text-[#a1a1aa] uppercase font-semibold block">Inbound Drop-off</span>
                    <span className="text-2xl font-black text-red-400 mt-1 block">
                      {activeReport.commercialImpact.estimatedLeakedLeadPct}%
                    </span>
                    <span className="text-[11px] text-[#a1a1aa]">Warm leads lost</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#27272a]">
                    <span className="text-[11px] text-[#a1a1aa] uppercase font-semibold block">Recoverable Revenue</span>
                    <span className="text-2xl font-black text-amber-400 mt-1 block">
                      {activeReport.commercialImpact.estimatedRecoverableRevenueMonthly}
                    </span>
                    <span className="text-[11px] text-[#a1a1aa]">Estimated monthly pipeline</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#27272a]">
                    <span className="text-[11px] text-[#a1a1aa] uppercase font-semibold block">Turnaround Friction</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {activeReport.funnelHealth.inboundResponseFriction}
                    </span>
                    <span className="text-[11px] text-[#a1a1aa]">Manual form lag</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
