"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Activity, 
  Globe2, 
  ServerCog, 
  UsersRound, 
  ShieldAlert,
  LogOut,
  MapPin
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

const navItems = [
  { name: "Global Intelligence", href: "/admin", icon: Globe2 },
  { name: "Geo Map", href: "/admin/map", icon: MapPin },
  { name: "Agent Health", href: "/admin/agents", icon: Activity },
  { name: "Departments", href: "/admin/departments", icon: ServerCog },
  { name: "User Management", href: "/admin/users", icon: UsersRound },
  { name: "Security Audit", href: "/admin/security", icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col w-64 h-screen bg-neutral-950/50 backdrop-blur-xl border-r border-white/5 sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
          Civentra AI
        </h1>
        <p className="text-xs text-red-400 mt-1 uppercase tracking-wider font-bold">Super Admin</p>
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
                  layoutId="admin-sidebar-active"
                  className="absolute inset-0 bg-red-500/10 rounded-lg border border-red-500/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-4 h-4 z-10 ${isActive ? "text-red-400" : ""}`} />
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
