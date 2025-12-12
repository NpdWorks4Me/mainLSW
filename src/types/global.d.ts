declare global {
  interface Window {
    __STRIPE_PUBLISHABLE__?: string;
    __PHASER_DEBUG__?: boolean;
    getPhaserGame?: () => any;
  }
}

export {};
