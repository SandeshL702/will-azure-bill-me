"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DISCLAIMER,
  RESOURCES,
  SCENARIOS,
  UPDATED,
  chosen,
  counts,
  expand,
  hiddenCompanions,
  leftoverAfterStop,
  verdict,
  type Risk,
} from "../lib/engine";

const tone: Record<Risk | "idle", string> = {
  idle: "text-[#8b949e]",
  free: "text-[#7ee787]",
  careful: "text-[#e3b341]",
  bill: "text-[#ff7b72]",
};

const chip: Record<Risk, string> = {
  free: "bg-[#3fb950]/10 text-[#7ee787]",
  careful: "bg-[#d29922]/10 text-[#e3b341]",
  bill: "bg-[#f85149]/10 text-[#ff7b72]",
};

function parseHash() {
  if (typeof window === "undefined") return { scene: "", picks: [] as string[] };
  const raw = window.location.hash.slice(1);
  const params = new URLSearchParams(raw.includes("=") ? raw : `picks=${raw}`);
  const picks = (params.get("picks") || "")
    .split(",")
    .filter((id) => RESOURCES.some((item) => item.id === id));
  return { scene: params.get("scene") || "", picks };
}

export default function Home() {
  const boot = parseHash();
  const [scene, setScene] = useState(boot.scene);
  const [picks, setPicks] = useState<string[]>(boot.picks);
  const [copied, setCopied] = useState(false);

  const graph = useMemo(() => expand(picks), [picks]);
  const items = useMemo(() => chosen(picks), [picks]);
  const extras = useMemo(() => hiddenCompanions(picks), [picks]);
  const leftovers = useMemo(() => leftoverAfterStop(picks), [picks]);
  const tally = useMemo(() => counts(picks), [picks]);
  const call = useMemo(() => verdict(picks), [picks]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (scene) params.set("scene", scene);
    if (picks.length) params.set("picks", picks.join(","));
    const next = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${next ? `#${next}` : ""}`);
  }, [scene, picks]);

  function applyScene(id: string) {
    const found = SCENARIOS.find((item) => item.id === id);
    if (!found) return;
    setScene(id);
    setPicks(found.picks);
  }

  function toggle(id: string) {
    setScene("custom");
    setPicks((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: "Will Azure Bill Me?", text: call.title, url });
      else await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* dismissed */
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grid-glow pointer-events-none absolute inset-x-0 top-0 h-[620px]" />
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <p className="text-sm font-semibold tracking-tight text-white">
            will azure bill me<span className="text-[#58A6FF]">?</span>
          </p>
          <span className="rounded-full border border-[#30363d] px-3 py-1 text-[11px] uppercase tracking-[.16em] text-[#8b949e]">
            rules {UPDATED}
          </span>
        </header>

        <section className="pb-12 pt-8 text-center sm:pb-16 sm:pt-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-[.2em] text-[#79c0ff]">No login. No Azure account.</p>
          <h1 className="text-balance text-4xl font-bold tracking-[-.05em] text-white sm:text-6xl">
            You wanted one resource.
            <span className="mt-2 block text-[#58A6FF]">Azure made three.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-[#8b949e]">
            Pick what you think you are building. We add the silent companions and tell you what still bills after you hit Stop.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SCENARIOS.map((item) => {
            const on = scene === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => applyScene(item.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  on ? "border-[#58A6FF] bg-[#1f6feb]/15" : "border-[#30363d] bg-[#161b22] hover:border-[#58A6FF]/50"
                }`}
              >
                <p className="text-2xl">{item.emoji}</p>
                <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-[#8b949e]">{item.hook}</p>
              </button>
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-6">
            {extras.length > 0 && (
              <div className="rounded-2xl border border-[#d29922]/40 bg-[#d29922]/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#e3b341]">Azure also created</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {extras.map((item) => (
                    <span key={item.id} className={`rounded-full px-3 py-1 text-xs font-semibold ${chip[item.risk as Risk]}`}>
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-[#30363d] bg-[#161b22]/90 p-3 sm:p-4">
              <div className="flex items-center justify-between px-2 pb-3">
                <p className="text-sm font-semibold text-white">Fine-tune</p>
                <span className="font-mono text-xs text-[#8b949e]">{graph.length} in play</span>
              </div>
              <div className="space-y-1">
                {RESOURCES.map((item) => {
                  const on = picks.includes(item.id);
                  const implied = graph.includes(item.id) && !on;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left ${
                        on || implied ? "border-[#1f6feb]/50 bg-[#1f6feb]/10" : "border-transparent hover:bg-[#21262d]/70"
                      }`}
                    >
                      <span className={`h-4 w-4 rounded border ${on ? "border-[#58A6FF] bg-[#58A6FF]" : "border-[#484f58]"}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-[#c9d1d9]">{item.title}</span>
                        <span className="block text-xs text-[#8b949e]">{item.blurb}</span>
                      </span>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${chip[item.risk as Risk]}`}>
                        {implied ? "with it" : item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="sticky top-5 rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8b949e]">Verdict</p>
            <h2 className={`mt-4 text-2xl font-bold ${tone[call.tone]}`}>{call.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#8b949e]">{call.body}</p>

            <div className="mt-5 grid grid-cols-3 gap-2 border-y border-[#30363d] py-4 text-center">
              <div>
                <p className="text-xl font-bold text-[#7ee787]">{tally.free}</p>
                <p className="text-[10px] uppercase text-[#8b949e]">Free</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#e3b341]">{tally.careful}</p>
                <p className="text-[10px] uppercase text-[#8b949e]">Careful</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#ff7b72]">{tally.bill}</p>
                <p className="text-[10px] uppercase text-[#8b949e]">Bill</p>
              </div>
            </div>

            {leftovers.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-white">After you hit Stop</p>
                <ul className="mt-2 space-y-2 text-xs text-[#8b949e]">
                  {leftovers.map((item) => (
                    <li key={item.id}>
                      <span className="text-[#ff7b72]">{item.title}.</span> {item.fix}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {items.length > 0 && leftovers.length === 0 && (
              <p className="mt-4 text-xs text-[#8b949e]">No leftover hourly meters in this set. Still delete the lab.</p>
            )}

            <button
              type="button"
              onClick={share}
              className="mt-5 w-full rounded-lg border border-[#484f58] py-2.5 text-sm text-[#c9d1d9] hover:border-[#58A6FF]"
            >
              {copied ? "Link copied" : "Share this scene"}
            </button>
          </aside>
        </section>

        <p className="mx-auto mt-12 max-w-3xl text-xs leading-5 text-[#6e7681]">{DISCLAIMER}</p>
        <footer className="mt-10 flex flex-col gap-2 border-t border-[#21262d] pt-6 text-xs text-[#6e7681] sm:flex-row sm:justify-between">
          <p>
            Built by <a className="hover:text-[#58A6FF]" href="https://github.com/SandeshL702">Sandesh</a>
          </p>
          <a className="hover:text-[#58A6FF]" href="https://github.com/SandeshL702/will-azure-bill-me">
            Source
          </a>
        </footer>
      </div>
    </main>
  );
}
