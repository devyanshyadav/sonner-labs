"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { flushSync } from 'react-dom';

const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const ref = React.useRef<HTMLButtonElement>(null);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="size-9" />;

    const isDark = resolvedTheme === 'dark';

    const toggleTheme = async (e: React.MouseEvent) => {
        const newTheme = isDark ? "light" : "dark";

        if (!(document as any).startViewTransition) {
            setTheme(newTheme);
            return;
        }

        const transition = (document as any).startViewTransition(async () => {
            flushSync(() => {
                setTheme(newTheme);
            });
        });
    };

    return (
        <button
            ref={ref}
            onClick={toggleTheme}
            className="group relative flex items-center justify-center size-9"
        >
            <span className="absolute inset-0 bg-primary/10 rounded-sm scale-0 group-hover:scale-100 transition-transform duration-200" />
            <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-muted-foreground/30 group-hover:border-primary transition-colors duration-300" />
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-muted-foreground/30 group-hover:border-primary transition-colors duration-300" />

            <div
            >
                {isDark ? <Moon size={18} className="text-primary fill-primary/20" /> : <Sun size={18} className="text-orange-500 fill-orange-500/20" />}
            </div>
        </button>
    );
};

export default ThemeToggle;