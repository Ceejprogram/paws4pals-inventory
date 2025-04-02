
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryDistributionChartProps {
  categoryDistribution: {
    name: string;
    count: number;
  }[];
}

const CategoryDistributionChart = ({
  categoryDistribution,
}: CategoryDistributionChartProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Items by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryDistribution}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 10, left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
                width={80}
              />
              <Tooltip
                formatter={(value, name) => [value, "Items"]}
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              />
              <Bar
                dataKey="count"
                fill="#C8B6A6"
                radius={[0, 4, 4, 0]}
                barSize={20}
                name="Items"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDistributionChart;
