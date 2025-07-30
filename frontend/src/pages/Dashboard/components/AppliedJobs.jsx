import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function AppliedJobs({ jobs }) {
  const statusPriority = {
    Shortlisted: 1,
    "Needs Review": 2,
    Submitted: 2,
    Rejected: 3,
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    const aPriority = statusPriority[a.status] || 2;
    const bPriority = statusPriority[b.status] || 2;
    return aPriority - bPriority;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedJobs.map((job, idx) => {
        const status = job.status || "Submitted";

        const statusClass = {
          Shortlisted: "bg-green-100 text-green-700",
          Rejected: "bg-red-100 text-red-700",
          "Needs Review": "bg-yellow-100 text-yellow-800",
          Submitted: "bg-muted text-foreground",
        }[status] || "bg-muted text-foreground";

        const cardBorderClass =
          status === "Shortlisted"
            ? "border-green-300 shadow-green-50"
            : "border-muted shadow-muted-100";

        return (
          <Card
            key={job._id || idx}
            className={`bg-card hover:shadow-lg transition rounded-xl border ${cardBorderClass} ${
              status === "Shortlisted" ? "shadow-lg" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-base font-bold leading-tight">
                {job.title || `Application #${idx + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-muted-foreground">Location: {job.location}</div>

              <Badge variant="outline" className="text-xs">
                {job.salary || "Salary not specified"}
              </Badge>

              <div className="text-xs text-muted-foreground">Job ID:</div>
              <Badge className="break-all" variant="muted">
                {job.job_id || "N/A"}
              </Badge>

              <div className="text-xs text-muted-foreground">Application ID:</div>
              <Badge className="break-all" variant="muted">
                {job.application_id || "N/A"}
              </Badge>

              <div className="text-xs text-muted-foreground">Date Applied:</div>
              <Badge variant="outline" className="text-xs">
                {job.application_date
                  ? format(new Date(job.application_date), "dd MMM yyyy")
                  : "Unknown"}
              </Badge>

              <div className="text-xs mt-2">Status:</div>
              <Badge className={statusClass}>{status}</Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
