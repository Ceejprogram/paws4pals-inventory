import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Download,
  Timer,
  Calendar,
  RotateCcw,
  Archive,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BackupRecord {
  id: number;
  date: Date;
  size: string;
  type: "manual" | "automatic";
}

const DataBackupTab = () => {
  const { toast } = useToast();
  const [backupFrequency, setBackupFrequency] = useState<string>("daily");
  const [autoBackup, setAutoBackup] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRestoreLoading, setIsRestoreLoading] = useState<boolean>(false);
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>([]);
  const [lastBackupDate, setLastBackupDate] = useState<Date>(new Date());
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date();
    const history: BackupRecord[] = [
      { id: 1, date: today, size: "2.4 MB", type: "automatic" },
      { id: 2, date: new Date(today.getTime() - 24 * 60 * 60 * 1000), size: "2.3 MB", type: "automatic" },
      { id: 3, date: new Date(today.getTime() - 48 * 60 * 60 * 1000), size: "2.3 MB", type: "automatic" },
      { id: 4, date: new Date(today.getTime() - 72 * 60 * 60 * 1000), size: "2.2 MB", type: "manual" },
      { id: 5, date: new Date(today.getTime() - 96 * 60 * 60 * 1000), size: "2.2 MB", type: "automatic" },
    ];
    setBackupHistory(history);
    setLastBackupDate(today);
  }, []);

  const handleManualBackup = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newBackup: BackupRecord = {
        id: backupHistory.length + 1,
        date: new Date(),
        size: "2.4 MB",
        type: "manual",
      };
      setBackupHistory([newBackup, ...backupHistory]);
      setLastBackupDate(new Date());
      setIsLoading(false);
      toast({
        title: "Backup Created",
        description: "Your data has been successfully backed up.",
      });
    }, 1500);
  };

  const handleDownloadBackup = (backup: BackupRecord) => {
    setSelectedBackup(backup);
  };

  const confirmDownload = () => {
    if (!selectedBackup) return;
    setIsDownloadLoading(true);
    setTimeout(() => {
      setIsDownloadLoading(false);
      toast({
        title: "Backup Downloaded",
        description: `The backup from ${format(selectedBackup.date, "MMM dd, yyyy HH:mm")} has been successfully downloaded.`,
      });
    }, 1500);
  };

  const handleAutoBackupChange = (checked: boolean) => {
    setAutoBackup(checked);
    toast({
      title: checked ? "Auto Backup Enabled" : "Auto Backup Disabled",
      description: checked
        ? `Your data will be automatically backed up ${backupFrequency}.`
        : "Automatic backup has been disabled.",
    });
  };

  const handleFrequencyChange = (value: string) => {
    setBackupFrequency(value);
    if (autoBackup) {
      toast({
        title: "Backup Frequency Changed",
        description: `Automatic backups will now occur ${value}.`,
      });
    }
  };

  const handleRestoreBackup = (backup: BackupRecord) => {
    setSelectedBackup(backup);
  };

  const handleDeleteBackup = (backup: BackupRecord) => {
    setSelectedBackup(backup);
    setIsDeleteDialogOpen(true);
  };

  const confirmRestore = () => {
    if (!selectedBackup) return;
    setIsRestoreLoading(true);
    setTimeout(() => {
      setIsRestoreLoading(false);
      toast({
        title: "Restore Completed",
        description: `Your data has been successfully restored from the backup created on ${format(selectedBackup.date, "MMM dd, yyyy HH:mm")}.`,
      });
    }, 2000);
  };

  const confirmDelete = () => {
    if (!selectedBackup) return;
    setIsDeleteLoading(true);
    setTimeout(() => {
      setBackupHistory(backupHistory.filter((b) => b.id !== selectedBackup.id));
      setIsDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Backup Deleted",
        description: `The backup from ${format(selectedBackup.date, "MMM dd, yyyy HH:mm")} has been successfully deleted.`,
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="dark:text-white">Data Backup & Recovery</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Manage your data backups and recovery options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Manual Backup</CardTitle>
              <CardDescription>Create a backup of your inventory data on demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last backup: {format(lastBackupDate, "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <Button onClick={handleManualBackup} disabled={isLoading} className="w-full gap-2">
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                  <span>Create Backup Now</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Automatic Backup</CardTitle>
              <CardDescription>Configure scheduled automatic backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Enable Auto Backup</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically backup your data</p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={handleAutoBackupChange} />
                </div>
                <div className="space-y-2">
                  <p className="font-medium dark:text-white">Backup Frequency</p>
                  <Select value={backupFrequency} onValueChange={handleFrequencyChange} disabled={!autoBackup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4" /> <span>Hourly</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="daily">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> <span>Daily</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="weekly">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> <span>Weekly</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="monthly">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> <span>Monthly</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="yearly">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> <span>Yearly</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Backup History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backupHistory.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>{format(backup.date, "MMM dd, yyyy HH:mm")}</TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>
                    <span className={`capitalize ${backup.type === "manual" ? "text-blue-600" : "text-green-600"}`}>
                      {backup.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <AlertDialog>
                            <div className="inline-block">
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownloadBackup(backup)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                            </div>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Download Backup</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to download this backup from{" "}
                                  {format(backup.date, "MMM dd, yyyy HH:mm")}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={confirmDownload}
                                  disabled={isDownloadLoading}
                                >
                                  {isDownloadLoading ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                                  ) : null}
                                  Download
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <TooltipContent>
                            <p>Download Backup</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <AlertDialog>
                            <div className="inline-block">
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-amber-600"
                                    onClick={() => handleRestoreBackup(backup)}
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                            </div>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Restore Backup</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to restore this backup from{" "}
                                  {format(backup.date, "MMM dd, yyyy HH:mm")}? This will overwrite your current data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-amber-600 hover:bg-amber-700"
                                  onClick={confirmRestore}
                                  disabled={isRestoreLoading}
                                >
                                  {isRestoreLoading ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                                  ) : null}
                                  Restore
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <TooltipContent>
                            <p>Restore Backup</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeleteBackup(backup)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Backup</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Backup</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this backup from{" "}
                {selectedBackup ? format(selectedBackup.date, "MMM dd, yyyy HH:mm") : ""}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={confirmDelete}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                ) : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default DataBackupTab;