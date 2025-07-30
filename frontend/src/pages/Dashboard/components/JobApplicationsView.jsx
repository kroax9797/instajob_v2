import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export default function JobApplicationsView() {
  const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL ;
  const { jobId } = useParams();
  const location = useLocation();
  const {recruiter , job } = location.state || {};
  const navigate = useNavigate();

  console.log("job info")
  console.log(job);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    applicationId: null,
    decision: null,
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/recruit/job_post/selections?job_post_id=${jobId}`
        );
        if (!res.ok) throw new Error("Failed to fetch applications");
        const data = await res.json();
        setApplications(data || []);
      } catch (err) {
        console.error(err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId, reload]);

  const openConfirmationDialog = (applicationId, decision, e) => {
    e.stopPropagation();
    setConfirmationDialog({ isOpen: true, applicationId, decision });
  };

  const confirmDecision = async () => {
    const { applicationId, decision } = confirmationDialog;

    try {
      await fetch(`${BASE_URL}/human-verification/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: applicationId, shortlisted: decision }),
      });

      setReload((prev) => !prev);
    } catch (err) {
      console.error("Error updating decision:", err);
    } finally {
      setConfirmationDialog({ isOpen: false, applicationId: null, decision: null });
    }
  };

  const getFitScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/", { replace: true, state: {} });
  };

  console.log(applications);

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <header className="w-full px-6 py-4 bg-primary text-white shadow-md flex justify-between items-center">
        <div className="text-xl font-bold text-secondary">InstaJob Recruiter</div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block">
            {recruiter?.name} ({recruiter?.company})
          </span>
          <Button
            variant="outline"
            className="text-primary bg-white hover:bg-secondary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-center gap-4 bg-muted p-2 my-2">
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => navigate("/recruiter/dashboard", { state: recruiter })}
        >
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-center w-full">Shortlisted Candidates</h1>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6">
      {/* Left Sidebar: Job Info */}
      <div className="lg:w-[320px] w-full h-[100vh] overflow-y-auto bg-card p-4 rounded shadow sticky top-0">
        <h2 className="text-xl font-bold mb-2">{job.title}</h2>
        <p className="text-muted-foreground text-sm mb-4">{job.location}</p>
        <div className="text-sm space-y-2">
          <div><strong>Salary:</strong> {job.salary}</div>
          <div><strong>Job ID:</strong> <span className="font-mono">{job._id}</span></div>
          <div><strong>Posted by:</strong> {recruiter?.email}</div>
          <div className="whitespace-pre-line text-muted-foreground text-xs border-t pt-2 mt-2">
            {job.jd_text}
          </div>
        </div>
      </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <Dialog key={app.application_id}>
                <DialogTrigger asChild>
                  <Card
                    onClick={() => setSelectedCandidate(app)}
                    className={`cursor-pointer transition border-2 ${
                      app.status === "Shortlisted"
                        ? "border-green-500"
                        : app.status === "Rejected"
                        ? "border-red-500"
                        : "border-yellow-400"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="text-bold">{app.application_id}</div>
                      <div className="font-semibold">{app.email}</div>
                      <div className="text-muted-foreground">{app.phone}</div>

                      {app.shortlist_details && (
                        <>
                          {app.status != 'Rejected' && (
                            <div>
                              <div>
                                <span className="font-medium">Fit Score: </span>
                                <span className={`font-bold ${getFitScoreColor(app.shortlist_details.fit_score)}`}>
                                  {app.shortlist_details.fit_score}/10
                                </span>
                              </div>

                              <div className="text-muted-foreground whitespace-pre-line">
                                <span className="font-medium">Fit Reason:</span> <br />
                                {app.shortlist_details.fit_reason}
                              </div>
                            </div>
                          )}

                          {app.status === "Rejected" && app.shortlist_details.summary && (
                            <div className="bg-red-50 border border-red-300 text-red-700 p-2 rounded mt-2 text-sm whitespace-pre-line">
                              <strong>Summary:</strong><br />
                              {app.summary}
                            </div>
                          )}
                        </>
                      )}

                      {app.status === "Needs Review" && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            className="border-green-500 text-green-700"
                            onClick={(e) => openConfirmationDialog(app.application_id, "shortlisted", e)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-700"
                            onClick={(e) => openConfirmationDialog(app.application_id, "rejection", e)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </DialogTrigger>

                {/* Full Profile Dialog */}
                <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{app.name}'s Full Profile</DialogTitle>
                  </DialogHeader>
                  {app.shortlist_details ? (
                    <div className="space-y-3 text-sm">
                      <div><strong>Email:</strong> {app.shortlist_details.email}</div>
                      <div><strong>Phone:</strong> {app.phone}</div>
                      <div><strong>Years of Experience:</strong> {app.shortlist_details.experience_years}</div>
                      <div>
                        <strong>Education:</strong>
                        <ul className="list-disc list-inside">
                          {(app.shortlist_details.education || []).map((edu, i) => (
                            <li key={i}>{edu}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Past Roles:</strong>
                        <ul className="list-disc list-inside">
                          {(app.shortlist_details.past_roles || []).map((role, i) => (
                            <li key={i}>{role}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Skills:</strong>
                        <div className="flex flex-wrap gap-2">
                          {(app.shortlist_details.skills || []).map((skill, i) => (
                            <span key={i} className="bg-muted px-2 py-1 rounded text-xs">{skill}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong>Missing Info:</strong>
                        <ul className="list-disc list-inside">
                          {(app.shortlist_details.missing_info || []).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Follow-up Questions:</strong>
                        <ol className="list-decimal list-inside space-y-1">
                          {(app.shortlist_details.followup_questions || []).map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <div>No shortlist details available.</div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialog.isOpen} onOpenChange={() => setConfirmationDialog({ isOpen: false, applicationId: null, decision: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Decision</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to <strong>{confirmationDialog.decision}</strong> this candidate?
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setConfirmationDialog({ isOpen: false, applicationId: null, decision: null })}>
              Cancel
            </Button>
            <Button
              className={
                confirmationDialog.decision === "shortlisted"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
              onClick={confirmDecision}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}