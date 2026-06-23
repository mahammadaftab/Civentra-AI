"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIssues } from "@/app/hooks/useIssues";
import { useAuth } from "@/app/hooks/useAuth";
import { 
  Check, 
  X, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  Award,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function VerifyCommunityPage() {
  const { user } = useAuth();
  const { issues, loading, verifyIssue } = useIssues("all"); // We need all issues to find nearby ones
  const [isVoting, setIsVoting] = useState(false);

  // Filter issues for verification
  const verifiableIssues = useMemo(() => {
    if (!user) return [];
    return issues.filter(i => {
      // Don't verify own issues
      if (i.reportedBy === user.uid) return false;
      // Don't verify already verified/resolved issues
      if (i.status !== "Submitted" && i.status !== "Analyzed") return false;
      // Don't verify if already voted
      if (i.confirmations?.includes(user.uid)) return false;
      if (i.rejections?.includes(user.uid)) return false;
      return true;
    });
  }, [issues, user]);

  // Calculate user's trust score/hero points based on total votes cast across all issues
  const userVerificationCount = useMemo(() => {
    if (!user) return 0;
    return issues.reduce((acc, i) => {
      if (i.confirmations?.includes(user.uid) || i.rejections?.includes(user.uid)) return acc + 1;
      return acc;
    }, 0);
  }, [issues, user]);

  const currentIssue = verifiableIssues[0]; // Show the top one in the stack

  const handleVote = async (vote: 'confirm' | 'reject') => {
    if (!currentIssue || !user || isVoting) return;
    setIsVoting(true);
    
    try {
      await verifyIssue(currentIssue.id, vote);
      toast.success(
        vote === 'confirm' 
          ? "Issue Confirmed! +50 Hero Points" 
          : "Issue Rejected. Thank you for keeping data clean!", 
        { id: "vote-toast" }
      );
    } catch (e) {
      toast.error("Failed to submit verification.");
    } finally {
      setIsVoting(false);
    }
  };

  const getSeverityStyle = (severity: string | undefined) => {
    switch(severity) {
      case "Critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Low": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center text-neutral-500 animate-pulse">Loading community requests...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Verification</h1>
          <p className="text-neutral-400 max-w-lg">Help validate reports submitted by your neighbors. The AI Verification Agent uses your feedback to mathematically compute community trust scores.</p>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl shrink-0">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Your Trust Score</p>
            <h3 className="text-2xl font-bold text-white flex items-baseline gap-2">
              {Math.min(100, 50 + (userVerificationCount * 5))} <span className="text-sm font-normal text-neutral-500">/ 100</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Main Verification Card */}
      <div className="relative min-h-[500px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {currentIssue ? (
            <motion.div
              key={currentIssue.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {isVoting && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}

              {/* Card Image */}
              <div className="h-64 bg-neutral-950 relative">
                {currentIssue.media?.images?.[0] ? (
                  <img 
                    src={currentIssue.media.images[0]} 
                    alt="Issue Evidence" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-700">
                    <ShieldCheck className="w-16 h-16 opacity-20" />
                  </div>
                )}
                
                {/* AI Badge Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border backdrop-blur-md ${getSeverityStyle(currentIssue.severity)}`}>
                    {currentIssue.severity || 'Unrated'} Severity
                  </div>
                  {currentIssue.confidence !== undefined && (
                    <div className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-black/60 text-emerald-400 border-emerald-500/20 backdrop-blur-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      AI Conf: {Math.round(currentIssue.confidence * 100)}%
                    </div>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{currentIssue.title}</h2>
                  <p className="text-sm text-neutral-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {currentIssue.location}
                  </p>
                </div>
                
                <p className="text-sm text-neutral-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                  "{currentIssue.description}"
                </p>

                {/* Voting Actions */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleVote('reject')}
                    disabled={isVoting}
                    className="flex flex-col items-center justify-center py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <X className="w-8 h-8 mb-2" />
                    <span className="font-bold text-sm">Fake / Reject</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote('confirm')}
                    disabled={isVoting}
                    className="flex flex-col items-center justify-center py-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Check className="w-8 h-8 mb-2" />
                    <span className="font-bold text-sm">Confirm Issue</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-12 bg-white/[0.02] border border-white/5 rounded-3xl max-w-lg w-full"
            >
              <ShieldCheck className="w-16 h-16 text-emerald-500/50 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">You're all caught up!</h3>
              <p className="text-neutral-400">There are no pending reports in your area that need verification. Thank you for keeping the city data clean!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
