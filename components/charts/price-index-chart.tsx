'use client';

import { useMemo } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
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

interface PriceIndexChartProps {
  data: RealEstateData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  mlsHpiSfh: {
    label: 'MLS HPI (SFH)',
    color: 'var(--chart-1)',
  },
  teranetIndex: {
    label: 'Teranet Index',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function PriceIndexChart({
  data,
  title = 'Price Index (MLS HPI)',
  description = 'Home Price Index - smoothed price trends over time',
}: PriceIndexChartProps) {
  const chartData = useMemo(() => data
    .filter((row) => row.mlsHpiSfh !== null || row.teranetIndex !== null)
    .map((row) => ({
      date: row.date.toISOString().slice(0, 7),
      displayDate: row.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short' }),
      mlsHpiSfh: row.mlsHpiSfh,
      teranetIndex: row.teranetIndex,
    })), [data]);

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
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['auto', 'auto']}
            />
            <ReferenceLine
              y={100}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{ value: 'Baseline (100)', position: 'right', fontSize: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="mlsHpiSfh"
              stroke="var(--color-mlsHpiSfh)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="teranetIndex"
              stroke="var(--color-teranetIndex)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
        <div className="mt-3 text-xs text-muted-foreground">
          Home Price Index provides a smoothed view of price trends, less volatile than monthly medians
        </div>
      </CardContent>
    </Card>
  );
}
