import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FormField, Spinner } from '../components/ui';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);

    try {
      await login(form.email, form.password);
      showToast('Welcome back! 🌸', 'success');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid email or password';
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
      {/* Left panel */}
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
          position: 'absolute', top: '20%', right: '-10%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(239,165,196,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-5%',
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(200,93,142,0.25) 0%, transparent 70%)',
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
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 300 }}>
            Your wellness journey continues. Sign in to access your private health dashboard.
          </p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
            {['Your data stays private', 'Secure JWT authentication', 'Resume where you left off'].map(text => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', color: 'var(--color-text)', marginBottom: 6 }}>
              Sign In
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                Create one
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }} noValidate>
            <FormField label="Email Address" error={errors.email} required>
              <input
                id="email"
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
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
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
            </FormField>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{
            marginTop: 32,
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            By signing in, you acknowledge that HerCare is a wellness tracking tool,
            not a medical service.
          </p>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
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
