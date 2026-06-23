"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, ShieldCheck, Activity, Search, AlertTriangle } from "lucide-react";
import { IssueEvent, IssueStatus } from "@/app/hooks/useIssues";

interface TimelineProps {
  events: IssueEvent[];
}

const getStatusIcon = (status: IssueStatus) => {
  switch (status) {
    case "Submitted": return <Clock className="w-5 h-5 text-blue-400" />;
    case "Analyzed": return <Activity className="w-5 h-5 text-purple-400" />;
    case "Verified": return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    case "Assigned": return <Search className="w-5 h-5 text-amber-400" />;
    case "In Progress": return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    case "Resolved": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    default: return <Clock className="w-5 h-5 text-neutral-400" />;
  }
};

const getStatusColor = (status: IssueStatus) => {
  switch (status) {
    case "Submitted": return "bg-blue-500/20 border-blue-500/30";
    case "Analyzed": return "bg-purple-500/20 border-purple-500/30";
    case "Verified": return "bg-emerald-500/20 border-emerald-500/30";
    case "Assigned": return "bg-amber-500/20 border-amber-500/30";
    case "In Progress": return "bg-orange-500/20 border-orange-500/30";
    case "Resolved": return "bg-emerald-500/20 border-emerald-500/30";
    default: return "bg-neutral-500/20 border-neutral-500/30";
  }
};

export default function Timeline({ events }: TimelineProps) {
  // Sort events by timestamp ascending (oldest first, newest at bottom)
  const sortedEvents = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
      {sortedEvents.map((event, index) => {
        const isLast = index === sortedEvents.length - 1;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative flex items-start gap-6"
          >
            {/* Timeline Line Connector for active state */}
            {isLast && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                className="absolute left-4 top-10 bottom-0 w-0.5 bg-blue-500/50 -z-10"
              />
            )}

            {/* Icon Node */}
            <div className={`relative z-10 shrink-0 w-10 h-10 rounded-full border flex items-center justify-center ${getStatusColor(event.status)} ${isLast ? 'ring-4 ring-white/5' : ''}`}>
              {getStatusIcon(event.status)}
              
              {/* Pulse effect for current active stage */}
              {isLast && event.status !== "Resolved" && (
                <span className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
              )}
            </div>

            {/* Content Box */}
            <div className={`flex-1 rounded-2xl p-5 border ${isLast ? 'bg-white/[0.04] border-white/10 shadow-lg' : 'bg-white/[0.01] border-white/5'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h4 className={`font-semibold ${isLast ? 'text-white' : 'text-neutral-300'}`}>
                  {event.status}
                </h4>
                <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">
                  {event.timestamp.toLocaleString(undefined, { 
                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                  })}
                </span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {event.description}
              </p>
              {event.actor && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-neutral-500">
                  <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[10px]">
                    {event.actor.charAt(0)}
                  </div>
                  Updated by {event.actor}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
