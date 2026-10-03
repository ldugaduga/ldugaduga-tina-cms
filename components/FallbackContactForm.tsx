'use client';

import { useRef, useState } from 'react';

export function FallbackContactForm({ formAction }: { formAction: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{ kind: 'idle' | 'success' | 'error'; message: string }>({
    kind: 'idle',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

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
    <div className="form-page">
      <div className="form-card">
        <h1>Get in touch</h1>
        <p className="lead">Tell me a bit about your project and I&apos;ll reply by email.</p>
        <form ref={formRef} onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required maxLength={100} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required maxLength={5000} />
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
