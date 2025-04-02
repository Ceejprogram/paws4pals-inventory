import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface MonthlyData {
  month: string;
  positive: number;
  negative: number;
  net: number;
}

interface MonthlyStockDetailProps {
  monthlyData: MonthlyData[];
}

const MonthlyStockDetail = ({ monthlyData }: MonthlyStockDetailProps) => {
  // Calculate total net change to determine overall trend
  const netTotal = monthlyData.reduce((sum, month) => sum + month.net, 0);

  // Determine the trend direction for the totals row
  const getTrendBadge = (netChange: number) => {
    if (netChange > 0) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-600 border-green-200"
        >
          <TrendingUp className="h-3 w-3 mr-1" /> Increasing
        </Badge>
      );
    } else if (netChange < 0) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-600 border-red-200"
        >
          <TrendingDown className="h-3 w-3 mr-1" /> Decreasing
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-600 border-gray-200"
        >
          <ArrowRight className="h-3 w-3 mr-1" /> Stable
        </Badge>
      );
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Monthly Stock Detail Report</CardTitle>
        <CardDescription>
          Detailed summary of stock movements with totals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Items Received (+)</TableHead>
              <TableHead className="text-right">Items Shipped (-)</TableHead>
              <TableHead className="text-right">Net Change</TableHead>
              <TableHead className="text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyData.map((month) => (
              <TableRow key={month.month}>
                <TableCell className="font-medium">{month.month}</TableCell>
                <TableCell className="text-right font-medium text-green-600">
                  +{month.positive}
                </TableCell>
                <TableCell className="text-right font-medium text-red-600">
                  -{month.negative}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span
                    className={
                      month.net >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {month.net >= 0 ? `+${month.net}` : month.net}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {month.net > 0 ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-600 border-green-200"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" /> Increase
                    </Badge>
                  ) : month.net < 0 ? (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-600 border-red-200"
                    >
                      <TrendingDown className="h-3 w-3 mr-1" /> Decrease
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-600 border-gray-200"
                    >
                      <ArrowRight className="h-3 w-3 mr-1" /> No Change
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {/* Totals row */}
            <TableRow className="bg-gray-50 dark:bg-gray-800/50 font-medium">
              <TableCell>Total</TableCell>
              <TableCell className="text-right text-green-600 dark:text-green-400">
                +{monthlyData.reduce((sum, month) => sum + month.positive, 0)}
              </TableCell>
              <TableCell className="text-right text-red-600 dark:text-red-400">
                -{monthlyData.reduce((sum, month) => sum + month.negative, 0)}
              </TableCell>
              <TableCell className="text-right">
                {(() => {
                  return (
                    <span
                      className={
                        netTotal >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {netTotal >= 0 ? `+${netTotal}` : netTotal}
                    </span>
                  );
                })()}
              </TableCell>
              <TableCell className="text-center">
                {getTrendBadge(netTotal)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MonthlyStockDetail;
