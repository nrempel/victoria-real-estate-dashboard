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

interface MarketHealthChartProps {
  data: RealEstateData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  salesToNewListings: {
    label: 'Sales-to-Listings Ratio',
    color: 'var(--chart-1)',
  },
  residentialMoi: {
    label: 'Months of Inventory',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function MarketHealthChart({
  data,
  title = 'Market Health',
  description = 'Sales-to-listings ratio and months of inventory',
}: MarketHealthChartProps) {
  const chartData = useMemo(() => data
    .filter((row) => row.salesToNewListings !== null || row.residentialMoi !== null)
    .map((row) => ({
      date: row.date.toISOString().slice(0, 7),
      displayDate: row.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short' }),
      salesToNewListings: row.salesToNewListings,
      residentialMoi: row.residentialMoi,
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
              yAxisId="left"
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value}`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            {/* Reference lines for market conditions */}
            <ReferenceLine
              yAxisId="left"
              y={50}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{ value: 'Balanced (50%)', position: 'right', fontSize: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="salesToNewListings"
              stroke="var(--color-salesToNewListings)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="residentialMoi"
              stroke="var(--color-residentialMoi)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
        <div className="mt-3 text-xs text-muted-foreground">
          <p>Sales/Listings: &gt;60% Seller&apos;s Market · 40-60% Balanced · &lt;40% Buyer&apos;s Market</p>
        </div>
      </CardContent>
    </Card>
  );
}
