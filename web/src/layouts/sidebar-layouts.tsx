"use client";
import { createContext, ReactNode, useCallback, useContext } from "react";
import { cn } from "@/lib/utils";
import useScreenSize from "@/hooks/useScreenSize";
import { useAppSidebarContext } from "@/providers/AppSidebarProvider";

interface SidebarLayoutContext {
  folded: boolean;
  onFoldClick: () => void;
}

const SidebarLayoutContext = createContext<SidebarLayoutContext | null>(null);

/**
 * Returns sidebar props adapted for mobile vs desktop.
 * Must be called inside a `<Sidebar>` component.
 *
 * On mobile, `folded` is always false (the overlay handles visibility)
 * and `onFoldClick` closes the overlay.
 * On desktop, `folded` reflects actual state and `onFoldClick` toggles it.
 */
function useSidebarLayout() {
  const ctx = useContext(SidebarLayoutContext);
  if (!ctx) {
    throw new Error("useSidebarLayout must be used within a <Sidebar>");
  }
  return ctx;
}

interface SidebarProps {
  children: ReactNode;
}

/**
 * Responsive sidebar wrapper.
 * On mobile: renders as a slide-in overlay with backdrop.
 * On desktop: renders children inline.
 *
 * Provides `useSidebarLayout()` to descendants.
 */
function Sidebar({ children }: SidebarProps) {
  const { folded, setFolded } = useAppSidebarContext();
  const { isMobile } = useScreenSize();

  const onFoldClick = useCallback(() => {
    if (isMobile) {
      setFolded(true);
    } else {
      setFolded((prev) => !prev);
    }
  }, [isMobile, setFolded]);

  const value: SidebarLayoutContext = {
    folded: isMobile ? false : folded,
    onFoldClick,
  };

  if (!isMobile) {
    return (
      <SidebarLayoutContext.Provider value={value}>
        {children}
      </SidebarLayoutContext.Provider>
    );
  }

  return (
    <SidebarLayoutContext.Provider value={value}>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200",
          folded ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {children}
      </div>

      {/* Backdrop to close the sidebar when clicking outside */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-mask-03 backdrop-blur-03 transition-opacity duration-200",
          folded
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        )}
        onClick={() => setFolded(true)}
      />
    </SidebarLayoutContext.Provider>
  );
}

export { Sidebar, useSidebarLayout };
