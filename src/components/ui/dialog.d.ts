declare module '@/components/ui/dialog' {
  import React from 'react';

  export const Dialog: React.FC<React.PropsWithChildren<any>>;
  export const DialogTrigger: React.FC<React.PropsWithChildren<{ asChild?: boolean }>>;
  export const DialogPortal: React.FC<React.PropsWithChildren<any>>;
  export const DialogClose: React.FC<React.PropsWithChildren<any>>;
  export const DialogOverlay: React.ForwardRefExoticComponent<any>;
  export const DialogContent: React.ForwardRefExoticComponent<any>;
  export const DialogHeader: React.FC<React.PropsWithChildren<any>>;
  export const DialogFooter: React.FC<React.PropsWithChildren<any>>;
  export const DialogTitle: React.ForwardRefExoticComponent<any>;
  export const DialogDescription: React.ForwardRefExoticComponent<any>;
}

export {};
