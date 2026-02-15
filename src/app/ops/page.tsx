"use client";

import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { OpsView } from "@/components/ops-view";
import { SuggestedTasksView } from "@/components/suggested-tasks-view";
import { CalendarView } from "@/components/calendar-view";

const tabs = [
  { id: "operations", label: "Operations" },
  { id: "tasks", label: "Tasks" },
  { id: "calendar", label: "Calendar" },
];

export default function OpsPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "operations";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Operations</h1>
        <TabBar tabs={tabs} />
      </div>

      {activeTab === "operations" && <OpsView />}
      {activeTab === "tasks" && <SuggestedTasksView />}
      {activeTab === "calendar" && <CalendarView />}
    </div>
  );
}
