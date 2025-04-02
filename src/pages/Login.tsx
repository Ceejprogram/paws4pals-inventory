import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/paws4palslogo.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  role: z.string().min(1, { message: "Please select a role" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading, forgotPassword, securityQuestions } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [securityAnswers, setSecurityAnswers] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [showSecurityAnswers, setShowSecurityAnswers] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "admin",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.role, data.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleForgotPassword = async () => {
    if (forgotPasswordStep === 1) {
      setForgotPasswordStep(2);
      return;
    }

    // Verify security answers and reveal password
    const password = await forgotPassword(selectedRole, securityAnswers);

    if (password) {
      setRevealedPassword(password);
      setForgotPasswordStep(3);
    }
  };

  const handleSecurityAnswerChange = (index: number, value: string) => {
    const newAnswers = [...securityAnswers];
    newAnswers[index] = value;
    setSecurityAnswers(newAnswers);
  };

  const toggleSecurityAnswerVisibility = (index: number) => {
    const newVisibility = [...showSecurityAnswers];
    newVisibility[index] = !newVisibility[index];
    setShowSecurityAnswers(newVisibility);
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setSecurityAnswers(["", "", ""]);
    setRevealedPassword(null);
    setShowSecurityAnswers([false, false, false]);
  };

  const allAnswersFilled = securityAnswers.every(
    (answer) => answer.trim() !== ""
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 overflow-hidden">
            <img
              src={logo}
              alt="PAWS4PALS Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            PAWS4PALS Inventory System
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Log in to manage your inventory
          </p>
        </div>

        {showForgotPassword ? (
          <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">
                {forgotPasswordStep === 3
                  ? "Password Revealed"
                  : "Recover Password"}
              </CardTitle>
              <CardDescription>
                {forgotPasswordStep === 1 &&
                  "Select your role to recover your password."}
                {forgotPasswordStep === 2 &&
                  "Answer the security questions to reveal your password."}
                {forgotPasswordStep === 3 &&
                  "Your password has been recovered."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forgotPasswordStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-role">Role</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                    >
                      <SelectTrigger
                        id="forgot-role"
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {forgotPasswordStep === 2 && (
                <div className="space-y-4">
                  {securityQuestions.map((question, index) => (
                    <div className="space-y-2" key={index}>
                      <Label htmlFor={`security-question-${index}`}>
                        {question.question}
                      </Label>
                      <div className="relative">
                        <Input
                          id={`security-question-${index}`}
                          type={
                            showSecurityAnswers[index] ? "text" : "password"
                          }
                          value={securityAnswers[index]}
                          onChange={(e) =>
                            handleSecurityAnswerChange(index, e.target.value)
                          }
                          className="pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecurityAnswerVisibility(index)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        >
                          {showSecurityAnswers[index] ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {forgotPasswordStep === 3 && revealedPassword && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-md">
                    <p className="text-green-800 dark:text-green-300 text-sm">
                      Your password has been recovered successfully.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revealed-password">Your Password</Label>
                    <div className="relative">
                      <Input
                        id="revealed-password"
                        type={showPassword ? "text" : "password"}
                        value={revealedPassword}
                        readOnly
                        className="pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {forgotPasswordStep < 3 && (
                <Button
                  className="w-full bg-brand-dark hover:bg-brand-medium"
                  onClick={handleForgotPassword}
                  disabled={forgotPasswordStep === 2 && !allAnswersFilled}
                >
                  {forgotPasswordStep === 1 ? "Continue" : "Reveal Password"}
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={resetForgotPassword}
              >
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">Log In</CardTitle>
              <CardDescription>
                Select your role and enter your password to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-gray-800">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-brand-dark hover:text-brand-medium p-0"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brand-dark hover:bg-brand-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            {/* <CardFooter>
              <div className="w-full text-center text-sm text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <AlertCircle className="h-4 w-4 text-brand-medium" />
                  <span>Demo credentials:</span>
                </div>
                <p className="mt-1">
                   Admin: <span className="font-mono">admin123</span>
                </p>
                <p>
                  Staff: <span className="font-mono">staff123</span>
                </p>
              </div>
            </CardFooter> */}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;
