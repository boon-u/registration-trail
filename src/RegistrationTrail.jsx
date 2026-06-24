import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Target, Compass, Sparkles, ArrowLeft, ChevronRight,
  Star, Link2, ExternalLink, IdCard, Mic, BookOpen
} from "lucide-react";

/*
  REGISTRATION TRAIL: self-paced training.
  Open world map: all worlds unlocked, jump around in any order.
  Reflection answers go in Microsoft Forms (share the link separately).

  >>> EDIT THE QUESTIONS: every { type:"discuss", ... } prompt below is a
      placeholder for you to reword. Each needs a unique id if you wire answers later.
      Discuss blocks are live group discussion, no Forms answer.
      { type:"scenario", ... } blocks set the scene; wrap key terms in { red: "..." }.
*/

const C = {
  ink: "#14283C", inkSoft: "#4A5C70", paper: "#FBFAF6", card: "#FFFFFF", line: "#E7E2D6",
  teal: "#0E9C8A", tealSoft: "#E2F4F1", gold: "#F2B53B", goldSoft: "#FCF1D8",
  gray: "#94A3B8", blue: "#2D7FF9", green: "#2FB872",
  blueSoft: "#E8F1FF", greenSoft: "#E4F6EC", redSoft: "#FBE9E7", red: "#E2563B",
  ipPreAdmitSoft: "#E8E4F4", ipPreAdmit: "#6B5BB5",
  ipActive: "#2D5F9F", ipActiveDark: "#1A3F6B",
  ipDischarge: "#9A6B45", ipDischargeDark: "#6B4A2E",
};
const LEVEL_CONTENT_MAX = 840;
const MASCOTS = [
  "🦊","🦉","🦦","🦭","🐳","🫎","🦫","🐢","🦀","🐙",
  "🐧","🦌","🦅","🐺","🐿️","🦡","🐻","🐼","🐨","🐯",
  "🦁","🐮","🐷","🐸","🐵","🐔","🐤","🦆","🦢","🦩",
  "🦜","🦚","🐦","🕊️","🐁","🐇","🦔","🦄","🐴","🦓",
  "🦒","🦘","🐂","🐄","🐎","🐏","🐑","🦙","🐐","🐕",
  "🐩","🦮","🐈","🐈‍⬛","🦃","🐋","🐬","🦈","🐟","🐠",
  "🐡","🦐","🦑","🐌","🦋","🐛","🐝","🪲","🐞","🦗",
];
const SANDBOX = {
  healthCard: "5012 468 503",
  dob: "14-Mar-1987",
};
const formatExpiry = () => {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d.getDate()).padStart(2, "0")}-${m[d.getMonth()]}-${d.getFullYear()}`;
};
const formatCertDate = () => {
  const d = new Date();
  const m = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
};
const FORMS_URL = import.meta.env.VITE_FORMS_URL || "";

function smoothPath(pts) {
  if (pts.length < 2) return "";
  const d = [`M ${pts[0].x} ${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

const LEVELS = [
  {
    id: "setup", name: "Base Camp", sub: "Set up your tools",
    blocks: [
      { type: "do", goal: "Before anything else, open the App Bar in the CIS sandbox." },
      { type: "do", goal: "Configure the App Bar to float, use large icons, and turn off ‘always on top’." },
      { type: "discuss", id: "setup_appbar_why", prompt: "Why do we add applications to the App Bar when we can already access them from the Storefront?" },
      { type: "do", goal: "Open PM Office. Explore the sections, the UI, and the features it offers. Ask your peer mentor if you want to know about something specific." },
      { type: "do", goal: "Create a custom group and add: Add/Modify Person Conversation, Expiring Health Cards Work List, Today’s Expected Arrivals Inquiry, OP Ambulatory Registration Conversation, PreReg, and PreAdmit." },
      { type: "discuss", id: "setup_group_why", prompt: "Why pin features into a custom group instead of opening each section every time?" },
      { type: "do", goal: "Create a test patient using the name, health card number, and date of birth you were assigned." },
      { type: "discuss", id: "setup_profile_check", prompt: "What are the best practices to confirm the patient profile is not already in the CIS system before rushing to create a new profile?" },
    ],
  },
  {
    id: "enc101", name: "Encounters 101", sub: "The concept that matters most",
    blocks: [
      { type: "concept", title: "What an encounter is",
        body: "An encounter is a specific, single interaction, visit, or episode of care between a patient and the health organization. It links everything for that visit: registration, orders, documentation, meds." },
      { type: "encdemo" },
      { type: "discuss", id: "enc101_when", prompt: "When do you create a NEW encounter, and when do you choose an EXISTING one?" },
      { type: "quiz", id: "enc101_q1", question: "A patient returns two weeks later for a completely separate new visit. What do you do?",
        options: ["Reuse the old encounter", "Create a new encounter", "Encounters are optional here"],
        answerIndex: 1, explain: "A separate visit is a new episode of care, so it needs its own encounter." },
    ],
  },
  {
    id: "outpatient", name: "Outpatient Journey", sub: "Pre-reg → outpatient",
    blocks: [
      { type: "scenario", segments: [
        "A patient with a suspected peanut allergy will be attending a ",
        { red: "scheduled" },
        " clinic visit in the IWK Allergy book. Book the appointment for a future date and set them up as ",
        { red: "pre-registered" },
        " now, using the details you already have. Keep everything ready for the day of the visit. When the patient arrives, check them in so registration at the desk goes faster.",
      ] },
      { type: "do", id: "out_schappbook", goal: "Open SchAppBook. Familiarize yourself with the options and features it offers." },
      { type: "concept", id: "out_grid_colours", title: "The colours on the grid", collapsible: true, unlockAfter: "out_schappbook",
        lockedHint: "Try this in SchAppBook first, then tap here to reveal the colour guide.",
        colourKey: [
          { swatch: C.gray, name: "Gray", status: "Pending (not confirmed)" },
          { swatch: C.blue, name: "Blue", status: "Confirmed" },
          { swatch: C.green, name: "Green", status: "Checked in" },
        ],
        footnote: "Same colours this trail uses for your levels." },
      
      { type: "do", goal: "Schedule an appointment for your test patient. Try all three methods: Schedule, Suggest, Drag-and-drop." },
      { type: "flow", id: "out_op_journey", title: "The outpatient journey",
        intro: "Tap Next to reveal each stage, from scheduling in SchAppBook to auto-discharge at end of day." },
      { type: "rope", prompt: "Drag the thread from the appointment and connect it to the correct encounter.",
        appointment: "New clinic appointment",
        targets: [
          { label: "Yesterday's encounter", sub: "past visit", correct: false },
          { label: "New encounter", sub: "Create for this visit", correct: true },
          { label: "Next months's encounter", sub: "appt. at DGH", correct: false },
        ] },
      { type: "do", goal: "Check in the patient when they ‘arrive’. Watch the encounter transition and the colour change." },
    ],
  },
  {
    id: "inpatient", name: "Inpatient Journey", sub: "Pre-admit → inpatient",
    blocks: [
      { type: "concept", title: "A new admission is a new episode",
        body: "Days later the same patient is admitted. A pre-admit is created (like pre-reg, but for admission), then flips to an inpatient encounter." },
      { type: "flow", id: "inp_journey", flow: "inpatient", title: "The inpatient journey",
        intro: "Tap Next to reveal each stage, from pre-admit through manual discharge." },
      { type: "do", goal: "Place the patient on the bed board, note the gender colours, then discharge when the go-ahead is given." },
    ],
  },
  {
    id: "recurring", name: "Recurring Appointments", sub: "pretty easy! right?",
    blocks: [
      { type: "concept", title: "Everything you've learned, on repeat",
        body: "Recurring appointments reuse it all: choosing vs creating encounters, check-in, and service interactions. This level is demo-led." },
      { type: "recurring" },
      { type: "do", goal: "Follow the recurring-appointment demo, then book one recurring series for your patient." },
    ],
  },
  {
    id: "groups", name: "Group Sessions", sub: "Let's do it!",
    blocks: [
      { type: "do", goal: "Create a group container with __ member capacity, then add your patient." },
      { type: "groupdemo" },
    ],
  },
  {
    id: "boss", name: "Final Test", sub: "Fix the broken encounter", boss: true,
    blocks: [
      { type: "concept", title: "The mistake that happened at Go-Live",
        body: "An appointment got mapped to the WRONG encounter: exactly the slip that happened repeatedly during go-live. Your job: spot it and re-map it." },
      { type: "bossmap" },

      { type: "do", goal: "In the system: disassociate the incorrect encounter and re-map the appointment to the correct one." },

      
    ],
  },
];

const font = `'Inter', system-ui, sans-serif`;
const display = `'Baloo 2', system-ui, sans-serif`;

function ScenarioBlock({ b }) {
  return (
    <div style={{
      background: C.blueSoft, border: `2px solid ${C.blue}`, borderRadius: 16,
      padding: 20, marginBottom: 14,
    }}>
      <div style={rowHead}>
        <BookOpen size={18} style={{ color: C.blue }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: C.blue, fontSize: 13 }}>SCENARIO</span>
      </div>
      <p style={{ margin: 0, color: C.ink, lineHeight: 1.65, fontSize: 15, fontWeight: 500 }}>
        {b.segments.map((part, i) =>
          typeof part === "string"
            ? <span key={i}>{part}</span>
            : <span key={i} style={{ color: C.red, fontWeight: 800 }}>{part.red}</span>
        )}
      </p>
    </div>
  );
}

function ColourLegend({ items, footnote }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((row) => (
          <div key={row.name} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: row.swatch, border: `2px solid ${row.swatch === C.gray ? "#7A8A9E" : row.swatch}`,
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.25)",
            }} />
            <span style={{ color: C.inkSoft, fontSize: 18, fontWeight: 600, lineHeight: 1 }} aria-hidden>→</span>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 16, color: row.swatch, minWidth: 52 }}>{row.name}</span>
            <span style={{ color: C.ink, fontSize: 14, lineHeight: 1.45 }}>{row.status}</span>
          </div>
        ))}
      </div>
      {footnote && (
        <p style={{ margin: "14px 0 0", color: C.inkSoft, fontSize: 13, lineHeight: 1.5, fontStyle: "italic" }}>{footnote}</p>
      )}
    </div>
  );
}

function ConceptBody({ b }) {
  if (b.colourKey) return <ColourLegend items={b.colourKey} footnote={b.footnote} />;
  return <p style={{ margin: 0, color: C.ink, lineHeight: 1.6 }}>{b.body}</p>;
}

function ConceptBlock({ b, doneSteps }) {
  const unlocked = !b.unlockAfter || doneSteps?.[b.unlockAfter];
  const [open, setOpen] = useState(false);
  const prevUnlocked = useRef(unlocked);

  useEffect(() => {
    if (!prevUnlocked.current && unlocked && b.collapsible) setOpen(true);
    prevUnlocked.current = unlocked;
  }, [unlocked, b.collapsible]);

  if (b.collapsible) {
    return (
      <div style={{
        ...cardBox,
        opacity: unlocked ? 1 : 0.92,
        border: unlocked ? `1px solid ${C.line}` : `1px dashed ${C.gray}`,
        background: unlocked ? C.card : "#F8FAFC",
      }}>
        <button type="button" onClick={() => unlocked && setOpen((v) => !v)} disabled={!unlocked}
          className={unlocked ? "rt-interactive-tap" : undefined}
          style={{
            width: "100%", border: "none", background: "transparent", cursor: unlocked ? "pointer" : "not-allowed",
            textAlign: "left", padding: 0, font: "inherit", color: "inherit",
          }}>
          <div style={{ ...rowHead, marginBottom: unlocked && open ? 8 : 0 }}>
            <Compass size={18} style={{ color: unlocked ? C.teal : C.gray }} />
            <h3 style={{ margin: 0, fontFamily: display, fontSize: 20, color: unlocked ? C.ink : C.inkSoft, flex: 1 }}>
              {b.title}
            </h3>
            {unlocked && (
              <ChevronRight size={20} style={{
                color: C.teal, flexShrink: 0, transition: "transform .2s",
                transform: open ? "rotate(90deg)" : "none",
              }} />
            )}
          </div>
        </button>
        {!unlocked && (
          <p style={{ margin: 0, color: C.inkSoft, lineHeight: 1.55, fontSize: 14 }}>{b.lockedHint}</p>
        )}
        {unlocked && !open && (
          <p style={{ margin: 0, color: C.inkSoft, fontSize: 13, lineHeight: 1.5 }}>Tap to reveal</p>
        )}
        {unlocked && open && <ConceptBody b={b} />}
      </div>
    );
  }

  return (
    <div style={cardBox}>
      <div style={rowHead}><Compass size={18} style={{ color: C.teal }} />
        <h3 style={{ margin: 0, fontFamily: display, fontSize: 20, color: C.ink }}>{b.title}</h3></div>
      <ConceptBody b={b} />
    </div>
  );
}

