"use client";

import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { KnowledgeBase } from "@/components/knowledge-base";
import { EcosystemView } from "@/components/ecosystem-view";

const tabs = [
  { id: "knowledge", label: "Knowledge" },
  { id: "ecosystem", label: "Ecosystem" },
];

export default function KnowledgePage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "knowledge";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Knowledge</h1>
        <TabBar tabs={tabs} />
      </div>

      {activeTab === "knowledge" && <KnowledgeBase />}
      {activeTab === "ecosystem" && <EcosystemView />}
    </div>
  );
}
