'use client';

import { useMemo } from 'react';
import { Area, Line, XAxis, YAxis, CartesianGrid, ComposedChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RealEstateData } from '@/lib/types';

interface InventoryChartProps {
  data: RealEstateData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  residentialInventory: {
    label: 'Active Listings',
    color: 'var(--chart-1)',
  },
  newListings: {
    label: 'New Listings',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function InventoryChart({
  data,
  title = 'Market Inventory',
  description = 'Active listings and new listings over time',
}: InventoryChartProps) {
  const chartData = useMemo(() => data
    .filter((row) => row.residentialInventory !== null || row.newListings !== null)
    .map((row) => ({
      date: row.date.toISOString().slice(0, 7),
      displayDate: row.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short' }),
      residentialInventory: row.residentialInventory,
      newListings: row.newListings,
    })), [data]);

  return (
    <Card className="bg-card rounded-xl card-shadow border-0 overflow-hidden min-w-0" role="figure" aria-label={`${title}: ${description}`}>
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="font-display text-lg font-medium">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-5">
        <ChartContainer config={chartConfig} className="h-[280px] sm:h-[320px] w-full">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            syncId="dashboard"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="residentialInventory"
              fill="var(--color-residentialInventory)"
              fillOpacity={0.3}
              stroke="var(--color-residentialInventory)"
              strokeWidth={2}
              connectNulls
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="newListings"
              stroke="var(--color-newListings)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ChartContainer>
        <div className="mt-3 text-xs text-muted-foreground">
          Rising inventory typically indicates a shift toward a buyer&apos;s market
        </div>
      </CardContent>
    </Card>
  );
}
