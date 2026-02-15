"use client";

import { CodePipeline } from "@/components/code-pipeline";

export default function CodePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Code</h1>
      <CodePipeline />
    </div>
  );
}
