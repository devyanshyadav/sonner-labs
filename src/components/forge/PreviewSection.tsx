
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
            {/* Professional Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(var(--background-rgb),1))]" />
            </div>

            <header className="p-6 flex items-center justify-between z-20 bg-background/50 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="rounded-md ring-2 ring-muted/50 text-xs font-bold tracking-wider uppercase text-muted-foreground bg-muted/50 border-border">
                        Current Theme: {config.theme.name}
                    </Badge>
                </div>
                <div className='flex items-center gap-3'>
                    <ThemeToggle />
                    <div className="w-px h-6 bg-border" />
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                    >
                        <a href="https://github.com/emilkowalski/sonner" target="_blank" rel="noreferrer">
                            <Github className="w-5 h-5" />
                        </a>
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex flex-col p-8 md:p-24 z-20 text-center relative max-w-5xl mx-auto">
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md ring-2 ring-muted/50 border border-border bg-muted/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Production Environment
                    </div>
                </div>

                <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-foreground">
                    Sonner <span className="text-muted-foreground/40 font-medium">Labs.</span>
                </h2>

                <p className="text-base md:text-lg max-w-xl mb-12 text-muted-foreground font-medium leading-relaxed balance">
                    A professional-grade playground for configuring and previewing
                    Sonner notification systems. Minimal, precise, and production-ready.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl px-4">
                    {[
                        { id: 'success', label: 'Success', icon: CheckCircle2, color: 'text-emerald-500' },
                        { id: 'error', label: 'Error', icon: X, color: 'text-rose-500' },
                        { id: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-amber-500' },
                        { id: 'loading', label: 'Loading', icon: RefreshCw, color: 'text-primary', spin: true }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => triggerToast(btn.id as ToastType)}
                            className=" flex flex-col items-center justify-center border rounded-lg ring-4 ring-muted/50 aspect-square gap-2 bg-card group"
                        >
                            <div className="p-3 rounded-lg  group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300">
                                <btn.icon className={`size-6 ${btn.color} ${btn.spin ? 'animate-spin' : ''}`} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                                {btn.label}
                            </span>
                        </button>
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
    box-shadow: 0 0 12px 1px var(--loader-color);
    opacity: 0.9;
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
