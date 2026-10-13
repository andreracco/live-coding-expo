import { Platform } from 'react-native';

export const colors = {
  accent: '#5B4CF5',
  accentSoft: '#EEEAFF',
  accentBorder: '#D5CFFF',
  text: '#1B1B2F',
  muted: '#8A8AA3',
  border: '#E6E6EE',
  track: '#E6E6EE',
  background: '#FFFFFF',
  error: '#C0392B',
  summaryBg: '#1C1C30',
  summaryText: '#FFFFFF',
  summaryLabel: '#A9A3FF',
  tipBg: '#FFF7EC',
  tipBorder: '#F5DDB8',
  tipLabel: '#B7791F',
  successSoft: '#E3F8EA',
  success: '#1E7B45',
  skeleton: '#E9E9EF',
};

export const serifFont = Platform.select({ ios: 'Georgia', default: 'serif' });
