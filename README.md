## Live

https://sandeshl702.github.io/will-azure-bill-me/

# Will Azure Bill Me?

A tiny, no-backend checklist for spotting Azure free-tier surprises before they become a Cost Management notification.

**Repository:** https://github.com/SandeshL702/will-azure-bill-me

## What it does

- 17 common Azure resources and free-tier billing traps, grouped as **Free**, **Careful**, or **Will bill**.
- Toggle resources you are using to get a live verdict and risk counts.
- Share a result with `navigator.share` on supported devices, or copy a URL containing the selected resources.
- Responsive dark UI built around Azure blue, with no account, analytics, database, or API.
## Run locally
Install dependencies, then run the development server from the project root.
## Notes on the checklist
Free-tier eligibility and allowances vary by subscription type, region, offer, account age, and time. A Free label means a published allowance may apply, not that the service is unlimited or free forever. Check Azure pricing and Cost Management before deploying.
This is an educational tool and not official Microsoft advice.
## Stack
Next.js App Router, TypeScript, Tailwind CSS, and React. All state is client-side and encoded in the URL hash for sharing.
## Credits
Built by Sandesh: https://github.com/SandeshL702
