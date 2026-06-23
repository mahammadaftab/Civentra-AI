"use client";

import { motion } from "framer-motion";
import { Activity, Brain, CheckCircle, Database, Eye, ShieldCheck, Cpu, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

const agents = [
  {
    name: "Vision Routing Agent",
    description: "Analyzes images, categorizes issues, and routes to appropriate departments.",
    model: "gemini-1.5-flash",
    icon: Eye,
    status: "Operational",
    latency: "840ms",
    invocations: 142
  },
  {
    name: "Duplicate Detection Agent",
    description: "Uses spatial awareness and visual similarity to block redundant reports.",
    model: "gemini-1.5-flash + Haversine",
    icon: Database,
    status: "Operational",
    latency: "620ms",
    invocations: 98
  },
  {
    name: "Severity Agent",
    description: "Performs deep risk analysis to assign 0-100 severity scores.",
    model: "gemini-1.5-pro",
    icon: ShieldCheck,
    status: "Operational",
    latency: "1.2s",
    invocations: 45
  },
  {
    name: "Community Verification Agent",
    description: "Calculates mathematical consensus from nearby citizen reports.",
    model: "Logic Engine",
    icon: CheckCircle,
    status: "Operational",
    latency: "45ms",
    invocations: 312
  },
  {
    name: "Predictive Intelligence Agent",
    description: "Forecasts future infrastructure hotspots based on historical decay.",
    model: "gemini-1.5-flash",
    icon: Brain,
    status: "Operational",
    latency: "2.4s",
    invocations: 12
  },
  {
    name: "Resolution Verification Agent",
    description: "Acts as a strict City Inspector comparing Before/After photos.",
    model: "gemini-1.5-flash",
    icon: Cpu,
    status: "Operational",
    latency: "1.8s",
    invocations: 27
  }
];

export default function AgentHealthDashboard() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            Agent Health Command
          </h1>
          <p className="text-neutral-400">Real-time telemetry for the Civentra AI Multi-Agent Workforce.</p>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
          <RefreshCw className={`w-4 h-4 ${pulse ? 'text-blue-400' : 'text-neutral-400'}`} />
          Live Sync Active
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors"
          >
            {/* Glowing orb effect */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transition-opacity ${pulse ? 'opacity-100' : 'opacity-50'}`} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <agent.icon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex flex-col items-end">
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  {agent.status}
                </span>
                <span className="text-[10px] text-neutral-500 mt-1 font-mono">{agent.model}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 relative z-10">{agent.name}</h3>
            <p className="text-sm text-neutral-400 mb-6 min-h-[40px] relative z-10">{agent.description}</p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 relative z-10">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">Avg Latency</span>
                <span className="font-mono text-sm text-white">{agent.latency}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">Invocations (24h)</span>
                <span className="font-mono text-sm text-white">{agent.invocations}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
