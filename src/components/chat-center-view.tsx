"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, Mic, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ChatCenterView() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/chat-history")
      .then(r => r.json())
      .then(data => setSessions(data.sessions || []));
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    await fetch("/api/chat-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, channel: "webchat" }),
    });

    setMessage("");
    // Refresh sessions
    fetch("/api/chat-history")
      .then(r => r.json())
      .then(data => setSessions(data.sessions || []));
  };

  const currentSession = sessions.find(s => s.id === selectedSession);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
      {/* Sessions Sidebar */}
      <div className="lg:col-span-1 glass-card rounded-2xl p-4 overflow-y-auto scrollbar-custom">
        <h3 className="text-sm font-semibold mb-3">Sessions</h3>
        <div className="space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setSelectedSession(session.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedSession === session.id
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-white/[0.03] hover:bg-white/[0.05]"
              }`}
            >
              <p className="text-sm font-medium truncate">{session.filename}</p>
              <p className="text-xs text-muted-foreground">
                {session.messages.length} messages
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 glass-card rounded-2xl p-6 flex flex-col">
        {!selectedSession ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Select a session to view messages</p>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-custom mb-4 space-y-3">
              {currentSession?.messages.map((msg: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-xl ${
                      msg.role === "user"
                        ? "bg-primary/20 text-foreground"
                        : "bg-white/[0.03] text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.timestamp && (
                      <p className="text-2xs mt-1 opacity-60">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl glass-card border-0 focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                className="p-3 rounded-xl bg-primary hover:bg-primary/80 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl glass-card hover:bg-white/[0.05] transition-colors">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
