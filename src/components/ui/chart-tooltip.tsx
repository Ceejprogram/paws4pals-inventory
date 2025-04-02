import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

export interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: number, name: string) => [string, string];
  className?: string;
  children?: React.ReactNode;
}

export const CustomChartTooltip = ({
  active,
  payload,
  label,
  formatter,
  className,
}: ChartTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-2 shadow-md",
        className
      )}
    >
      {label && (
        <div className="mb-2 text-sm font-medium">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          // Map data keys to human-readable labels
          const getLabel = (name: string) => {
            switch (name) {
              case "incoming":
                return "Items Purchased";
              case "outgoing":
                return "Items Sold";
              default:
                return name;
            }
          };
          
          const displayName = getLabel(entry.dataKey || entry.name);
          const displayValue = formatter
            ? formatter(entry.value, entry.name)[0]
            : entry.value;
          const displayUnit = formatter
            ? formatter(entry.value, entry.name)[1]
            : "";

          return (
            <div
              key={`item-${index}`}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {displayName}:
                </span>
              </div>
              <span className="text-xs font-medium">
                {displayValue} {displayUnit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};