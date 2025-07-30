import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppliedJobs } from "./components/AppliedJobs";
import { AvailableJobs } from "./components/AvailableJobs";
import { JobStatusChart } from "./components/JobStatusChart"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


export default function UserDashboard() {
  const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL ;
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.data;

  const [loading, setLoading] = useState(false);
  const [toggleView, setToggleView] = useState("applied");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/", { replace: true, state: {} });
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [toggleView]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        toggleView === "applied"
          ? `${BASE_URL}/user/applied?user_email=${user.email}`
          : `${BASE_URL}/user/jobs?user_email=${user.email}`
      );
      const result = await res.json();
      toggleView === "applied"
        ? setAppliedJobs(result || [])
        : setAvailableJobs(result.jobs || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  if (!user) return <div className="p-6">User data not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="w-full px-6 py-4 bg-primary text-white shadow-md flex justify-between items-center">
        <div className="text-xl font-bold text-secondary">InstaJob Candidate</div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block">{user.name} ({user.email})</span>
          <Button variant="outline" className="text-primary bg-white hover:bg-secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="flex flex-grow p-6 gap-6">
        <aside className="w-full sm:w-1/4 space-y-4">
        <Card>
            <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-muted-foreground">{user.phone}</p>
            <p className="text-xs text-muted-foreground mt-2">ID: {user._id}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle className="text-md">Resume</CardTitle>
            </CardHeader>
            <CardContent>
            <Dialog>
                <DialogTrigger asChild>
                <Button variant="outline" className="w-full">View Resume</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Resume Text</DialogTitle>
                </DialogHeader>
                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {user.resume_text || "No resume text available."}
                </div>
                </DialogContent>
            </Dialog>
            </CardContent>
        </Card>

        <JobStatusChart jobs={appliedJobs} />
        </aside>

        <section className="w-full sm:w-3/4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Dashboard</h2>
            <div className="flex gap-2">
              <Button variant={toggleView === "applied" ? "default" : "outline"} onClick={() => setToggleView("applied")}>
                Applied Jobs
              </Button>
              <Button variant={toggleView === "available" ? "default" : "outline"} onClick={() => setToggleView("available")}>
                Available Jobs
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading jobs...</p>
          ) : toggleView === "applied" ? (
            <AppliedJobs jobs={appliedJobs} />
          ) : (
            <AvailableJobs jobs={availableJobs} email={user.email}/>
          )}
        </section>
      </main>

      <footer className="w-full py-4 px-6 bg-secondary text-sm text-center text-muted-foreground border-t">
        © 2025 InstaJob • Built with ❤️ for job seekers
      </footer>
    </div>
  );
}