function DoBlock({ b, doneSteps, onDone }) {
  const done = !!(b.id && doneSteps?.[b.id]);
  return (
    <div style={cardBox}>
      <div style={rowHead}><Target size={18} style={{ color: C.blue }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: C.blue, fontSize: 13 }}>TRY IT YOURSELF</span></div>
      <p style={{ margin: "0 0 12px", color: C.ink, lineHeight: 1.6, fontWeight: 500 }}>{b.goal}</p>
      {b.id && (
        <button type="button" className={done ? undefined : "rt-interactive-tap"} onClick={() => onDone(b.id)} disabled={done} style={{
          ...primaryBtn, width: "100%", justifyContent: "center",
          background: done ? C.greenSoft : C.blue, color: done ? C.green : "#fff",
          border: done ? `1px solid ${C.green}` : "none", cursor: done ? "default" : "pointer",
        }}>
          {done ? "✓ Explored in SchAppBook" : "I've explored SchAppBook"}
        </button>
      )}
    </div>
  );
}

function GateBlock({ b }) {
  const [choice, setChoice] = useState(null);
  const correct = choice === b.correct;
  const pick = (v) => { if (!choice) setChoice(v); };
  return (
    <div style={{ background: "#FFFDF7", border: `2px dashed ${C.gold}`, borderRadius: 16, padding: 20, marginBottom: 14 }}>
      <div style={rowHead}><Sparkles size={18} style={{ color: C.gold }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: "#B8851A", fontSize: 13 }}>ENCOUNTER DECISION</span></div>
      <p style={{ margin: "0 0 14px", color: C.ink, lineHeight: 1.6, fontWeight: 500 }}>{b.scenario}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[["new", "Create new encounter"], ["existing", "Choose existing"]].map(([v, label]) => (
          <button key={v} className={choice ? undefined : "rt-interactive-tap"} onClick={() => pick(v)} disabled={!!choice} style={{ ...gateBtn, cursor: choice ? "default" : "pointer",
            borderColor: choice === v ? (v === b.correct ? C.green : C.red) : C.line,
            background: choice === v ? (v === b.correct ? C.greenSoft : C.redSoft) : C.card }}>{label}</button>))}
      </div>
      {choice && <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 12, background: correct ? C.greenSoft : C.redSoft }}>
        <span style={{ fontWeight: 700, color: correct ? C.green : C.red, fontFamily: display }}>{correct ? "Correct" : "Not quite"}</span>
        <p style={{ margin: "2px 0 0", color: C.ink, fontSize: 14, lineHeight: 1.55 }}>{b.rationale}</p></div>}
    </div>
  );
}

