
import { ToastTheme } from '@/types/types';

export const THEMES: ToastTheme[] = [
  {
    id: 'shadcn',
    name: 'Shadcn UI',
    vibe: 'Modern',
    description: 'The industry standard for clean dashboards.',
    colors: { background: '#ffffff', border: '#e2e8f0', text: '#020817', description: '#64748b', icon: '#020817' },
    light: { background: '#ffffff', border: '#e2e8f0', text: '#020817', description: '#64748b', icon: '#020817' },
    dark: { background: '#020817', border: '#1e293b', text: '#f8fafc', description: '#94a3b8', icon: '#38bdf8' },
    borderRadius: '8px', borderWidth: '1px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    vibe: 'Snappy',
    description: 'Deep contrast with emerald accents.',
    colors: { background: '#1c1c1c', border: '#2e2e2e', text: '#ffffff', description: '#9ca3af', icon: '#3ecf8e' },
    light: { background: '#ffffff', border: '#e2e8f0', text: '#1c1c1c', description: '#64748b', icon: '#24b47e' },
    dark: { background: '#1c1c1c', border: '#2e2e2e', text: '#ffffff', description: '#9ca3af', icon: '#3ecf8e' },
    borderRadius: '6px', borderWidth: '1px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  {
    id: 'apple',
    name: 'Apple Glass',
    vibe: 'Premium',
    description: 'Elegant translucency and soft curves.',
    colors: { background: 'rgba(255, 255, 255, 0.7)', border: 'rgba(0,0,0,0.05)', text: '#1d1d1f', description: '#86868b', icon: '#007aff' },
    light: { background: 'rgba(255, 255, 255, 0.7)', border: 'rgba(0,0,0,0.05)', text: '#1d1d1f', description: '#86868b', icon: '#007aff' },
    dark: { background: 'rgba(28, 28, 30, 0.75)', border: 'rgba(255,255,255,0.1)', text: '#ffffff', description: 'rgba(255,255,255,0.5)', icon: '#0a84ff' },
    borderRadius: '18px', borderWidth: '1px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', blur: '20px'
  },
  {
    id: 'linear',
    name: 'Linear',
    vibe: 'Refined',
    description: 'The pinnacle of developer tool aesthetics.',
    colors: { background: '#151518', border: '#2a2a2d', text: '#f5f5f7', description: '#8a8a93', icon: '#5e6ad2' },
    light: { background: '#ffffff', border: '#f0f0f1', text: '#111111', description: '#71717a', icon: '#5e6ad2' },
    dark: { background: '#151518', border: '#2a2a2d', text: '#f5f5f7', description: '#8a8a93', icon: '#5e6ad2' },
    borderRadius: '12px', borderWidth: '1px', boxShadow: '0 8px 32px rgba(94,106,210,0.1)'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    vibe: 'Minimal',
    description: 'High-contrast monochrome excellence.',
    colors: { background: '#000000', border: '#333333', text: '#ffffff', description: '#888888', icon: '#ffffff' },
    light: { background: '#ffffff', border: '#eaeaea', text: '#000000', description: '#666666', icon: '#000000' },
    dark: { background: '#000000', border: '#333333', text: '#ffffff', description: '#888888', icon: '#ffffff' },
    borderRadius: '0px', borderWidth: '1px', boxShadow: '0 0 0 1px #333'
  },
  {
    id: 'github',
    name: 'GitHub',
    vibe: 'Standard',
    description: 'The familiar look of the open source world.',
    colors: { background: '#ffffff', border: '#d0d7de', text: '#24292f', description: '#57606a', icon: '#1a7f37' },
    light: { background: '#ffffff', border: '#d0d7de', text: '#24292f', description: '#57606a', icon: '#1a7f37' },
    dark: { background: '#0d1117', border: '#30363d', text: '#c9d1d9', description: '#8b949e', icon: '#238636' },
    borderRadius: '6px', borderWidth: '1px', boxShadow: '0 8px 24px rgba(1,4,9,0.2)'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    vibe: 'Smooth',
    description: 'Indigo branding with professional depth.',
    colors: { background: '#ffffff', border: 'transparent', text: '#1a1f36', description: '#4f566b', icon: '#635bff' },
    light: { background: '#ffffff', border: 'transparent', text: '#1a1f36', description: '#4f566b', icon: '#635bff' },
    dark: { background: '#1a1f36', border: 'rgba(255,255,255,0.08)', text: '#ffffff', description: '#adbdcc', icon: '#80e9ff' },
    borderRadius: '8px', borderWidth: '0px', boxShadow: '0 50px 100px -20px rgba(50,50,93,0.25)'
  },
  {
    id: 'notion',
    name: 'Notion',
    vibe: 'Organic',
    description: 'Warm, paper-like feel for productivity.',
    colors: { background: '#ffffff', border: '#e1e1e1', text: '#37352f', description: 'rgba(55,53,47,0.6)', icon: '#37352f' },
    light: { background: '#ffffff', border: '#e1e1e1', text: '#37352f', description: 'rgba(55,53,47,0.6)', icon: '#37352f' },
    dark: { background: '#191919', border: '#2e2e2e', text: '#ffffff', description: 'rgba(255,255,255,0.45)', icon: '#ffffff' },
    borderRadius: '4px', borderWidth: '1px', boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    vibe: 'Utility',
    description: 'Sky-blue palette for modern web apps.',
    colors: { background: '#ffffff', border: '#bae6fd', text: '#0c4a6e', description: '#0369a1', icon: '#0ea5e9' },
    light: { background: '#ffffff', border: '#bae6fd', text: '#0c4a6e', description: '#0369a1', icon: '#0ea5e9' },
    dark: { background: '#082f49', border: '#0c4a6e', text: '#f0f9ff', description: '#7dd3fc', icon: '#38bdf8' },
    borderRadius: '12px', borderWidth: '2px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  },
  {
    id: 'dracula',
    name: 'Dracula',
    vibe: 'Developer',
    description: 'The iconic purple-tinted dark mode.',
    colors: { background: '#282a36', border: '#44475a', text: '#f8f8f2', description: '#6272a4', icon: '#bd93f9' },
    light: { background: '#f8f8f2', border: '#e6e6e6', text: '#282a36', description: '#6272a4', icon: '#6272a4' },
    dark: { background: '#282a36', border: '#44475a', text: '#f8f8f2', description: '#6272a4', icon: '#bd93f9' },
    borderRadius: '6px', borderWidth: '1px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
  },
  {
    id: 'nord',
    name: 'Nordic',
    vibe: 'Frozen',
    description: 'Cool arctic tones for focused UIs.',
    colors: { background: '#2e3440', border: '#4c566a', text: '#eceff4', description: '#d8dee9', icon: '#88c0d0' },
    light: { background: '#eceff4', border: '#d8dee9', text: '#2e3440', description: '#4c566a', icon: '#5e81ac' },
    dark: { background: '#2e3440', border: '#4c566a', text: '#eceff4', description: '#d8dee9', icon: '#88c0d0' },
    borderRadius: '8px', borderWidth: '1px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
  },
  {
    id: 'terminal',
    name: 'Matrix',
    vibe: 'Hacker',
    description: 'Green phosphorus CRT style.',
    colors: { background: '#0a0a0a', border: '#00ff00', text: '#00ff00', description: '#00cc00', icon: '#00ff00' },
    light: { background: '#f0fff0', border: '#2ecc71', text: '#1b4d3e', description: '#27ae60', icon: '#2ecc71' },
    dark: { background: '#0a0a0a', border: '#00ff00', text: '#00ff00', description: '#00cc00', icon: '#00ff00' },
    borderRadius: '0px', borderWidth: '1px', boxShadow: '0 0 15px rgba(0,255,0,0.2)'
  }
];
