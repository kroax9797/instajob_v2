import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
      <h1 className="text-6xl font-extrabold text-destructive mb-6">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Oops! The page you're looking for doesn't exist or has been moved. Let’s get you back on track.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => navigate("/")}>🏠 Go to Home</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>⬅️ Go Back</Button>
      </div>
    </div>
  );
}
