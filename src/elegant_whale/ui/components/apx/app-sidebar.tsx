import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3Icon,
  HeadsetIcon,
  SettingsIcon,
  LifeBuoyIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/apx/logo";
import { ModeToggle } from "@/components/apx/mode-toggle";

const navItems = [
  { to: "/agent", icon: HeadsetIcon, label: "Agent workspace" },
  { to: "/supervisor", icon: BarChart3Icon, label: "Supervisor" },
];

const bottomItems = [
  { to: "/", icon: SettingsIcon, label: "Settings" },
  { to: "/", icon: LifeBuoyIcon, label: "Support" },
];

export function AppSidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r bg-card">
      {/* Brand */}
      <div className="px-5 py-5">
        <Logo to="/" subtitle="Support AI" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[color:var(--color-databricks)]/10 text-[color:var(--color-databricks)]"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-3 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        {/* Theme toggle */}
        <div className="mt-2 flex items-center justify-between rounded-lg border bg-background/50 px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            Appearance
          </span>
          <ModeToggle />
        </div>
      </div>
    </aside>
  );
}
