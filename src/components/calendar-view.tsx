"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export function CalendarView() {
  const events = useQuery(api.calendarEvents.list);

  if (!events) {
    return <div className="skeleton h-96 rounded-2xl" />;
  }

  if (events.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No calendar events</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={event._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="glass-card rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-2 h-12 rounded-full bg-primary" />
          <div className="flex-1">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(event.startTime).toLocaleString()}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
