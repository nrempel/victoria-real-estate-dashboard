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

interface MortgagePaymentChartProps {
  data: RealEstateData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  avgNominalMortgagePayment: {
    label: 'Monthly Mortgage Payment',
    color: 'var(--chart-1)',
  },
  income: {
    label: 'Median Income (Monthly)',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function MortgagePaymentChart({
  data,
  title = 'Mortgage Payment vs Income',
  description = 'Monthly mortgage payment on median SFH (20% down, 25yr)',
}: MortgagePaymentChartProps) {
  const chartData = useMemo(() => data
    .filter((row) => row.avgNominalMortgagePayment !== null)
    .map((row) => ({
      date: row.date.toISOString().slice(0, 7),
      displayDate: row.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short' }),
      avgNominalMortgagePayment: row.avgNominalMortgagePayment,
      income: row.income ? row.income / 12 : null,
    })), [data]);

  return (
    <Card className="bg-card rounded-xl card-shadow border-0" role="figure" aria-label={`${title}: ${description}`}>
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="font-display text-lg font-medium">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-5">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ComposedChart
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
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="avgNominalMortgagePayment"
              fill="var(--color-avgNominalMortgagePayment)"
              fillOpacity={0.3}
              stroke="var(--color-avgNominalMortgagePayment)"
              strokeWidth={2}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="var(--color-income)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ChartContainer>
        <div className="mt-3 text-xs text-muted-foreground">
          Based on median SFH price with 20% down payment and 25-year amortization. Dashed line shows median household income for comparison.
        </div>
      </CardContent>
    </Card>
  );
}
