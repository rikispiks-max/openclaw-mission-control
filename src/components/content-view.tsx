"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export function ContentView() {
  const drafts = useQuery(api.contentDrafts.list);

  if (!drafts) {
    return <div className="skeleton h-96 rounded-2xl" />;
  }

  const grouped = {
    draft: drafts.filter(d => d.status === "draft"),
    review: drafts.filter(d => d.status === "review"),
    approved: drafts.filter(d => d.status === "approved"),
    published: drafts.filter(d => d.status === "published"),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {(Object.keys(grouped) as Array<keyof typeof grouped>).map((status) => (
        <div key={status} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold capitalize">{status}</h3>
            <span className="text-xs text-muted-foreground">{grouped[status].length}</span>
          </div>

          <div className="space-y-2">
            {grouped[status].map((draft, index) => (
              <motion.div
                key={draft._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-start gap-3 mb-2">
                  <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{draft.title}</h4>
                    <p className="text-xs text-muted-foreground">{draft.platform}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{draft.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
