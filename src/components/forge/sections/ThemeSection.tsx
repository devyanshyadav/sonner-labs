
"use client";

import React from 'react';
import { THEMES } from '@/constants/constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToastForgeContext } from '@/components/forge/ToastForgeProvider';

export const ThemeSection: React.FC = () => {
    const { config, setConfig } = useToastForgeContext();
    return (
        <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {THEMES.map((t) => (
                <div key={t.id} className="overflow-hidden">
                    <Card>
                        <Button
                            variant={config.theme.id === t.id ? 'default' : 'ghost'}
                            onClick={() => setConfig(prev => ({ ...prev, theme: t }))}
                            size="lg"
                            asChild
                        >
                            <button className="w-full justify-start">
                                <span className="flex items-center gap-4 w-full text-left">
                                    <span className="w-10 h-10 rounded-lg shrink-0 border border-border" style={{ background: t.colors.background }}>
                                        <span className="block w-full h-1 mt-auto" style={{ background: t.colors.icon, borderRadius: '0 0 8px 8px' }} />
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <span className="font-semibold text-sm tracking-tight block">{t.name}</span>
                                        <span className="text-xs line-clamp-1 opacity-70">{t.description}</span>
                                    </span>
                                </span>
                            </button>
                        </Button>
                    </Card>
                </div>
            ))}
        </div>
    );
};
