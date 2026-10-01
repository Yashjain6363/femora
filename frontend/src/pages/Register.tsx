import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FormField, Spinner } from '../components/ui';

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const checks = [
    { test: password.length >= 8, label: 'At least 8 characters' },
    { test: /[A-Z]/.test(password), label: 'Uppercase letter' },
    { test: /[0-9]/.test(password), label: 'Number' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
      {checks.map(({ test, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            background: test ? 'var(--gradient-primary)' : 'var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}>
            {test && <Check size={10} color="white" />}
          </div>
          <span style={{ color: test ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Password must contain an uppercase letter';
    else if (!/[0-9]/.test(form.password)) errs.password = 'Password must contain a number';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);

    try {
      await register(form.name.trim(), form.email, form.password);
      showToast('Welcome to HerCare! 🌸', 'success');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Registration failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--color-background)',
    }}>
      {/* Left decorative panel */}
      <div style={{
        background: 'var(--gradient-hero)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
      }} className="auth-panel-left">
        <div style={{
          position: 'absolute', top: '10%', right: '-5%',
          width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(239,165,196,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72,
            background: 'var(--gradient-primary)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <Sparkles size={34} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', color: 'var(--color-text)', marginBottom: 12 }}>
            Join HerCare
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 300 }}>
            Start your private wellness journey. Your data is yours alone — always secure, never shared.
          </p>
          <div style={{
            marginTop: 48,
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            border: '1px solid var(--color-border-light)',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              What you get
            </div>
            {[
              '🌙 Period cycle tracking',
              '🍓 Craving journal with suggestions',
              '💊 Symptom & wellness tracking',
              '📅 Appointment manager',
              '📊 Personal wellness trends',
            ].map(text => (
              <div key={text} style={{ fontSize: '0.875rem', color: 'var(--color-text)', marginBottom: 8, fontWeight: 500 }}>{text}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', color: 'var(--color-text)', marginBottom: 6 }}>
              Create Your Account
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
            <FormField label="Full Name" error={errors.name} required>
              <input
                id="name"
                type="text"
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                autoComplete="name"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Email Address" error={errors.email} required>
              <input
                id="reg-email"
                type="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Password" error={errors.password} required>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  autoComplete="new-password"
                  disabled={isLoading}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-secondary)', padding: 4,
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && <PasswordStrength password={form.password} />}
            </FormField>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 4 }}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{
            marginTop: 28,
            fontSize: '0.72rem',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            By creating an account, you agree that HerCare is a wellness tracking tool only
            and does not provide medical advice or diagnoses.
          </p>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-panel-left { display: none !important; }
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
