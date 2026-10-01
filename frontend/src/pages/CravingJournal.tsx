import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Pencil, Lightbulb, UtensilsCrossed, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cravingApi } from '../api/services';
import type { CravingEntry, CravingCategory } from '../types';
import { AppLayout } from '../components/layout/AppLayout';
import { Modal, ConfirmDialog, EmptyState, Spinner, FormField, Badge, IntensityBar } from '../components/ui';
import { useToast } from '../context/ToastContext';

const CATEGORIES: CravingCategory[] = [
  'SWEET', 'SALTY', 'SOUR', 'SPICY', 'FATTY', 'CARBS', 'PROTEIN', 'DAIRY', 'FRUITS', 'OTHER',
];

const CATEGORY_EMOJI: Record<string, string> = {
  SWEET: '🍭', SALTY: '🧂', SOUR: '🍋', SPICY: '🌶️', FATTY: '🧈',
  CARBS: '🍞', PROTEIN: '🥩', DAIRY: '🥛', FRUITS: '🍓', OTHER: '🍽️',
};

const MOODS = ['Happy', 'Anxious', 'Tired', 'Stressed', 'Content', 'Sad', 'Excited', 'Irritable'];

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

interface CravingFormData {
  food: string;
  category: CravingCategory;
  intensity: number;
  mood: string;
  notes: string;
}

const DEFAULT_FORM: CravingFormData = {
  food: '', category: 'SWEET', intensity: 3, mood: '', notes: '',
};

export const CravingJournalPage: React.FC = () => {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<CravingEntry[]>([]);
  const [topCategories, setTopCategories] = useState<Array<{ category: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CravingEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CravingFormData>(DEFAULT_FORM);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await cravingApi.getAll();
      setEntries(res.data.data.entries);
      setTopCategories(res.data.data.topCategories);
    } catch {
      showToast('Failed to load craving data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const fetchSuggestions = async (category: string) => {
    try {
      const res = await cravingApi.getSuggestions(category);
      setSuggestions(res.data.data.suggestions);
      setShowSuggestions(true);
    } catch {
      showToast('Failed to load suggestions', 'error');
    }
  };

  const openAdd = () => {
    setEditingEntry(null);
    setForm(DEFAULT_FORM);
    setShowModal(true);
  };

  const openEdit = (entry: CravingEntry) => {
    setEditingEntry(entry);
    setForm({
      food: entry.food,
      category: entry.category,
      intensity: entry.intensity,
      mood: entry.mood || '',
      notes: entry.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.food.trim()) {
      showToast('Please enter the food you are craving', 'error');
      return;
    }
    setIsSubmitting(true);

    const payload = {
      food: form.food.trim(),
      category: form.category,
      intensity: form.intensity,
      mood: form.mood || undefined,
      notes: form.notes || undefined,
    };

    try {
      if (editingEntry) {
        await cravingApi.update(editingEntry.id, payload);
        showToast('Craving updated ✓', 'success');
      } else {
        await cravingApi.create(payload);
        showToast('Craving logged 🍓', 'success');
      }
      setShowModal(false);
      load();
    } catch {
      showToast('Failed to save craving', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      await cravingApi.delete(deleteId);
      showToast('Entry deleted', 'success');
      setDeleteId(null);
      load();
    } catch {
      showToast('Failed to delete entry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = topCategories.map(({ category, count }) => ({
    name: `${CATEGORY_EMOJI[category]} ${category.charAt(0) + category.slice(1).toLowerCase()}`,
    count,
  }));

  return (
    <AppLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fade-in">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>Craving Journal</h1>
            <p>Record your food cravings and discover wholesome alternatives.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => { setShowSuggestions(true); fetchSuggestions('SWEET'); }}>
              <Lightbulb size={14} /> Suggestions
            </button>
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={16} /> Log Craving
            </button>
          </div>
        </div>

        {/* Chart row */}
        {topCategories.length > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <BarChart2 size={18} color="var(--color-accent)" />
              <h3 style={{ fontFamily: 'Inter', fontSize: '0.95rem', fontWeight: 700 }}>Most Common Cravings</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barSize={24}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border-light)', fontSize: 12 }}
                  formatter={(v: number) => [v, 'Times logged']}
                />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Entries */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size="lg" /></div>
        ) : entries.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<UtensilsCrossed size={32} color="var(--color-accent)" />}
              title="No cravings logged yet"
              description="Start tracking your food cravings to understand your patterns over time."
              action={<button className="btn btn-primary btn-sm" onClick={openAdd}>Log First Craving</button>}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {entries.map((entry) => (
              <div key={entry.id} className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.4rem' }}>{CATEGORY_EMOJI[entry.category]}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{entry.food}</div>
                      <Badge variant="primary">{entry.category.charAt(0) + entry.category.slice(1).toLowerCase()}</Badge>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(entry)}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => setDeleteId(entry.id)}><Trash2 size={13} /></button>
                  </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <IntensityBar value={entry.intensity} max={5} label="Intensity" />
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {entry.mood && <Badge variant="info">{entry.mood}</Badge>}
                </div>
                {entry.notes && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>{entry.notes}</p>
                )}
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{formatDate(entry.loggedAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEntry ? 'Edit Craving' : 'Log Craving'}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : (editingEntry ? 'Save Changes' : 'Log Craving')}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="What are you craving?" required>
            <input
              className="input"
              placeholder="e.g. chocolate cake, chips, ice cream"
              value={form.food}
              onChange={(e) => setForm((f) => ({ ...f, food: e.target.value }))}
            />
          </FormField>
          <FormField label="Category">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: `1.5px solid ${form.category === cat ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: form.category === cat ? 'var(--color-primary-light)' : 'transparent',
                    color: form.category === cat ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {CATEGORY_EMOJI[cat]} {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </FormField>
          <IntensityBar
            value={form.intensity}
            max={5}
            onChange={(v) => setForm((f) => ({ ...f, intensity: v }))}
            label="Intensity"
          />
          <FormField label="Current Mood">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, mood: f.mood === mood ? '' : mood }))}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: `1.5px solid ${form.mood === mood ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: form.mood === mood ? 'var(--color-primary-light)' : 'transparent',
                    color: form.mood === mood ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {mood}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label="Notes">
            <textarea className="input" placeholder="Any additional notes..." value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
          </FormField>
        </div>
      </Modal>

      {/* Suggestions Modal */}
      <Modal
        isOpen={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        title="Wellness Suggestions"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            {CATEGORIES.slice(0, 6).map((cat) => (
              <button key={cat} type="button"
                onClick={() => fetchSuggestions(cat)}
                style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-full)',
                  border: '1.5px solid var(--color-border)',
                  background: 'transparent', color: 'var(--color-text-secondary)',
                  fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                }}
              >
                {CATEGORY_EMOJI[cat]} {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div style={{
            background: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            marginBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Lightbulb size={16} color="var(--color-accent)" />
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-accent)' }}>
                Wholesome Alternatives
              </span>
            </div>
            <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {suggestions.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.875rem', color: 'var(--color-text)' }}>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            These are general wellness suggestions only. They are not medical advice. Please consult a healthcare professional for dietary guidance.
          </p>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Craving Entry"
        message="Are you sure you want to delete this craving entry?"
        isLoading={isSubmitting}
      />
    </AppLayout>
  );
};
