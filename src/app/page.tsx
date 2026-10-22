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
} from "lucide-react";
import type { FounderLead, BusinessAuditReport } from "../lib/types";

export default function ScoutDashboard() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [leads, setLeads] = useState<FounderLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<FounderLead | null>(null);

  // Manual direct URL input
  const [directUrl, setDirectUrl] = useState("");
  const [directCompany, setDirectCompany] = useState("");
  const [directFounder, setDirectFounder] = useState("");

  const [auditing, setAuditing] = useState(false);
  const [activeReport, setActiveReport] = useState<BusinessAuditReport | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.ok) {
        setLeads(data.leads || []);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSearching(false);
    }
  };

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
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#27272a] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              LITENGINE OUTBOUND SCOUT
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Founder Scout & Business Auditor
            </h1>
            <p className="text-xs md:text-sm text-[#a1a1aa] mt-1">
              Search target agencies & founders, audit their inbound sales funnels, and generate high-converting value-first pitches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-md bg-[#18181b] border border-[#27272a] text-zinc-300">
              ⚡ Isolated Research Worker
            </span>
          </div>
        </div>

        {/* Search & URL Input Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Box 1: Search by Niche */}
          <div className="rounded-xl border border-[#27272a] bg-[#121215] p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              Search Target Founders by Niche
            </h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Performance Marketing Agency London"
                className="flex-1 rounded-lg border border-[#27272a] bg-[#18181b] px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={searching}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-amber-400 disabled:opacity-50"
              >
                {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Search"}
              </button>
            </form>

            {leads.length > 0 && (
              <div className="space-y-2 mt-4 max-h-60 overflow-y-auto pr-1">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      runAudit({ companyName: lead.companyName, website: lead.website, founderName: lead.name });
                    }}
                    className="p-3 rounded-lg border border-[#27272a] bg-[#18181b] hover:border-amber-500/50 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {lead.name}
                        <span className="text-[11px] text-[#a1a1aa] font-normal">({lead.companyName})</span>
                      </div>
                      <div className="text-[11px] text-[#a1a1aa] mt-0.5">{lead.niche || lead.role}</div>
                    </div>
                    <button className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                      Audit <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Box 2: Direct Website Audit */}
          <div className="rounded-xl border border-[#27272a] bg-[#121215] p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Direct Target Company Audit
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
                {auditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Run Business Audit & Generate Pitch"}
              </button>
            </div>
          </div>

        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Audit Report & Generated Pitch */}
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

            {/* The Generated Outreach Pitch (Vinayak's Voice) */}
            <div className="rounded-lg border border-[#27272a] bg-[#18181b] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  Personalized Outbound Email (Vinayak's Founder Voice)
                </span>
                <button
                  onClick={() =>
                    copyText(
                      "email",
                      `Subject: ${activeReport.outreachPitch.emailSubject}\n\n${activeReport.outreachPitch.emailBody}`
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white"
                >
                  {copied === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === "email" ? "Copied!" : "Copy Email"}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-md bg-[#121215] border border-[#27272a]">
                  <span className="text-[#a1a1aa]">Subject: </span>
                  <span className="font-semibold text-white">{activeReport.outreachPitch.emailSubject}</span>
                </div>
                <div className="p-3 rounded-md bg-[#121215] border border-[#27272a] whitespace-pre-wrap text-zinc-200 leading-relaxed">
                  {activeReport.outreachPitch.emailBody.replace(
                    "[Report Link]",
                    reportUrl || "https://litengine.in/audit"
                  )}
                </div>
              </div>

              {/* LinkedIn Note */}
              <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
                <div className="text-xs text-[#a1a1aa]">
                  <span className="font-semibold text-white">LinkedIn Connection Note: </span>
                  {activeReport.outreachPitch.linkedinConnectionNote}
                </div>
                <button
                  onClick={() => copyText("li", activeReport.outreachPitch.linkedinConnectionNote)}
                  className="shrink-0 ml-4 inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white"
                >
                  {copied === "li" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === "li" ? "Copied" : "Copy Note"}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
