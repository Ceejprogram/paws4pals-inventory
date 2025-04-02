
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const NotificationsTab = () => {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    stockAlerts: true,
    updates: false,
    marketing: false,
  });

  const handleNotificationUpdate = (
    key: keyof typeof notifications,
    value: boolean
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }));

    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications are now ${
        value ? "enabled" : "disabled"
      }.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="dark:text-white">Notification Settings</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Manage how you receive notifications and alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <h4 className="font-medium dark:text-white">
                Email Notifications
              </h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                handleNotificationUpdate("email", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <h4 className="font-medium dark:text-white">Push Notifications</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) =>
                handleNotificationUpdate("push", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <h4 className="font-medium dark:text-white">
                Stock Alert Notifications
              </h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Get notified when stock levels are low or out
              </p>
            </div>
            <Switch
              checked={notifications.stockAlerts}
              onCheckedChange={(checked) =>
                handleNotificationUpdate("stockAlerts", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <h4 className="font-medium dark:text-white">Product Updates</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Get notified about new features and improvements
              </p>
            </div>
            <Switch
              checked={notifications.updates}
              onCheckedChange={(checked) =>
                handleNotificationUpdate("updates", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <h4 className="font-medium dark:text-white">
                Marketing Communications
              </h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Receive newsletters and promotional emails
              </p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                handleNotificationUpdate("marketing", checked)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
