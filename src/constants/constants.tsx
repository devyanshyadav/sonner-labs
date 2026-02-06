
import { ToastTheme } from '@/types/types';

export const THEMES: ToastTheme[] = [
  {
    id: 'shadcn',
    name: 'Shadcn UI',
    vibe: 'Modern',
    description: 'The industry standard for clean dashboards.',
    colors: { background: '#ffffff', border: '#e2e8f0', text: '#020817', description: '#64748b', icon: '#020817' },
    borderRadius: '8px', borderWidth: '1px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    vibe: 'Snappy',
    description: 'Deep contrast with emerald accents.',
    colors: { background: '#1c1c1c', border: '#2e2e2e', text: '#ffffff', description: '#9ca3af', icon: '#3ecf8e' },
    borderRadius: '6px', borderWidth: '1px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  {
    id: 'aws',
    name: 'AWS Console',
    vibe: 'Utility',
    description: 'Functional enterprise styling.',
    colors: { background: '#232f3e', border: '#ff9900', text: '#ffffff', description: '#eaeded', icon: '#ff9900' },
    borderRadius: '2px', borderWidth: '0 0 0 4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  {
    id: 'apple',
    name: 'Apple Glass',
    vibe: 'Premium',
    description: 'Elegant translucency and soft curves.',
    colors: { background: 'rgba(255, 255, 255, 0.7)', border: 'rgba(0,0,0,0.05)', text: '#1d1d1f', description: '#86868b', icon: '#007aff' },
    borderRadius: '18px', borderWidth: '1px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', blur: '20px'
  },
  {
    id: 'linear',
    name: 'Linear',
    vibe: 'Refined',
    description: 'The pinnacle of developer tool aesthetics.',
    colors: { background: '#151518', border: '#2a2a2d', text: '#f5f5f7', description: '#8a8a93', icon: '#5e6ad2' },
    borderRadius: '12px', borderWidth: '1px', boxShadow: '0 8px 32px rgba(94,106,210,0.1)'
  },
  {
    id: 'raycast',
    name: 'Raycast',
    vibe: 'Sleek',
    description: 'Dark, compact, and command-line ready.',
    colors: { background: '#1c1c1c', border: '#333333', text: '#ffffff', description: '#888888', icon: '#ff6363' },
    borderRadius: '10px', borderWidth: '1px', boxShadow: '0 12px 24px rgba(0,0,0,0.4)'
  },
  {
    id: 'cyberpunk',
    name: 'Night City',
    vibe: 'Retro-Future',
    description: 'Neon pink highlights on obsidian black.',
    colors: { background: '#000000', border: '#ff00ff', text: '#00ffff', description: '#ffff00', icon: '#ff00ff' },
    borderRadius: '0px', borderWidth: '2px', boxShadow: '4px 4px 0px #00ffff'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    vibe: 'Smooth',
    description: 'Indigo branding with professional depth.',
    colors: { background: '#ffffff', border: 'transparent', text: '#1a1f36', description: '#4f566b', icon: '#635bff' },
    borderRadius: '8px', borderWidth: '0px', boxShadow: '0 50px 100px -20px rgba(50,50,93,0.25)'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    vibe: 'Minimal',
    description: 'High-contrast monochrome excellence.',
    colors: { background: '#000000', border: '#333333', text: '#ffffff', description: '#888888', icon: '#ffffff' },
    borderRadius: '0px', borderWidth: '1px', boxShadow: '0 0 0 1px #333'
  },
  {
    id: 'github',
    name: 'GitHub Dark',
    vibe: 'Standard',
    description: 'The familiar look of the open source world.',
    colors: { background: '#0d1117', border: '#30363d', text: '#c9d1d9', description: '#8b949e', icon: '#238636' },
    borderRadius: '6px', borderWidth: '1px', boxShadow: '0 8px 24px rgba(1,4,9,0.2)'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    vibe: 'Vibrant',
    description: 'Signature green for social & media apps.',
    colors: { background: '#121212', border: 'transparent', text: '#ffffff', description: '#b3b3b3', icon: '#1db954' },
    borderRadius: '12px', borderWidth: '0px', boxShadow: '0 4px 60px rgba(0,0,0,0.5)'
  },
  {
    id: 'discord',
    name: 'Discord',
    vibe: 'Playful',
    description: 'Soft blurple for community platforms.',
    colors: { background: '#313338', border: 'transparent', text: '#f2f3f5', description: '#b5bac1', icon: '#5865f2' },
    borderRadius: '8px', borderWidth: '0px', boxShadow: '0 8px 16px rgba(0,0,0,0.24)'
  },
  {
    id: 'notion',
    name: 'Notion',
    vibe: 'Organic',
    description: 'Warm, paper-like feel for productivity.',
    colors: { background: '#ffffff', border: '#e1e1e1', text: '#37352f', description: 'rgba(55,53,47,0.6)', icon: '#37352f' },
    borderRadius: '4px', borderWidth: '1px', boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    vibe: 'Friendly',
    description: 'Soft shadows and round typography.',
    colors: { background: '#ffffff', border: '#dddddd', text: '#222222', description: '#717171', icon: '#ff385c' },
    borderRadius: '24px', borderWidth: '1px', boxShadow: '0 8px 28px rgba(0,0,0,0.12)'
  },
  {
    id: 'slack',
    name: 'Slack',
    vibe: 'Classic',
    description: 'The recognizable aubergine theme.',
    colors: { background: '#4a154b', border: 'transparent', text: '#ffffff', description: 'rgba(255,255,255,0.7)', icon: '#e01e5a' },
    borderRadius: '8px', borderWidth: '0px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    vibe: 'Utility',
    description: 'Sky-blue palette for modern web apps.',
    colors: { background: '#ffffff', border: '#bae6fd', text: '#0c4a6e', description: '#0369a1', icon: '#0ea5e9' },
    borderRadius: '12px', borderWidth: '2px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  },
  {
    id: 'dracula',
    name: 'Dracula',
    vibe: 'Developer',
    description: 'The iconic purple-tinted dark mode.',
    colors: { background: '#282a36', border: '#44475a', text: '#f8f8f2', description: '#6272a4', icon: '#bd93f9' },
    borderRadius: '6px', borderWidth: '1px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
  },
  {
    id: 'nord',
    name: 'Nordic',
    vibe: 'Frozen',
    description: 'Cool arctic tones for focused UIs.',
    colors: { background: '#2e3440', border: '#4c566a', text: '#eceff4', description: '#d8dee9', icon: '#88c0d0' },
    borderRadius: '8px', borderWidth: '1px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    vibe: 'Ink',
    description: 'Pure obsidian with sharp contrasts.',
    colors: { background: '#050505', border: '#1a1a1a', text: '#ffffff', description: '#444444', icon: '#ffffff' },
    borderRadius: '12px', borderWidth: '1px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  {
    id: 'arc',
    name: 'Arc',
    vibe: 'Glass',
    description: 'Strong translucency from the modern browser.',
    colors: { background: 'rgba(28, 28, 30, 0.5)', border: 'rgba(255,255,255,0.1)', text: '#ffffff', description: 'rgba(255,255,255,0.5)', icon: '#ffffff' },
    borderRadius: '20px', borderWidth: '1px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', blur: '25px'
  },
  {
    id: 'retina',
    name: 'Retina',
    vibe: 'High-Res',
    description: 'Ultra-thin borders and subtle glow.',
    colors: { background: '#ffffff', border: 'rgba(0,0,0,0.03)', text: '#000000', description: '#888888', icon: '#000000' },
    borderRadius: '14px', borderWidth: '0.5px', boxShadow: '0 0 0 1px rgba(0,0,0,0.01), 0 10px 20px rgba(0,0,0,0.05)'
  },
  {
    id: 'terminal',
    name: 'Hacker',
    vibe: 'Matrix',
    description: 'Green phosphorus CRT style.',
    colors: { background: '#0a0a0a', border: '#00ff00', text: '#00ff00', description: '#00cc00', icon: '#00ff00' },
    borderRadius: '0px', borderWidth: '1px', boxShadow: '0 0 15px rgba(0,255,0,0.2)'
  }
];
