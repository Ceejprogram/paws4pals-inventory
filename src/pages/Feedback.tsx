import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  HelpCircle,
  BookOpen,
  FileText,
  Video,
  PackageCheck,
  Zap,
  Shield,
} from "lucide-react";

const Feedback = () => {
  const { toast } = useToast();
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll get back to you soon.",
      });

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setFeedbackType("suggestion");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Feedback & Support
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We'd love to hear from you
          </p>
        </div>
      </div>

      {/* Feedback Form */}
      <Card className="border-0 shadow-sm dark:bg-gray-950 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <MessageSquare className="h-5 w-5" />
            <span>Send Feedback</span>
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Share your thoughts, report issues, or suggest improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type" className="dark:text-white">
                Feedback Type
              </Label>
              <RadioGroup
                id="feedback-type"
                value={feedbackType}
                onValueChange={setFeedbackType}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suggestion" id="suggestion" />
                  <Label
                    htmlFor="suggestion"
                    className="font-normal dark:text-gray-300"
                  >
                    Suggestion
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="issue" id="issue" />
                  <Label
                    htmlFor="issue"
                    className="font-normal dark:text-gray-300"
                  >
                    Report an Issue
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="question" id="question" />
                  <Label
                    htmlFor="question"
                    className="font-normal dark:text-gray-300"
                  >
                    Ask a Question
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="dark:text-white">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Please describe your feedback in detail..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-brand-dark hover:bg-brand-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help & Resources */}
      <Card className="border-0 shadow-sm dark:bg-gray-950 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Help & Resources</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Find answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-card dark:bg-gray-900 dark:border-gray-800">
              <h3 className="font-semibold mb-2 dark:text-white">
                Getting Started Guide
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn the basics of managing your inventory
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-brand-dark mt-2 flex items-center gap-1"
              >
                <BookOpen className="h-4 w-4" />
                <span>Read Guide</span>
              </Button>
            </div>

            <div className="p-4 rounded-lg border bg-card dark:bg-gray-900 dark:border-gray-800">
              <h3 className="font-semibold mb-2 dark:text-white">
                Frequently Asked Questions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quick answers to common questions
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-brand-dark mt-2 flex items-center gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                <span>View FAQs</span>
              </Button>
            </div>

            <div className="p-4 rounded-lg border bg-card dark:bg-gray-900 dark:border-gray-800">
              <h3 className="font-semibold mb-2 dark:text-white">
                Video Tutorials
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step-by-step visual guides
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-brand-dark mt-2 flex items-center gap-1"
              >
                <Video className="h-4 w-4" />
                <span>Watch Tutorials</span>
              </Button>
            </div>

            <div className="p-4 rounded-lg border bg-card dark:bg-gray-900 dark:border-gray-800">
              <h3 className="font-semibold mb-2 dark:text-white">
                Documentation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed system documentation
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-brand-dark mt-2 flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                <span>Read Docs</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Card className="border-0 shadow-sm dark:bg-gray-950 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Recent Updates</CardTitle>
          <CardDescription className="dark:text-gray-400">
            What's new in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                <PackageCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  New Batch Import Feature
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  You can now import inventory items from CSV files.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  May 12, 2023
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Performance Improvements
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  We've optimized the system for faster loading times and better
                  responsiveness.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  April 28, 2023
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Security Enhancements
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Added two-factor authentication and improved password
                  policies.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  April 15, 2023
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Feedback;