function RopeGame({ b }) {
  const xs = [95, 280, 465];
  const anchor = { x: 280, y: 124 };
  const targetY = 294;
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [pointer, setPointer] = useState(null);
  const [solved, setSolved] = useState(false);
  const [connectedIdx, setConnectedIdx] = useState(null);
  const [shake, setShake] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(null);

  const toSvg = (e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return null;
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  const nearestTarget = (p) => {
    if (!p) return -1;
    let best = -1, bestD = 999;
    xs.forEach((x, i) => {
      const d = Math.hypot(p.x - x, p.y - targetY);
      if (d < 58 && d < bestD) { best = i; bestD = d; }
    });
    return best;
  };

  const connectTo = (idx) => {
    if (solved) return;
    if (b.targets[idx].correct) {
      setConnectedIdx(idx);
      setSolved(true);
      setPointer({ x: xs[idx], y: targetY });
      setDragging(false);
    } else {
      setWrongFlash(idx);
      setShake(true);
      setTimeout(() => { setShake(false); setWrongFlash(null); }, 450);
      setPointer(null);
      setDragging(false);
    }
  };

  const onMove = (e) => {
    if (!dragging || solved) return;
    const p = toSvg(e);
    if (p) setPointer(p);
  };

  const onUp = (e) => {
    if (!dragging || solved) return;
    const p = toSvg(e) || pointer;
    const hit = nearestTarget(p);
    if (hit >= 0) connectTo(hit);
    else { setDragging(false); setPointer(null); }
  };

  const ropeEnd = () => {
    if (solved && connectedIdx !== null) return { x: xs[connectedIdx], y: targetY };
    if (pointer) return pointer;
    return { x: anchor.x, y: anchor.y + 72 };
  };

  const end = ropeEnd();
  const midY = (anchor.y + end.y) / 2 + 28;
  const ropePath = `M ${anchor.x} ${anchor.y} Q ${(anchor.x + end.x) / 2} ${midY} ${end.x} ${end.y}`;
  const hoverIdx = !solved && pointer ? nearestTarget(pointer) : -1;
  const apptClass = solved ? "appt-land" : shake ? "rope-shake" : "rope-swing";
  const land = solved && connectedIdx !== null
    ? { dx: xs[connectedIdx] - 280, dy: targetY - anchor.y - 24 } : undefined;

  return (
    <div style={cardBox}>
      <div style={rowHead}><Link2 size={18} style={{ color: C.teal }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: C.teal, fontSize: 13 }}>CONNECT THE ENCOUNTER</span></div>
      <p style={{ margin: "0 0 6px", color: C.ink, lineHeight: 1.6, fontWeight: 500 }}>{b.prompt}</p>
      <svg ref={svgRef} viewBox="0 0 560 340" style={{ width: "100%", height: "auto", display: "block", touchAction: "none", userSelect: "none" }}
        role="group" aria-label="Drag the thread to connect the appointment to the correct encounter"
        onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        <defs>
          <filter id="ropeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#11202E" floodOpacity="0.2" />
          </filter>
        </defs>
        <rect x="40" y="58" width="480" height="10" rx="5" fill={C.line} />
        <path d={ropePath} fill="none"
          stroke={solved ? C.green : dragging ? C.teal : C.gray}
          strokeWidth={solved ? 4.5 : 3.5} strokeLinecap="round"
          className={solved ? "thread-on" : ""} filter="url(#ropeShadow)" />
        <g className={apptClass} style={{ transform: land ? `translate(${land.dx}px, ${land.dy}px)` : undefined }}>
          <line x1="280" y1="66" x2="280" y2="80" stroke={C.gray} strokeWidth="2.5" />
          <rect x="210" y="78" width="140" height="46" rx="11" fill={C.blueSoft} stroke={C.blue} strokeWidth="2" />
          <text x="280" y="100" textAnchor="middle" fontFamily={display} fontWeight="700" fontSize="13" fill={C.blue}>appointment</text>
          <text x="280" y="115" textAnchor="middle" fontFamily={font} fontSize="10" fill={C.inkSoft}>{b.appointment}</text>
          <circle cx={anchor.x} cy={anchor.y} r="5" fill={C.gray} />
        </g>
        {!solved && (
          <g className={dragging ? undefined : "rt-interactive-drag"} style={{ cursor: dragging ? "grabbing" : "grab" }}
            onPointerDown={(e) => {
              e.preventDefault();
              setDragging(true);
              const p = toSvg(e);
              if (p) setPointer(p);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}>
            <circle cx={end.x} cy={end.y} r="16" fill={C.teal} stroke="#fff" strokeWidth="2.5" />
            <circle cx={end.x} cy={end.y} r="22" fill="none" stroke={C.teal} strokeWidth="1.5" strokeDasharray="3 4" opacity="0.5" />
          </g>
        )}
        {b.targets.map((t, i) => {
          const on = solved && connectedIdx === i;
          const wrong = wrongFlash === i;
          const hover = hoverIdx === i && !solved;
          return (
            <g key={"tg" + i} className={solved ? undefined : "rt-interactive-tap"}
              onClick={() => !solved && connectTo(i)}
              style={{ cursor: solved ? "default" : "pointer" }}
              role="button" aria-label={t.label} tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" && !solved) connectTo(i); }}>
              <circle cx={xs[i]} cy={266} r="8" fill={on ? C.green : hover ? C.teal : C.line} stroke={on ? C.green : C.gray} strokeWidth="2" />
              <rect x={xs[i] - 78} y="266" width="156" height="56" rx="13"
                fill={on ? C.greenSoft : wrong ? C.redSoft : hover ? C.tealSoft : C.card}
                stroke={on ? C.green : wrong ? C.red : hover ? C.teal : C.line} strokeWidth={hover || on ? 2.5 : 2} />
              <text x={xs[i]} y="290" textAnchor="middle" fontFamily={display} fontWeight="700" fontSize="13"
                fill={on ? C.green : wrong ? C.red : C.ink}>{t.label}</text>
              <text x={xs[i]} y="306" textAnchor="middle" fontFamily={font} fontSize="11" fill={C.inkSoft}>{t.sub}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ textAlign: "center", marginTop: 4, fontFamily: display, fontWeight: 700,
        color: solved ? C.green : C.inkSoft, fontSize: 14 }}>
        {solved
          ? <span><Link2 size={15} style={{ verticalAlign: -2 }} /> Connected to the right encounter</span>
          : "Drag the teal knot to an encounter, or tap one to connect"}
      </div>
    </div>
  );
}

const BOSS_MESSY_ENCS = [
  { id: "t1", encId: "IWK000012", sub: "prior allergy visit", y: 18 },
  { id: "wrong", encId: "IWK000027", sub: "wrong, mapped here", y: 62 },
  { id: "t2", encId: "IWK000031", sub: "duplicate profile", y: 106 },
  { id: "t3", encId: "IWK000019", sub: "last month OP", y: 150 },
  { id: "t4", encId: "InBtwnVst02", sub: "in-between visit", y: 194 },
];

const BOSS_CORRECT_ENC = {
  id: "correct", encId: "IWK000008", sub: "this visit, no links yet", y: 318,
};

const BOSS_MESSY_TANGLES = [
  ["t1", "wrong"], ["wrong", "t2"], ["t1", "t2"], ["t2", "t3"], ["t3", "t4"],
  ["t1", "t3"], ["wrong", "t4"], ["t2", "t4"], ["t1", "t4"], ["wrong", "t3"],
];

const BOSS_KNOTS = [
  { x: 418, y: 52 }, { x: 432, y: 98 }, { x: 405, y: 128 },
  { x: 428, y: 168 }, { x: 412, y: 88 }, { x: 425, y: 142 },
];

const SCISSOR_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>"
  + "<text x='4' y='22' font-size='22'>✂</text></svg>",
)}") 14 14, crosshair`;

function BossMappingGame() {
  const APPT = { x: 48, y: 148, w: 152, anchorX: 200, anchorY: 192 };
  const MESSY_X = 448, ENC_W = 152, MESSY_ANCHOR = MESSY_X;
  const CORRECT_X = 408, CORRECT_W = 168, CORRECT_ANCHOR = CORRECT_X;

  const messyY = (id) => BOSS_MESSY_ENCS.find((e) => e.id === id).y + 20;
  const correctY = BOSS_CORRECT_ENC.y + 22;

  const svgRef = useRef(null);
  const [cutting, setCutting] = useState(false);
  const [cut, setCut] = useState(false);
  const [phase, setPhase] = useState("cut");
  const [dragging, setDragging] = useState(false);
  const [pointer, setPointer] = useState(null);
  const [done, setDone] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);

  const threadCurve = (x1, y1, x2, y2, bend = 28) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} Q ${mx + bend} ${my} ${x2} ${y2}`;
  };

  const messyThread = (x1, y1, x2, y2, i) =>
    threadCurve(x1, y1, x2, y2, (i % 2 === 0 ? 1 : -1) * (35 + (i % 5) * 14));

  const toSvg = (e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return null;
    return pt.matrixTransform(m.inverse());
  };

  const wrongY = messyY("wrong");
  const cutMid = { x: (APPT.anchorX + MESSY_ANCHOR) / 2, y: (APPT.anchorY + wrongY) / 2 };
  const redThread = threadCurve(APPT.anchorX, APPT.anchorY, MESSY_ANCHOR, wrongY, 20);
  const redThreadLeft = threadCurve(APPT.anchorX, APPT.anchorY, cutMid.x, cutMid.y, 12);
  const redThreadRight = threadCurve(cutMid.x, cutMid.y, MESSY_ANCHOR, wrongY, 12);

  const nearestCorrect = (p) => {
    if (!p) return false;
    return Math.hypot(p.x - CORRECT_ANCHOR, p.y - correctY) < 58;
  };

  const onCut = () => {
    if (cut || cutting || phase !== "cut") return;
    setCutting(true);
    setTimeout(() => {
      setCut(true);
      setPhase("remap");
      setCutting(false);
    }, 820);
  };

  const onMove = (e) => {
    if (phase === "remap" && dragging && !done) {
      const p = toSvg(e);
      if (p) setPointer(p);
    }
  };

  const onUp = (e) => {
    if (!dragging || phase !== "remap" || done) return;
    const p = toSvg(e) || pointer;
    if (nearestCorrect(p)) {
      setDone(true);
      setPointer({ x: CORRECT_ANCHOR, y: correctY });
    } else if (p && p.x > 360) {
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 500);
    }
    setDragging(false);
    if (!nearestCorrect(p)) setPointer(null);
  };

  const remapEnd = () => {
    if (done) return { x: CORRECT_ANCHOR, y: correctY };
    if (pointer) return pointer;
    return { x: APPT.anchorX, y: APPT.anchorY + 40 };
  };

  const end = remapEnd();
  const status = () => {
    if (done) return { text: "Fixed: appointment re-mapped to the correct encounter.", color: C.green };
    if (phase === "cut") return { text: "Step 1: Click the red thread with your scissors to cut it.", color: C.inkSoft };
    return { text: "Step 2: Drag a new thread to the empty encounter below.", color: C.inkSoft };
  };
  const st = status();
  const scissorMode = phase === "cut" && !cut;

  return (
    <div style={{ ...cardBox, border: `2px dashed ${C.red}`, background: "#FFF9F8" }}>
      <div style={rowHead}>
        <Link2 size={18} style={{ color: C.red }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: C.red, fontSize: 13 }}>FIX THE WRONG ENCOUNTER MAPPING</span>
      </div>
      <p style={{ margin: "0 0 8px", color: C.ink, lineHeight: 1.6, fontWeight: 500 }}>
        This appointment was mapped to the wrong encounter. Cut the red thread, then connect it to the empty encounter for this visit.
      </p>

      <div className={scissorMode ? "boss-map-scissors" : ""} style={{ borderRadius: 12, overflow: "hidden" }}>
      <svg ref={svgRef} viewBox="0 0 680 420" style={{
        width: "100%", height: "auto", display: "block", touchAction: "none", userSelect: "none",
        cursor: scissorMode ? SCISSOR_CURSOR : undefined,
      }}
        onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        {/* messy cluster zone */}
        <rect x={368} y={8} width={288} height={228} rx="14" fill="#F0F2F5" stroke={C.line} strokeWidth="1.5" />
        <text x={380} y={26} fontFamily={display} fontSize="10" fontWeight="700" fill={C.inkSoft}>TANGLED ENCOUNTERS</text>

        {/* messy threads: none touch correct encounter */}
        {BOSS_MESSY_TANGLES.map(([a, b], i) => (
          <path key={`tg-${i}`} d={messyThread(MESSY_ANCHOR, messyY(a), MESSY_ANCHOR - 70 - (i % 3) * 18, messyY(b), i)}
            fill="none" stroke={C.gray} strokeWidth={2 + (i % 2) * 0.5} strokeDasharray={i % 3 === 0 ? "0" : "5 4"} opacity="0.55" />
        ))}
        {BOSS_MESSY_TANGLES.map(([a, b], i) => (
          <path key={`tg2-${i}`} d={messyThread(MESSY_ANCHOR - 55, messyY(a), MESSY_ANCHOR, messyY(b), i + 3)}
            fill="none" stroke={C.inkSoft} strokeWidth="1.5" strokeDasharray="3 5" opacity="0.4" />
        ))}
        {/* decoy threads from cluster interior */}
        <path d={messyThread(395, 80, MESSY_ANCHOR, messyY("t2"), 0)} fill="none" stroke={C.line} strokeWidth="1.8" opacity="0.5" />
        <path d={messyThread(400, 140, MESSY_ANCHOR, messyY("wrong"), 1)} fill="none" stroke={C.line} strokeWidth="1.8" opacity="0.45" />
        <path d={messyThread(388, 175, MESSY_ANCHOR, messyY("t4"), 2)} fill="none" stroke={C.gray} strokeWidth="1.5" opacity="0.4" />

        {/* knot blobs */}
        {BOSS_KNOTS.map((k, i) => (
          <g key={`knot-${i}`}>
            <circle cx={k.x} cy={k.y} r="7" fill={C.card} stroke={C.gray} strokeWidth="1.5" />
            <circle cx={k.x} cy={k.y} r="3" fill={C.gray} opacity="0.6" />
          </g>
        ))}

        {/* wrong red thread */}
        {!cut && !cutting && (
          <>
            <path d={redThread} fill="none" stroke="transparent" strokeWidth="18" strokeLinecap="round"
              style={{ cursor: SCISSOR_CURSOR }}
              onPointerDown={(e) => { e.stopPropagation(); onCut(); }} />
            <path d={redThread} fill="none" stroke={C.red} strokeWidth="3.5" strokeLinecap="round"
              pointerEvents="none" className="rt-thread-cut-hint" />
          </>
        )}
        {cutting && (
          <>
            <g transform={`translate(${cutMid.x} ${cutMid.y})`}>
              <g className="boss-thread-fall-left">
                <path d={redThreadLeft} transform={`translate(${-cutMid.x} ${-cutMid.y})`}
                  fill="none" stroke={C.red} strokeWidth="3.5" strokeLinecap="round" />
              </g>
            </g>
            <g transform={`translate(${cutMid.x} ${cutMid.y})`}>
              <g className="boss-thread-fall-right">
                <path d={redThreadRight} transform={`translate(${-cutMid.x} ${-cutMid.y})`}
                  fill="none" stroke={C.red} strokeWidth="3.5" strokeLinecap="round" />
              </g>
            </g>
          </>
        )}
        {cut && phase === "remap" && !done && (
          <path d={threadCurve(APPT.anchorX, APPT.anchorY, end.x, end.y, 18)}
            fill="none" stroke={dragging ? C.teal : C.line} strokeWidth="3" strokeDasharray="6 5" strokeLinecap="round" />
        )}
        {done && (
          <path d={threadCurve(APPT.anchorX, APPT.anchorY, CORRECT_ANCHOR, correctY, 18)}
            fill="none" stroke={C.green} strokeWidth="4" strokeLinecap="round" className="thread-on" />
        )}

        {/* appointment */}
        <rect x={APPT.x} y={APPT.y} width={APPT.w} height="48" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="2" />
        <text x={APPT.x + 12} y={APPT.y + 20} fontFamily={display} fontSize="10" fill={C.blue} fontWeight="700">Appointment</text>
        <text x={APPT.x + 12} y={APPT.y + 38} fontFamily={display} fontSize="12" fontWeight="800" fill={C.ink}>Clinic visit: fix me</text>
        <circle cx={APPT.anchorX} cy={APPT.anchorY} r="6" fill={C.blue} />

        {phase === "remap" && !done && (
          <g className={dragging ? undefined : "rt-interactive-drag"} style={{ cursor: dragging ? "grabbing" : "grab" }}
            onPointerDown={(e) => {
              e.preventDefault();
              setDragging(true);
              const p = toSvg(e);
              if (p) setPointer(p);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}>
            <circle cx={end.x} cy={end.y} r="14" fill={C.teal} stroke="#fff" strokeWidth="2.5" />
          </g>
        )}

        {/* messy encounters */}
        {BOSS_MESSY_ENCS.map((enc) => {
          const cy = enc.y + 20;
          const isWrong = enc.id === "wrong";
          return (
            <g key={enc.id}>
              <rect x={MESSY_X} y={enc.y} width={ENC_W} height="40" rx="8"
                fill={isWrong && !cut ? C.redSoft : C.card}
                stroke={isWrong && !cut ? C.red : C.line} strokeWidth={isWrong ? 2.5 : 1.5} />
              <text x={MESSY_X + 10} y={enc.y + 14} fontFamily={display} fontSize="8" fill={C.inkSoft} fontStyle="italic">Encounter</text>
              <text x={MESSY_X + 10} y={enc.y + 28} fontFamily={display} fontSize="12" fontWeight="800" fill={C.ink}>{enc.encId}</text>
              <text x={MESSY_X + 10} y={enc.y + 38} fontFamily={font} fontSize="7" fill={C.inkSoft}>{enc.sub}</text>
              <circle cx={MESSY_ANCHOR} cy={cy} r="5" fill={isWrong && !cut ? C.red : C.gray} />
            </g>
          );
        })}

        {/* separator */}
        <line x1={368} y1={248} x2={656} y2={248} stroke={C.teal} strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" />
        <text x={380} y={268} fontFamily={display} fontSize="10" fontWeight="700" fill={C.teal}>TARGET: NO CONNECTIONS</text>

        {/* isolated correct encounter */}
        <rect x={CORRECT_X - 12} y={BOSS_CORRECT_ENC.y - 14} width={CORRECT_W + 24} height="72" rx="14"
          fill={done ? C.greenSoft : C.tealSoft} stroke={done ? C.green : C.teal} strokeWidth="2.5" />
        <rect x={CORRECT_X} y={BOSS_CORRECT_ENC.y} width={CORRECT_W} height="44" rx="10"
          fill={C.card} stroke={done ? C.green : C.teal} strokeWidth="2"
          strokeDasharray={done ? "0" : "7 4"} />
        <text x={CORRECT_X + 12} y={BOSS_CORRECT_ENC.y + 16} fontFamily={display} fontSize="9" fill={C.teal} fontWeight="700">Encounter</text>
        <text x={CORRECT_X + 12} y={BOSS_CORRECT_ENC.y + 32} fontFamily={display} fontSize="14" fontWeight="800" fill={C.ink}>{BOSS_CORRECT_ENC.encId}</text>
        <text x={CORRECT_X + 12} y={BOSS_CORRECT_ENC.y + 42} fontFamily={font} fontSize="8" fill={C.inkSoft}>{BOSS_CORRECT_ENC.sub}</text>
        <circle cx={CORRECT_ANCHOR} cy={correctY} r="6" fill={done ? C.green : C.teal} />
        {wrongFlash && (
          <text x={CORRECT_X + CORRECT_W / 2} y={BOSS_CORRECT_ENC.y - 20} textAnchor="middle"
            fontFamily={display} fontSize="11" fontWeight="700" fill={C.red}>Map here, not the tangled ones</text>
        )}
      </svg>
      </div>

      <div style={{ textAlign: "center", marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 14, color: st.color }}>
        {done ? <span><Link2 size={15} style={{ verticalAlign: -2 }} /> {st.text}</span> : st.text}
      </div>
    </div>
  );
}

function FlowBox({ show, x, y, w, h, fill, stroke, label, step = 1, icon, text, dashed }) {
  return (
    <g opacity={show(step) ? 1 : 0} style={{ transition: "opacity .35s ease" }}>
      <rect x={x} y={y} width={w} height={h} rx="10"
        fill={fill} stroke={stroke} strokeWidth="2"
        strokeDasharray={dashed ? "5 4" : "0"} />
      {icon && <CalIcon x={x + 10} y={y + 8} s={28} />}
      <text x={x + (icon ? 44 : w / 2)} y={y + h / 2 + 5}
        textAnchor={icon ? "start" : "middle"}
        fontFamily={display} fontWeight="700" fontSize="13" fill={text || C.ink}>
        {label}
      </text>
    </g>
  );
}

function OutpatientFlowSvg({ show }) {
  return (
    <>
      <FlowBox show={show} x={8} y={12} w={132} h={46} fill={C.greenSoft} stroke={C.green} label="SchAppBook" step={1} icon />
      <g opacity={show(2) ? 1 : 0} style={{ transition: "opacity .35s ease" }}>
        <path d="M 74 58 L 74 88 L 178 88" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="178,88 170,84 170,92" fill={C.green} />
      </g>
      <text x={52} y={108} opacity={show(1) ? 1 : 0} fontFamily={font} fontSize="11" fill={C.inkSoft}
        style={{ transition: "opacity .35s ease" }}>
          {/* Create an appt. for future */}
        </text>
      <FlowBox show={show} x={178} y={68} w={96} h={44} fill="#E8ECF0" stroke={C.gray} label="PreReg" step={2} />
      <g opacity={show(3) ? 1 : 0} style={{ transition: "opacity .35s ease" }}>
        <line x1="274" y1="90" x2="308" y2="90" stroke={C.gray} strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="308,90 300,86 300,94" fill={C.gray} />
      </g>
      <text x="286" y="108" textAnchor="middle" opacity={show(3) ? 1 : 0} fontFamily={font} fontSize="10" fill={C.inkSoft}
        style={{ transition: "opacity .35s ease" }}>
          {/* OP Ambulatory Registration Conversation */}
        </text>
      <FlowBox show={show} x={308} y={68} w={108} h={44} fill={C.green} stroke="#1E9A5C" label="Out Patient" step={3} text="#fff" />
      <FlowBox show={show} x={448} y={68} w={168} h={44} fill="#5A6578" stroke={C.inkSoft} label="Auto-Discharged at EOD" step={4} dashed text="#fff" />
    </>
  );
}

function InpatientFlowSvg({ show }) {
  return (
    <>
      <FlowBox show={show} x={8} y={12} w={132} h={46} fill={C.greenSoft} stroke={C.green} label="SchAppBook" step={1} icon />
      <g opacity={show(2) ? 1 : 0} style={{ transition: "opacity .35s ease" }}>
        <path d="M 74 58 L 74 88 L 178 88" fill="none" stroke={C.ipPreAdmit} strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="178,88 170,84 170,92" fill={C.ipPreAdmit} />
      </g>
      <text x={44} y={108} opacity={show(1) ? 1 : 0} fontFamily={font} fontSize="11" fill={C.inkSoft}
        style={{ transition: "opacity .35s ease" }}>
          {/* Create a pre-admit for future */}
        </text>
      <FlowBox show={show} x={178} y={68} w={104} h={44} fill={C.ipPreAdmitSoft} stroke={C.ipPreAdmit} label="PreAdmit" step={2} />
      <g opacity={show(3) ? 1 : 0} style={{ transition: "opacity .35s ease" }}>
        <line x1="282" y1="90" x2="308" y2="90" stroke={C.ipActive} strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="308,90 300,86 300,94" fill={C.ipActive} />
      </g>
      <text x="286" y="108" textAnchor="middle" opacity={show(3) ? 1 : 0} fontFamily={font} fontSize="10" fill={C.inkSoft}
        style={{ transition: "opacity .35s ease" }}>
          {/* IP Inpatient Registration Conversation */}
          </text>
      <FlowBox show={show} x={308} y={68} w={108} h={44} fill={C.ipActive} stroke={C.ipActiveDark} label="InPatient" step={3} text="#fff" />
      <g opacity={show(4) ? 1 : 0} style={{ transition: "opacity .35s ease" }}>
        <line x1="416" y1="90" x2="448" y2="90" stroke={C.ipDischarge} strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="448,90 440,86 440,94" fill={C.ipDischarge} />
      </g>
      <text x="432" y="108" textAnchor="middle" opacity={show(4) ? 1 : 0} fontFamily={font} fontSize="10" fill={C.inkSoft}
        style={{ transition: "opacity .35s ease" }}>
          {/* Discharge manually */}
          </text>
      <FlowBox show={show} x={448} y={68} w={168} h={44} fill={C.ipDischarge} stroke={C.ipDischargeDark} label="Discharge Encounter" step={4} text="#fff" />
    </>
  );
}

function FlowDiagramBlock({ b }) {
  const [step, setStep] = useState(1);
  const total = 4;
  const done = step >= total;
  const show = (n) => step >= n;
  const isInpatient = b.flow === "inpatient";

  return (
    <div style={cardBox}>
      <div style={rowHead}>
        <ChevronRight size={18} style={{ color: C.teal }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: C.teal, fontSize: 13 }}>STEP BY STEP FLOW</span>
      </div>
      {b.intro && (
        <p style={{ margin: "0 0 14px", color: C.ink, lineHeight: 1.55, fontSize: 14 }}>{b.intro}</p>
      )}
      <svg viewBox="0 0 640 188" style={{ width: "100%", height: "auto", display: "block", marginBottom: 12 }}>
        {isInpatient ? <InpatientFlowSvg show={show} /> : <OutpatientFlowSvg show={show} />}
      </svg>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: font, fontSize: 13, color: C.inkSoft }}>
          {done ? "Full journey revealed" : `Stage ${step} of ${total}`}
        </span>
        <button type="button" className={done ? undefined : "rt-interactive-tap"} onClick={() => setStep((s) => Math.min(s + 1, total))} disabled={done} style={{
          ...primaryBtn, minWidth: 120, justifyContent: "center",
          opacity: done ? 0.55 : 1, cursor: done ? "default" : "pointer",
        }}>
          {done ? "Complete" : "Next"} {!done && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}

function CalIcon({ x, y, s = 36 }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="4" width={s} height={s - 4} rx="3" fill="#fff" stroke={C.ink} strokeWidth="1.5" />
      <rect x="0" y="4" width={s} height="9" fill={C.green} rx="3" />
      <circle cx="9" cy="7.5" r="2" fill={C.ink} /><circle cx={s - 9} cy="7.5" r="2" fill={C.ink} />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
        <circle key={`${r}${c}`} cx={8 + c * 7} cy={18 + r * 6} r="1.2" fill={C.line} />
      )))}
      <circle cx="8" cy={s - 2} r="7" fill={C.red} />
      <path d={`M ${8 - 3} ${s - 2} l 2.5 2.5 l 5 -5`} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function CashIcon({ x, y }) {
  return <text x={x + 14} y={y + 26} textAnchor="middle" fontSize="26">💵</text>;
}

function EncounterBillingDiagram() {
  const rows = [
    { encId: "IWK000001", label: "Encounter", y: 36, billable: true },
    { encId: "IWK000002", label: "Encounter", y: 98, billable: true },
    { encId: "InBtwnVst01", label: "In-Between visit Encounter", y: 160, billable: false },
    { encId: "IWK000003", label: "Encounter", y: 222, billable: true },
  ];
  const encX = 16, encW = 148, calX = 248, moneyX = 462, lineEndX = 500;
  return (
    <svg viewBox="0 0 560 280" style={{ width: "100%", height: "auto", display: "block", marginBottom: 16,
      borderRadius: 12, border: `1px solid ${C.line}`, background: C.card }}>
      <defs>
        <marker id="billArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.blue} />
        </marker>
      </defs>
      {rows.map((row) => {
        const cy = row.y + 22;
        const encEnd = encX + encW;
        if (row.billable) {
          return (
            <g key={row.encId}>
              <rect x={encX} y={row.y} width={encW} height="44" rx="7" fill={C.card} stroke={C.ink} strokeWidth="1.2" />
              <text x={encX + 10} y={row.y + 14} fontFamily={display} fontSize="9" fill={C.inkSoft} fontStyle="italic">{row.label}</text>
              <text x={encX + 10} y={row.y + 32} fontFamily={display} fontSize="14" fontWeight="800" fill={C.ink}>{row.encId}</text>
              <circle cx={encEnd} cy={cy} r="5" fill={C.green} />
              <path d={`M ${encEnd} ${cy} L ${calX - 4} ${cy}`} fill="none" stroke={C.green} strokeWidth="2.5"
                strokeDasharray="6 5" strokeLinecap="round" />
              <circle cx={calX - 4} cy={cy} r="5" fill={C.green} />
              <CalIcon x={calX} y={cy - 18} s={34} />
              <path d={`M ${calX + 38} ${cy} L ${moneyX - 4} ${cy}`} fill="none" stroke={C.blue} strokeWidth="2"
                strokeDasharray="5 4" markerEnd="url(#billArrow)" />
              <CashIcon x={moneyX} y={cy - 20} />
            </g>
          );
        }
        const xMark = lineEndX;
        return (
          <g key={row.encId}>
            <rect x={encX} y={row.y} width={encW} height="44" rx="7" fill={C.redSoft} stroke={C.red} strokeWidth="1.5" />
            <text x={encX + 10} y={row.y + 14} fontFamily={display} fontSize="8.5" fill={C.red} fontStyle="italic">{row.label}</text>
            <text x={encX + 10} y={row.y + 32} fontFamily={display} fontSize="14" fontWeight="800" fill={C.ink}>{row.encId}</text>
            <circle cx={encEnd} cy={cy} r="5" fill={C.red} />
            <path d={`M ${encEnd} ${cy} L ${xMark} ${cy}`} fill="none" stroke={C.red} strokeWidth="2.5"
              strokeDasharray="6 5" strokeLinecap="round" />
            <text x={xMark + 14} y={cy + 8} textAnchor="middle" fontFamily={display} fontSize="32" fontWeight="800" fill={C.red}>✕</text>
            <text x={(encEnd + xMark) / 2} y={cy + 20} textAnchor="middle" fontFamily={font} fontSize="10.5" fill={C.inkSoft} fontStyle="italic">
              In between visit encounters · not billed for providers
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const RECURRING_APPTS = 4;
const REC_CHECKIN = "#EC4899";
const REC_SERVICE = "#FDE68A";
const REC_SERVICE_STROKE = "#CA8A04";

function RecurringAppointmentsDiagram() {
  const APPT_YS = [62, 150, 238, 326];
  const APPT_X = 278, APPT_ANCHOR = APPT_X, APPT_W = 52;
  const ENC_W = 148, ENC_H = 72;
  const ENC_APPT_GAP = 56;
  const ENC_X = APPT_X - ENC_W - ENC_APPT_GAP;
  const ENC_Y = APPT_YS[0] - 36;
  const ENC_ANCHOR = ENC_X + ENC_W;
  const ENC_CY = ENC_Y + ENC_H / 2;
  const OUT_X = 510;
  const ACTIONS_X = APPT_X + APPT_W + 22;

  const svgRef = useRef(null);
  const [encAppt, setEncAppt] = useState(() => Array(RECURRING_APPTS).fill(false));
  const [clicks, setClicks] = useState(() => Array(RECURRING_APPTS).fill(0));
  const [drag, setDrag] = useState(null);
  const [pointer, setPointer] = useState(null);

  const threadLine = (x1, y1, x2, y2) => `M ${x1} ${y1} L ${x2} ${y2}`;

  const toSvg = (e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return null;
    return pt.matrixTransform(m.inverse());
  };

  const nearestAppt = (p) => {
    if (!p) return -1;
    let best = -1, bestD = 999;
    APPT_YS.forEach((y, i) => {
      if (encAppt[i]) return;
      const d = Math.hypot(p.x - APPT_ANCHOR, p.y - y);
      if (d < 48 && d < bestD) { best = i; bestD = d; }
    });
    return best;
  };

  const nearEnc = (p) => p && Math.hypot(p.x - ENC_ANCHOR, p.y - ENC_CY) < 52;

  const connectAppt = (i) => setEncAppt((a) => a.map((v, j) => (j === i ? true : v)));

  const onApptAction = (i) => {
    if (!encAppt[i] || clicks[i] >= 2) return;
    setClicks((c) => c.map((v, j) => (j === i ? v + 1 : v)));
  };

  const onMove = (e) => {
    if (!drag) return;
    const p = toSvg(e);
    if (p) setPointer(p);
  };

  const onUp = (e) => {
    if (!drag) return;
    const p = toSvg(e) || pointer;
    if (drag.kind === "enc") {
      if (drag.fromAppt != null) {
        if (nearEnc(p)) connectAppt(drag.fromAppt);
      } else {
        const hit = nearestAppt(p);
        if (hit >= 0) connectAppt(hit);
      }
    }
    setDrag(null);
    setPointer(null);
  };

  const allDone = encAppt.every(Boolean) && clicks.every((c) => c === 2);
  const encRecurring = clicks.some((c) => c >= 1);

  const statusMsg = () => {
    if (allDone) return "All threads connected: one encounter, four visits, check-in and service interaction each.";
    if (!encAppt.every(Boolean)) return "Drag a thread from the encounter or an appointment to connect them.";
    if (encAppt.some((ok, i) => ok && clicks[i] < 2)) {
      return "Use Actions beside each connected appointment (2 times per appointment).";
    }
    return "Keep going…";
  };

  const threadProps = { fill: "none", stroke: C.green, strokeWidth: 2.8, strokeLinecap: "round" };

  return (
    <div style={{ ...cardBox, border: `2px solid ${C.teal}`, background: "#F8FDFC" }}>
      <div style={rowHead}>
        <Link2 size={18} style={{ color: C.teal }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: C.teal, fontSize: 13 }}>RECURRING SERIES: CONNECT IT</span>
      </div>
      <p style={{ margin: "0 0 12px", color: C.ink, lineHeight: 1.55, fontSize: 14 }}>
        One pre-recurring encounter fans out to every visit in the series. Attach all encounter threads yourself, then use Actions on each appointment.
      </p>

      <svg ref={svgRef} viewBox="0 0 700 400" style={{ width: "100%", height: "auto", display: "block", touchAction: "none", userSelect: "none" }}
        onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        {/* encounter ↔ appointment threads */}
        {APPT_YS.map((y, i) => encAppt[i] ? (
          <path key={`ea-${i}`} d={threadLine(ENC_ANCHOR, ENC_CY, APPT_ANCHOR, y)} {...threadProps} />
        ) : null)}
        {drag?.kind === "enc" && pointer && (
          <path
            d={threadLine(
              drag.fromAppt != null ? APPT_ANCHOR : ENC_ANCHOR,
              drag.fromAppt != null ? APPT_YS[drag.fromAppt] : ENC_CY,
              pointer.x, pointer.y,
            )}
            fill="none" stroke={C.green} strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round"
          />
        )}

        {/* appointment → check-in / service: auto on Actions click */}
        {APPT_YS.map((y, i) => {
          const rows = [];
          if (clicks[i] >= 1) {
            rows.push(<path key={`ck-${i}`} d={threadLine(APPT_ANCHOR + APPT_W, y, OUT_X, y - 20)} {...threadProps} />);
          }
          if (clicks[i] >= 2) {
            rows.push(<path key={`sv-${i}`} d={threadLine(APPT_ANCHOR + APPT_W, y, OUT_X, y + 20)} {...threadProps} />);
          }
          return rows;
        })}

        {/* encounter: beside first appointment */}
        <g>
          {encRecurring && (
            <rect x={ENC_X - 8} y={ENC_Y - 8} width={ENC_W + 16} height={ENC_H + 16} rx="14"
              fill="none" stroke={C.gold} strokeWidth="2.5" strokeDasharray="12 8"
              className="rec-enc-orbit" />
          )}
          <rect x={ENC_X} y={ENC_Y} width={ENC_W} height={ENC_H} rx="10" fill={C.card}
            stroke={encRecurring ? C.teal : C.ink} strokeWidth={encRecurring ? 2.5 : 1.5}
            className={encRecurring ? "rec-enc-box-flash" : undefined} />
          <text x={ENC_X + 12} y={ENC_Y + 28} fontFamily={display} fontSize="11"
            fill={encRecurring ? C.teal : C.inkSoft} fontStyle="italic" fontWeight={encRecurring ? 700 : 400}>
            {encRecurring ? "Recurring" : "Pre-Recurring"}
          </text>
          <text x={ENC_X + 12} y={ENC_Y + 50} fontFamily={display} fontSize="14" fontWeight="800" fill={C.ink}>encounter</text>
          <circle cx={ENC_ANCHOR} cy={ENC_CY} r="7" fill={C.green} stroke="#fff" strokeWidth="2"
          className={encAppt.every(Boolean) ? undefined : "rt-interactive-drag"}
          style={{ cursor: encAppt.every(Boolean) ? "default" : "grab" }}
          onPointerDown={(e) => {
            if (encAppt.every(Boolean)) return;
            e.preventDefault();
            setDrag({ kind: "enc", fromAppt: null });
            const p = toSvg(e);
            if (p) setPointer(p);
            e.currentTarget.setPointerCapture(e.pointerId);
          }} />
        </g>

        {APPT_YS.map((y, i) => {
          const showCheckin = clicks[i] >= 1;
          const showService = clicks[i] >= 2;
          return (
            <g key={`appt-${i}`}>
              <CalIcon x={APPT_X + 8} y={y - 18} s={36} />
              <circle cx={APPT_ANCHOR} cy={y} r="6" fill={C.green} />
              {!encAppt[i] && (
                <circle cx={APPT_ANCHOR} cy={y} r="10" fill={C.green} stroke="#fff" strokeWidth="2"
                  className="rt-interactive-drag"
                  style={{ cursor: "grab" }}
                  onPointerDown={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    setDrag({ kind: "enc", fromAppt: i });
                    const p = toSvg(e);
                    if (p) setPointer(p);
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }} />
              )}
              {encAppt[i] && clicks[i] < 2 && (
                <g className="rt-interactive-tap" style={{ cursor: "pointer" }} onClick={() => onApptAction(i)}
                  onPointerDown={(e) => e.stopPropagation()}>
                  <circle cx={ACTIONS_X} cy={y} r="18" fill={C.goldSoft} stroke={C.gold} strokeWidth="2" />
                  <text x={ACTIONS_X} y={y - 3} textAnchor="middle" fontFamily={display} fontSize="8" fontWeight="800" fill="#B8851A">actions</text>
                  <text x={ACTIONS_X} y={y + 9} textAnchor="middle" fontFamily={display} fontSize="10" fontWeight="800" fill="#B8851A">×{2 - clicks[i]}</text>
                </g>
              )}
              {showCheckin && (
                <g>
                  <rect x={OUT_X} y={y - 37} width={108} height={34} rx="8" fill={REC_CHECKIN} />
                  <text x={OUT_X + 54} y={y - 15} textAnchor="middle" fontFamily={display} fontSize="12" fontWeight="700" fill="#fff">Check-in</text>
                  <circle cx={OUT_X} cy={y - 20} r="5" fill={C.green} />
                </g>
              )}
              {showService && (
                <g>
                  <rect x={OUT_X} y={y + 3} width={148} height={34} rx="8" fill={REC_SERVICE} stroke={REC_SERVICE_STROKE} strokeWidth="1.5" />
                  <text x={OUT_X + 74} y={y + 25} textAnchor="middle" fontFamily={display} fontSize="11" fontWeight="700" fill={C.ink}>Service Interaction</text>
                  <circle cx={OUT_X} cy={y + 20} r="5" fill={C.green} />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ textAlign: "center", marginBottom: 12, fontFamily: display, fontWeight: 700, fontSize: 14,
        color: allDone ? C.green : C.inkSoft }}>
        {statusMsg()}
      </div>

      <div style={{
        background: REC_SERVICE, border: `2px solid ${REC_SERVICE_STROKE}`, borderRadius: 12,
        padding: "12px 14px", fontSize: 14, lineHeight: 1.55, color: C.ink, fontWeight: 600,
      }}>
        <b>Important:</b> The Service Interaction must be created <b>explicitly and manually</b> after the appointment is checked in. It does not happen on its own.
      </div>
    </div>
  );
}

const GROUP_PATIENTS = [
  { id: "gp1", emoji: "🦊" }, { id: "gp2", emoji: "🦉" }, { id: "gp3", emoji: "🦭" },
  { id: "gp4", emoji: "🐧" }, { id: "gp5", emoji: "🦌" }, { id: "gp6", emoji: "🐻" },
  { id: "gp7", emoji: "🦜" }, { id: "gp8", emoji: "🐢" }, { id: "gp9", emoji: "🦋" },
  { id: "gp10", emoji: "🐋" }, { id: "gp11", emoji: "🦩" }, { id: "gp12", emoji: "🐝" },
  { id: "gp13", emoji: "🦘" }, { id: "gp14", emoji: "🐙" }, { id: "gp15", emoji: "🦄" },
  { id: "gp16", emoji: "🦒" }, { id: "gp17", emoji: "🐬" }, { id: "gp18", emoji: "🦔" },
];

function memberOrbitStyle(id, i, total) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + i * 17;
  const size = total > 30 ? 14 : total > 16 ? 18 : total > 8 ? 22 : 28;
  return {
    "--orbit-r": `${32 + (n % 58)}px`,
    "--orbit-dur": `${5 + (n % 6)}s`,
    "--orbit-delay": `${-((n % 24) * 0.35)}s`,
    fontSize: size,
  };
}

function GroupSessionsDemo() {
  const groupRef = useRef(null);
  const [capacity, setCapacity] = useState(60);
  const [inGroup, setInGroup] = useState([]);
  const [dragId, setDragId] = useState(null);
  const [pointer, setPointer] = useState(null);
  const [fullFlash, setFullFlash] = useState(false);
  const [hoverGroup, setHoverGroup] = useState(false);

  const cap = Math.max(1, Math.min(99, Number(capacity) || 1));
  const members = inGroup.map((id) => GROUP_PATIENTS.find((p) => p.id === id)).filter(Boolean);
  const waiting = GROUP_PATIENTS.filter((p) => !inGroup.includes(p.id));
  const full = members.length >= cap;
  const draggingPatient = dragId ? GROUP_PATIENTS.find((p) => p.id === dragId) : null;

  const pointInGroup = (x, y) => {
    const el = groupRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = rect.width / 2;
    const ry = rect.height / 2;
    const dx = (x - cx) / rx;
    const dy = (y - cy) / ry;
    return dx * dx + dy * dy <= 1;
  };

  const onDown = (id, e) => {
    e.preventDefault();
    setDragId(id);
    setPointer({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!dragId) return undefined;
    const move = (e) => {
      setPointer({ x: e.clientX, y: e.clientY });
      setHoverGroup(pointInGroup(e.clientX, e.clientY));
    };
    const up = (e) => {
      if (pointInGroup(e.clientX, e.clientY)) {
        setInGroup((g) => {
          if (g.length >= cap || g.includes(dragId)) {
            if (g.length >= cap) {
              setFullFlash(true);
              setTimeout(() => setFullFlash(false), 2200);
            }
            return g;
          }
          return [...g, dragId];
        });
      }
      setDragId(null);
      setPointer(null);
      setHoverGroup(false);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragId, cap]);

  return (
    <div style={{ ...cardBox, border: `2px solid ${C.teal}`, background: "#F8FDFC" }}>
      <div style={rowHead}>
        <Link2 size={18} style={{ color: C.teal }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: C.teal, fontSize: 13 }}>GROUP CONTAINER: TRY IT</span>
      </div>
      <p style={{ margin: "0 0 14px", color: C.ink, lineHeight: 1.55, fontSize: 14 }}>
        Drag patients from the waiting list into the group circle. Set the capacity. Once it is full, no more members can be added.
      </p>

      <div style={{ display: "flex", gap: 20, alignItems: "stretch", flexWrap: "wrap" }}>
        {/* waiting patients */}
        <div style={{ flex: "1 1 220px", minWidth: 200 }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 13, color: C.inkSoft, marginBottom: 10 }}>
            Patients waiting
          </div>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 340, overflowY: "auto",
            padding: 12, background: C.card, borderRadius: 14, border: `1px solid ${C.line}`,
          }}>
            {waiting.length === 0 && (
              <span style={{ fontSize: 13, color: C.inkSoft, fontStyle: "italic" }}>Everyone is in the group.</span>
            )}
            {waiting.map((p) => (
              <div key={p.id} className={dragId === p.id ? undefined : "rt-interactive-drag"} onPointerDown={(e) => onDown(p.id, e)}
                style={{
                  width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                  background: C.paper, borderRadius: 12, border: `1px solid ${C.line}`,
                  cursor: "grab", touchAction: "none", userSelect: "none", fontSize: 28, lineHeight: 1,
                }}>
                {p.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* group circle */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
            background: C.card, padding: "8px 14px", borderRadius: 12, border: `1px solid ${C.line}`,
          }}>
            <label style={{ fontFamily: display, fontWeight: 700, fontSize: 13, color: C.ink }}>Capacity</label>
            <input type="number" min={1} max={99} value={capacity}
              onChange={(e) => {
                const n = Math.max(1, Math.min(99, Number(e.target.value) || 1));
                setCapacity(n);
                if (inGroup.length > n) setInGroup((g) => g.slice(0, n));
              }}
              style={{
                width: 56, padding: "6px 8px", borderRadius: 8, border: `1px solid ${C.teal}`,
                fontFamily: font, fontSize: 15, fontWeight: 700, textAlign: "center", color: C.ink,
              }} />
          </div>

          <div ref={groupRef} className={full ? undefined : "rt-interactive-drop"} style={{
            position: "relative", width: "min(100%, 300px)", aspectRatio: "1", borderRadius: "50%",
            overflow: "hidden",
            border: `3px ${fullFlash ? "solid" : "dashed"} ${fullFlash ? C.red : hoverGroup && !full ? C.teal : C.inkSoft}`,
            background: full ? C.redSoft : hoverGroup && !full ? C.tealSoft : C.blueSoft,
            boxShadow: fullFlash ? `0 0 0 4px ${C.redSoft}` : hoverGroup && !full ? `0 0 0 4px ${C.tealSoft}` : "none",
            transition: "background .2s, border-color .2s, box-shadow .2s",
          }}>
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", pointerEvents: "none",
            }}>
              {members.length === 0 ? (
                <>
                  <span style={{ fontFamily: display, fontWeight: 800, fontSize: 15, color: C.ink }}>Group session</span>
                  <span style={{ fontFamily: font, fontSize: 13, color: C.inkSoft, marginTop: 4 }}>0 / {cap}</span>
                </>
              ) : (
                <span style={{ fontFamily: font, fontSize: 12, color: C.inkSoft, marginTop: "auto", marginBottom: 8 }}>
                  {members.length} / {cap}
                </span>
              )}
            </div>
            {members.map((p, i) => (
              <div key={p.id} className="group-member-float" style={{
                position: "absolute", left: "50%", top: "50%",
                lineHeight: 1, pointerEvents: "none",
                ...memberOrbitStyle(p.id, i, members.length),
              }}>{p.emoji}</div>
            ))}
          </div>

          <p style={{
            margin: "12px 0 0", fontFamily: display, fontWeight: 700, fontSize: 13, textAlign: "center",
            color: fullFlash ? C.red : full ? C.red : members.length === cap ? C.green : C.inkSoft,
          }}>
            {fullFlash ? "Capacity reached. Cannot add more members."
              : full ? "Group is full."
                : members.length > 0 ? "Drop patients inside the circle."
                  : "Drag patients here to fill the group."}
          </p>
        </div>
      </div>

      {draggingPatient && pointer && (
        <div style={{
          position: "fixed", left: pointer.x, top: pointer.y, transform: "translate(-50%, -50%)",
          zIndex: 200, pointerEvents: "none", fontSize: 32, lineHeight: 1,
          padding: 10, background: C.card, borderRadius: 12,
          border: `2px solid ${C.teal}`, boxShadow: "0 8px 24px rgba(20,40,60,0.18)", opacity: 0.95,
        }}>
          {draggingPatient.emoji}
        </div>
      )}
    </div>
  );
}

function Encounters101Demo() {
  const ENC_X = 18, ENC_W = 152, ENC_ANCHOR = ENC_X + ENC_W;
  const APPT_X = 400, APPT_ANCHOR = APPT_X;
  // Jumbled positions: threads cross when correctly connected
  const ITEMS = [
    { encId: "IWK000001", encLabel: "Encounter", color: C.blue, soft: C.blueSoft, encY: 48, apptY: 272 },
    { encId: "IWK000002", encLabel: "Encounter", color: C.teal, soft: C.tealSoft, encY: 272, apptY: 48 },
    { encId: "IWK000003", encLabel: "Encounter", color: "#C8860A", soft: C.goldSoft, encY: 158, apptY: 188 },
  ];
  const svgRef = useRef(null);
  const [connected, setConnected] = useState(() => ITEMS.map(() => false));
  const [dragIdx, setDragIdx] = useState(null);
  const [pointer, setPointer] = useState(null);
  const [blocked, setBlocked] = useState("");

  const threadCurve = (x1, y1, x2, y2) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  };

  const toSvg = (e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return null;
    return pt.matrixTransform(m.inverse());
  };

  const nearestAppt = (p) => {
    if (!p) return -1;
    let best = -1, bestD = 999;
    ITEMS.forEach((item, i) => {
      const d = Math.hypot(p.x - APPT_ANCHOR, p.y - item.apptY);
      if (d < 52 && d < bestD) { best = i; bestD = d; }
    });
    return best;
  };

  const tryConnect = (from, to) => {
    if (connected[from]) return;
    if (from !== to) {
      setBlocked("That colour doesn't match. Each encounter only connects to its own appointment.");
      setTimeout(() => setBlocked(""), 2200);
      return;
    }
    setConnected((c) => c.map((v, i) => (i === from ? true : v)));
    setDragIdx(null);
    setPointer(null);
  };

  const onMove = (e) => {
    if (dragIdx === null) return;
    const p = toSvg(e);
    if (p) setPointer(p);
  };

  const onUp = (e) => {
    if (dragIdx === null) return;
    const p = toSvg(e) || pointer;
    const hit = nearestAppt(p);
    if (hit >= 0) tryConnect(dragIdx, hit);
    else { setDragIdx(null); setPointer(null); }
  };

  const allDone = connected.every(Boolean);

  return (
    <div style={{ ...cardBox, border: `2px solid ${C.gold}`, background: "#FFFDF7" }}>
      <div style={{
        textAlign: "center", border: `2px solid ${C.ink}`, borderRadius: 14, padding: "16px 14px",
        background: C.goldSoft, marginBottom: 14,
      }}>
        <div style={{ fontFamily: display, fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: C.green }}>
          Encounter = 💵
        </div>
        <p style={{ color: C.red, fontWeight: 700, margin: "8px 0 0", fontSize: 14, lineHeight: 1.45 }}>
          In-Between Visit encounters are non-billable
        </p>
      </div>

      <EncounterBillingDiagram />

      <div style={rowHead}>
        <Link2 size={18} style={{ color: C.teal }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: C.teal, fontSize: 13 }}>IDEAL MAPPING: TRY IT</span>
      </div>
      <p style={{ margin: "0 0 10px", color: C.ink, lineHeight: 1.55, fontSize: 14 }}>
        Encounters and appointments are jumbled on purpose. Drag each coloured thread to its <b>matching</b> appointment. Threads will cross.
      </p>

      <svg ref={svgRef} viewBox="0 0 600 340" style={{ width: "100%", height: "auto", display: "block", touchAction: "none", userSelect: "none" }}
        onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        {/* threads behind cards */}
        {ITEMS.map((item, i) => {
          const done = connected[i];
          const dragging = dragIdx === i;
          const endX = done ? APPT_ANCHOR : dragging && pointer ? pointer.x : ENC_ANCHOR + 24;
          const endY = done ? item.apptY : dragging && pointer ? pointer.y : item.encY + 38;
          return (
            <path key={`th-${item.encId}`} d={threadCurve(ENC_ANCHOR, item.encY, endX, endY)} fill="none"
              stroke={item.color} strokeWidth={done ? 4 : 3} strokeDasharray={done ? "0" : "6 5"} strokeLinecap="round" opacity={done ? 1 : 0.85} />
          );
        })}
        {ITEMS.map((item, i) => {
          const done = connected[i];
          const dragging = dragIdx === i;
          const endX = done ? APPT_ANCHOR : dragging && pointer ? pointer.x : ENC_ANCHOR + 24;
          const endY = done ? item.apptY : dragging && pointer ? pointer.y : item.encY + 38;
          const targetHover = dragIdx !== null && pointer && nearestAppt(pointer) === i;
          return (
            <g key={item.encId}>
              <rect x={ENC_X} y={item.encY - 24} width={ENC_W} height="48" rx="8" fill={C.card} stroke={item.color} strokeWidth="2" />
              <text x={ENC_X + 10} y={item.encY - 8} fontFamily={display} fontSize="10" fill={C.inkSoft} fontStyle="italic">{item.encLabel}</text>
              <text x={ENC_X + 10} y={item.encY + 12} fontFamily={display} fontSize="14" fontWeight="800" fill={C.ink}>{item.encId}</text>
              <circle cx={ENC_ANCHOR} cy={item.encY} r="6" fill={item.color} />
              {!done && (
                <circle cx={endX} cy={endY} r="12" fill={item.color} stroke="#fff" strokeWidth="2"
                  className={dragging ? undefined : "rt-interactive-drag"}
                  style={{ cursor: dragging ? "grabbing" : "grab" }}
                  onPointerDown={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    setDragIdx(i);
                    const p = toSvg(e);
                    if (p) setPointer(p);
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }} />
              )}
              <g className={done ? undefined : "rt-interactive-tap"} onClick={() => !done && tryConnect(i, i)} style={{ cursor: done ? "default" : "pointer" }}>
                <rect x={APPT_X - 6} y={item.apptY - 26} width="148" height="52" rx="10"
                  fill={done ? item.soft : targetHover ? item.soft : C.card}
                  stroke={done ? item.color : targetHover ? item.color : C.line} strokeWidth={done || targetHover ? 2.5 : 1.5} />
                <CalIcon x={APPT_X + 8} y={item.apptY - 16} s={32} />
                <circle cx={APPT_ANCHOR} cy={item.apptY} r="6" fill={item.color} />
                <text x={APPT_X + 46} y={item.apptY + 4} fontFamily={display} fontSize="11" fontWeight="700" fill={C.ink}>Appointment</text>
              </g>
              {done && (
                <>
                  <path d={`M ${APPT_X + 142} ${item.apptY} L ${APPT_X + 168} ${item.apptY}`} fill="none"
                    stroke={C.blue} strokeWidth="1.8" strokeDasharray="4 3" strokeLinecap="round" />
                  <text x={APPT_X + 186} y={item.apptY + 8} textAnchor="middle" fontSize="22">💵</text>
                </>
              )}
              {done && <text x={APPT_X + 46} y={item.apptY + 18} fontFamily={font} fontSize="10" fill={item.color}>✓ connected</text>}
            </g>
          );
        })}
      </svg>

      <div style={{ textAlign: "center", marginTop: 6, fontFamily: display, fontWeight: 700, fontSize: 14,
        color: allDone ? C.green : blocked ? C.red : C.inkSoft }}>
        {allDone
          ? <span><Link2 size={15} style={{ verticalAlign: -2 }} /> All three mapped: one encounter per appointment</span>
          : blocked || "Drag each coloured knot to its matching appointment"}
      </div>
    </div>
  );
}

function DiscussBlock({ b, profile }) {
  return (
    <div className="discuss-pop" style={{
      background: "#FFFDF7", border: `2px solid ${C.gold}`, borderRadius: 16,
      padding: 20, marginBottom: 14, boxShadow: `0 4px 20px rgba(242,181,59,0.14), 0 0 0 4px ${C.goldSoft}`,
    }}>
      <div style={rowHead}>
        <Mic size={18} style={{ color: "#B8851A" }} />
        <span style={{
          fontFamily: display, fontWeight: 800, color: "#B8851A", fontSize: 13,
          background: C.goldSoft, padding: "4px 10px", borderRadius: 999, letterSpacing: 0.4,
        }}>OPEN DISCUSSION: SHARE OUT LOUD</span>
      </div>
      <p style={{ margin: "0 0 12px", color: C.ink, lineHeight: 1.6, fontWeight: 500, fontSize: 15 }}>{b.prompt}</p>
      <div style={{ background: C.card, border: `1px dashed ${C.gold}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, color: C.ink, lineHeight: 1.55 }}>
        Unmute yourself and feel free to share your thoughts,{" "}
        <span style={{ fontFamily: display, fontWeight: 800 }}>{profile?.name}</span>{" "}
        <span style={{ fontSize: 18, lineHeight: 1 }}>{profile?.mascot}</span>
      </div>
    </div>
  );
}

