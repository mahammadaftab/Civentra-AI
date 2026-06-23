"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "AI Issue Detection",
  "Community Verification Network",
  "Smart Department Routing",
  "Duplicate Detection Engine",
  "Predictive Civic Intelligence",
  "Before vs After Resolution Validation",
  "AI Generated Civic Reports (PDF)",
  "Hero Rewards & Reputation System",
  "Multilingual Voice Reporting",
  "Civic Health Score",
  "Emergency Escalation Agent"
];

export default function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="technology">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Unique <span className="text-gradient">Capabilities</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl"
          >
            A comprehensive suite of tools designed to transform how civic issues are managed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass-panel p-6 rounded-xl flex items-start gap-4 group hover:bg-white/5 transition-colors border border-white/5 hover:border-brand-blue/30"
            >
              <div className="mt-1 w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-blue/20 transition-colors">
                <Check className="w-3.5 h-3.5 text-brand-cyan" />
              </div>
              <h3 className="text-white font-medium group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-brand-blue transition-all">
                {feature}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
