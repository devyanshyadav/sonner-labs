
"use client";

import React from 'react';
import {
    Palette,
    Eye,
    Ghost,
    Music,
    Activity,
    Code as CodeIcon,
    ChevronRight,
    Settings2
} from 'lucide-react';
import { ThemeSection } from './sections/ThemeSection';
import { AppearanceSection } from './sections/AppearanceSection';
import { IconSection } from './sections/IconSection';
import { AudioSection } from './sections/AudioSection';
import { MotionSection } from './sections/MotionSection';
import { CodeSection } from './sections/CodeSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToastForgeContext } from '@/components/forge/ToastForgeProvider';

export const Sidebar: React.FC = () => {
    const {
        activeTab,
        setActiveTab,
        triggerToast
    } = useToastForgeContext();

    const tabs = [
        { id: 'themes', icon: Palette, label: 'Themes' },
        { id: 'appearance', icon: Eye, label: 'Look' },
        { id: 'icon', icon: Ghost, label: 'Icons' },
        { id: 'audio', icon: Music, label: 'Audio' },
        { id: 'motion', icon: Activity, label: 'Motion' },
        { id: 'code', icon: CodeIcon, label: 'Code' }
    ];

    return (
        <aside className="w-full md:w-[520px] border-b md:border-b-0 md:border-r border-border bg-card flex flex-col z-30 h-screen overflow-hidden">
            <header className="p-6 border-b border-border flex items-center justify-between bg-muted">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center font-black italic transition-transform hover:scale-105 active:scale-95 cursor-default">
                        TF
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-foreground leading-tight uppercase">ToastForge</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-black opacity-70 scale-90 origin-left">Notification Studio</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline">
                        <span className="inline-flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-none">Live</span>
                        </span>
                    </Badge>
                </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <div className="px-6 py-4 border-b border-border bg-background">
                    <TabsList className="w-full">
                        {tabs.map(tab => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex-1"
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <ScrollArea className="h-full px-6 py-6" scrollHideDelay={200}>
                        <div className="pb-24">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-lg border border-border">
                                        <Settings2 className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                                            {tabs.find(t => t.id === activeTab)?.label} Settings
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-medium lowercase">configure behavior</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                            </div>

                            <div className="px-2">
                                <TabsContent value="themes" className="mt-0 focus-visible:outline-none">
                                    <ThemeSection />
                                </TabsContent>
                                <TabsContent value="appearance" className="mt-0 focus-visible:outline-none">
                                    <AppearanceSection />
                                </TabsContent>
                                <TabsContent value="icon" className="mt-0 focus-visible:outline-none">
                                    <IconSection />
                                </TabsContent>
                                <TabsContent value="audio" className="mt-0 focus-visible:outline-none">
                                    <AudioSection />
                                </TabsContent>
                                <TabsContent value="motion" className="mt-0 focus-visible:outline-none">
                                    <MotionSection />
                                </TabsContent>
                                <TabsContent value="code" className="mt-0 focus-visible:outline-none">
                                    <CodeSection />
                                </TabsContent>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </Tabs>

            <footer className="p-6 border-t border-border bg-card">
                <Button onClick={() => triggerToast('default')} size="lg" asChild>
                    <button className="w-full">
                        <span className="flex items-center gap-2">
                            Run Preview
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </button>
                </Button>
            </footer>
        </aside>
    );
};
