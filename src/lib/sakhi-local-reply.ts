/**
 * Local Sakhi reply engine  -  aligned with `SAKHI_MASTER_SYSTEM_PROMPT` in `sakhi-persona.ts`.
 * Intent scoring + curated templates (India / student context). Not medical or regulated advice.
 */

import {
  cycleDaysFromRegularity,
  estimateNextPeriodStart,
  suggestMonthlySipInr,
} from "@/lib/period-and-plan";
import {
  formatCoachReply,
  SAKHI_FINANCE_DISCLAIMER,
  SAKHI_MEDICAL_DISCLAIMER,
} from "@/lib/sakhi-persona";

export type ChatTurn = { role: "user" | "assistant"; content: string };

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim();
}

/** Crisis / urgent  -  override all other intents (matches persona red-flag list) */
function crisisReply(text: string): string | null {
  const n = norm(text);
  const selfHarm =
    /\b(suicide|suicidal|kill myself|end my life|self harm|self-harm|hurt myself|cutting myself|want to die)\b/.test(
      n
    );
  const breathing =
    /\b(can't breathe|cannot breathe|difficulty breathing|choking)\b/.test(n);
  const cardiac = /\b(chest pain|heart attack)\b/.test(n);
  const neuro = /\b(unconscious|passed out|fainting|seizure)\b/.test(n);
  const bleeding =
    /\b(bleeding heavily|soaking through|miscarriage|hemorrhage|nonstop bleeding)\b/.test(
      n
    );
  const pain =
    /\b(severe one sided|severe one-sided|unbearable pain|worst pain of my life)\b/.test(
      n
    ) || /\b(sudden unbearable pain)\b/.test(n);
  const pregnancy = /\b(ectopic|miscarriage)\b/.test(n);
  const infection = /\b(high fever|septic|toxic)\b/.test(n) && /\b(infection|bleeding)\b/.test(n);
  const dehydration = /\b(severe dehydration)\b/.test(n);

  if (
    !(
      selfHarm ||
      breathing ||
      cardiac ||
      neuro ||
      bleeding ||
      pain ||
      pregnancy ||
      infection ||
      dehydration
    )
  ) {
    return null;
  }

  return formatCoachReply({
    validate:
      "I’m really glad you reached out. What you’re describing can be serious, and you deserve real-world help right away.",
    direct:
      "**Please treat this as urgent:** if you or someone with you is in immediate danger, call **112** (India) or your local emergency number, or go to the nearest hospital. If you’re thinking about hurting yourself, tell a trusted person now and use local crisis or campus counselling services.",
    steps: [
      "If symptoms are severe right now (heavy bleeding, fainting, trouble breathing, crushing chest pain), seek emergency care.",
      "If you can, bring someone with you and note when symptoms started.",
      "You can also contact a trusted adult, campus health, or your doctor’s helpline for next steps.",
    ],
    caution: SAKHI_MEDICAL_DISCLAIMER,
  });
}

function extractIsoDate(text: string): string | null {
  const n = text.trim();
  const iso = n.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (iso) return iso[1];
  const dmy = n.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/);
  if (dmy) {
    let d = parseInt(dmy[1], 10);
    let m = parseInt(dmy[2], 10);
    let y = parseInt(dmy[3], 10);
    if (y < 100) y += y < 50 ? 2000 : 1900;
    if (m > 12 && d <= 12) [d, m] = [m, d];
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    const pad = (x: number) => String(x).padStart(2, "0");
    return `${y}-${pad(m)}-${pad(d)}`;
  }
  return null;
}

type Bucket =
  | "period_next"
  | "period_general"
  | "period_late"
  | "pms"
  | "sip"
  | "budget"
  | "scam"
  | "emergency"
  | "wellness"
  | "greeting"
  | "afford"
  | "literacy"
  | "loan"
  | "debt";

