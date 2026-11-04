"use client";

import { useState } from "react";
import {
  CalendarCheckIcon,
  PlusIcon,
  CalendarIcon,
  CheckCircleIcon,
  CircleIcon,
  LightbulbIcon,
  HeartIcon,
  CloseIcon,
} from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { useFermoraStore } from "@/hooks/useFermoraStore";
import type { CyclePhase, PlanningEvent } from "@/types/fermora";
import { PHASE_PLANNING_GUIDE } from "@/lib/fermora-core";

const PHASES: CyclePhase[] = ["menstrual", "follicular", "ovulatory", "luteal"];

export function PeriodPlanningModule() {
  const { planning, addPlanningEvent, togglePlanningEvent, cycleMetrics } = useFermoraStore();

  const [activePhaseTab, setActivePhaseTab] = useState<CyclePhase>(cycleMetrics.phase);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [phase, setPhase] = useState<CyclePhase>(cycleMetrics.phase);
  const [energyFit, setEnergyFit] = useState<PlanningEvent["energyFit"]>("creative");
  const [notes, setNotes] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addPlanningEvent({
      title: title.trim(),
      date,
      phase,
      energyFit,
      notes: notes.trim() || undefined,
    });

    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setShowAddModal(false);
      setTitle("");
      setNotes("");
    }, 900);
  };

  const activeGuide = PHASE_PLANNING_GUIDE[activePhaseTab];

  return (
    <section
      id="planning"
      aria-label="Period-aware planning module"
      className="relative py-20 px-4 bg-[#F8F3E9] border-t border-[#E8DFD5]"
    >
      <LogoWatermark variant="corner-top-right" size={210} opacity={0.03} />

      <div className="container-max section-padding relative z-10">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E6DDF4] text-[#7A3E8E] text-xs font-semibold tracking-wide uppercase border border-[#E8DFD5]">
              <CalendarCheckIcon size={14} />
              Module 05 · Period-aware Planning
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[#101F3B]">
              Life synchronized with your rhythm
            </h2>
            <p className="text-sm sm:text-base text-[#26334A]/75 font-light leading-relaxed">
              Design your work, creative endeavors, and movement to flow with your hormonal energy.
              Align demanding milestones with high-energy phases and protect intentional restorative time.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#101F3B] text-white hover:bg-[#26334A] border border-[#101F3B] transition-colors font-medium text-sm self-start md:self-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
          >
            <PlusIcon size={16} className="text-[#D1BDF2]" />
            Schedule Cycle-Aware Event
          </button>
        </div>

        {/* Phase Guide Interactive Tabs & Planned Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Phase Guide (Left 7 Cols) */}
          <div className="lg:col-span-7 rounded-xl bg-[#FAF7F2] p-6 sm:p-8 border border-[#E8DFD5] flex flex-col justify-between">
            <div>
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 pb-6 border-b border-[#E8DFD5] mb-6">
                {PHASES.map((p) => {
                  const guide = PHASE_PLANNING_GUIDE[p];
                  const isActive = activePhaseTab === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setActivePhaseTab(p)}
                      className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer border ${
                        isActive
                          ? "bg-[#B66ACB] text-white border-[#9C4EB3]"
                          : "bg-[#F8F3E9] text-[#26334A]/75 border-[#E8DFD5] hover:bg-[#E6DDF4]/60"
                      }`}
                    >
                      <span>{guide.title}</span>
                      <span className="block text-[10px] font-normal opacity-85 mt-0.5">
                        {guide.days}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Phase Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#B66ACB]">
                      {activeGuide.days} · {activeGuide.energy}
                    </span>
                    {cycleMetrics.phase === activePhaseTab && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#B66ACB]/20 text-[#7A3E8E] font-medium border border-[#B66ACB]/30">
                        Current Phase
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#101F3B]">
                    {activeGuide.theme}
                  </h3>
                </div>

                {/* Recommended Activities */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#101F3B] uppercase tracking-wider block">
                    Ideal Synchronized Activities:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeGuide.activities.map((act, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-md bg-[#F8F3E9] border border-[#E8DFD5] text-xs text-[#26334A]/85 flex items-start gap-2 transition-all duration-150 ease-out hover:bg-[#FAF4EB] hover:border-[#B66ACB]/50 hover:-translate-y-0.5 cursor-default"
                      >
                        <HeartIcon size={14} className="text-[#B66ACB] shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutrition support */}
                <div className="p-4 rounded-md bg-[#E6DDF4]/40 border border-[#E8DFD5] space-y-1">
                  <span className="text-xs font-semibold text-[#101F3B]">
                    Phase Nutrition Fuel:
                  </span>
                  <p className="text-xs text-[#26334A]/80 font-light leading-relaxed">
                    {activeGuide.nutritionFocus}
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer on variation */}
            <div className="pt-6 border-t border-[#E8DFD5] mt-6 text-xs text-[#26334A]/60 flex items-start gap-2 font-light">
              <LightbulbIcon size={14} className="text-[#B66ACB] shrink-0 mt-0.5" />
              <span>
                Suggestions are optional and customizable. Hormonal patterns differ from individual to
                individual; use your own body&apos;s intuition as the primary guide.
              </span>
            </div>
          </div>

          {/* Planned Events Schedule (Right 5 Cols) */}
          <div className="lg:col-span-5 rounded-xl bg-[#FAF7F2] p-6 sm:p-8 border border-[#E8DFD5] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5] mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#101F3B]">
                  Upcoming Synced Calendar
                </span>
                <span className="text-xs text-[#B66ACB] font-medium">
                  {planning.filter((p) => !p.completed).length} upcoming
                </span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {planning.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-md border transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/50 flex items-start gap-3 cursor-default ${
                      item.completed
                        ? "bg-[#F8F3E9] border-[#E8DFD5] opacity-60"
                        : "bg-[#FDFBF7] border-[#E8DFD5] hover:bg-[#FAF4EB]"
                    }`}
                  >
                    <button
                      onClick={() => togglePlanningEvent(item.id)}
                      className="mt-0.5 cursor-pointer text-[#B66ACB]"
                      title={item.completed ? "Mark incomplete" : "Mark completed"}
                      aria-label={item.completed ? "Mark incomplete" : "Mark completed"}
                    >
                      {item.completed ? (
                        <CheckCircleIcon size={18} />
                      ) : (
                        <CircleIcon size={18} className="text-[#26334A]/40" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            item.completed ? "line-through text-[#26334A]/50" : "text-[#101F3B]"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[11px] font-mono text-[#26334A]/60 shrink-0">
                          {item.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#F2DCE7] text-[#101F3B] capitalize border border-[#E8DFD5]">
                          {item.phase}
                        </span>
                        <span className="text-[10px] text-[#26334A]/60 capitalize">
                          Energy: {item.energyFit}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-[#26334A]/70 mt-1.5 font-light leading-relaxed">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 w-full py-2.5 rounded-md border border-dashed border-[#B66ACB] text-xs font-semibold text-[#B66ACB] hover:bg-[#B66ACB]/5 transition-colors cursor-pointer"
            >
              + Add Event to Cycle Planner
            </button>
          </div>
        </div>
      </div>

      {/* Add Planning Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101F3B]/50 animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl p-6 sm:p-8 max-w-lg w-full border border-[#E8DFD5] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-2xl font-semibold text-[#101F3B]">
                Schedule Cycle-Aware Event
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-[#26334A]/60 hover:text-[#101F3B] hover:bg-[#F8F3E9] transition-colors"
                aria-label="Close modal"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <p className="text-xs text-[#26334A]/70 mb-5">
              Plan tasks and movement in harmony with your expected energy level.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Activity / Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Strategic Planning Session, Long Run, Quiet Reading"
                  className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                    Cycle Phase
                  </label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value as CyclePhase)}
                    className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB] capitalize"
                  >
                    <option value="menstrual">Menstrual Phase</option>
                    <option value="follicular">Follicular Phase</option>
                    <option value="ovulatory">Ovulatory Phase</option>
                    <option value="luteal">Luteal Phase</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Expected Energy Match
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["restorative", "creative", "peak", "grounded"] as const).map((ef) => (
                    <button
                      type="button"
                      key={ef}
                      onClick={() => setEnergyFit(ef)}
                      className={`p-2 rounded-md border text-center text-xs capitalize transition-colors cursor-pointer ${
                        energyFit === ef
                          ? "border-[#B66ACB] bg-[#B66ACB]/15 text-[#101F3B] font-semibold"
                          : "border-[#E8DFD5] bg-[#F8F3E9] text-[#26334A]/70 hover:bg-[#FAF7F2]"
                      }`}
                    >
                      {ef}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Notes / Focus
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Schedule during high verbal fluency window"
                  className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md border border-[#E8DFD5] text-xs font-medium text-[#26334A] hover:bg-[#F8F3E9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#B66ACB] text-white hover:bg-[#9C4EB3] border border-[#9C4EB3] text-xs font-medium transition-colors cursor-pointer"
                >
                  {justSaved ? "Added to Plan!" : "Schedule Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
