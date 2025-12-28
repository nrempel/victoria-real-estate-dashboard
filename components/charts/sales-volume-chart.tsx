'use client';

import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
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

interface SalesVolumeChartProps {
  data: RealEstateData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  sfhSales: {
    label: 'Single Family Home',
    color: 'var(--chart-1)',
  },
  condoSales: {
    label: 'Condo',
    color: 'var(--chart-2)',
  },
  townhouseSales: {
    label: 'Townhouse',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function SalesVolumeChart({
  data,
  title = 'Sales Volume',
  description = 'Monthly sales by property type',
}: SalesVolumeChartProps) {
  const chartData = useMemo(() => data
    .filter((row) => row.sfhSales !== null || row.condoSales !== null || row.townhouseSales !== null)
    .map((row) => ({
      date: row.date.toISOString().slice(0, 7),
      displayDate: row.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short' }),
      sfhSales: row.sfhSales,
      condoSales: row.condoSales,
      townhouseSales: row.townhouseSales,
    })), [data]);

  return (
    <Card className="bg-card rounded-xl card-shadow border-0" role="figure" aria-label={`${title}: ${description}`}>
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="font-display text-lg font-medium">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-5">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="sfhSales"
              fill="var(--color-sfhSales)"
              stackId="sales"
            />
            <Bar
              dataKey="condoSales"
              fill="var(--color-condoSales)"
              stackId="sales"
            />
            <Bar
              dataKey="townhouseSales"
              fill="var(--color-townhouseSales)"
              radius={[4, 4, 0, 0]}
              stackId="sales"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
