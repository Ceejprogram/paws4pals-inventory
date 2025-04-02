
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { format, subDays, subMonths, getWeek, startOfMonth, endOfMonth, eachWeekOfInterval } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Types for the time period selection
type TimePeriod = "weekly" | "monthly" | "yearly";

// Generate mock activity data based on selected time period
const generateMockActivityData = (period: TimePeriod) => {
  const today = new Date();
  let data = [];

  if (period === "weekly") {
    // Generate data for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, "EEE, MMM d"); // Format: Mon, Jan 1

      data.push({
        name: format(date, "EEE"),
        fullDate: formattedDate,
        incoming: Math.floor(Math.random() * 30) + 5,
        outgoing: Math.floor(Math.random() * 20) + 5,
        date: date,
      });
    }
  } else if (period === "monthly") {
    // Generate data for each week of the current month
    const startOfCurrentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);

    const weeksInMonth = eachWeekOfInterval({
      start: startOfCurrentMonth,
      end: endOfCurrentMonth,
    });

    data = weeksInMonth.map((weekStart, index) => {
      const weekNumber = getWeek(weekStart);
      const formattedDate = `Week ${weekNumber}: ${format(weekStart, "MMM d")}`;

      return {
        name: `W${weekNumber}`,
        fullDate: formattedDate,
        incoming: Math.floor(Math.random() * 100) + 20,
        outgoing: Math.floor(Math.random() * 80) + 15,
        date: weekStart,
      };
    });
  } else if (period === "yearly") {
    // Generate data for the past 12 months
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(today, i);
      const formattedDate = format(date, "MMMM yyyy"); // Format: January 2023

      data.push({
        name: format(date, "MMM"),
        fullDate: formattedDate,
        incoming: Math.floor(Math.random() * 300) + 50,
        outgoing: Math.floor(Math.random() * 250) + 40,
        date: date,
      });
    }
  }

  return data;
};

const InventoryActivityChart = () => {
  const [inventoryPeriod, setInventoryPeriod] = useState<TimePeriod>("weekly");
  const [activityData, setActivityData] = useState(generateMockActivityData("weekly"));

  useEffect(() => {
    // Update activity data when period changes
    setActivityData(generateMockActivityData(inventoryPeriod));
  }, [inventoryPeriod]);

  // Handle changing the time period
  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setInventoryPeriod(newPeriod);
  };

  return (
    <Card className="lg:col-span-2 border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory Activity</CardTitle>
            <CardDescription>
              {inventoryPeriod === "weekly" &&
                "Past 7 days of inventory movement"}
              {inventoryPeriod === "monthly" &&
                "Current month inventory movement by week"}
              {inventoryPeriod === "yearly" &&
                "Past 12 months of inventory movement"}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={inventoryPeriod === "weekly" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => handlePeriodChange("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={inventoryPeriod === "monthly" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => handlePeriodChange("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={inventoryPeriod === "yearly" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => handlePeriodChange("yearly")}
            >
              Yearly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ChartContainer
            config={{
              incoming: {
                label: "Items Purchased",
                color: "#8D7B68",
              },
              outgoing: {
                label: "Items Sold",
                color: "#A4907C",
              },
            }}
          >
            <AreaChart
              data={activityData}
              margin={{ top: 10, right: 10, bottom: 80, left: 0 }}
            >
              <defs>
                <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8D7B68" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8D7B68" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A4907C" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#A4907C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
                width={30}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        label={payload[0]?.payload?.fullDate || ""}
                      />
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="incoming"
                stroke="#8D7B68"
                fillOpacity={1}
                fill="url(#colorIncoming)"
                name="Purchased"
              />
              <Area
                type="monotone"
                dataKey="outgoing"
                stroke="#A4907C"
                fillOpacity={1}
                fill="url(#colorOutgoing)"
                name="Sold"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryActivityChart;
