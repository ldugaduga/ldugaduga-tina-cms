'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

const ContactModalContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <ContactModalContext.Provider value={{ open, setOpen }}>{children}</ContactModalContext.Provider>;
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error('useContactModal must be used within a ContactModalProvider');
  return ctx;
}
