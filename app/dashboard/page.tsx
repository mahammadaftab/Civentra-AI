"use client";

import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";
import { useIssues } from "@/app/hooks/useIssues";

export default function DashboardHome() {
  const { issues, loading } = useIssues("citizen");
  
  // Calculate real-time stats
  const pendingCount = issues.filter(i => i.status === "Pending Verification").length;
  const analyzingCount = issues.filter(i => i.status === "Analyzing" || i.status === "Action Required").length;
  const resolvedCount = issues.filter(i => i.status === "Resolved").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Verification": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "Analyzing": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Action Required": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "Resolved": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      default: return "text-neutral-400 bg-neutral-400/10 border-neutral-400/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-neutral-400">Here's an overview of your civic contributions and local issues.</p>
        </div>
        <Link 
          href="/dashboard/report"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Report New Issue
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: loading ? "-" : issues.length.toString(), icon: MapPin, color: "text-blue-400" },
          { label: "Pending", value: loading ? "-" : pendingCount.toString(), icon: Clock, color: "text-amber-400" },
          { label: "AI Analyzing", value: loading ? "-" : analyzingCount.toString(), icon: TrendingUp, color: "text-purple-400" },
          { label: "Resolved", value: loading ? "-" : resolvedCount.toString(), icon: CheckCircle, color: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-neutral-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Your Recent Reports</h3>
            <Link href="/dashboard/issues" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-neutral-500 animate-pulse">Loading live data...</div>
            ) : issues.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">You haven't reported any issues yet.</div>
            ) : issues.slice(0, 4).map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <MapPin className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">{issue.title}</h4>
                    <p className="text-xs text-neutral-400 mt-1">{issue.location} • {issue.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Points Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Award className="w-32 h-32" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-medium text-white mb-2">Hero Points</h3>
            <p className="text-sm text-blue-200/70 mb-6">You're in the top 15% of civic contributors this month!</p>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-white">450</span>
              <span className="text-sm font-medium text-blue-400 mb-1">pts</span>
            </div>
            
            <div className="w-full bg-black/40 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-[45%]" />
            </div>
            <p className="text-xs text-neutral-400 text-right">550 pts to Next Level</p>
            
            <Link 
              href="/dashboard/rewards"
              className="mt-6 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
            >
              View Rewards
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
