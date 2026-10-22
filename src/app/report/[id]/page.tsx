import { notFound } from "next/navigation";
import { getAuditReport } from "../../../lib/store";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getAuditReport(id);

  if (!report) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#27272a] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              CONFIDENTIAL INBOUND AUDIT
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {report.companyName}
            </h1>
            <p className="text-xs md:text-sm text-[#a1a1aa] mt-1 flex items-center gap-2">
              <span>Prepared for {report.founderName}</span>
              <span>·</span>
              <a
                href={report.website}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                {report.website} <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://litengine.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors shadow-lg"
            >
              Automate Inbound DMs <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#27272a] bg-[#121215] p-5 shadow-xs">
            <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider block">
              Inbound Drop-off Risk
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-red-400">
                {report.commercialImpact.estimatedLeakedLeadPct}%
              </span>
              <span className="text-xs text-[#a1a1aa]">of warm inquiries</span>
            </div>
            <p className="mt-2 text-xs text-[#a1a1aa]">
              Loss occurs between initial social comment/DM and discovery call booking.
            </p>
          </div>

          <div className="rounded-xl border border-[#27272a] bg-[#121215] p-5 shadow-xs">
            <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider block">
              Est. Monthly Opportunity
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">
                {report.commercialImpact.estimatedRecoverableRevenueMonthly}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#a1a1aa]">
              Recoverable pipeline from 24/7 automated inbound qualification.
            </p>
          </div>

          <div className="rounded-xl border border-[#27272a] bg-[#121215] p-5 shadow-xs">
            <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider block">
              Response Friction Rating
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-black ${
                report.funnelHealth.inboundResponseFriction === "High" ? "text-red-400" : "text-amber-400"
              }`}>
                {report.funnelHealth.inboundResponseFriction}
              </span>
              <span className="text-xs text-[#a1a1aa]">turnaround lag</span>
            </div>
            <p className="mt-2 text-xs text-[#a1a1aa]">
              Manual contact forms delay replies, lowering conversion by up to 391%.
            </p>
          </div>
        </div>

        {/* Section 1: Executive Findings */}
        <div className="rounded-xl border border-[#27272a] bg-[#121215] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Executive Snapshot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-[#a1a1aa] block text-[11px] uppercase">Identified Market Position</span>
              <span className="text-white font-semibold mt-1 block">{report.overview.niche}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#27272a]">
              <span className="text-[#a1a1aa] block text-[11px] uppercase">Estimated Operational Size</span>
              <span className="text-white font-semibold mt-1 block">{report.overview.estimatedTeamSize}</span>
            </div>
          </div>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            {report.overview.summary}
          </p>
        </div>

        {/* Section 2: Identified Inbound Bottlenecks */}
        <div className="rounded-xl border border-[#27272a] bg-[#121215] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            Detected Conversion Leaks
          </h2>
          <div className="space-y-2.5">
            {report.funnelHealth.identifiedBottlenecks.map((bottleneck: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-xs text-[#fafafa]"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{bottleneck}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: The LitEngine Solution */}
        <div className="rounded-xl border border-amber-500/30 bg-linear-to-b from-[#18181b] to-amber-950/20 p-6 space-y-4">
          <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            The Recommended Fix
          </h2>
          <p className="text-xs text-[#fafafa] leading-relaxed">
            {report.commercialImpact.litengineSolution}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#27272a]">
            <div>
              <span className="text-[11px] text-[#a1a1aa] block">Audited by Vinayak Gautam</span>
              <span className="text-xs font-semibold text-white">Founder, LITERALS · LitEngine</span>
            </div>
            <a
              href="mailto:vinayak@litengine.in"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Connect with Vinayak
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
