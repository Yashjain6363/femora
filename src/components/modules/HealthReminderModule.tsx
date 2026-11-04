"use client";

import { useState } from "react";
import {
  BellRingIcon,
  PlusIcon,
  ClockIcon,
  CalendarIcon,
  PillIcon,
  StethoscopeIcon,
  HeartIcon,
  TrashIcon,
  CloseIcon,
} from "@/components/ui/icons";
import { LogoWatermark } from "@/components/shared/LogoWatermark";
import { useFermoraStore } from "@/hooks/useFermoraStore";
import type { HealthReminder } from "@/types/fermora";

const CATEGORIES: {
  id: HealthReminder["category"] | "all";
  label: string;
  icon: typeof BellRingIcon;
}[] = [
  { id: "all", label: "All Reminders", icon: BellRingIcon },
  { id: "period", label: "Cycle & Period", icon: CalendarIcon },
  { id: "medication", label: "Supplements", icon: PillIcon },
  { id: "appointment", label: "Appointments", icon: StethoscopeIcon },
  { id: "wellness", label: "Daily Rituals", icon: HeartIcon },
];

export function HealthReminderModule() {
  const { reminders, toggleReminder, addReminder, deleteReminder } = useFermoraStore();

  const [activeTab, setActiveTab] = useState<HealthReminder["category"] | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [category, setCategory] = useState<HealthReminder["category"]>("wellness");
  const [frequency, setFrequency] = useState<HealthReminder["frequency"]>("daily");
  const [notes, setNotes] = useState("");
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      title: title.trim(),
      time,
      category,
      frequency,
      enabled: true,
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

  const filtered = reminders.filter((rem) => {
    if (activeTab === "all") return true;
    return rem.category === activeTab;
  });

  return (
    <section
      id="reminders"
      aria-label="Health reminder module"
      className="relative py-20 px-4 bg-[#F8F3E9] border-t border-[#E8DFD5]"
    >
      <LogoWatermark variant="corner-bottom-left" size={210} opacity={0.03} />

      <div className="container-max section-padding relative z-10">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#B66ACB]/15 text-[#7A3E8E] text-xs font-semibold tracking-wide uppercase border border-[#E8DFD5]">
              <BellRingIcon size={14} />
              Module 04 · Health Reminder
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[#101F3B]">
              Centralized care reminders
            </h2>
            <p className="text-sm sm:text-base text-[#26334A]/75 font-light leading-relaxed">
              Stay ahead of your wellness needs. Gentle reminders for cycle preparation, evening magnesium,
              hydration goals, and annual appointments, completely configured by you.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#B66ACB] text-white hover:bg-[#9C4EB3] border border-[#9C4EB3] transition-all duration-150 ease-out active:scale-[0.98] font-medium text-sm self-start md:self-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B66ACB]"
          >
            <PlusIcon size={16} />
            Add Custom Reminder
          </button>
        </div>

        {/* Category Pills & Notification Switch */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#B66ACB]/60 active:scale-95 active:translate-y-0 cursor-pointer ${
                    isActive
                      ? "bg-[#101F3B] text-white border-[#101F3B]"
                      : "bg-[#FAF7F2] text-[#26334A]/80 border-[#E8DFD5] hover:bg-[#E6DDF4]/40"
                  }`}
                >
                  <Icon size={13} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Notification Settings Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#FAF7F2] border border-[#E8DFD5] text-xs">
            <span className="text-[#26334A]/70">Notifications:</span>
            <button
              onClick={() => setNotificationsOn(!notificationsOn)}
              className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-all duration-150 ease-out active:scale-95 cursor-pointer border ${
                notificationsOn
                  ? "bg-[#B66ACB] text-white border-[#9C4EB3]"
                  : "bg-[#E8DFD5] text-[#26334A]/70 border-[#E8DFD5]"
              }`}
            >
              {notificationsOn ? "Active" : "Paused"}
            </button>
          </div>
        </div>

        {/* Reminders List (2 Columns, strictly avoiding 3 cards in a row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-[#E8DFD5] bg-[#FAF7F2] p-12 text-center text-sm text-[#26334A]/60">
              No reminders in this category.
            </div>
          ) : (
            filtered.map((rem) => (
              <div
                key={rem.id}
                className={`rounded-xl border p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#B66ACB]/50 hover:bg-[#FAF4EB] cursor-default flex items-start justify-between gap-4 ${
                  rem.enabled
                    ? "bg-[#FAF7F2] border-[#E8DFD5]"
                    : "bg-[#F8F3E9] border-[#E8DFD5]/70 opacity-60"
                }`}
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E6DDF4] text-[#7A3E8E] border border-[#E8DFD5]">
                      {rem.category}
                    </span>
                    <span className="text-xs text-[#26334A]/60 capitalize flex items-center gap-1 font-mono">
                      <ClockIcon size={12} />
                      {rem.time} · {rem.frequency.replace("_", " ")}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-semibold transition-colors ${
                      rem.enabled ? "text-[#101F3B]" : "text-[#26334A]/50 line-through"
                    }`}
                  >
                    {rem.title}
                  </h3>

                  {rem.notes && (
                    <p className="text-xs text-[#26334A]/70 font-light leading-relaxed">
                      {rem.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Clean toggle without drop shadow */}
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors border ${
                      rem.enabled ? "bg-[#B66ACB] border-[#9C4EB3]" : "bg-[#E8DFD5] border-[#E8DFD5]"
                    }`}
                    title={rem.enabled ? "Disable reminder" : "Enable reminder"}
                    aria-label={rem.enabled ? "Disable reminder" : "Enable reminder"}
                  >
                    <div
                      className={`bg-white w-3.5 h-3.5 rounded-full border border-black/10 transform transition-transform ${
                        rem.enabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1 rounded-md text-[#26334A]/40 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete reminder"
                    aria-label="Delete reminder"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101F3B]/50 animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl p-6 sm:p-8 max-w-lg w-full border border-[#E8DFD5] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-2xl font-semibold text-[#101F3B]">
                Create Care Reminder
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
              Set proactive notifications for your wellness rituals.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Evening magnesium glycinate + warm bath"
                  className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as HealthReminder["frequency"])}
                    className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="cycle_specific">Cycle-Specific</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HealthReminder["category"])}
                  className="w-full px-3 py-2 rounded-md border border-[#E8DFD5] bg-[#F8F3E9] text-xs sm:text-sm text-[#101F3B] focus:outline-none focus:ring-2 focus:ring-[#B66ACB]"
                >
                  <option value="wellness">Daily Wellness Ritual</option>
                  <option value="period">Cycle &amp; Period Preparation</option>
                  <option value="medication">Supplements &amp; Medications</option>
                  <option value="appointment">Clinical Appointments</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101F3B] mb-1">
                  Gentle Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Take with a light snack and 250ml water..."
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
                  {justSaved ? "Saved!" : "Save Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
