
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyData {
  month: string;
  positive: number;
  negative: number;
  net: number;
}

interface MonthlyStockMovementProps {
  monthlyData: MonthlyData[];
}

const MonthlyStockMovement = ({ monthlyData }: MonthlyStockMovementProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Monthly Stock Movement Report</CardTitle>
        <CardDescription>
          Showing positive (incoming) and negative (outgoing) stock
          movements for the past 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              />
              <Legend />
              <Bar
                dataKey="positive"
                name="Items Received"
                fill="#8D7B68"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="negative"
                name="Items Shipped"
                fill="#C8B6A6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyStockMovement;
