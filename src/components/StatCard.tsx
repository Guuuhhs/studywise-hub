import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "primary" | "success" | "xp" | "warning";
}

const variantStyles = {
  default: "bg-card border-border",
  primary: "bg-card border-primary/20",
  success: "bg-card border-success/20",
  xp: "bg-card border-xp/20",
  warning: "bg-card border-warning/20",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  xp: "bg-xp/10 text-xp",
  warning: "bg-warning/10 text-warning",
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 animate-scale-in ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconVariantStyles[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend.positive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-card-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{title}</div>
      {subtitle && <div className="text-[10px] text-muted-foreground/70 mt-0.5">{subtitle}</div>}
    </div>
  );
}
