export type PlanTier = {
  id: string;
  name: string;
  pricePerSeat: number; // USD per month
  currency: "USD" | "INR";
};

export type Tool = {
  id: string;
  name: string;
  category: "coding" | "chat" | "api";
  plans: PlanTier[];
};

export const TOOLS: Tool[] = [
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    plans: [
      { id: "hobby", name: "Hobby", pricePerSeat: 0, currency: "USD" },
      { id: "pro", name: "Individual Pro", pricePerSeat: 20, currency: "USD" },
      { id: "pro_plus", name: "Individual Pro+", pricePerSeat: 60, currency: "USD" },
      { id: "ultra", name: "Individual Ultra", pricePerSeat: 200, currency: "USD" },
      { id: "teams", name: "Teams", pricePerSeat: 40, currency: "USD" },
      { id: "enterprise", name: "Enterprise", pricePerSeat: -1, currency: "USD" },
    ],
  },
  {
    id: "github_copilot",
    name: "GitHub Copilot",
    category: "coding",
    plans: [
      { id: "free", name: "Free", pricePerSeat: 0, currency: "USD" },
      { id: "pro", name: "Individual Pro", pricePerSeat: 10, currency: "USD" },
      { id: "pro_plus", name: "Individual Pro+", pricePerSeat: 39, currency: "USD" },
      { id: "business", name: "Business", pricePerSeat: 19, currency: "USD" },
      { id: "enterprise", name: "Enterprise", pricePerSeat: 39, currency: "USD" },
    ],
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    category: "chat",
    plans: [
      { id: "free", name: "Free", pricePerSeat: 0, currency: "USD" },
      { id: "pro", name: "Pro", pricePerSeat: 17, currency: "USD" },
      { id: "max", name: "Max", pricePerSeat: 100, currency: "USD" },
      { id: "team_standard", name: "Team Standard", pricePerSeat: 20, currency: "USD" },
      { id: "team_premium", name: "Team Premium", pricePerSeat: 100, currency: "USD" },
      { id: "enterprise", name: "Enterprise", pricePerSeat: -1, currency: "USD" },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT (OpenAI)",
    category: "chat",
    plans: [
      { id: "free", name: "Free", pricePerSeat: 0, currency: "USD" },
      { id: "plus", name: "Plus", pricePerSeat: 1999, currency: "INR" },
      { id: "pro", name: "Pro", pricePerSeat: 10699, currency: "INR" },
      { id: "enterprise", name: "Enterprise", pricePerSeat: -1, currency: "USD" },
    ],
  },
  {
    id: "openai_api",
    name: "OpenAI API (Direct)",
    category: "api",
    plans: [
      { id: "payg", name: "Pay as you go", pricePerSeat: 0, currency: "USD" },
    ],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API (Direct)",
    category: "api",
    plans: [
      { id: "payg", name: "Pay as you go", pricePerSeat: 0, currency: "USD" },
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    category: "chat",
    plans: [
      { id: "free", name: "Free", pricePerSeat: 0, currency: "INR" },
      { id: "plus", name: "AI Plus", pricePerSeat: 399, currency: "INR" },
      { id: "pro", name: "AI Pro", pricePerSeat: 1950, currency: "INR" },
      { id: "ultra", name: "AI Ultra", pricePerSeat: 6500, currency: "INR" },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: "coding",
    plans: [
      { id: "free", name: "Free", pricePerSeat: 0, currency: "USD" },
      { id: "pro", name: "Pro", pricePerSeat: 20, currency: "USD" },
      { id: "max", name: "Max", pricePerSeat: 200, currency: "USD" },
      { id: "teams", name: "Teams", pricePerSeat: 40, currency: "USD" },
      { id: "enterprise", name: "Enterprise", pricePerSeat: -1, currency: "USD" },
    ],
  },
];

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export const USE_CASES: { id: UseCase; label: string }[] = [
  { id: "coding", label: "Coding / Development" },
  { id: "writing", label: "Writing / Content" },
  { id: "data", label: "Data Analysis" },
  { id: "research", label: "Research" },
  { id: "mixed", label: "Mixed / General" },
];

export type ToolEntry = {
  toolId: string;
  planId: string;
  seats: number;
  monthlySpend: number;
};

export type FormState = {
  teamSize: number;
  useCase: UseCase;
  tools: ToolEntry[];
};