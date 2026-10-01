import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Pencil, CalendarCheck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { appointmentApi } from '../api/services';
import type { Appointment } from '../types';
import { AppLayout } from '../components/layout/AppLayout';
import { Modal, ConfirmDialog, EmptyState, Spinner, FormField, Badge } from '../components/ui';
import { useToast } from '../context/ToastContext';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const daysUntil = (iso: string): string => {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
};

interface ApptForm {
  title: string;
  date: string;
  time: string;
  provider: string;
  location: string;
  notes: string;
}

const DEFAULT_FORM: ApptForm = {
  title: '', date: '', time: '', provider: '', location: '', notes: '',
};

export const AppointmentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [completed, setCompleted] = useState<Appointment[]>([]);
  const [cancelled, setCancelled] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ApptForm>(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const res = await appointmentApi.getAll();
      setUpcoming(res.data.data.upcoming);
      setCompleted(res.data.data.completed);
      setCancelled(res.data.data.cancelled);
    } catch {
      showToast('Failed to load appointments', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditingAppt(null);
    setForm(DEFAULT_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (appt: Appointment) => {
    setEditingAppt(appt);
    const d = new Date(appt.date);
    const localDate = d.toISOString().split('T')[0];
    const localTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    setForm({
      title: appt.title,
      date: localDate,
      time: localTime,
      provider: appt.provider || '',
      location: appt.location || '',
      notes: appt.notes || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Appointment title is required';
    if (!form.date) errs.date = 'Date is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    const datetime = form.time
      ? new Date(`${form.date}T${form.time}:00`).toISOString()
      : new Date(`${form.date}T09:00:00`).toISOString();

    const payload = {
      title: form.title.trim(),
      date: datetime,
      provider: form.provider || undefined,
      location: form.location || undefined,
      notes: form.notes || undefined,
    };

    try {
      if (editingAppt) {
        await appointmentApi.update(editingAppt.id, payload);
        showToast('Appointment updated ✓', 'success');
      } else {
        await appointmentApi.create(payload);
        showToast('Appointment scheduled 📅', 'success');
      }
      setShowModal(false);
      load();
    } catch {
      showToast('Failed to save appointment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      await appointmentApi.delete(deleteId);
      showToast('Appointment deleted', 'success');
      setDeleteId(null);
      load();
    } catch {
      showToast('Failed to delete appointment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (appt: Appointment, status: 'COMPLETED' | 'CANCELLED') => {
    try {
      await appointmentApi.update(appt.id, { status });
      showToast(status === 'COMPLETED' ? 'Marked as completed ✓' : 'Appointment cancelled', 'success');
      load();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const TAB_COUNTS = { upcoming: upcoming.length, completed: completed.length, cancelled: cancelled.length };
  const activeList = tab === 'upcoming' ? upcoming : tab === 'completed' ? completed : cancelled;

  const STATUS_BADGE: Record<string, React.ReactNode> = {
    UPCOMING: <Badge variant="primary"><Clock size={10} /> Upcoming</Badge>,
    COMPLETED: <Badge variant="success"><CheckCircle size={10} /> Completed</Badge>,
    CANCELLED: <Badge variant="error"><XCircle size={10} /> Cancelled</Badge>,
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 900, margin: '0 auto' }} className="animate-fade-in">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>Appointments</h1>
            <p>Manage your health checkups and medical appointments.</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Appointment
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Upcoming', count: upcoming.length, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
            { label: 'Completed', count: completed.length, color: 'var(--color-success)', bg: '#E8F7F2' },
            { label: 'Cancelled', count: cancelled.length, color: 'var(--color-error)', bg: '#FFF0F0' },
          ].map((item) => (
            <div key={item.label} className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'Playfair Display', fontWeight: 700, color: item.color }}>
                {item.count}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--color-primary-light)', padding: 4, borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
          {(['upcoming', 'completed', 'cancelled'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6,
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {TAB_COUNTS[t] > 0 && (
                <span style={{
                  background: tab === t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  color: 'white', borderRadius: 'var(--radius-full)',
                  width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700,
                }}>
                  {TAB_COUNTS[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size="lg" /></div>
        ) : activeList.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<CalendarCheck size={32} color="var(--color-accent)" />}
              title={`No ${tab} appointments`}
              description={tab === 'upcoming' ? "Schedule your health checkups to stay proactive about your wellness." : `No ${tab} appointments to show.`}
              action={tab === 'upcoming' ? <button className="btn btn-primary btn-sm" onClick={openAdd}>Add Appointment</button> : undefined}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeList.map((appt) => (
              <div key={appt.id} className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 46, height: 46, flexShrink: 0,
                    background: appt.status === 'COMPLETED' ? 'linear-gradient(135deg, #4CAF91, #3A9A7A)' : 'var(--gradient-primary)',
                    borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <CalendarCheck size={20} color="white" />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>{appt.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 3 }}>
                          {formatDate(appt.date)}
                        </div>
                        {appt.provider && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 500, marginTop: 2 }}>
                            👨‍⚕️ {appt.provider}
                          </div>
                        )}
                        {appt.location && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                            📍 {appt.location}
                          </div>
                        )}
                        {appt.notes && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 6 }}>{appt.notes}</p>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        {STATUS_BADGE[appt.status]}
                        {appt.status === 'UPCOMING' && (
                          <Badge variant="info">{daysUntil(appt.date)}</Badge>
                        )}
                      </div>
                    </div>

                    {appt.status === 'UPCOMING' && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(appt)}>
                          <Pencil size={12} /> Edit
                        </button>
                        <button className="btn btn-sm" style={{ background: '#E8F7F2', color: 'var(--color-success)', border: '1px solid #C3E9DC' }}
                          onClick={() => handleStatusChange(appt, 'COMPLETED')}>
                          <CheckCircle size={12} /> Mark Complete
                        </button>
                        <button className="btn btn-sm" style={{ background: '#FFF0F0', color: 'var(--color-error)', border: '1px solid #FFCECE' }}
                          onClick={() => handleStatusChange(appt, 'CANCELLED')}>
                          <XCircle size={12} /> Cancel
                        </button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => setDeleteId(appt.id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                    {appt.status !== 'UPCOMING' && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(appt.id)}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAppt ? 'Edit Appointment' : 'Schedule Appointment'}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : (editingAppt ? 'Save Changes' : 'Schedule')}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Appointment Title" error={formErrors.title} required>
            <input className={`input ${formErrors.title ? 'input-error' : ''}`}
              placeholder="e.g. Annual Gynecologist Visit" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Date" error={formErrors.date} required>
              <input type="date" className={`input ${formErrors.date ? 'input-error' : ''}`}
                value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </FormField>
            <FormField label="Time">
              <input type="time" className="input" value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Doctor / Provider">
            <input className="input" placeholder="Dr. Jane Smith"
              value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))} />
          </FormField>
          <FormField label="Location / Clinic">
            <input className="input" placeholder="City Medical Center"
              value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          </FormField>
          <FormField label="Notes">
            <textarea className="input" placeholder="Bring reports, fasting required, etc."
              value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDelete} title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This cannot be undone."
        isLoading={isSubmitting} />
    </AppLayout>
  );
};
