
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
import { ThemeSection } from './sections/theme-section';
import { AppearanceSection } from './sections/appearance-section';
import { IconSection } from './sections/icon-section';
import { AudioSection } from './sections/audio-section';
import { MotionSection } from './sections/motion-section';
import { CodeSection } from './sections/code-section';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSonnerLabsContext } from '@/components/forge/sonner-labs-provider';
import { HiOutlineColorSwatch } from "react-icons/hi";
import { GrView } from 'react-icons/gr';
import { IoShapesOutline } from 'react-icons/io5';
import { MdOutlineAnimation } from 'react-icons/md';
import Logo from './logo';

export const Sidebar = () => {
    const {
        activeTab,
        setActiveTab,
        triggerToast
    } = useSonnerLabsContext();

    const tabs: { id: string, icon: React.ComponentType<{ className?: string }>, label: string }[] = [
        { id: 'themes', icon: HiOutlineColorSwatch, label: 'Themes' },
        { id: 'appearance', icon: GrView, label: 'Look' },
        { id: 'icon', icon: IoShapesOutline, label: 'Icons' },
        { id: 'audio', icon: Music, label: 'Audio' },
        { id: 'motion', icon: MdOutlineAnimation, label: 'Motion' },
    ];

    return (
        <aside className="w-full md:w-[520px] border-b md:border-b-0 md:border-r border-border bg-card flex flex-col z-30 h-full overflow-hidden">
            <header className="p-4 border-b border-border flex items-center justify-between bg-muted">
                <div className="flex items-center gap-3">
                    <Logo className="p-1.5 w-12 h-12 rounded-full bg-black" />
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-foreground leading-tight uppercase">Sonner Labs</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-black opacity-70 scale-90 origin-left">By Devvarena</p>
                    </div>
                </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <div className=" p-2 py-3 border-b border-border bg-background">
                    <TabsList className="w-full bg-transparent">
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

                <div className="flex-1 relative overflow-hidden [mask-image:_linear-gradient(to_bottom,_transparent_0,_white_30px,white_calc(100%-30px),_transparent_100%)]">
                    <ScrollArea className="h-full" scrollHideDelay={200}>
                        <div className="pb-24 pt-6 px-4">
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
                <Button onClick={() => triggerToast('default')} size="lg" className='w-full h-11'>
                    <span className="flex items-center gap-2">
                        Run Preview
                        <ChevronRight className="w-4 h-4" />
                    </span>
                </Button>
            </footer>
        </aside>
    );
};
