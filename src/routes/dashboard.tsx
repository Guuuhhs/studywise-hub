import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background/80 backdrop-blur-sm">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full h-9 rounded-lg bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">A</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
