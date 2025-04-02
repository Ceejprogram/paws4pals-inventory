
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface TurnoverData {
  name: string;
  turnover: string;
}

interface TurnoverRateChartProps {
  turnoverData: TurnoverData[];
}

const TurnoverRateChart = ({ turnoverData }: TurnoverRateChartProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Monthly Stock Turnover Rate</CardTitle>
        <CardDescription>
          How many times inventory is sold and replaced over a period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={turnoverData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`${value} times`, "Turnover Rate"]}
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="turnover"
                name="Turnover Rate"
                stroke="#8D7B68"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TurnoverRateChart;
