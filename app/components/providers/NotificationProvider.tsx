"use client";

import { useEffect, useRef } from "react";
import { useIssues } from "@/app/hooks/useIssues";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, ShieldCheck, Search } from "lucide-react";

export default function NotificationProvider() {
  const { issues, loading } = useIssues("citizen");
  
  // Keep track of previous issues to detect changes
  const prevIssuesRef = useRef(issues);

  useEffect(() => {
    if (loading || issues.length === 0) return;

    // Skip the first load
    if (prevIssuesRef.current.length === 0) {
      prevIssuesRef.current = issues;
      return;
    }

    issues.forEach((currentIssue) => {
      const prevIssue = prevIssuesRef.current.find(i => i.id === currentIssue.id);
      
      // If issue existed before and status changed
      if (prevIssue && prevIssue.status !== currentIssue.status) {
        
        // Define dynamic toast content based on new status
        let icon = <CheckCircle2 className="w-5 h-5 text-blue-500" />;
        let message = `Status updated to ${currentIssue.status}`;
        
        if (currentIssue.status === "Verified") {
          icon = <ShieldCheck className="w-5 h-5 text-emerald-500" />;
          message = "AI Verification Complete!";
        } else if (currentIssue.status === "Assigned") {
          icon = <Search className="w-5 h-5 text-amber-500" />;
          message = `Assigned to ${currentIssue.department || 'Department'}`;
        } else if (currentIssue.status === "Resolved") {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
          message = "Issue officially resolved!";
        }

        toast(currentIssue.title, {
          description: message,
          icon: icon,
          action: {
            label: 'View',
            onClick: () => window.location.href = `/dashboard/issues/${currentIssue.id}`
          },
        });
      }
    });

    // Update ref for next comparison
    prevIssuesRef.current = issues;
  }, [issues, loading]);

  return null; // This is a headless component
}
