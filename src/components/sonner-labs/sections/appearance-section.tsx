import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useSonnerLabsContext } from '@/components/sonner-labs/sonner-labs-provider';
import { ToastSize } from '@/types/toast-types';
import { TOAST_SIZES } from '@/constants/toast-presets';

export const AppearanceSection: React.FC = () => {
    const { config, setConfig, getCssVar, updateCssVars } = useSonnerLabsContext();

    const colorVars = [
        { label: 'background', var: '--slb-bg' },
        { label: 'border', var: '--slb-border' },
        { label: 'foreground', var: '--slb-fg' },
        { label: 'muted', var: '--slb-muted' },
        { label: 'primary', var: '--slb-primary' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <section>
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest block mb-4 px-1">Color Palette</Label>
                <div className="grid grid-cols-2 gap-4">
                    {colorVars.map(({ label, var: variable }) => {
                        const value = getCssVar(variable);
                        return (
                            <div key={variable} className="space-y-2 text-left">
                                <span className="text-xs text-muted-foreground capitalize px-1">{label}</span>
                                <div className="flex items-center gap-2 bg-muted border border-border rounded-lg p-2 transition-colors hover:bg-accent group">
                                    <input
                                        type="color"
                                        value={value.startsWith('#') ? value : '#000000'}
                                        onChange={(e) => updateCssVars({ [variable]: e.target.value })}
                                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-none appearance-none group-hover:scale-110 transition-transform"
                                    />
                                    <span className="text-xs font-mono text-muted-foreground uppercase">{value.slice(0, 7)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <Card className="border-none bg-muted/30 shadow-none">
                <CardContent className="p-6 space-y-8">
                    <div className="space-y-5">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium text-foreground">Border Radius</Label>
                                <span className="text-xs font-mono text-muted-foreground">{getCssVar('--slb-radius')}</span>
                            </div>
                            <Slider
                                min={0} max={40} step={1}
                                value={[parseInt(getCssVar('--slb-radius')) || 0]}
                                onValueChange={(vals: number[]) => updateCssVars({ '--slb-radius': `${vals[0]}px` })}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                            <Label className="text-sm font-medium text-foreground">Toast Size</Label>
                            <Tabs
                                value={config.toastSize}
                                onValueChange={(val: string) => setConfig(prev => ({ ...prev, toastSize: val as ToastSize }))}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 rounded-xl">
                                    {Object.keys(TOAST_SIZES).map(size => (
                                        <TabsTrigger key={size} value={size} className="text-[10px] uppercase font-bold py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            {size}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-foreground">Expand Stack</Label>
                                <Switch
                                    checked={config.expand}
                                    onCheckedChange={(val: boolean) => setConfig(prev => ({ ...prev, expand: val }))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-foreground">Close Button</Label>
                                <Switch
                                    checked={config.closeButton}
                                    onCheckedChange={(val: boolean) => setConfig(c => ({ ...c, closeButton: val }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-foreground">Loader Progress</Label>
                                <Switch
                                    checked={config.showProgressBar}
                                    onCheckedChange={(val: boolean) => setConfig(c => ({ ...c, showProgressBar: val }))}
                                />
                            </div>

                            {config.showProgressBar && (
                                <div className="space-y-6 pt-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Position</Label>
                                        <Tabs
                                            value={config.loaderPosition}
                                            onValueChange={(val) => setConfig(c => ({ ...c, loaderPosition: val as 'top' | 'bottom' }))}
                                            className="w-full"
                                        >
                                            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl">
                                                <TabsTrigger value="top" className="text-[10px] uppercase font-bold py-2 rounded-lg data-[state=active]:bg-background">Top</TabsTrigger>
                                                <TabsTrigger value="bottom" className="text-[10px] uppercase font-bold py-2 rounded-lg data-[state=active]:bg-background">Bottom</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Style</Label>
                                        <Tabs
                                            value={config.loaderVariant}
                                            onValueChange={(val) => setConfig(c => ({ ...c, loaderVariant: val as 'solid' | 'gradient' }))}
                                            className="w-full"
                                        >
                                            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl">
                                                <TabsTrigger value="solid" className="text-[10px] uppercase font-bold py-2 rounded-lg data-[state=active]:bg-background">Solid</TabsTrigger>
                                                <TabsTrigger value="gradient" className="text-[10px] uppercase font-bold py-2 rounded-lg data-[state=active]:bg-background">Gradient</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
