import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function JobStatusChart({ jobs }) {
  const statusCounts = {
    Shortlisted: 0,
    Rejected: 0,
    "Needs Review": 0,
  };

  jobs.forEach((job) => {
    if (job.status === "Shortlisted") statusCounts.Shortlisted += 1;
    else if (job.status === "Rejected") statusCounts.Rejected += 1;
    else statusCounts["Needs Review"] += 1;
  });

  const chartData = [
    { name: "Shortlisted", count: statusCounts.Shortlisted },
    { name: "Rejected", count: statusCounts.Rejected },
    { name: "Needs Review", count: statusCounts["Needs Review"] },
  ];

  const barColors = {
    Shortlisted: "#22c55e",   // Tailwind green-500
    Rejected: "#ef4444",      // Tailwind red-500
    "Needs Review": "#eab308" // Tailwind yellow-500
  };

  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Application Status Summary</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[entry.name]} radius={[6, 6, 0, 0]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
