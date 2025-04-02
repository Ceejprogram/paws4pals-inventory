
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  phone: string;
  role: string;
}

const ProfileTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Default profile information - using empty strings when properties might not exist
  const [profileInfo, setProfileInfo] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    bio: "", // This field doesn't exist in the user type, so using empty string
    phone: "",
    role: user?.role || "",
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };

  // Define user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="dark:text-white">Profile Information</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Update your profile details and personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Avatar className="w-16 h-16 border-2 border-gray-200 dark:border-gray-700">
            <AvatarImage src={""} alt={user?.name || "User"} />
            <AvatarFallback className="text-lg bg-brand-light dark:bg-brand-dark text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium dark:text-white">{user?.name}</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              {user?.email}
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {user?.role}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-2 dark:border-gray-700 dark:text-white"
          >
            <Upload className="h-4 w-4" />
            <span>Change Avatar</span>
          </Button>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-white">
                Full Name
              </Label>
              <Input
                id="name"
                value={profileInfo.name}
                onChange={(e) =>
                  setProfileInfo({ ...profileInfo, name: e.target.value })
                }
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profileInfo.email}
                onChange={(e) =>
                  setProfileInfo({
                    ...profileInfo,
                    email: e.target.value,
                  })
                }
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-white">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profileInfo.phone}
                onChange={(e) =>
                  setProfileInfo({
                    ...profileInfo,
                    phone: e.target.value,
                  })
                }
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="dark:text-white">
                Role
              </Label>
              <Input
                id="role"
                value={profileInfo.role}
                disabled
                className="bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio" className="dark:text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profileInfo.bio}
                onChange={(e) =>
                  setProfileInfo({ ...profileInfo, bio: e.target.value })
                }
                className="min-h-[100px] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Tell us a little about yourself"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              )}
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
