"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useIssues, Issue } from "@/app/hooks/useIssues";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, AlertTriangle, ShieldCheck, DownloadCloud } from "lucide-react";
import Timeline from "@/app/components/ui/Timeline";
import Link from "next/link";
import { toast } from "sonner";

export default function IssueDetailView() {
  const params = useParams();
  const router = useRouter();
  const { issues, loading } = useIssues("citizen"); // Assuming citizen view, but hook handles all
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!loading && params.id) {
      const found = issues.find(i => i.id === params.id);
      setIssue(found || null);
    }
  }, [issues, loading, params.id]);

  const handleDownloadPDF = async () => {
    if (!issue) return;
    setIsDownloading(true);
    toast.loading("Generating AI Civic Report...", { id: "pdf-toast" });

    try {
      const response = await fetch(`http://localhost:8000/api/reports/download/${issue.id}`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CIV-REPORT-${issue.complaintId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("PDF Downloaded successfully!", { id: "pdf-toast" });
    } catch (error) {
      console.error(error);
      toast.error("Error generating PDF. Is the backend running?", { id: "pdf-toast" });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center text-neutral-500 animate-pulse">Loading issue details...</div>;
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 opacity-50" />
        <h2 className="text-xl font-medium text-white">Issue not found</h2>
        <p className="text-neutral-400">The report you are looking for does not exist or you lack permissions.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {issue.title}
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-neutral-400">
                {issue.complaintId}
              </span>
            </h1>
            <p className="text-neutral-400 flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" /> {issue.location}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
        >
          <DownloadCloud className="w-5 h-5" />
          {isDownloading ? "Generating..." : "Download Report"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Media */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl"
          >
            <h3 className="text-lg font-medium text-white mb-4">Report Details</h3>
            <p className="text-neutral-300 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
              {issue.description}
            </p>

            {/* Media Gallery */}
            {issue.media && (issue.media.images.length > 0 || issue.media.videos.length > 0) && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-neutral-400 mb-3 uppercase tracking-wider">Attached Media</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {issue.media.images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                      <img src={img} alt={`Evidence ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                    </div>
                  ))}
                  {issue.media.videos.map((vid, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 relative">
                      <video src={vid} className="w-full h-full object-cover opacity-70" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {issue.media?.audio && issue.media.audio.length > 0 && (
              <div className="mt-6">
                 <h4 className="text-sm font-medium text-neutral-400 mb-3 uppercase tracking-wider">Voice Memo</h4>
                 {issue.media.audio.map((aud, i) => (
                   <audio key={i} controls src={aud} className="w-full h-12 rounded-xl" />
                 ))}
              </div>
            )}
          </motion.div>

          {/* AI Analysis Box */}
          {(issue.status !== "Submitted") && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <ShieldCheck className="w-24 h-24 text-purple-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs font-medium text-purple-300">
                    AI Verified
                  </span>
                  <span className="text-xs text-neutral-400">Confidence: {(issue.confidence || 0.94) * 100}%</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-purple-300/70 block mb-1">Detected Category</span>
                    <span className="font-medium text-white">{issue.category}</span>
                  </div>
                  <div>
                    <span className="text-xs text-purple-300/70 block mb-1">Severity Level</span>
                    <span className="font-medium text-white">{issue.severity || 'High'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-purple-300/70 block mb-1">Routing Department</span>
                    <span className="font-medium text-white">{issue.department || 'Dept of Transportation'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl sticky top-8"
          >
            <h3 className="text-lg font-medium text-white mb-6">Issue Lifecycle</h3>
            <Timeline events={issue.events} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
