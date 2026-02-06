
"use client";

import React from 'react';
import { Toaster } from 'sonner';
import {
    Github,
    Sun,
    Moon,
    Activity,
    CheckCircle2,
    X,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToastForgeContext } from '@/components/forge/ToastForgeProvider';
import { ToastType } from '@/types/types';
import ThemeToggle from './theme-toggle';

const TOAST_SIZES = {
    sm: { width: '320px', padding: '12px 16px', fontSize: '13px', iconSize: 18 },
    md: { width: '380px', padding: '16px 20px', fontSize: '14px', iconSize: 20 },
    lg: { width: '440px', padding: '20px 24px', fontSize: '16px', iconSize: 22 },
    xl: { width: '540px', padding: '28px 32px', fontSize: '18px', iconSize: 24 },
    '2xl': { width: '680px', padding: '36px 44px', fontSize: '20px', iconSize: 28 },
};

export const PreviewSection: React.FC = () => {
    const {
        config,
        setConfig,
        triggerToast,
        getIconForState
    } = useToastForgeContext();
    return (
        <main className={`flex-1 flex flex-col relative overflow-hidden bg-background`}>
            {/* Background Orbs */}
            <div className={`absolute inset-0 pointer-events-none opacity-5`}>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary blur-[180px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <header className="p-8 flex items-center justify-between z-20">
                <div className="flex gap-4">
                    <Badge variant="secondary">
                        <Activity className="w-4 h-4 text-primary" />
                        {config.theme.name}
                    </Badge>



                </div>
                <div className='flex items-center gap-2'>


                    <ThemeToggle />

                    <Button
                        variant="outline"
                        size="icon"
                        asChild
                    >
                        <a href="https://github.com/emilkowalski/sonner" target="_blank" rel="noreferrer">
                            <Github className="w-5 h-5" />
                        </a>
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 z-20 text-center relative max-w-5xl mx-auto">
                <div className="mb-6">
                    <Badge variant="secondary">
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" />
                        Interactive Playground
                    </Badge>
                </div>

                <h2 className={`text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-10 transition-colors duration-300 text-foreground`}>
                    Forge <span className="text-transparent bg-clip-text bg-linear-to-br from-primary via-primary to-primary/60 drop-shadow-sm">Toasts.</span>
                </h2>

                <p className={`text-lg md:text-xl max-w-2xl mb-16 font-medium leading-relaxed transition-colors duration-300 text-muted-foreground`}>
                    Design professional-grade notification systems with custom easing,
                    motion polish, and synthesized audio signatures.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                    {[
                        { id: 'success', label: 'Confirm', icon: CheckCircle2, color: 'text-chart-2' },
                        { id: 'error', label: 'Refuse', icon: X, color: 'text-destructive' },
                        { id: 'warning', label: 'Alert', icon: AlertTriangle, color: 'text-chart-4' },
                        { id: 'loading', label: 'Process', icon: RefreshCw, color: 'text-primary', spin: true }
                    ].map((btn) => (
                        <Button
                            key={btn.id}
                            variant="outline"
                            size="lg"
                            onClick={() => triggerToast(btn.id as ToastType)}
                            className="w-full"
                        >
                            <span className="flex items-center gap-2">
                                <btn.icon className={`w-5 h-5 ${btn.color} ${btn.spin ? 'animate-spin' : ''}`} />
                                {btn.label}
                            </span>
                        </Button>
                    ))}
                </div>
            </div>

            <Toaster
                position={config.position}
                expand={config.expand}
                closeButton={config.closeButton}
                duration={config.duration}
                offset={`${config.offset}px`}
                gap={config.gap}
                theme={config.previewMode}
                icons={{
                    success: getIconForState('success'),
                    error: getIconForState('error'),
                    warning: getIconForState('warning'),
                    info: getIconForState('info'),
                    loading: getIconForState('loading')
                }}
                toastOptions={{
                    style: {
                        background: config.theme.colors.background,
                        color: config.theme.colors.text,
                        border: `${config.theme.borderWidth} solid ${config.theme.colors.border}`,
                        borderRadius: config.theme.borderRadius,
                        boxShadow: `0 20px 40px rgba(0,0,0,${config.previewMode === 'dark' ? config.shadowIntensity : config.shadowIntensity * 0.5})`,
                        backdropFilter: `blur(${config.blurIntensity}px)`,
                        '--duration': `${config.duration}ms`,
                        '--loader-color': config.theme.colors.icon,
                        '--toast-border': config.theme.colors.border,
                        '--toast-bg': config.theme.colors.background,
                        '--toast-fg': config.theme.colors.text,
                        '--toast-muted': config.theme.colors.description,
                        width: TOAST_SIZES[config.toastSize].width,
                        padding: TOAST_SIZES[config.toastSize].padding,
                        fontSize: TOAST_SIZES[config.toastSize].fontSize,
                    } as React.CSSProperties,
                    className: `sonner-toast-custom ${config.showProgressBar ? 'has-loader' : ''}`,
                }}
            />

            <style>{`
  ${config.theme.customCss || ''}
  
  .sonner-toast-custom {
    border-left-width: ${config.theme.borderWidth};
    border-left-style: solid;
    border-left-color: var(--toast-border);
    overflow: hidden !important;
    height: auto !important;
    min-height: fit-content !important;
  }
  
  .sonner-toast-custom::before {
    display: none !important;
  }
  
  .sonner-toast-custom [data-close-button] {
    background: var(--toast-bg);
    border: 1px solid var(--toast-border);
    color: var(--toast-fg);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    top: 12px !important;
    right: 12px !important;
    left: auto !important;
    transform: none !important;
    opacity: 0;
    transition: all 0.2s ease;
  }
  
  .sonner-toast-custom:hover [data-close-button] {
    opacity: 1;
  }
  
  .sonner-toast-custom [data-close-button]:hover {
    color: var(--toast-bg) ;
    border-color: var(--loader-color) !important;
    color: var(--loader-color) !important;
  }
  
  .has-loader::after {
    content: '';
    position: absolute;
    ${config.loaderPosition === 'top' ? 'top: 0 !important;' : 'bottom: 0 !important;'}
    left: 0 !important;
    height: 3px !important;
    width: 100% !important;
    background: ${config.loaderVariant === 'gradient'
                    ? `linear-gradient(to right, transparent, var(--loader-color))`
                    : `var(--loader-color)`} !important;
    transform-origin: left !important;
    animation: toast-loader var(--duration) linear forwards;
    box-shadow: 0 0 10px var(--loader-color);
    opacity: 0.8;
  }
  
  [data-sonner-toaster]:hover .sonner-toast-custom::after {
    animation-play-state: paused !important;
  }
  
  @keyframes toast-loader {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
  
  .sonner-toast-custom [data-description] {
    color: ${config.theme.colors.description} !important;
    font-size: 0.875rem;
    margin-top: 4px;
    font-weight: 500;
  }
  
  .sonner-toast-custom [data-icon] {
    color: ${config.theme.colors.icon} !important;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`}</style>

        </main>
    );
};
