
"use client";

import React from 'react';
import { THEMES } from '@/constants/constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToastForgeContext } from '@/components/forge/ToastForgeProvider';

export const ThemeSection: React.FC = () => {
    const { config, setConfig } = useToastForgeContext();
    return (
        <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {THEMES.map((t) => (
                <div key={t.id} className="overflow-hidden">
                    {(() => {
                        const previewColors = config.previewMode === 'dark'
                            ? t.dark || t.colors
                            : t.light || t.colors;

                        return (
                            <Card className='p-0.5 bg-card shadow-none'>
                                <button
                                    className={`rounded-lg p-3 group/theme bg-muted ${config.theme.id === t.id ? 'ring-2 ring-primary/50' : ''}`}
                                    onClick={() => setConfig(prev => ({ ...prev, theme: t }))}
                                >
                                    <span className="flex items-center gap-4 w-full text-left">
                                        <span className="w-10 h-10 rounded-lg shrink-0 border border-border overflow-hidden relative" style={{ background: previewColors.background }}>
                                            <span className="absolute inset-x-0 bottom-0 h-1.5 group-hover/theme:h-4 transition-all duration-300" style={{ background: previewColors.icon }} />
                                            {/* Visual indicator for dual mode support */}
                                            {t.light && t.dark && (
                                                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary/20 border border-primary/30" title="Supports Light & Dark" />
                                            )}
                                        </span>
                                        <span className="flex-1 min-w-0">
                                            <span className="font-semibold text-sm tracking-tight block">{t.name}</span>
                                            <span className="text-xs line-clamp-1 opacity-70 italic">{t.vibe}</span>
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
