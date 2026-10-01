import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, UtensilsCrossed, BookHeart, CalendarCheck, ArrowRight, Sparkles, Heart, Shield } from 'lucide-react';

const FEATURES = [
  {
    icon: <Calendar size={28} color="var(--color-accent)" />,
    title: 'Period Tracking',
    description: 'Log and understand your menstrual cycle with an intuitive calendar. Track flow, pain, and patterns at your own pace.',
  },
  {
    icon: <UtensilsCrossed size={28} color="var(--color-accent)" />,
    title: 'Craving Control',
    description: 'Record cravings, understand patterns, and discover wholesome alternatives — all without judgment.',
  },
  {
    icon: <BookHeart size={28} color="var(--color-accent)" />,
    title: 'Health Journal',
    description: 'Track symptoms, mood, sleep, and energy. See your wellness patterns clearly over time.',
  },
  {
    icon: <CalendarCheck size={28} color="var(--color-accent)" />,
    title: 'Checkup Reminders',
    description: 'Never miss an important health appointment. Manage all your checkups in one organized space.',
  },
];

export const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255,249,251,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border-light)',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'var(--gradient-primary)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text)' }}>
            HerCare
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gradient-hero)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 64,
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '15%', right: '10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(239,165,196,0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(200,93,142,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{
          textAlign: 'center',
          maxWidth: 680,
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
          animation: 'slideUp 0.6s ease',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--color-primary-light)',
            color: 'var(--color-accent)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: 28,
            border: '1px solid rgba(200,93,142,0.2)',
          }}>
            <Sparkles size={14} />
            Your personal wellness companion
          </div>

          <h1 style={{
            fontFamily: 'Playfair Display',
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.15,
            marginBottom: 20,
          }}>
            Understand your cycle.{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Nurture yourself.
            </span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            marginBottom: 36,
            maxWidth: 520,
            margin: '0 auto 36px',
          }}>
            HerCare is a private, secure wellness platform for women to track cycles,
            understand patterns, log cravings, maintain health journals, and manage checkup reminders.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: 10 }}>
              Start Your Journey
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 24, marginTop: 48, flexWrap: 'wrap',
          }}>
            {[
              { icon: <Shield size={14} />, text: 'Private & Secure' },
              { icon: <Heart size={14} />, text: 'Wellness Focused' },
              { icon: <Sparkles size={14} />, text: 'Not Medical Advice' },
            ].map((item) => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: '0.8rem', color: 'var(--color-text-secondary)',
              }}>
                <span style={{ color: 'var(--color-accent)' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '96px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--color-text)', marginBottom: 12 }}>
            Everything you need to thrive
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            A complete wellness toolkit — beautifully designed, completely private, and always supportive.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          {FEATURES.map((feature) => (
            <div key={feature.title} className="card" style={{ padding: '32px 28px' }}>
              <div style={{
                width: 56, height: 56,
                background: 'var(--color-primary-light)',
                borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontFamily: 'Inter', fontSize: '1rem', fontWeight: 700,
                color: 'var(--color-text)', marginBottom: 10,
              }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section style={{
        background: 'var(--color-primary-light)',
        padding: '40px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border-light)',
        borderBottom: '1px solid var(--color-border-light)',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <Shield size={18} color="var(--color-accent)" />
            <span style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.95rem' }}>Important Notice</span>
          </div>
          <p style={{ color: 'var(--color-text)', fontSize: '0.875rem', lineHeight: 1.7, opacity: 0.8 }}>
            HerCare is a <strong>wellness tracking platform only</strong>. It does not diagnose diseases, replace medical advice, 
            predict medical conditions, or substitute for professional healthcare. Always consult qualified healthcare providers 
            for medical concerns.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--color-text)', marginBottom: 16 }}>
            Begin your wellness journey today
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
            Join thousands of women who track their wellness privately and confidently with HerCare.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--color-border-light)',
        padding: '28px 24px',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        fontSize: '0.8rem',
      }}>
        <p>© {new Date().getFullYear()} HerCare Wellness Platform. All rights reserved.</p>
        <p style={{ marginTop: 6, opacity: 0.7 }}>Not a medical device. For wellness tracking purposes only.</p>
      </footer>
    </div>
  );
};
