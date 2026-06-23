"use client";

import { motion } from "framer-motion";

export default function PanelsSection() {
  return (
    <section className="py-24 bg-brand-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Public Panel */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Citizen-First <span className="text-gradient">Public Panel</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              A frictionless mobile and desktop experience designed to empower communities. Report, track, and verify issues seamlessly.
            </p>
            <ul className="space-y-4">
              {[
                "Report Issues & Upload Images",
                "Track Complaints in Real-Time",
                "Verify Nearby Reports",
                "Earn Hero Points for Contributions",
                "Download AI Generated PDF Reports",
                "View Live Community Heatmaps"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] flex items-center justify-center"
          >
            {/* Desktop Mockup */}
            <div className="absolute right-0 top-10 w-4/5 h-64 bg-[#111] rounded-xl border border-white/10 shadow-2xl overflow-hidden glass-panel">
              <div className="h-8 border-b border-white/10 bg-[#0a0a0a] flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <div className="p-4 flex gap-4">
                <div className="w-1/3 h-32 rounded bg-white/5 animate-pulse"></div>
                <div className="w-2/3 h-40 rounded bg-white/5 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            
            {/* Mobile Mockup */}
            <div className="absolute left-10 bottom-10 w-48 h-96 bg-[#000] rounded-3xl border-4 border-[#222] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden z-10 flex flex-col">
              <div className="h-6 w-1/2 mx-auto bg-[#222] rounded-b-xl mb-4"></div>
              <div className="px-4 space-y-4">
                <div className="w-full h-24 rounded-lg bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 border border-white/10"></div>
                <div className="w-full h-12 rounded-lg bg-white/5"></div>
                <div className="w-full h-12 rounded-lg bg-white/5"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Admin Panel */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 relative h-[500px] flex items-center justify-center"
          >
            <div className="w-full h-80 bg-[#0a0a0f] rounded-xl border border-white/10 shadow-2xl overflow-hidden glass-panel-glow">
              <div className="h-10 border-b border-white/10 bg-[#050505] flex justify-between items-center px-4">
                <div className="text-xs text-brand-blue font-bold tracking-widest">CIVENTRA ADMIN</div>
                <div className="flex gap-2">
                  <div className="w-16 h-4 rounded bg-white/10"></div>
                  <div className="w-6 h-4 rounded bg-white/10"></div>
                </div>
              </div>
              <div className="p-6 flex gap-6 h-full">
                <div className="w-1/4 flex flex-col gap-3">
                  <div className="w-full h-8 rounded bg-brand-blue/20"></div>
                  <div className="w-full h-8 rounded bg-white/5"></div>
                  <div className="w-full h-8 rounded bg-white/5"></div>
                  <div className="w-full h-8 rounded bg-white/5"></div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-4 h-24">
                    <div className="flex-1 rounded bg-white/5 border border-white/10"></div>
                    <div className="flex-1 rounded bg-white/5 border border-white/10"></div>
                    <div className="flex-1 rounded bg-white/5 border border-white/10"></div>
                  </div>
                  <div className="flex-1 rounded bg-grid-pattern opacity-50 border border-white/10"></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Enterprise <span className="text-gradient-purple">Admin Command</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Equip authorities with a powerful, AI-driven backend to manage, route, and resolve issues efficiently.
            </p>
            <ul className="space-y-4">
              {[
                "Centralized Issue Management",
                "AI-Driven Prioritization",
                "Smart Department Routing",
                "Comprehensive Analytics Dashboard",
                "Resolution Tracking",
                "Weekly Automated AI Reports",
                "Predictive Trend Insights"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
