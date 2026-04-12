export const theme = {
  // Backgrounds
  bg: '#080809',
  surface: '#111113',
  card: '#18181B',
  cardHover: '#1F1F23',

  // Accent — warm amber like a notification light
  accent: '#F59E0B',
  accentDim: 'rgba(245, 158, 11, 0.12)',
  accentBorder: 'rgba(245, 158, 11, 0.3)',

  // Semantic
  success: '#22C55E',
  successDim: 'rgba(34, 197, 94, 0.1)',
  danger: '#EF4444',
  dangerDim: 'rgba(239, 68, 68, 0.1)',
  warning: '#F59E0B',
  warningDim: 'rgba(245, 158, 11, 0.1)',

  // Text
  text: '#F4F4F5',
  textSub: '#A1A1AA',
  textMuted: '#52525B',

  // Borders
  border: '#27272A',
  borderLight: '#3F3F46',

  // Priority colors
  priority: {
    urgent: '#EF4444',
    normal: '#F59E0B',
    low: '#6B7280',
  },

  // Category colors
  category: {
    work: '#3B82F6',
    personal: '#8B5CF6',
    health: '#22C55E',
    finance: '#F59E0B',
    other: '#6B7280',
  },

  // Typography
  fontMono: Platform => Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  fontSans: Platform => Platform.OS === 'ios' ? 'System' : 'sans-serif',

  // Spacing
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },
};
