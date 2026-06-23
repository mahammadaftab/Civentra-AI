"use client";

import { motion } from "framer-motion";
import { User, Cpu, ShieldCheck, Building2, CheckCircle2, BarChart } from "lucide-react";

const architectureSteps = [
  { icon: User, label: "Citizen", color: "text-white" },
  { icon: Cpu, label: "AI Agents", color: "text-brand-blue" },
  { icon: ShieldCheck, label: "Verification Layer", color: "text-brand-cyan" },
  { icon: Building2, label: "Department Layer", color: "text-brand-violet" },
  { icon: CheckCircle2, label: "Resolution Layer", color: "text-green-400" },
  { icon: BarChart, label: "Analytics Layer", color: "text-yellow-400" },
];

export default function ArchitectureSection() {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Product <span className="text-gradient">Architecture</span>
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10">
            {architectureSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex flex-col items-center group relative"
                >
                  <div className="w-16 h-16 rounded-2xl glass-panel-glow flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] relative bg-[#0a0a0f]">
                    <Icon className={`w-8 h-8 ${step.color}`} />
                    
                    {index < architectureSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
                    )}
                  </div>
                  
                  <div className="text-sm font-bold text-gray-300 text-center">
                    {step.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
