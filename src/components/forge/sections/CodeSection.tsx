
"use client";

import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Code } from 'lucide-react';
import { useToastForgeContext } from '@/components/forge/ToastForgeProvider';

export const CodeSection: React.FC = () => {
    const { exportCode } = useToastForgeContext();
    const handleCopy = () => {
        navigator.clipboard.writeText(exportCode.react);
        toast.success('Configuration Copied!', {
            description: 'You can now paste this into your project.',
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="relative group overflow-hidden">
                <Card>
                    <CardContent>
                        <div className="relative">
                            <div className="h-[450px] w-full p-4">
                                <ScrollArea className="h-full">
                                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                                        {exportCode.react}
                                    </pre>
                                </ScrollArea>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <Button
                                    variant="secondary"
                                    size="icon-sm"
                                    onClick={handleCopy}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Button
                onClick={handleCopy}
                size="lg"
                className="w-full"
            >
                <span className="flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copy Full Implementation
                </span>
            </Button>

            <Card>
                <CardContent>
                    <div className="flex items-center gap-3 text-left py-4">
                        <Code className="w-5 h-5 text-primary shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            Ensure <code className="text-foreground font-semibold">sonner</code> and <code className="text-foreground font-semibold">lucide-react</code> are in your dependencies.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
