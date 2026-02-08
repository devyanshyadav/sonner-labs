
"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Copy, Check, Code, FileJson, FileCode } from 'lucide-react';
import { useSonnerLabsContext } from '@/components/sonner-labs/sonner-labs-provider';
import { toast } from 'sonner';

interface CodeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ open, onOpenChange }) => {
    const { exportCode, playInteractionSound } = useSonnerLabsContext();
    const [copied, setCopied] = useState<'react' | 'css' | null>(null);

    const handleCopy = (type: 'react' | 'css') => {
        const text = type === 'react' ? exportCode.react : exportCode.css;
        navigator.clipboard.writeText(text);
        setCopied(type);
        playInteractionSound(); // Play app feedback sound
        toast.success(`${type.toUpperCase()} Codeline Copied!`, {
            description: 'Implementation details are in your clipboard.',
        });
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-card border-border shadow-2xl">
                <DialogHeader className="p-6 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Code className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight uppercase">Implementation Guide</DialogTitle>
                    </div>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Copy the code below to integrate this custom toast into your project.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="react" className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 py-2 border-b border-border bg-muted/10">
                        <TabsList className="bg-muted/50 p-1">
                            <TabsTrigger value="react" className="gap-2 data-[state=active]:bg-background">
                                <FileCode className="w-4 h-4" />
                                React Component
                            </TabsTrigger>
                            <TabsTrigger value="css" className="gap-2 data-[state=active]:bg-background">
                                <FileJson className="w-4 h-4" />
                                Custom CSS
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="react" className="flex-1 min-h-0 m-0 p-0 relative group">
                        <ScrollArea className="h-full w-full bg-[#050505]">
                            <pre className="p-6 text-[13px] font-mono leading-relaxed text-blue-100/80 whitespace-pre">
                                {exportCode.react}
                            </pre>
                        </ScrollArea>
                        <div className="absolute top-4 right-4 group-hover:opacity-100 opacity-60 transition-opacity">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleCopy('react')}
                                className="bg-white/10 hover:bg-white/20 text-white border-white/5 backdrop-blur-md"
                            >
                                {copied === 'react' ? (
                                    <Check className="w-4 h-4 mr-2" />
                                ) : (
                                    <Copy className="w-4 h-4 mr-2" />
                                )}
                                {copied === 'react' ? 'Copied' : 'Copy Code'}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="css" className="flex-1 min-h-0 m-0 p-0 relative group">
                        <ScrollArea className="h-full w-full bg-[#050505]">
                            <pre className="p-6 text-[13px] font-mono leading-relaxed text-pink-100/80 whitespace-pre">
                                {exportCode.css}
                            </pre>
                        </ScrollArea>
                        <div className="absolute top-4 right-4 group-hover:opacity-100 opacity-60 transition-opacity">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleCopy('css')}
                                className="bg-white/10 hover:bg-white/20 text-white border-white/5 backdrop-blur-md"
                            >
                                {copied === 'css' ? (
                                    <Check className="w-4 h-4 mr-2" />
                                ) : (
                                    <Copy className="w-4 h-4 mr-2" />
                                )}
                                {copied === 'css' ? 'Copied' : 'Copy CSS'}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-medium">
                        Ensure <code className="text-primary font-bold">sonner</code> and <code className="text-primary font-bold">lucide-react</code> are installed.
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="font-bold uppercase tracking-widest text-[10px]">
                        Close Guide
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
