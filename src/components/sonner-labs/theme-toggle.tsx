"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { flushSync } from 'react-dom';
import { Button } from "../ui/button";

const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const ref = React.useRef<HTMLButtonElement>(null);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="size-9" />;

    const isDark = resolvedTheme === 'dark';

    const toggleTheme = async (e: React.MouseEvent) => {
        const newTheme = isDark ? "light" : "dark";

        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        document.startViewTransition(async () => {
            flushSync(() => {
                setTheme(newTheme);
            });
        });
    };

    return (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            onClick={toggleTheme}

        >

            {isDark ? <Moon size={18} className="text-primary fill-primary/20" /> : <Sun size={18} className="text-orange-500 fill-orange-500/20" />}
        </Button>
    );
};

export default ThemeToggle;