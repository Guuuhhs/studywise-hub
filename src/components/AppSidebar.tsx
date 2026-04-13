import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Calendar,
  MessageSquare,
  Shield,
  Trophy,
  Settings,
  LogOut,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { title: "Turmas", to: "/dashboard/classes", icon: Users },
  { title: "Biblioteca", to: "/dashboard/library", icon: BookOpen },
  { title: "Estudo", to: "/dashboard/study", icon: FileText },
  { title: "Calendário", to: "/dashboard/calendar", icon: Calendar },
  { title: "Chat IA", to: "/dashboard/chat", icon: MessageSquare },
  { title: "Gamificação", to: "/dashboard/gamification", icon: Trophy },
] as const;

const bottomItems = [
  { title: "Admin", to: "/dashboard/admin", icon: Shield },
  { title: "Configurações", to: "/dashboard/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-sidebar-foreground whitespace-nowrap animate-fade-in">
            StudyMind AI
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-sidebar-primary" : ""}`} />
              {!collapsed && <span className="whitespace-nowrap">{item.title}</span>}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="py-4 px-3 space-y-1 border-t border-sidebar-border">
        {bottomItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-sidebar-primary" : ""}`} />
              {!collapsed && <span className="whitespace-nowrap">{item.title}</span>}
            </Link>
          );
        })}

        {/* User */}
        <div className="flex items-center gap-3 px-3 h-10 mt-2">
          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-foreground">A</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-sidebar-foreground truncate">Aluno</div>
              <div className="text-[10px] text-muted-foreground truncate">aluno@studymind.ai</div>
            </div>
          )}
          {!collapsed && (
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
