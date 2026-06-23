"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10x", label: "Faster Issue Identification" },
  { value: "70%", label: "Reduction in Duplicate Reports" },
  { value: "95%", label: "Classification Accuracy" },
  { value: "∞", label: "Real-Time Civic Intelligence" },
];

export default function TrustSection() {
  return (
    <section className="py-24 border-t border-white/5 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-blue/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Built for Communities. <span className="text-gradient">Powered by AI.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-8 rounded-2xl text-center group hover:bg-white/5 transition-colors border border-white/5 hover:border-brand-blue/30"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-brand-blue transition-all">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
