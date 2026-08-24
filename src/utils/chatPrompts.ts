import {
  CHAT_PROMPTS,
  ChatPrompt,
  PromptRequirement,
  PromptScope,
} from "@/constants/chatPrompts";

interface PickParams {
  scopes: PromptScope[];
  count: number;
  seed: string;
  plantName?: string | null;
  speciesName?: string | null;
  met?: PromptRequirement[];
}

function hash(value: string) {
  let total = 0;
  for (let index = 0; index < value.length; index += 1) {
    total = (total * 31 + value.charCodeAt(index)) % 2147483647;
  }
  return total;
}

function fill(prompt: ChatPrompt, plant: string, species: string) {
  return prompt.text
    .replace(/\{\{planta\}\}/g, plant)
    .replace(/\{\{especie\}\}/g, species);
}

export function pickPrompts({
  scopes,
  count,
  seed,
  plantName,
  speciesName,
  met = [],
}: PickParams) {
  const subject = speciesName ?? plantName ?? "essa planta";

  const eligible = CHAT_PROMPTS.filter((prompt) => {
    if (!scopes.includes(prompt.scope)) return false;
    if (prompt.requires && !met.includes(prompt.requires)) return false;
    if (prompt.text.includes("{{especie}}") && !speciesName) return false;
    return true;
  });

  if (eligible.length === 0) return [];

  const required = eligible.filter((prompt) => prompt.requires);
  const rest = eligible.filter((prompt) => !prompt.requires);
  const offset = hash(seed);

  const rotated = rest.map(
    (_, index) => rest[(offset + index) % rest.length],
  );

  const chosen: ChatPrompt[] = [];
  const seen = new Set<string>();

  for (const prompt of [...required, ...rotated]) {
    if (seen.has(prompt.id)) continue;
    seen.add(prompt.id);
    chosen.push(prompt);
    if (chosen.length === count) break;
  }

  return chosen.map((prompt) => ({
    id: prompt.id,
    text: fill(prompt, plantName ?? subject, speciesName ?? subject),
  }));
}