function QuizBlock({ b }) {
  const [value, setValue] = useState(undefined);
  const pick = (i) => { if (value === undefined) setValue(i); };
  return (
    <div style={cardBox}>
      <div style={rowHead}><Star size={18} style={{ color: C.gold }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: "#B8851A", fontSize: 13 }}>QUICK CHECK</span></div>
      <p style={{ margin: "0 0 12px", color: C.ink, lineHeight: 1.6, fontWeight: 500 }}>{b.question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {b.options.map((opt, i) => {
          const show = value !== undefined, right = i === b.answerIndex, chosen = value === i;
          return <button key={i} className={show ? undefined : "rt-interactive-tap"} onClick={() => pick(i)} disabled={show} style={{
            textAlign: "left", padding: "10px 14px", borderRadius: 10, cursor: show ? "default" : "pointer",
            fontFamily: font, fontSize: 14, color: C.ink,
            border: `1px solid ${show && right ? C.green : chosen ? C.red : C.line}`,
            background: show && right ? C.greenSoft : chosen ? C.redSoft : C.card }}>{opt}</button>;
        })}
      </div>
      {value !== undefined && <p style={{ margin: "10px 0 0", fontSize: 14, color: C.inkSoft, lineHeight: 1.5 }}>{b.explain}</p>}
    </div>
  );
}

