"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
  increment
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/app/lib/firebase/config";
import { useAuth } from "./useAuth";

export type IssueStatus = "Submitted" | "Analyzed" | "Verified" | "Assigned" | "In Progress" | "Resolved";
export type IssueSeverity = "Low" | "Medium" | "High" | "Critical";

export interface IssueMedia {
  images: string[];
  videos: string[];
  audio: string[];
}

export interface IssueEvent {
  status: IssueStatus;
  timestamp: Date;
  description: string;
  actor?: string;
}

export interface Issue {
  id: string;
  complaintId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  gpsCoordinates?: { lat: number, lng: number } | null;
  media?: IssueMedia;
  status: IssueStatus;
  severity?: IssueSeverity;
  confidence?: number;
  reportedBy: string;
  department?: string;
  confirmations?: string[];
  rejections?: string[];
  communityConfidenceScore?: number;
  riskScore?: number;
  severityReasoning?: string;
  events: IssueEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export function useIssues(filterRole: "citizen" | "department_admin" | "super_admin" | "all" = "all") {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user && filterRole !== "all") {
      setLoading(false);
      return;
    }

    let q = query(collection(db, "issues"), orderBy("createdAt", "desc"));

    // Apply filters based on role
    if (filterRole === "citizen" && user) {
      q = query(collection(db, "issues"), where("reportedBy", "==", user.uid), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issueData: Issue[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          events: (data.events || []).map((e: any) => ({
            ...e,
            timestamp: e.timestamp?.toDate() || new Date()
          })),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Issue;
      });
      
      setIssues(issueData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching issues:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, filterRole]);

  const generateComplaintId = () => {
    const year = new Date().getFullYear();
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CIV-${year}-${randomChars}`;
  };

  const uploadMediaFile = async (file: File | Blob, path: string): Promise<string> => {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const reportIssue = async (data: Omit<Issue, "id" | "complaintId" | "status" | "reportedBy" | "createdAt" | "updatedAt" | "events">) => {
    if (!user) throw new Error("Must be logged in to report an issue");
    
    const initialEvent = {
      status: "Submitted",
      timestamp: new Date(),
      description: "Report officially filed by citizen.",
      actor: "Citizen"
    };

    try {
      const docRef = await addDoc(collection(db, "issues"), {
        ...data,
        complaintId: generateComplaintId(),
        status: "Submitted",
        reportedBy: user.uid,
        confirmations: [],
        rejections: [],
        communityConfidenceScore: 0,
        events: [initialEvent],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Award Hero Points
      await updateDoc(doc(db, "users", user.uid), {
        heroPoints: increment(10)
      });

      return docRef.id;
    } catch (err: any) {
      console.error("Failed to report issue:", err);
      throw new Error("Failed to submit issue");
    }
  };

  const updateIssueStatus = async (issueId: string, status: IssueStatus, description: string = "Status updated.") => {
    try {
      const newEvent = {
        status,
        timestamp: new Date(),
        description,
        actor: "System / Admin"
      };

      await updateDoc(doc(db, "issues", issueId), {
        status,
        events: arrayUnion(newEvent),
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      console.error("Failed to update issue:", err);
      throw new Error("Failed to update status");
    }
  };

  const updateIssueDepartment = async (issueId: string, department: string) => {
    try {
      const newEvent = {
        status: "Assigned" as IssueStatus,
        timestamp: new Date(),
        description: `Issue routed to ${department}.`,
        actor: "System / Admin"
      };

      await updateDoc(doc(db, "issues", issueId), {
        department,
        status: "Assigned",
        events: arrayUnion(newEvent),
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      console.error("Failed to reassign department:", err);
      throw new Error("Failed to reassign department");
    }
  };

  const verifyIssue = async (issueId: string, vote: 'confirm' | 'reject') => {
    if (!user) throw new Error("Must be logged in to verify");
    try {
      const issueRef = doc(db, "issues", issueId);
      
      const targetIssue = issues.find(i => i.id === issueId);
      if (!targetIssue) throw new Error("Issue not found");

      const newConfirmations = vote === 'confirm' 
        ? [...(targetIssue.confirmations || []), user.uid] 
        : (targetIssue.confirmations || []);
      const newRejections = vote === 'reject' 
        ? [...(targetIssue.rejections || []), user.uid] 
        : (targetIssue.rejections || []);

      const totalVotes = newConfirmations.length + newRejections.length;
      const communityConfidenceScore = totalVotes === 0 ? 0 : Math.round((newConfirmations.length / totalVotes) * 100);

      const updates: any = {
        communityConfidenceScore,
        updatedAt: serverTimestamp(),
      };

      if (vote === 'confirm') updates.confirmations = arrayUnion(user.uid);
      else updates.rejections = arrayUnion(user.uid);

      // Auto-verify trigger (threshold = 1 confirm for demo)
      if (vote === 'confirm' && targetIssue.status !== "Verified" && targetIssue.status !== "Resolved" && targetIssue.status !== "In Progress") {
        updates.status = "Verified";
        updates.events = arrayUnion({
          status: "Verified",
          timestamp: new Date(),
          description: "Issue mathematically verified by local citizens via Community Verification Agent.",
          actor: "System / Community"
        });
      }

      await updateDoc(issueRef, updates);
    } catch (err: any) {
      console.error("Failed to verify issue:", err);
      throw new Error("Failed to submit verification");
    }
  };

  return { issues, loading, error, reportIssue, updateIssueStatus, updateIssueDepartment, uploadMediaFile, verifyIssue };
}
