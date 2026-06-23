"use client";

import { motion } from "framer-motion";

export default function PredictiveIntelligenceSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#020202]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Predictive <span className="text-gradient">Intelligence</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Forecast future issues before they happen using AI-driven geospatial analysis.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-white/10 glass-panel"
        >
          {/* Mockup Map Base */}
          <div className="absolute inset-0 bg-[#0a0a0f] opacity-80 mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/0,0,2,0/1200x600?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V4YW1wbGUifQ.example')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />

          {/* Animated Hotspots */}
          <div className="absolute top-1/3 left-1/4 group cursor-pointer">
            <div className="w-32 h-32 bg-red-500/20 blur-2xl rounded-full absolute -top-16 -left-16 animate-pulse" />
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-[0_0_15px_#ef4444]" />
            <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur border border-red-500/30 p-3 rounded-lg text-xs w-48 z-10">
              <span className="text-red-400 font-bold block mb-1">Pothole Hotspot</span>
              92% probability of road degradation within 30 days.
            </div>
          </div>

          <div className="absolute bottom-1/3 right-1/3 group cursor-pointer">
            <div className="w-40 h-40 bg-brand-cyan/20 blur-2xl rounded-full absolute -top-20 -left-20 animate-pulse" style={{ animationDelay: '1.5s' }} />
            <div className="w-4 h-4 bg-brand-cyan rounded-full border-2 border-white shadow-[0_0_15px_#00f2fe]" />
            <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur border border-brand-cyan/30 p-3 rounded-lg text-xs w-48 z-10">
              <span className="text-brand-cyan font-bold block mb-1">Water Leak Risk</span>
              High pressure anomaly detected in sector 7.
            </div>
          </div>

          <div className="absolute top-1/2 right-1/4 group cursor-pointer">
            <div className="w-24 h-24 bg-yellow-500/20 blur-2xl rounded-full absolute -top-12 -left-12 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-[0_0_15px_#eab308]" />
            <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur border border-yellow-500/30 p-3 rounded-lg text-xs w-48 z-10">
              <span className="text-yellow-400 font-bold block mb-1">Garbage Zone</span>
              Collection delay predicted for weekend.
            </div>
          </div>

          {/* Forecasting Overlay Panel */}
          <div className="absolute top-6 right-6 p-5 glass-panel-glow rounded-xl w-64">
            <h3 className="text-sm font-bold text-white mb-4">AI Forecasting</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Pothole Risk</span>
                  <span className="text-red-400">High</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-red-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Water Leak Risk</span>
                  <span className="text-brand-cyan">Medium</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "45%" }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    className="h-full bg-brand-cyan"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Garbage Zone</span>
                  <span className="text-yellow-400">Low</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "20%" }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                    className="h-full bg-yellow-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
