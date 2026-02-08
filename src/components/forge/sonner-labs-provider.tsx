"use client";

import React, { createContext, useContext } from "react";
import { useSonnerLabs } from "@/hooks/use-sonner-labs";

type SonnerLabsContextValue = ReturnType<typeof useSonnerLabs>;

const SonnerLabsContext = createContext<SonnerLabsContextValue | null>(null);

export function SonnerLabsProvider({ children }: { children: React.ReactNode }) {
  const value = useSonnerLabs();

  return (
    <SonnerLabsContext.Provider value={value}>
      {children}
    </SonnerLabsContext.Provider>
  );
}

export function useSonnerLabsContext() {
  const context = useContext(SonnerLabsContext);
  if (!context) {
    throw new Error("useSonnerLabsContext must be used within SonnerLabsProvider");
  }
  return context;
}
