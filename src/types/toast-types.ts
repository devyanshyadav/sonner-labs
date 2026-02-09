
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type ToastSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconMode = 'default' | 'preset' | 'custom';
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading' | 'default';
export type SoundPreset = 'none' | 'pop' | 'success' | 'error' | 'digital' | 'dock';

export interface StateIconConfig {
    mode: IconMode;
    preset: string;
    customSvg: string;
}

export interface ToastTheme {
    id: string;
    name: string;
    description: string;
    customCss: string;
}

export interface ToastConfig {
    position: ToastPosition;
    expand: boolean;
    closeButton: boolean;
    showProgressBar: boolean;
    loaderPosition: 'top' | 'bottom';
    loaderVariant: 'solid' | 'gradient';
    toastSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    duration: number;
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
    // Auditory Feedback
    soundEnabled: boolean;
    soundPreset: SoundPreset;
    soundVolume: number;
}
