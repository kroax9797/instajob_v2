// components/CandidateCard.js
import { Card, CardTitle } from "@/components/ui/card";

export default function CandidateCard({ candidate }) {
  const d = candidate.shortlist_details;

  return (
    <Card className="p-4 space-y-2 border">
      <CardTitle className="text-base">{d.name}</CardTitle>
      <div className="text-sm text-muted-foreground">
        {candidate.email} • {candidate.phone}
      </div>
      <div className="text-sm">Experience: {d.experience_years} yrs</div>
      <div className="text-sm">Fit Score: {d.fit_score}/10</div>
      <div className="text-sm">
        <strong>Skills:</strong> {d.skills.join(", ")}
      </div>
      <div className="text-sm">
        <strong>Education:</strong> {d.education.join(" | ")}
      </div>
      <div className="text-sm">
        <strong>Past Roles:</strong> {d.past_roles.join(", ")}
      </div>
      <div className="text-sm text-green-700">
        <strong>Why a Fit:</strong> {d.fit_reason}
      </div>
      <div className="text-sm text-yellow-800">
        <strong>Missing Info:</strong> {d.missing_info.join(", ")}
      </div>
      <div className="text-sm">
        <strong>Follow-up Questions:</strong>
        <ul className="list-disc list-inside">
          {d.followup_questions.map((q, idx) => (
            <li key={idx}>{q}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