function PatientRefBar({ profile }) {
  return (
    <div style={{
      position: "fixed", top: "clamp(10px, 2vw, 16px)", right: "clamp(10px, 2vw, 16px)", zIndex: 100,
      background: C.card, border: `1px solid ${C.teal}`, borderRadius: 12,
      padding: "10px 14px", boxShadow: "0 4px 18px rgba(20,40,60,0.1)",
      minWidth: 168, maxWidth: 240,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <IdCard size={14} style={{ color: C.teal }} />
        <span style={{ fontFamily: display, fontWeight: 700, color: C.teal, fontSize: 11, letterSpacing: 0.4 }}>TEST PATIENT</span>
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.55 }}>
        <div><span style={{ color: C.inkSoft }}>Name </span><span style={{ fontWeight: 700, color: C.ink }}>{profile.name}</span></div>
        <div><span style={{ color: C.inkSoft }}>MSI </span><span style={{ fontWeight: 700, color: C.ink, fontFamily: display }}>{SANDBOX.healthCard}</span></div>
        <div><span style={{ color: C.inkSoft }}>DOB </span><span style={{ fontWeight: 700, color: C.ink }}>{SANDBOX.dob}</span></div>
      </div>
    </div>
  );
}

function FormsBanner() {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 12, padding: "10px 14px", marginBottom: 10, lineHeight: 1.45, border: `1px solid ${C.line}` }}>
      <p style={{ margin: 0, fontSize: 13, color: C.ink }}>
        <b style={{ fontFamily: display, color: C.teal }}>How this works:</b> Do tasks in the CIS Edu domain
        {FORMS_URL ? ", " : "."}
        {FORMS_URL && (
          <a href={FORMS_URL} target="_blank" rel="noopener noreferrer"
            style={{ color: C.teal, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            Open the form <ExternalLink size={13} />
          </a>
        )}
      </p>
    </div>
  );
}

