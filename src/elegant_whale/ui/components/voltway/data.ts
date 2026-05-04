export type ScenarioKey = "refund" | "shipping" | "warranty";

export type ProductGlyphKind =
  | "headphones"
  | "hub"
  | "cable"
  | "laptop"
  | "sleeve"
  | "desktop"
  | "keyboard";

export type Customer = {
  name: string;
  email: string;
  tier: string;
  since: string;
  lifetime: string;
  orders: number;
  phone: string;
  location: string;
  sentiment: string;
  sentimentScore: number;
};

export type OrderItem = {
  sku: string;
  name: string;
  qty: number;
  price: string;
  img: ProductGlyphKind;
};

export type Scenario = {
  customer: Customer;
  call: { duration: number; reason: string; hold: boolean };
  order: {
    id: string;
    date: string;
    status: string;
    total: string;
    items: OrderItem[];
    shipping: string;
    tracking: string;
  };
  issue: string;
  transcript: { who: "customer" | "agent"; t: string; text: string }[];
};

export const VW_SCENARIOS: Record<ScenarioKey, Scenario> = {
  refund: {
    customer: {
      name: "Marisol Tanaka",
      email: "marisol.t@gmail.com",
      tier: "Voltway Plus",
      since: "Member since Jun 2022",
      lifetime: "$4,218",
      orders: 14,
      phone: "+1 (415) 555-0142",
      location: "San Francisco, CA",
      sentiment: "frustrated",
      sentimentScore: 32,
    },
    call: {
      duration: 247,
      reason: "Refund request — defective product",
      hold: false,
    },
    order: {
      id: "VW-8841-2261",
      date: "Apr 12, 2026",
      status: "Delivered Apr 18",
      total: "$849.00",
      items: [
        { sku: "AUR-XM7-BK", name: "Auratone XM7 Wireless Headphones", qty: 1, price: "$429.00", img: "headphones" },
        { sku: "VOLT-HUB-PRO", name: "Voltway Hub Pro (smart home gateway)", qty: 1, price: "$329.00", img: "hub" },
        { sku: "CBL-USB4-2M", name: "USB4 cable, 2m", qty: 2, price: "$45.50", img: "cable" },
      ],
      shipping: "425 Bryant St, Apt 4B · San Francisco, CA 94107",
      tracking: "UPS 1Z999AA10123456784",
    },
    issue: "Auratone XM7 right earcup not charging — flashing red after 3 days of use",
    transcript: [
      { who: "customer", t: "0:04", text: "Hi, I bought these Auratone headphones a couple weeks ago and the right side just stopped charging." },
      { who: "agent", t: "0:12", text: "I'm sorry to hear that, Marisol. Let me pull up your order — can you confirm the order number on your email?" },
      { who: "customer", t: "0:21", text: "It's VW-8841-2261. I've tried three different cables and chargers, nothing works." },
      { who: "agent", t: "0:33", text: "Got it, I see it here — delivered April 18th. So you're inside the 30-day window. Let me check our return policy." },
      { who: "customer", t: "0:42", text: "I just want a working pair, honestly. These were not cheap." },
    ],
  },
  shipping: {
    customer: {
      name: "Devon Reyes",
      email: "devon.reyes@outlook.com",
      tier: "Standard",
      since: "Member since Mar 2025",
      lifetime: "$1,209",
      orders: 4,
      phone: "+1 (312) 555-0298",
      location: "Chicago, IL",
      sentiment: "concerned",
      sentimentScore: 58,
    },
    call: {
      duration: 92,
      reason: "Shipping inquiry — package not arrived",
      hold: false,
    },
    order: {
      id: "VW-9102-7733",
      date: "Apr 27, 2026",
      status: "In transit · ETA Apr 30",
      total: "$2,199.00",
      items: [
        { sku: "NXS-15-PRO", name: "Nexus 15 Pro laptop, 32GB / 1TB", qty: 1, price: "$2,099.00", img: "laptop" },
        { sku: "NXS-CASE-15", name: "Nexus 15 leather sleeve", qty: 1, price: "$100.00", img: "sleeve" },
      ],
      shipping: "1408 W Belmont Ave, Chicago, IL 60657",
      tracking: "FedEx 7820 4119 8821",
    },
    issue: "Order placed 4 days ago, no movement in tracking since Apr 28",
    transcript: [
      { who: "customer", t: "0:03", text: "Hi — I ordered a laptop on Saturday and the tracking hasn't updated since Tuesday. I need it for a work trip Friday." },
      { who: "agent", t: "0:14", text: "Let me take a look. Order number?" },
      { who: "customer", t: "0:18", text: "VW-9102-7733." },
      { who: "agent", t: "0:24", text: "Pulling that up now." },
    ],
  },
  warranty: {
    customer: {
      name: "Henry Okafor",
      email: "h.okafor@protonmail.com",
      tier: "Voltway Plus",
      since: "Member since Nov 2020",
      lifetime: "$11,840",
      orders: 38,
      phone: "+1 (646) 555-0411",
      location: "Brooklyn, NY",
      sentiment: "calm",
      sentimentScore: 78,
    },
    call: {
      duration: 412,
      reason: "Warranty claim — out of standard window",
      hold: false,
    },
    order: {
      id: "VW-7204-1108",
      date: "Aug 03, 2025",
      status: "Delivered Aug 09, 2025",
      total: "$3,499.00",
      items: [
        { sku: "NXS-STUDIO-M", name: "Nexus Studio M desktop, M3 Max", qty: 1, price: "$3,299.00", img: "desktop" },
        { sku: "KBD-MX-WL", name: "Voltway MX wireless keyboard", qty: 1, price: "$200.00", img: "keyboard" },
      ],
      shipping: "88 Greenpoint Ave, Brooklyn, NY 11222",
      tracking: "UPS 1Z999BB10455671299",
    },
    issue: "Display flicker started ~9 months in, now intermittent black screen",
    transcript: [
      { who: "customer", t: "0:08", text: "My Nexus Studio has been flickering for a couple months. I bought it last August." },
      { who: "agent", t: "0:17", text: "Thanks for calling, Henry. Standard warranty is 12 months — you're inside the window. Let me see what we can do." },
      { who: "customer", t: "0:28", text: "Yeah, I figured. It just got worse this week — full black screen for 30 seconds." },
    ],
  },
};