const KEYWORDS: Record<Bucket, readonly string[]> = {
  period_next: [
    "next period",
    "when will i get",
    "period due",
    "cycle length",
    "ovulation",
    "last period",
  ],
  period_general: [
    "period",
    "menstruat",
    "menstrual",
    "cycle",
    "tampon",
    "pad",
    "period blood",
  ],
  period_late: [
    "late period",
    "missed period",
    "period is late",
    "no period",
    "skipped period",
    "irregular",
    "not coming",
  ],
  pms: [
    "pms",
    "cramps",
    "cramping",
    "bloating",
    "mood swing",
    "breast tender",
    "pmt",
  ],
  sip: [
    "sip",
    "mutual fund",
    "mf",
    "index fund",
    "nifty",
    "invest monthly",
    "lumpsum",
    "folio",
  ],
  budget: [
    "budget",
    "save money",
    "spending",
    "allowance",
    "pocket money",
    "upi",
    "expense",
    "hostel",
    "mess",
  ],
  scam: [
    "scam",
    "fraud",
    "fake job",
    "otp",
    "phishing",
    "kyc link",
    "telegram money",
    "investment scheme",
  ],
  emergency: [
    "emergency fund",
    "rainy day",
    "savings account",
    "liquid fund",
    "buffer",
  ],
  wellness: [
    "stress",
    "anxiety",
    "sleep",
    "tired",
    "burnout",
    "exam stress",
    "depressed",
    "lonely",
  ],
  greeting: ["hi", "hello", "hey", "namaste", "good morning", "good evening"],
  afford: [
    "afford",
    "should i buy",
    "impulse buy",
    "worth it",
    "regret buying",
    "can i buy",
  ],
  literacy: [
    "credit score",
    "cibil",
    "financial literacy",
    "tds",
    "income tax",
    "pan card",
    "insurance term",
  ],
  loan: [
    "loan app",
    "personal loan",
    "emi",
    "instant loan",
    "predatory",
    "recovery agent",
  ],
  debt: [
    "debt",
    "owe money",
    "credit card bill",
    "minimum due",
    "repay",
    "borrowed",
    "loan shark",
  ],
};

const PHRASE_SIGNALS: ReadonlyArray<{
  phrase: string;
  bucket: Bucket;
  weight: number;
}> = [
  { phrase: "can i afford", bucket: "afford", weight: 8 },
  { phrase: "should i buy", bucket: "afford", weight: 7 },
  { phrase: "next period", bucket: "period_next", weight: 6 },
  { phrase: "last period", bucket: "period_next", weight: 5 },
  { phrase: "late period", bucket: "period_late", weight: 10 },
  { phrase: "missed period", bucket: "period_late", weight: 10 },
  { phrase: "credit score", bucket: "literacy", weight: 7 },
  { phrase: "emergency fund", bucket: "emergency", weight: 7 },
  { phrase: "fake job", bucket: "scam", weight: 6 },
  { phrase: "loan app", bucket: "loan", weight: 7 },
  { phrase: "mutual fund", bucket: "sip", weight: 5 },
  { phrase: "credit card", bucket: "debt", weight: 6 },
];

function scoreBuckets(text: string): Map<Bucket, number> {
  const n = norm(text);
  const scores = new Map<Bucket, number>();
  (Object.keys(KEYWORDS) as Bucket[]).forEach((b) => {
    let s = 0;
    for (const kw of KEYWORDS[b]) {
      if (n.includes(kw)) s += kw.split(/\s+/).length >= 2 ? 3 : 2;
    }
    if (s > 0) scores.set(b, s);
  });
  for (const { phrase, bucket, weight } of PHRASE_SIGNALS) {
    if (n.includes(phrase)) {
      scores.set(bucket, (scores.get(bucket) ?? 0) + weight);
    }
  }
  return scores;
}

function pickTop(
  scores: Map<Bucket, number>
): { bucket: Bucket; score: number } | null {
  let best: { bucket: Bucket; score: number } | null = null;
  for (const [bucket, score] of scores) {
    if (!best || score > best.score) best = { bucket, score };
  }
  return best && best.score >= 2 ? best : null;
}

function isGreetingOnly(text: string, scores: Map<Bucket, number>): boolean {
  const n = norm(text);
  if (n.length > 48) return false;
  const g = scores.get("greeting") ?? 0;
  return g >= 2 && scores.size <= 2;
}

