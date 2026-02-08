
"use client";

import React from 'react';
import { ToastType, IconMode } from '@/types/toast-types';
import { ICON_PRESETS } from '@/hooks/use-toast-forge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToastForgeContext } from '@/components/forge/toast-forge-provider';

export const IconSection: React.FC = () => {
    const {
        config,
        setConfig,
        editingIconState,
        setEditingIconState,
        updateIconConfig,
        getIconForState,
        playInteractionSound
    } = useToastForgeContext();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-3 gap-2">
                {(['success', 'error', 'warning', 'info', 'loading', 'default'] as ToastType[]).map(state => (
                    <Button
                        key={state}
                        variant={editingIconState === state ? 'default' : 'outline'}
                        onClick={() => setEditingIconState(state)}
                        size="lg"
                    >
                        <span className="text-[10px] font-semibold uppercase tracking-tighter">{state}</span>
                        <span className="scale-75 h-5 flex items-center justify-center">{getIconForState(state)}</span>
                    </Button>
                ))}
            </div>

            <Card>
                <CardContent>
                    <div className="py-4 space-y-6">
                        <div className="grid grid-cols-3 gap-2">
                            {(['preset', 'custom', 'none'] as IconMode[]).map(mode => (
                                <Button
                                    key={mode}
                                    variant={config.iconConfigs[editingIconState].mode === mode ? 'default' : 'secondary'}
                                    size="sm"
                                    onClick={() => updateIconConfig(editingIconState, { mode })}
                                >
                                    <span className="text-[10px] font-semibold uppercase tracking-tighter">{mode}</span>
                                </Button>
                            ))}
                        </div>

                        {config.iconConfigs[editingIconState].mode === 'preset' && (
                            <div className="grid grid-cols-6 place-items-center gap-2 h-40 overflow-y-auto custom-scrollbar pr-2 bg-secondary rounded-lg p-2 border border-border">
                                {Object.entries(ICON_PRESETS).map(([name, IconComp]) => (
                                    <Button
                                        key={name}
                                        variant={config.iconConfigs[editingIconState].preset === name ? 'default' : 'ghost'}
                                        size="icon-sm"
                                        onClick={() => updateIconConfig(editingIconState, { preset: name })}
                                    >
                                        <IconComp className="w-4 h-4" />
                                    </Button>
                                ))}
                            </div>
                        )}

                        {config.iconConfigs[editingIconState].mode === 'custom' && (
                            <div className="space-y-3">
                                <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Custom SVG Code</Label>
                                <textarea
                                    value={config.iconConfigs[editingIconState].customSvg}
                                    onChange={(e) => updateIconConfig(editingIconState, { customSvg: e.target.value })}
                                    className="w-full h-32 bg-background border border-border rounded-lg p-3 text-xs font-mono text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-inner"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4 px-1">
                <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium text-foreground">Global Icon Size</Label>
                    <span className="text-xs font-mono text-muted-foreground">{config.iconSize}px</span>
                </div>
                <Slider
                    min={12}
                    max={48}
                    step={1}
                    value={[config.iconSize]}
                    onValueChange={(vals: number[]) => setConfig(prev => ({ ...prev, iconSize: vals[0] }))}
                />
            </div>
        </div>
    );
};