export const VW_AI_SUGGESTIONS_DEFAULT = [
  "How do I handle a Gold-tier customer threatening to go public on social media?",
  "Pull up customer C-14832 — tier, LTV, orders, open tickets.",
  "What is the average processing time for returns by category?",
];

export const VW_AI_SUGGESTIONS: Record<ScenarioKey, string[]> = {
  refund: VW_AI_SUGGESTIONS_DEFAULT,
  shipping: VW_AI_SUGGESTIONS_DEFAULT,
  warranty: VW_AI_SUGGESTIONS_DEFAULT,
};

export type AgentStatus = "on-call" | "on-hold" | "wrapping" | "available" | "break";

export type AgentRow = {
  id: number;
  name: string;
  avatar: string;
  status: AgentStatus;
  sentiment: number | null;
  duration: number;
  csat: number;
  calls: number;
  customer: string | null;
  reason: string | null;
  flag: "sentiment" | "hold" | null;
};

export const VW_AGENTS: AgentRow[] = [
  { id: 1, name: "Jamie Diaz", avatar: "JD", status: "on-call", sentiment: 32, duration: 247, csat: 4.9, calls: 12, customer: "Marisol Tanaka", reason: "Refund — defective", flag: "sentiment" },
  { id: 2, name: "Priya Shah", avatar: "PS", status: "on-call", sentiment: 84, duration: 92, csat: 4.7, calls: 9, customer: "Devon Reyes", reason: "Shipping inquiry", flag: null },
  { id: 3, name: "Marcus Chen", avatar: "MC", status: "on-call", sentiment: 78, duration: 412, csat: 4.8, calls: 14, customer: "Henry Okafor", reason: "Warranty claim", flag: null },
  { id: 4, name: "Sofia Park", avatar: "SP", status: "on-hold", sentiment: 51, duration: 318, csat: 4.6, calls: 11, customer: "Lia Bergström", reason: "Order modification", flag: "hold" },
  { id: 5, name: "Alex Rivera", avatar: "AR", status: "on-call", sentiment: 66, duration: 156, csat: 4.5, calls: 10, customer: "Tomás Vega", reason: "Account access", flag: null },
  { id: 6, name: "Yuki Tanaka", avatar: "YT", status: "wrapping", sentiment: 88, duration: 28, csat: 4.9, calls: 15, customer: "Aisha Patel", reason: "Loyalty inquiry", flag: null },
  { id: 7, name: "Noah Bennett", avatar: "NB", status: "on-call", sentiment: 24, duration: 532, csat: 4.2, calls: 8, customer: "Robert Klein", reason: "Escalation — billing", flag: "sentiment" },
  { id: 8, name: "Emma O'Connor", avatar: "EO", status: "available", sentiment: null, duration: 0, csat: 4.8, calls: 13, customer: null, reason: null, flag: null },
  { id: 9, name: "Diego Morales", avatar: "DM", status: "on-call", sentiment: 71, duration: 195, csat: 4.7, calls: 11, customer: "Greta Lin", reason: "Product question", flag: null },
  { id: 10, name: "Hana Sato", avatar: "HS", status: "available", sentiment: null, duration: 0, csat: 4.9, calls: 16, customer: null, reason: null, flag: null },
  { id: 11, name: "Liam Foster", avatar: "LF", status: "break", sentiment: null, duration: 0, csat: 4.4, calls: 7, customer: null, reason: null, flag: null },
  { id: 12, name: "Zara Ahmed", avatar: "ZA", status: "on-call", sentiment: 58, duration: 78, csat: 4.6, calls: 9, customer: "Wei Zhang", reason: "Refund — accidental", flag: null },
];

export const VW_QUEUE = { waiting: 7, longestWait: "4:21", abandonedToday: 3, slaPct: 94 };

export const fmtDur = (s: number): string =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export type SentimentMeta = { label: string; color: string; bg: string };

export const sentimentMeta = (score: number): SentimentMeta => {
  if (score >= 70) return { label: "Positive", color: "#00875C", bg: "#9ED6C4" };
  if (score >= 50) return { label: "Neutral", color: "#BA7B23", bg: "#FFDB96" };
  if (score >= 30) return { label: "Frustrated", color: "#BD2B26", bg: "#FABFBA" };
  return { label: "Distressed", color: "#801C17", bg: "#FABFBA" };
};
