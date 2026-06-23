"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { usePathname } from "next/navigation";

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  const getPageTitle = () => {
    switch(pathname) {
      case "/dashboard": return "Overview";
      case "/dashboard/report": return "Report an Issue";
      case "/dashboard/issues": return "Issue Tracking";
      case "/dashboard/verify": return "Community Verification";
      case "/dashboard/rewards": return "Hero Points";
      case "/dashboard/reports": return "Downloaded Reports";
      default: return "Dashboard";
    }
  };

  return (
    <header className="h-16 border-b border-white/5 bg-neutral-950/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
      <div>
        <h2 className="text-lg font-medium text-white">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-neutral-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.displayName || "Citizen"}</p>
            <p className="text-xs text-blue-400 capitalize">{user?.role?.replace("_", " ")}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
            {user?.displayName?.charAt(0) || "C"}
          </div>
        </div>
      </div>
    </header>
  );
}
