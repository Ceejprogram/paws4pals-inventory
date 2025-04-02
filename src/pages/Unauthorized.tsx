import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md space-y-6 animate-fade-in">
        <div className="mx-auto h-24 w-24 rounded-full bg-brand-lightest flex items-center justify-center">
          <Shield className="h-12 w-12 text-brand-dark" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>

        <p className="text-gray-600">
          Sorry, you don't have permission to access this page. Please contact
          your administrator if you believe this is a mistake.
        </p>

        <div className="pt-4">
          <Button
            className="bg-brand-dark hover:bg-brand-medium"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
