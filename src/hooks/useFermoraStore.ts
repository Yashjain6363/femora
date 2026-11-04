"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  CycleEntry,
  CravingLog,
  JournalEntry,
  HealthReminder,
  PlanningEvent,
  FermoraUserProfile,
  CyclePhase,
  MoodType,
  SymptomType,
  CravingCategory,
  CravingIntensity,
} from "@/types/fermora";
import {
  DEFAULT_PROFILE,
  SAMPLE_CYCLE_LOGS,
  SAMPLE_CRAVINGS,
  SAMPLE_JOURNAL_ENTRIES,
  SAMPLE_REMINDERS,
  SAMPLE_PLANNING_EVENTS,
  getCycleMetrics,
  CRAVING_SUGGESTIONS,
} from "@/lib/fermora-core";

const STORAGE_KEYS = {
  PROFILE: "fermora_user_profile",
  CYCLES: "fermora_cycle_logs",
  CRAVINGS: "fermora_craving_logs",
  JOURNAL: "fermora_journal_entries",
  REMINDERS: "fermora_reminders",
  PLANNING: "fermora_planning_events",
};

export function useFermoraStore() {
  const [profile, setProfile] = useState<FermoraUserProfile>(DEFAULT_PROFILE);
  const [cycles, setCycles] = useState<CycleEntry[]>(SAMPLE_CYCLE_LOGS);
  const [cravings, setCravings] = useState<CravingLog[]>(SAMPLE_CRAVINGS);
  const [journal, setJournal] = useState<JournalEntry[]>(SAMPLE_JOURNAL_ENTRIES);
  const [reminders, setReminders] = useState<HealthReminder[]>(SAMPLE_REMINDERS);
  const [planning, setPlanning] = useState<PlanningEvent[]>(SAMPLE_PLANNING_EVENTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (storedProfile) setProfile(JSON.parse(storedProfile));

      const storedCycles = localStorage.getItem(STORAGE_KEYS.CYCLES);
      if (storedCycles) setCycles(JSON.parse(storedCycles));

      const storedCravings = localStorage.getItem(STORAGE_KEYS.CRAVINGS);
      if (storedCravings) setCravings(JSON.parse(storedCravings));

      const storedJournal = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (storedJournal) setJournal(JSON.parse(storedJournal));

      const storedReminders = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (storedReminders) setReminders(JSON.parse(storedReminders));

      const storedPlanning = localStorage.getItem(STORAGE_KEYS.PLANNING);
      if (storedPlanning) setPlanning(JSON.parse(storedPlanning));
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  const saveProfile = useCallback((newProfile: FermoraUserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    } catch {}
  }, []);

  const addCycleEntry = useCallback(
    (entry: Omit<CycleEntry, "id">) => {
      const newEntry: CycleEntry = {
        ...entry,
        id: "cyc-" + Date.now(),
      };
      setCycles((prev) => {
        const next = [newEntry, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(next));
        } catch {}
        return next;
      });
      // Also update lastPeriodDate if newer
      if (entry.startDate >= profile.lastPeriodDate) {
        saveProfile({ ...profile, lastPeriodDate: entry.startDate });
      }
    },
    [profile, saveProfile]
  );

  const addCravingLog = useCallback(
    (entry: {
      craving: CravingCategory;
      intensity: CravingIntensity;
      mood: MoodType;
      notes?: string;
      satisfiedWith?: string;
    }) => {
      const metrics = getCycleMetrics(profile.lastPeriodDate, profile.cycleLength, profile.periodLength);
      const tip = CRAVING_SUGGESTIONS[entry.craving]?.suggestion;
      const newLog: CravingLog = {
        id: "crav-" + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        craving: entry.craving,
        intensity: entry.intensity,
        mood: entry.mood,
        associatedPhase: metrics.phase,
        notes: entry.notes,
        wellnessTip: tip,
        satisfiedWith: entry.satisfiedWith,
      };
      setCravings((prev) => {
        const next = [newLog, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.CRAVINGS, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [profile]
  );

  const addJournalEntry = useCallback(
    (entry: Omit<JournalEntry, "id" | "date">) => {
      const newEntry: JournalEntry = {
        ...entry,
        id: "jrn-" + Date.now(),
        date: new Date().toISOString().slice(0, 10),
      };
      setJournal((prev) => {
        const next = [newEntry, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    []
  );

  const deleteJournalEntry = useCallback((id: string) => {
    setJournal((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const next = prev.map((rem) =>
        rem.id === id ? { ...rem, enabled: !rem.enabled } : rem
      );
      try {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const addReminder = useCallback((rem: Omit<HealthReminder, "id">) => {
    const newRem: HealthReminder = {
      ...rem,
      id: "rem-" + Date.now(),
    };
    setReminders((prev) => {
      const next = [newRem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const next = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const addPlanningEvent = useCallback((event: Omit<PlanningEvent, "id" | "completed">) => {
    const newEvent: PlanningEvent = {
      ...event,
      id: "plan-" + Date.now(),
      completed: false,
    };
    setPlanning((prev) => {
      const next = [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date));
      try {
        localStorage.setItem(STORAGE_KEYS.PLANNING, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const togglePlanningEvent = useCallback((id: string) => {
    setPlanning((prev) => {
      const next = prev.map((ev) =>
        ev.id === id ? { ...ev, completed: !ev.completed } : ev
      );
      try {
        localStorage.setItem(STORAGE_KEYS.PLANNING, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const cycleMetrics = getCycleMetrics(
    profile.lastPeriodDate,
    profile.cycleLength,
    profile.periodLength
  );

  return {
    isLoaded,
    profile,
    cycleMetrics,
    cycles,
    cravings,
    journal,
    reminders,
    planning,
    saveProfile,
    addCycleEntry,
    addCravingLog,
    addJournalEntry,
    deleteJournalEntry,
    addReminder,
    toggleReminder,
    deleteReminder,
    addPlanningEvent,
    togglePlanningEvent,
  };
}
