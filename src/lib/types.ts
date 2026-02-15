export interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  level: "L1" | "L2" | "L3" | "L4";
  status: "active" | "idle" | "error";
  soul?: string;
  hasSoul?: boolean;
}

export interface Task {
  id: string;
  title: string;
  reasoning: string;
  nextAction: string;
  category: string;
  priority: "high" | "medium" | "low";
  effort: "quick" | "medium" | "large";
  status: "pending" | "approved" | "rejected";
}

export interface CronJob {
  name: string;
  schedule: string;
  status: "success" | "error";
  lastRun?: string;
  consecutiveErrors?: number;
}

export interface ContentDraft {
  id: string;
  title: string;
  platform: string;
  content: string;
  status: "draft" | "review" | "approved" | "published";
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  status: "prospect" | "contacted" | "meeting" | "proposal" | "active";
  contacts: string[];
  lastInteraction?: string;
  nextAction?: string;
}
