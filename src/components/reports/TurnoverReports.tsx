
import React from "react";
import TurnoverRateChart from "./turnover/TurnoverRateChart";
import TurnoverAnalysis from "./turnover/TurnoverAnalysis";

interface TurnoverData {
  name: string;
  turnover: string;
}

interface TurnoverReportsProps {
  turnoverData: TurnoverData[];
}

const TurnoverReports = ({ turnoverData }: TurnoverReportsProps) => {
  return (
    <>
      <TurnoverRateChart turnoverData={turnoverData} />
      <TurnoverAnalysis turnoverData={turnoverData} />
    </>
  );
};

export default TurnoverReports;