/** Heuristic: worried about late/missed cycle (not "when is my next period" math) */
function isLateMissedConcern(text: string): boolean {
  const n = norm(text);
  const hasCycle =
    /\b(period|periods|cycle|menstrual|bleed|bleeding)\b/.test(n);
  if (!hasCycle) return false;
  const lateSig =
    /\b(late|missed|missing|delayed|skipped|didnt come|didn't come|hasnt come|hasn't come|no period|not come|not started)\b/.test(
      n
    );
  const scared =
    /\b(scared|worried|anxious|panic|freaking|embarrassed|ashamed)\b/.test(n);
  const askingNext =
    /\b(when is my next|next period|calculate|predict next)\b/.test(n);
  if (askingNext && !lateSig && !scared) return false;
  return lateSig || (scared && /\b(late|missed|still waiting|hasnt|hasn't)\b/.test(n));
}

function lateMissedPeriodReply(): string {
  return formatCoachReply({
    validate:
      "That’s a very common worry  -  you’re not alone, and it’s okay to feel unsure.",
    direct:
      "I can’t tell you exactly why **your** period is late or missed without a clinician. Cycles often shift with stress, sleep, illness, travel, weight change, or intense exams  -  and many people have an off month. **If pregnancy could be relevant** to your body, a home test (used as directed) or a doctor’s visit is how you get a clear answer  -  I can’t confirm or rule that out here.",
    explain: [
      "**Track:** first day of last period, any symptoms, stress/sleep changes  -  useful for you or a doctor.",
      "**Comfort now:** steady meals, hydration, rest, gentle movement if it feels okay  -  nothing here replaces care if you feel unwell.",
    ],
    steps: [
      "If a period is **very late** for you, or you have **new severe pain**, **very heavy bleeding**, **fainting**, or **fever**, seek medical care promptly.",
      "If worry is taking over your week, a short visit with a GP or campus clinic can be worth it for peace of mind.",
    ],
    caution: SAKHI_MEDICAL_DISCLAIMER,
  });
}

function periodNextReply(userText: string): string {
  const date = extractIsoDate(userText);
  const cycleDays = cycleDaysFromRegularity("regular");
  if (date) {
    const next = estimateNextPeriodStart(date, cycleDays);
    if (next) {
      return formatCoachReply({
        validate: "Here’s a simple estimate you can use as a rough guide.",
        direct:
          `If your last period started **${date}** and you use about **${cycleDays} days** per cycle as a placeholder (many people vary), your **next period might land around ${next}**.`,
        explain: [
          "Tracking **3–6 cycles** on paper or an app gives you **your** average  -  that beats any guess from a chatbot.",
        ],
        steps: [
          "Note the first day of bleeding each month.",
          "If cycles are often shorter than 21 days or longer than 35, or you feel unwell, talk to a clinician.",
        ],
        caution: SAKHI_MEDICAL_DISCLAIMER,
      });
    }
  }
  return formatCoachReply({
    direct:
      "To estimate the next period, I need your **last period start date** (first day of full flow). You can type it like **2026-03-01** or **15/03/2026**.",
    explain: [
      "Many cycles fall roughly in the **21–35 day** range  -  use what matches **your** history best.",
    ],
    caution: SAKHI_MEDICAL_DISCLAIMER,
  });
}

function periodGeneralReply(): string {
  return formatCoachReply({
    direct:
      "Periods are normal, and taking care of yourself around them is practical  -  not something to be ashamed of.",
    explain: [
      "**Hygiene:** change pads/tampons/cups as needed, wash hands, keep breathable underwear when you can.",
      "**Comfort:** warmth on the belly, hydration, balanced meals, rest  -  adjust to what feels right for your body.",
      "**Money (India):** small monthly line item for products; buying on sale or splitting bulk with a flatmate can help.",
    ],
    caution: SAKHI_MEDICAL_DISCLAIMER,
  });
}

function pmsReply(): string {
  return formatCoachReply({
    validate: "PMS can feel rough  -  mood dips, cravings, cramps, and bloating are common, and they’re not a character flaw.",
    direct:
      "Think **steady routines** more than perfection: sleep, food, and gentle movement often help more than strict rules.",
    explain: [
      "**Food ideas:** dal–rice–sabzi, fruit, curd; if you crave sweet/salty, try smaller portions of home-style snacks (makhana, chana, fruit chaat) so money and energy stay steadier.",
      "**Money:** a tiny weekly “comfort” budget can stop impulse swipes from piling up  -  no shame, just structure.",
    ],
    caution: SAKHI_MEDICAL_DISCLAIMER,
  });
}

function sipReply(userText: string): string {
  const nums = userText.match(/\b(\d{3,7})\b/g);
  const salary = nums
    ? Math.max(...nums.map((x) => parseInt(x, 10)).filter((n) => n >= 1000))
    : 0;
  const goal: "emergency" | "growth" | "short_term" = /\b(growth|long|retire|wealth)\b/i.test(
    userText
  )
    ? "growth"
    : /\b(short|1 year|2 year|trip|phone)\b/i.test(userText)
      ? "short_term"
      : "emergency";
  if (salary > 0) {
    const { suggested, note } = suggestMonthlySipInr(salary, goal);
    return formatCoachReply({
      direct:
        `With about **₹${salary.toLocaleString("en-IN")}/month** in hand and a **${goal.replace("_", " ")}**-style goal, a **rough educational starting point** some people use is around **₹${suggested.toLocaleString("en-IN")}/month** toward SIPs  -  ${note}`,
      explain: [
        "All investing has **risk**  -  start small, use **direct** plans when possible, and don’t lock away money you may need next month.",
        "Keep **3–6 months of must-pay expenses** in something liquid before chasing long-term funds.",
      ],
      caution: SAKHI_FINANCE_DISCLAIMER,
    });
  }
  return formatCoachReply({
    direct:
      "**SIPs** are a habit: you invest a fixed sum on a schedule. They don’t guarantee returns  -  they’re a structure, not a promise.",
    steps: [
      "Clarify goal: **emergency** vs **long-term growth** vs **short-term**.",
      "Share **monthly money in hand (₹)** and I can repeat a rough range in plain numbers.",
    ],
    caution: SAKHI_FINANCE_DISCLAIMER,
  });
}

function budgetReply(): string {
  return formatCoachReply({
    validate:
      "Money stress as a student is extremely common  -  you’re not “bad with money” for finding it hard.",
    direct:
      "A simple frame: **must-pay** (rent/mess/phone) → **small savings** (even ₹100/week counts) → **flexible spending**.",
    explain: [
      "Move savings **on day one** of the month if you can (UPI mandate / bank rule)  -  out of sight, less temptation.",
      "If you “always run out,” try a **weekly** spending cap for food delivery and impulse buys  -  adjust weekly, not with shame.",
    ],
    caution: SAKHI_FINANCE_DISCLAIMER,
  });
}

function scamReply(): string {
  return formatCoachReply({
    direct:
      "If something promises **easy money**, **guaranteed returns**, or **urgent KYC**, slow down  -  that’s where scams thrive.",
    steps: [
      "Never share **OTP**, **UPI PIN**, or **card CVV** with anyone “from the bank.”",
      "Open bank apps from **official stores**; type URLs yourself.",
      "If you already paid, call your bank with the **transaction ID** and screenshot evidence.",
    ],
    caution: SAKHI_FINANCE_DISCLAIMER,
  });
}

function emergencyFundReply(): string {
  return formatCoachReply({
    direct:
      "An emergency fund is **money you can reach in a day or two** for real surprises  -  not your long-term investing pot.",
    explain: [
      "A common aim is **3–6 months of essential expenses**  -  as a student, even **₹2,000–5,000** set aside can soften shocks.",
    ],
    steps: [
      "Pick one separate savings pocket or account label: “emergency only.”",
      "Refill it after you use it, even ₹200 at a time.",
    ],
    caution: SAKHI_FINANCE_DISCLAIMER,
  });
}

function wellnessReply(): string {
  return formatCoachReply({
    validate:
      "Stress and money worry can show up in sleep, appetite, and focus  -  that doesn’t mean you’re failing.",
    direct:
      "Tiny stabilisers beat giant resolutions: **one** regular meal time, **one** short walk, **one** screen-off window before bed.",
    steps: [
      "If low mood lasts **weeks** or you have thoughts of hurting yourself, please reach out to a counsellor or doctor  -  that’s care, not weakness.",
    ],
    caution: SAKHI_MEDICAL_DISCLAIMER,
  });
}

function greetingReply(): string {
  return formatCoachReply({
    direct:
      "Hi  -  I’m **Sakhi**, your calm coach for **money habits** and **period education** (built-in, private, no judgment).",
    explain: [
      "Ask about **budgeting, scams, SIPs, debt**, or **cycles, cramps, late periods, hygiene**  -  I’ll keep it simple and practical.",
    ],
    caution: `${SAKHI_MEDICAL_DISCLAIMER} ${SAKHI_FINANCE_DISCLAIMER}`,
  });
}

function affordReply(): string {
  return formatCoachReply({
    validate: "Wanting something doesn’t make you irresponsible  -  clarity helps you choose freely.",
    direct:
      "Before a purchase: subtract **must-pays** and **tiny savings**, then look at what’s truly left for the week.",
    explain: [
      "If the buy is a big chunk of monthly money, try **24–48 hours** before you pay  -  many impulses cool down.",
      "If you still want it, **trade something else off** (one less delivery meal, one subscription) so it’s a swap, not a spiral.",
    ],
    caution: SAKHI_FINANCE_DISCLAIMER,
  });
}

function literacyReply(): string {
  return formatCoachReply({
    direct:
      "**Credit score:** paying EMIs/cards on time and not maxing cards tends to help over time  -  it’s a habit signal, not a moral grade.",
    explain: [
      "**PAN / bank:** never share OTP; verify SMS in your official app.",
      "**Tax (students):** stipends and internships vary  -  keep Form 16 if you earn; use trusted free ITR tools if you file.",
    ],
    caution: SAKHI_FINANCE_DISCLAIMER,
  });
}

function loanTrapReply(): string {
  return formatCoachReply({
    direct:
      "**Instant loan apps** can hide huge fees and harassment  -  if something feels coercive, pause and get offline help.",
    steps: [
      "Prefer **scheduled banks** or clear education loans with paperwork you can read.",
      "If repayment is crushing, talk to someone you trust and explore legal / banking ombudsman routes  -  you still have rights.",
    ],
    caution: SAKHI_FINANCE_DISCLAIMER,
  });
}

function debtReply(): string {
  return formatCoachReply({
    validate:
      "Debt can feel shameful  -  it’s a math-and-habit problem many people face, not a verdict on your worth.",
    direct:
      "Two simple approaches people use: **avalanche**  -  put extra money on **highest interest** first; **snowball**  -  clear **smallest balance** first for motivation. Pick what you’ll actually stick to.",
    explain: [
      "Always cover **minimums** so penalties don’t explode.",
      "Even **₹200/week** extra toward one card/loan moves the timeline.",
    ],
    steps: [
      "List debts: **balance, interest, minimum due**.",
      "Cut one recurring leak (subscription / delivery) and send that to debt.",
    ],
    caution: SAKHI_FINANCE_DISCLAIMER,
  });
}

function fallbackReply(): string {
  return formatCoachReply({
    direct:
      "I’m strongest on **student money** (budget, scams, SIPs, debt, emergency savings) and **period education** (cycles, PMS, hygiene, when to seek care).",
    steps: [
      "Try a concrete question: “**Period is late and I’m scared**,” or “**₹3,000/month  -  how do I not run out?**”",
    ],
    caution: `${SAKHI_MEDICAL_DISCLAIMER} ${SAKHI_FINANCE_DISCLAIMER}`,
  });
}

/**
 * Produce assistant reply from conversation (last message must be user).
 */
export function localSakhiReply(messages: ChatTurn[]): string {
  if (messages.length === 0) return greetingReply();
  const last = messages[messages.length - 1];
  if (last.role !== "user") return greetingReply();

  const userText = last.content;
  const crisis = crisisReply(userText);
  if (crisis) return crisis;

  const recentUser = messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.content)
    .join(" ");
  const combined = `${recentUser} ${userText} ${userText}`;

  const scores = scoreBuckets(combined);
  if (isGreetingOnly(userText, scores)) return greetingReply();

  if (isLateMissedConcern(userText)) {
    return lateMissedPeriodReply();
  }

  const dateInMessage = extractIsoDate(userText);
  if (dateInMessage && /\b(period|cycle|next|when)\b/i.test(userText)) {
    return periodNextReply(userText);
  }

  const top = pickTop(scores);
  if (!top) {
    if (/\b(period|cycle|menstruat)\b/i.test(userText)) return periodGeneralReply();
    return fallbackReply();
  }

  switch (top.bucket) {
    case "greeting":
      return greetingReply();
    case "period_next":
      return periodNextReply(userText);
    case "period_late":
      return lateMissedPeriodReply();
    case "period_general":
      return periodGeneralReply();
    case "pms":
      return pmsReply();
    case "sip":
      return sipReply(userText);
    case "budget":
      return budgetReply();
    case "scam":
      return scamReply();
    case "emergency":
      return emergencyFundReply();
    case "wellness":
      return wellnessReply();
    case "afford":
      return affordReply();
    case "literacy":
      return literacyReply();
    case "loan":
      return loanTrapReply();
    case "debt":
      return debtReply();
    default:
      return fallbackReply();
  }
}
