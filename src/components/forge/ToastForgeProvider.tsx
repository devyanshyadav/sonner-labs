"use client";

import React, { createContext, useContext } from "react";
import { useToastForge } from "@/hooks/useToastForge";

type ToastForgeContextValue = ReturnType<typeof useToastForge>;

const ToastForgeContext = createContext<ToastForgeContextValue | null>(null);

export function ToastForgeProvider({ children }: { children: React.ReactNode }) {
  const value = useToastForge();

  return (
    <ToastForgeContext.Provider value={value}>
      {children}
    </ToastForgeContext.Provider>
  );
}

export function useToastForgeContext() {
  const context = useContext(ToastForgeContext);
  if (!context) {
    throw new Error("useToastForgeContext must be used within ToastForgeProvider");
  }
  return context;
}
