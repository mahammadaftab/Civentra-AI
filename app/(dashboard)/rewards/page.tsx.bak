"use client";

import { motion } from "framer-motion";
import { Award, Zap, Shield, Target, Flame } from "lucide-react";

export default function HeroPointsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-4 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full mb-6"
        >
          <Award className="w-16 h-16 text-blue-400" />
        </motion.div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">4,250 PTS</h1>
        <p className="text-neutral-400 text-lg">Civic Defender Rank • Top 5% Contributor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Next Rank Progress */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          <h3 className="text-lg font-medium text-white mb-6">Next Rank: City Guardian</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-blue-400">4,250</span>
              <span className="text-neutral-500">5,000</span>
            </div>
            <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
              />
            </div>
            <p className="text-xs text-neutral-500 text-center mt-4">750 points remaining. Report 3 more verified issues to rank up!</p>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <h3 className="text-lg font-medium text-white mb-6">Recent Badges</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
              <Flame className="w-8 h-8 text-orange-400 mb-2" />
              <span className="text-sm font-medium text-white">7 Day Streak</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
              <Shield className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="text-sm font-medium text-white">Verified Reporter</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center opacity-50 grayscale">
              <Target className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-sm font-medium text-white">Eagle Eye</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center opacity-50 grayscale">
              <Zap className="w-8 h-8 text-purple-400 mb-2" />
              <span className="text-sm font-medium text-white">First Responder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
