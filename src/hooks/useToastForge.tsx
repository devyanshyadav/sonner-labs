
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { ToastConfig, ToastType, StateIconConfig, SoundPreset, ToastTheme } from '@/types/types';
import { THEMES } from '@/constants/constants';
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
    Loader2
} from 'lucide-react';

export const ICON_PRESETS: Record<string, any> = {
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
        animationDuration: 400,
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

    // Sync theme colors when previewMode or selected theme changes
    useEffect(() => {
        const selectedTheme = THEMES.find(t => t.id === config.theme.id);
        if (!selectedTheme) return;

        const modeColors = config.previewMode === 'dark'
            ? selectedTheme.dark || selectedTheme.colors
            : selectedTheme.light || selectedTheme.colors;

        setConfig(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                colors: modeColors
            }
        }));
    }, [config.previewMode, config.theme.id]);

    const [editingIconState, setEditingIconState] = useState<ToastType>('success');
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (typeof window === 'undefined') return;
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
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

    const updateColor = useCallback((key: keyof ToastTheme['colors'], value: string) => {
        setConfig(prev => ({ ...prev, theme: { ...prev.theme, colors: { ...prev.theme.colors, [key]: value } } }));
    }, []);

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
        const { position, expand, duration, theme, offset, gap, animationDuration, shadowIntensity, blurIntensity, useDynamicVariables, iconSize, iconConfigs, soundEnabled, soundPreset, soundVolume, toastSize, loaderPosition, loaderVariant } = config;

        const generateIconString = (type: ToastType) => {
            const cfg = iconConfigs[type];
            if (cfg.mode === 'none') return 'null';
            if (cfg.mode === 'custom') return `<div dangerouslySetInnerHTML={{ __html: \`${cfg.customSvg}\` }} />`;
            const isSpin = type === 'loading' || cfg.preset === 'refresh';
            return `<YourIcon size={${iconSize}}${isSpin ? ' className="animate-spin"' : ''} />`;
        };

        const sizePaddingMap = {
            sm: '12px 16px',
            md: '16px 20px',
            lg: '20px 24px',
            xl: '28px 32px',
            '2xl': '36px 44px'
        };

        return `// Optimized ToastForge Configuration with Audio Synthesis
import { Toaster, toast } from 'sonner';

export default function App() {
    const notify = () => {
    ${soundEnabled ? `// Simple audio trigger
    const audio = new Audio('/sounds/${soundPreset}.mp3');
    audio.volume = ${soundVolume};
    audio.play();
    ` : ''}
    toast.success('Done!');
  };

  return (
    <Toaster 
      position="${position}"
      expand={${expand}}
      duration={${duration}}
      offset="${offset}px"
      gap={${gap}}
      icons={{
        success: ${generateIconString('success')},
        error: ${generateIconString('error')},
        warning: ${generateIconString('warning')},
        info: ${generateIconString('info')},
        loading: ${generateIconString('loading')},
      }}
      toastOptions={{
        style: {
          background: ${useDynamicVariables ? "'var(--toast-bg)'" : `'${theme.colors.background}'`},
          color: ${useDynamicVariables ? "'var(--toast-text)'" : `'${theme.colors.text}'`},
          border: '${theme.borderWidth} solid ${useDynamicVariables ? 'var(--toast-border)' : theme.colors.border}',
          borderRadius: '${theme.borderRadius}',
          boxShadow: '0 10px 30px rgba(0,0,0,${shadowIntensity})',
          backdropFilter: 'blur(${blurIntensity}px)',
          '--duration': '${duration}ms',
          '--anim-speed': '${animationDuration}ms',
          '--loader-color': '${theme.colors.icon}',
          '--loader-pos': '${loaderPosition}',
          '--loader-variant': '${loaderVariant}',
          padding: '${sizePaddingMap[toastSize]}',
        }
      }}
    />
  );
}`;
    }, [config]);

    return {
        config,
        setConfig,
        activeTab,
        setActiveTab,
        editingIconState,
        setEditingIconState,
        updateColor,
        updateIconConfig,
        getIconForState,
        triggerToast,
        exportCode,
        playSynthesizedSound,
        initAudio
    };
}
