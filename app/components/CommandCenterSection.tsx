"use client";

import { motion } from "framer-motion";
import { Activity, Map as MapIcon, List, PieChart, Users } from "lucide-react";

export default function CommandCenterSection() {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden" id="dashboard">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Interactive <span className="text-gradient">Command Center</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-5xl mx-auto rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-[0_0_50px_rgba(0,114,255,0.1)]"
        >
          {/* Mac-like Header */}
          <div className="h-10 border-b border-white/10 bg-[#111] flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="mx-auto text-xs text-gray-500 font-medium">admin.civentra.ai</div>
          </div>

          <div className="flex h-[600px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 bg-[#0F0F0F] p-4 hidden md:block">
              <div className="text-sm font-semibold text-gray-400 mb-4 px-2">Views</div>
              <div className="space-y-1">
                {[
                  { icon: MapIcon, label: "Live Heatmap", active: true },
                  { icon: Activity, label: "Agent Activity", active: false },
                  { icon: List, label: "Open Issues", active: false },
                  { icon: PieChart, label: "Metrics", active: false },
                  { icon: Users, label: "Community", active: false },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm cursor-pointer ${item.active ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 flex flex-col bg-[#050505] relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 z-10">
                <h3 className="text-xl font-semibold">Live Civic Heatmap</h3>
                <div className="flex gap-2">
                  <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">Last 24h</div>
                  <div className="px-3 py-1 rounded-md bg-brand-blue text-white text-xs font-medium">Export Report</div>
                </div>
              </div>

              {/* Mockup Map Area */}
              <div className="flex-1 rounded-lg border border-white/10 bg-[#111] relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                {/* Fake Hotspots */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-2/3 w-48 h-48 bg-brand-blue/20 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                {/* Overlay UI elements */}
                <div className="absolute bottom-4 left-4 p-4 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                  <div className="text-sm font-medium mb-2">Severity Breakdown</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-red-500"></div> High (12)</div>
                    <div className="flex items-center gap-2 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Medium (34)</div>
                    <div className="flex items-center gap-2 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-green-500"></div> Low (89)</div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 w-64 p-4 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 hidden lg:block">
                  <div className="text-sm font-medium mb-3 flex items-center justify-between">
                    Agent Activity <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-gray-400">
                      <span className="text-brand-blue">Vision Agent</span> identified pothole at Main St.
                    </div>
                    <div className="text-xs text-gray-400">
                      <span className="text-brand-purple">Severity Agent</span> upgraded ticket #402.
                    </div>
                    <div className="text-xs text-gray-400">
                      <span className="text-brand-cyan">Verification Agent</span> merged 3 duplicate reports.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
