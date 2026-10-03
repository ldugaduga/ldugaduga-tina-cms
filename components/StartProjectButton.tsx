'use client';

import type { ReactNode } from 'react';
import { useContactModal } from './ContactModalContext';

export function StartProjectButton({
  className = 'btn btn-primary',
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { setOpen } = useContactModal();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        setOpen(true);
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}
