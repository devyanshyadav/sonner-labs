
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
    RefreshCw,
    Code as CodeIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSonnerLabsContext } from '@/components/sonner-labs/sonner-labs-provider';
import { ToastType } from '@/types/toast-types';
import ThemeToggle from './theme-toggle';
import { CodeModal } from './code-modal';

import { TOAST_SIZES, ensureImportant } from '@/constants/toast-presets';

export const PreviewSection: React.FC = () => {
    const {
        config,
        setConfig,
        triggerToast,
        getIconForState
    } = useSonnerLabsContext();
    const [isCodeModalOpen, setIsCodeModalOpen] = React.useState(false);
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
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCodeModalOpen(true)}
                        className="gap-2 font-black uppercase tracking-widest text-[10px] hover:bg-muted"
                    >
                        <CodeIcon className="w-4 h-4" />
                        Code
                    </Button>
                    <div className="w-px h-6 bg-border" />
                    <ThemeToggle />
                    <div className="w-px h-6 bg-border" />
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                    >
                        <a href="https://github.com/devyanshyadav/sonner-labs" target="_blank" rel="noreferrer">
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
                    className: `sonnerLB-toast-shell ${config.showProgressBar ? 'sonnerLB-has-loader' : ''}`,
                }}
            />

            <style>{`
  ${ensureImportant(config.theme.customCss)}
`}</style>

            <CodeModal open={isCodeModalOpen} onOpenChange={setIsCodeModalOpen} />
        </main>
    );
};
