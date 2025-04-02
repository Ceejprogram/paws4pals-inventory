
import React from "react";
import CategoryCharts from "./category/CategoryCharts";
import CategoryDetail from "./category/CategoryDetail";

interface CategoryData {
  name: string;
  stock: number;
  value: number;
}

interface CategoryReportsProps {
  categoryData: CategoryData[];
}

const CategoryReports = ({ categoryData }: CategoryReportsProps) => {
  return (
    <>
      <CategoryCharts categoryData={categoryData} />
      <CategoryDetail categoryData={categoryData} />
    </>
  );
};

export default CategoryReports;
