import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Header({ recruiter }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/", { replace: true, state: {} });
  };

  return (
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
  );
}

export default Header;
