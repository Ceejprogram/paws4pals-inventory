
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const AppearanceTab = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="dark:text-white">Appearance Settings</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Customize the appearance of the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium dark:text-white">Theme</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Switch between light and dark mode
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                className={`gap-2 ${
                  theme === "light"
                    ? ""
                    : "dark:border-gray-700 dark:text-white"
                }`}
                onClick={() => theme === "dark" && toggleTheme()}
              >
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                className={`gap-2 ${
                  theme === "dark"
                    ? ""
                    : "dark:border-gray-700 dark:text-white"
                }`}
                onClick={() => theme === "light" && toggleTheme()}
              >
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceTab;
