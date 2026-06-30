"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Star, Shield, TrendingUp, Medal, Crown, CheckCircle, MapPin } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";

interface LeaderboardUser {
  id: string;
  displayName: string;
  heroPoints: number;
  heroLevel: string;
  trustScore: number;
}

export default function RewardsDashboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("heroPoints", "desc"), limit(5));
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          displayName: doc.data().displayName || "Anonymous Citizen",
          heroPoints: doc.data().heroPoints || 0,
          heroLevel: doc.data().heroLevel || "Bronze Hero",
          trustScore: doc.data().trustScore || 50
        }));
        setLeaderboard(users);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (!user) return null;

  // Calculate progress to next level
  const points = user.heroPoints || 0;
  let nextLevel = "Silver Hero";
  let maxPoints = 100;
  let progress = 0;

  if (points < 100) {
    nextLevel = "Silver Hero";
    maxPoints = 100;
    progress = (points / 100) * 100;
  } else if (points < 500) {
    nextLevel = "Gold Hero";
    maxPoints = 500;
    progress = (points / 500) * 100;
  } else {
    nextLevel = "Platinum Hero";
    maxPoints = 1000;
    progress = Math.min((points / 1000) * 100, 100);
  }

  const getLevelColor = (level: string) => {
    switch(level) {
      case "Bronze Hero": return "text-amber-600";
      case "Silver Hero": return "text-neutral-400";
      case "Gold Hero": return "text-yellow-400";
      case "Platinum Hero": return "text-cyan-400";
      default: return "text-amber-600";
    }
  };

  const getLevelIcon = (level: string) => {
    switch(level) {
      case "Bronze Hero": return <Medal className="w-8 h-8 text-amber-600" />;
      case "Silver Hero": return <Medal className="w-8 h-8 text-neutral-400" />;
      case "Gold Hero": return <Star className="w-8 h-8 text-yellow-400" />;
      case "Platinum Hero": return <Crown className="w-8 h-8 text-cyan-400" />;
      default: return <Medal className="w-8 h-8 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Hero Rewards</h1>
        <p className="text-neutral-400">Track your impact, earn badges, and climb the city leaderboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Progress */}
        <div className="lg:col-span-2 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Award className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {getLevelIcon(user.heroLevel || "Bronze Hero")}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{user.heroLevel || "Bronze Hero"}</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-400 font-medium">{points} Hero Points</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400">{user.trustScore || 50}% Trust Score</span>
                </div>
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-neutral-400">Progress to {nextLevel}</span>
                <span className="text-blue-400">{points} / {maxPoints} pts</span>
              </div>
              <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white">Badge Cabinet</h3>
              <span className="text-sm text-blue-400">{(user.badges || []).length} Unlocked</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Badges Display */}
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/5 border border-amber-500/30 flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:border-amber-500/50 transition-colors">
                <Shield className="w-8 h-8 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-amber-100">Citizen Initiate</span>
                <span className="text-xs text-amber-400/60 mt-1">Joined Platform</span>
              </div>
              
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/5 border border-blue-500/30 flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:border-blue-500/50 transition-colors">
                <TrendingUp className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-blue-100">First Report</span>
                <span className="text-xs text-blue-400/60 mt-1">Reported an issue</span>
              </div>

              {/* Locked Badges */}
              <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center p-4 text-center opacity-50 grayscale">
                <CheckCircle className="w-8 h-8 text-neutral-500 mb-3" />
                <span className="text-sm font-bold text-neutral-300">Truth Seeker</span>
                <span className="text-xs text-neutral-500 mt-1">5 Verifications</span>
              </div>

              <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center p-4 text-center opacity-50 grayscale">
                <MapPin className="w-8 h-8 text-neutral-500 mb-3" />
                <span className="text-sm font-bold text-neutral-300">Pothole Patrol</span>
                <span className="text-xs text-neutral-500 mt-1">Report 10 Potholes</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 p-6 bg-white/[0.02] border border-white/5 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 rounded-xl">
              <Crown className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-medium text-white">City Leaderboard</h3>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-neutral-500 animate-pulse">Loading top heroes...</div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">No heroes found.</div>
            ) : leaderboard.map((hero, i) => (
              <div key={hero.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-8 text-center text-lg font-bold text-neutral-500">#{i + 1}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{hero.displayName}</h4>
                  <p className={`text-xs font-medium ${getLevelColor(hero.heroLevel)}`}>{hero.heroLevel}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-400">{hero.heroPoints}</div>
                  <div className="text-[10px] text-neutral-500">PTS</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
