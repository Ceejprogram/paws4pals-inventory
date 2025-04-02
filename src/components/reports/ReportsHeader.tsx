
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, Printer } from "lucide-react";

interface ReportsHeaderProps {
  title: string;
  subtitle: string;
}

const ReportsHeader = ({ title, subtitle }: ReportsHeaderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleExport = (format: string) => {
    toast({
      title: "Report Exported",
      description: `Report has been exported in ${format.toUpperCase()} format.`,
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Requested",
      description: "Preparing report for printing...",
    });

    // In a real app, this would trigger the print dialog
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}, {user?.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
          <span>Print</span>
        </Button>
        <Select
          defaultValue="pdf"
          onValueChange={(value) => handleExport(value)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              <span>Export Report</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">Export as PDF</SelectItem>
            <SelectItem value="excel">Export as Excel</SelectItem>
            <SelectItem value="csv">Export as CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ReportsHeader;
