"use client";

import { useIssues } from "@/app/hooks/useIssues";
import GeoIntelligenceMap from "@/app/components/features/map/GeoIntelligenceMap";
import { Loader2 } from "lucide-react";

export default function AdminMapPage() {
  const { issues, loading } = useIssues("super_admin");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Geo Intelligence</h1>
          <p className="text-neutral-400">Live, clustering map of all civic issues across the infrastructure.</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl shadow-2xl relative">
        {loading && (
          <div className="absolute inset-0 z-20 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}
        <GeoIntelligenceMap issues={issues} />
      </div>
    </div>
  );
}
