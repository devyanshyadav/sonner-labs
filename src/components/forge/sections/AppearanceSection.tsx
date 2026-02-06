
"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToastForgeContext } from '@/components/forge/ToastForgeProvider';

export const AppearanceSection: React.FC = () => {
    const { config, setConfig, updateColor } = useToastForgeContext();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <section>
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest block mb-4 px-1">Color Palette</Label>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(config.theme.colors).map(([key, value]) => (
                        <div key={key} className="space-y-2 text-left">
                            <span className="text-xs text-muted-foreground capitalize px-1">{key}</span>
                            <div className="flex items-center gap-2 bg-muted border border-border rounded-lg p-2 transition-colors hover:bg-accent group">
                                <input
                                    type="color"
                                    value={value.startsWith('rgba') ? '#ffffff' : value}
                                    onChange={(e) => updateColor(key as any, e.target.value)}
                                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-none appearance-none group-hover:scale-110 transition-transform"
                                />
                                <span className="text-xs font-mono text-muted-foreground uppercase">{value.slice(0, 7)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Card>
                <CardContent>
                    <div className="py-6 space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-medium text-foreground">Border Radius</Label>
                                    <span className="text-xs font-mono text-muted-foreground">{config.theme.borderRadius}</span>
                                </div>
                                <Slider
                                    min={0}
                                    max={40}
                                    step={1}
                                    value={[parseInt(config.theme.borderRadius)]}
                                    onValueChange={([val]) => setConfig(c => ({ ...c, theme: { ...c.theme, borderRadius: val + 'px' } }))}
                                />
                            </div>

                            <div className="space-y-4 pt-2 border-t">
                                <Label className="text-sm font-medium text-foreground">Toast Size</Label>
                                <Tabs
                                    value={config.toastSize}
                                    onValueChange={(val: any) => setConfig(c => ({ ...c, toastSize: val }))}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-5">
                                        <TabsTrigger value="sm" className="text-[10px] uppercase font-bold">SM</TabsTrigger>
                                        <TabsTrigger value="md" className="text-[10px] uppercase font-bold">MD</TabsTrigger>
                                        <TabsTrigger value="lg" className="text-[10px] uppercase font-bold">LG</TabsTrigger>
                                        <TabsTrigger value="xl" className="text-[10px] uppercase font-bold">XL</TabsTrigger>
                                        <TabsTrigger value="2xl" className="text-[10px] uppercase font-bold">2XL</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                                    Adjusts width, padding, and font scale.
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-foreground">Expand Stack</Label>
                                <Switch
                                    checked={config.expand}
                                    onCheckedChange={(val) => setConfig(c => ({ ...c, expand: val }))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-foreground">Close Button</Label>
                                <Switch
                                    checked={config.closeButton}
                                    onCheckedChange={(val) => setConfig(c => ({ ...c, closeButton: val }))}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                                <Label className="text-sm font-medium text-foreground">Loader Position</Label>
                                <Tabs
                                    value={config.loaderPosition}
                                    onValueChange={(val: any) => setConfig(c => ({ ...c, loaderPosition: val }))}
                                    className="w-[140px]"
                                >
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="top" className="text-[10px] uppercase font-bold">Top</TabsTrigger>
                                        <TabsTrigger value="bottom" className="text-[10px] uppercase font-bold">Bottom</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <Label className="text-sm font-medium text-foreground">Loader Style</Label>
                                <Tabs
                                    value={config.loaderVariant}
                                    onValueChange={(val: any) => setConfig(c => ({ ...c, loaderVariant: val }))}
                                    className="w-[140px]"
                                >
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="solid" className="text-[10px] uppercase font-bold">Solid</TabsTrigger>
                                        <TabsTrigger value="gradient" className="text-[10px] uppercase font-bold">Gradient</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
