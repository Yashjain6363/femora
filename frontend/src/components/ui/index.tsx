import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ICONS = {
  success: <CheckCircle size={18} className="text-[var(--color-success)]" />,
  error: <XCircle size={18} className="text-[var(--color-error)]" />,
  info: <Info size={18} className="text-[var(--color-info)]" />,
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} style={{ animation: 'slideInRight 0.25s ease' }}>
          {ICONS[toast.type]}
          <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '2px' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

// ─── Generic Modal ────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, footer, maxWidth = '520px',
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 style={{ fontFamily: 'Inter', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
            {title}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

// ─── Loading Spinner ───────────────────────────────────────────────────────
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => (
  <div className={`spinner spinner-${size === 'md' ? '' : size}`} role="status" aria-label="Loading" />
);

// ─── Empty State ───────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3 style={{ fontFamily: 'Inter', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>{title}</h3>
    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', maxWidth: 320 }}>{description}</p>
    {action && <div style={{ marginTop: 8 }}>{action}</div>}
  </div>
);

// ─── Confirm Dialog ────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', isLoading,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{message}</p>
    <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
      <button className="btn btn-outline" onClick={onClose} disabled={isLoading}>Cancel</button>
      <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading}>
        {isLoading ? <Spinner size="sm" /> : confirmLabel}
      </button>
    </div>
  </Modal>
);

// ─── Rating Dots ───────────────────────────────────────────────────────────
interface RatingDotsProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: number;
  label?: string;
}

export const RatingDots: React.FC<RatingDotsProps> = ({
  value, max = 5, onChange, size = 14, label
}) => (
  <div>
    {label && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginRight: 8 }}>{label}</span>}
    <div style={{ display: 'inline-flex', gap: 6 }}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange?.(i + 1)}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            border: 'none',
            cursor: onChange ? 'pointer' : 'default',
            background: i < value
              ? 'linear-gradient(135deg, #EFA5C4, #C85D8E)'
              : 'var(--color-border)',
            transition: 'all 0.15s ease',
            padding: 0,
          }}
          aria-label={`Rate ${i + 1} of ${max}`}
        />
      ))}
    </div>
  </div>
);

// ─── Intensity Bar ─────────────────────────────────────────────────────────
interface IntensityBarProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  label?: string;
}

export const IntensityBar: React.FC<IntensityBarProps> = ({
  value, max = 5, onChange, label,
}) => (
  <div>
    {label && (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="label" style={{ margin: 0 }}>{label}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>{value}/{max}</span>
      </div>
    )}
    <div className="intensity-bar">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`intensity-segment ${i < value ? 'active' : ''}`}
          onClick={() => onChange?.(i + 1)}
          style={{ cursor: onChange ? 'pointer' : 'default', height: 8 }}
        />
      ))}
    </div>
  </div>
);

// ─── Badge ─────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

// ─── Loading Screen ────────────────────────────────────────────────────────
export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-background)',
    gap: 16,
  }}>
    <div style={{ fontSize: '2rem' }}>🌸</div>
    <div className="spinner spinner-lg" />
    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{message}</p>
  </div>
);

// ─── Form Field ────────────────────────────────────────────────────────────
interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, children, required, hint }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label className="label">
      {label} {required && <span style={{ color: 'var(--color-accent)' }}>*</span>}
    </label>
    {children}
    {hint && !error && <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{hint}</span>}
    {error && <span className="field-error">{error}</span>}
  </div>
);
