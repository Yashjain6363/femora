import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Pencil, BookHeart, Activity, Moon, Droplets } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { symptomApi, wellnessApi } from '../api/services';
import type { SymptomEntry, WellnessEntry, SymptomType } from '../types';
import { AppLayout } from '../components/layout/AppLayout';
import { Modal, ConfirmDialog, EmptyState, Spinner, FormField, Badge, RatingDots } from '../components/ui';
import { useToast } from '../context/ToastContext';

const SYMPTOM_TYPES: SymptomType[] = [
  'CRAMPS', 'HEADACHE', 'FATIGUE', 'BLOATING', 'ACNE',
  'BACK_PAIN', 'BREAST_TENDERNESS', 'NAUSEA', 'MOOD_SWINGS', 'INSOMNIA', 'OTHER',
];

const SYMPTOM_EMOJI: Record<string, string> = {
  CRAMPS: '🤕', HEADACHE: '🤯', FATIGUE: '😴', BLOATING: '😣', ACNE: '😔',
  BACK_PAIN: '😓', BREAST_TENDERNESS: '💙', NAUSEA: '🤢', MOOD_SWINGS: '😤', INSOMNIA: '🌙', OTHER: '💊',
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
});

const toLocalDate = (iso: string) => iso.split('T')[0];

interface SymptomForm { symptom: SymptomType; severity: number; notes: string; }
interface WellnessForm { date: string; sleepHours: string; mood: number; energyLevel: number; stressLevel: number; waterIntake: string; notes: string; }

const DEFAULT_SYMPTOM: SymptomForm = { symptom: 'CRAMPS', severity: 3, notes: '' };
const DEFAULT_WELLNESS: WellnessForm = {
  date: new Date().toISOString().split('T')[0],
  sleepHours: '', mood: 3, energyLevel: 3, stressLevel: 2, waterIntake: '', notes: '',
};

type TabType = 'symptoms' | 'wellness';

