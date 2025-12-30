'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { useLayout } from "@/context/LayoutContext";
import { cn } from "@/lib/utils";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useLayout();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out h-screen",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}