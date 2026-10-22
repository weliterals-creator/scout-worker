# LitEngine Scout & Business Auditor (Research Worker)

A dedicated, isolated microservice for finding target founders/agencies, auditing their inbound sales funnels, and generating high-converting 1-page business reports.

## Deploying to Your New Vercel Account (2 Minutes)

1. **Log in to your NEW Vercel Account**.
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository: `weliterals-creator/Lit-engin`.
4. In the Project Configuration:
   - **Root Directory**: Click *Edit* and select **`scout-worker`**.
   - **Framework Preset**: *Next.js* (auto-detected).
5. Add Environment Variables:
   - `GEMINI_API_KEY`: Your Gemini API key (for AI business audits and pitch generation).
   - `NEXT_PUBLIC_APP_URL`: Your deployed Vercel URL (e.g. `https://litengine-scout.vercel.app`).
   - *(Optional)* `DATABASE_URL`: Your Neon Postgres connection string if you want reports stored in Neon.
6. Click **Deploy**.

## What This Does:
- Runs completely isolated on its own free Vercel plan without touching your main `litengine.in` account resources.
- Searches target founders & agencies by niche/location or direct URL.
- Generates 1-page public audit reports at `/report/[id]`.
- Generates outbound email & LinkedIn hooks written in Vinayak's authentic founder voice.