export const HealthJournalPage: React.FC = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<TabType>('symptoms');

  // Symptoms state
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [symptomSummary, setSymptomSummary] = useState<Array<{ symptom: string; count: number; averageSeverity: number }>>([]);
  const [symptomLoading, setSymptomLoading] = useState(true);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<SymptomEntry | null>(null);
  const [symptomForm, setSymptomForm] = useState<SymptomForm>(DEFAULT_SYMPTOM);
  const [deleteSymptomId, setDeleteSymptomId] = useState<string | null>(null);

  // Wellness state
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
  const [wellnessLoading, setWellnessLoading] = useState(true);
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [editingWellness, setEditingWellness] = useState<WellnessEntry | null>(null);
  const [wellnessForm, setWellnessForm] = useState<WellnessForm>(DEFAULT_WELLNESS);
  const [deleteWellnessId, setDeleteWellnessId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadSymptoms = useCallback(async () => {
    try {
      const res = await symptomApi.getAll();
      setSymptoms(res.data.data.entries);
      setSymptomSummary(res.data.data.symptomSummary);
    } catch { showToast('Failed to load symptoms', 'error'); }
    finally { setSymptomLoading(false); }
  }, [showToast]);

  const loadWellness = useCallback(async () => {
    try {
      const res = await wellnessApi.getAll();
      setWellnessEntries(res.data.data);
    } catch { showToast('Failed to load wellness data', 'error'); }
    finally { setWellnessLoading(false); }
  }, [showToast]);

  useEffect(() => { loadSymptoms(); loadWellness(); }, [loadSymptoms, loadWellness]);

  // ── Symptom handlers ──────────────────────────────────────────────
  const openAddSymptom = () => {
    setEditingSymptom(null);
    setSymptomForm(DEFAULT_SYMPTOM);
    setShowSymptomModal(true);
  };

  const openEditSymptom = (s: SymptomEntry) => {
    setEditingSymptom(s);
    setSymptomForm({ symptom: s.symptom, severity: s.severity, notes: s.notes || '' });
    setShowSymptomModal(true);
  };

  const handleSymptomSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingSymptom) {
        await symptomApi.update(editingSymptom.id, symptomForm);
        showToast('Symptom updated ✓', 'success');
      } else {
        await symptomApi.create(symptomForm);
        showToast('Symptom logged 💊', 'success');
      }
      setShowSymptomModal(false);
      loadSymptoms();
    } catch { showToast('Failed to save symptom', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteSymptom = async () => {
    if (!deleteSymptomId) return;
    setIsSubmitting(true);
    try {
      await symptomApi.delete(deleteSymptomId);
      showToast('Symptom deleted', 'success');
      setDeleteSymptomId(null);
      loadSymptoms();
    } catch { showToast('Failed to delete symptom', 'error'); }
    finally { setIsSubmitting(false); }
  };

  // ── Wellness handlers ─────────────────────────────────────────────
  const openAddWellness = () => {
    setEditingWellness(null);
    setWellnessForm({ ...DEFAULT_WELLNESS, date: new Date().toISOString().split('T')[0] });
    setShowWellnessModal(true);
  };

  const openEditWellness = (w: WellnessEntry) => {
    setEditingWellness(w);
    setWellnessForm({
      date: toLocalDate(w.date),
      sleepHours: w.sleepHours?.toString() || '',
      mood: w.mood || 3,
      energyLevel: w.energyLevel || 3,
      stressLevel: w.stressLevel || 2,
      waterIntake: w.waterIntake?.toString() || '',
      notes: w.notes || '',
    });
    setShowWellnessModal(true);
  };

  const handleWellnessSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      date: wellnessForm.date,
      sleepHours: wellnessForm.sleepHours ? parseFloat(wellnessForm.sleepHours) : undefined,
      mood: wellnessForm.mood || undefined,
      energyLevel: wellnessForm.energyLevel || undefined,
      stressLevel: wellnessForm.stressLevel || undefined,
      waterIntake: wellnessForm.waterIntake ? parseFloat(wellnessForm.waterIntake) : undefined,
      notes: wellnessForm.notes || undefined,
    };
    try {
      if (editingWellness) {
        await wellnessApi.update(editingWellness.id, payload);
        showToast('Wellness updated ✓', 'success');
      } else {
        await wellnessApi.upsert(payload);
        showToast('Wellness logged ✨', 'success');
      }
      setShowWellnessModal(false);
      loadWellness();
    } catch { showToast('Failed to save wellness entry', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteWellness = async () => {
    if (!deleteWellnessId) return;
    setIsSubmitting(true);
    try {
      await wellnessApi.delete(deleteWellnessId);
      showToast('Entry deleted', 'success');
      setDeleteWellnessId(null);
      loadWellness();
    } catch { showToast('Failed to delete entry', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const radarData = symptomSummary.slice(0, 8).map((s) => ({
    subject: s.symptom.replace(/_/g, ' ').charAt(0) + s.symptom.replace(/_/g, ' ').slice(1).toLowerCase(),
    value: s.averageSeverity,
    fullMark: 5,
  }));

  const MOOD_EMOJI: Record<number, string> = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' };
  const ENERGY_EMOJI: Record<number, string> = { 1: '🪫', 2: '😴', 3: '😐', 4: '⚡', 5: '🔥' };

  return (
    <AppLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fade-in">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>Health Journal</h1>
            <p>Track symptoms and daily wellness to understand your body better.</p>
          </div>
          <button className="btn btn-primary" onClick={tab === 'symptoms' ? openAddSymptom : openAddWellness}>
            <Plus size={16} /> {tab === 'symptoms' ? 'Log Symptom' : 'Log Wellness'}
          </button>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: '#FEF5E7', border: '1px solid #F5A623',
          borderRadius: 'var(--radius-md)', padding: '10px 16px',
          fontSize: '0.8rem', color: 'var(--color-text)', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>ℹ️</span>
          <span>This journal is for personal wellness tracking only. It does not diagnose any medical condition. Please consult a healthcare professional for medical concerns.</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--color-primary-light)', padding: 4, borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
          {(['symptoms', 'wellness'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.875rem',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}>
              {t === 'symptoms' ? '💊 Symptoms' : '✨ Wellness'}
            </button>
          ))}
        </div>

        {tab === 'symptoms' && (
          <div>
            {/* Radar chart */}
            {symptomSummary.length > 1 && (
              <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Inter', fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>Symptom Pattern</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>Average severity by symptom type</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-border-light)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                    <Radar name="Severity" dataKey="value" stroke="var(--color-accent)" fill="var(--color-primary)" fillOpacity={0.3} />
                    <Tooltip formatter={(v) => {
                      if (v === undefined || v === null) return ['', 'Avg Severity'];
                      return [(v as number).toFixed(1), 'Avg Severity'];
                    }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {symptomLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size="lg" /></div>
            ) : symptoms.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={<Activity size={32} color="var(--color-accent)" />}
                  title="No symptoms logged yet"
                  description="Track symptoms like cramps, headaches, and fatigue to understand patterns over your cycle."
                  action={<button className="btn btn-primary btn-sm" onClick={openAddSymptom}>Log First Symptom</button>}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {symptoms.map((s) => (
                  <div key={s.id} className="card" style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '1.5rem' }}>{SYMPTOM_EMOJI[s.symptom]}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                            {s.symptom.replace(/_/g, ' ')}
                          </span>
                          <Badge variant={s.severity <= 2 ? 'success' : s.severity <= 3 ? 'warning' : 'error'}>
                            Severity {s.severity}/5
                          </Badge>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{formatDate(s.loggedAt)}</span>
                        </div>
                        {s.notes && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>{s.notes}</p>}
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditSymptom(s)}><Pencil size={13} /></button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => setDeleteSymptomId(s.id)}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'wellness' && (
          <div>
            {wellnessLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size="lg" /></div>
            ) : wellnessEntries.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={<BookHeart size={32} color="var(--color-accent)" />}
                  title="No wellness entries yet"
                  description="Log your daily sleep, mood, and energy levels to track your overall wellness."
                  action={<button className="btn btn-primary btn-sm" onClick={openAddWellness}>Log Today's Wellness</button>}
                />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                {wellnessEntries.map((w) => (
                  <div key={w.id} className="card" style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatDate(w.date)}</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditWellness(w)}><Pencil size={13} /></button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => setDeleteWellnessId(w.id)}><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {w.sleepHours && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Moon size={14} color="var(--color-accent)" />
                          <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{w.sleepHours}h sleep</span>
                        </div>
                      )}
                      {w.mood && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '1.1rem' }}>{MOOD_EMOJI[w.mood]}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Mood</span>
                        </div>
                      )}
                      {w.energyLevel && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '1.1rem' }}>{ENERGY_EMOJI[w.energyLevel]}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Energy</span>
                        </div>
                      )}
                      {w.waterIntake && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Droplets size={14} color="#6B9EE8" />
                          <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{w.waterIntake}L water</span>
                        </div>
                      )}
                      {w.stressLevel && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, gridColumn: '1/-1' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Stress:</span>
                          <div style={{ display: 'flex', gap: 3 }}>
                            {Array.from({ length: 5 }, (_, i) => (
                              <div key={i} style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: i < w.stressLevel! ? '#F5A623' : 'var(--color-border)',
                              }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {w.notes && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 10 }}>{w.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Symptom Modal */}
      <Modal
        isOpen={showSymptomModal}
        onClose={() => setShowSymptomModal(false)}
        title={editingSymptom ? 'Edit Symptom' : 'Log Symptom'}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowSymptomModal(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSymptomSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : (editingSymptom ? 'Save' : 'Log Symptom')}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Symptom Type" required>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {SYMPTOM_TYPES.map((type) => (
                <button key={type} type="button"
                  onClick={() => setSymptomForm((f) => ({ ...f, symptom: type }))}
                  style={{
                    padding: '5px 10px', borderRadius: 'var(--radius-full)',
                    border: `1.5px solid ${symptomForm.symptom === type ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: symptomForm.symptom === type ? 'var(--color-primary-light)' : 'transparent',
                    color: symptomForm.symptom === type ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {SYMPTOM_EMOJI[type]} {type.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label="Severity (1–5)">
            <RatingDots value={symptomForm.severity} max={5} onChange={(v) => setSymptomForm((f) => ({ ...f, severity: v }))} size={22} />
          </FormField>
          <FormField label="Notes">
            <textarea className="input" placeholder="Additional notes..." value={symptomForm.notes}
              onChange={(e) => setSymptomForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
          </FormField>
        </div>
      </Modal>

      {/* Wellness Modal */}
      <Modal
        isOpen={showWellnessModal}
        onClose={() => setShowWellnessModal(false)}
        title={editingWellness ? 'Edit Wellness Entry' : 'Log Daily Wellness'}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowWellnessModal(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleWellnessSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : (editingWellness ? 'Save' : 'Log Wellness')}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Date" required>
            <input type="date" className="input" value={wellnessForm.date}
              onChange={(e) => setWellnessForm((f) => ({ ...f, date: e.target.value }))} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Sleep (hours)">
              <input type="number" className="input" placeholder="7.5" min={0} max={24} step={0.5}
                value={wellnessForm.sleepHours}
                onChange={(e) => setWellnessForm((f) => ({ ...f, sleepHours: e.target.value }))} />
            </FormField>
            <FormField label="Water (litres)">
              <input type="number" className="input" placeholder="2.0" min={0} max={10} step={0.25}
                value={wellnessForm.waterIntake}
                onChange={(e) => setWellnessForm((f) => ({ ...f, waterIntake: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Mood">
            <RatingDots value={wellnessForm.mood} max={5} onChange={(v) => setWellnessForm((f) => ({ ...f, mood: v }))} size={26} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              <span>😢 Low</span><span>😊 Great</span>
            </div>
          </FormField>
          <FormField label="Energy Level">
            <RatingDots value={wellnessForm.energyLevel} max={5} onChange={(v) => setWellnessForm((f) => ({ ...f, energyLevel: v }))} size={26} />
          </FormField>
          <FormField label="Stress Level">
            <RatingDots value={wellnessForm.stressLevel} max={5} onChange={(v) => setWellnessForm((f) => ({ ...f, stressLevel: v }))} size={26} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              <span>Calm</span><span>Very stressed</span>
            </div>
          </FormField>
          <FormField label="Notes">
            <textarea className="input" placeholder="How are you feeling today?" value={wellnessForm.notes}
              onChange={(e) => setWellnessForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteSymptomId} onClose={() => setDeleteSymptomId(null)}
        onConfirm={handleDeleteSymptom} title="Delete Symptom" message="Delete this symptom entry?" isLoading={isSubmitting} />
      <ConfirmDialog isOpen={!!deleteWellnessId} onClose={() => setDeleteWellnessId(null)}
        onConfirm={handleDeleteWellness} title="Delete Wellness Entry" message="Delete this wellness entry?" isLoading={isSubmitting} />
    </AppLayout>
  );
};
