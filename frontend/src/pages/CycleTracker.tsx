import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { periodApi } from '../api/services';
import type { PeriodEntry, CyclePredictions } from '../types';
import { AppLayout } from '../components/layout/AppLayout';
import { Modal, ConfirmDialog, EmptyState, Spinner, FormField, Badge } from '../components/ui';
import { useToast } from '../context/ToastContext';

const FLOW_OPTIONS = ['SPOTTING', 'LIGHT', 'MEDIUM', 'HEAVY', 'VERY_HEAVY'];
const FLOW_LABELS: Record<string, string> = {
  SPOTTING: 'Spotting', LIGHT: 'Light', MEDIUM: 'Medium', HEAVY: 'Heavy', VERY_HEAVY: 'Very Heavy',
};
const FLOW_COLORS: Record<string, string> = {
  SPOTTING: '#FCE7F0', LIGHT: '#F4B8D4', MEDIUM: '#EFA5C4', HEAVY: '#D96F9E', VERY_HEAVY: '#C85D8E',
};

const toLocalDate = (iso: string) => iso.split('T')[0];
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

interface PeriodFormData {
  startDate: string;
  endDate: string;
  flow: string;
  painLevel: number;
  notes: string;
}

const DEFAULT_FORM: PeriodFormData = {
  startDate: '',
  endDate: '',
  flow: 'MEDIUM',
  painLevel: 0,
  notes: '',
};

