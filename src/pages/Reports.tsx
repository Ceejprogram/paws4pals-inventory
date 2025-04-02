
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportTypeSelector from "@/components/reports/ReportTypeSelector";
import MonthlyReports from "@/components/reports/MonthlyReports";
import CategoryReports from "@/components/reports/CategoryReports";
import TurnoverReports from "@/components/reports/TurnoverReports";
import { 
  generateMonthlyData, 
  generateCategoryData, 
  generateTurnoverData 
} from "@/lib/reports-data";

const Reports = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("monthly");
  const [monthlyData, setMonthlyData] = useState(generateMonthlyData());
  const [categoryData, setCategoryData] = useState(generateCategoryData());
  const [turnoverData, setTurnoverData] = useState(generateTurnoverData());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-light"></div>
          <div className="h-4 w-32 bg-brand-light rounded"></div>
          <div className="h-3 w-24 bg-brand-light rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ReportsHeader 
        title="Reports & Analytics" 
        subtitle="Generate detailed reports on inventory trends and stock levels" 
      />

      {/* Report Type Selector */}
      <ReportTypeSelector reportType={reportType} setReportType={setReportType} />

      {/* Report Content based on selected type */}
      {reportType === "monthly" && <MonthlyReports monthlyData={monthlyData} />}
      {reportType === "category" && <CategoryReports categoryData={categoryData} />}
      {reportType === "turnover" && <TurnoverReports turnoverData={turnoverData} />}
    </div>
  );
};

export default Reports;
