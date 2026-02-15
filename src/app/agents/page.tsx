"use client";

import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { AgentsView } from "@/components/agents-view";
import { ModelsView } from "@/components/models-view";

const tabs = [
  { id: "agents", label: "Agents" },
  { id: "models", label: "Models" },
];

export default function AgentsPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "agents";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Agents</h1>
        <TabBar tabs={tabs} />
      </div>

      {activeTab === "agents" && <AgentsView />}
      {activeTab === "models" && <ModelsView />}
    </div>
  );
}