export const CycleTrackerPage: React.FC = () => {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<PeriodEntry[]>([]);
  const [predictions, setPredictions] = useState<CyclePredictions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PeriodEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<PeriodFormData>(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [calendarDate, setCalendarDate] = useState(new Date());

  const load = useCallback(async () => {
    try {
      const res = await periodApi.getAll();
      setEntries(res.data.data.entries);
      setPredictions(res.data.data.predictions);
    } catch {
      showToast('Failed to load period data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditingEntry(null);
    setForm({ ...DEFAULT_FORM, startDate: new Date().toISOString().split('T')[0] });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (entry: PeriodEntry) => {
    setEditingEntry(entry);
    setForm({
      startDate: toLocalDate(entry.startDate),
      endDate: entry.endDate ? toLocalDate(entry.endDate) : '',
      flow: entry.flow,
      painLevel: entry.painLevel,
      notes: entry.notes || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (form.endDate && form.endDate < form.startDate) errs.endDate = 'End date must be after start date';
    if (form.painLevel < 0 || form.painLevel > 10) errs.painLevel = 'Pain level must be 0–10';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      flow: form.flow,
      painLevel: form.painLevel,
      notes: form.notes || undefined,
    };

    try {
      if (editingEntry) {
        await periodApi.update(editingEntry.id, payload);
        showToast('Period entry updated ✓', 'success');
      } else {
        await periodApi.create(payload);
        showToast('Period logged successfully 🌸', 'success');
      }
      setShowModal(false);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save entry';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      await periodApi.delete(deleteId);
      showToast('Entry deleted', 'success');
      setDeleteId(null);
      load();
    } catch {
      showToast('Failed to delete entry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar logic
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  const periodDatesSet = new Set<string>();
  entries.forEach((e) => {
    const start = new Date(e.startDate);
    const end = e.endDate ? new Date(e.endDate) : new Date(e.startDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      periodDatesSet.add(d.toISOString().split('T')[0]);
    }
  });

  const isStartDate = (dateStr: string) => entries.some(e => toLocalDate(e.startDate) === dateStr);

  return (
    <AppLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fade-in">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>Cycle Tracker</h1>
            <p>Track your menstrual cycle and understand your patterns.</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Log Period
          </button>
        </div>

        {/* Prediction banner */}
        {predictions && (
          <div style={{
            background: predictions.hasEnoughData ? 'var(--color-primary-light)' : '#FEF5E7',
            border: `1px solid ${predictions.hasEnoughData ? 'var(--color-border)' : '#F5A623'}`,
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <Info size={18} color={predictions.hasEnoughData ? 'var(--color-accent)' : 'var(--color-warning)'} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              {predictions.hasEnoughData ? (
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
                  <strong>Estimated next period:</strong>{' '}
                  {formatDate(predictions.estimatedNextPeriod!)} &nbsp;·&nbsp;
                  Avg cycle: <strong>{predictions.averageCycleLength} days</strong>
                  {predictions.averagePeriodLength && <> &nbsp;·&nbsp; Avg period: <strong>{predictions.averagePeriodLength} days</strong></>}
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                    Based on your logged history. Not a medical prediction.
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
                  <strong>Predictions not available:</strong> {predictions.message}
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

          {/* Calendar */}
          <div className="card" style={{ padding: 24 }}>
            {/* Month navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <button className="btn btn-ghost btn-icon" onClick={() => setCalendarDate(new Date(year, month - 1))}>
                <ChevronLeft size={16} />
              </button>
              <h3 style={{ fontFamily: 'Inter', fontSize: '1rem', fontWeight: 700 }}>
                {MONTHS[month]} {year}
              </h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setCalendarDate(new Date(year, month + 1))}>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', padding: '4px 0' }}>{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isPeriod = periodDatesSet.has(dateStr);
                const isStart = isStartDate(dateStr);
                const isToday = dateStr === today;
                return (
                  <div
                    key={day}
                    className={`calendar-day ${isPeriod ? 'period' : ''} ${isToday && !isPeriod ? 'today' : ''}`}
                    style={{
                      position: 'relative',
                      fontWeight: isStart ? 700 : 500,
                      boxShadow: isStart ? '0 2px 8px rgba(200,93,142,0.4)' : undefined,
                    }}
                    title={isPeriod ? 'Period day' : undefined}
                  >
                    {day}
                    {isStart && (
                      <span style={{
                        position: 'absolute',
                        bottom: -2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 4,
                        height: 4,
                        background: 'white',
                        borderRadius: '50%',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 14, marginTop: 16, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-primary)' }} />
                Period
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-primary-light)', border: '1.5px solid var(--color-primary)' }} />
                Today
              </div>
            </div>
          </div>

          {/* History list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontFamily: 'Inter', fontSize: '0.95rem', fontWeight: 700 }}>Period History</h3>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div>
            ) : entries.length === 0 ? (
              <div className="card" style={{ padding: 0 }}>
                <EmptyState
                  icon={<Calendar size={28} color="var(--color-accent)" />}
                  title="No periods logged yet"
                  description="Log your first period to start tracking your cycle."
                  action={<button className="btn btn-primary btn-sm" onClick={openAdd}>Log First Period</button>}
                />
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="card" style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      width: 10, minHeight: 50,
                      background: FLOW_COLORS[entry.flow],
                      borderRadius: 4,
                      border: '1px solid var(--color-border-light)',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                            {formatDate(entry.startDate)}
                            {entry.endDate && <> — {formatDate(entry.endDate)}</>}
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                            <Badge variant="primary">{FLOW_LABELS[entry.flow]} Flow</Badge>
                            {entry.painLevel > 0 && (
                              <Badge variant={entry.painLevel <= 3 ? 'success' : entry.painLevel <= 6 ? 'warning' : 'error'}>
                                Pain: {entry.painLevel}/10
                              </Badge>
                            )}
                          </div>
                          {entry.notes && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 6 }}>{entry.notes}</p>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(entry)} aria-label="Edit entry">
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-danger btn-icon btn-sm" onClick={() => setDeleteId(entry.id)} aria-label="Delete entry">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEntry ? 'Edit Period Entry' : 'Log Period'}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : (editingEntry ? 'Save Changes' : 'Log Period')}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Start Date" error={formErrors.startDate} required>
            <input type="date" className={`input ${formErrors.startDate ? 'input-error' : ''}`}
              value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
          </FormField>
          <FormField label="End Date" error={formErrors.endDate} hint="Leave blank if period hasn't ended">
            <input type="date" className={`input ${formErrors.endDate ? 'input-error' : ''}`}
              value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
          </FormField>
          <FormField label="Flow Intensity">
            <select className="input" value={form.flow} onChange={(e) => setForm((f) => ({ ...f, flow: e.target.value }))}>
              {FLOW_OPTIONS.map((f) => <option key={f} value={f}>{FLOW_LABELS[f]}</option>)}
            </select>
          </FormField>
          <FormField label={`Pain Level: ${form.painLevel}/10`} error={formErrors.painLevel}>
            <input type="range" min={0} max={10} step={1}
              value={form.painLevel}
              onChange={(e) => setForm((f) => ({ ...f, painLevel: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: 'var(--color-accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
              <span>No pain</span><span>Severe</span>
            </div>
          </FormField>
          <FormField label="Notes">
            <textarea className="input" placeholder="How are you feeling? Any other notes..."
              value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} />
          </FormField>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Period Entry"
        message="Are you sure you want to delete this period entry? This action cannot be undone."
        isLoading={isSubmitting}
      />
    </AppLayout>
  );
};
