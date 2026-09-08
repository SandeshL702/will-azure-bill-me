import rules from "../data/rules.json";

export type Risk = "free" | "careful" | "bill";
export type Resource = (typeof rules.resources)[number];
export type Scenario = (typeof rules.scenarios)[number];

export const RESOURCES: Resource[] = rules.resources;
export const SCENARIOS: Scenario[] = rules.scenarios;
export const DISCLAIMER = rules.disclaimer;
export const UPDATED = rules.updated;

const byId = new Map(RESOURCES.map((item) => [item.id, item]));

export function expand(ids: string[]): string[] {
  const seen = new Set<string>();
  const queue = [...ids];
  while (queue.length) {
    const id = queue.shift();
    if (!id || seen.has(id) || !byId.has(id)) continue;
    seen.add(id);
    for (const next of byId.get(id)!.companions) queue.push(next);
  }
  return RESOURCES.map((item) => item.id).filter((id) => seen.has(id));
}

export function chosen(ids: string[]): Resource[] {
  const set = new Set(expand(ids));
  return RESOURCES.filter((item) => set.has(item.id));
}

export function hiddenCompanions(explicit: string[]): Resource[] {
  const wanted = new Set(explicit);
  return chosen(explicit).filter((item) => !wanted.has(item.id));
}

export function counts(ids: string[]) {
  return chosen(ids).reduce(
    (out, item) => {
      out[item.risk as Risk] += 1;
      return out;
    },
    { free: 0, careful: 0, bill: 0 },
  );
}

export function leftoverAfterStop(ids: string[]): Resource[] {
  return chosen(ids).filter((item) => item.stopDoesNotStop);
}

export function verdict(ids: string[]) {
  const tally = counts(ids);
  const leftovers = leftoverAfterStop(ids);
  if (!ids.length) {
    return {
      title: "Pick a scene.",
      body: "Azure rarely creates one thing. Start with what you think you are building.",
      tone: "idle" as const,
    };
  }
  if (tally.bill) {
    return {
      title: "Yes. This can bill you.",
      body: leftovers.length
        ? `Stopping compute is not enough. ${leftovers.map((item) => item.title).join(", ")} keep charging.`
        : "At least one pick sits outside the free grant the moment it exists.",
      tone: "bill" as const,
    };
  }
  if (tally.careful) {
    return {
      title: "Probably fine — watch the cap.",
      body: "Free allowances apply, then meters start. Delete the lab when you are done.",
      tone: "careful" as const,
    };
  }
  return {
    title: "This looks cheap.",
    body: "Nothing here is a guaranteed hourly charge. Stay inside the published grant.",
    tone: "free" as const,
  };
}
