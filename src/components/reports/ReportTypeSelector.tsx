
import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, PieChart, BarChart3 } from "lucide-react";

interface ReportTypeSelectorProps {
  reportType: string;
  setReportType: (type: string) => void;
}

const ReportTypeSelector = ({ reportType, setReportType }: ReportTypeSelectorProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="report-type" className="w-[250px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Monthly Stock Movements</span>
                </div>
              </SelectItem>
              <SelectItem value="category">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  <span>Category Distribution</span>
                </div>
              </SelectItem>
              <SelectItem value="turnover">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Stock Turnover Rate</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportTypeSelector;
