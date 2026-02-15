
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { ToastConfig, ToastType, StateIconConfig, SoundPreset, ToastTheme } from '@/types/toast-types';
import { THEMES, TOAST_SIZES, ensureImportant } from '@/constants/toast-presets';
import {
    // Current
    CheckCircle2, ShieldCheck, Info, AlertCircle, AlertTriangle, Star, Heart, Smile, Bell, Zap, Flame, Coffee, Ghost, Terminal, RefreshCw, Sparkles, Loader2,
    // Communication
    Mail, MessageSquare, Phone, Send, Share2,
    // General / UI
    Settings, Search, Menu, Trash2, Plus, Minus, Check, X, ExternalLink, Eye, EyeOff, Lock, Unlock, User, Users,
    // Status
    CircleCheck, CircleAlert, CircleX, CircleHelp, CirclePause, CircleStop, TriangleAlert,
    // Media
    Play, Pause, Volume2, Music2, Image,
    // Development
    Code2, Database, Cpu, Globe, Activity,
    // Commerce
    ShoppingCart, CreditCard, Tag, Wallet,
    // Nature / Weather
    Sun, Moon, Cloud, Wind,
    // Others
    Target, Flag, Anchor, Award, Trophy, Rocket, Gift, Briefcase, Calendar, Clock, MapPin,
    LucideIcon
} from 'lucide-react';

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

const ICON_CONFIG: Record<string, { component: LucideIcon, name: string }> = {
    // Standard States
    check: { component: CheckCircle2, name: 'CheckCircle2' },
    shield: { component: ShieldCheck, name: 'ShieldCheck' },
    info: { component: Info, name: 'Info' },
    alert: { component: AlertCircle, name: 'AlertCircle' },
    warning: { component: AlertTriangle, name: 'AlertTriangle' },
    error: { component: CircleX, name: 'CircleX' },
    help: { component: CircleHelp, name: 'CircleHelp' },

    // UI / Actions
    settings: { component: Settings, name: 'Settings' },
    search: { component: Search, name: 'Search' },
    menu: { component: Menu, name: 'Menu' },
    trash: { component: Trash2, name: 'Trash2' },
    plus: { component: Plus, name: 'Plus' },
    minus: { component: Minus, name: 'Minus' },
    close: { component: X, name: 'X' },
    external: { component: ExternalLink, name: 'ExternalLink' },
    eye: { component: Eye, name: 'Eye' },
    eyeOff: { component: EyeOff, name: 'EyeOff' },
    lock: { component: Lock, name: 'Lock' },
    unlock: { component: Unlock, name: 'Unlock' },
    user: { component: User, name: 'User' },
    users: { component: Users, name: 'Users' },

    // Status Icons
    successCircle: { component: CircleCheck, name: 'CircleCheck' },
    alertCircle: { component: CircleAlert, name: 'CircleAlert' },
    stop: { component: CircleStop, name: 'CircleStop' },
    pause: { component: CirclePause, name: 'CirclePause' },

    // Communication
    mail: { component: Mail, name: 'Mail' },
    message: { component: MessageSquare, name: 'MessageSquare' },
    phone: { component: Phone, name: 'Phone' },
    send: { component: Send, name: 'Send' },
    share: { component: Share2, name: 'Share2' },

    // Personality / Fun
    star: { component: Star, name: 'Star' },
    heart: { component: Heart, name: 'Heart' },
    smile: { component: Smile, name: 'Smile' },
    bell: { component: Bell, name: 'Bell' },
    zap: { component: Zap, name: 'Zap' },
    flame: { component: Flame, name: 'Flame' },
    coffee: { component: Coffee, name: 'Coffee' },
    ghost: { component: Ghost, name: 'Ghost' },
    terminal: { component: Terminal, name: 'Terminal' },
    sparkles: { component: Sparkles, name: 'Sparkles' },
    rocket: { component: Rocket, name: 'Rocket' },
    gift: { component: Gift, name: 'Gift' },
    trophy: { component: Trophy, name: 'Trophy' },
    award: { component: Award, name: 'Award' },

    // Development / System
    code: { component: Code2, name: 'Code2' },
    database: { component: Database, name: 'Database' },
    cpu: { component: Cpu, name: 'Cpu' },
    globe: { component: Globe, name: 'Globe' },
    activity: { component: Activity, name: 'Activity' },
    terminal_alt: { component: Terminal, name: 'Terminal' },
    refresh: { component: RefreshCw, name: 'RefreshCw' },
    loader: { component: Loader2, name: 'Loader2' },

    // Commerce
    cart: { component: ShoppingCart, name: 'ShoppingCart' },
    card: { component: CreditCard, name: 'CreditCard' },
    tag: { component: Tag, name: 'Tag' },
    wallet: { component: Wallet, name: 'Wallet' },

    // Time / Location
    calendar: { component: Calendar, name: 'Calendar' },
    clock: { component: Clock, name: 'Clock' },
    map: { component: MapPin, name: 'MapPin' },

    // Misc
    sun: { component: Sun, name: 'Sun' },
    moon: { component: Moon, name: 'Moon' },
    cloud: { component: Cloud, name: 'Cloud' },
    wind: { component: Wind, name: 'Wind' },
    target: { component: Target, name: 'Target' },
    flag: { component: Flag, name: 'Flag' },
    anchor: { component: Anchor, name: 'Anchor' },
    briefcase: { component: Briefcase, name: 'Briefcase' },
};

