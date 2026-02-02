// Scene types for the video engine
export interface SceneConfig {
  type: 'kinetic-text' | 'stat-card' | 'list-reveal' | 'quote-card' | 'comparison' | 'cta' | 'code-snippet' | 'intro';
  duration: number; // in frames (30fps)
  props: Record<string, any>;
}

export interface VideoConfig {
  width: number;
  height: number;
  fps: number;
  scenes: SceneConfig[];
  theme: ThemeConfig;
  audio?: {
    url: string;
    volume?: number;
  };
}

export interface ThemeConfig {
  name: string;
  bgGradient: [string, string]; // [start, end] hex colors
  textColor: string;
  accentColor: string;
  fontFamily: string;
  // Computed from above
  bgGradientCSS?: string;
}

// Pre-built themes
export const THEMES: Record<string, ThemeConfig> = {
  midnight: {
    name: 'Midnight',
    bgGradient: ['#0f0c29', '#302b63'],
    textColor: '#ffffff',
    accentColor: '#f5576c',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
  ocean: {
    name: 'Ocean',
    bgGradient: ['#0F2027', '#2C5364'],
    textColor: '#ffffff',
    accentColor: '#00d2ff',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
  sunset: {
    name: 'Sunset',
    bgGradient: ['#2b1055', '#d53369'],
    textColor: '#ffffff',
    accentColor: '#ffd700',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
  forest: {
    name: 'Forest',
    bgGradient: ['#0b3d0b', '#1a5c1a'],
    textColor: '#ffffff',
    accentColor: '#7cfc00',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
  noir: {
    name: 'Noir',
    bgGradient: ['#0a0a0a', '#1a1a2e'],
    textColor: '#ffffff',
    accentColor: '#e94560',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
  fire: {
    name: 'Fire',
    bgGradient: ['#1a0000', '#4a0000'],
    textColor: '#ffffff',
    accentColor: '#ff6b35',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
};
