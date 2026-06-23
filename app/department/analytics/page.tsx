"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import Link from "next/link";

export default function DepartmentAnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl"
      >
        <BarChart3 className="w-16 h-16 text-blue-500/50 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Department Analytics</h1>
        <p className="text-neutral-400 max-w-md mx-auto mb-6">
          Detailed SLA performance metrics and resolution times are currently compiling.
        </p>
        <Link href="/department" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors">
          Return to Overview
        </Link>
      </motion.div>
    </div>
  );
}
