
"use client";

import React from 'react';
import { ToastType, IconMode } from '@/types/toast-types';
import { ICON_PRESETS } from '@/hooks/use-sonner-labs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSonnerLabsContext } from '@/components/sonner-labs/sonner-labs-provider';

export const IconSection: React.FC = () => {
    const {
        config,
        setConfig,
        editingIconState,
        setEditingIconState,
        updateIconConfig,
        getIconForState,
        playInteractionSound
    } = useSonnerLabsContext();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-4">
            {/* State Selector */}
            <div className="space-y-3">
                <Label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest px-1">Configure State</Label>
                <div className="grid grid-cols-3 gap-2">
                    {(['success', 'error', 'warning', 'info', 'loading'] as ToastType[]).map(state => (
                        <Button
                            key={state}
                            variant={editingIconState === state ? 'outline' : 'secondary'}
                            onClick={() => {
                                setEditingIconState(state);
                                playInteractionSound();
                            }}
                            className={`h-auto py-3 flex-col gap-2 transition-all duration-300 ${editingIconState === state ? 'ring-2 ring-primary ring-offset-2 ring-offset-background translate-y-[-2px]' : ''}`}
                        >
                            <span className="scale-90 h-6 flex items-center justify-center">{getIconForState(state)}</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">{state}</span>
                        </Button>
                    ))}
                </div>
            </div>

            <Card className="shadow-none bg-muted/20">
                <CardContent className="p-4">
                    <div className="space-y-6">
                        {/* Mode Selector */}
                        <div className="grid grid-cols-3 gap-2">
                            {(['default', 'preset', 'custom'] as IconMode[]).map(mode => (
                                <Button
                                    key={mode}
                                    variant={config.iconConfigs[editingIconState].mode === mode ? 'default' : 'secondary'}
                                    size="sm"
                                    onClick={() => {
                                        updateIconConfig(editingIconState, { mode });
                                        playInteractionSound();
                                    }}
                                    className="uppercase font-black text-[9px] tracking-widest h-8"
                                >
                                    {mode}
                                </Button>
                            ))}
                        </div>

                        {/* Preset Icon Grid */}
                        {config.iconConfigs[editingIconState].mode === 'preset' && (
                            <div className="grid grid-cols-6 place-items-center gap-2 max-h-[260px] overflow-y-auto custom-scrollbar pr-1 py-1">
                                {Object.entries(ICON_PRESETS).map(([name, IconComp]) => (
                                    <Button
                                        key={name}
                                        variant={config.iconConfigs[editingIconState].preset === name ? 'default' : 'ghost'}
                                        size="icon-xs"
                                        title={name}
                                        onClick={() => {
                                            updateIconConfig(editingIconState, { preset: name });
                                            playInteractionSound();
                                        }}

                                    >
                                        <IconComp className="size-4" />
                                    </Button>
                                ))}
                            </div>
                        )}

                        {config.iconConfigs[editingIconState].mode === 'custom' && (
                            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                                <Label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest pl-1">Custom SVG Code</Label>
                                <textarea
                                    value={config.iconConfigs[editingIconState].customSvg}
                                    onChange={(e) => updateIconConfig(editingIconState, { customSvg: e.target.value })}
                                    spellCheck={false}
                                    className="w-full h-32 bg-background/50 border border-border/50 rounded-xl p-4 text-[11px] font-mono text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner custom-scrollbar"
                                    placeholder="<svg ...>...</svg>"
                                />
                                <p className="text-[9px] text-muted-foreground px-1 italic">Paste any raw SVG code here to use a custom icon.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-5 px-1">
                <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-bold tracking-tight text-foreground">Global Icon Size</Label>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-70">Applies to all toasts</p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-[11px] px-2 rounded-md">
                        {config.iconSize}px
                    </Badge>
                </div>
                <div className="pt-2">
                    <Slider
                        min={12}
                        max={48}
                        step={1}
                        value={[config.iconSize]}
                        onValueChange={(vals: number[]) => setConfig((prev: any) => ({ ...prev, iconSize: vals[0] }))}
                        className="py-2"
                    />
                </div>
            </div>
        </div>
    );
};
