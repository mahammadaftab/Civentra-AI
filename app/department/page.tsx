"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Clock, CheckCircle, TrendingDown, AlertTriangle, MapPin, HardHat, ChevronDown } from "lucide-react";
import { useIssues } from "@/app/hooks/useIssues";
import Link from "next/link";

export default function DepartmentOverview() {
  const { issues, loading, updateIssueStatus } = useIssues("department_admin");
  const [selectedDept, setSelectedDept] = useState("Roads");
  const departments = ["Roads", "Water", "Electrical", "Sanitation", "Parks"];

  const deptIssues = issues.filter(i => i.department === selectedDept);

  // Calculate live stats for the selected department
  const pendingCount = deptIssues.filter(i => !["Resolved", "In Progress"].includes(i.status)).length;
  const criticalCount = deptIssues.filter(i => i.severity === "Critical").length;
  const resolvedCount = deptIssues.filter(i => i.status === "Resolved").length;

  const stats = [
    { name: "Unassigned Issues", value: loading ? "-" : pendingCount.toString(), icon: Inbox, color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Critical Priority", value: loading ? "-" : criticalCount.toString(), icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
    { name: "Avg Resolution Time", value: "2.4 Days", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { name: "Resolved This Month", value: loading ? "-" : resolvedCount.toString(), icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Department Command Center</h1>
          <p className="text-neutral-400">Manage incoming civic issues and coordinate repair crews.</p>
        </div>
        <div className="relative">
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="appearance-none bg-blue-600 hover:bg-blue-500 text-white font-medium pl-6 pr-12 py-3 rounded-xl border border-blue-400/30 focus:outline-none transition-colors cursor-pointer"
          >
            {departments.map(d => <option key={d} value={d}>{d} Department</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        </div>
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
        {/* Queues Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Unassigned Action Queue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2"><Inbox className="w-5 h-5 text-blue-400"/> Unassigned Queue</h3>
              <span className="px-2.5 py-1 bg-white/5 rounded-lg text-xs font-medium text-neutral-300">{deptIssues.filter(i => !["Resolved", "In Progress"].includes(i.status)).length} Pending</span>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-neutral-500 animate-pulse">Loading live queue...</div>
              ) : deptIssues.filter(i => !["Resolved", "In Progress"].includes(i.status)).length === 0 ? (
                <div className="text-center py-8 text-neutral-500">Queue is currently empty. Great job!</div>
              ) : deptIssues.filter(i => !["Resolved", "In Progress"].includes(i.status)).map((issue) => (
                <div key={issue.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${issue.severity === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <div className="flex-1">
                    <Link href={`/dashboard/issues/${issue.id}`} className="text-sm font-medium text-white hover:text-blue-400 transition-colors">{issue.title}</Link>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-neutral-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {issue.location}</span>
                      <span className="text-xs text-neutral-500">Confidence: {(issue.confidence || 0) * 100}%</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateIssueStatus && updateIssueStatus(issue.id, "In Progress", "Crew dispatched to location.")}
                    className="px-4 py-2 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-colors"
                  >
                    Assign Crew
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Active Workflow Queue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2"><HardHat className="w-5 h-5 text-emerald-400"/> Active Workflow</h3>
            </div>
            
            <div className="space-y-4">
              {deptIssues.filter(i => i.status === "In Progress").length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No active work orders.</div>
              ) : deptIssues.filter(i => i.status === "In Progress").map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div>
                    <Link href={`/dashboard/issues/${issue.id}`} className="text-sm font-medium text-emerald-100 hover:text-emerald-300">{issue.title}</Link>
                    <p className="text-xs text-emerald-400/60 mt-1">Crew currently on site</p>
                  </div>
                  <button 
                    onClick={() => updateIssueStatus && updateIssueStatus(issue.id, "Resolved", "Issue resolved and validated by crew.")}
                    className="px-4 py-2 shrink-0 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium text-white transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark Resolved
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-blue-900/20 border border-blue-500/20">
            <h3 className="text-lg font-medium text-white mb-2">AI Routing Insight</h3>
            {deptIssues.length > 0 ? (
              <>
                <p className="text-sm text-blue-200/70 mb-4">
                  The Vision AI has intelligently routed {pendingCount} new issues to the {selectedDept} queue. Priority sorting is active.
                </p>
                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  Optimize Routes <TrendingDown className="w-4 h-4" />
                </button>
              </>
            ) : (
              <p className="text-sm text-blue-200/70 mb-4">
                Not enough live data to generate AI insights for this department.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
