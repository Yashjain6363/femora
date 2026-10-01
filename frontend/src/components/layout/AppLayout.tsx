import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  UtensilsCrossed,
  BookHeart,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cycle', icon: Calendar, label: 'Cycle Tracker' },
  { to: '/cravings', icon: UtensilsCrossed, label: 'Craving Journal' },
  { to: '/journal', icon: BookHeart, label: 'Health Journal' },
  { to: '/appointments', icon: CalendarCheck, label: 'Appointments' },
];

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast('See you soon! 🌸', 'success');
    navigate('/');
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            background: 'var(--gradient-primary)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-text)' }}>
              HerCare
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: -2 }}>
              Wellness Platform
            </div>
          </div>
        </div>
        {onClose && (
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* User greeting */}
      <div style={{
        background: 'var(--gradient-soft)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        marginBottom: 24,
        border: '1px solid var(--color-border-light)',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Welcome back,</div>
        <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem', marginTop: 2 }}>
          {user?.name?.split(' ')[0]} 🌸
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: 8, paddingLeft: 14, textTransform: 'uppercase' }}>
          Navigation
        </div>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 16, marginTop: 16 }}>
        <button className="sidebar-link" style={{ width: '100%' }} onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* Desktop sidebar */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: 'white',
        borderRight: '1px solid var(--color-border-light)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
      }}
        className="hidden-mobile"
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(52,43,50,0.4)',
            zIndex: 200,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            style={{
              width: 260,
              height: '100%',
              background: 'white',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Mobile topbar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: 'white',
        borderBottom: '1px solid var(--color-border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 150,
        boxShadow: 'var(--shadow-sm)',
      }}
        className="show-mobile"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'var(--gradient-primary)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>
            HerCare
          </span>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>
      </div>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: 240,
        minHeight: '100vh',
        padding: '32px',
        overflowX: 'hidden',
      }}
        className="main-content"
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .main-content {
            margin-left: 0 !important;
            padding: 72px 16px 32px !important;
          }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};
