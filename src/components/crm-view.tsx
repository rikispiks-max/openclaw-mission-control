"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import type { Client } from "@/lib/types";

export function CrmView() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then(r => r.json())
      .then(data => setClients(data.clients || []));
  }, []);

  const stages = ["prospect", "contacted", "meeting", "proposal", "active"] as const;
  const grouped = stages.reduce((acc, stage) => {
    acc[stage] = clients.filter(c => c.status === stage);
    return acc;
  }, {} as Record<typeof stages[number], Client[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stages.map((stage) => (
        <div key={stage} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold capitalize">{stage}</h3>
            <span className="text-xs text-muted-foreground">{grouped[stage].length}</span>
          </div>

          <div className="space-y-2">
            {grouped[stage].map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-start gap-3 mb-2">
                  <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{client.name}</h4>
                    {client.lastInteraction && (
                      <p className="text-xs text-muted-foreground">{client.lastInteraction}</p>
                    )}
                  </div>
                </div>
                {client.nextAction && (
                  <p className="text-xs text-muted-foreground">→ {client.nextAction}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
