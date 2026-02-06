
"use client";

import React from 'react';
import { SoundPreset } from '@/types/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Volume2, VolumeX, Activity } from 'lucide-react';
import { useToastForgeContext } from '@/components/forge/ToastForgeProvider';

export const AudioSection: React.FC = () => {
    const {
        config,
        setConfig,
        playSynthesizedSound,
        initAudio
    } = useToastForgeContext();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <section>
                <div className="mb-6">
                    <Card>
                        <CardContent>
                            <div className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Music className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Toast Sounds</span>
                                </div>
                                <Switch
                                    checked={config.soundEnabled}
                                    onCheckedChange={(val) => {
                                        setConfig(p => ({ ...p, soundEnabled: val }));
                                        if (val) initAudio();
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-10 px-1">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Volume Level</Label>
                            <div className="flex items-center gap-2">
                                {config.soundVolume === 0 ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-primary" />}
                                <span className="text-xs font-mono text-muted-foreground">{Math.round(config.soundVolume * 100)}%</span>
                            </div>
                        </div>
                        <Slider
                            min={0}
                            max={1}
                            step={0.05}
                            value={[config.soundVolume]}
                            onValueChange={([val]) => setConfig(c => ({ ...c, soundVolume: val }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {(['pop', 'success', 'error', 'digital', 'dock'] as SoundPreset[]).map(preset => (
                            <Button
                                key={preset}
                                variant={config.soundPreset === preset ? 'default' : 'secondary'}
                                onClick={() => { setConfig(c => ({ ...c, soundPreset: preset })); playSynthesizedSound(preset); }}
                                size="lg"
                            >
                                <span className="flex items-center justify-between w-full">
                                    <span className="text-xs font-semibold capitalize tracking-tight">{preset}</span>
                                    <Activity className={`w-4 h-4 transition-opacity ${config.soundPreset === preset ? 'opacity-100' : 'opacity-0'}`} />
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            <Card>
                <CardContent>
                    <div className="py-4">
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            Powered by the <span className="text-primary font-semibold uppercase">Web Audio API</span> for zero-latency synthesized audio signatures.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
