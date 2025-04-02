
import { MOCK_INVENTORY } from "./mock-data";
import { format, subMonths, getWeek, subDays, eachMonthOfInterval, endOfMonth, startOfMonth } from "date-fns";

// Generate monthly report data with positive and negative stock
export const generateMonthlyData = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get current month
  const currentMonth = new Date().getMonth();

  // Generate data for the past 6 months
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;

    // Generate random positive stock (items received)
    const positive = Math.floor(Math.random() * 80) + 20;

    // Generate random negative stock (items sold/used)
    const negative = Math.floor(Math.random() * 70) + 10;

    // Calculate net change
    const net = positive - negative;

    data.push({
      month: months[monthIndex],
      positive,
      negative,
      net,
    });
  }

  return data;
};

// Generate category distribution data
export const generateCategoryData = () => {
  const categories = [...new Set(MOCK_INVENTORY.map((item) => item.category))];

  return categories.map((category) => {
    const items = MOCK_INVENTORY.filter((item) => item.category === category);
    const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce(
      (sum, item) => sum + item.quantity * item.costPrice,
      0
    );

    return {
      name: category,
      stock: totalStock,
      value: parseFloat(totalValue.toFixed(2)),
    };
  });
};

// Generate stock turnover data
export const generateTurnoverData = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get current month
  const currentMonth = new Date().getMonth();

  // Generate data for the past 12 months
  return Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth - 11 + i + 12) % 12;

    return {
      name: months[monthIndex],
      turnover: (Math.random() * 2 + 1).toFixed(2),
    };
  });
};

export interface MonthlyData {
  month: string;
  positive: number;
  negative: number;
  net: number;
}

export interface CategoryData {
  name: string;
  stock: number;
  value: number;
}

export interface TurnoverData {
  name: string;
  turnover: string;
}
