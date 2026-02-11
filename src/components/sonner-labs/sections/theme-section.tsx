
"use client";

import React from 'react';
import { THEMES } from '@/constants/toast-presets';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSonnerLabsContext } from '@/components/sonner-labs/sonner-labs-provider';

export const ThemeSection: React.FC = () => {
    const { config, setConfig, playInteractionSound } = useSonnerLabsContext();

    const getThemeColor = (css: string, variable: string, mode: 'light' | 'dark') => {
        const blockRegex = mode === 'dark' ? /\.dark\s*{([^}]*)}/ : /:root\s*{([^}]*)}/;
        const blockMatch = css.match(blockRegex);

        // If mode is dark and block not found, or var not found in dark block, try root
        if (mode === 'dark' && blockMatch) {
            const content = blockMatch[1];
            const varRegex = new RegExp(`${variable}:\\s*([^;]+)`);
            const varMatch = content.match(varRegex);
            if (varMatch) return varMatch[1].trim();
        }

        // Fallback to root block
        const rootMatch = css.match(/:root\s*{([^}]*)}/);
        if (rootMatch) {
            const content = rootMatch[1];
            const varRegex = new RegExp(`${variable}:\\s*([^;]+)`);
            const varMatch = content.match(varRegex);
            return varMatch ? varMatch[1].trim() : '#000000';
        }

        return '#000000';
    };

    return (
        <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {THEMES.map((t) => (
                <div key={t.id} className="overflow-hidden">
                    {(() => {
                        const bg = getThemeColor(t.customCss, '--slb-bg', config.previewMode);
                        const primary = getThemeColor(t.customCss, '--slb-primary', config.previewMode);

                        return (
                            <Card className='p-0.5 bg-card shadow-none'>
                                <button
                                    className={`rounded-lg p-3 group/theme bg-muted ${config.theme.id === t.id ? 'ring-2 ring-primary/50' : ''}`}
                                    onClick={() => {
                                        setConfig(prev => ({
                                            ...prev,
                                            theme: t,
                                            ...(t.defaultConfig || {})
                                        }));
                                    }}
                                >
                                    <span className="flex items-center gap-4 w-full text-left">
                                        <span className="w-10 h-10 rounded-lg shrink-0 border border-border overflow-hidden relative" style={{ background: bg }}>
                                            <span className="absolute inset-x-0 bottom-0 h-1.5 group-hover/theme:h-4 transition-all duration-300" style={{ background: primary }} />
                                        </span>
                                        <span className="flex-1 min-w-0">
                                            <span className="font-semibold text-sm tracking-tight block">{t.name}</span>
                                            <span className="text-xs line-clamp-1 opacity-70 italic">{t.description}</span>
                                        </span>
                                    </span>
                                </button>
                            </Card>
                        );
                    })()}
                </div>
            ))}
        </div>
    );
};
