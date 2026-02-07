
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { ToastConfig, ToastType, StateIconConfig, SoundPreset, ToastTheme } from '@/types/types';
import { THEMES, TOAST_SIZES, ensureImportant } from '@/constants/constants';
import {
    CheckCircle2,
    ShieldCheck,
    Info,
    AlertCircle,
    AlertTriangle,
    Star,
    Heart,
    Smile,
    Bell,
    Zap,
    Flame,
    Coffee,
    Ghost,
    Terminal,
    RefreshCw,
    Sparkles,
    Loader2,
    LucideIcon
} from 'lucide-react';

export const ICON_PRESETS: Record<string, LucideIcon> = {
    check: CheckCircle2,
    shield: ShieldCheck,
    info: Info,
    alert: AlertCircle,
    warning: AlertTriangle,
    star: Star,
    heart: Heart,
    smile: Smile,
    bell: Bell,
    zap: Zap,
    flame: Flame,
    coffee: Coffee,
    ghost: Ghost,
    terminal: Terminal,
    refresh: RefreshCw,
    sparkles: Sparkles,
    loader: Loader2
};

const DEFAULT_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;

export function useToastForge() {
    const [config, setConfig] = useState<ToastConfig>({
        position: 'bottom-right',
        expand: true,
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
        theme: THEMES[0],
        previewMode: 'dark',
        useDynamicVariables: false,
        iconSize: 20,
        soundEnabled: true,
        soundPreset: 'success',
        soundVolume: 0.5,
        iconConfigs: {
            success: { mode: 'preset', preset: 'check', customSvg: DEFAULT_SVG },
            error: { mode: 'preset', preset: 'alert', customSvg: DEFAULT_SVG },
            warning: { mode: 'preset', preset: 'warning', customSvg: DEFAULT_SVG },
            info: { mode: 'preset', preset: 'info', customSvg: DEFAULT_SVG },
            loading: { mode: 'preset', preset: 'refresh', customSvg: DEFAULT_SVG },
            default: { mode: 'preset', preset: 'zap', customSvg: DEFAULT_SVG },
        }
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
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
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

    const updateIconConfig = useCallback((type: ToastType, updates: Partial<StateIconConfig>) => {
        setConfig(prev => ({ ...prev, iconConfigs: { ...prev.iconConfigs, [type]: { ...prev.iconConfigs[type], ...updates } } }));
    }, []);

    const getIconForState = useCallback((type: ToastType) => {
        const stateConfig = config.iconConfigs[type];
        if (stateConfig.mode === 'none') return <div className="w-0 h-0 opacity-0" />;

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
        if (config.soundEnabled) playSynthesizedSound(config.soundPreset);
        const options = {
            description: `Synchronized visual and auditory feedback.`,
        };

        switch (type) {
            case 'success': toast.success('Action Confirmed', options); break;
            case 'error': toast.error('System Refusal', options); break;
            case 'warning': toast.warning('Security Alert', options); break;
            case 'loading': toast.loading('Processing Engine...', options); break;
            default: toast('Dynamic Preview Active', options);
        }
    }, [config.soundEnabled, config.soundPreset, playSynthesizedSound]);

    const exportCode = useMemo(() => {
        const {
            position, expand, duration, offset, gap, shadowIntensity, blurIntensity,
            iconSize, iconConfigs, toastSize, loaderPosition, loaderVariant, showProgressBar, previewMode, theme
        } = config;

        const generateIconString = (type: ToastType) => {
            const cfg = iconConfigs[type];
            if (cfg.mode === 'none') return 'null';
            if (cfg.mode === 'custom') {
                return `(
          <div 
            style={{ width: ${iconSize}, height: ${iconSize} }} 
            className="flex items-center justify-center${type === 'loading' ? ' animate-spin' : ''}"
            dangerouslySetInnerHTML={{ __html: \`${cfg.customSvg}\` }} 
          />
        )`;
            }
            const IconName = cfg.preset.charAt(0).toUpperCase() + cfg.preset.slice(1);
            return `<${IconName} size={${iconSize}} ${type === 'loading' ? 'className="animate-spin" ' : ''}/>`;
        };

        const lucideIcons = Object.values(iconConfigs)
            .filter(cfg => cfg.mode === 'preset')
            .map(cfg => cfg.preset.charAt(0).toUpperCase() + cfg.preset.slice(1));

        const uniqueIcons = Array.from(new Set(lucideIcons));

        const reactCode = `import { Toaster, toast } from 'sonner';
${uniqueIcons.length > 0 ? `import { ${uniqueIcons.join(', ')} } from 'lucide-react';` : ''}

// 1. Setup the Toaster component (usually in your layout or root)
export function ToasterSetup() {
  return (
    <Toaster 
      position="${position}"
      expand={${expand}}
      duration={${duration}}
      offset="${offset}px"
      gap={${gap}}
      theme="${previewMode}"
      icons={{
        success: ${generateIconString('success')},
        error: ${generateIconString('error')},
        warning: ${generateIconString('warning')},
        info: ${generateIconString('info')},
        loading: ${generateIconString('loading')},
      }}
      toastOptions={{
        className: 'sonnerLB-toast-shell ${showProgressBar ? 'sonnerLB-has-loader' : ''}',
      }}
    />
  );
}

// 2. Trigger the toast anywhere in your app
const notify = () => {
  toast.success('Action Confirmed', {
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
        config.theme.id,
        config.duration,
        config.gap,
        config.offset,
        config.loaderPosition,
        config.loaderVariant,
        config.toastSize,
        config.previewMode, // Added to ensure sync on mode toggle
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
        initAudio,
        getCssVar,
        updateCssVars
    };
}
