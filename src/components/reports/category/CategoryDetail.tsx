import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CategoryData {
  name: string;
  stock: number;
  value: number;
}

interface CategoryDetailProps {
  categoryData: CategoryData[];
}

const CategoryDetail = ({ categoryData }: CategoryDetailProps) => {
  const totalStock = categoryData.reduce((sum, cat) => sum + cat.stock, 0);
  const totalValue = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  // Format currency with commas
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace("PHP", "₱");
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Category Detail Report</CardTitle>
        <CardDescription>
          Detailed breakdown of stock by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Stock Quantity</TableHead>
              <TableHead className="text-right">Stock Value</TableHead>
              <TableHead className="text-right">% of Total Quantity</TableHead>
              <TableHead className="text-right">% of Total Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryData.map((category) => {
              const stockPercent = (category.stock / totalStock) * 100;
              const valuePercent = (category.value / totalValue) * 100;

              return (
                <TableRow key={category.name}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">{category.stock}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(category.value)}
                  </TableCell>
                  <TableCell className="text-right">
                    {stockPercent.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {valuePercent.toFixed(1)}%
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Totals row */}
            <TableRow className="bg-gray-50 dark:bg-gray-800/50 font-medium">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{totalStock}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalValue)}
              </TableCell>
              <TableCell className="text-right">100%</TableCell>
              <TableCell className="text-right">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoryDetail;
