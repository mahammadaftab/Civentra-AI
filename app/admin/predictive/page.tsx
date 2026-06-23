"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Brain, AlertTriangle, TrendingUp, Compass } from "lucide-react";
import { useIssues } from "@/app/hooks/useIssues";

export default function PredictiveCommandCenter() {
  const { issues, loading: issuesLoading } = useIssues("super_admin");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runPrediction = async () => {
    setIsPredicting(true);
    setHasRun(true);
    try {
      const res = await fetch("http://localhost:8000/api/agents/predictive/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issues })
      });
      if (res.ok) {
        const data = await res.json();
        setPredictions(data.predictions || []);
      }
    } catch (e) {
      console.error("Prediction failed", e);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            Predictive Intelligence
          </h1>
          <p className="text-neutral-400">Proactively identify infrastructure failure points before they happen using historical geospatial patterns.</p>
        </div>
        <button 
          onClick={runPrediction}
          disabled={isPredicting || issuesLoading}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          {isPredicting ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
          {isPredicting ? "Analyzing History..." : "Run AI Prediction"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Forecast Cards */}
        <div className="space-y-6">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-blue-400" /> Top Forecasts
            </h3>
            
            <div className="space-y-4">
              {!hasRun ? (
                <div className="text-center py-8 text-neutral-500">Run the AI to generate forecasts.</div>
              ) : isPredicting ? (
                <div className="text-center py-8 text-purple-400 animate-pulse">Running Gemini models...</div>
              ) : predictions.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No predictions could be confidently generated.</div>
              ) : (
                predictions.map((pred, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/40 transition-colors cursor-pointer"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-purple-200">{pred.category}</h4>
                      <div className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {pred.risk_score}% Risk
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300">{pred.reasoning}</p>
                    <div className="mt-3 text-xs text-neutral-500 flex items-center gap-2">
                      <span>Lat: {pred.lat.toFixed(4)}</span>
                      <span>Lng: {pred.lng.toFixed(4)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Predictive Map Simulation */}
        <div className="lg:col-span-2">
          <div className="h-[600px] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 relative">
            {!hasRun && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center">
                <Brain className="w-16 h-16 text-purple-500/50 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Awaiting Analysis</h3>
                <p className="text-neutral-400 max-w-md">The predictive mapping layer requires a full scan of historical data. Click "Run AI Prediction" to deploy the models.</p>
              </div>
            )}
            {/* Visual placeholder for the map. If we had the google map component here we'd pass predictions to it as circles. */}
            <div className="w-full h-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=800x600&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x9ca3af&style=feature:all|element:labels.text.stroke|visibility:off&style=feature:landscape|element:geometry|color:0x111111&style=feature:poi|element:geometry|color:0x222222&style=feature:road|element:geometry|color:0x333333&style=feature:transit|element:geometry|color:0x444444&style=feature:water|element:geometry|color:0x000000&key=AIzaSyDummyKeyForAestheticPurposes')] bg-cover bg-center">
              {predictions.map((pred, i) => (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 1], opacity: 0.6 }}
                  transition={{ delay: 0.5 + (i * 0.2), repeat: Infinity, duration: 2 }}
                  key={i}
                  className="absolute w-32 h-32 -ml-16 -mt-16 rounded-full bg-red-500/30 border-2 border-red-500 flex items-center justify-center"
                  style={{ 
                    // Simulating projection mapping. In a real app we'd use use-google-maps markers.
                    // Randomizing visually for demo since we have a static background
                    top: `${40 + (Math.random() * 20)}%`, 
                    left: `${40 + (Math.random() * 20)}%` 
                  }}
                >
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
