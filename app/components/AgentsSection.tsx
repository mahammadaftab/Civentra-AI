"use client";

import { motion } from "framer-motion";
import { Eye, AlertTriangle, Map, CheckCircle, TrendingUp, RefreshCw, BarChart2 } from "lucide-react";

const agents = [
  { name: "Vision Routing Agent", description: "Analyzes images, categorizes issues, and routes them to departments autonomously.", icon: Eye, color: "blue" },
  { name: "Duplicate Detection Agent", description: "Uses Haversine distance and image hashes to block redundant civic reports.", icon: Map, color: "purple" },
  { name: "Severity Agent", description: "Performs deep risk analysis to assign 0-100 severity scores.", icon: AlertTriangle, color: "cyan" },
  { name: "Community Verification Agent", description: "Calculates mathematical consensus from nearby citizen reports.", icon: CheckCircle, color: "blue" },
  { name: "Predictive Intelligence Agent", description: "Forecasts future infrastructure hotspots based on historical decay.", icon: TrendingUp, color: "purple" },
  { name: "Resolution Verification Agent", description: "Acts as a strict City Inspector comparing Before/After photos.", icon: RefreshCw, color: "cyan" },
];

export default function AgentsSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="agents">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Meet The Civic <span className="text-gradient">Intelligence Workforce</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            // Determine glow class based on color property
            const glowClass = agent.color === "blue" ? "glow-card-blue" 
                            : agent.color === "purple" ? "glow-card-purple" 
                            : "glow-card"; // defaults to cyan/teal in our css
            
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-panel p-6 rounded-2xl group transition-all duration-500 cursor-pointer ${glowClass}`}
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{agent.description}</p>
              </motion.div>
            );
          })}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: agents.length * 0.1 }}
            className="glass-panel p-6 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-4 text-2xl text-gray-400">
              +
            </div>
            <h3 className="text-lg font-medium text-gray-300">Custom Agents</h3>
            <p className="text-gray-500 text-sm mt-1">Train for specific needs</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
