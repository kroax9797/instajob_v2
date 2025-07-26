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
  const { jobId } = useParams();
  const location = useLocation();
  const recruiter = location.state;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/recruit/job_post/selections?job_post_id=${jobId}`
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
  }, [jobId]);

  const handleDecision = async (applicationId, decision, e) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:8000/recruit/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, application_id: applicationId, decision })
      });

      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === applicationId ? { ...app, decision } : app
        )
      );
    } catch (err) {
      console.error("Error updating decision:", err);
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

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <header className="w-full px-6 py-4 bg-primary text-white shadow-md flex justify-between items-center">
        <div className="text-xl font-bold text-secondary">InstaJob Recruiter</div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block">{recruiter?.name} ({recruiter?.company})</span>
          <Button variant="outline" className="text-primary bg-white hover:bg-secondary" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <div className="flex items-center justify-center gap-4 bg-muted p-2 my-2">
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => navigate("/dashboard/recruiter", { state: recruiter })}
        >
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-center w-full">Shortlisted Candidates</h1>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                      </>
                    )}

                    {app.status === "Needs Review" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-700"
                          onClick={(e) => handleDecision(app.application_id, "accepted", e)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-700"
                          onClick={(e) => handleDecision(app.application_id, "rejected", e)}
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
  );
}
