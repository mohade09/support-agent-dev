import { createFileRoute } from "@tanstack/react-router";
import { SupervisorView } from "@/components/voltway/supervisor-view";

export const Route = createFileRoute("/supervisor")({
  component: () => <SupervisorView defaultTab="perf" />,
});
