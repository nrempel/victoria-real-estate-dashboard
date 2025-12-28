'use client';

import { useMemo } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
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

interface PriceTrendChartProps {
  data: RealEstateData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  sfhMedian: {
    label: 'Single Family Home',
    color: 'var(--chart-1)',
  },
  condoMedian: {
    label: 'Condo',
    color: 'var(--chart-2)',
  },
  townhouseMedian: {
    label: 'Townhouse',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function PriceTrendChart({
  data,
  title = 'Price Trends',
  description = 'Median prices by property type over time',
}: PriceTrendChartProps) {
  const chartData = useMemo(() => data
    .filter((row) => row.sfhMedian !== null || row.condoMedian !== null || row.townhouseMedian !== null)
    .map((row) => ({
      date: row.date.toISOString().slice(0, 7),
      displayDate: row.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short' }),
      sfhMedian: row.sfhMedian,
      condoMedian: row.condoMedian,
      townhouseMedian: row.townhouseMedian,
    })), [data]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <Card className="bg-card rounded-xl card-shadow border-0 overflow-hidden min-w-0" role="figure" aria-label={`${title}: ${description}`}>
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="font-display text-lg font-medium">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-5">
        <ChartContainer config={chartConfig} className="h-[280px] sm:h-[320px] w-full">
          <LineChart
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
              tickFormatter={formatYAxis}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="sfhMedian"
              stroke="var(--color-sfhMedian)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="condoMedian"
              stroke="var(--color-condoMedian)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="townhouseMedian"
              stroke="var(--color-townhouseMedian)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
