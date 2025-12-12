// wildcard declarations for UI components to satisfy TypeScript for JS components
declare module '@/components/ui/*' {
  const Component: any;
  export default Component;
  export const __esModule: boolean;
}

export {};
