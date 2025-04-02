
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
} from "recharts";

interface MonthlyData {
  month: string;
  positive: number;
  negative: number;
  net: number;
}

interface NetStockChangeProps {
  monthlyData: MonthlyData[];
}

const NetStockChange = ({ monthlyData }: NetStockChangeProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Net Stock Change</CardTitle>
        <CardDescription>Monthly net change in inventory levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
              <Line
                type="monotone"
                dataKey="net"
                name="Net Change"
                stroke="#A4907C"
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

export default NetStockChange;
