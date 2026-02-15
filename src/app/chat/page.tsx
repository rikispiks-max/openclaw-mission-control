"use client";

import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { ChatCenterView } from "@/components/chat-center-view";
import { CommandView } from "@/components/command-view";

const tabs = [
  { id: "chat", label: "Chat" },
  { id: "command", label: "Command" },
];

export default function ChatPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "chat";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Chat</h1>
        <TabBar tabs={tabs} />
      </div>

      {activeTab === "chat" && <ChatCenterView />}
      {activeTab === "command" && <CommandView />}
    </div>
  );
}
