# Will Azure Bill Me? — Azure Free Tier Billing Calculator

**Live:** [sandeshl702.github.io/will-azure-bill-me](https://sandeshl702.github.io/will-azure-bill-me/)

Toggle what you plan to deploy. See what still bills after Stop — before the invoice hits.

Built for students and builders on **Azure free tier** who keep asking: *will Azure charge me?*

## Who this is for

- You spun up a VM / App Service / SQL and aren’t sure what’s free vs paid
- Free-tier docs list services, not the companions a wizard creates
- You need a fast **Azure billing calculator** without logging into Cost Management

## What it does

1. Pick resources you think you’re deploying
2. Engine expands **hidden companions** (VM → disk + public IP)
3. Verdict: free-tier meters vs always-on charges — including what bills after deallocate

No login. No subscription. Rules live in `data/rules.json`.

## How it works

```text
You toggle resources
        ↓
lib/engine.ts expands companions + free-tier rules
        ↓
Verdict: safe / will bill / bills even after Stop
```

Educational scenario graph — not official Microsoft Cost Management advice.

## Quickstart

```bash
git clone https://github.com/SandeshL702/will-azure-bill-me.git
cd will-azure-bill-me
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Static export for GitHub Pages:

```bash
npm run build
```

## Stack

Next.js · TypeScript · Tailwind CSS · static rules engine (`lib/engine.ts`)

## License

MIT · [Sandesh Lanjewar](https://github.com/SandeshL702)
