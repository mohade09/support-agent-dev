import { createFileRoute } from "@tanstack/react-router";
import { AgentWorkspace } from "@/components/voltway/agent-workspace";

export const Route = createFileRoute("/agent")({
  component: () => <AgentWorkspace scenarioKey="refund" showTranscript />,
});
