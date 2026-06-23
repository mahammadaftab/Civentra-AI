"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Camera, 
  MapPin, 
  AlertCircle, 
  Mic, 
  Square,
  Video,
  X,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useIssues, IssueMedia } from "@/app/hooks/useIssues";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReportIssue() {
  const router = useRouter();
  const { reportIssue, uploadMediaFile } = useIssues();
  
  // State
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Refs for media
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "Infrastructure",
    location: "",
    description: "",
  });

  const [gpsCoordinates, setGpsCoordinates] = useState<{lat: number, lng: number} | null>(null);
  
  // Files
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);

  // Handlers
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setLoadingText("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setFormData(prev => ({
          ...prev,
          location: `GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        }));
        setLoadingText("");
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setLoadingText("");
      }
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setVoiceBlob(audioBlob);
        audioChunks.current = [];
        stream.getTracks().forEach(track => track.stop());
      };

      audioChunks.current = [];
      recorder.start();
      mediaRecorder.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const removeMedia = (type: 'image' | 'video' | 'audio', index?: number) => {
    if (type === 'image' && index !== undefined) {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'video' && index !== undefined) {
      setSelectedVideos(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'audio') {
      setVoiceBlob(null);
    }
  };

  const [duplicateWarning, setDuplicateWarning] = useState<{
    probability: number, 
    issueId: string, 
    complaintId: string
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Duplicate Detection Agent Interceptor
      if (!duplicateWarning && gpsCoordinates) {
        setLoadingText("Running Duplicate Detection AI...");
        try {
          const res = await fetch("http://localhost:8000/api/agents/duplicate/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: gpsCoordinates.lat,
              lng: gpsCoordinates.lng,
              category: formData.category
            })
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.is_duplicate) {
              setDuplicateWarning({
                probability: data.probability,
                issueId: data.existing_issue_id,
                complaintId: data.existing_complaint_id
              });
              setLoading(false);
              return; // Halt submission
            }
          }
        } catch (e) {
          console.error("Duplicate check failed, proceeding to submit...");
        }
      }

      const mediaUrls: IssueMedia = { images: [], videos: [], audio: [] };
      const timestamp = Date.now();

      // 1. Upload Images
      if (selectedImages.length > 0) {
        setLoadingText("Uploading images...");
        for (let i = 0; i < selectedImages.length; i++) {
          const file = selectedImages[i];
          const path = `issues/images/${timestamp}_${file.name}`;
          const url = await uploadMediaFile(file, path);
          mediaUrls.images.push(url);
        }
      }

      // 2. Upload Videos
      if (selectedVideos.length > 0) {
        setLoadingText("Uploading video...");
        for (let i = 0; i < selectedVideos.length; i++) {
          const file = selectedVideos[i];
          const path = `issues/videos/${timestamp}_${file.name}`;
          const url = await uploadMediaFile(file, path);
          mediaUrls.videos.push(url);
        }
      }

      // 3. Upload Audio
      if (voiceBlob) {
        setLoadingText("Uploading voice recording...");
        const path = `issues/audio/${timestamp}_voice_memo.webm`;
        const url = await uploadMediaFile(voiceBlob, path);
        mediaUrls.audio.push(url);
      }

      // 3.5 AI Vision Routing
      let visionData: any = {};
      if (mediaUrls.images.length > 0) {
        setLoadingText("AI routing to department...");
        try {
          const vRes = await fetch("http://localhost:8000/api/agents/vision/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_url: mediaUrls.images[0] })
          });
          if (vRes.ok) {
            visionData = await vRes.json();
          }
        } catch (e) {
          console.error("Vision agent failed", e);
        }
      }

      // 4. Submit to Firestore
      setLoadingText("Finalizing report...");
      const issueId = await reportIssue({
        ...formData,
        category: visionData.category || formData.category,
        severity: visionData.severity || "Medium",
        department: visionData.suggested_department || "General Services",
        confidence: visionData.confidence || 0,
        gpsCoordinates,
        media: mediaUrls
      });

      setSuccess(true);
      
      // Reset form after 1.5 seconds and redirect directly to the new issue's tracking page
      setTimeout(() => {
        setSuccess(false);
        router.push(`/dashboard/issues/${issueId}`);
      }, 1500);

    } catch (error) {
      console.error("Failed to submit:", error);
      alert("Failed to submit issue. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Report an Issue</h1>
        <p className="text-neutral-400">Our AI agents will analyze your report and route it to the proper department instantly.</p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-8"
      >
        <div className="space-y-6">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Issue Title</label>
              <input 
                type="text"
                required
                placeholder="e.g. Large pothole on Main St"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Category</label>
              <select 
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Infrastructure</option>
                <option>Sanitation</option>
                <option>Traffic & Roads</option>
                <option>Public Safety</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Location</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input 
                    type="text"
                    required
                    placeholder="Enter address..."
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleGeolocation}
                  className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                  title="Detect GPS Location"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Detailed Description</label>
            <textarea 
              required
              rows={4}
              placeholder="Please provide any additional details that might help our AI agents analyze the severity..."
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Media Attachments Section */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">Media Attachments</label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Photo Upload */}
              <label className="border border-dashed border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer relative overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) setSelectedImages(prev => [...prev, ...Array.from(e.target.files!)]);
                  }}
                />
                <Camera className="w-6 h-6 text-neutral-400 mb-2" />
                <span className="text-sm text-neutral-300">Add Photos</span>
                <span className="text-xs text-neutral-500">{selectedImages.length} selected</span>
              </label>

              {/* Video Upload */}
              <label className="border border-dashed border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer relative overflow-hidden">
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) setSelectedVideos(prev => [...prev, ...Array.from(e.target.files!)]);
                  }}
                />
                <Video className="w-6 h-6 text-neutral-400 mb-2" />
                <span className="text-sm text-neutral-300">Add Video</span>
                <span className="text-xs text-neutral-500">{selectedVideos.length} selected</span>
              </label>

              {/* Voice Recorder */}
              <div 
                className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${
                  isRecording ? 'border-red-500 bg-red-500/5' : 'border-neutral-700 hover:border-blue-500 hover:bg-blue-500/5'
                }`}
              >
                {!isRecording ? (
                  <button type="button" onClick={startRecording} className="flex flex-col items-center">
                    <Mic className={`w-6 h-6 mb-2 ${voiceBlob ? 'text-blue-400' : 'text-neutral-400'}`} />
                    <span className="text-sm text-neutral-300">{voiceBlob ? 'Re-record Audio' : 'Record Voice Memo'}</span>
                    <span className="text-xs text-neutral-500">{voiceBlob ? '1 recording ready' : 'Max 60s'}</span>
                  </button>
                ) : (
                  <button type="button" onClick={stopRecording} className="flex flex-col items-center">
                    <Square className="w-6 h-6 text-red-500 mb-2 animate-pulse fill-red-500" />
                    <span className="text-sm text-red-400 font-medium">Recording...</span>
                    <span className="text-xs text-red-400/70">Click to stop</span>
                  </button>
                )}
              </div>
            </div>

            {/* Media Previews */}
            {(selectedImages.length > 0 || selectedVideos.length > 0 || voiceBlob) && (
              <div className="mt-4 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Attached Files</h4>
                <div className="space-y-2">
                  {selectedImages.map((img, i) => (
                    <div key={`img-${i}`} className="flex items-center justify-between text-sm bg-black/20 px-3 py-2 rounded-lg">
                      <span className="text-neutral-300 flex items-center gap-2"><Camera className="w-4 h-4"/> {img.name}</span>
                      <button type="button" onClick={() => removeMedia('image', i)} className="text-neutral-500 hover:text-red-400"><X className="w-4 h-4"/></button>
                    </div>
                  ))}
                  {selectedVideos.map((vid, i) => (
                    <div key={`vid-${i}`} className="flex items-center justify-between text-sm bg-black/20 px-3 py-2 rounded-lg">
                      <span className="text-neutral-300 flex items-center gap-2"><Video className="w-4 h-4"/> {vid.name}</span>
                      <button type="button" onClick={() => removeMedia('video', i)} className="text-neutral-500 hover:text-red-400"><X className="w-4 h-4"/></button>
                    </div>
                  ))}
                  {voiceBlob && (
                    <div className="flex items-center justify-between text-sm bg-black/20 px-3 py-2 rounded-lg">
                      <span className="text-neutral-300 flex items-center gap-2"><Mic className="w-4 h-4"/> Voice Memo Attached</span>
                      <button type="button" onClick={() => removeMedia('audio')} className="text-neutral-500 hover:text-red-400"><X className="w-4 h-4"/></button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          {duplicateWarning ? (
            <div className="flex flex-col gap-3 w-full bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-orange-400 font-bold">Possible Duplicate Detected ({duplicateWarning.probability.toFixed(0)}% Match)</h4>
                  <p className="text-sm text-neutral-300 mt-1">Our AI detected a very similar issue already reported nearby.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setDuplicateWarning(null)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors"
                >
                  Submit Anyway
                </button>
                <Link
                  href={`/dashboard/issues/${duplicateWarning.issueId}`}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  View Existing Issue
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <AlertCircle className="w-4 h-4" />
                <span>AI Verification will begin automatically after submission</span>
              </div>
              <button 
                type="submit"
                disabled={loading || success || isRecording}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  success 
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-black hover:bg-neutral-200 active:scale-95 disabled:opacity-50'
                }`}
              >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {loadingText || "Processing..."}</>
            ) : success ? (
              <><CheckCircle2 className="w-4 h-4" /> Submitted!</>
            ) : (
              'Submit Report'
            )}
          </button>
            </>
          )}
        </div>
      </motion.form>
    </div>
  );
}
