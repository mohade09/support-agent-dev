import { ThemeProvider } from "@/components/apx/theme-provider";
import { AppSidebar } from "@/components/apx/app-sidebar";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="apx-ui-theme">
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
      <Toaster richColors />
    </ThemeProvider>
  ),
});
