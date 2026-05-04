import { useEffect, useRef, useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import { VWIcon } from "./icons";
import {
  fmtDur,
  sentimentMeta,
  VW_AI_SUGGESTIONS,
  VW_SCENARIOS,
  type ProductGlyphKind,
  type Scenario,
  type ScenarioKey,
} from "./data";

type BadgeTone = "neutral" | "success" | "warn" | "danger" | "info" | "plus";

const TONE: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: "var(--db-oat-medium)", fg: "var(--db-navy-700)" },
  success: { bg: "#9ED6C4", fg: "#095A35" },
  warn: { bg: "#FFDB96", fg: "#7D5319" },
  danger: { bg: "#FABFBA", fg: "#801C17" },
  info: { bg: "#BAE1FC", fg: "#04355D" },
  plus: { bg: "var(--db-navy-800)", fg: "#fff" },
};

function VWBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: BadgeTone }) {
  const c = TONE[tone];
  return (
    <span style={{
      fontSize: 11, padding: "3px 9px", borderRadius: 999, background: c.bg, color: c.fg,
      fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 5, lineHeight: 1.3, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

const GLYPH: Record<ProductGlyphKind, { bg: string; fg: string; d: string }> = {
  headphones: { bg: "#1B3139", fg: "#FF5F46", d: "M3 14v-2a9 9 0 0 1 18 0v2M3 14a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2v1zM21 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1z" },
  hub: { bg: "#143D4A", fg: "#FFAB00", d: "M4 4h16v16H4zM9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" },
  cable: { bg: "#EEEDE9", fg: "#1B3139", d: "M4 4h6v4H4zM14 16h6v4h-6zM10 6c0 6 4 4 4 10" },
  laptop: { bg: "#1B3139", fg: "#FFFFFF", d: "M4 6h16v10H4zM2 18h20l-1 2H3z" },
  sleeve: { bg: "#EEEDE9", fg: "#1B3139", d: "M5 4h14v16H5zM5 8h14M9 13h6" },
  desktop: { bg: "#0B2026", fg: "#FF5F46", d: "M3 4h18v12H3zM8 20h8M12 16v4" },
  keyboard: { bg: "#EEEDE9", fg: "#1B3139", d: "M2 7h20v10H2zM6 11h.01M10 11h.01M14 11h.01M18 11h.01M7 15h10" },
};

function ProductGlyph({ kind, size = 40 }: { kind: ProductGlyphKind; size?: number }) {
  const c = GLYPH[kind];
  return (
    <div style={{ width: size, height: size, borderRadius: 6, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={c.fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={c.d} />
      </svg>
    </div>
  );
}

export function VWAppBar({ agentName = "Jamie Diaz" }: { agentName?: string }) {
  const tabs: [string, boolean][] = [
    ["Active call", true],
    ["Queue (7)", false],
    ["History", false],
    ["Knowledge", false],
  ];
  return (
    <header style={{
      height: 52, background: "var(--db-navy-900)", color: "#fff", display: "flex", alignItems: "center",
      padding: "0 20px", gap: 16, flexShrink: 0, borderBottom: "1px solid var(--db-navy-700)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 5, background: "var(--db-lava-600)", display: "grid", placeItems: "center", color: "#fff" }}>
          <VWIcon name="zap" size={15} color="#fff" stroke={2.4} />
        </div>
        <span style={{ fontWeight: 500, fontSize: 15, letterSpacing: "-0.01em" }}>Voltway</span>
        <span style={{ fontSize: 11, color: "var(--db-navy-400)", textTransform: "uppercase", letterSpacing: "0.08em", marginLeft: 4, paddingLeft: 12, borderLeft: "1px solid var(--db-navy-700)" }}>
          Support workspace
        </span>
      </div>
      <nav style={{ display: "flex", gap: 4, marginLeft: 24 }}>
        {tabs.map(([l, a]) => (
          <button key={l} style={{
            background: a ? "var(--db-navy-700)" : "transparent",
            color: a ? "#fff" : "var(--db-navy-300)",
            border: 0, padding: "7px 12px", fontSize: 13, fontWeight: a ? 500 : 400,
            fontFamily: "var(--font-sans)", borderRadius: 5, cursor: "pointer",
          }}>
            {l}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 10px 4px 6px", background: "var(--db-navy-700)", borderRadius: 999 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--db-green-600)", boxShadow: "0 0 0 3px rgba(0,169,114,0.2)" }} />
        <span style={{ fontSize: 12, color: "#fff" }}>Available</span>
        <VWIcon name="chev-d" size={12} color="var(--db-navy-300)" />
      </div>
      <div style={{ width: 28, height: 28, borderRadius: 999, background: "var(--db-lava-600)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
        {agentName.split(" ").map((n) => n[0]).join("")}
      </div>
    </header>
  );
}

function VWCallPanel({
  scenario, callDur, muted, onMute, onHold, holding,
}: {
  scenario: Scenario; callDur: number;
  muted: boolean; onMute: () => void;
  holding: boolean; onHold: () => void;
}) {
  const { customer } = scenario;
  const sent = sentimentMeta(customer.sentimentScore);
  const buttons = [
    { ic: muted ? ("mic-off" as const) : ("mic" as const), l: muted ? "Unmute" : "Mute", on: muted, action: onMute, danger: muted },
    { ic: "pause" as const, l: holding ? "Resume" : "Hold", on: holding, action: onHold, danger: false },
    { ic: "transfer" as const, l: "Transfer", on: false, action: undefined, danger: false },
    { ic: "keypad" as const, l: "Keypad", on: false, action: undefined, danger: false },
  ];
  return (
    <div style={{
      background: "var(--db-navy-800)", color: "#fff", padding: 20,
      display: "flex", flexDirection: "column", gap: 16,
      borderBottom: "1px solid var(--db-navy-700)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--db-lava-500)", animation: "vw-pulse 1.6s ease-in-out infinite" }} />
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--db-lava-400)", fontWeight: 500 }}>
            Live call
          </span>
        </div>
        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "#fff" }}>{fmtDur(callDur)}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 999, background: "linear-gradient(135deg, #FF5F46, #BD2B26)", display: "grid", placeItems: "center", fontSize: 17, fontWeight: 500, color: "#fff", flexShrink: 0 }}>
          {customer.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
            {customer.name}
            {customer.tier === "Voltway Plus" && <VWBadge tone="plus">Plus</VWBadge>}
          </div>
          <div style={{ fontSize: 12, color: "var(--db-navy-300)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
            {customer.phone}
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--db-navy-300)", fontWeight: 500 }}>Sentiment</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: sent.bg }}>{sent.label}</span>
        </div>
        <div style={{ height: 5, background: "var(--db-navy-700)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${customer.sentimentScore}%`, background: sent.color, borderRadius: 999, transition: "width 600ms cubic-bezier(0.2,0.7,0.2,1)" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {buttons.map((b) => (
          <button
            key={b.l}
            onClick={b.action}
            style={{
              background: b.on ? (b.danger ? "var(--db-lava-600)" : "var(--db-yellow-600)") : "var(--db-navy-700)",
              color: "#fff", border: 0, borderRadius: 6, padding: "10px 4px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)",
              transition: "background 200ms cubic-bezier(0.2,0.7,0.2,1)",
            }}
          >
            <VWIcon name={b.ic} size={16} color="#fff" />
            {b.l}
          </button>
        ))}
      </div>
      <button style={{
        background: "var(--db-lava-600)", color: "#fff", border: 0, borderRadius: 6, padding: "10px 14px",
        fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8, fontFamily: "var(--font-sans)",
      }}>
        <VWIcon name="phone-end" size={15} color="#fff" />
        End call
      </button>
    </div>
  );
}

function VWCustomerCard({ scenario }: { scenario: Scenario }) {
  const { customer } = scenario;
  const fields: [string, string | number, boolean?][] = [
    ["Tier", customer.tier],
    ["Member", customer.since.replace("Member since ", "")],
    ["Lifetime", customer.lifetime],
    ["Orders", customer.orders],
    ["Email", customer.email, true],
    ["Location", customer.location, true],
  ];
  return (
    <div style={{
      padding: 20, display: "flex", flexDirection: "column", gap: 14,
      background: "var(--db-navy-900)", color: "#fff", flex: 1, overflow: "auto",
    }}>
      <div className="vw-eyebrow">Customer</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {fields.map(([l, v, full]) => (
          <div key={l} style={{ gridColumn: full ? "span 2" : "auto" }}>
            <div style={{ fontSize: 10, color: "var(--db-navy-400)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{l}</div>
            <div style={{ fontSize: 13, color: "#fff", marginTop: 3, fontWeight: 400, wordBreak: "break-word" }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "var(--db-navy-700)" }} />
      <div className="vw-eyebrow">Recent contacts</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { d: "Mar 04", r: "Order tracking", s: "Resolved" },
          { d: "Jan 22", r: "Promo code", s: "Resolved" },
          { d: "Nov 18", r: "Account merge", s: "Resolved" },
        ].map((c) => (
          <div key={c.d} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--db-navy-300)", width: 48 }}>{c.d}</span>
            <span style={{ color: "#fff", flex: 1 }}>{c.r}</span>
            <span style={{ fontSize: 10, color: "var(--db-green-400)", fontWeight: 500 }}>{c.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VWOrderCard({
  scenario, expanded, onToggle,
}: { scenario: Scenario; expanded: boolean; onToggle: () => void }) {
  const { order, issue } = scenario;
  const delivered = order.status.startsWith("Delivered");
  return (
    <div style={{ background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--db-gray-lines)", display: "flex", alignItems: "center", gap: 12 }}>
        <VWIcon name="package" size={18} color="var(--db-navy-800)" />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--db-navy-800)", fontFamily: "var(--font-mono)" }}>{order.id}</span>
            <VWBadge tone={delivered ? "success" : "info"}>
              <VWIcon name={delivered ? "check" : "truck"} size={11} />
              {order.status}
            </VWBadge>
          </div>
          <div style={{ fontSize: 12, color: "var(--db-gray-text)", marginTop: 2 }}>
            Placed {order.date} · {order.total}
          </div>
        </div>
        <button onClick={onToggle} style={{
          background: "transparent", border: "1px solid var(--db-gray-lines)", borderRadius: 6,
          padding: "5px 10px", fontSize: 12, color: "var(--db-navy-800)", fontWeight: 500,
          cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          {expanded ? "Collapse" : "View details"}
          <VWIcon name={expanded ? "chev-d" : "chev"} size={11} />
        </button>
      </div>
      {expanded && (
        <>
          <div style={{ padding: "0 18px" }}>
            {order.items.map((it, i) => (
              <div key={it.sku} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: i < order.items.length - 1 ? "1px solid var(--db-gray-lines)" : 0,
              }}>
                <ProductGlyph kind={it.img} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--db-navy-800)" }}>{it.name}</div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--db-gray-text)", marginTop: 2 }}>
                    {it.sku} · qty {it.qty}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--db-navy-800)" }}>{it.price}</div>
              </div>
            ))}
          </div>
          <div style={{
            padding: "12px 18px", background: "var(--db-oat-light)",
            borderTop: "1px solid var(--db-gray-lines)", display: "grid",
            gridTemplateColumns: "1fr 1fr", gap: 14,
          }}>
            <div>
              <div className="vw-eyebrow-light">Ship to</div>
              <div style={{ fontSize: 12, color: "var(--db-navy-800)", marginTop: 3 }}>{order.shipping}</div>
            </div>
            <div>
              <div className="vw-eyebrow-light">Tracking</div>
              <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--db-navy-800)", marginTop: 3 }}>{order.tracking}</div>
            </div>
          </div>
          <div style={{
            padding: "12px 18px", background: "#FFF4F2",
            borderTop: "1px solid var(--db-gray-lines)", display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <VWIcon name="alert" size={14} color="var(--db-lava-700)" />
            <div style={{ fontSize: 12, color: "var(--db-lava-800)", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 500 }}>Reported issue: </span>{issue}
            </div>
          </div>
          <div style={{ padding: 14, display: "flex", gap: 8, borderTop: "1px solid var(--db-gray-lines)", flexWrap: "wrap" }}>
            <button className="vw-btn vw-btn-primary"><VWIcon name="refresh" size={12} color="#fff" /> Issue replacement</button>
            <button className="vw-btn vw-btn-ghost"><VWIcon name="cart" size={12} /> Refund</button>
            <button className="vw-btn vw-btn-ghost"><VWIcon name="file" size={12} /> RMA label</button>
            <button className="vw-btn vw-btn-ghost"><VWIcon name="flag" size={12} /> Escalate</button>
          </div>
        </>
      )}
    </div>
  );
}

function VWTranscript({ scenario, listening }: { scenario: Scenario; listening: boolean }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 8,
      overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0, flex: 1,
    }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--db-gray-lines)", display: "flex", alignItems: "center", gap: 10 }}>
        <VWIcon name="waveform" size={16} color="var(--db-lava-600)" />
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--db-navy-800)" }}>Live transcript</span>
        {listening && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 6 }}>
            {[1, 2, 3, 4].map((i) => (
              <span key={i} style={{
                width: 2, background: "var(--db-lava-600)", borderRadius: 2,
                height: 8 + (i % 2) * 6,
                animation: `vw-bar ${0.6 + i * 0.12}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--db-gray-text)" }}>Auto-scroll on</span>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        {scenario.transcript.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--db-navy-400)", width: 32, paddingTop: 3, flexShrink: 0 }}>{m.t}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500,
                color: m.who === "agent" ? "var(--db-lava-700)" : "var(--db-navy-600)", marginBottom: 3,
              }}>
                {m.who === "agent" ? "You" : "Customer"}
              </div>
              <div style={{ fontSize: 13, color: "var(--db-navy-800)", lineHeight: 1.5 }}>{m.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type ChatMsg = {
  id: string;
  from: "ai" | "user";
  text: string;
  sources?: { t: string; s: string }[];
};

function VWAssistant({ scenario, scenarioKey }: { scenario: Scenario; scenarioKey: ScenarioKey }) {
  const greeting = (_sc: Scenario): ChatMsg => ({
    id: "init",
    from: "ai",
    text: "Hi, I'm Voltway Assist. Ask me anything about policies, customers, orders, or how to handle a tricky call.",
  });
  const [msgs, setMsgs] = useState<ChatMsg[]>([greeting(scenario)]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMsgs([greeting(scenario)]);
    setInput("");
    abortRef.current?.abort();
    setStreaming(false);
  }, [scenarioKey]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, streaming]);

  const ask = async (q: string) => {
    if (!q.trim() || streaming) return;
    const userMsg: ChatMsg = { id: crypto.randomUUID(), from: "user", text: q.trim() };
    const aiMsg: ChatMsg = { id: crypto.randomUUID(), from: "ai", text: "" };
    const next = [...msgs, userMsg];
    setMsgs([...next, aiMsg]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const systemContext = `You are Voltway Assist helping a support agent on a live call. Customer: ${scenario.customer.name} (${scenario.customer.tier}, ${scenario.customer.email}). Order ${scenario.order.id}, ${scenario.order.status}. Reported issue: ${scenario.issue}. Be concise and actionable.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemContext },
            ...next.map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })),
          ],
        }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.delta ?? parsed.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              acc += delta;
              setMsgs((prev) => {
                const u = [...prev];
                u[u.length - 1] = { ...u[u.length - 1], text: acc };
                return u;
              });
            }
          } catch {
            // skip non-JSON SSE lines
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setMsgs((prev) => {
        const u = [...prev];
        u[u.length - 1] = { ...u[u.length - 1], text: "Sorry, I had trouble reaching the assistant. Please try again." };
        return u;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const suggestions = VW_AI_SUGGESTIONS[scenarioKey] ?? [];

  return (
    <div style={{
      background: "#fff", borderLeft: "1px solid var(--db-gray-lines)",
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 18px", borderBottom: "1px solid var(--db-gray-lines)",
        display: "flex", alignItems: "center", gap: 10,
        background: "linear-gradient(180deg, #FFF4F2 0%, #fff 100%)",
      }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: "var(--db-lava-600)", display: "grid", placeItems: "center" }}>
          <VWIcon name="sparkles" size={16} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--db-navy-800)" }}>Voltway Assist</div>
          <div style={{ fontSize: 11, color: "var(--db-gray-text)" }}>Policy + product knowledge · context-aware</div>
        </div>
        <button style={{ background: "transparent", border: 0, padding: 4, cursor: "pointer", color: "var(--db-gray-text)" }}>
          <VWIcon name="settings" size={15} />
        </button>
      </div>
      <div ref={scrollRef} style={{
        flex: 1, overflow: "auto", padding: "16px 18px", display: "flex",
        flexDirection: "column", gap: 14, background: "var(--db-oat-light)",
      }}>
        {msgs.map((m) => (
          <div key={m.id} style={{ display: "flex", flexDirection: m.from === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-start" }}>
            {m.from === "ai" && (
              <div style={{ width: 24, height: 24, borderRadius: 5, background: "var(--db-lava-600)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 2 }}>
                <VWIcon name="sparkles" size={12} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth: "88%",
              background: m.from === "user" ? "var(--db-navy-800)" : "#fff",
              color: m.from === "user" ? "#fff" : "var(--db-navy-800)",
              border: m.from === "user" ? 0 : "1px solid var(--db-gray-lines)",
              borderRadius: 8, padding: "10px 12px", fontSize: 13, lineHeight: 1.55,
              whiteSpace: m.from === "user" ? "pre-wrap" : "normal",
            }}>
              {m.from === "ai"
                ? (m.text ? <MessageResponse>{m.text}</MessageResponse> : streaming ? <ThinkingDots /> : null)
                : m.text}
              {m.sources && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--db-gray-lines)", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="vw-eyebrow-light" style={{ fontSize: 10 }}>Sources</div>
                  {m.sources.map((s) => (
                    <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      <VWIcon name="book" size={12} color="var(--db-lava-700)" />
                      <span style={{ color: "var(--db-navy-800)", fontWeight: 500 }}>{s.t}</span>
                      <span style={{ color: "var(--db-gray-text)" }}>· {s.s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {suggestions.length > 0 && (
        <div style={{
          padding: suggestionsOpen ? "10px 14px 12px" : "8px 14px",
          borderTop: "1px solid var(--db-gray-lines)",
          display: "flex", flexDirection: "column", gap: 6, background: "#fff",
          flexShrink: 0,
        }}>
          <button
            onClick={() => setSuggestionsOpen((o) => !o)}
            aria-expanded={suggestionsOpen}
            style={{
              background: "transparent", border: 0, padding: 0, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", textAlign: "left",
            }}
          >
            <span className="vw-eyebrow-light">Suggested questions</span>
            <VWIcon
              name={suggestionsOpen ? "chev-d" : "chev"}
              size={12}
              color="var(--db-gray-text)"
            />
          </button>
          {suggestionsOpen && suggestions.map((s, i) => (
            <button
              key={s}
              onClick={() => ask(s)}
              disabled={streaming}
              style={{
                background: "var(--db-oat-light)", border: "1px solid var(--db-gray-lines)",
                borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "var(--db-navy-800)",
                textAlign: "left", cursor: streaming ? "not-allowed" : "pointer",
                fontFamily: "var(--font-sans)", lineHeight: 1.4,
                display: "flex", gap: 8, alignItems: "flex-start",
              }}
            >
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--db-lava-700)",
                fontWeight: 500, flexShrink: 0, lineHeight: 1.55,
              }}>{i + 1}.</span>
              <span>{s}</span>
            </button>
          ))}
        </div>
      )}
      <div style={{ padding: 12, borderTop: "1px solid var(--db-gray-lines)", background: "#fff" }}>
        <div style={{ display: "flex", gap: 6, background: "var(--db-oat-light)", border: "1px solid var(--db-gray-lines)", borderRadius: 8, padding: 6, alignItems: "center" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(input)}
            placeholder="Ask Voltway Assist…"
            disabled={streaming}
            style={{
              flex: 1, border: 0, background: "transparent", outline: "none",
              fontSize: 13, fontFamily: "var(--font-sans)", color: "var(--db-navy-800)",
              padding: "6px 8px",
            }}
          />
          <button onClick={() => ask(input)} disabled={!input.trim() || streaming} style={{
            background: input.trim() && !streaming ? "var(--db-lava-600)" : "var(--db-navy-300)",
            color: "#fff", border: 0, borderRadius: 5, padding: "7px 10px",
            cursor: input.trim() && !streaming ? "pointer" : "not-allowed",
            display: "grid", placeItems: "center",
            transition: "background 200ms cubic-bezier(0.2,0.7,0.2,1)",
          }}>
            <VWIcon name="send" size={13} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: 999,
          background: "var(--db-lava-600)",
          animation: `vw-dot 1s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </span>
  );
}

export function AgentWorkspace({
  scenarioKey = "refund",
  showTranscript = true,
}: {
  scenarioKey?: ScenarioKey;
  showTranscript?: boolean;
}) {
  const scenario = VW_SCENARIOS[scenarioKey];
  const [callDur, setCallDur] = useState(scenario.call.duration);
  const [muted, setMuted] = useState(false);
  const [holding, setHolding] = useState(false);
  const [orderExpanded, setOrderExpanded] = useState(true);

  useEffect(() => {
    setCallDur(scenario.call.duration);
    setMuted(false);
    setHolding(false);
  }, [scenarioKey]);

  useEffect(() => {
    if (holding) return;
    const t = setInterval(() => setCallDur((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, [holding]);

  return (
    <div className="vw-root" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <VWAppBar />
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 380px", flex: 1, minHeight: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0, background: "var(--db-navy-800)" }}>
          <VWCallPanel
            scenario={scenario}
            callDur={callDur}
            muted={muted}
            onMute={() => setMuted((m) => !m)}
            holding={holding}
            onHold={() => setHolding((h) => !h)}
          />
          <VWCustomerCard scenario={scenario} />
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "hidden" }}>
          <VWOrderCard scenario={scenario} expanded={orderExpanded} onToggle={() => setOrderExpanded((e) => !e)} />
          {showTranscript && <VWTranscript scenario={scenario} listening={!muted && !holding} />}
        </div>
        <VWAssistant scenario={scenario} scenarioKey={scenarioKey} />
      </div>
    </div>
  );
}