function FloatingMascot({ emoji }) {
  const el = useRef(null);
  useEffect(() => {
    const onMove = (e) => {
      if (!el.current) return;
      el.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, calc(-100% - 8px))`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <div ref={el} aria-hidden style={{
      position: "fixed", left: 0, top: 0, zIndex: 9999, pointerEvents: "none", willChange: "transform",
    }}>
      <div className="mascot-bob" style={{
        fontSize: 34, lineHeight: 1, filter: "drop-shadow(0 3px 2px rgba(17,32,46,.38))",
      }}>{emoji}</div>
    </div>
  );
}

function WorldMap({ onOpen, mascot, lastLevelId }) {
  const ref = useRef(null);
  const n = LEVELS.length;
  const STEP = 200, X0 = 110, yUp = 112, yDn = 214, H = 330;
  const W = X0 * 2 + (n - 1) * STEP;
  const px = (i) => X0 + i * STEP;
  const py = (i) => (i % 2 === 0 ? yUp : yDn);
  const pts = LEVELS.map((_, i) => ({ x: px(i), y: py(i) }));
  const lastIdx = Math.max(0, LEVELS.findIndex((l) => l.id === lastLevelId));
  // viewport shows worlds 1–2 fully, plus a peek of world 3
  const VISIBLE_W = X0 + 2 * STEP + 78 + STEP * 0.35;
  const visibleRatio = VISIBLE_W / W;
  useEffect(() => {
    const scrollEl = ref.current;
    if (!scrollEl) return;
    const nodeX = px(lastIdx);
    const svgWidth = scrollEl.scrollWidth;
    const target = (nodeX / W) * svgWidth - scrollEl.clientWidth * 0.35;
    scrollEl.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [lastIdx, W]);
  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 6, flexShrink: 0 }}>scroll right to travel the worlds →</div>
      <div ref={ref} style={{
        flex: 1, minHeight: 0, overflowX: "auto", overflowY: "hidden", display: "flex", alignItems: "center",
        maskImage: "linear-gradient(to right, black 0%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, black 0%, black 88%, transparent 100%)",
      }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMinYMid meet"
          style={{ height: "50vh", width: `calc(100% / ${visibleRatio})`, display: "block", flexShrink: 0 }}>
          <defs>
            <filter id="m3d" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#11202E" floodOpacity="0.38" />
            </filter>
            <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#11202E" floodOpacity="0.18" />
            </filter>
          </defs>
          <path d={smoothPath(pts)} fill="none" stroke="#EFE7D5" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          <path d={smoothPath(pts)} fill="none" stroke={C.gold} strokeWidth="4" strokeLinecap="round" strokeDasharray="1 17" />
          {LEVELS.map((lv, i) => {
            const x = px(i), y = py(i), boxY = i % 2 === 0 ? y + 38 : y - 96;
            return (
              <g key={lv.id} className="rt-interactive-tap" onClick={() => onOpen(lv.id)}
                 style={{ cursor: "pointer" }} role="button" tabIndex={0}
                 aria-label={lv.name} onKeyDown={(e) => { if (e.key === "Enter") onOpen(lv.id); }}>
                <rect x={x - 78} y={boxY} width="156" height="58" rx="13" fill={C.card} stroke={lv.boss ? C.gold : C.line} strokeWidth="1.5" />
                <text x={x} y={boxY + 21} textAnchor="middle" fontFamily={display} fontWeight="700" fontSize="14" fill={C.ink}>{lv.name}</text>
                <text x={x} y={boxY + 37} textAnchor="middle" fontFamily={font} fontSize="11" fill={C.inkSoft}>{lv.sub}</text>
                <circle cx={x} cy={y} r="30" fill={C.blueSoft} stroke={C.blue} strokeWidth="3" filter="url(#nodeShadow)" />
                <text x={x} y={y + 8} textAnchor="middle" fontFamily={display} fontWeight="800" fontSize="20" fill={C.blue}>{i + 1}</text>
                {lv.boss && <text x={x + 26} y={y - 22} textAnchor="middle" fontSize="16">⭐</text>}
                {i === lastIdx && (
                  <g>
                    <ellipse className="mascot-shadow" cx={x} cy={y - 17} rx="15" ry="4.5" fill="#11202E" />
                    <g className="mascot-bob">
                      <text x={x} y={y - 30} textAnchor="middle" fontSize="34" filter="url(#m3d)">{mascot}</text>
                    </g>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function StartScreen({ onContinue }) {
  const [name, setName] = useState("");
  const [mascot, setMascot] = useState(null);
  const ready = name.trim() && mascot;
  return (
    <div style={{ minHeight: "100vh", background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: C.teal, fontFamily: display }}>ENRICHMENT TRAINING</div>
          <h1 style={{ fontFamily: display, fontSize: 36, color: C.ink, margin: "6px 0 4px", lineHeight: 1.1 }}>Reg/Sched Trail</h1>
          <p style={{ color: C.inkSoft, margin: 0, lineHeight: 1.5 }}>Enter your name and pick a trail buddy.</p>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 22 }}>
          <label style={lbl}>Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Elby"
            style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 10,
              padding: "11px 12px", fontFamily: font, fontSize: 15, color: C.ink, outline: "none", marginBottom: 18 }} />
          <label style={lbl}>Pick your avatar ({MASCOTS.length} to choose from)</label>
          <div style={{ maxHeight: 220, overflowY: "auto", padding: 4, marginBottom: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 }}>
              {MASCOTS.map((m) => (
                <button key={m} type="button" className="rt-interactive-tap" onClick={() => setMascot(m)} aria-label="avatar" style={{
                  fontSize: 22, padding: 5, borderRadius: 10, cursor: "pointer", lineHeight: 1,
                  border: `2px solid ${mascot === m ? C.teal : C.line}`, background: mascot === m ? C.tealSoft : C.card }}>{m}</button>
              ))}
            </div>
          </div>
          <button disabled={!ready} className={ready ? "rt-interactive-tap" : undefined} onClick={() => onContinue({ name: name.trim(), mascot })}
            style={{ ...primaryBtn, width: "100%", opacity: ready ? 1 : 0.5, cursor: ready ? "pointer" : "not-allowed" }}>
            Continue <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CredentialsScreen({ profile, onStart }) {
  const expiry = formatExpiry();
  const rows = [
    ["Patient name", profile.name],
    ["Health card (MSI)", SANDBOX.healthCard],
    ["Date of birth", SANDBOX.dob],
    ["Card expiry", expiry],
  ];
  return (
    <div style={{ minHeight: "100vh", background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 40, lineHeight: 1 }}>{profile.mascot}</div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 22, color: C.ink, marginTop: 8 }}>Hi, {profile.name}!</div>
          <p style={{ color: C.inkSoft, margin: "6px 0 0", lineHeight: 1.5 }}>Use these details to create your test patient in the CIS sandbox.</p>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 22 }}>
          <div style={rowHead}>
            <IdCard size={18} style={{ color: C.teal }} />
            <span style={{ fontFamily: display, fontWeight: 700, color: C.teal, fontSize: 14 }}>SANDBOX TEST PATIENT</span>
          </div>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0",
              borderBottom: `1px solid ${C.line}`, fontSize: 14 }}>
              <span style={{ color: C.inkSoft, fontWeight: 500 }}>{k}</span>
              <span style={{ color: C.ink, fontWeight: 700, fontFamily: display, textAlign: "right" }}>{v}</span>
            </div>
          ))}
          <p style={{ fontSize: 12, color: C.inkSoft, margin: "14px 0 0", lineHeight: 1.45 }}>
            Fictitious training data only, not a real patient. The expiry date is within the next week so you can practise the expiring-cards work list later.
          </p>
          <button className="rt-interactive-tap" onClick={onStart} style={{ ...primaryBtn, width: "100%", marginTop: 18 }}>
            Enter the trail <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Roadmap({ onOpen, profile, lastLevelId }) {
  return (
    <div style={{
      height: "100vh", width: "100%", boxSizing: "border-box", padding: "clamp(14px, 2.5vw, 24px)",
      display: "flex", flexDirection: "column", background: C.paper,
    }}>
      <div style={{ flexShrink: 0, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, maxWidth: "calc(100% - 200px)" }}>
        <div style={{ fontSize: 32, lineHeight: 1 }}>{profile.mascot}</div>
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, color: C.ink, fontSize: "clamp(20px, 3vw, 28px)" }}>Registration Trail</div>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: C.inkSoft }}>{profile.name} · tap any world, any order</p>
        </div>
      </div>
      <FormsBanner />
      <div style={{
        flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
        background: C.card, borderRadius: 18, border: `1px solid ${C.line}`,
        padding: "clamp(12px, 2vw, 20px)",
      }}>
        <WorldMap onOpen={onOpen} mascot={profile.mascot} lastLevelId={lastLevelId} />
      </div>
    </div>
  );
}

function AvatarRain({ emoji }) {
  const drops = useMemo(() => Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: `${4 + Math.random() * 92}%`,
    delay: `${Math.random() * 2.2}s`,
    duration: `${2.2 + Math.random() * 1.8}s`,
    size: 22 + Math.random() * 26,
    drift: -30 + Math.random() * 60,
  })), []);
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 50 }}>
      {drops.map((d) => (
        <span key={d.id} className="avatar-rain-drop" style={{
          position: "absolute", left: d.left, top: "-8vh", fontSize: d.size, lineHeight: 1,
          animationDelay: d.delay, animationDuration: d.duration, "--rain-drift": `${d.drift}px`,
        }}>{emoji}</span>
      ))}
    </div>
  );
}

function CongratulationsScreen({ profile, onMap }) {
  const [rain, setRain] = useState(true);
  const [showCert, setShowCert] = useState(false);
  const dateStr = formatCertDate();

  useEffect(() => {
    const certTimer = setTimeout(() => setShowCert(true), 600);
    const rainTimer = setTimeout(() => setRain(false), 4200);
    return () => { clearTimeout(certTimer); clearTimeout(rainTimer); };
  }, []);

  return (
    <div style={{
      minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "32px 20px", background: `linear-gradient(165deg, ${C.tealSoft} 0%, ${C.paper} 42%, ${C.goldSoft} 100%)`,
      boxSizing: "border-box",
    }}>
      {rain && <AvatarRain emoji={profile.mascot} />}
      <div style={{
        position: "relative", zIndex: 60, width: "100%", maxWidth: 560,
        opacity: showCert ? 1 : 0, transform: showCert ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
        transition: "opacity .85s ease, transform .85s cubic-bezier(.34,1.2,.5,1)",
      }}>
        <div style={{
          background: C.card, borderRadius: 20, padding: "10px",
          boxShadow: "0 20px 60px rgba(20,40,60,.12), 0 0 0 1px rgba(242,181,59,.35)",
        }}>
          <div style={{
            border: `3px double ${C.gold}`, borderRadius: 14, padding: "36px 28px 32px",
            background: "linear-gradient(180deg, #FFFEF9 0%, #FFFDF6 100%)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2.5, color: C.teal, fontFamily: display, marginBottom: 6 }}>
              ENRICHMENT TRAINING
            </div>
            <h1 style={{
              fontFamily: display, fontSize: "clamp(28px, 5vw, 36px)", color: C.ink, margin: "0 0 6px",
              lineHeight: 1.15,
            }}>Certificate of Completion</h1>
            <div style={{ width: 72, height: 3, background: C.gold, margin: "0 auto 22px", borderRadius: 2 }} />
            <p style={{ margin: "0 0 18px", color: C.inkSoft, fontSize: 15, lineHeight: 1.55 }}>
              This certifies that
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20,
              padding: "10px 22px", borderRadius: 999, background: C.tealSoft, border: `2px solid ${C.teal}`,
            }}>
              <span style={{ fontSize: 40, lineHeight: 1 }}>{profile.mascot}</span>
              <span style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: C.ink }}>{profile.name}</span>
            </div>
            <p style={{ margin: "0 0 8px", color: C.ink, fontSize: 16, lineHeight: 1.65, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
              has successfully completed <b>Registration Trail</b> and is now recognized as an expert in
            </p>
            <p style={{
              margin: "0 0 24px", fontFamily: display, fontWeight: 800, fontSize: 22, color: C.teal,
              letterSpacing: 0.3,
            }}>Registration & Scheduling</p>
            <div style={{
              display: "inline-block", padding: "8px 20px", borderRadius: 10,
              border: `1px solid ${C.line}`, background: C.paper, fontSize: 14, color: C.inkSoft,
            }}>
              <span style={{ fontWeight: 600 }}>Date:</span> {dateStr}
            </div>
            <div style={{
              marginTop: 28, width: 64, height: 64, borderRadius: "50%", marginLeft: "auto", marginRight: "auto",
              background: C.goldSoft, border: `3px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, boxShadow: "inset 0 2px 8px rgba(242,181,59,.25)",
            }}>
              <Star size={28} style={{ color: C.gold }} fill={C.gold} />
            </div>
          </div>
        </div>
        <button onClick={onMap} style={{ ...primaryBtn, width: "100%", marginTop: 20 }}>
          Back to trail map <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function LevelView({ level, profile, onBack, prevLevel, onPrev, nextLevel, onNext, onFinish }) {
  const [doneSteps, setDoneSteps] = useState({});
  const markDone = (id) => setDoneSteps((d) => ({ ...d, [id]: true }));
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [level.id]);
  const navBtn = { flex: 1, minWidth: 140, padding: "12px 14px", justifyContent: "center" };
  return (
    <div style={{ maxWidth: LEVEL_CONTENT_MAX, margin: "0 auto", padding: "8px 24px 0" }}>
      <button onClick={onBack} style={backBtn}><ArrowLeft size={16} /> Trail</button>
      <h2 style={{ fontFamily: display, fontSize: 28, color: C.ink, margin: "8px 0 16px" }}>{level.name}</h2>
      {level.blocks.map((b, i) => {
        if (b.type === "encdemo") return <Encounters101Demo key={i} />;
        if (b.type === "scenario") return <ScenarioBlock key={i} b={b} />;
        if (b.type === "concept") return <ConceptBlock key={i} b={b} doneSteps={doneSteps} />;
        if (b.type === "do") return <DoBlock key={i} b={b} doneSteps={doneSteps} onDone={markDone} />;
        if (b.type === "flow") return <FlowDiagramBlock key={i} b={b} />;
        if (b.type === "groupdemo") return <GroupSessionsDemo key={i} />;
        if (b.type === "recurring") return <RecurringAppointmentsDiagram key={i} />;
        if (b.type === "gate") return <GateBlock key={i} b={b} />;
        if (b.type === "bossmap") return <BossMappingGame key={i} />;
        if (b.type === "rope") return <RopeGame key={i} b={b} />;
        if (b.type === "discuss") return <DiscussBlock key={i} b={b} profile={profile} />;
        if (b.type === "quiz") return <QuizBlock key={i} b={b} />;
        return null;
      })}
      <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
        {prevLevel ? (
          <button onClick={onPrev} style={{ ...backBtn, ...navBtn }}>
            <ArrowLeft size={16} />
            <span>Prev <span style={{ fontSize: 11, opacity: 0.85 }}>({prevLevel.name})</span></span>
          </button>
        ) : null}
        <button onClick={onBack} style={{ ...backBtn, ...navBtn }}>
          Back to trail
        </button>
        {level.boss && !nextLevel ? (
          <button onClick={onFinish} className="rt-interactive-tap" style={{ ...primaryBtn, ...navBtn, background: C.gold, color: C.ink }}>
            <Star size={16} fill={C.ink} />
            Finish the trail
          </button>
        ) : nextLevel ? (
          <button onClick={onNext} style={{ ...primaryBtn, ...navBtn }}>
            <span>Next <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.9 }}>({nextLevel.name})</span></span>
            <ChevronRight size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [profile, setProfile] = useState(null);
  const [lastLevelId, setLastLevelId] = useState(LEVELS[0].id);
  const openLevel = (id) => { setLastLevelId(id); setScreen(id); };

  useEffect(() => {
    if (!document.getElementById("rt-fonts")) {
      const l = document.createElement("link"); l.id = "rt-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const current = LEVELS.find((l) => l.id === screen);
  const levelIdx = LEVELS.findIndex((l) => l.id === screen);
  const prevLevel = levelIdx > 0 ? LEVELS[levelIdx - 1] : null;
  const nextLevel = levelIdx >= 0 && levelIdx < LEVELS.length - 1 ? LEVELS[levelIdx + 1] : null;
  const isMap = screen === "map";
  const isCongrats = screen === "congrats";
  const isFullBleed = isMap || isCongrats || screen === "start" || screen === "credentials";
  return (
    <div style={{
      minHeight: "100vh", fontFamily: font,
      background: C.paper,
      padding: isFullBleed ? 0 : "28px 18px 60px",
    }}>
      <style>{`*:focus-visible{outline:3px solid ${C.blue}44;outline-offset:2px}
        .rope-swing{animation:swing 3.6s ease-in-out infinite;transform-origin:280px 70px}
        @keyframes swing{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
        .rope-shake{animation:shk .42s;transform-origin:280px 70px}
        @keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .appt-land{transition:transform .7s cubic-bezier(.34,1.25,.5,1)}
        .boss-thread-fall-left{animation:bossThreadFallL .8s ease-in forwards;transform-origin:0 0}
        .boss-thread-fall-right{animation:bossThreadFallR .8s ease-in forwards;transform-origin:0 0}
        @keyframes bossThreadFallL{to{transform:translate(-28px,95px) rotate(-38deg);opacity:0}}
        @keyframes bossThreadFallR{to{transform:translate(32px,105px) rotate(42deg);opacity:0}}
        .thread-on{animation:pulse 1.2s ease-in-out 2}
        @keyframes pulse{50%{stroke-width:6}}
        .mascot-bob{animation:bob 1s ease-in-out infinite}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .mascot-shadow{animation:msh 1s ease-in-out infinite}
        @keyframes msh{0%,100%{opacity:.30}50%{opacity:.12}}
        .discuss-pop{animation:discussPop .65s ease-out}
        .rec-enc-orbit{animation:recEncOrbit 1.4s linear infinite}
        .rec-enc-box-flash{animation:recEncFlash .7s ease-in-out 4}
        .group-member-float{animation:groupOrbit var(--orbit-dur,6s) linear infinite;animation-delay:var(--orbit-delay,0s)}
        .boss-map-scissors,.boss-map-scissors svg,.boss-map-scissors path{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Ctext x='4' y='22' font-size='22'%3E%E2%9C%82%3C/text%3E%3C/svg%3E") 14 14,crosshair!important}
        @keyframes groupOrbit{from{transform:translate(-50%,-50%) rotate(0deg) translateX(var(--orbit-r,40px)) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg) translateX(var(--orbit-r,40px)) rotate(-360deg)}}
        @keyframes recEncOrbit{to{stroke-dashoffset:-40}}
        @keyframes recEncFlash{0%,100%{filter:drop-shadow(0 0 0 transparent)}50%{filter:drop-shadow(0 0 10px rgba(14,156,138,.55))}}
        @keyframes discussPop{0%{transform:translateY(6px);opacity:.7;box-shadow:0 0 0 0 rgba(242,181,59,0.35)}70%{box-shadow:0 4px 24px rgba(242,181,59,0.2),0 0 0 6px rgba(242,181,59,0.18)}100%{transform:translateY(0);opacity:1}}
        .avatar-rain-drop{animation:avatarRain linear forwards}
        @keyframes avatarRain{0%{transform:translateY(-10vh) translateX(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) translateX(var(--rain-drift,0px)) rotate(360deg);opacity:.85}}
        .rt-interactive-tap{animation:rtTap 2.4s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
        .rt-interactive-drag{animation:rtDrag 1.7s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
        .rt-interactive-drop{animation:rtDrop 2.2s ease-in-out infinite}
        .rt-thread-cut-hint{animation:rtCutHint 1.3s ease-in-out infinite}
        @keyframes rtTap{0%,100%{transform:scale(1) rotate(0deg)}15%{transform:scale(1.03) rotate(-2deg)}30%{transform:scale(1.03) rotate(2deg)}45%{transform:scale(1) rotate(0deg)}}
        @keyframes rtDrag{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-5px) scale(1.08)}}
        @keyframes rtDrop{0%,100%{box-shadow:0 0 0 0 rgba(14,156,138,0);border-color:rgba(74,92,112,.45)}50%{box-shadow:0 0 0 6px rgba(14,156,138,.22);border-color:rgba(14,156,138,.75)}}
        @keyframes rtCutHint{0%,100%{stroke-opacity:1;stroke-width:3.5}50%{stroke-opacity:.55;stroke-width:5}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.discuss-pop,.rec-enc-orbit,.rec-enc-box-flash,.group-member-float,.boss-thread-fall-left,.boss-thread-fall-right,.avatar-rain-drop,.rt-interactive-tap,.rt-interactive-drag,.rt-interactive-drop,.rt-thread-cut-hint{animation:none!important}.group-member-float{transform:translate(-50%,-50%)}.avatar-rain-drop{display:none}}`}</style>
      {screen === "start" && (
        <StartScreen onContinue={(p) => { setProfile(p); setScreen("credentials"); }} />
      )}
      {screen === "credentials" && profile && (
        <CredentialsScreen profile={profile} onStart={() => setScreen("map")} />
      )}
      {screen === "map" && profile && <Roadmap onOpen={openLevel} profile={profile} lastLevelId={lastLevelId} />}
      {isCongrats && profile && (
        <CongratulationsScreen profile={profile} onMap={() => setScreen("map")} />
      )}
      {current && (
        <LevelView level={current} profile={profile} onBack={() => setScreen("map")}
          prevLevel={prevLevel} onPrev={() => prevLevel && openLevel(prevLevel.id)}
          nextLevel={nextLevel} onNext={() => nextLevel && openLevel(nextLevel.id)}
          onFinish={() => setScreen("congrats")} />
      )}
      {profile && current && <FloatingMascot emoji={profile.mascot} />}
      {profile && (screen === "map" || current) && <PatientRefBar profile={profile} />}
    </div>
  );
}

const cardBox = { background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 20, marginBottom: 14 };
const rowHead = { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 };
const primaryBtn = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
  background: C.teal, color: "#fff", border: "none", borderRadius: 12, padding: "12px 18px",
  fontFamily: display, fontWeight: 700, fontSize: 15, cursor: "pointer" };
const backBtn = { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent",
  border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 12px", color: C.inkSoft,
  fontFamily: font, fontWeight: 600, fontSize: 13, cursor: "pointer" };
const gateBtn = { flex: 1, minWidth: 150, padding: "12px 14px", borderRadius: 12,
  fontFamily: display, fontWeight: 700, fontSize: 15, color: C.ink, border: `2px solid ${C.line}` };
const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: C.inkSoft, fontFamily: display, letterSpacing: .5, marginBottom: 6 };
