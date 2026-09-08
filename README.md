# Will Azure Bill Me?

Live: https://sandeshl702.github.io/will-azure-bill-me/

You pick what you *think* you are deploying. The engine adds Azure companions (VM \u2192 disk + public IP) and tells you what still bills after Stop.

No login. No subscription. Static rules in `data/rules.json`.

## Why this exists

Free-tier pages list services. They do not show the extra resources a wizard creates, or that a deallocated VM still has a disk and a public IP.

This is an educational scenario graph, not Cost Management and not official Microsoft advice.

## Stack

Next.js static export, TypeScript, Tailwind. `lib/engine.ts` expands companions and builds the verdict.

## Resume line

Built a live Azure billing-scenario engine: resource dependency graph, hidden companions, and free-tier vs always-on meters — no login required.