export const ICON_PRESETS: Record<string, LucideIcon> = Object.entries(ICON_CONFIG).reduce((acc, [key, val]) => {
    acc[key] = val.component;
    return acc;
}, {} as Record<string, LucideIcon>);

const DEFAULT_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;

export const BASE_CONFIG: Omit<ToastConfig, 'theme'> = {
    position: 'bottom-right',
    expand: false,
    closeButton: true,
    showProgressBar: true,
    loaderPosition: 'bottom',
    loaderVariant: 'solid',
    toastSize: 'md',
    duration: 4000,
    offset: 32,
    gap: 12,
    shadowIntensity: 0.2,
    blurIntensity: 0,
    previewMode: 'dark',
    useDynamicVariables: false,
    iconSize: 20,
    soundEnabled: false,
    soundPreset: 'pop',
    soundVolume: 0.5,
    iconConfigs: {
        success: { mode: 'preset', preset: 'check', customSvg: DEFAULT_SVG },
        error: { mode: 'preset', preset: 'alert', customSvg: DEFAULT_SVG },
        warning: { mode: 'preset', preset: 'warning', customSvg: DEFAULT_SVG },
        info: { mode: 'preset', preset: 'info', customSvg: DEFAULT_SVG },
        loading: { mode: 'preset', preset: 'refresh', customSvg: DEFAULT_SVG },
        default: { mode: 'default', preset: 'zap', customSvg: DEFAULT_SVG },
    }
};

