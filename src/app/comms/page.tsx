"use client";

import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { CommsView } from "@/components/comms-view";
import { CrmView } from "@/components/crm-view";

const tabs = [
  { id: "comms", label: "Comms" },
  { id: "crm", label: "CRM" },
];

export default function CommsPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "comms";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Communications</h1>
        <TabBar tabs={tabs} />
      </div>

      {activeTab === "comms" && <CommsView />}
      {activeTab === "crm" && <CrmView />}
    </div>
  );
}
