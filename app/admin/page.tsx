"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, Search, Filter, 
  MapPin, Clock, MoreHorizontal, Users, Cpu, Activity, Send
} from "lucide-react";
import { useIssues, IssueStatus, IssueEvent, Issue } from "@/app/hooks/useIssues";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminCommandCenter() {
  const { issues, loading, updateIssueStatus, updateIssueDepartment } = useIssues("super_admin");
  
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Derive global metrics
  const metrics = useMemo(() => {
    const total = issues.length;
    const critical = issues.filter(i => i.severity === "Critical").length;
    const resolved = issues.filter(i => i.status === "Resolved").length;
    const pendingAI = issues.filter(i => i.status === "Submitted").length;
    return { total, critical, resolved, pendingAI };
  }, [issues]);

  // Aggregate all events into a global live feed
  const globalActivityFeed = useMemo(() => {
    const allEvents: (IssueEvent & { issueId: string, complaintId: string, issueTitle: string })[] = [];
    issues.forEach(issue => {
      issue.events.forEach(event => {
        allEvents.push({
          ...event,
          issueId: issue.id,
          complaintId: issue.complaintId,
          issueTitle: issue.title
        });
      });
    });
    return allEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);
  }, [issues]);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchStatus = statusFilter === "All" || issue.status === statusFilter;
      const matchDept = deptFilter === "All" || issue.department === deptFilter;
      return matchStatus && matchDept;
    });
  }, [issues, statusFilter, deptFilter]);

  // Selection Logic
  const toggleSelection = (id: string) => {
    const next = new Set(selectedIssues);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIssues(next);
  };

  const toggleAll = () => {
    if (selectedIssues.size === filteredIssues.length) {
      setSelectedIssues(new Set());
    } else {
      setSelectedIssues(new Set(filteredIssues.map(i => i.id)));
    }
  };

  // Bulk Actions
  const handleBulkStatusUpdate = async (status: IssueStatus) => {
    if (selectedIssues.size === 0) return;
    setIsBulkUpdating(true);
    toast.loading(`Updating ${selectedIssues.size} issues...`, { id: "bulk" });
    
    try {
      for (const id of Array.from(selectedIssues)) {
        await updateIssueStatus(id, status, `Bulk updated by Super Admin.`);
      }
      toast.success("Bulk update successful!", { id: "bulk" });
      setSelectedIssues(new Set());
    } catch (e) {
      toast.error("Failed bulk update.", { id: "bulk" });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkReassign = async (department: string) => {
    if (selectedIssues.size === 0) return;
    setIsBulkUpdating(true);
    toast.loading(`Reassigning ${selectedIssues.size} issues...`, { id: "bulk" });
    
    try {
      for (const id of Array.from(selectedIssues)) {
        await updateIssueDepartment(id, department);
      }
      toast.success(`Issues routed to ${department}`, { id: "bulk" });
      setSelectedIssues(new Set());
    } catch (e) {
      toast.error("Failed reassignment.", { id: "bulk" });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Helper styles
  const getSeverityStyle = (severity: string | undefined) => {
    switch(severity) {
      case "Critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Low": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header & Metrics */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Global Command Center</h1>
          <p className="text-neutral-400">Enterprise issue management, global telemetry, and bulk administration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Total Issues", value: metrics.total, icon: Activity, color: "text-blue-400" },
          { name: "Critical Alerts", value: metrics.critical, icon: AlertTriangle, color: "text-red-400" },
          { name: "Pending AI Analysis", value: metrics.pendingAI, icon: Cpu, color: "text-purple-400" },
          { name: "Resolved Globally", value: metrics.resolved, icon: CheckCircle2, color: "text-emerald-400" },
        ].map((m, i) => (
          <motion.div key={m.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} 
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-neutral-400 mb-1">{m.name}</p>
              <h3 className="text-2xl font-bold text-white">{loading ? "-" : m.value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-white/[0.03] ${m.color}`}>
              <m.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Data Grid */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-neutral-400" />
                <select 
                  className="bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-300 py-1.5 px-3 focus:outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Analyzed">Analyzed</option>
                  <option value="Verified">Verified</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  className="bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-300 py-1.5 px-3 focus:outline-none"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Department of Transportation">Transportation</option>
                  <option value="Public Utilities">Public Utilities</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-neutral-500 flex items-center">
              {filteredIssues.length} results found
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-4 py-3 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIssues.size === filteredIssues.length && filteredIssues.length > 0}
                        onChange={toggleAll}
                        className="rounded border-neutral-700 bg-neutral-900 text-blue-500 focus:ring-blue-500/20"
                      />
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-neutral-400 uppercase">ID</th>
                    <th className="px-4 py-3 text-xs font-medium text-neutral-400 uppercase">Issue Details</th>
                    <th className="px-4 py-3 text-xs font-medium text-neutral-400 uppercase">Department</th>
                    <th className="px-4 py-3 text-xs font-medium text-neutral-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-neutral-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500 animate-pulse">Loading intelligence...</td></tr>
                  ) : filteredIssues.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">No issues match the current filters.</td></tr>
                  ) : (
                    filteredIssues.map((issue) => (
                      <tr key={issue.id} className={`hover:bg-white/[0.02] transition-colors ${selectedIssues.has(issue.id) ? 'bg-blue-500/5' : ''}`}>
                        <td className="px-4 py-4 text-center">
                          <input 
                            type="checkbox"
                            checked={selectedIssues.has(issue.id)}
                            onChange={() => toggleSelection(issue.id)}
                            className="rounded border-neutral-700 bg-neutral-900 text-blue-500 focus:ring-blue-500/20"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-mono text-xs text-neutral-500">{issue.complaintId}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{issue.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] border ${getSeverityStyle(issue.severity)}`}>
                                {issue.severity || 'Unrated'}
                              </span>
                              <span className="text-xs text-neutral-500">{issue.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-neutral-300">{issue.department || <span className="text-neutral-600 italic">Unassigned</span>}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-neutral-300 bg-neutral-900 px-2 py-1 rounded-md border border-neutral-800">
                            {issue.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link href={`/dashboard/issues/${issue.id}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                            Inspect
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Live Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl h-[600px] flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" /> Live Global Feed
              </h3>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {loading ? (
                <div className="text-center py-4 text-neutral-500 animate-pulse text-xs">Connecting to stream...</div>
              ) : globalActivityFeed.length === 0 ? (
                <div className="text-center py-4 text-neutral-500 text-xs">No activity yet.</div>
              ) : (
                globalActivityFeed.map((event, idx) => (
                  <motion.div 
                    key={`${event.issueId}-${idx}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-neutral-300">
                        <span className="font-semibold text-white">{event.actor}</span> updated <Link href={`/dashboard/issues/${event.issueId}`} className="text-blue-400 hover:underline">{event.complaintId}</Link> to <span className="text-neutral-100 font-medium">{event.status}</span>
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        {event.timestamp.toLocaleTimeString()} • {event.issueTitle}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Command Bar (Bulk Actions) */}
      <AnimatePresence>
        {selectedIssues.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 bg-neutral-900 border border-neutral-700 shadow-2xl shadow-black/50 rounded-2xl"
          >
            <div className="flex items-center gap-3 pr-4 border-r border-neutral-700">
              <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                {selectedIssues.size}
              </div>
              <span className="text-sm font-medium text-white">selected</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider mr-2">Route To:</span>
              <button disabled={isBulkUpdating} onClick={() => handleBulkReassign("Sanitation")} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-neutral-300 transition-colors">Sanitation</button>
              <button disabled={isBulkUpdating} onClick={() => handleBulkReassign("Department of Transportation")} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-neutral-300 transition-colors">Transportation</button>
            </div>

            <div className="flex items-center gap-2 border-l border-neutral-700 pl-4 ml-2">
              <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider mr-2">Mark As:</span>
              <button disabled={isBulkUpdating} onClick={() => handleBulkStatusUpdate("In Progress")} className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium transition-colors">In Progress</button>
              <button disabled={isBulkUpdating} onClick={() => handleBulkStatusUpdate("Resolved")} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium transition-colors">Resolved</button>
            </div>

            <button 
              onClick={() => setSelectedIssues(new Set())}
              className="ml-4 p-1.5 text-neutral-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
