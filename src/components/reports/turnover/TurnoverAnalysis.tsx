
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TurnoverData {
  name: string;
  turnover: string;
}

interface TurnoverAnalysisProps {
  turnoverData: TurnoverData[];
}

const TurnoverAnalysis = ({ turnoverData }: TurnoverAnalysisProps) => {
  const averageTurnover = (
    turnoverData.reduce((sum, data) => sum + parseFloat(data.turnover), 0) /
    turnoverData.length
  ).toFixed(2);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Turnover Rate Analysis</CardTitle>
        <CardDescription>
          Understanding your inventory efficiency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              What is Stock Turnover Rate?
            </h3>
            <p className="text-gray-600">
              Stock turnover rate measures how many times your inventory
              is sold and replaced over a specific period. A higher
              turnover rate indicates efficient inventory management,
              while a lower rate may suggest overstocking or obsolescence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-green-100 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-800">
                  Good Turnover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 text-sm">
                  2.0+ times per month indicates efficient inventory
                  management.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-amber-100 bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-800">
                  Average Turnover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700 text-sm">
                  1.5-2.0 times per month is acceptable but could be
                  improved.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-red-100 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-800">
                  Poor Turnover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 text-sm">
                  Below 1.5 times per month suggests possible overstocking
                  issues.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 border border-brand-lightest bg-brand-lightest/20 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your Current Performance
            </h3>
            <p className="text-gray-600 mb-4">
              Your average turnover rate for the past 12 months is{" "}
              <span className="font-semibold">
                {averageTurnover} times per month
              </span>.
            </p>

            <h4 className="font-medium text-gray-900 mb-2">
              Recommendations:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                Review slow-moving inventory and consider promotional
                activities
              </li>
              <li>Optimize reorder points to reduce excess inventory</li>
              <li>
                Consider adjusting order quantities based on seasonal
                demand
              </li>
              <li>Identify and focus on high-turnover products</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TurnoverAnalysis;
