import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Key } from "lucide-react";

const SecurityTab = () => {
  const { verifySecurityAnswers, securityQuestions } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isViewPasswordDialogOpen, setIsViewPasswordDialogOpen] =
    useState(false);
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
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsPasswordDialogOpen(false);
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    }, 1000);
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

  const handleViewPassword = async () => {
    setIsLoading(true);

    // Use security questions to verify and reveal password
    const password = await verifySecurityAnswers(securityAnswers);

    if (password) {
      setRevealedPassword(password);
      toast({
        title: "Password Revealed",
        description: "Your password has been successfully revealed.",
      });
    }

    setIsLoading(false);
  };

  const resetViewPasswordForm = () => {
    setSecurityAnswers(["", "", ""]);
    setRevealedPassword(null);
    setShowPassword(false);
    setShowSecurityAnswers([false, false, false]);
    setIsViewPasswordDialogOpen(false);
  };

  const allAnswersFilled = securityAnswers.every(
    (answer) => answer.trim() !== ""
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="dark:text-white">Security Settings</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Manage your account security and password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium dark:text-white">View Password</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Answer security questions to view your password
              </p>
            </div>
            <Dialog
              open={isViewPasswordDialogOpen}
              onOpenChange={setIsViewPasswordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 dark:border-gray-700 dark:text-white"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Password</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-900 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">
                    View Your Password
                  </DialogTitle>
                  <DialogDescription className="dark:text-gray-400">
                    Answer the security questions to reveal your password
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  {!revealedPassword ? (
                    <>
                      {securityQuestions.map((question, index) => (
                        <div className="space-y-2" key={index}>
                          <Label
                            htmlFor={`security-question-${index}`}
                            className="dark:text-white"
                          >
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
                                handleSecurityAnswerChange(
                                  index,
                                  e.target.value
                                )
                              }
                              className="pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                toggleSecurityAnswerVisibility(index)
                              }
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
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-md">
                        <p className="text-green-800 dark:text-green-300 text-sm">
                          Your password has been revealed successfully.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="revealed-password"
                          className="dark:text-white"
                        >
                          Your Password
                        </Label>
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
                </div>
                <DialogFooter>
                  {!revealedPassword ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetViewPasswordForm}
                        className="dark:border-gray-700 dark:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleViewPassword}
                        disabled={isLoading || !allAnswersFilled}
                        className="gap-2"
                      >
                        {isLoading && (
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        )}
                        <span>Reveal Password</span>
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={resetViewPasswordForm}
                      className="dark:border-gray-700 dark:text-white"
                    >
                      Close
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium dark:text-white">Change Password</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Change your account password
              </p>
            </div>
            <Dialog
              open={isPasswordDialogOpen}
              onOpenChange={setIsPasswordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 dark:border-gray-700 dark:text-white"
                >
                  <Key className="h-4 w-4" />
                  <span>Change Password</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-900 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">
                    Change Password
                  </DialogTitle>
                  <DialogDescription className="dark:text-gray-400">
                    Enter your current password and a new password
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-4 py-2"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="current-password"
                      className="dark:text-white"
                    >
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="dark:text-white">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="dark:text-white"
                    >
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPasswordDialogOpen(false)}
                      className="dark:border-gray-700 dark:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading && (
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      )}
                      <span>Save Changes</span>
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;