"use client";

import { motion } from "framer-motion";
import { FileText, Download, Calendar, ExternalLink } from "lucide-react";

const reports = [
  { id: 1, title: "Monthly Civic Infrastructure Assessment", date: "June 2026", size: "2.4 MB", type: "PDF" },
  { id: 2, title: "Q2 AI Autonomous Resolution Summary", date: "May 2026", size: "4.1 MB", type: "PDF" },
  { id: 3, title: "Traffic Pattern Analysis - Downtown Area", date: "April 2026", size: "1.8 MB", type: "CSV" },
];

export default function DownloadedReportsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Official Reports</h1>
        <p className="text-neutral-400 mt-2">Access AI-generated civic intelligence reports for your municipality.</p>
      </div>

      <div className="grid gap-4">
        {reports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-medium text-white group-hover:text-blue-400 transition-colors">{report.title}</h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
                  <span>•</span>
                  <span>{report.size}</span>
                  <span>•</span>
                  <span className="font-mono bg-white/10 px-1.5 rounded">{report.type}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/5">
                <ExternalLink className="w-4 h-4" /> View
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
