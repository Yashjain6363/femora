"use client";

import { useState } from "react";
import {
  UtensilsIcon,
  PlusIcon,
  LightbulbIcon,
  HeartIcon,
  CheckIcon,
  TrendingUpIcon,
  CloseIcon,
} from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { useFermoraStore } from "@/hooks/useFermoraStore";
import type { CravingCategory, CravingIntensity, MoodType } from "@/types/fermora";
import { CRAVING_SUGGESTIONS } from "@/lib/fermora-core";

const CRAVING_TYPES: {
  id: CravingCategory;
  label: string;
  dotColor: string;
}[] = [
  { id: "chocolate", label: "Dark Chocolate", dotColor: "#B66ACB" },
  { id: "salty", label: "Crunchy Salty", dotColor: "#D1BDF2" },
  { id: "sweet", label: "Sweet / Fruit", dotColor: "#F2DCE7" },
  { id: "comfort_food", label: "Warm Comfort", dotColor: "#EBD9CC" },
  { id: "carbs", label: "Warm Carbs", dotColor: "#E6DDF4" },
  { id: "caffeine", label: "Tea / Coffee", dotColor: "#B66ACB" },
  { id: "spicy", label: "Warm Spice", dotColor: "#D1BDF2" },
  { id: "savory", label: "Savory Dip", dotColor: "#EBD9CC" },
];

const INTENSITIES: { id: CravingIntensity; label: string; desc: string }[] = [
  { id: "mild", label: "Gentle", desc: "Fleeting thought" },
  { id: "moderate", label: "Noticeable", desc: "Persistent craving" },
  { id: "intense", label: "Urgent", desc: "Body demanding fuel" },
];

