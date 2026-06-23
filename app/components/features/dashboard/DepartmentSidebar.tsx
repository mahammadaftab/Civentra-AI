"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, 
  Inbox, 
  MapPin, 
  BarChart3, 
  Users,
  LogOut
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

const navItems = [
  { name: "Department Overview", href: "/department", icon: Building2 },
  { name: "Issue Queue", href: "/department/queue", icon: Inbox },
  { name: "Live Map", href: "/department/map", icon: MapPin },
  { name: "Analytics", href: "/department/analytics", icon: BarChart3 },
  { name: "Field Agents", href: "/department/agents", icon: Users },
];

export function DepartmentSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col w-64 h-screen bg-neutral-950/50 backdrop-blur-xl border-r border-white/5 sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Civentra AI
        </h1>
        <p className="text-xs text-blue-400 mt-1 uppercase tracking-wider font-bold">Dept. Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="dept-sidebar-active"
                  className="absolute inset-0 bg-blue-500/10 rounded-lg border border-blue-500/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-4 h-4 z-10 ${isActive ? "text-blue-400" : ""}`} />
              <span className="z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
