"use client";

import { motion } from "framer-motion";

const integrations = [
  { name: "Gemini Vision", color: "from-blue-500/20 to-blue-500/5", border: "hover:border-blue-500/50" },
  { name: "Gemini Flash", color: "from-yellow-500/20 to-yellow-500/5", border: "hover:border-yellow-500/50" },
  { name: "Vertex AI", color: "from-purple-500/20 to-purple-500/5", border: "hover:border-purple-500/50" },
  { name: "Firebase", color: "from-orange-500/20 to-orange-500/5", border: "hover:border-orange-500/50" },
  { name: "Google Maps", color: "from-green-500/20 to-green-500/5", border: "hover:border-green-500/50" },
  { name: "BigQuery", color: "from-blue-400/20 to-blue-400/5", border: "hover:border-blue-400/50" },
];

export default function IntegrationSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-brand-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-6">
            <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            Ecosystem
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">
            Powered By <span className="text-gradient">Google AI</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {integrations.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-6 rounded-2xl border border-white/10 bg-gradient-to-br ${item.color} ${item.border} transition-all duration-300 cursor-pointer group flex items-center justify-center`}
            >
              <span className="font-bold text-white group-hover:scale-105 transition-transform">
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