export function CravingControlModule() {
  const { cravings, addCravingLog, cycleMetrics } = useFermoraStore();

  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedCraving, setSelectedCraving] = useState<CravingCategory>("chocolate");
  const [selectedIntensity, setSelectedIntensity] = useState<CravingIntensity>("moderate");
  const [selectedMood, setSelectedMood] = useState<MoodType>("sensitive");
  const [notes, setNotes] = useState("");
  const [satisfiedWith, setSatisfiedWith] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addCravingLog({
      craving: selectedCraving,
      intensity: selectedIntensity,
      mood: selectedMood,
      notes: notes.trim() || undefined,
      satisfiedWith: satisfiedWith.trim() || undefined,
    });
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setShowLogModal(false);
    }, 900);
  };

  const activeSuggestion = CRAVING_SUGGESTIONS[selectedCraving];

  // Calculate frequency counts
  const cravingCounts = cravings.reduce<Record<string, number>>((acc, item) => {
    acc[item.craving] = (acc[item.craving] || 0) + 1;
    return acc;
  }, {});

  return (
    <section
      id="cravings"
      aria-label="Craving control module"
      className="relative py-20 px-4 bg-[#F8F3E9] border-t border-[#E8DFD5]"
    >
      <LogoWatermark variant="corner-bottom-left" size={210} opacity={0.03} />

      <div className="container-max section-padding relative z-10">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#D1BDF2]/30 text-[#7A3E8E] text-xs font-semibold tracking-wide uppercase border border-[#E8DFD5]">
              <UtensilsIcon size={14} />
              Module 02 · Craving Control
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[#101F3B]">
              Intuitive craving wisdom
            </h2>
            <p className="text-sm sm:text-base text-[#26334A]/75 font-light leading-relaxed">
              Cravings are biological signals, not moral failures. FERMORA decodes what your body
              needs (magnesium, dopamine, complex minerals) and provides balanced, comforting nourishment.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#101F3B] text-white hover:bg-[#26334A] border border-[#101F3B] transition-all duration-150 ease-out active:scale-[0.98] font-medium text-sm self-start md:self-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
          >
            <PlusIcon size={16} className="text-[#D1BDF2]" />
            Log Today&apos;s Craving
          </button>
        </div>

        {/* Nutrition Cards + Pattern Visualization (2 Columns on large screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Featured Suggestion Card (Left 6 Cols) */}
          <div className="lg:col-span-6 rounded-xl bg-[#FAF7F2] p-6 sm:p-8 border border-[#E8DFD5] flex flex-col justify-between transition-all duration-200 ease-out hover:border-[#B66ACB]/40">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5] mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B66ACB]">
                  Today&apos;s Body Signal ({cycleMetrics.phaseName})
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-[#E6DDF4] text-[#101F3B] font-medium border border-[#E8DFD5]">
                  Non-Restrictive Care
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#F2DCE7] border border-[#E8DFD5] flex items-center justify-center shrink-0">
                    <UtensilsIcon size={20} className="text-[#B66ACB]" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#101F3B]">
                      {activeSuggestion?.name || "Dark Chocolate & Almonds"}
                    </h3>
                    <p className="text-xs font-medium text-[#B66ACB] mt-0.5">
                      {activeSuggestion?.nutrients}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#F8F3E9] border border-[#E8DFD5] space-y-1.5 transition-all duration-150 ease-out hover:bg-[#FAF4EB] hover:border-[#B66ACB]/50 hover:-translate-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#101F3B]">
                    <LightbulbIcon size={14} className="text-[#B66ACB]" />
                    <span>The Biological Root:</span>
                  </div>
                  <p className="text-xs text-[#26334A]/80 leading-relaxed font-light">
                    {activeSuggestion?.why}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#FDFBF7] border border-[#E8DFD5] space-y-1.5 transition-all duration-150 ease-out hover:bg-[#FAF4EB] hover:border-[#B66ACB]/50 hover:-translate-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#101F3B]">
                    <UtensilsIcon size={14} className="text-[#7A3E8E]" />
                    <span>Mindful Recommendation:</span>
                  </div>
                  <p className="text-xs text-[#26334A]/85 leading-relaxed font-light">
                    {activeSuggestion?.suggestion}
                  </p>
                </div>
              </div>
            </div>

            {/* Selector pill row */}
            <div className="pt-6 border-t border-[#E8DFD5] mt-6">
              <span className="text-[11px] font-semibold text-[#26334A]/60 uppercase tracking-wider block mb-2">
                Explore What You&apos;re Craving:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CRAVING_TYPES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCraving(c.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer flex items-center gap-1.5 ${
                      selectedCraving === c.id
                        ? "bg-[#B66ACB] text-white border-[#B66ACB]"
                        : "bg-[#F8F3E9] text-[#26334A]/80 border-[#E8DFD5] hover:bg-[#E6DDF4]/40"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedCraving === c.id ? "#ffffff" : c.dotColor }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pattern Breakdown (Right 6 Cols) */}
          <div className="lg:col-span-6 rounded-xl bg-[#FAF7F2] p-6 sm:p-8 border border-[#E8DFD5] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5] mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#101F3B]">
                  Craving Distribution &amp; Cycle Trends
                </span>
                <span className="text-xs text-[#26334A]/60 flex items-center gap-1">
                  <TrendingUpIcon size={13} className="text-[#B66ACB]" />
                  Personal Patterns
                </span>
              </div>

              {/* Visual Bars */}
              <div className="space-y-4">
                {CRAVING_TYPES.slice(0, 5).map((type) => {
                  const count = cravingCounts[type.id] || 0;
                  const total = cravings.length || 1;
                  const pct = Math.round((count / total) * 100);

                  return (
                    <div key={type.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#101F3B] flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: type.dotColor }}
                          />
                          {type.label}
                        </span>
                        <span className="text-[#26334A]/60 font-mono text-[11px]">
                          {count} logs ({pct}%)
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#F8F3E9] overflow-hidden border border-[#E8DFD5]">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.max(10, pct)}%`,
                            backgroundColor: type.dotColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cycle correlation insight */}
              <div className="mt-8 p-4 rounded-lg bg-[#E6DDF4]/40 border border-[#E8DFD5] text-xs text-[#26334A]/80 leading-relaxed font-light">
                <span className="font-semibold text-[#101F3B]">Cycle Correlation: </span>
                During the late Luteal phase, basal metabolic rate naturally rises by 100 to 300 calories.
                Your desire for nourishing comfort carbs and rich dark chocolate is grounded in biology.
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8DFD5] mt-6 flex items-center justify-between text-xs text-[#26334A]/70">
              <span className="flex items-center gap-1.5">
                <HeartIcon size={14} className="text-[#B66ACB]" />
                Zero Food Guilt Philosophy
              </span>
              <span>Total Cravings Logged: {cravings.length}</span>
            </div>
          </div>
        </div>

        {/* Craving History (2-column layout to strictly avoid 3 cards in a row) */}
        <div className="rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] p-6">
          <h3 className="text-sm font-semibold text-[#101F3B] uppercase tracking-wider mb-4">
            Recent Craving History &amp; What Satisfied It
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cravings.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-[#E8DFD5] bg-[#F8F3E9] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#101F3B] capitalize">
                    {item.craving} ({item.intensity})
                  </span>
                  <span className="text-[#26334A]/50 font-mono text-[11px]">{item.date}</span>
                </div>
                <p className="text-xs text-[#26334A]/75 font-light leading-relaxed">
                  {item.wellnessTip || "Nourished with balanced options."}
                </p>
                {item.satisfiedWith && (
                  <div className="pt-1 text-[11px] text-[#B66ACB] font-medium flex items-center gap-1">
                    <CheckIcon size={12} />
                    <span>Satisfied with: {item.satisfiedWith}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101F3B]/50 animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl p-6 sm:p-8 max-w-lg w-full border border-[#E8DFD5] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-2xl font-semibold text-[#101F3B]">
                Log Food Craving
              </h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded-md text-[#26334A]/60 hover:text-[#101F3B] hover:bg-[#F8F3E9] transition-colors"
                aria-label="Close modal"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <p className="text-xs text-[#26334A]/70 mb-5">
              Notice what your body is asking for without judgment.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1.5">
                  Craving Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CRAVING_TYPES.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setSelectedCraving(c.id)}
                      className={`p-2 rounded-md border text-xs text-center transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer flex flex-col items-center justify-center ${
                        selectedCraving === c.id
                          ? "border-[#B66ACB] bg-[#B66ACB]/15 text-[#101F3B] font-semibold"
                          : "border-[#E8DFD5] bg-[#F8F3E9] text-[#26334A]/70 hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full mb-1"
                        style={{ backgroundColor: c.dotColor }}
                      />
                      <div className="text-[11px] truncate">{c.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1.5">
                  Intensity
                </label>
                <div className="flex items-stretch gap-2">
                  {INTENSITIES.map((i) => (
                    <button
                      type="button"
                      key={i.id}
                      onClick={() => setSelectedIntensity(i.id)}
                      className={`flex-1 p-2 rounded-md border text-center transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer ${
                        selectedIntensity === i.id
                          ? "border-[#B66ACB] bg-[#D1BDF2]/40 text-[#101F3B] font-semibold"
                          : "border-[#E8DFD5] bg-[#F8F3E9] text-[#26334A]/70 hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div className="text-xs font-medium">{i.label}</div>
                      <div className="text-[10px] text-[#26334A]/60">{i.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  What Satisfied It? (Optional)
                </label>
                <input
                  type="text"
                  value={satisfiedWith}
                  onChange={(e) => setSatisfiedWith(e.target.value)}
                  placeholder="e.g. 2 squares of 70% dark chocolate with almonds"
                  className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-md border border-[#E8DFD5] text-xs font-medium text-[#26334A] hover:bg-[#F8F3E9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#B66ACB] text-white hover:bg-[#9C4EB3] border border-[#9C4EB3] text-xs font-medium transition-colors cursor-pointer"
                >
                  {justSaved ? "Saved!" : "Log Craving"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
