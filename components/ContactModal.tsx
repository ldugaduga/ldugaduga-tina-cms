'use client';

import { useEffect, useRef, useState } from 'react';
import { useContactModal } from './ContactModalContext';

type Status = { kind: 'idle' | 'success' | 'error'; message: string };

export function ContactModal({ formAction }: { formAction: string }) {
  const { open, setOpen } = useContactModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<Element | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement;
      document.body.classList.add('modal-open');
      firstFieldRef.current?.focus();
    } else {
      document.body.classList.remove('modal-open');
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, input:not([tabindex="-1"]), textarea'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: 'idle', message: '' });
    setSubmitting(true);
    try {
      const res = await fetch(formAction, {
        method: 'POST',
        body: new FormData(e.currentTarget),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus({ kind: 'success', message: "Thanks, that's sent. I'll reply by email shortly." });
        formRef.current?.reset();
      } else {
        const data = await res.json().catch(() => null);
        const msg = data?.errors?.map((er: { message: string }) => er.message).join(', ');
        setStatus({ kind: 'error', message: msg || 'Something went wrong, please try again.' });
      }
    } catch {
      setStatus({ kind: 'error', message: 'Network error, please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={`modal-overlay ${open ? 'open' : ''}`}
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle" ref={modalRef}>
        <button type="button" className="modal-close" aria-label="Close" onClick={() => setOpen(false)}>
          <i className="ph ph-x" aria-hidden="true" />
        </button>
        <h2 id="modalTitle">Start a project</h2>
        <p className="lead">Tell me a bit about your project and I&apos;ll reply by email.</p>
        <form ref={formRef} onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="modalName">Name</label>
            <input ref={firstFieldRef} type="text" id="modalName" name="name" required maxLength={100} />
          </div>
          <div className="field">
            <label htmlFor="modalEmail">Email</label>
            <input type="email" id="modalEmail" name="email" required />
          </div>
          <div className="field">
            <label htmlFor="modalMessage">Message</label>
            <textarea id="modalMessage" name="message" required maxLength={5000} />
          </div>
          <input type="text" name="_gotcha" className="honeypot" tabIndex={-1} autoComplete="off" />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </button>
          <p className={`form-status ${status.kind !== 'idle' ? status.kind : ''}`.trim()}>{status.message}</p>
        </form>
      </div>
    </div>
  );
}
