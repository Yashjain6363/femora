"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderIcon, ArrowRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OnboardingSaveBody } from "@/lib/onboarding-schema";
import {
  cycleDaysFromRegularity,
  estimateNextPeriodStart,
  foodIdeasForCravings,
  suggestMonthlySipInr,
} from "@/lib/period-and-plan";

type Step =
  | "intro"
  | "gender"
  | "female_mood"
  | "female_cravings"
  | "female_cycle"
  | "male_stress"
  | "male_sleep"
  | "male_movement"
  | "money"
  | "last_period"
  | "period_insights"
  | "salary"
  | "sip_goal"
  | "summary"
  | "done";

type MoodId = NonNullable<
  NonNullable<NonNullable<OnboardingSaveBody["female"]>["moodPatterns"]>
>[number];
type CravingId = NonNullable<
  NonNullable<NonNullable<OnboardingSaveBody["female"]>["cravings"]>
>[number];
type CycleId = NonNullable<
  NonNullable<OnboardingSaveBody["female"]>["cycleRegularity"]
>;
type StressId = NonNullable<NonNullable<OnboardingSaveBody["male"]>["stressFocus"]>;
type SleepId = NonNullable<NonNullable<OnboardingSaveBody["male"]>["sleepQuality"]>;
type MoveId = NonNullable<NonNullable<OnboardingSaveBody["male"]>["movementLevel"]>;
type MoneyId = NonNullable<OnboardingSaveBody["moneyComfort"]>;
type GoalId = OnboardingSaveBody["investmentGoal"];

