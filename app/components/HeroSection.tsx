"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import ThreeDNetwork from "./ThreeDNetwork";

const agents = [
  "Vision Agent",
  "Severity Agent",
  "Geo Agent",
  "Verification Agent",
  "Resolution Agent",
  "Analytics Agent",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 flex items-center overflow-hidden" id="platform">
      <ThreeDNetwork />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-brand-cyan text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
            Civic Intelligence 2.0
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Communities Don&apos;t Need More <span className="text-gray-500 line-through">Complaints.</span>
            <br />
            They Need <span className="text-gradient">Autonomous Problem Solving.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
            Civentra AI uses a network of intelligent agents to identify, verify, prioritize, predict, and accelerate resolution of civic issues in real time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group">
              Launch Platform
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 glass-panel text-white font-semibold rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-[600px] hidden lg:block"
        >
          <div className="absolute inset-0 flex flex-col justify-center items-end pr-10">
            {agents.map((agent, index) => (
              <motion.div
                key={agent}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
                className="relative flex items-center justify-end mb-4 group w-full"
              >
                {/* Connecting Line */}
                {index < agents.length - 1 && (
                  <div className="absolute right-32 top-10 w-0.5 h-8 bg-gradient-to-b from-brand-blue to-transparent opacity-50" />
                )}
                
                <div className="glass-panel-glow px-6 py-3 rounded-xl flex items-center gap-4 w-64 justify-between transform transition-transform group-hover:scale-105 group-hover:-translate-x-2">
                  <span className="font-medium text-sm">{agent}</span>
                  <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_10px_#00f2fe] animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
