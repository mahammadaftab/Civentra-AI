"use client";

import { motion } from "framer-motion";
import { Camera, Cpu, Users, ShieldCheck, Truck, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: Camera, title: "Citizen uploads image", description: "Real-time report generation from the community." },
  { icon: Cpu, title: "AI analyzes issue", description: "Automated classification and severity scoring." },
  { icon: Users, title: "Agents collaborate", description: "Multi-agent system maps and prioritizes." },
  { icon: ShieldCheck, title: "Community verifies", description: "Crowdsourced validation to prevent duplicates." },
  { icon: Truck, title: "Authorities respond", description: "Smart routing to the correct department." },
  { icon: CheckCircle2, title: "Issue resolved", description: "Closing the loop with predictive forecasting." },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden" id="solutions">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            A seamless, autonomous pipeline from citizen report to verified resolution.
          </motion.p>
        </div>

        <div className="relative">
          {/* Horizontal Line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan opacity-20" />
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step Node */}
                  <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-6 relative z-10 group-hover:border-brand-cyan transition-colors duration-500 group-hover:shadow-[0_0_30px_rgba(0,242,254,0.2)]">
                    <Icon className="w-10 h-10 text-gray-400 group-hover:text-brand-cyan transition-colors" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-brand-black border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:text-white group-hover:border-brand-cyan">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-brand-blue transition-all">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
