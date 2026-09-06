"use client";

import { useEffect, useMemo, useState } from "react";

type Risk = "free" | "careful" | "bill";
type Trap = { id: string; title: string; detail: string; risk: Risk; badge: string };

const traps: Trap[] = [
  { id: "static", title: "Static Web Apps · Free plan", detail: "Static hosting on the Free plan, within its limits.", risk: "free", badge: "Free" },
  { id: "functions", title: "Azure Functions · Consumption", detail: "Inside the monthly 1M requests / 400k GB-s grant.", risk: "free", badge: "Free*" },
  { id: "app-service", title: "App Service · F1 Free", detail: "One small app on the shared F1 free tier.", risk: "free", badge: "Free*" },
  { id: "blob", title: "Blob Storage · 5 GB", detail: "Standard LRS and operations within the free grant.", risk: "free", badge: "Free*" },
  { id: "sql", title: "Azure SQL Database", detail: "Eligible free offer: one database, 12 months and limits.", risk: "careful", badge: "Careful" },
  { id: "cosmos", title: "Cosmos DB · free tier", detail: "First 1,000 RU/s and 25 GB can be free; extra is not.", risk: "careful", badge: "Careful" },
  { id: "containers", title: "Container Apps · consumption", detail: "Free grants apply, but replicas and usage climb fast.", risk: "careful", badge: "Careful" },
  { id: "logs", title: "Log Analytics / App Insights", detail: "Free ingestion is limited; verbose logs add up.", risk: "careful", badge: "Careful" },
  { id: "egress", title: "Internet bandwidth / egress", detail: "Outbound data above the allowance is metered.", risk: "careful", badge: "Careful" },
  { id: "public-ip", title: "Public IP address", detail: "Standard and some unattached IPs have hourly charges.", risk: "bill", badge: "Will bill" },
  { id: "disks", title: "Managed disks & snapshots", detail: "They keep charging after a VM stops; snapshots count too.", risk: "bill", badge: "Will bill" },
  { id: "acr", title: "Container Registry", detail: "Storage and transfer are billed outside limited grants.", risk: "bill", badge: "Will bill" },
  { id: "nat", title: "NAT Gateway", detail: "Hourly gateway and processed-data charges start immediately.", risk: "bill", badge: "Will bill" },
  { id: "vpn", title: "VPN Gateway", detail: "A provisioned gateway is billed hourly, even when quiet.", risk: "bill", badge: "Will bill" },
  { id: "app-gateway", title: "Application Gateway", detail: "Capacity units and data processing are chargeable.", risk: "bill", badge: "Will bill" },
  { id: "firewall", title: "Azure Firewall", detail: "Deployment and data processed are billed by hour and volume.", risk: "bill", badge: "Will bill" },
  { id: "marketplace", title: "Marketplace images / add-ons", detail: "Third-party licenses charge separately from compute.", risk: "bill", badge: "Will bill" },
];

const styles: Record<Risk, { text: string; bg: string }> = {
  free: { text: "text-[#7ee787]", bg: "bg-[#3fb950]/10" },
  careful: { text: "text-[#e3b341]", bg: "bg-[#d29922]/10" },
  bill: { text: "text-[#ff7b72]", bg: "bg-[#f85149]/10" },
};

function Icon({ name }: { name: "check" | "arrow" | "share" | "spark" }) {
  if (name === "check") return <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="m3 8 3 3 7-7" /></svg>;
  if (name === "arrow") return <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M3 8h9M9 4l4 4-4 4" /></svg>;
  if (name === "share") return <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current"><circle cx="12.5" cy="3.5" r="1.5"/><circle cx="3.5" cy="8" r="1.5"/><circle cx="12.5" cy="12.5" r="1.5"/><path d="m4.8 7.3 6.4-3M4.8 8.7l6.4 3"/></svg>;
  return <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current"><path d="m8 1 1.3 4.7L14 7l-4.7 1.3L8 13l-1.3-4.7L2 7l4.7-1.3L8 1Zm4-1 .4 1.6L14 2l-1.6.4L12 4l-.4-1.6L10 2l1.6-.4L12 0Z"/></svg>;
}

