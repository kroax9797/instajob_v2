import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

export function AvailableJobs({ jobs, email }) {
  const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showJDDialog, setShowJDDialog] = useState(false);
  

  const aiMessages = [
    "🤖 Our AI is evaluating your resume for role alignment. This may take a few seconds.",
    "📊 We’re checking your skills and experience against job requirements.",
    "🧠 Did you know? AI can scan and summarize a resume faster than a human recruiter!",
    "🔍 Our system is analyzing key highlights from your application...",
    "🚀 AI models have reduced screening time from hours to seconds!",
    "🕵️‍♀️ Fun fact: Our recruiter bot can read over 200 resumes in under a minute!",
    "📂 Hang tight! We're running your profile through our job-fit models.",
    "💡 Did you know? Large language models like GPT-4 are being used in hiring globally!"
  ];

  const [loadingFact, setLoadingFact] = useState(aiMessages[0]);

  useEffect(() => {
    if (applying) {
      const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
      setLoadingFact(randomMessage);
    }
  }, [applying]);

  const handleApply = async () => {
    if (!selectedJob || !email) return;
    setApplying(true);

    const queryParams = new URLSearchParams({
      applicant_email: email,
      job_id: selectedJob._id
    });

    try {
      const res = await fetch(`${BASE_URL}/apply?${queryParams.toString()}`, {
        method: "POST"
      });

      const result = await res.json();

      if (res.ok) {
        const { status, summary, application_id, transaction_id } = result;
        const statusIcon = status === "Shortlisted" ? "✅" : status === "Needs Review" ? "🕵️‍♂️" : "❌";
        const statusColor = status === "Shortlisted" ? "green" : status === "Needs Review" ? "orange" : "red";

        alert(
          `${statusIcon} Application ${status}\n\n📄 Summary:\n${summary}\n\n🆔 App ID: ${application_id}\n🔁 TXN: ${transaction_id}`
        );

        console.log(`%c${status} - ${summary}`, `color: ${statusColor}; font-weight: bold;`);
      } else {
        alert(`Failed to apply: ${result.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Apply error:", error);
      alert("An error occurred while applying.");
    } finally {
      setApplying(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, idx) => (
          <Card
            key={job._id || idx}
            className="bg-card hover:shadow-lg border border-muted transition rounded-xl"
          >
            <CardHeader>
              <CardTitle className="text-base font-bold leading-tight">
                {job.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-muted-foreground">{job.location}</div>
              <Badge variant="outline" className="text-xs">
                Salary : {job.salary || "Salary not specified"}
              </Badge>
              {job.jd_text && (
                <div
                  className="mt-2 text-xs text-muted-foreground line-clamp-4 cursor-pointer hover:underline"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowJDDialog(true);
                  }}
                >
                  {job.jd_text}
                </div>
              )}
              <Button
                className="mt-3 w-full"
                onClick={() => {
                  setSelectedJob(job);
                  setIsDialogOpen(true);
                }}
              >
                Apply
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Application</DialogTitle>
          </DialogHeader>
          <div className="text-sm">
            Are you sure you want to apply to:
            <br />
            <span className="font-semibold">{selectedJob?.title}</span> at{" "}
            <span className="text-muted-foreground">{selectedJob?.location}</span>?
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={applying}>
              {applying ? "Applying..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full JD Dialog */}
      <Dialog open={showJDDialog} onOpenChange={setShowJDDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedJob?.location}</p>
          </DialogHeader>
          <div className="text-sm whitespace-pre-line">{selectedJob?.jd_text}</div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowJDDialog(false)} variant="destructive">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {applying && (
        <div className="fixed inset-0 bg-muted bg-opacity-60 z-50 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white mb-4"></div>
          <div className="text-white text-center max-w-sm text-sm px-4">{loadingFact}</div>
        </div>
      )}
    </>
  );
}
