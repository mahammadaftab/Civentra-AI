"use client";

import { motion } from "framer-motion";
import { Inbox, Clock, CheckCircle, TrendingDown, AlertTriangle, MapPin } from "lucide-react";
import { useIssues } from "@/app/hooks/useIssues";

export default function DepartmentOverview() {
  const { issues, loading } = useIssues("department_admin");

  // Calculate live stats
  const pendingCount = issues.filter(i => i.status === "Pending Verification").length;
  const criticalCount = issues.filter(i => i.severity === "Critical").length;
  const resolvedCount = issues.filter(i => i.status === "Resolved").length;

  const stats = [
    { name: "Unassigned Issues", value: loading ? "-" : pendingCount.toString(), icon: Inbox, color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Critical Priority", value: loading ? "-" : criticalCount.toString(), icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
    { name: "Avg Resolution Time", value: "2.4 Days", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { name: "Resolved This Month", value: loading ? "-" : resolvedCount.toString(), icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Department Overview</h1>
        <p className="text-neutral-400">Manage incoming civic issues and monitor your department's resolution metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-neutral-400">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Action Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">AI-Prioritized Queue</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-neutral-500 animate-pulse">Loading live queue...</div>
            ) : issues.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">Queue is currently empty.</div>
            ) : issues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                <div className={`w-2 h-2 rounded-full ${issue.severity === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{issue.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-neutral-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {issue.location}</span>
                    <span className="text-xs text-neutral-500">Status: {issue.status}</span>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-sm text-white transition-colors">
                  Assign Crew
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-blue-900/20 border border-blue-500/20">
            <h3 className="text-lg font-medium text-white mb-2">AI Insight</h3>
            {issues.length > 0 ? (
              <>
                <p className="text-sm text-blue-200/70 mb-4">
                  We've detected {pendingCount} new issues in the last 24 hours. Consider deploying an extra repair unit.
                </p>
                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  Apply Recommendation <TrendingDown className="w-4 h-4" />
                </button>
              </>
            ) : (
              <p className="text-sm text-blue-200/70 mb-4">
                Not enough live data to generate AI insights. Waiting for citizen reports...
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
