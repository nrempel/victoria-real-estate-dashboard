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

interface InterestRateChartProps {
  data: RealEstateData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  bankRate: {
    label: 'BoC Rate',
    color: 'var(--chart-1)',
  },
  fiveYearBond: {
    label: '5yr Bond',
    color: 'var(--chart-2)',
  },
  fiveYearMortgageRate: {
    label: '5yr Mortgage',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function InterestRateChart({
  data,
  title = 'Interest Rates',
  description = 'Bank of Canada rate, bond yields, and mortgage rates',
}: InterestRateChartProps) {
  const chartData = useMemo(() => data
    .filter((row) => row.bankRate !== null || row.fiveYearBond !== null || row.fiveYearMortgageRate !== null)
    .map((row) => ({
      date: row.date.toISOString().slice(0, 7),
      displayDate: row.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short' }),
      bankRate: row.bankRate,
      fiveYearBond: row.fiveYearBond,
      fiveYearMortgageRate: row.fiveYearMortgageRate,
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
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['auto', 'auto']}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="stepAfter"
              dataKey="bankRate"
              stroke="var(--color-bankRate)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="fiveYearBond"
              stroke="var(--color-fiveYearBond)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="fiveYearMortgageRate"
              stroke="var(--color-fiveYearMortgageRate)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
        <div className="mt-3 text-xs text-muted-foreground">
          BoC policy rate influences bond yields, which drive fixed mortgage rates
        </div>
      </CardContent>
    </Card>
  );
}
