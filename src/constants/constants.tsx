import { ToastTheme } from '@/types/types';

export const TOAST_SIZES = {
  sm: { width: '320px', padding: '12px 16px', fontSize: '13px', iconSize: 18 },
  md: { width: '380px', padding: '16px 20px', fontSize: '14px', iconSize: 20 },
  lg: { width: '440px', padding: '20px 24px', fontSize: '16px', iconSize: 22 },
  xl: { width: '540px', padding: '28px 32px', fontSize: '18px', iconSize: 24 },
  '2xl': { width: '680px', padding: '36px 44px', fontSize: '20px', iconSize: 28 },
};

export const ensureImportant = (css: string) => {
  if (!css) return '';

  const placeholders: string[] = [];

  // 1. Shield Keyframes and Comments
  let processed = css.replace(/(\/\*[\s\S]*?\*\/)|(@keyframes\s+[^{]+\{(?:[^{}]+|\{[^{}]*\})*\})/g, (match) => {
    const id = `__PLACEHOLDER_${placeholders.length}__`;
    placeholders.push(match);
    return `\n${id}\n`;
  });

  const mergedBlocks = new Map<string, Record<string, string>>();
  const order: string[] = [];

  // 2. Segment the CSS into either placeholders or selector blocks
  // This regex matches either a placeholder ID or a standard CSS block { ... }
  const segmentRegex = /(__PLACEHOLDER_\d+__)|([^{}\n\r]+)\{([^}]*)\}/g;
  let match;

  while ((match = segmentRegex.exec(processed)) !== null) {
    if (match[1]) {
      // It's a Keyframe or Comment placeholder
      order.push(match[1]);
    } else {
      // It's a standard Selector block
      const selector = match[2].trim();
      const propStr = match[3];

      if (!selector) continue;

      if (!mergedBlocks.has(selector)) {
        order.push(selector);
        mergedBlocks.set(selector, {});
      }

      const currentProps = mergedBlocks.get(selector)!;

      propStr.split(';').forEach(p => {
        const separatorIndex = p.indexOf(':');
        if (separatorIndex !== -1) {
          const key = p.substring(0, separatorIndex).trim();
          const value = p.substring(separatorIndex + 1).trim();

          if (key && value) {
            // Rules: Priority goes to later definitions. Deduplicate by key.
            const cleanValue = value.replace(/\s*!important/g, '').trim();
            // Don't add important to CSS variables or already important stuff
            const suffix = cleanValue.startsWith('--') || cleanValue.includes('!important') ? '' : ' !important';
            currentProps[key] = `${cleanValue}${suffix}`;
          }
        }
      });
    }
  }

  // 3. Reconstruct
  let result = order.map(item => {
    if (item.startsWith('__PLACEHOLDER')) return item;

    const props = mergedBlocks.get(item)!;
    const propLines = Object.entries(props)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');

    return `${item} {\n${propLines}\n}`;
  }).join('\n\n');

  // 4. Restore Keyframes & Comments
  result = result.replace(/__PLACEHOLDER_(\d+)__/g, (_match: string, id: string) => placeholders[parseInt(id)]);

  return result;
};

export const BASE_SHELL_OBJECT = {
  shell: `
    .sonnerLB-toast-shell {
      background: var(--slb-bg) !important;
      color: var(--slb-fg) !important;
      border: var(--slb-border-width) solid var(--slb-border) !important;
      border-radius: var(--slb-radius) !important;
      box-shadow: var(--slb-shadow) !important;
      width: var(--slb-width) !important;
      padding: var(--slb-padding) !important;
      font-size: var(--slb-font-size) !important;
      overflow: hidden !important;
    }
    .sonnerLB-toast-shell::before { display: none !important; }
  `,
  closeButton: `
    .sonnerLB-toast-shell [data-close-button] {
      background: var(--slb-bg);
      border: 1px solid var(--slb-border);
      color: var(--slb-fg);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      top: 12px !important;
      right: 12px !important;
      left: auto !important;
      transform: none !important;
      opacity: 0;
      transition: all 0.2s ease;
    }
    .sonnerLB-toast-shell:hover [data-close-button] { opacity: 1; }
    .sonnerLB-toast-shell [data-close-button]:hover {
      background: var(--slb-primary) !important;
      color: var(--slb-bg) !important;
      opacity: 0.8;
      border-color: var(--slb-primary) !important;
    }
  `,
  loader: `
    .sonnerLB-has-loader::after {
      content: '';
      position: absolute;
      inset: var(--slb-loader-inset) !important;
      height: 3px !important;
      width: 100% !important;
      background: var(--slb-loader-bg) !important;
      transform-origin: left !important;
      animation: sonnerLB-toast-loader var(--slb-duration) linear forwards;
      box-shadow: 0 0 12px 1px var(--slb-primary);
      opacity: 0.9;
    }
    [data-sonner-toaster]:hover .sonnerLB-has-loader::after {
      animation-play-state: paused !important;
    }
    @keyframes sonnerLB-toast-loader {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
  `,
  typography: `
    .sonnerLB-toast-shell [data-description] {
      color: var(--slb-muted) !important;
      font-size: 0.875rem;
      margin-top: 4px;
      font-weight: 500;
    }
    .sonnerLB-toast-shell [data-icon] {
      color: var(--slb-primary) !important;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  `, get all() {
    return `${this.shell}${this.closeButton}${this.loader}${this.typography}`;
  }
};