const MOOD_OPTIONS: { id: MoodId; label: string }[] = [
  { id: "irritable_or_snappy", label: "Irritable or snappy" },
  { id: "low_energy", label: "Low energy" },
  { id: "anxious_or_wired", label: "Anxious or wired" },
  { id: "tearful_or_sensitive", label: "Tearful or sensitive" },
  { id: "mostly_stable", label: "Mostly stable" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

const CRAVING_OPTIONS: { id: CravingId; label: string }[] = [
  { id: "sweet", label: "Sweet" },
  { id: "salty", label: "Salty" },
  { id: "comfort_food", label: "Comfort food" },
  { id: "caffeine", label: "Caffeine" },
  { id: "varies_no_pattern", label: "Varies / no pattern" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

const CYCLE_OPTIONS: { id: CycleId; label: string }[] = [
  { id: "regular", label: "Fairly regular" },
  { id: "somewhat_irregular", label: "Somewhat irregular" },
  { id: "not_tracking", label: "Not tracking" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

const STRESS_OPTIONS: { id: StressId; label: string }[] = [
  { id: "academics", label: "Academics" },
  { id: "money", label: "Money" },
  { id: "relationships_social", label: "Relationships / social" },
  { id: "health_body", label: "Health / body" },
  { id: "future_career", label: "Future / career" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

const SLEEP_OPTIONS: { id: SleepId; label: string }[] = [
  { id: "great", label: "Sleeping well" },
  { id: "okay", label: "Okay" },
  { id: "poor", label: "Poor / restless" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

const MOVE_OPTIONS: { id: MoveId; label: string }[] = [
  { id: "very_active", label: "Very active" },
  { id: "moderate", label: "Moderate" },
  { id: "mostly_sedentary", label: "Mostly sedentary" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

const MONEY_OPTIONS: { id: MoneyId; label: string }[] = [
  { id: "under_5k", label: "Under ₹5k / month" },
  { id: "5k_to_15k", label: "₹5k – ₹15k" },
  { id: "15k_to_30k", label: "₹15k – ₹30k" },
  { id: "above_30k", label: "Above ₹30k" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

const GOAL_OPTIONS: { id: GoalId; label: string }[] = [
  { id: "emergency", label: "Emergency fund first" },
  { id: "growth", label: "Long-term growth" },
  { id: "short_term", label: "Short-term goals (1–3 yrs)" },
];

function bubble(text: string, isSakhi: boolean) {
  return (
    <div className={isSakhi ? "" : "flex justify-end"}>
      {isSakhi && (
        <p className="text-rose-300/80 text-[0.65rem] font-bold uppercase tracking-wider mb-1">
          Sakhi
        </p>
      )}
      <div
        className={`inline-block max-w-[95%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isSakhi
            ? "bg-rose-500/12 border border-rose-500/20 text-white/85 rounded-bl-md"
            : "bg-violet-500/18 border border-violet-500/20 text-white/80 rounded-br-md"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export function OnboardingChat() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [gender, setGender] = useState<OnboardingSaveBody["gender"] | null>(null);
  const [moods, setMoods] = useState<MoodId[]>([]);
  const [cravings, setCravings] = useState<CravingId[]>([]);
  const [cycle, setCycle] = useState<CycleId | undefined>();
  const [stress, setStress] = useState<StressId | undefined>();
  const [sleep, setSleep] = useState<SleepId | undefined>();
  const [movement, setMovement] = useState<MoveId | undefined>();
  const [money, setMoney] = useState<MoneyId | undefined>();
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [salaryInput, setSalaryInput] = useState("");
  const [sipInput, setSipInput] = useState("");
  const [investmentGoal, setInvestmentGoal] = useState<GoalId | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  function toggleMulti<T extends string>(list: T[], id: T): T[] {
    if (list.includes(id)) return list.filter((x) => x !== id);
    return [...list, id];
  }

  function nextFromGender(g: OnboardingSaveBody["gender"]) {
    setGender(g);
    if (g === "female") setStep("female_mood");
    else if (g === "male") setStep("male_stress");
    else setStep("money");
  }

  function afterMoney() {
    if (gender === "female") setStep("last_period");
    else setStep("salary");
  }

  function buildBase(): Omit<OnboardingSaveBody, "salaryMonthlyInr" | "sipMonthlyInr" | "investmentGoal" | "lastPeriodDate"> {
    if (!gender) throw new Error("gender");
    return {
      gender,
      female:
        gender === "female"
          ? {
              moodPatterns: moods.length ? moods : undefined,
              cravings: cravings.length ? cravings : undefined,
              cycleRegularity: cycle,
            }
          : undefined,
      male:
        gender === "male"
          ? {
              stressFocus: stress,
              sleepQuality: sleep,
              movementLevel: movement,
            }
          : undefined,
      moneyComfort: money,
    };
  }

  function buildPayload(): OnboardingSaveBody {
    const salary = Number(salaryInput.replace(/,/g, "")) || 0;
    const sip = Number(sipInput.replace(/,/g, "")) || 0;
    if (!investmentGoal) throw new Error("goal");
    const base = buildBase();
    const lp =
      gender === "female" && lastPeriodDate && /^\d{4}-\d{2}-\d{2}$/.test(lastPeriodDate)
        ? lastPeriodDate
        : undefined;
    return {
      ...base,
      lastPeriodDate: lp,
      salaryMonthlyInr: salary,
      sipMonthlyInr: sip,
      investmentGoal: investmentGoal,
    };
  }

  async function submitAll() {
    setSaving(true);
    setSaveMsg("");
    let payload: OnboardingSaveBody;
    try {
      payload = buildPayload();
    } catch {
      setSaving(false);
      setSaveMsg("Please fill salary, SIP, and investment goal.");
      return;
    }

    try {
      const res = await fetch(`${window.location.origin}/api/onboarding/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const raw = await res.text();
      let data: { ok?: boolean; error?: string; message?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        setSaveMsg("Invalid server response.");
        setSaving(false);
        return;
      }

      if (res.status === 401) {
        router.push("/login?next=/onboarding");
        return;
      }

      if (!res.ok || !data.ok) {
        setSaveMsg(data.error ?? "Could not save. Try again.");
        setSaving(false);
        return;
      }

      setStep("done");
      setSaveMsg(data.message ?? "Saved.");
      router.refresh();
      setTimeout(() => {
        router.push("/dashboard?welcome=1");
      }, 1200);
    } catch {
      setSaveMsg("Network error.");
    }
    setSaving(false);
  }

  const cycleDays = cycleDaysFromRegularity(cycle);
  const nextPeriodPreview =
    gender === "female" && lastPeriodDate && /^\d{4}-\d{2}-\d{2}$/.test(lastPeriodDate)
      ? estimateNextPeriodStart(lastPeriodDate, cycleDays)
      : "";
  const foodPreview = foodIdeasForCravings(cravings);
  const salaryNum = Number(salaryInput.replace(/,/g, "")) || 0;
  const sipHint =
    investmentGoal && salaryNum > 0
      ? suggestMonthlySipInr(salaryNum, investmentGoal)
      : null;

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="rounded-3xl border border-white/[0.08] bg-obsidian-900/40 p-6 sm:p-8 min-h-[420px] flex flex-col">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5 flex-1 flex flex-col"
            >
              {bubble(
                "Hi  -  I'm Sakhi. We’ll tune wellness and money habits to you  -  including optional cycle-aware tips. Nothing here replaces medical or investment advice.",
                true
              )}
              <div className="flex-1" />
              <Button size="lg" className="w-full" onClick={() => setStep("gender")}>
                Let&apos;s go
                <ArrowRightIcon size={16} className="ml-2" aria-hidden="true" />
              </Button>
            </motion.div>
          )}

          {step === "gender" && (
            <motion.div key="gender" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
              {bubble("How should I personalize tips?", true)}
              <div className="flex flex-col gap-2">
                {(
                  [
                    ["female", "Girl / woman (period-aware tips)"],
                    ["male", "Boy / man (general wellness)"],
                    ["prefer_not_to_say", "Prefer not to say"],
                  ] as const
                ).map(([id, label]) => (
                  <Button key={id} type="button" variant="outline" className="justify-start h-auto py-3 px-4 text-left whitespace-normal" onClick={() => nextFromGender(id)}>
                    {label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "female_mood" && (
            <motion.div key="fm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("Around your cycle, what mood shifts show up most?", true)}
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((o) => (
                  <button key={o.id} type="button" onClick={() => setMoods((m) => toggleMulti(m, o.id))} className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${moods.includes(o.id) ? "bg-rose-500/25 border-rose-400/40 text-white" : "bg-white/5 border-white/10 text-white/65 hover:border-white/20"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep("female_cravings")}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === "female_cravings" && (
            <motion.div key="fc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("Which cravings show up most?", true)}
              <div className="flex flex-wrap gap-2">
                {CRAVING_OPTIONS.map((o) => (
                  <button key={o.id} type="button" onClick={() => setCravings((c) => toggleMulti(c, o.id))} className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${cravings.includes(o.id) ? "bg-rose-500/25 border-rose-400/40 text-white" : "bg-white/5 border-white/10 text-white/65 hover:border-white/20"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep("female_cycle")}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === "female_cycle" && (
            <motion.div key="fcy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("How regular is your cycle lately?", true)}
              <div className="flex flex-col gap-2">
                {CYCLE_OPTIONS.map((o) => (
                  <Button key={o.id} type="button" variant={cycle === o.id ? "default" : "outline"} className="justify-start" onClick={() => setCycle(o.id)}>
                    {o.label}
                  </Button>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep("money")}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === "male_stress" && (
            <motion.div key="ms" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("What stresses you most right now?", true)}
              <div className="flex flex-col gap-2">
                {STRESS_OPTIONS.map((o) => (
                  <Button key={o.id} type="button" variant={stress === o.id ? "default" : "outline"} className="justify-start" onClick={() => setStress(o.id)}>
                    {o.label}
                  </Button>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep("male_sleep")}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === "male_sleep" && (
            <motion.div key="msl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("How’s your sleep?", true)}
              <div className="flex flex-col gap-2">
                {SLEEP_OPTIONS.map((o) => (
                  <Button key={o.id} type="button" variant={sleep === o.id ? "default" : "outline"} className="justify-start" onClick={() => setSleep(o.id)}>
                    {o.label}
                  </Button>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep("male_movement")}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === "male_movement" && (
            <motion.div key="mm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("Movement / exercise lately?", true)}
              <div className="flex flex-col gap-2">
                {MOVE_OPTIONS.map((o) => (
                  <Button key={o.id} type="button" variant={movement === o.id ? "default" : "outline"} className="justify-start" onClick={() => setMovement(o.id)}>
                    {o.label}
                  </Button>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep("money")}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === "money" && (
            <motion.div key="money" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("Roughly, what monthly spending money do you work with?", true)}
              <div className="flex flex-col gap-2">
                {MONEY_OPTIONS.map((o) => (
                  <Button key={o.id} type="button" variant={money === o.id ? "default" : "outline"} className="justify-start" onClick={() => setMoney(o.id)}>
                    {o.label}
                  </Button>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={afterMoney}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === "last_period" && (
            <motion.div key="lp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("When did your last period start? (approximate first day  -  helps estimate your next one.)", true)}
              <div className="space-y-1.5">
                <Label htmlFor="last-period">Date</Label>
                <Input id="last-period" type="date" value={lastPeriodDate} onChange={(e) => setLastPeriodDate(e.target.value)} className="text-white" />
              </div>
              <Button size="lg" className="w-full" onClick={() => (lastPeriodDate ? setStep("period_insights") : setStep("salary"))}>
                {lastPeriodDate ? "Continue" : "Skip  -  I’ll track later"}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-white/50" onClick={() => { setLastPeriodDate(""); setStep("salary"); }}>
                Skip period tracking
              </Button>
            </motion.div>
          )}

          {step === "period_insights" && (
            <motion.div key="pi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble(
                nextPeriodPreview
                  ? `Rough estimate: your next period may start around ${nextPeriodPreview} (assuming ~${cycleDays} day cycles  -  not medical advice).`
                  : "We couldn’t estimate the next date  -  add a clearer last-period date anytime in the app later.",
                true
              )}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70 space-y-2">
                <p className="font-semibold text-white/85">Budget-friendly food ideas for your cravings:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {foodPreview.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep("salary")}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === "salary" && (
            <motion.div key="sal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("What’s your typical monthly money in hand (allowance + income after essentials)? In ₹.", true)}
              <Input type="text" inputMode="numeric" placeholder="e.g. 12000" value={salaryInput} onChange={(e) => setSalaryInput(e.target.value.replace(/[^\d]/g, ""))} />
              <Button size="lg" className="w-full" onClick={() => salaryInput.trim() && setStep("sip_goal")} disabled={!salaryInput.trim()}>
                Continue
              </Button>
            </motion.div>
          )}

          {step === "sip_goal" && (
            <motion.div key="sip" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {bubble("How much would you like to put into SIPs each month (₹)? Pick a goal too  -  we’ll suggest a range.", true)}
              <div className="space-y-1.5">
                <Label htmlFor="sip">Monthly SIP (₹)</Label>
                <Input id="sip" type="text" inputMode="numeric" placeholder="e.g. 500" value={sipInput} onChange={(e) => setSipInput(e.target.value.replace(/[^\d]/g, ""))} />
              </div>
              <div className="flex flex-col gap-2">
                {GOAL_OPTIONS.map((o) => (
                  <Button key={o.id} type="button" variant={investmentGoal === o.id ? "default" : "outline"} className="justify-start" onClick={() => setInvestmentGoal(o.id)}>
                    {o.label}
                  </Button>
                ))}
              </div>
              <Button size="lg" className="w-full" disabled={!sipInput.trim() || !investmentGoal} onClick={() => setStep("summary")}>
                Review plan
              </Button>
            </motion.div>
          )}

          {step === "summary" && (
            <motion.div key="sum" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4 text-left">
              {bubble("Here’s a quick preview before we save  -  you can adjust SIP anytime.", true)}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs text-white/75 space-y-3">
                <p>
                  <span className="text-white/90 font-medium">Salary (in hand):</span> ₹
                  {salaryNum.toLocaleString("en-IN")}
                </p>
                <p>
                  <span className="text-white/90 font-medium">Your SIP:</span> ₹
                  {Number(sipInput || 0).toLocaleString("en-IN")}/mo
                </p>
                {sipHint && (
                  <p>
                    <span className="text-white/90 font-medium">Rule-of-thumb for your goal:</span> ~₹
                    {sipHint.suggested.toLocaleString("en-IN")}/mo  -  {sipHint.note}
                  </p>
                )}
                {nextPeriodPreview && (
                  <p>
                    <span className="text-white/90 font-medium">Next period (approx.):</span> {nextPeriodPreview}
                  </p>
                )}
                <p className="text-white/45 pt-2 border-t border-white/10">
                  Educational only  -  not investment advice. Consult a qualified advisor for suitability.
                </p>
              </div>
              {saveMsg && <p className="text-red-400 text-sm">{saveMsg}</p>}
              <Button size="lg" className="w-full" disabled={saving} onClick={() => void submitAll()}>
                {saving ? (
                  <>
                    <LoaderIcon size={16} className="mr-2" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  "Save & finish"
                )}
              </Button>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 text-center">
              {bubble(saveMsg || "Saved. Taking you home…", true)}
              <Button asChild size="lg" className="w-full">
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-white/30">
        Wellness info is not medical advice. Money tips are not regulated investment advice.
      </p>
    </div>
  );
}