export function useSonnerLabs() {
    const [config, setConfig] = useState<ToastConfig>(() => {
        const initialTheme = THEMES[0];
        return {
            ...BASE_CONFIG,
            theme: initialTheme,
            ...(initialTheme.defaultConfig || {})
        };
    });

    const [activeTab, setActiveTab] = useState('themes');
    const { resolvedTheme } = useTheme();

    // Sync previewMode with global theme
    useEffect(() => {
        if (resolvedTheme) {
            setConfig(prev => ({ ...prev, previewMode: resolvedTheme as 'light' | 'dark' }));
        }
    }, [resolvedTheme]);

    const [editingIconState, setEditingIconState] = useState<ToastType>('success');
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (typeof window === 'undefined') return;
        if (!audioCtxRef.current) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContextClass();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    }, []);

    const playSynthesizedSound = useCallback((preset: SoundPreset) => {
        initAudio();
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const volume = config.soundVolume;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume, ctx.currentTime);
        masterGain.connect(ctx.destination);

        const playTone = (freq: number, type: OscillatorType, start: number, duration: number, vol: number = 1) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, start);
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(vol, start + 0.01);
            g.gain.exponentialRampToValueAtTime(0.001, start + duration);
            osc.connect(g);
            g.connect(masterGain);
            osc.start(start);
            osc.stop(start + duration);
        };

        switch (preset) {
            case 'pop':
                playTone(600, 'sine', ctx.currentTime, 0.1);
                break;
            case 'success':
                playTone(440, 'sine', ctx.currentTime, 0.2, 0.5);
                playTone(880, 'sine', ctx.currentTime + 0.05, 0.3, 0.3);
                break;
            case 'error':
                playTone(150, 'square', ctx.currentTime, 0.15, 0.2);
                playTone(100, 'square', ctx.currentTime + 0.1, 0.2, 0.2);
                break;
            case 'digital':
                playTone(1200, 'triangle', ctx.currentTime, 0.05, 0.4);
                break;
            case 'dock':
                playTone(80, 'sine', ctx.currentTime, 0.3, 1);
                break;
        }
    }, [config.soundVolume, initAudio]);

    const playInteractionSound = useCallback(() => {
        playSynthesizedSound('pop');
    }, [playSynthesizedSound]);

    const updateIconConfig = useCallback((type: ToastType, updates: Partial<StateIconConfig>) => {
        setConfig(prev => ({ ...prev, iconConfigs: { ...prev.iconConfigs, [type]: { ...prev.iconConfigs[type], ...updates } } }));
    }, []);

    const getIconForState = useCallback((type: ToastType) => {
        const stateConfig = config.iconConfigs[type];
        if (stateConfig.mode === 'default') return undefined;

        if (stateConfig.mode === 'custom') {
            return (
                <div
                    dangerouslySetInnerHTML={{ __html: stateConfig.customSvg }}
                    style={{ width: config.iconSize, height: config.iconSize }}
                    className={`${type === 'loading' ? 'animate-spin' : ''} flex items-center justify-center`}
                />
            );
        }

        const IconComp = ICON_PRESETS[stateConfig.preset] || ICON_PRESETS.check;
        const isRotating = type === 'loading' || stateConfig.preset === 'refresh' || stateConfig.preset === 'loader';
        return <IconComp size={config.iconSize} className={isRotating ? 'animate-spin' : ''} />;
    }, [config.iconConfigs, config.iconSize]);

    const triggerToast = useCallback((type: ToastType) => {
        // App-only logic: Always play feedback in laboratory
        if (config.soundEnabled) {
            playSynthesizedSound(config.soundPreset);
        } else {
            playSynthesizedSound('pop');
        }

        const options = {
            description: `Synchronized visual and auditory feedback.`,
        };

        const icon = getIconForState(type);
        const toastOptions = { ...options, ...(icon ? { icon } : {}) };

        switch (type) {
            case 'success': toast.success('Action Confirmed', toastOptions); break;
            case 'error': toast.error('System Refusal', toastOptions); break;
            case 'warning': toast.warning('Security Alert', toastOptions); break;
            case 'info': toast.info('System Update', toastOptions); break;
            case 'loading':
                toast('Processing Engine...', {
                    ...toastOptions,
                    icon: icon || <Loader2 className="animate-spin size-4" />,
                    duration: config.duration
                });
                break;
            default: toast('Dynamic Preview Active', toastOptions);
        }
    }, [config.soundEnabled, config.soundPreset, config.duration, playSynthesizedSound, getIconForState]);

    // Unified Feedback & Auto-Preview Engine
    const isFirstRender = useRef(true);
    const lastTriggerRef = useRef<string>('');

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Logic to determine what changed and what feedback to give
        const configString = JSON.stringify({
            themeId: config.theme.id,
            pos: config.position,
            size: config.toastSize,
            lPos: config.loaderPosition,
            lVar: config.loaderVariant,
            exp: config.expand,
            close: config.closeButton,
            prog: config.showProgressBar,
            iMode: config.iconConfigs[editingIconState].mode,
            iPre: config.iconConfigs[editingIconState].preset,
            dur: config.duration,
            gap: config.gap,
            off: config.offset,
            iSize: config.iconSize,
        });

        const timer = setTimeout(() => {
            // Only trigger if the actual content configuration changed
            if (configString !== lastTriggerRef.current) {
                triggerToast(editingIconState);
                lastTriggerRef.current = configString;
            } else {
                // If only tab or non-toast state changed, just play interaction sound
                playInteractionSound();
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [
        activeTab,
        editingIconState,
        config,
        playInteractionSound,
        triggerToast
    ]);


    const exportCode = useMemo(() => {
        const {
            position, expand, duration, offset, gap, shadowIntensity, blurIntensity,
            iconSize, iconConfigs, toastSize, loaderPosition, loaderVariant, showProgressBar,
            previewMode, theme, soundEnabled, soundVolume, closeButton
        } = config;

        const generateIconString = (type: ToastType): string | null => {
            const cfg = iconConfigs[type];
            if (cfg.mode === 'default') return null;
            if (cfg.mode === 'custom') {
                return `(
          <div 
            style={{ width: ${iconSize}, height: ${iconSize} }} 
            className="flex items-center justify-center${type === 'loading' ? ' animate-spin' : ''}"
            dangerouslySetInnerHTML={{ __html: \`${cfg.customSvg}\` }} 
          />
        )`;
            }
            const presetVal = cfg.preset;
            const IconName = ICON_CONFIG[presetVal]?.name || (presetVal.charAt(0).toUpperCase() + presetVal.slice(1));
            return `(<${IconName} size={${iconSize}} ${type === 'loading' ? 'className="animate-spin" ' : ''}/>)`;
        };

        const iconsMap = (['success', 'error', 'warning', 'info', 'loading'] as ToastType[])
            .map(type => ({ type, code: generateIconString(type) }))
            .filter(item => item.code !== null);

        const iconsObjectCode = iconsMap.length > 0
            ? `{\n        ${iconsMap.map(m => `${m.type}: ${m.code}`).join(',\n        ')}\n      }`
            : '{}';

        const lucideIcons = Object.values(iconConfigs)
            .filter(cfg => cfg.mode === 'preset')
            .map(cfg => ICON_CONFIG[cfg.preset]?.name || (cfg.preset.charAt(0).toUpperCase() + cfg.preset.slice(1)));

        const uniqueIcons = Array.from(new Set(lucideIcons));

        const getSoundImplementation = (): string => {
            const vol = soundVolume;
            const presets: Record<string, string> = {
                pop: `
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(${vol}, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + 0.1);`,
                success: `
  const playTone = (freq: number, start: number, duration: number, v: number): void => {
    const osc: OscillatorNode = ctx.createOscillator();
    const g: GainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(v * ${vol}, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(start); osc.stop(start + duration);
  };
  playTone(440, ctx.currentTime, 0.2, 0.5);
  playTone(880, ctx.currentTime + 0.05, 0.3, 0.3);`,
                error: `
  const playTone = (freq: number, start: number, duration: number, v: number): void => {
    const osc: OscillatorNode = ctx.createOscillator();
    const g: GainNode = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(v * ${vol}, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(start); osc.stop(start + duration);
  };
  playTone(150, ctx.currentTime, 0.15, 0.2);
  playTone(100, ctx.currentTime + 0.1, 0.2, 0.2);`,
                digital: `
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(${vol} * 0.4, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + 0.05);`,
                dock: `
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(${vol}, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + 0.3);`
            };
            return presets[config.soundPreset] || presets.pop;
        };

        const reactCode = `import { Toaster, toast } from 'sonner';
${uniqueIcons.length > 0 ? `import { ${uniqueIcons.join(', ')} } from 'lucide-react';` : ''}

${soundEnabled ? `// Interaction Sound Utility (${config.soundPreset} preset)
const playToastSound = (): void => {
  if (typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx: AudioContext = new AudioContextClass();
${getSoundImplementation()}
};
` : ''}
// 1. Setup the Toaster component (usually in your layout or root)
export function ToasterSetup() {
  return (
    <Toaster 
      position="${position}"
      expand={${expand}}
      closeButton={${closeButton}}
      duration={${duration}}
      offset="${offset}px"
      gap={${gap}}
      theme="${previewMode}"
      icons={${iconsObjectCode}}
      toastOptions={{
        className: 'sonnerLB-toast-shell ${showProgressBar ? 'sonnerLB-has-loader' : ''}',
      }}
    />
  );
}

// 2. Trigger the toast anywhere in your app
const notify = () => {
  ${soundEnabled ? 'playToastSound();\n  ' : ''}toast.success('Action Confirmed', {
    description: 'Synchronized visual and auditory feedback.',
  });
};`;

        const cssCode = `/* Add this to your global CSS file */
${ensureImportant(theme.customCss)}`;

        return { react: reactCode, css: cssCode };
    }, [config]);

    const getCssVar = useCallback((variable: string) => {
        const mode = config.previewMode;
        const css = config.theme.customCss;
        const blockRegex = mode === 'dark' ? /\.dark\s*{([^}]*)}/ : /:root\s*{([^}]*)}/;
        const blockMatch = css.match(blockRegex);
        if (blockMatch) {
            const varRegex = new RegExp(`${variable}:\\s*([^;]+)`);
            const varMatch = blockMatch[1].match(varRegex);
            if (varMatch) return varMatch[1].trim();
        }
        const rootMatch = css.match(/:root\s*{([^}]*)}/);
        if (rootMatch) {
            const varRegex = new RegExp(`${variable}:\\s*([^;]+)`);
            const varMatch = rootMatch[1].match(varRegex);
            if (varMatch) return varMatch[1].trim();
        }
        return '';
    }, [config.previewMode, config.theme.customCss]);

    const updateCssVars = useCallback((variables: Record<string, string>) => {
        const mode = config.previewMode;

        setConfig(prev => {
            let newCss = prev.theme.customCss;

            // Function to update a single block
            const updateBlock = (block: string, vars: Record<string, string>, isRoot: boolean) => {
                let updatedBlock = block;
                Object.entries(vars).forEach(([variable, value]) => {
                    const isGlobal = !['--slb-bg', '--slb-border', '--slb-fg', '--slb-muted', '--slb-primary'].includes(variable);

                    // Only apply if it's a global var going into root, or if we are in the correct block for the current mode
                    const shouldUpdate = isGlobal || (isRoot ? mode === 'light' : mode === 'dark');

                    if (shouldUpdate) {
                        if (updatedBlock.includes(variable)) {
                            const regex = new RegExp(`(${variable}:\\s*)([^;]+)`);
                            updatedBlock = updatedBlock.replace(regex, `$1${value}`);
                        } else {
                            updatedBlock = updatedBlock.replace('}', `  ${variable}: ${value};\n}`);
                        }
                    }
                });
                return updatedBlock;
            };

            // Update :root block
            newCss = newCss.replace(/:root\s*{[^}]*}/, (block) => updateBlock(block, variables, true));

            // Update .dark block if it exists
            if (newCss.includes('.dark')) {
                newCss = newCss.replace(/\.dark\s*{[^}]*}/, (block) => updateBlock(block, variables, false));
            }

            return {
                ...prev,
                theme: { ...prev.theme, customCss: newCss }
            };
        });
    }, [config.previewMode]);

    // Automatic CSS synchronization for config fields
    useEffect(() => {
        const size = TOAST_SIZES[config.toastSize];
        const loaderBg = config.loaderVariant === 'gradient'
            ? `linear-gradient(to right, color-mix(in srgb, var(--slb-primary), transparent 80%), var(--slb-primary))`
            : `var(--slb-primary)`;
        const loaderInset = config.loaderPosition === 'top' ? '0 0 auto 0' : 'auto 0 0 0';

        updateCssVars({
            '--slb-duration': `${config.duration}ms`,
            '--slb-gap': `${config.gap}px`,
            '--slb-offset': `${config.offset}px`,
            '--slb-loader-inset': loaderInset,
            '--slb-loader-bg': loaderBg,
            '--slb-width': size.width,
            '--slb-padding': size.padding,
            '--slb-font-size': size.fontSize,
        });
    }, [
        config.duration,
        config.gap,
        config.offset,
        config.loaderPosition,
        config.loaderVariant,
        config.toastSize,
        config.previewMode,
        updateCssVars
    ]);

    return {
        config,
        setConfig,
        activeTab,
        setActiveTab,
        editingIconState,
        setEditingIconState,
        updateIconConfig,
        getIconForState,
        triggerToast,
        exportCode,
        playSynthesizedSound,
        playInteractionSound,
        initAudio,
        getCssVar,
        updateCssVars
    };
}