export const THEMES: ToastTheme[] = [
  {
    id: 'shadcn',
    name: 'Shadcn UI',
    description: 'The industry standard for clean dashboards.',
    customCss: `
:root {
  /* Shadcn Light Mode (Zinc/Slate Scale) */
  --slb-bg: #ffffff;
  --slb-border: #e4e4e7; /* zinc-200 */
  --slb-fg: #09090b;     /* zinc-950 */
  --slb-muted: #71717a;  /* zinc-500 */
  --slb-primary: #18181b; /* zinc-900 */
  --slb-radius: 0.5rem;   /* Standard shadcn radius */
  --slb-border-width: 1px;
  
  /* The Signature Shadcn Shadow */
  --slb-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  
  --slb-width: 380px;
  --slb-padding: 12px 16px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #18181b;
}

.dark {
  /* Shadcn Dark Mode */
  --slb-bg: #09090b;     /* zinc-950 */
  --slb-border: #27272a; /* zinc-800 */
  --slb-fg: #fafafa;     /* zinc-50 */
  --slb-muted: #a1a1aa;  /* zinc-400 */
  --slb-primary: #f4f4f5; /* zinc-100 */
  --slb-loader-bg: #f4f4f5;
  --slb-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 10px 15px -3px rgba(0,0,0,0.5);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Font & Weight */
.sonnerLB-toast-shell {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  font-weight: 500 !important;
  letter-spacing: -0.01em !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  color: var(--slb-fg) !important;
}

/* Matching the Shadcn Close Button style exactly */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 4px !important;
  background: transparent !important;
  border: none !important;
  color: var(--slb-muted) !important;
  transition: color 0.2s !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  color: var(--slb-fg) !important;
  background: var(--slb-border) !important;
}
`
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Deep contrast with emerald accents.',
    customCss: `
:root {
  /* Supabase Light Mode */
  --slb-bg: #ffffff;
  --slb-border: #e5e7eb; /* gray-200 */
  --slb-fg: #171717;     /* gray-900 */
  --slb-muted: #737373;  /* gray-500 */
  --slb-primary: #3ecf8e; /* Supabase Green */
  --slb-radius: 6px;      /* Supabase uses slightly tighter corners */
  --slb-border-width: 1px;
  --slb-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --slb-width: 380px;
  --slb-padding: 14px 18px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #3ecf8e;
}

.dark {
  /* The "Authentic" Supabase Dark Mode */
  --slb-bg: #1c1c1c;     /* Exact Supabase BG */
  --slb-border: #2e2e2e; /* Exact border color */
  --slb-fg: #ededed;
  --slb-muted: #9ca3af;
  --slb-primary: #3ecf8e;
  --slb-loader-bg: #3ecf8e;
  --slb-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Layout & Typography */
.sonnerLB-toast-shell {
  font-family: 'Geist', 'Inter', sans-serif !important;
  letter-spacing: -0.01em !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  color: var(--slb-fg) !important;
  font-size: 0.925rem !important;
}

/* Supabase specific loader style: High Glow */
.sonnerLB-has-loader::after {
  height: 2px !important;
  box-shadow: 0 0 8px 0px rgba(62, 207, 142, 0.6) !important;
}

/* Close button - Supabase style is minimal and integrated */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 4px !important;
  background: transparent !important;
  border: 1px solid var(--slb-border) !important;
  color: var(--slb-muted) !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: #2e2e2e !important;
  color: var(--slb-primary) !important;
  border-color: var(--slb-primary) !important;
}
`
  },
  {
    id: 'liquid-glass',
    name: 'Liquid Glass',
    description: 'Organic macOS-style liquid translucency.',
    customCss: `
:root {
  --slb-bg: rgba(255, 255, 255, 0.3);
  --slb-border: rgba(255, 255, 255, 0.4);
  --slb-fg: #000000;
  --slb-muted: rgba(0, 0, 0, 0.55);
  --slb-primary: #007aff;
  --slb-radius: 2rem; /* Liquid look needs high rounding */
  --slb-border-width: 1px;
  
  /* Outer shadows for that "heavy" glass feel */
  --slb-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.1);
  
  --slb-width: 380px;
  --slb-padding: 18px 24px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 24px 10px 24px;
  --slb-loader-bg: var(--slb-primary);
}

.dark {
  --slb-bg: rgba(20, 20, 20, 0.4);
  --slb-border: rgba(255, 255, 255, 0.15);
  --slb-fg: #ffffff;
  --slb-muted: rgba(255, 255, 255, 0.5);
  --slb-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

${BASE_SHELL_OBJECT.all}

/* The Liquid Engine */
.sonnerLB-toast-shell {
  backdrop-filter: blur(12px) saturate(200%) !important;
  -webkit-backdrop-filter: blur(12px) saturate(200%) !important;
  
  /* Layer 1: The "Shine" - Inner high-contrast highlights */
  box-shadow: 
    var(--slb-shadow), 
    inset 2px 2px 2px 0 rgba(255, 255, 255, 0.4),
    inset -1px -1px 2px 1px rgba(255, 255, 255, 0.2) !important;
  
  /* Layer 2: The "Liquid" surface gradient */
  background: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.3) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.05) 100%
  ) !important;
  
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2) !important;
  border: var(--slb-border-width) solid var(--slb-border) !important;
}

/* Texture detail: Adding a subtle "sheen" over the top */


.sonnerLB-toast-shell [data-title] {
  font-weight: 700 !important;
  letter-spacing: -0.02em !important;
}

/* Close Button: Pure integrated liquid style */
.sonnerLB-toast-shell [data-close-button] {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(4px) !important;
  border-radius: 50% !important;
}
`
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'The pinnacle of developer tool aesthetics.',
    customCss: `
:root {
  /* Linear Light Mode */
  --slb-bg: #ffffff;
  --slb-border: #f0f0f1;
  --slb-fg: #111111;
  --slb-muted: #71717a;
  --slb-primary: #5e6ad2; /* Linear Indigo */
  --slb-radius: 8px;      /* Precise, not too rounded */
  --slb-border-width: 1px;
  
  /* Linear's signature "Elevated" shadow */
  --slb-shadow: 0 1px 1px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.08);
  
  --slb-width: 360px;     /* Linear prefers a slightly slimmer profile */
  --slb-padding: 12px 16px;
  --slb-font-size: 13px;  /* Small, sharp typography */
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: var(--slb-primary);
}

.dark {
  /* The iconic Linear Dark Mode */
  --slb-bg: #151518;
  --slb-border: rgba(255, 255, 255, 0.08); /* Subtle border for dark mode */
  --slb-fg: #f5f5f7;
  --slb-muted: #8a8a93;
  --slb-primary: #5e6ad2;
  --slb-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 12px 24px -6px rgba(0,0,0,0.4);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Engineering Aesthetics */
.sonnerLB-toast-shell {
  font-family: "Geist", "Inter", sans-serif !important;
  font-feature-settings: "cv02", "cv03", "cv04" !important; /* Enable sharp font features */
  letter-spacing: -0.01em !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 550 !important; /* Linear uses a specific medium-bold weight */
  color: var(--slb-fg) !important;
}

/* Linear's specific "Progress" style: Slim and sharp */
.sonnerLB-has-loader::after {
  height: 1px !important;
  opacity: 1 !important;
  box-shadow: 0 0 8px 0px rgba(94, 106, 210, 0.4) !important;
}

/* The "Command Line" Close Button Style */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 5px !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  color: var(--slb-muted) !important;
  transition: all 0.15s ease !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: var(--slb-border) !important;
  color: var(--slb-fg) !important;
}

/* Adding the Linear "Subtle Gradient" top shine in Dark Mode */
.dark .sonnerLB-toast-shell {
  background: linear-gradient(to bottom, #1c1c1f, #151518) !important;
}
`
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'High-contrast monochrome excellence.',
    customCss: `
:root {
  /* Vercel Light Mode */
  --slb-bg: #ffffff;
  --slb-border: #eaeaea;
  --slb-fg: #000000;
  --slb-muted: #666666;
  --slb-primary: #000000;
  --slb-radius: 0px; /* Vercel is famously sharp-edged */
  --slb-border-width: 1px;
  
  /* The "Command" Shadow: Very tight and dark */
  --slb-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  
  --slb-width: 380px;
  --slb-padding: 14px 20px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #000000;
}

.dark {
  /* Vercel Dark Mode (True Black) */
  --slb-bg: #000000;
  --slb-border: #333333;
  --slb-fg: #ffffff;
  --slb-muted: #888888;
  --slb-primary: #ffffff;
  --slb-loader-bg: #ffffff;
  
  /* The Dark "Halo" Shadow */
  --slb-shadow: 0 0 0 1px #333333, 0 10px 30px rgba(0, 0, 0, 0.5);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Geometric Precision */
.sonnerLB-toast-shell {
  font-family: 'Geist', 'Inter', -apple-system, sans-serif !important;
  text-rendering: optimizeLegibility !important;
  -webkit-font-smoothing: antialiased !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  letter-spacing: -0.02em !important;
}

/* Vercel's Progress Bar: No glow, just a solid technical line */
.sonnerLB-has-loader::after {
  height: 2px !important;
  box-shadow: none !important;
  opacity: 1 !important;
}

/* Close Button: Industrial and hidden until hover */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 0px !important;
  border: 1px solid var(--slb-border) !important;
  background: var(--slb-bg) !important;
  color: var(--slb-fg) !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: var(--slb-fg) !important;
  color: var(--slb-bg) !important;
  border-color: var(--slb-fg) !important;
}
`
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'The familiar look of the open source world.',
    customCss: `
:root {
  /* GitHub Light Mode (Primer System) */
  --slb-bg: #ffffff;
  --slb-border: #d0d7de; /* color-border-default */
  --slb-fg: #24292f;     /* color-fg-default */
  --slb-muted: #57606a;  /* color-fg-muted */
  --slb-primary: #1a7f37; /* color-success-emphasis */
  --slb-radius: 6px;      /* GitHub's standard radius */
  --slb-border-width: 1px;
  
  /* GitHub's flat, utility-first shadow */
  --slb-shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
  
  --slb-width: 380px;
  --slb-padding: 16px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #1a7f37;
}

.dark {
  /* GitHub Dark Mode (Dimmed/Dark) */
  --slb-bg: #0d1117;     /* canvas-default-dark */
  --slb-border: #30363d; /* border-default-dark */
  --slb-fg: #c9d1d9;     /* fg-default-dark */
  --slb-muted: #8b949e;  /* fg-muted-dark */
  --slb-primary: #238636; /* success-emphasis-dark */
  --slb-loader-bg: #238636;
  --slb-shadow: 0 16px 32px rgba(1, 4, 9, 0.85);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Primer Aesthetics */
.sonnerLB-toast-shell {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif !important;
  line-height: 1.5 !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  color: var(--slb-fg) !important;
}

/* GitHub Specific Detail: The Success/Error Accent */
/* Many GitHub notifications have a small colored strip on the left */
.sonnerLB-toast-shell::before {
  display: block !important;
  content: '' !important;
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
  width: 4px !important;
  background: var(--slb-primary) !important;
  z-index: 10 !important;
}

/* Close button - Minimalist and square-ish */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 6px !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  color: var(--slb-muted) !important;
  padding: 2px !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: rgba(175, 184, 193, 0.2) !important;
  color: var(--slb-fg) !important;
}

.dark .sonnerLB-toast-shell [data-close-button]:hover {
  background: rgba(110, 118, 129, 0.4) !important;
}
`
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Indigo branding with professional depth.',
    customCss: `
:root {
  /* Stripe Light Mode - "Slate" & "Indigo" */
  --slb-bg: #ffffff;
  --slb-border: #f6f9fc;
  --slb-fg: #1a1f36;     /* Stripe's deep navy text */
  --slb-muted: #4f566b;  /* Slate gray */
  --slb-primary: #635bff; /* Iconic Stripe Indigo */
  --slb-radius: 8px;
  --slb-border-width: 0px; /* Stripe often uses shadows instead of borders */
  
  /* The "Elevated" Stripe Shadow - Multi-layered and soft */
  --slb-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25), 
                0 30px 60px -30px rgba(0, 0, 0, 0.3), 
                inset 0 -2px 6px 0 rgba(10, 37, 64, 0.05);
  
  --slb-width: 400px;     /* Stripe toasts are slightly wider and more "heroic" */
  --slb-padding: 16px 20px;
  --slb-font-size: 15px;
  --slb-duration: 5000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #635bff;
}

.dark {
  /* Stripe Dark Mode - "Night Sky" Indigo */
  --slb-bg: #1a1f36;     /* Deep indigo-black */
  --slb-border: rgba(255, 255, 255, 0.08);
  --slb-fg: #ffffff;
  --slb-muted: #adbdcc;  /* Cool light gray */
  --slb-primary: #80e9ff; /* Cyan accent used in Stripe dark mode */
  --slb-loader-bg: #80e9ff;
  --slb-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25), 
                0 8px 16px -8px rgba(0, 0, 0, 0.3);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Smoothness & Motion */
.sonnerLB-toast-shell {
  font-family: "Inter", -apple-system, sans-serif !important;
  font-weight: 400 !important;
  line-height: 1.6 !important;
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  color: var(--slb-fg) !important;
  letter-spacing: -0.01em !important;
}

/* Stripe's Progress: Subtle but vibrant */
.sonnerLB-has-loader::after {
  height: 3px !important;
  opacity: 1 !important;
  box-shadow: 0 0 10px rgba(99, 91, 255, 0.3) !important;
}

/* Close button - Fully rounded and subtle */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 9999px !important;
  background: #f6f9fc !important;
  border: none !important;
  color: #1a1f36 !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
}

.dark .sonnerLB-toast-shell [data-close-button] {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  transform: scale(1.1) !important;
}
`
  },
  {
    id: 'google',
    name: 'Google Material',
    description: 'Approachably organic with Material 3 depth.',
    customCss: `
:root {
  /* Google Light Mode (Tonal Surface) */
  --slb-bg: #f3f6fc;     /* Material Surface Container */
  --slb-border: #e0e2ec;
  --slb-fg: #1b1b1f;     /* On Surface */
  --slb-muted: #44474f;  /* On Surface Variant */
  --slb-primary: #0b57d0; /* Google Blue (Standard) */
  --slb-radius: 10px;     /* M3 uses highly rounded "Pill" shapes */
  --slb-border-width: 0px; 
  
  /* Material 3 Level 3 Elevation */
  --slb-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 4px 8px 3px rgba(0,0,0,0.15);
  
  --slb-width: 400px;
  --slb-padding: 16px 24px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 24px 8px 24px;
  --slb-loader-bg: var(--slb-primary);
}

.dark {
  /* Google Dark Mode (Tonal Dark) */
  --slb-bg: #1b1b1f;
  --slb-border: #44474f;
  --slb-fg: #e3e2e6;
  --slb-muted: #c4c6d0;
  --slb-primary: #a8c7fa; /* M3 Light Blue Accent */
  --slb-loader-bg: #a8c7fa;
  --slb-shadow: 0 4px 8px 3px rgba(0,0,0,0.3);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Material You Logic */
.sonnerLB-toast-shell {
  font-family: 'Google Sans', 'Roboto', system-ui, sans-serif !important;
  font-weight: 400 !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 500 !important; /* Material Title Medium */
  font-size: 1rem !important;
  color: var(--slb-fg) !important;
  letter-spacing: 0.1px !important;
}

/* Material 3 Progress Bar: Thick and rounded */
.sonnerLB-has-loader::after {
  height: 4px !important;
  border-radius: 2px !important;
  opacity: 0.4 !important; /* Material loaders are often subtle */
}

/* Close button - Circle ghost style */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 50% !important;
  background: transparent !important;
  border: none !important;
  color: var(--slb-muted) !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: rgba(68, 71, 79, 0.08) !important;
  color: var(--slb-fg) !important;
}
`
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Warm, paper-like feel for productivity.',
    customCss: `
:root {
  /* Notion Light Mode (Warm White) */
  --slb-bg: #ffffff;
  --slb-border: #e1e1e1;
  --slb-fg: #37352f;     /* Notion's signature "Warm Black" */
  --slb-muted: rgba(55, 53, 47, 0.65);
  --slb-primary: #37352f;
  --slb-radius: 4px;      /* Notion uses tight, boxy corners */
  --slb-border-width: 1px;
  
  /* Notion's very subtle, spread-out shadow */
  --slb-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.05);
  
  --slb-width: 380px;
  --slb-padding: 12px 16px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #37352f;
}

.dark {
  /* Notion Dark Mode (Obsidian) */
  --slb-bg: #191919;
  --slb-border: #2e2e2e;
  --slb-fg: #ffffff;
  --slb-muted: rgba(255, 255, 255, 0.45);
  --slb-primary: #ffffff;
  --slb-loader-bg: rgba(255, 255, 255, 0.2);
  --slb-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Productivity Aesthetics */
.sonnerLB-toast-shell {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif !important;
  line-height: 1.2 !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  color: var(--slb-fg) !important;
  font-size: 0.9rem !important;
}

/* Notion's Progress Bar: Very thin, non-distracting */
.sonnerLB-has-loader::after {
  height: 2px !important;
  opacity: 0.8 !important;
  box-shadow: none !important;
}

/* Close button - Integrated and simple */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 3px !important;
  background: transparent !important;
  border: none !important;
  color: var(--slb-muted) !important;
  transition: background 0.2s ease !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: rgba(55, 53, 47, 0.08) !important;
  color: var(--slb-fg) !important;
}

.dark .sonnerLB-toast-shell [data-close-button]:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}
`
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'Sky-blue palette for modern web apps.',
    customCss: `
:root {
  /* Tailwind Light Mode (Sky/Slate) */
  --slb-bg: #ffffff;
  --slb-border: #e0f2fe; /* sky-100 */
  --slb-fg: #0c4a6e;     /* sky-900 */
  --slb-muted: #0369a1;  /* sky-700 */
  --slb-primary: #0ea5e9; /* sky-500 */
  --slb-radius: 12px;     /* Tailwind's rounded-xl */
  --slb-border-width: 2px; /* Tailwind often uses thicker, lighter borders */
  
  /* The "Tailwind Shadow": Large and airy */
  --slb-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  --slb-width: 380px;
  --slb-padding: 16px 20px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #0ea5e9;
}

.dark {
  /* Tailwind Dark Mode (Slate/Sky) */
  --slb-bg: #082f49;     /* sky-950 */
  --slb-border: #0c4a6e; /* sky-900 */
  --slb-fg: #f0f9ff;     /* sky-50 */
  --slb-muted: #7dd3fc;  /* sky-300 */
  --slb-primary: #38bdf8; /* sky-400 */
  --slb-loader-bg: #38bdf8;
  --slb-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Modern Utility Aesthetic */
.sonnerLB-toast-shell {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif !important;
  font-weight: 500 !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  color: var(--slb-fg) !important;
  letter-spacing: -0.01em !important;
}

/* Tailwind's Progress Bar: Vibrant Sky with a soft glow */
.sonnerLB-has-loader::after {
  height: 3px !important;
  box-shadow: 0 0 12px 1px rgba(14, 165, 233, 0.4) !important;
}

/* Close button - Styled like a standard Tailwind utility button */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 8px !important;
  background: var(--slb-border) !important;
  border: none !important;
  color: var(--slb-fg) !important;
  transition: all 0.2s ease !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: #bae6fd !important; /* sky-200 */
  transform: scale(1.05) !important;
}

.dark .sonnerLB-toast-shell [data-close-button]:hover {
  background: #0ea5e9 !important; /* sky-500 */
  color: #ffffff !important;
}
`
  }, {
    id: 'airbnb',
    name: 'Airbnb',
    description: 'Approachable, clean, and human-centric.',
    customCss: `
:root {
  /* Airbnb Light Mode */
  --slb-bg: #ffffff;
  --slb-border: #dddddd; /* gray-300 */
  --slb-fg: #222222;     /* Airbnb's soft black */
  --slb-muted: #717171;  /* gray-500 */
  --slb-primary: #ff385c; /* "Rausch" - Airbnb Pink */
  --slb-radius: 12px;
  --slb-border-width: 1px;
  
  /* Airbnb's "Elevated" Shadow (used for search bars and cards) */
  --slb-shadow: 0 6px 16px rgba(0,0,0,0.12);
  
  --slb-width: 400px;
  --slb-padding: 16px 24px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #ff385c;
}

.dark {
  /* Airbnb Dark Mode (Refined Charcoal) */
  --slb-bg: #222222;
  --slb-border: #484848;
  --slb-fg: #ffffff;
  --slb-muted: #b0b0b0;
  --slb-primary: #ff385c;
  --slb-loader-bg: #ff385c;
  --slb-shadow: 0 8px 28px rgba(0,0,0,0.28);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Hospitality Aesthetics */
.sonnerLB-toast-shell {
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif !important;
  line-height: 1.4 !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  font-size: 1rem !important;
  color: var(--slb-fg) !important;
}

/* Airbnb Specific Detail: The "Pill" Progress Bar */
.sonnerLB-has-loader::after {
  height: 3px !important;
  opacity: 1 !important;
  /* Airbnb uses solid colors without glows to keep things clean */
  box-shadow: none !important;
}

/* Close button - Circle with soft hover effect */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 50% !important;
  background: transparent !important;
  border: none !important;
  color: var(--slb-fg) !important;
  transition: background 0.2s ease !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: #f7f7f7 !important;
}

`
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'The iconic purple-tinted dark mode.',
    customCss: `
:root {
  /* Dracula Light Mode (Subtle Purple-White) */
  --slb-bg: #f8f8f2;     /* Dracula Selection/FG */
  --slb-border: #e6e6e6;
  --slb-fg: #282a36;     /* Dracula Background as Text */
  --slb-muted: #6272a4;  /* Dracula Comment color */
  --slb-primary: #bd93f9; /* Dracula Purple */
  --slb-radius: 6px;
  --slb-border-width: 1px;
  --slb-shadow: 0 10px 20px rgba(0,0,0,0.1);
  --slb-width: 380px;
  --slb-padding: 14px 18px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #bd93f9;
}

.dark {
  /* Official Dracula Dark Palette */
  --slb-bg: #282a36;     /* Background */
  --slb-border: #44475a; /* Current Line / Selection */
  --slb-fg: #f8f8f2;     /* Foreground */
  --slb-muted: #6272a4;  /* Comment */
  --slb-primary: #ff79c6; /* Dracula Pink (pops better for success) */
  --slb-loader-bg: #50fa7b; /* Dracula Green (Success indicator) */
  
  /* Deep purple-tinted shadow */
  --slb-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(189, 147, 249, 0.1);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Syntax Highlighting Aesthetic */
.sonnerLB-toast-shell {
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  letter-spacing: -0.01em !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  color: #8be9fd !important; /* Dracula Cyan for Title */
}

/* Dracula Loader: Neon Green with a soft bloom */
.sonnerLB-has-loader::after {
  height: 3px !important;
  box-shadow: 0 0 12px 1px rgba(80, 250, 123, 0.4) !important;
}

/* Close button - Dracula selection color */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 4px !important;
  background: var(--slb-border) !important;
  border: none !important;
  color: var(--slb-fg) !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: #bd93f9 !important; /* Hover Purple */
  color: #282a36 !important;
}

/* Custom Icon Color Override */
.sonnerLB-toast-shell [data-icon] {
  color: #f1fa8c !important; /* Dracula Yellow */
}
`
  },

  {
    id: 'matrix',
    name: 'Matrix Lab',
    description: 'Digital rain aesthetics with phosphor glow.',
    customCss: `
:root {
  /* Matrix Light Mode (Refined Sage-Paper) */
  --slb-bg: #f5fff5;
  --slb-border: #d1f2d1;
  --slb-fg: #2c5e4c;
  --slb-muted: #4a8c71;
  --slb-primary: #2ecc71;
  --slb-radius: 0px;
  --slb-border-width: 1px;
  --slb-shadow: 0 4px 10px rgba(46, 204, 113, 0.1);
  --slb-width: 380px;
  --slb-padding: 16px 20px;
  --slb-font-size: 14px;
  --slb-duration: 5000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #2ecc71;
  
  /* Lighter scanline for Light Mode */
  --slb-scanline: linear-gradient(rgba(0, 0, 0, 0.03) 50%, transparent 50%);
}

.dark {
  /* The "Authentic" Matrix Dark */
  --slb-bg: #030504;
  --slb-border: #00ff41;
  --slb-fg: #00ff41;
  --slb-muted: #008f11;
  --slb-primary: #00ff41;
  --slb-loader-bg: #00ff41;
  --slb-shadow: 0 0 20px rgba(0, 255, 65, 0.2), inset 0 0 10px rgba(0, 255, 65, 0.1);
  
  /* Heavier scanline for Dark Mode */
  --slb-scanline: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Terminal Aesthetics */
.sonnerLB-toast-shell {
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  overflow: hidden !important;
}

/* The Fixed Scanline Engine */
.sonnerLB-toast-shell::before {
  content: "" !important;
  display: block !important;
  position: absolute !important;
  inset: 0 !important;
  background: var(--slb-scanline) !important;
  background-size: 100% 4px !important;
  z-index: 10 !important;
  pointer-events: none !important;
  opacity: 0.8;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 700 !important;
}

.dark .sonnerLB-toast-shell [data-title] {
  text-shadow: 0 0 8px rgba(0, 255, 65, 0.6) !important;
}

/* Loader: Pulsing Phosphor Line */
.sonnerLB-has-loader::after {
  height: 4px !important;
  box-shadow: 0 0 15px rgba(0, 255, 65, 0.5) !important;
}

/* Close button - Terminal square style */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 0px !important;
  background: var(--slb-border) !important;
  color: #000 !important;
  border: none !important;
  font-weight: bold !important;
}
`
  },
  {
    id: 'neobrutalist',
    name: 'Neo-Brutalist',
    description: 'Bold, raw, and high-contrast.',
    customCss: `
:root {
  /* Neo-Brutalist Light Mode (Vibrant Yellow/Pink/Green) */
  --slb-bg: #ffffff;
  --slb-border: #000000;
  --slb-fg: #000000;
  --slb-muted: #000000;
  --slb-primary: #a3ff12; /* High-vis green */
  --slb-radius: 0px;      /* Sharp corners are essential */
  --slb-border-width: 3px;
  
  /* The "Hard" Offset Shadow - No blur, just displacement */
  --slb-shadow: 6px 6px 0px #000000;
  
  --slb-width: 380px;
  --slb-padding: 16px 20px;
  --slb-font-size: 15px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #000000;
}

.dark {
  /* Neo-Brutalist Dark Mode (High-contrast yellow on black) */
  --slb-bg: #111111;
  --slb-border: #ffffff;
  --slb-fg: #ffffff;
  --slb-muted: #ffffff;
--slb-primary: #a3ff12; /* High-vis green */
  --slb-loader-bg: #faff00;
  --slb-shadow: 6px 6px 0px #ffffff;
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Brutalist Typography & Movement */
.sonnerLB-toast-shell {
  font-family: 'Public Sans', 'Lexend', 'Inter', sans-serif !important;
  font-weight: 800 !important; /* Bold weights only */
  transition: transform 0.1s ease-in-out !important;
}

/* "Active" press effect */
.sonnerLB-toast-shell:active {
  transform: translate(2px, 2px) !important;
  box-shadow: 2px 2px 0px var(--slb-border) !important;
}

.sonnerLB-toast-shell [data-title] {
  text-transform: uppercase !important;
  font-size: 1.1rem !important;
  border-bottom: 2px solid var(--slb-border) !important;
  padding-bottom: 4px !important;
  margin-bottom: 8px !important;
  display: inline-block !important;
}

/* The Loader: Thick, solid bar */
.sonnerLB-has-loader::after {
  height: 6px !important;
  opacity: 1 !important;
  box-shadow: none !important;
  border-top: 2px solid var(--slb-border) !important;
}

/* Close Button: Large, Square, Boxy */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 0px !important;
  background: var(--slb-primary) !important;
  border: 2px solid #000 !important;
  color: #000 !important;
  opacity: 1 !important;
  top: 8px !important;
  right: 8px !important;
}

.dark .sonnerLB-toast-shell [data-close-button] {
  background: var(--slb-primary) !important;
  color: #000 !important;
  border: 2px solid #fff !important;
}
`
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Matte black with a subtle metallic edge.',
    customCss: `
:root {
  /* Obsidian Light Mode (Frosted Silver) */
  --slb-bg: #f5f5f7;
  --slb-border: #d2d2d7;
  --slb-fg: #1d1d1f;
  --slb-muted: #86868b;
  --slb-primary: #000000;
  --slb-radius: 10px;
  --slb-border-width: 1px;
  --slb-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --slb-width: 380px;
  --slb-padding: 16px 20px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #1d1d1f;
}

.dark {
  /* The "True" Obsidian Matte Black */
  --slb-bg: #111111;
  --slb-border: #2a2a2a;
  --slb-fg: #efefef;
  --slb-muted: #71717a;
  --slb-primary: #ffffff;
  --slb-loader-bg: #333333;
  
  /* Deep, soft shadow for that "heavy" matte feel */
  --slb-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.03);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Stealth Aesthetics */
.sonnerLB-toast-shell {
  font-family: 'Inter', system-ui, sans-serif !important;
  /* Subtle vertical gradient to mimic a matte metallic curve */
  background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%) !important;
  backdrop-filter: blur(10px) !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 600 !important;
  letter-spacing: -0.01em !important;
  color: var(--slb-fg) !important;
}

/* Obsidian's Progress Bar: Stealth gray with no glow */
.sonnerLB-has-loader::after {
  height: 2px !important;
  opacity: 1 !important;
  box-shadow: none !important;
  background: var(--slb-loader-bg) !important;
}

/* Close button - Integrated Matte style */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 6px !important;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid var(--slb-border) !important;
  color: var(--slb-muted) !important;
  transition: all 0.2s ease !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: var(--slb-border) !important;
  color: var(--slb-fg) !important;
}
`
  },
  {
    id: 'skeuomorphic',
    name: 'Skeuo Glass',
    description: 'Soft 3D tactile surfaces with physical depth.',
    customCss: `
:root {
  /* Skeuo Light Mode (Soft Plastic/Glass) */
  --slb-bg: #e0e0e0;
  --slb-border: #ffffff;
  --slb-fg: #444444;
  --slb-muted: #777777;
  --slb-primary: #3b82f6;
  --slb-radius: 20px;
  --slb-border-width: 1px;
  
  /* The "Extrusion" Shadow: Light on top-left, Dark on bottom-right */
  --slb-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
  
  --slb-width: 380px;
  --slb-padding: 18px 22px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 20px 12px 20px;
  --slb-loader-bg: var(--slb-primary);
}

.dark {
  /* Skeuo Dark Mode (Deep Machined Metal) */
  --slb-bg: #2a2a2a;
  --slb-border: #333333;
  --slb-fg: #eeeeee;
  --slb-muted: #888888;
  --slb-primary: #60a5fa;
  
  /* Inverted shadow for dark depth */
  --slb-shadow: 8px 8px 16px #1a1a1a, -4px -4px 12px #3a3a3a;
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Physical Material Logic */
.sonnerLB-toast-shell {
  font-family: system-ui, sans-serif !important;
  /* Subtle gradient to simulate a curved surface */
  background: linear-gradient(145deg, var(--slb-bg), #f0f0f0) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.dark .sonnerLB-toast-shell {
  background: linear-gradient(145deg, #252525, #2d2d2d) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 700 !important;
  /* Recessed text effect */
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5) !important;
}

.dark .sonnerLB-toast-shell [data-title] {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8) !important;
}

/* The Loader: Recessed Groove style */
.sonnerLB-has-loader::after {
  height: 6px !important;
  border-radius: 3px !important;
  background: var(--slb-loader-bg) !important;
  /* Making the loader look "set into" the glass */
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2) !important;
}

/* Close button - Tactile raised button */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 50% !important;
  background: var(--slb-bg) !important;
  box-shadow: 3px 3px 6px #bebebe, -3px -3px 6px #ffffff !important;
  border: none !important;
  color: var(--slb-fg) !important;
  transition: all 0.2s ease !important;
}

.dark .sonnerLB-toast-shell [data-close-button] {
  box-shadow: 3px 3px 6px #1a1a1a, -2px -2px 6px #3a3a3a !important;
}

.sonnerLB-toast-shell [data-close-button]:active {
  box-shadow: inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff !important;
  transform: scale(0.95) !important;
}
`
  },
  {
    id: 'clay',
    name: 'Claymorphism',
    description: 'Soft, playful toy-like surfaces with inflated depth.',
    customCss: `
:root {
  /* Clay Light Mode (Pastel Blue) */
  --slb-bg: #e0e7ff;     /* indigo-100 */
  --slb-border: transparent;
  --slb-fg: #3730a3;     /* indigo-900 */
  --slb-muted: #6366f1;  /* indigo-500 */
  --slb-primary: #4f46e5; /* indigo-600 */
  --slb-radius: 28px;     /* Extra rounding for that squishy feel */
  --slb-border-width: 0px;
  
  /* The "Clay" Shadow: Large outer blur + Soft ambient occlusion */
  --slb-shadow: 12px 12px 24px #beccf2, -12px -12px 24px #ffffff;
  
  --slb-width: 380px;
  --slb-padding: 20px 24px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 24px 12px 24px;
  --slb-loader-bg: var(--slb-primary);
}

.dark {
  /* Clay Dark Mode (Deep Navy Clay) */
  --slb-bg: #2d3436;
  --slb-fg: #dfe6e9;
  --slb-muted: #b2bec3;
  --slb-primary: #81ecec;
  /* Deep shadows for dark mode "inflation" */
  --slb-shadow: 10px 10px 20px #1e272e, -5px -5px 15px #3d484d;
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: The Inflation Engine */
.sonnerLB-toast-shell {
  font-family: 'Lexend', 'Inter', sans-serif !important;
  font-weight: 500 !important;
  
  /* Layered Inner Shadows to create the "Soft Roundness" */
  box-shadow: 
    var(--slb-shadow),
    inset 4px 4px 8px rgba(255, 255, 255, 0.6),
    inset -4px -4px 12px rgba(0, 0, 0, 0.08) !important;
    
  border: none !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 700 !important;
  color: var(--slb-fg) !important;
}

/* The Loader: Recessed but soft pill */
.sonnerLB-has-loader::after {
  height: 6px !important;
  border-radius: 10px !important;
  background: var(--slb-loader-bg) !important;
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1) !important;
  opacity: 0.9 !important;
}

/* Close button - A mini clay-button */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 12px !important;
  background: var(--slb-bg) !important;
  box-shadow: 4px 4px 8px #beccf2, -4px -4px 8px #ffffff !important;
  border: none !important;
  color: var(--slb-fg) !important;
}

.dark .sonnerLB-toast-shell [data-close-button] {
  box-shadow: 4px 4px 8px #1e272e, -2px -2px 8px #3d484d !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  transform: scale(1.1) rotate(5deg) !important;
}
`
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon glitches and high-energy digital rebellion.',
    customCss: `
:root {
  /* Cyberpunk Light Mode (High-Vis Construction) */
  --slb-bg: #fdee06;     /* Iconic Cyberpunk Yellow */
  --slb-border: #000000;
  --slb-fg: #000000;
  --slb-muted: rgba(0, 0, 0, 0.7);
  --slb-primary: #ff003c; /* Cyberpunk Red/Pink */
  --slb-radius: 0px;      /* Strictly No Rounding */
  --slb-border-width: 2px;
  --slb-shadow: 4px 4px 0px #000000;
  
  --slb-width: 380px;
  --slb-padding: 16px 20px;
  --slb-font-size: 14px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #000000;
}

.dark {
  /* Cyberpunk Dark Mode (Night City) */
  --slb-bg: #050505;
  --slb-border: #00f3ff;  /* Neon Cyan */
  --slb-fg: #00f3ff;
  --slb-muted: #39ff14;   /* Neon Green */
  --slb-primary: #ff003c; /* Neon Magenta */
  --slb-loader-bg: #ff003c;
  
  /* The "Glow Stack" */
  --slb-shadow: 0 0 10px rgba(0, 243, 255, 0.3), 
                inset 0 0 8px rgba(0, 243, 255, 0.2);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Glitch Engine */
@keyframes sonnerLB-glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

.sonnerLB-toast-shell {
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%) !important;
  border-right-width: 0 !important;
}


.sonnerLB-toast-shell [data-title] {
  font-weight: 900 !important;
  /* Chromatic Aberration Text Shadow */
  text-shadow: 2px 0 #ff003c, -2px 0 #00f3ff !important;
}



/* Close button - Angular and Neon */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 0px !important;
  background: var(--slb-primary) !important;
  color: #fff !important;
  border: none !important;
  clip-path: polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%) !important;
}
`
  },
  {
    id: 'paper',
    name: 'Ink & Paper',
    description: 'Serif fonts and old-school printed textures.',
    customCss: `
:root {
  /* Ink & Paper Light Mode (Vintage Stationery) */
  --slb-bg: #fdfaf6;     /* Warm cream paper */
  --slb-border: #222222;
  --slb-fg: #1a1a1a;     /* Off-black ink */
  --slb-muted: #555555;
  --slb-primary: #000000;
  --slb-radius: 2px;      /* Very tight, like a cut piece of paper */
  --slb-border-width: 1.5px;
  
  /* "Flat" Shadow - Paper sits directly on the desk */
  --slb-shadow: 2px 2px 0px rgba(0,0,0,0.1), 1px 1px 5px rgba(0,0,0,0.05);
  
  --slb-width: 380px;
  --slb-padding: 16px 20px;
  --slb-font-size: 15px;
  --slb-duration: 4000ms;
  --slb-loader-inset: auto 0 0 0;
  --slb-loader-bg: #222222;
}

.dark {
  /* "Night Journal" Dark Mode */
  --slb-bg: #1c1c1b;
  --slb-border: #3d3d3c;
  --slb-fg: #e2e2e2;
  --slb-muted: #a1a1a1;
  --slb-primary: #ffffff;
  --slb-loader-bg: #ffffff;
  --slb-shadow: 4px 4px 0px rgba(0,0,0,0.5);
}

${BASE_SHELL_OBJECT.all}

/* Perfection Details: Editorial Aesthetics */
.sonnerLB-toast-shell {
  /* Using a classic Serif stack */
  font-family: "Ibarra Real Nova", "Georgia", "Times New Roman", serif !important;
  line-height: 1.5 !important;
  /* Subtle "grain" texture overlay */
  background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png") !important;
}

.sonnerLB-toast-shell [data-title] {
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  letter-spacing: -0.02em !important;
  border-bottom: 1px solid rgba(0,0,0,0.1) !important;
  margin-bottom: 4px !important;
  display: inline-block !important;
}

.dark .sonnerLB-toast-shell [data-title] {
  border-bottom-color: rgba(255,255,255,0.1) !important;
}

/* The Loader: A solid ink line without digital glows */
.sonnerLB-has-loader::after {
  height: 2px !important;
  box-shadow: none !important;
  opacity: 0.8 !important;
}

/* Close button - Styled like a small "X" mark on paper */
.sonnerLB-toast-shell [data-close-button] {
  border-radius: 0px !important;
  background: transparent !important;
  border: 1px solid var(--slb-border) !important;
  color: var(--slb-fg) !important;
  font-family: system-ui, sans-serif !important;
}

.sonnerLB-toast-shell [data-close-button]:hover {
  background: var(--slb-fg) !important;
  color: var(--slb-bg) !important;
}
`
  },

];
