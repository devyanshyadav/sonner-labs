
"use client";

import React from 'react';
import { ToastPosition } from '@/types/toast-types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoveUp, MoveDown, MoveLeft, MoveRight } from 'lucide-react';
import { useSonnerLabsContext } from '@/components/sonner-labs/sonner-labs-provider';

export const MotionSection: React.FC = () => {
    const { config, setConfig } = useSonnerLabsContext();
    const positions: ToastPosition[] = [
        'top-left', 'top-center', 'top-right',
        'bottom-left', 'bottom-center', 'bottom-right'
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <section className="space-y-4 px-1">
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Toaster Position</Label>
                <div className="grid grid-cols-3 gap-2">
                    {positions.map(pos => (
                        <Button
                            key={pos}
                            variant={config.position === pos ? 'default' : 'secondary'}
                            onClick={() => setConfig(c => ({ ...c, position: pos }))}
                            className="h-12 px-2 py-0 overflow-hidden"
                        >
                            <span className="text-[9px] font-bold uppercase whitespace-nowrap leading-tight">
                                {pos.split('-').join('\n')}
                            </span>
                        </Button>
                    ))}
                </div>
            </section>

            <Card className="border-none bg-muted/30 shadow-none">
                <CardContent>
                    <div className="py-6 space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium text-foreground">Toast Duration</Label>
                                <span className="text-xs font-mono text-muted-foreground">{config.duration / 1000}s</span>
                            </div>
                            <Slider
                                min={1000}
                                max={10000}
                                step={500}
                                value={[config.duration]}
                                onValueChange={([val]: number[]) => setConfig(c => ({ ...c, duration: val }))}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium text-foreground">Card Gap</Label>
                                <span className="text-xs font-mono text-muted-foreground">{config.gap}px</span>
                            </div>
                            <Slider
                                min={0}
                                max={100}
                                step={1}
                                value={[config.gap]}
                                onValueChange={([val]: number[]) => setConfig(c => ({ ...c, gap: val }))}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium text-foreground">Screen Offset</Label>
                                <span className="text-xs font-mono text-muted-foreground">{config.offset}px</span>
                            </div>
                            <Slider
                                min={0}
                                max={100}
                                step={4}
                                value={[config.offset]}
                                onValueChange={([val]: number[]) => setConfig(c => ({ ...c, offset: val }))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