export default function Home() {
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return window.location.hash.slice(1).split(",").filter((id) => traps.some((trap) => trap.id === id));
  });
  const [shared, setShared] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") window.history.replaceState(null, "", `${window.location.pathname}${selected.length ? `#${selected.join(",")}` : ""}`);
  }, [selected]);
  const counts = useMemo(() => selected.reduce((out, id) => { const risk = traps.find((trap) => trap.id === id)?.risk; if (risk) out[risk]++; return out; }, { free: 0, careful: 0, bill: 0 }), [selected]);
  const verdict = counts.bill ? { title: "Yes, this can bill you.", body: "At least one pick has a charge outside the free tier.", color: "text-[#ff7b72]", icon: "!" } : counts.careful ? { title: "Probably free — stay sharp.", body: "Your picks have free allowances, but limits apply.", color: "text-[#e3b341]", icon: "~" } : { title: "Looking good.", body: "Nothing selected here is a guaranteed charge. Watch the limits.", color: "text-[#7ee787]", icon: "✓" };
  function toggle(id: string) { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); setShared(false); }
  async function share() {
    const url = window.location.href;
    try { if (navigator.share) await navigator.share({ title: "Will Azure Bill Me?", text: verdict.title, url }); else await navigator.clipboard.writeText(url); setShared(true); window.setTimeout(() => setShared(false), 2200); } catch { /* dismissed */ }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grid-glow pointer-events-none absolute inset-x-0 top-0 h-[620px]" />
      <div className="mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8">
        <header className="flex items-center justify-between py-6 sm:py-8">
          <a href="#top" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#58A6FF] text-[#0D1117] shadow-[0_0_22px_rgba(88,166,255,.35)]"><Icon name="spark" /></span>will azure bill me<span className="text-[#58A6FF]">?</span></a>
          <span className="hidden rounded-full border border-[#30363d] px-3 py-1 text-[11px] font-medium uppercase tracking-[.16em] text-[#8b949e] sm:block">free-tier reality check</span>
        </header>
        <section id="top" className="relative pb-14 pt-12 text-center sm:pb-20 sm:pt-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1f6feb]/40 bg-[#1f6feb]/10 px-3 py-1.5 text-xs font-medium text-[#79c0ff]"><span className="h-1.5 w-1.5 rounded-full bg-[#58A6FF] shadow-[0_0_8px_#58A6FF]" />No signup. No nonsense.</div>
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-bold tracking-[-.055em] text-white sm:text-7xl">Will Azure<br /><span className="text-[#58A6FF]">bill me?</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-[#8b949e] sm:text-lg">Tick what you&apos;re using. We&apos;ll tell you which &ldquo;free&rdquo; Azure services come with strings attached.</p>
          <a href="#checklist" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#58A6FF] px-5 py-3 text-sm font-bold text-[#0D1117] transition hover:bg-[#79c0ff] hover:shadow-[0_0_25px_rgba(88,166,255,.25)]">Check my setup <Icon name="arrow" /></a>
        </section>

        <section id="checklist" className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22]/85 p-3 shadow-2xl shadow-black/20 sm:p-4">
            <div className="flex items-center justify-between px-2 pb-3 pt-1 sm:px-3"><div><p className="text-sm font-semibold text-white">What are you running?</p><p className="mt-1 text-xs text-[#8b949e]">Select every resource in your subscription.</p></div><span className="rounded-md bg-[#21262d] px-2 py-1 font-mono text-xs text-[#8b949e]">{selected.length}/{traps.length}</span></div>
            <div className="space-y-1">
              {traps.map((trap) => {
                const active = selected.includes(trap.id); const risk = styles[trap.risk];
                return <button key={trap.id} type="button" aria-pressed={active} onClick={() => toggle(trap.id)} className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition sm:px-4 ${active ? "border-[#1f6feb]/70 bg-[#1f6feb]/[.08]" : "border-transparent hover:border-[#30363d] hover:bg-[#21262d]/60"}`}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${active ? "border-[#58A6FF] bg-[#58A6FF] text-[#0D1117]" : "border-[#484f58] text-transparent group-hover:border-[#8b949e]"}`}><Icon name="check" /></span>
                  <span className="min-w-0 flex-1"><span className={`block text-sm font-medium ${active ? "text-white" : "text-[#c9d1d9]"}`}>{trap.title}</span><span className="mt-1 block text-xs leading-5 text-[#8b949e]">{trap.detail}</span></span>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${risk.bg} ${risk.text}`}>{trap.badge}</span>
                </button>;
              })}
            </div>
          </div>

          <aside className="sticky top-5 rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#8b949e]">Your result</p><Icon name="spark" /></div>
            <div className="border-b border-[#30363d] pb-6"><div className={`mb-3 grid h-11 w-11 place-items-center rounded-xl bg-current/10 text-xl font-bold ${verdict.color}`}>{verdict.icon}</div><h2 className={`text-2xl font-bold tracking-tight ${verdict.color}`}>{verdict.title}</h2><p className="mt-2 text-sm leading-6 text-[#8b949e]">{verdict.body}</p></div>
            <div className="grid grid-cols-3 gap-2 border-b border-[#30363d] py-5 text-center"><div><p className="text-xl font-bold text-[#7ee787]">{counts.free}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#8b949e]">Free</p></div><div><p className="text-xl font-bold text-[#e3b341]">{counts.careful}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#8b949e]">Careful</p></div><div><p className="text-xl font-bold text-[#ff7b72]">{counts.bill}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#8b949e]">Will bill</p></div></div>
            <button type="button" onClick={share} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#484f58] px-4 py-2.5 text-sm font-semibold text-[#c9d1d9] transition hover:border-[#58A6FF] hover:text-white">{shared ? <><Icon name="check" /> Link copied</> : <><Icon name="share" /> Share my result</>}</button>
            <p className="mt-3 text-center text-[11px] leading-4 text-[#6e7681]">{selected.length ? "Your picks are encoded in the URL." : "Select a few resources to get a result."}</p>
          </aside>
        </section>
        <section className="mx-auto mt-12 flex max-w-3xl gap-3 rounded-xl border border-[#30363d] bg-[#161b22]/60 p-4 text-xs leading-5 text-[#8b949e] sm:mt-16 sm:p-5"><span className="text-[#e3b341]">*</span><p>Free means within the published allowance, not forever or unlimited. Offers vary by account, region, subscription and date. Always check your Cost Management dashboard before deploying.</p></section>
        <footer className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-[#21262d] pt-6 text-xs text-[#6e7681] sm:flex-row"><p>Built by <a className="text-[#8b949e] hover:text-[#58A6FF]" href="https://github.com/SandeshL702" target="_blank" rel="noreferrer">Sandesh</a></p><p>Not official Microsoft advice · for awareness only</p><a href="https://github.com/SandeshL702/will-azure-bill-me" target="_blank" rel="noreferrer" className="text-[#8b949e] hover:text-[#58A6FF]">View source <span aria-hidden="true">↗</span></a></footer>
      </div>
    </main>
  );
}
