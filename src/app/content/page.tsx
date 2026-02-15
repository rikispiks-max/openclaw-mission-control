"use client";

import { ContentView } from "@/components/content-view";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Content</h1>
      <ContentView />
    </div>
  );
}
