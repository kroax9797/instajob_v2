import { useEffect, useState } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function RecruiterDashboard() {
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate()
  const location = useLocation();
  const recruiter = location.state;
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`http://localhost:8000/recruit/posted_jobs?email=${recruiter.email}`);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobPosts(data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [recruiter.email]);

    const handleLogout = () => {
        // Optional: Clear any local/session storage if used
        sessionStorage.clear();
        localStorage.clear();

        // Redirect to home with no state
        navigate("/", { replace: true, state: {} });
    };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* Navbar */}
      <header className="w-full px-6 py-4 bg-primary text-white shadow-md flex justify-between items-center">
        <div className="text-xl font-bold text-secondary">InstaJob Recruiter</div> 
        <div className="flex items-center gap-4">
          <span className="hidden sm:block">{recruiter?.name} ({recruiter?.company})</span>
          <Button variant="outline" className="text-primary bg-white hover:bg-secondary" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-grow p-6 space-y-6">
        {/* Header section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {recruiter?.name}</h1>
            <p className="text-muted-foreground text-sm">
              {recruiter?.email} • {recruiter?.company}
            </p>
          </div>
          <Button
            className="rounded-full h-10 w-10 p-0 shadow bg-secondary hover:bg-primary hover:text-white"
            onClick={() => alert("Open Create Job Modal")}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Job Posts Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Job Posts</h2>

          {loading ? (
            <p className="text-muted-foreground">Loading jobs...</p>
          ) : jobPosts.length === 0 ? (
            <p className="text-muted-foreground">No job posts yet. Click the + button to create one.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPosts.map((job, idx) => {
                const applications = job.application_ids?.length || 0;
                const selections = job.selections?.length || 0;
                const selectionRate = applications > 0 ? ((selections / applications) * 100).toFixed(1) : 0;
                const dateStr = job.created_at ? format(new Date(job.created_at), "MMM dd, yyyy") : "N/A";

                return (
                  <Card
                    key={idx}
                    className="hover:shadow-lg transition border bg-card text-card-foreground flex flex-col justify-between"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle 
                        className="text-lg"
                        onClick={() => navigate(`/recruiter/dashboard/${job._id}`, { state: recruiter })}
                        >
                            {job.title}
                        </CardTitle>
                        {applications > 0 && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              selectionRate >= 50
                                ? "text-green-600 border-green-600"
                                : selectionRate >= 20
                                ? "text-yellow-600 border-yellow-600"
                                : "text-red-600 border-red-600"
                            }`}
                          >
                            {selectionRate}% selected
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm">
                      <div className="text-primary font-medium">{job.location}</div>
                      <div className="text-base text-foreground font-semibold">{job.salary}</div>
                      <div className="text-xs text-muted-foreground">
                        Job ID: <span className="font-mono">{job._id}</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                            <div
                            className="line-clamp-3 text-foreground cursor-pointer hover:underline"
                            onClick={() => setSelectedJob(job)}
                            >
                            {job.jd_text}
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                            <DialogTitle>{selectedJob?.title || "Job Description"}</DialogTitle>
                            </DialogHeader>
                            <div className="text-sm whitespace-pre-line text-muted-foreground">
                            {selectedJob?.jd_text}
                            </div>
                        </DialogContent>
                        </Dialog>

                      <div className="flex justify-between items-center text-xs pt-2 border-t">
                        <span>{applications} applications</span>
                        <span>{selections} selected</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Posted on {dateStr}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 bg-secondary text-sm text-center text-muted-foreground border-t">
        © 2025 InstaJob • Built with ❤️ for recruiters
      </footer>
    </div>
  );
}
