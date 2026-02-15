"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Home, 
  Activity, 
  Bot, 
  MessageSquare, 
  FileText, 
  Mail, 
  Database, 
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ops", label: "Ops", icon: Activity },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/comms", label: "Comms", icon: Mail },
  { href: "/knowledge", label: "Knowledge", icon: Database },
  { href: "/code", label: "Code", icon: Code },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b px-3 py-2 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg">🚀</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-sm font-bold">OpenClaw</h1>
              <p className="text-2xs text-muted-foreground">Mission Control</p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-1 justify-center max-w-3xl mx-4">
          <div className="flex items-center gap-1 w-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg transition-colors relative",
                    "text-2xs md:text-xs font-medium",
                    isActive
                      ? "text-primary bg-primary/[0.06]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-2xs font-medium text-success hidden md:inline">LIVE</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
