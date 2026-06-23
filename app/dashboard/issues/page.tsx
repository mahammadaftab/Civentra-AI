"use client";

import { motion } from "framer-motion";
import { Search, Filter, MapPin, Clock, AlertCircle } from "lucide-react";
import { useIssues } from "@/app/hooks/useIssues";
import Link from "next/link";

export default function IssueTracking() {
  const { issues, loading } = useIssues("citizen");

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "Pending Verification": return "text-amber-400 border-amber-400/20 bg-amber-400/10";
      case "Analyzing": return "text-blue-400 border-blue-400/20 bg-blue-400/10";
      case "Action Required": return "text-orange-400 border-orange-400/20 bg-orange-400/10";
      case "Resolved": return "text-emerald-400 border-emerald-400/20 bg-emerald-400/10";
      default: return "text-neutral-400 border-neutral-400/20 bg-neutral-400/10";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Issue Tracking</h1>
          <p className="text-neutral-400">Monitor the real-time status of your reported civic issues.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <button className="p-2 bg-white/[0.02] border border-white/5 rounded-xl text-neutral-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-neutral-400">
                <th className="px-6 py-4">Issue Details</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Date Reported</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500 animate-pulse">
                    Loading your reports...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    You haven't reported any issues yet.
                  </td>
                </tr>
              ) : issues.map((issue) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={issue.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                      {issue.title}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">ID: {issue.id.slice(0, 8).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {issue.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {issue.createdAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyle(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/dashboard/issues/${issue.id}`}
                      className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                    >
                      View Details
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
