"use client";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import Link from "next/link";

export default function DepartmentQueuePage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl"
      >
        <Inbox className="w-16 h-16 text-blue-500/50 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Issue Queue</h1>
        <p className="text-neutral-400 max-w-md mx-auto mb-6">
          The dedicated queue view is currently being integrated with the new AI routing engine.
        </p>
        <Link href="/department" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors">
          Return to Overview
        </Link>
      </motion.div>
    </div>
  );
}
