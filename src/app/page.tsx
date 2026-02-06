
'use client'
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import {
  Palette,
  Code,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  Copy,
  Github,
  Zap,
  Activity,
  Clock,
  Maximize2,
  MoveDown,
  MoveUp,
  MoveLeft,
  MoveRight,
  Eye,
  Sun,
  Moon,
  ToggleLeft,
  ToggleRight,
  Smile,
  Heart,
  Star,
  Bell,
  Check,
  X,
  ShieldCheck,
  Flame,
  Coffee,
  Ghost,
  Terminal,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Settings,
  Smartphone,
  Waves,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';
import { THEMES } from '@/constants/constants';
import { ToastConfig, ToastTheme, ToastPosition, EntryDirection, IconMode, ToastType, StateIconConfig, HapticPattern, SoundPreset } from '@/types/types';

const ICON_PRESETS: Record<string, any> = {
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

const HAPTIC_PATTERNS: Record<HapticPattern, number[]> = {
  soft: [10],
  medium: [25],
  heavy: [50],
  success: [10, 30, 10],
  warning: [50, 50],
  error: [100, 50, 100]
};

const DEFAULT_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;

const App: React.FC = () => {
  const [config, setConfig] = useState<ToastConfig>({
    position: 'bottom-right',
    direction: 'bottom',
    expand: true,
    richColors: false,
    closeButton: true,
    showProgressBar: true,
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
    hapticEnabled: true,
    hapticPattern: 'soft',
    visualHapticEnabled: true,
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

  const [activeTab, setActiveTab] = useState<'themes' | 'appearance' | 'icon' | 'haptics' | 'audio' | 'motion' | 'code'>('themes');
  const [editingIconState, setEditingIconState] = useState<ToastType>('success');
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

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
  }, [config.soundVolume]);

  const updateColor = (key: keyof ToastTheme['colors'], value: string) => {
    setConfig(prev => ({ ...prev, theme: { ...prev.theme, colors: { ...prev.theme.colors, [key]: value } } }));
  };

  const updateIconConfig = (type: ToastType, updates: Partial<StateIconConfig>) => {
    setConfig(prev => ({ ...prev, iconConfigs: { ...prev.iconConfigs, [type]: { ...prev.iconConfigs[type], ...updates } } }));
  };

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

  const triggerToast = (type: ToastType) => {
    if (config.soundEnabled) playSynthesizedSound(config.soundPreset);
    if (config.hapticEnabled && navigator.vibrate) navigator.vibrate(HAPTIC_PATTERNS[config.hapticPattern]);

    const options = {
      description: `Synchronized visual, haptic, and auditory feedback.`,
      className: config.visualHapticEnabled ? 'haptic-simulation-thump' : '',
    };

    switch (type) {
      case 'success': toast.success('Action Confirmed', options); break;
      case 'error': toast.error('System Refusal', options); break;
      case 'warning': toast.warning('Security Alert', options); break;
      case 'loading': toast.loading('Processing Engine...', options); break;
      default: toast('Dynamic Preview Active', options);
    }
  };

  const exportCode = useMemo(() => {
    const { position, expand, duration, theme, offset, gap, animationDuration, direction, shadowIntensity, blurIntensity, useDynamicVariables, iconSize, iconConfigs, hapticEnabled, hapticPattern, soundEnabled, soundPreset, soundVolume } = config;

    const generateIconString = (type: ToastType) => {
      const cfg = iconConfigs[type];
      if (cfg.mode === 'none') return 'null';
      if (cfg.mode === 'custom') return `<div dangerouslySetInnerHTML={{ __html: \`${cfg.customSvg}\` }} />`;
      const isSpin = type === 'loading' || cfg.preset === 'refresh';
      return `<YourIcon size={${iconSize}}${isSpin ? ' className="animate-spin"' : ''} />`;
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
    ${hapticEnabled ? `if (navigator.vibrate) navigator.vibrate(${JSON.stringify(HAPTIC_PATTERNS[hapticPattern])});` : ''}
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
          '--entry-dir': '${direction}',
          '--loader-color': '${theme.colors.icon}',
        }
      }}
    />
  );
}`;
  }, [config]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020202] text-zinc-100 overflow-hidden font-sans">
      <aside className="w-full md:w-[420px] border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex flex-col z-20">
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black italic">TF</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">ToastForge</h1>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Pro Notification Studio</p>
            </div>
          </div>
        </div>

        <nav className="flex border-b border-zinc-800/50 overflow-x-auto no-scrollbar">
          {[
            { id: 'themes', icon: Palette, label: 'Themes' },
            { id: 'appearance', icon: Eye, label: 'Look' },
            { id: 'icon', icon: Ghost, label: 'Icons' },
            { id: 'haptics', icon: Waves, label: 'Touch' },
            { id: 'audio', icon: Music, label: 'Audio' },
            { id: 'motion', icon: Activity, label: 'Motion' },
            { id: 'code', icon: Code, label: 'Code' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-2 text-[10px] font-bold uppercase tracking-widest flex flex-col items-center gap-1.5 transition-all min-w-[65px] ${activeTab === tab.id ? 'text-white border-b-2 border-white bg-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setConfig(prev => ({ ...prev, theme: t }))}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${config.theme.id === t.id ? 'border-white bg-white/5' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'}`}
                >
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 border border-zinc-800" style={{ background: t.colors.background }}>
                    <div className="w-full h-1 mt-auto" style={{ background: t.colors.icon, borderRadius: '0 0 8px 8px' }} />
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight">{t.name}</span>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <section>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-5">Color Palette</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(config.theme.colors).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[10px] text-zinc-400 mb-2 block capitalize">{key}</span>
                      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2">
                        <input type="color" value={value.startsWith('rgba') ? '#ffffff' : value} onChange={(e) => updateColor(key as any, e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">{value.slice(0, 7)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-medium">Border Radius</span>
                  <span className="text-[10px] text-zinc-500">{config.theme.borderRadius}</span>
                </div>
                <input type="range" min="0" max="40" value={parseInt(config.theme.borderRadius)} onChange={e => setConfig(c => ({ ...c, theme: { ...c.theme, borderRadius: e.target.value + 'px' } }))} className="w-full accent-white" />
              </section>
            </div>
          )}

          {activeTab === 'icon' && (
            <div className="space-y-8 animate-in slide-in-from-right-2">
              <div className="grid grid-cols-3 gap-2">
                {(['success', 'error', 'warning', 'info', 'loading', 'default'] as ToastType[]).map(state => (
                  <button
                    key={state}
                    onClick={() => setEditingIconState(state)}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${editingIconState === state ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-tighter">{state}</span>
                    <div className="scale-75 h-5 flex items-center justify-center">{getIconForState(state)}</div>
                  </button>
                ))}
              </div>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  {(['preset', 'custom', 'none'] as IconMode[]).map(mode => (
                    <button key={mode} onClick={() => updateIconConfig(editingIconState, { mode })} className={`py-2 rounded-lg border text-[9px] font-black uppercase tracking-tighter transition-all ${config.iconConfigs[editingIconState].mode === mode ? 'bg-white border-white text-black' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{mode}</button>
                  ))}
                </div>
                {config.iconConfigs[editingIconState].mode === 'preset' && (
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(ICON_PRESETS).map(([name, IconComp]) => (
                      <button key={name} onClick={() => updateIconConfig(editingIconState, { preset: name })} className={`p-2.5 rounded-lg border flex items-center justify-center ${config.iconConfigs[editingIconState].preset === name ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}><IconComp size={16} /></button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'haptics' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium">Tactile Feedback</span>
                </div>
                <button onClick={() => setConfig(p => ({ ...p, hapticEnabled: !p.hapticEnabled }))} className={`w-9 h-5 rounded-full relative transition-colors ${config.hapticEnabled ? 'bg-white' : 'bg-zinc-700'}`}><div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${config.hapticEnabled ? 'right-1 bg-black' : 'left-1 bg-zinc-400'}`} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['soft', 'medium', 'heavy', 'success', 'warning', 'error'] as HapticPattern[]).map(pattern => (
                  <button key={pattern} onClick={() => setConfig(c => ({ ...c, hapticPattern: pattern }))} className={`py-3 rounded-xl border capitalize text-xs font-bold transition-all ${config.hapticPattern === pattern ? 'bg-white border-white text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>{pattern}</button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
              <section>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 mb-6">
                  <div className="flex items-center gap-3">
                    <Music className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium">Toast Sounds</span>
                  </div>
                  <button onClick={() => { setConfig(p => ({ ...p, soundEnabled: !p.soundEnabled })); if (!config.soundEnabled) initAudio(); }} className={`w-9 h-5 rounded-full relative transition-colors ${config.soundEnabled ? 'bg-indigo-500' : 'bg-zinc-700'}`}><div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${config.soundEnabled ? 'right-1 bg-white' : 'left-1 bg-zinc-400'}`} /></button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Volume Level</label>
                      <div className="flex items-center gap-2">
                        {config.soundVolume === 0 ? <VolumeX className="w-3 h-3 text-zinc-500" /> : <Volume2 className="w-3 h-3 text-indigo-400" />}
                        <span className="text-[10px] font-mono text-zinc-400">{Math.round(config.soundVolume * 100)}%</span>
                      </div>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={config.soundVolume} onChange={e => setConfig(c => ({ ...c, soundVolume: parseFloat(e.target.value) }))} className="w-full accent-white" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(['pop', 'success', 'error', 'digital', 'dock'] as SoundPreset[]).map(preset => (
                      <button
                        key={preset}
                        onClick={() => { setConfig(c => ({ ...c, soundPreset: preset })); playSynthesizedSound(preset); }}
                        className={`py-3 px-4 rounded-xl border flex items-center justify-between transition-all group ${config.soundPreset === preset ? 'bg-white border-white text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                      >
                        <span className="text-xs font-bold capitalize tracking-tight">{preset}</span>
                        <Activity className={`w-3 h-3 transition-opacity ${config.soundPreset === preset ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  We use the <span className="text-indigo-400">Web Audio API</span> to synthesize these sounds programmatically, ensuring zero-latency performance without needing to download asset files.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'motion' && (
            <div className="space-y-8">
              <div className="grid grid-cols-4 gap-2">
                {[{ id: 'top', icon: MoveUp }, { id: 'bottom', icon: MoveDown }, { id: 'left', icon: MoveLeft }, { id: 'right', icon: MoveRight }].map(dir => (
                  <button key={dir.id} onClick={() => setConfig(c => ({ ...c, direction: dir.id as EntryDirection }))} className={`py-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${config.direction === dir.id ? 'bg-white border-white text-black shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}><dir.icon className="w-4 h-4" /><span className="text-[9px] font-black uppercase">{dir.id}</span></button>
                ))}
              </div>
              <input type="range" min="100" max="1000" step="50" value={config.animationDuration} onChange={e => setConfig(c => ({ ...c, animationDuration: parseInt(e.target.value) }))} className="w-full accent-white" />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <pre className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-mono text-zinc-400 h-[400px] overflow-auto custom-scrollbar">{exportCode}</pre>
              <button onClick={() => { navigator.clipboard.writeText(exportCode); toast.success('Implementation Copied'); }} className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl"><Copy className="w-4 h-4" /> Copy Toaster Config</button>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950">
          <button onClick={() => triggerToast('default')} className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 uppercase tracking-widest active:scale-[0.98]">Launch Live Preview</button>
        </div>
      </aside>

      <main className={`flex-1 flex flex-col relative overflow-hidden transition-colors duration-500 ${config.previewMode === 'dark' ? 'bg-[#000000]' : 'bg-[#fcfcfc]'}`}>
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${config.previewMode === 'dark' ? 'opacity-10' : 'opacity-5'}`}>
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600 blur-[200px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600 blur-[200px] rounded-full" />
        </div>

        <header className="p-6 flex items-center justify-between z-10">
          <div className="flex gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg backdrop-blur-md transition-colors ${config.previewMode === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300' : 'bg-white/50 border-zinc-200 text-zinc-600'}`}>
              <Activity className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{config.theme.name}</span>
            </div>
            <button onClick={() => setConfig(prev => ({ ...prev, previewMode: prev.previewMode === 'dark' ? 'light' : 'dark' }))} className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg backdrop-blur-md transition-all ${config.previewMode === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-yellow-400' : 'bg-white/50 border-zinc-200 text-indigo-600'}`}>{config.previewMode === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}<span className="text-[10px] font-black uppercase tracking-tighter">{config.previewMode} MODE</span></button>
          </div>
          <a href="https://github.com/emilkowalski/sonner" target="_blank" className={`p-2.5 border rounded-xl ${config.previewMode === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}><Github className="w-5 h-5" /></a>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-12 z-10 text-center relative">
          <h2 className={`text-6xl md:text-9xl font-black tracking-tighter mb-8 transition-colors duration-500 ${config.previewMode === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Pro <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Audio.</span></h2>
          <p className="text-zinc-500 text-lg md:text-xl max-w-xl mb-12 font-medium leading-relaxed">Experience zero-latency auditory confirmation. Synthetic tones generated with precision for professional-grade UIs.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl justify-center">
            <button onClick={() => triggerToast('success')} className={`px-6 py-3 rounded-2xl border transition-all font-bold text-xs flex items-center gap-2 ${config.previewMode === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300' : 'bg-white/80 border-zinc-200 text-zinc-700'}`}><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Confirm</button>
            <button onClick={() => triggerToast('error')} className={`px-6 py-3 rounded-2xl border transition-all font-bold text-xs flex items-center gap-2 ${config.previewMode === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300' : 'bg-white/80 border-zinc-200 text-zinc-700'}`}><X className="w-3.5 h-3.5 text-red-500" /> Refuse</button>
            <button onClick={() => triggerToast('warning')} className={`px-6 py-3 rounded-2xl border transition-all font-bold text-xs flex items-center gap-2 ${config.previewMode === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300' : 'bg-white/80 border-zinc-200 text-zinc-700'}`}><AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> Alert</button>
            <button onClick={() => triggerToast('loading')} className={`px-6 py-3 rounded-2xl border transition-all font-bold text-xs flex items-center gap-2 ${config.previewMode === 'dark' ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300' : 'bg-white/80 border-zinc-200 text-zinc-700'}`}><RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" /> Engine</button>
          </div>
        </div>

        <Toaster
          position={config.position} expand={config.expand} richColors={config.richColors} closeButton={config.closeButton} duration={config.duration} offset={`${config.offset}px`} gap={config.gap} theme={config.previewMode}
          icons={{ success: getIconForState('success'), error: getIconForState('error'), warning: getIconForState('warning'), info: getIconForState('info'), loading: getIconForState('loading') }}
          toastOptions={{
            style: {
              background: config.theme.colors.background,
              color: config.theme.colors.text,
              border: `${config.theme.borderWidth} solid ${config.theme.colors.border}`,
              borderRadius: config.theme.borderRadius,
              boxShadow: `0 20px 40px rgba(0,0,0,${config.previewMode === 'dark' ? config.shadowIntensity : config.shadowIntensity * 0.5})`,
              backdropFilter: `blur(${config.blurIntensity}px)`,
              '--duration': `${config.duration}ms`,
              '--anim-speed': `${config.animationDuration}ms`,
              '--entry-dir': config.direction,
              '--loader-color': config.theme.colors.icon,
            } as any,
            className: `sonner-toast-custom ${config.showProgressBar ? 'has-loader' : ''}`,
          }}
        />

        <style>{`
          ${config.theme.customCss || ''}
          .sonner-toast-custom[data-mounted="true"] { animation: custom-entry var(--anim-speed) cubic-bezier(0.19, 1, 0.22, 1) forwards; }
          .haptic-simulation-thump[data-mounted="true"] { animation: custom-entry var(--anim-speed) cubic-bezier(0.19, 1, 0.22, 1) forwards, haptic-thump 0.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; animation-delay: 0s, var(--anim-speed); }
          @keyframes haptic-thump { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          [style*="--entry-dir: bottom"] { --entry-transform: translateY(40px); }
          [style*="--entry-dir: top"] { --entry-transform: translateY(-40px); }
          [style*="--entry-dir: left"] { --entry-transform: translateX(-40px); }
          [style*="--entry-dir: right"] { --entry-transform: translateX(40px); }
          @keyframes custom-entry { from { opacity: 0; transform: var(--entry-transform) scale(0.95); } to { opacity: 1; transform: translate(0) scale(1); } }
          .has-loader::after { content: ''; position: absolute; bottom: 0; left: 0; height: 3px; width: 100%; background: var(--loader-color); transform-origin: left; animation: toast-loader var(--duration) linear forwards; box-shadow: 0 0 10px var(--loader-color); opacity: 0.8; }
          @keyframes toast-loader { from { transform: scaleX(1); } to { transform: scaleX(0); } }
          .sonner-toast-custom [data-description] { color: ${config.theme.colors.description} !important; font-size: 0.8rem; margin-top: 3px; font-weight: 500; }
          .sonner-toast-custom [data-icon] { color: ${config.theme.colors.icon} !important; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        `}</style>
      </main>
    </div>
  );
};

export default App;
