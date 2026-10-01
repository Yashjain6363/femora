import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Droplets, Activity, Heart, Moon, Zap,
  CalendarCheck, UtensilsCrossed, BookHeart, TrendingUp,
  AlertCircle, Plus, ArrowRight, Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { dashboardApi } from '../api/services';
import type { DashboardSummary } from '../types';
import { useAuth } from '../context/AuthContext';
import { EmptyState, Spinner, Badge } from '../components/ui';
import { AppLayout } from '../components/layout/AppLayout';

const FLOW_LABELS: Record<string, string> = {
  SPOTTING: 'Spotting', LIGHT: 'Light', MEDIUM: 'Medium', HEAVY: 'Heavy', VERY_HEAVY: 'Very Heavy',
};

const FLOW_COLORS: Record<string, string> = {
  SPOTTING: '#FCE7F0', LIGHT: '#F4B8D4', MEDIUM: '#EFA5C4', HEAVY: '#D96F9E', VERY_HEAVY: '#C85D8E',
};

const MOOD_EMOJI: Record<number, string> = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' };
const ENERGY_EMOJI: Record<number, string> = { 1: '🪫', 2: '😴', 3: '😐', 4: '⚡', 5: '🔥' };

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric',
});

const formatDateTime = (iso: string) => new Date(iso).toLocaleString('en-US', {
  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

const daysUntil = (iso: string) => {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 0) return `${Math.abs(days)}d ago`;
  return `In ${days} days`;
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dashboardApi.getSummary();
        setData(res.data.data);
      } catch {
        setError('Failed to load dashboard. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (isLoading) return (
    <AppLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <Spinner size="lg" />
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto' }} className="animate-fade-in">

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>{greeting}, {user?.name?.split(' ')[0]}! 🌸</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/cycle" className="btn btn-primary btn-sm">
              <Plus size={14} /> Log Period
            </Link>
            <Link to="/journal" className="btn btn-secondary btn-sm">
              <Plus size={14} /> Log Symptom
            </Link>
          </div>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px',
            background: '#FFF0F0', borderRadius: 'var(--radius-md)',
            border: '1px solid #FFCECE', marginBottom: 24, color: 'var(--color-error)',
          }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        {/* ── Cycle Overview ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>

          {/* Cycle day */}
          <div className="card-gradient" style={{ padding: '24px 20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Calendar size={20} style={{ opacity: 0.85 }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.85 }}>CYCLE DAY</span>
            </div>
            {data?.cycle.currentCycleDay ? (
              <>
                <div style={{ fontSize: '2.8rem', fontFamily: 'Playfair Display', fontWeight: 700, lineHeight: 1 }}>
                  {data.cycle.currentCycleDay}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: 6 }}>
                  Last period: {data.cycle.lastPeriod ? formatDate(data.cycle.lastPeriod.startDate) : '—'}
                </div>
              </>
            ) : (
              <div style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: 8 }}>
                No period logged yet.
                <Link to="/cycle" style={{ display: 'block', color: 'rgba(255,255,255,0.9)', marginTop: 4, fontSize: '0.8rem', fontWeight: 600 }}>
                  Log your first →
                </Link>
              </div>
            )}
          </div>

          {/* Next period prediction */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, background: 'var(--color-primary-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplets size={16} color="var(--color-accent)" />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Period</span>
            </div>
            {data?.cycle.predictions.hasEnoughData ? (
              <>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  {formatDate(data.cycle.predictions.estimatedNextPeriod!)}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  ~{data.cycle.predictions.averageCycleLength}d cycle
                </div>
              </>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {data?.cycle.predictions.message || 'Log more cycles to see predictions'}
              </div>
            )}
          </div>

          {/* Today wellness */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, background: 'var(--color-primary-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={16} color="var(--color-accent)" />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mood Today</span>
            </div>
            {data?.todayWellness?.mood ? (
              <div style={{ fontSize: '2rem' }}>{MOOD_EMOJI[data.todayWellness.mood]}</div>
            ) : (
              <Link to="/journal" style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                + Log today's mood
              </Link>
            )}
          </div>

          {/* Sleep + Energy */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, background: 'var(--color-primary-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Moon size={16} color="var(--color-accent)" />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sleep</span>
            </div>
            {data?.todayWellness?.sleepHours ? (
              <>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  {data.todayWellness.sleepHours}h
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Energy: {data.todayWellness.energyLevel ? ENERGY_EMOJI[data.todayWellness.energyLevel] : '—'}</div>
              </>
            ) : (
              <Link to="/journal" style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                + Log sleep
              </Link>
            )}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Wellness trend chart */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Inter', fontSize: '0.95rem', fontWeight: 700 }}>Wellness Trend</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 8, height: 8, background: '#EFA5C4', borderRadius: 2 }} /> Mood
                </span>
                <span style={{ fontSize: '0.72rem', color: '#6B9EE8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 8, height: 8, background: '#6B9EE8', borderRadius: 2 }} /> Energy
                </span>
              </div>
            </div>
            {(data?.wellnessTrend?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={[...(data?.wellnessTrend || [])].reverse()}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis domain={[0, 5]} hide />
                  <Tooltip
                    formatter={(v: number, n: string) => [v, n === 'mood' ? 'Mood' : 'Energy']}
                    labelFormatter={(l) => formatDate(l)}
                    contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border-light)', fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="mood" stroke="#EFA5C4" strokeWidth={2} dot={{ r: 3, fill: '#EFA5C4' }} activeDot={{ r: 5 }} name="mood" />
                  <Line type="monotone" dataKey="energyLevel" stroke="#6B9EE8" strokeWidth={2} dot={{ r: 3, fill: '#6B9EE8' }} activeDot={{ r: 5 }} name="energy" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={<TrendingUp size={28} color="var(--color-accent)" />}
                title="No wellness data yet"
                description="Start logging daily wellness to see your trend chart here."
                action={<Link to="/journal" className="btn btn-secondary btn-sm">Log Wellness</Link>}
              />
            )}
          </div>

          {/* Upcoming appointments */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Inter', fontSize: '0.95rem', fontWeight: 700 }}>Upcoming Appointments</h3>
              <Link to="/appointments" style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {(data?.upcomingAppointments?.length ?? 0) > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data!.upcomingAppointments.map((appt) => (
                  <div key={appt.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 14px',
                    background: 'var(--color-background)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-light)',
                  }}>
                    <div style={{
                      width: 36, height: 36,
                      background: 'var(--gradient-primary)',
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <CalendarCheck size={16} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {appt.title}
                      </div>
                      {appt.provider && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{appt.provider}</div>
                      )}
                    </div>
                    <Badge variant="primary">{daysUntil(appt.date)}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CalendarCheck size={28} color="var(--color-accent)" />}
                title="No upcoming appointments"
                description="Schedule health checkups to stay on top of your wellness."
                action={<Link to="/appointments" className="btn btn-secondary btn-sm">Add Appointment</Link>}
              />
            )}
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Recent symptoms */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Inter', fontSize: '0.95rem', fontWeight: 700 }}>Recent Symptoms</h3>
              <Link to="/journal" style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {(data?.recentSymptoms?.length ?? 0) > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data!.recentSymptoms.map((s) => (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'var(--color-background)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-light)',
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {s.symptom.replace(/_/g, ' ')}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        {formatDate(s.loggedAt)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <div key={i} style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: i < s.severity ? 'var(--gradient-primary)' : 'var(--color-border)',
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Activity size={28} color="var(--color-accent)" />}
                title="No recent symptoms"
                description="Symptoms logged in the last 7 days will appear here."
              />
            )}
          </div>

          {/* Recent cravings */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Inter', fontSize: '0.95rem', fontWeight: 700 }}>Recent Cravings</h3>
              <Link to="/cravings" style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {(data?.recentCravings?.length ?? 0) > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data!.recentCravings.map((c) => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px',
                    background: 'var(--color-background)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-light)',
                  }}>
                    <div style={{
                      width: 32, height: 32, background: 'var(--color-primary-light)',
                      borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <UtensilsCrossed size={14} color="var(--color-accent)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.food}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{c.category} · {formatDate(c.loggedAt)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <div key={i} style={{
                          width: 5, height: 12, borderRadius: 2,
                          background: i < c.intensity ? 'var(--color-accent)' : 'var(--color-border)',
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<UtensilsCrossed size={28} color="var(--color-accent)" />}
                title="No recent cravings"
                description="Log your food cravings to understand patterns over time."
              />
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Inter', fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { icon: <Droplets size={18} />, label: 'Log Period', to: '/cycle', color: 'var(--color-primary)' },
              { icon: <Activity size={18} />, label: 'Log Symptom', to: '/journal', color: '#6B9EE8' },
              { icon: <UtensilsCrossed size={18} />, label: 'Track Craving', to: '/cravings', color: '#F5A623' },
              { icon: <CalendarCheck size={18} />, label: 'Add Appointment', to: '/appointments', color: 'var(--color-success)' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  background: 'var(--color-background)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-light)',
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-light)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-background)';
                }}
              >
                <div style={{ color: action.color }}>{action.icon}</div>
                <span>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppLayout>
  );
};
