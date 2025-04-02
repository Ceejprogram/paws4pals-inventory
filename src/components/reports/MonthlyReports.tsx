
import React from "react";
import MonthlyStockMovement from "./monthly/MonthlyStockMovement";
import NetStockChange from "./monthly/NetStockChange";
import MonthlyStockDetail from "./monthly/MonthlyStockDetail";

interface MonthlyData {
  month: string;
  positive: number;
  negative: number;
  net: number;
}

interface MonthlyReportsProps {
  monthlyData: MonthlyData[];
}

const MonthlyReports = ({ monthlyData }: MonthlyReportsProps) => {
  return (
    <>
      <MonthlyStockMovement monthlyData={monthlyData} />
      <NetStockChange monthlyData={monthlyData} />
      <MonthlyStockDetail monthlyData={monthlyData} />
    </>
  );
};

export default MonthlyReports;
