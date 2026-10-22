import { NextResponse } from "next/server";
import { generateFounderPitch } from "../../../lib/pitch-generator";
import type { PitchOfferType } from "../../../lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const founderName = String(body.founderName || "Founder").trim();
    const companyName = String(body.companyName || "Your Company").trim();
    const role = String(body.role || "Founder").trim();
    const headline = String(body.headline || "").trim();
    const linkedinUrl = String(body.linkedinUrl || "").trim();
    const offerType = (body.offerType as PitchOfferType) || "crm";

    const pitch = await generateFounderPitch({
      founderName,
      companyName,
      role,
      headline,
      linkedinUrl,
      offerType,
    });

    return NextResponse.json({
      ok: true,
      pitch,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Pitch generation failed" },
      { status: 500 }
    );
  }
}
