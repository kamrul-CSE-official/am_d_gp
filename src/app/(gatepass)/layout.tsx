"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-screen" suppressHydrationWarning>
          <SidebarTrigger />
          <ThemeToggle />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
};

export default layout;
