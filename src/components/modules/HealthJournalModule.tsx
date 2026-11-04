"use client";

import { useState } from "react";
import {
  BookHeartIcon,
  PlusIcon,
  SearchIcon,
  BatteryChargingIcon,
  TrashIcon,
  CalendarIcon,
  TagIcon,
  CloseIcon,
} from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { useFermoraStore } from "@/hooks/useFermoraStore";
import type { MoodType } from "@/types/fermora";

const ENERGY_LEVELS: { level: 1 | 2 | 3 | 4 | 5; label: string; desc: string }[] = [
  { level: 1, label: "Restorative", desc: "Low energy, seeking stillness" },
  { level: 2, label: "Gentle", desc: "Slow and mindful pace" },
  { level: 3, label: "Balanced", desc: "Steady and comfortable" },
  { level: 4, label: "High", desc: "Vibrant and proactive" },
  { level: 5, label: "Peak Vitality", desc: "Unstoppable confidence" },
];

const MOODS: { id: MoodType; label: string; dotColor: string }[] = [
  { id: "calm", label: "Calm", dotColor: "#7A3E8E" },
  { id: "energized", label: "Energized", dotColor: "#B66ACB" },
  { id: "happy", label: "Content", dotColor: "#D1BDF2" },
  { id: "sensitive", label: "Sensitive", dotColor: "#F2DCE7" },
  { id: "tired", label: "Exhausted", dotColor: "#EBD9CC" },
  { id: "anxious", label: "Anxious", dotColor: "#26334A" },
  { id: "irritable", label: "Restless", dotColor: "#101F3B" },
];

export function HealthJournalModule() {
  const { journal, addJournalEntry, deleteJournalEntry } = useFermoraStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [mood, setMood] = useState<MoodType>("calm");
  const [tagsInput, setTagsInput] = useState("daily, reflection");
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addJournalEntry({
      title: title.trim(),
      content: content.trim(),
      energyLevel,
      mood,
      symptoms: [],
      tags,
    });

    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setShowAddModal(false);
      setTitle("");
      setContent("");
    }, 900);
  };

  const filteredEntries = journal.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q) ||
      entry.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <section
      id="journal"
      aria-label="Health journal module"
      className="relative py-20 px-4 bg-[#F8F3E9] border-t border-[#E8DFD5]"
    >
      <LogoWatermark variant="corner-top-right" size={210} opacity={0.03} />

      <div className="container-max section-padding relative z-10">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F2DCE7] text-[#7A3E8E] text-xs font-semibold tracking-wide uppercase border border-[#E8DFD5]">
              <BookHeartIcon size={14} />
              Module 03 · Health Journal
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[#101F3B]">
              Your personal wellness journal
            </h2>
            <p className="text-sm sm:text-base text-[#26334A]/75 font-light leading-relaxed">
              Capture your daily body sensations, emotional tides, and energy patterns.
              A private, unhurried space to track your wellbeing across weeks and cycles.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#B66ACB] text-white hover:bg-[#9C4EB3] border border-[#9C4EB3] transition-all duration-150 ease-out active:scale-[0.98] font-medium text-sm self-start md:self-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
          >
            <PlusIcon size={16} />
            Write Reflection
          </button>
        </div>

        {/* Search Bar & Metrics */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <SearchIcon size={16} className="text-[#26334A]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries or tags..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-[#E8DFD5] bg-[#FAF7F2] text-xs sm:text-sm text-[#101F3B] placeholder-[#26334A]/40 focus:outline-none focus:ring-2 focus:ring-[#B66ACB] transition-all duration-150 hover:border-[#B66ACB]/50"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#26334A]/70 self-end sm:self-auto">
            <span>Showing {filteredEntries.length} of {journal.length} entries</span>
          </div>
        </div>

        {/* Journal Timeline Cards */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E8DFD5] bg-[#FAF7F2] p-12 text-center text-sm text-[#26334A]/60">
              No journal reflections found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const moodItem = MOODS.find((m) => m.id === entry.mood);
              return (
                <div
                  key={entry.id}
                  className="rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] p-6 space-y-3 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#B66ACB]/50 hover:bg-[#FAF4EB] cursor-default"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD5] pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: moodItem?.dotColor || "#B66ACB" }}
                      />
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[#101F3B]">
                          {entry.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#26334A]/60">
                          <CalendarIcon size={13} className="text-[#B66ACB]" />
                          <span className="font-mono text-[11px]">{entry.date}</span>
                          <span>·</span>
                          <span className="capitalize">{entry.mood}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {/* Energy Level Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F8F3E9] border border-[#E8DFD5] text-xs font-medium text-[#101F3B]">
                        <BatteryChargingIcon size={14} className="text-[#B66ACB]" />
                        <span>Level {entry.energyLevel}/5</span>
                        <span className="text-[10px] text-[#26334A]/60 hidden sm:inline">
                          ({ENERGY_LEVELS.find((el) => el.level === entry.energyLevel)?.label})
                        </span>
                      </div>

                      <button
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="p-1.5 rounded-md text-[#26334A]/50 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete entry"
                        aria-label="Delete entry"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Entry Content */}
                  <p className="text-xs sm:text-sm text-[#26334A]/85 leading-relaxed font-light whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  {/* Tags Row */}
                  {entry.tags.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#E6DDF4]/60 text-[#101F3B] border border-[#E8DFD5]"
                        >
                          <TagIcon size={11} className="text-[#B66ACB]" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101F3B]/50 animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl p-6 sm:p-8 max-w-lg w-full border border-[#E8DFD5] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-2xl font-semibold text-[#101F3B]">
                New Journal Reflection
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
              Record physical cues, mental reflections, and energy patterns.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Slow morning, gentle yoga, warm tea"
                  className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Reflection / Body Notes *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="How does your body feel today? Any sensations, mood notes, or comfort rituals..."
                  className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                />
              </div>

              {/* Energy Level 1-5 */}
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1.5">
                  Energy Level: {energyLevel}/5 ({ENERGY_LEVELS.find((el) => el.level === energyLevel)?.label})
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {ENERGY_LEVELS.map((el) => (
                    <button
                      type="button"
                      key={el.level}
                      onClick={() => setEnergyLevel(el.level)}
                      className={`py-2 rounded-md border text-center transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer ${
                        energyLevel === el.level
                          ? "border-[#B66ACB] bg-[#B66ACB] text-white font-semibold"
                          : "border-[#E8DFD5] bg-[#F8F3E9] text-[#26334A]/70 hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div className="text-xs font-mono font-medium">{el.level}</div>
                      <div className="text-[10px] truncate hidden sm:block">{el.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dominant Mood */}
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1.5">
                  Dominant Mood
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {MOODS.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`p-1.5 rounded-md border text-center transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer flex flex-col items-center justify-center ${
                        mood === m.id
                          ? "border-[#B66ACB] bg-[#B66ACB]/15 text-[#101F3B] font-semibold"
                          : "border-[#E8DFD5] bg-[#F8F3E9] text-[#26334A]/70 hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full mb-1"
                        style={{ backgroundColor: m.dotColor }}
                      />
                      <div className="text-[10px] truncate">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. cramps, magnesium, rest"
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
                  {justSaved ? "Saved!" : "Save Reflection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
