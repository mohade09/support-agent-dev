import { Fragment, useEffect, useRef, useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import { VWIcon } from "./icons";
import { VWAppBar } from "./agent-workspace";
import {
  fmtDur,
  sentimentMeta,
  VW_AGENTS,
  VW_AI_SUGGESTIONS_DEFAULT,
  VW_QUEUE,
  type AgentRow,
} from "./data";

type StatusMeta = { l: string; dot: string; bg: string };

const STATUS_META: Record<AgentRow["status"], StatusMeta> = {
  "on-call": { l: "On call", dot: "#FF3621", bg: "#FFF4F2" },
  "on-hold": { l: "On hold", dot: "#FFAB00", bg: "#FFF8E8" },
  wrapping: { l: "Wrapping", dot: "#2272B4", bg: "#EDF6FE" },
  available: { l: "Available", dot: "#00A972", bg: "#E8F7F0" },
  break: { l: "On break", dot: "#90A5B1", bg: "#F4F5F6" },
};

function SupAgentCard({ agent }: { agent: AgentRow }) {
  const sm = STATUS_META[agent.status];
  const onCall = agent.status === "on-call";
  const onHold = agent.status === "on-hold";
  const avail = agent.status === "available";
  const brk = agent.status === "break";
  const sent = agent.sentiment != null ? sentimentMeta(agent.sentiment) : null;
  const isHot = agent.flag === "sentiment";

  return (
    <div style={{
      background: "#fff",
      border: isHot ? "1px solid var(--db-lava-600)" : "1px solid var(--db-gray-lines)",
      borderRadius: 8, overflow: "hidden", position: "relative",
      boxShadow: isHot ? "0 0 0 3px rgba(255,54,33,0.12)" : "0 1px 2px rgba(11,32,38,0.06)",
      display: "flex", flexDirection: "column",
    }}>
      {isHot && (
        <div style={{
          position: "absolute", top: 0, right: 0, background: "var(--db-lava-600)", color: "#fff",
          fontSize: 10, fontWeight: 500, padding: "2px 8px", borderBottomLeftRadius: 6,
          display: "flex", alignItems: "center", gap: 4, textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          <VWIcon name="alert" size={10} color="#fff" /> Needs attention
        </div>
      )}
      <div style={{ padding: "14px 14px 10px", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 999, background: "var(--db-navy-800)", color: "#fff",
          display: "grid", placeItems: "center", fontSize: 13, fontWeight: 500, flexShrink: 0,
        }}>
          {agent.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--db-navy-800)" }}>{agent.name}</div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5, marginTop: 3,
            padding: "2px 8px", borderRadius: 999, background: sm.bg,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999, background: sm.dot,
              ...(onCall ? { boxShadow: "0 0 0 2px rgba(255,54,33,0.2)" } : {}),
            }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--db-navy-800)" }}>{sm.l}</span>
            {(onCall || onHold) && (
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--db-gray-text)" }}>
                · {fmtDur(agent.duration)}
              </span>
            )}
          </div>
        </div>
      </div>
      {agent.customer ? (
        <div style={{ padding: "0 14px 12px", flex: 1 }}>
          <div style={{ background: "var(--db-oat-light)", border: "1px solid var(--db-gray-lines)", borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--db-navy-800)", display: "flex", alignItems: "center", gap: 6 }}>
              <VWIcon name="user" size={11} color="var(--db-gray-text)" /> {agent.customer}
            </div>
            <div style={{ fontSize: 11, color: "var(--db-gray-text)", marginTop: 3, lineHeight: 1.4 }}>{agent.reason}</div>
            {sent && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
                  <span style={{ color: "var(--db-gray-text)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Sentiment</span>
                  <span style={{ color: sent.color, fontWeight: 500 }}>{sent.label}</span>
                </div>
                <div style={{ height: 4, background: "var(--db-oat-medium)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${agent.sentiment}%`, background: sent.color, borderRadius: 999 }} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding: "0 14px 16px", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 11, color: "var(--db-gray-text)", fontStyle: "italic" }}>
            {avail ? "Ready for next call" : brk ? "Back at 2:30 PM" : "Wrapping up"}
          </div>
        </div>
      )}
      <div style={{ padding: 10, borderTop: "1px solid var(--db-gray-lines)", display: "flex", gap: 6, background: "var(--db-oat-light)" }}>
        {onCall || onHold ? (
          <>
            <button style={{
              flex: 1, background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 5,
              padding: "6px 8px", fontSize: 11, color: "var(--db-navy-800)", fontWeight: 500,
              cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex",
              alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              <VWIcon name="eye" size={11} /> Monitor
            </button>
            <button style={{
              flex: 1, background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 5,
              padding: "6px 8px", fontSize: 11, color: "var(--db-navy-800)", fontWeight: 500,
              cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex",
              alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              <VWIcon name="volume" size={11} /> Whisper
            </button>
          </>
        ) : (
          <span style={{ flex: 1, fontSize: 11, color: "var(--db-gray-text)", textAlign: "center", padding: "6px 0" }}>
            {agent.calls} calls today · CSAT {agent.csat}
          </span>
        )}
      </div>
    </div>
  );
}

function SupKpi({
  label, value, delta, deltaTone, accent,
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: "up" | "down";
  accent?: string;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 8, padding: "14px 18px" }}>
      <div style={{ fontSize: 11, color: "var(--db-gray-text)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 500, color: accent || "var(--db-navy-800)", letterSpacing: "-0.015em", lineHeight: 1 }}>{value}</span>
        {delta && (
          <span style={{
            fontSize: 12,
            color: deltaTone === "up" ? "var(--db-green-700)" : deltaTone === "down" ? "var(--db-lava-700)" : "var(--db-gray-text)",
            fontWeight: 500,
          }}>{delta}</span>
        )}
      </div>
    </div>
  );
}

function SupKpi2({
  label, value, delta, deltaTone, sub,
}: {
  label: string; value: string; delta?: string; deltaTone?: "up" | "down"; sub?: string;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 8, padding: "14px 18px" }}>
      <div style={{ fontSize: 11, color: "var(--db-gray-text)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
        <span style={{ fontSize: 30, fontWeight: 500, color: "var(--db-navy-800)", letterSpacing: "-0.015em", lineHeight: 1 }}>{value}</span>
        {delta && (
          <span style={{
            fontSize: 12,
            color: deltaTone === "up" ? "var(--db-green-700)" : deltaTone === "down" ? "var(--db-lava-700)" : "var(--db-gray-text)",
            fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 3,
          }}>
            <VWIcon name={deltaTone === "up" ? "trend" : "trend-d"} size={11} />
            {delta}
          </span>
        )}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--db-gray-text)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function DailyVolumeChart() {
  const data = [142, 168, 201, 218, 210, 134, 98, 156, 189, 224, 241, 229, 148, 112, 172, 205, 238, 256, 244, 162, 124, 188, 221, 254, 272, 260, 178, 138, 195, 228];
  const max = Math.max(...data);
  const w = 720, h = 180, pad = 24;
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * step, h - pad - (v / max) * (h - pad * 2)] as const);
  const line = pts.map((p) => p.join(",")).join(" ");
  const last = pts[pts.length - 1];
  const area = `${pad},${h - pad} ${line} ${last[0]},${h - pad}`;
  return (
    <div style={{ background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 8, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--db-navy-800)" }}>Daily call volume</div>
          <div style={{ fontSize: 11, color: "var(--db-gray-text)", marginTop: 2 }}>
            Last 30 days · 5,847 total · +8.3% vs prior 30
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["7d", "30d", "90d"].map((p, i) => (
            <button key={p} style={{
              background: i === 1 ? "var(--db-navy-800)" : "var(--db-oat-light)",
              color: i === 1 ? "#fff" : "var(--db-navy-800)",
              border: "1px solid " + (i === 1 ? "var(--db-navy-800)" : "var(--db-gray-lines)"),
              borderRadius: 5, fontSize: 11, padding: "4px 10px", cursor: "pointer",
              fontFamily: "var(--font-sans)", fontWeight: 500,
            }}>{p}</button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad} y1={pad + (h - pad * 2) * f} x2={w - pad} y2={pad + (h - pad * 2) * f} stroke="#EEEDE9" strokeWidth="1" />
        ))}
        <polygon points={area} fill="rgba(255,54,33,0.08)" />
        <polyline points={line} fill="none" stroke="var(--db-lava-600)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.filter((_, i) => i % 7 === 0).map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#fff" stroke="var(--db-lava-600)" strokeWidth="2" />
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--db-gray-text)", fontFamily: "var(--font-mono)", marginTop: 6 }}>
        {["Apr 1", "Apr 8", "Apr 15", "Apr 22", "Apr 30"].map((d) => <span key={d}>{d}</span>)}
      </div>
    </div>
  );
}

function ReasonsBreakdown() {
  const reasons = [
    { l: "Shipping", v: 28, c: "var(--db-navy-800)" },
    { l: "Refund", v: 21, c: "var(--db-lava-600)" },
    { l: "Setup", v: 17, c: "var(--db-navy-600)" },
    { l: "Warranty", v: 12, c: "var(--db-yellow-600)" },
    { l: "Billing", v: 9, c: "var(--db-blue-600)" },
    { l: "Other", v: 13, c: "var(--db-navy-300)" },
  ];
  let acc = 0;
  const segs = reasons.map((r) => {
    const start = acc;
    acc += r.v;
    return { ...r, start, end: acc };
  });
  const total = 100;
  const polar = (deg: number, r: number): [number, number] => [
    80 + Math.cos(((deg - 90) * Math.PI) / 180) * r,
    80 + Math.sin(((deg - 90) * Math.PI) / 180) * r,
  ];
  const arc = (s: number, e: number) => {
    const [x1, y1] = polar((s / total) * 360, 60);
    const [x2, y2] = polar((e / total) * 360, 60);
    const [x3, y3] = polar((e / total) * 360, 38);
    const [x4, y4] = polar((s / total) * 360, 38);
    const big = (e - s) / total > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A 60 60 0 ${big} 1 ${x2} ${y2} L ${x3} ${y3} A 38 38 0 ${big} 0 ${x4} ${y4} Z`;
  };
  return (
    <div style={{ background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 8, padding: 18, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--db-navy-800)" }}>Reasons for contact</div>
      <div style={{ fontSize: 11, color: "var(--db-gray-text)", marginTop: 2, marginBottom: 14 }}>April 2026</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg viewBox="0 0 160 160" width="140" height="140">
          {segs.map((s) => <path key={s.l} d={arc(s.start, s.end)} fill={s.c} />)}
        </svg>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {reasons.map((r) => (
            <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: r.c }} />
              <span style={{ flex: 1, color: "var(--db-navy-800)" }}>{r.l}</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--db-gray-text)" }}>{r.v}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QueueHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["8", "10", "12", "14", "16", "18", "20"];
  const data: number[][] = [
    [0.3, 0.6, 0.7, 0.95, 0.9, 0.65, 0.3],
    [0.35, 0.65, 0.72, 0.92, 0.88, 0.6, 0.28],
    [0.32, 0.55, 0.6, 0.78, 0.7, 0.5, 0.25],
    [0.3, 0.5, 0.58, 0.7, 0.68, 0.45, 0.22],
    [0.25, 0.45, 0.5, 0.62, 0.58, 0.4, 0.2],
    [0.18, 0.3, 0.38, 0.42, 0.4, 0.32, 0.15],
    [0.12, 0.22, 0.28, 0.32, 0.3, 0.25, 0.1],
  ];
  return (
    <div style={{ background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 8, padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--db-navy-800)" }}>Queue load by day & hour</div>
      <div style={{ fontSize: 11, color: "var(--db-gray-text)", marginTop: 2, marginBottom: 14 }}>Heaviest: Mon–Tue, 1–4 PM</div>
      <div style={{ display: "grid", gridTemplateColumns: "36px repeat(7, 1fr)", gap: 4 }}>
        <span />
        {hours.map((h) => (
          <span key={h} style={{ fontSize: 10, color: "var(--db-gray-text)", textAlign: "center", fontFamily: "var(--font-mono)" }}>{h}</span>
        ))}
        {days.map((d, di) => (
          <Fragment key={d}>
            <span style={{ fontSize: 10, color: "var(--db-gray-text)", alignSelf: "center", fontFamily: "var(--font-mono)" }}>{d}</span>
            {data[di].map((v, hi) => (
              <div key={hi} style={{ aspectRatio: "1", background: `rgba(255,54,33,${v})`, borderRadius: 3 }} />
            ))}
          </Fragment>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 10, color: "var(--db-gray-text)" }}>
        <span>Light</span>
        {[0.15, 0.3, 0.5, 0.7, 0.95].map((v) => (
          <div key={v} style={{ width: 16, height: 8, background: `rgba(255,54,33,${v})`, borderRadius: 2 }} />
        ))}
        <span>Heavy</span>
      </div>
    </div>
  );
}

function AgentLeaderboard() {
  const rows = [
    { n: "Yuki Tanaka", av: "YT", calls: 412, csat: 4.92, aht: "6:14", resolution: 96, trend: "+0.08" },
    { n: "Hana Sato", av: "HS", calls: 398, csat: 4.89, aht: "6:32", resolution: 94, trend: "+0.05" },
    { n: "Marcus Chen", av: "MC", calls: 384, csat: 4.84, aht: "7:01", resolution: 93, trend: "+0.12" },
    { n: "Jamie Diaz", av: "JD", calls: 376, csat: 4.81, aht: "6:48", resolution: 92, trend: "+0.03" },
    { n: "Priya Shah", av: "PS", calls: 368, csat: 4.78, aht: "7:11", resolution: 91, trend: "-0.02" },
    { n: "Diego Morales", av: "DM", calls: 354, csat: 4.74, aht: "7:24", resolution: 89, trend: "+0.06" },
    { n: "Alex Rivera", av: "AR", calls: 339, csat: 4.69, aht: "7:42", resolution: 88, trend: "+0.04" },
    { n: "Emma O'Connor", av: "EO", calls: 328, csat: 4.81, aht: "6:55", resolution: 92, trend: "+0.07" },
    { n: "Zara Ahmed", av: "ZA", calls: 312, csat: 4.66, aht: "7:48", resolution: 87, trend: "+0.01" },
    { n: "Sofia Park", av: "SP", calls: 298, csat: 4.58, aht: "8:31", resolution: 84, trend: "-0.04" },
    { n: "Liam Foster", av: "LF", calls: 244, csat: 4.42, aht: "8:18", resolution: 81, trend: "-0.06" },
    { n: "Noah Bennett", av: "NB", calls: 234, csat: 4.21, aht: "8:54", resolution: 79, trend: "-0.11" },
  ];
  const headers: [string, "left" | "right"][] = [
    ["#", "left"], ["Agent", "left"], ["Calls", "right"], ["CSAT", "right"],
    ["Trend", "left"], ["AHT", "right"], ["Resolution", "right"],
  ];
  return (
    <div style={{ background: "#fff", border: "1px solid var(--db-gray-lines)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--db-gray-lines)", display: "flex", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--db-navy-800)" }}>Agent leaderboard · April 2026</div>
          <div style={{ fontSize: 11, color: "var(--db-gray-text)", marginTop: 2 }}>Sorted by CSAT · 12 agents</div>
        </div>
        <button className="vw-btn vw-btn-ghost" style={{ marginLeft: "auto" }}>
          <VWIcon name="file" size={12} /> Export
        </button>
      </div>
      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "var(--db-oat-light)" }}>
              {headers.map(([h, align]) => (
                <th key={h} style={{
                  textAlign: align, padding: "9px 14px", fontSize: 10, textTransform: "uppercase",
                  letterSpacing: "0.06em", color: "var(--db-gray-text)", fontWeight: 500,
                  borderBottom: "1px solid var(--db-gray-lines)",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const trendUp = r.trend.startsWith("+");
              return (
                <tr key={r.n} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--db-gray-lines)" : 0 }}>
                  <td style={{ padding: "10px 14px", color: "var(--db-gray-text)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{i + 1}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 999, background: "var(--db-navy-800)", color: "#fff", fontSize: 10, fontWeight: 500, display: "grid", placeItems: "center" }}>{r.av}</div>
                      <span style={{ color: "var(--db-navy-800)", fontWeight: 500 }}>{r.n}</span>
                      {i === 0 && <VWIcon name="star" size={12} color="var(--db-yellow-600)" />}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--db-navy-800)" }}>{r.calls}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      color: r.csat >= 4.7 ? "var(--db-green-700)" : r.csat >= 4.5 ? "var(--db-navy-800)" : "var(--db-lava-700)",
                      fontWeight: 500,
                    }}>{r.csat.toFixed(2)}</span>
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "left" }}>
                    <span style={{
                      fontSize: 11, color: trendUp ? "var(--db-green-700)" : "var(--db-lava-700)",
                      display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "var(--font-mono)",
                    }}>
                      <VWIcon name={trendUp ? "trend" : "trend-d"} size={10} />
                      {r.trend}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--db-gray-text)" }}>{r.aht}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 50, height: 5, background: "var(--db-oat-medium)", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{
                          width: `${r.resolution}%`, height: "100%",
                          background: r.resolution >= 90 ? "var(--db-green-600)" : r.resolution >= 85 ? "var(--db-yellow-600)" : "var(--db-lava-600)",
                        }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--db-navy-800)", width: 24, textAlign: "right" }}>{r.resolution}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type SupChatMsg = { id: string; from: "ai" | "user"; text: string };

function SupAssistRail() {
  const greeting: SupChatMsg = {
    id: "init",
    from: "ai",
    text: "Ask about team performance, individual agents, queue trends, or coaching opportunities. I can also help you draft 1:1 notes.",
  };
  const [msgs, setMsgs] = useState<SupChatMsg[]>([greeting]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, streaming]);

  const ask = async (q: string) => {
    if (!q.trim() || streaming) return;
    const userMsg: SupChatMsg = { id: crypto.randomUUID(), from: "user", text: q.trim() };
    const aiMsg: SupChatMsg = { id: crypto.randomUUID(), from: "ai", text: "" };
    const next = [...msgs, userMsg];
    setMsgs([...next, aiMsg]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const sysContext =
      "You are Voltway Assist Floor — a supervisor analytics assistant for a customer support team of 12 agents. Be concise, focus on team metrics, coaching, and queue trends.";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: sysContext },
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
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
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
            // skip
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setMsgs((prev) => {
        const u = [...prev];
        u[u.length - 1] = { ...u[u.length - 1], text: "Sorry, I had trouble reaching the assistant." };
        return u;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const suggestions = VW_AI_SUGGESTIONS_DEFAULT;

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
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--db-navy-800)" }}>Voltway Assist · Floor</div>
          <div style={{ fontSize: 11, color: "var(--db-gray-text)" }}>Team analytics + coaching</div>
        </div>
        <button style={{ background: "transparent", border: 0, padding: 4, cursor: "pointer", color: "var(--db-gray-text)" }}>
          <VWIcon name="settings" size={15} />
        </button>
      </div>
      <div ref={scrollRef} style={{
        flex: 1, overflow: "auto", padding: "16px 18px", background: "var(--db-oat-light)",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {msgs.map((m) => (
          <div key={m.id} style={{ display: "flex", flexDirection: m.from === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-start" }}>
            {m.from === "ai" && (
              <div style={{ width: 22, height: 22, borderRadius: 5, background: "var(--db-lava-600)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 2 }}>
                <VWIcon name="sparkles" size={11} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth: "88%",
              background: m.from === "user" ? "var(--db-navy-800)" : "#fff",
              color: m.from === "user" ? "#fff" : "var(--db-navy-800)",
              border: m.from === "user" ? 0 : "1px solid var(--db-gray-lines)",
              borderRadius: 8, padding: "9px 11px", fontSize: 12.5, lineHeight: 1.55,
              whiteSpace: m.from === "user" ? "pre-wrap" : "normal",
            }}>
              {m.from === "ai"
                ? (m.text ? <MessageResponse>{m.text}</MessageResponse> : streaming ? <DotPulse /> : null)
                : m.text}
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
            placeholder="Ask about the team…"
            disabled={streaming}
            style={{
              flex: 1, border: 0, background: "transparent", outline: "none",
              fontSize: 13, fontFamily: "var(--font-sans)", color: "var(--db-navy-800)", padding: "6px 8px",
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

function DotPulse() {
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: 999, background: "var(--db-lava-600)",
          animation: `vw-dot 1s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </span>
  );
}

type SupTab = "live" | "perf";
type SupFilter = "all" | "on-call" | "flagged" | "available";

export function SupervisorView({ defaultTab = "live" }: { defaultTab?: SupTab }) {
  const [filter, setFilter] = useState<SupFilter>("all");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [tab, setTab] = useState<SupTab>(defaultTab);

  const onCallCount = VW_AGENTS.filter((a) => a.status === "on-call" || a.status === "on-hold").length;
  const flagged = VW_AGENTS.filter((a) => a.flag).length;
  const filtered = VW_AGENTS.filter((a) => {
    if (filter === "on-call") return a.status === "on-call" || a.status === "on-hold";
    if (filter === "flagged") return !!a.flag;
    if (filter === "available") return a.status === "available" || a.status === "break" || a.status === "wrapping";
    return true;
  });

  return (
    <div className="vw-root" style={{
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
    }}>
      <VWAppBar agentName="Sasha Wright" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", flex: 1, minHeight: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
      <div style={{ padding: "20px 28px 0", background: "var(--db-oat-light)", borderBottom: "1px solid var(--db-gray-lines)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div className="vw-eyebrow-light" style={{ marginBottom: 4 }}>Supervisor view · Team Alpha</div>
            <h1 style={{ fontSize: 26, fontWeight: 500, margin: 0, color: "var(--db-navy-800)", letterSpacing: "-0.015em" }}>
              {tab === "live" ? `Live floor — 12 agents, ${onCallCount} on call` : "Performance — April 2026"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="vw-btn vw-btn-ghost"><VWIcon name="settings" size={12} /> Configure</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {([
            ["live", "Live floor", "eye"],
            ["perf", "Performance", "trend"],
          ] as const).map(([k, l, ic]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: "transparent", border: 0, padding: "10px 14px", fontSize: 13, fontFamily: "var(--font-sans)",
              color: tab === k ? "var(--db-navy-800)" : "var(--db-gray-text)",
              fontWeight: tab === k ? 500 : 400,
              borderBottom: tab === k ? "2px solid var(--db-lava-600)" : "2px solid transparent",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: -1,
            }}>
              <VWIcon name={ic} size={13} color={tab === k ? "var(--db-lava-600)" : "currentColor"} />
              {l}
            </button>
          ))}
        </div>
      </div>

      {tab === "live" ? (
        <>
          <div style={{ padding: "16px 28px", background: "var(--db-oat-light)", borderBottom: "1px solid var(--db-gray-lines)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              <SupKpi label="In queue" value={VW_QUEUE.waiting} delta="+2 in 5m" deltaTone="down" accent="var(--db-navy-800)" />
              <SupKpi label="Longest wait" value={VW_QUEUE.longestWait} delta="threshold 3:00" deltaTone="down" accent="var(--db-lava-700)" />
              <SupKpi label="SLA today" value={`${VW_QUEUE.slaPct}%`} delta="+1.2 pts" deltaTone="up" accent="var(--db-green-700)" />
              <SupKpi label="Avg sentiment" value="64" delta="-4 vs yesterday" deltaTone="down" />
              <SupKpi label="Flagged calls" value={flagged} delta="needs review" deltaTone="down" accent="var(--db-lava-700)" />
            </div>
          </div>

          <div style={{
            padding: "12px 28px", background: "#fff", borderBottom: "1px solid var(--db-gray-lines)",
            display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
          }}>
            <div style={{ display: "flex", background: "var(--db-oat-light)", border: "1px solid var(--db-gray-lines)", borderRadius: 6, padding: 2 }}>
              {([
                ["all", `All · ${VW_AGENTS.length}`],
                ["on-call", `On call · ${onCallCount}`],
                ["flagged", `Flagged · ${flagged}`],
                ["available", "Available"],
              ] as const).map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)} style={{
                  background: filter === k ? "#fff" : "transparent",
                  color: filter === k ? "var(--db-navy-800)" : "var(--db-gray-text)",
                  border: 0, padding: "5px 12px", borderRadius: 4, fontSize: 12, fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: filter === k ? "0 1px 2px rgba(11,32,38,0.06)" : "none",
                  fontFamily: "var(--font-sans)",
                }}>{l}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "var(--db-oat-light)", border: "1px solid var(--db-gray-lines)", borderRadius: 6, flex: 1, maxWidth: 280 }}>
              <VWIcon name="search" size={13} color="var(--db-gray-text)" />
              <input placeholder="Find agent or customer…" style={{
                border: 0, background: "transparent", outline: "none", fontSize: 12, flex: 1,
                fontFamily: "var(--font-sans)", color: "var(--db-navy-800)",
              }} />
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 4, background: "var(--db-oat-light)", border: "1px solid var(--db-gray-lines)", borderRadius: 6, padding: 2 }}>
              {(["grid", "list"] as const).map((k) => (
                <button key={k} onClick={() => setLayout(k)} style={{
                  background: layout === k ? "#fff" : "transparent",
                  border: 0, padding: 6, borderRadius: 4, cursor: "pointer", display: "grid", placeItems: "center",
                  boxShadow: layout === k ? "0 1px 2px rgba(11,32,38,0.06)" : "none",
                  color: layout === k ? "var(--db-navy-800)" : "var(--db-gray-text)",
                }}>
                  <VWIcon name={k} size={13} />
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: layout === "grid" ? "repeat(4, minmax(240px, 1fr))" : "1fr",
              gap: 12,
            }}>
              {filtered.map((a) => <SupAgentCard key={a.id} agent={a} />)}
            </div>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflow: "auto", padding: "20px 28px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            <SupKpi2 label="Total calls" value="5,847" delta="+8.3%" deltaTone="up" sub="vs March 2026" />
            <SupKpi2 label="Avg CSAT" value="4.71" delta="+0.04" deltaTone="up" sub="out of 5.0" />
            <SupKpi2 label="Avg handle time" value="7:24" delta="-12s" deltaTone="up" sub="target 7:30" />
            <SupKpi2 label="First-call resolution" value="89%" delta="+1.6 pts" deltaTone="up" sub="industry avg 71%" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <DailyVolumeChart />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 12, marginBottom: 16 }}>
            <ReasonsBreakdown />
            <QueueHeatmap />
          </div>
          <AgentLeaderboard />
        </div>
      )}
        </div>
        <SupAssistRail />
      </div>
    </div>
  );
}
