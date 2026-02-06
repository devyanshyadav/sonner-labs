
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type EntryDirection = 'top' | 'bottom' | 'left' | 'right';
export type IconMode = 'preset' | 'custom' | 'none';
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading' | 'default';
export type HapticPattern = 'soft' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
export type SoundPreset = 'none' | 'pop' | 'success' | 'error' | 'digital' | 'dock';

export interface StateIconConfig {
    mode: IconMode;
    preset: string;
    customSvg: string;
}

export interface ToastTheme {
    id: string;
    name: string;
    vibe: string;
    description: string;
    colors: {
        background: string;
        border: string;
        text: string;
        description: string;
        icon: string;
    };
    borderRadius: string;
    borderWidth: string;
    boxShadow: string;
    blur?: string;
    customCss?: string;
}

export interface ToastConfig {
    position: ToastPosition;
    direction: EntryDirection;
    expand: boolean;
    richColors: boolean;
    closeButton: boolean;
    showProgressBar: boolean;
    duration: number;
    animationDuration: number;
    offset: number;
    gap: number;
    shadowIntensity: number;
    blurIntensity: number;
    theme: ToastTheme;
    previewMode: 'light' | 'dark';
    useDynamicVariables: boolean;
    // State-specific Icon Customization
    iconConfigs: Record<ToastType, StateIconConfig>;
    iconSize: number;
    // Haptic Feedback
    hapticEnabled: boolean;
    hapticPattern: HapticPattern;
    visualHapticEnabled: boolean;
    // Auditory Feedback
    soundEnabled: boolean;
    soundPreset: SoundPreset;
    soundVolume: number;
}
