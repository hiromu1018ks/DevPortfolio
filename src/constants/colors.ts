export const COLORS = {
  base: '#FFFFFF',
  primary: '#111111',
  accent: '#0055FF',
  text: '#333333',
} as const;

export type ColorKey = keyof typeof COLORS;