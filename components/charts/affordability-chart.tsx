'use client';

import { useMemo } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Area, ComposedChart } from 'recharts';
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

interface AffordabilityChartProps {
  data: RealEstateData[];
  title?: string;
  description?: string;
}

export function AffordabilityChart({
  data,
  title = 'Affordability Index',
  description = 'Housing affordability by property type (lower is more affordable)',
}: AffordabilityChartProps) {
  const chartData = useMemo(() => data
    .filter(
      (row) =>
        row.detachedAffordability !== null ||
        row.townhouseAffordability !== null ||
        row.condoAffordability !== null
    )
    .map((row) => ({
      date: row.date.toISOString().slice(0, 7),
      displayDate: row.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short' }),
      detachedAffordability: row.detachedAffordability,
      townhouseAffordability: row.townhouseAffordability,
      condoAffordability: row.condoAffordability,
      mortgageRate: row.fiveYearMortgageRate,
    })), [data]);

  const hasTownhouseData = useMemo(() =>
    chartData.some(row => row.townhouseAffordability !== null),
    [chartData]
  );

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      detachedAffordability: {
        label: 'Detached (SFH)',
        color: 'var(--chart-1)',
      },
    };

    if (hasTownhouseData) {
      config.townhouseAffordability = {
        label: 'Townhouse',
        color: 'var(--chart-2)',
      };
    }

    config.condoAffordability = {
      label: 'Condo',
      color: hasTownhouseData ? 'var(--chart-3)' : 'var(--chart-2)',
    };

    config.mortgageRate = {
      label: 'Mortgage Rate',
      color: hasTownhouseData ? 'var(--chart-4)' : 'var(--chart-3)',
    };

    return config;
  }, [hasTownhouseData]);

  return (
    <Card className="bg-card rounded-xl card-shadow border-0" role="figure" aria-label={`${title}: ${description}`}>
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="font-display text-lg font-medium">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-5">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
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
              yAxisId="left"
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 'auto']}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="mortgageRate"
              fill="var(--color-mortgageRate)"
              fillOpacity={0.1}
              stroke="var(--color-mortgageRate)"
              strokeWidth={1}
              strokeDasharray="5 5"
              connectNulls
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="detachedAffordability"
              stroke="var(--color-detachedAffordability)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            {hasTownhouseData && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="townhouseAffordability"
                stroke="var(--color-townhouseAffordability)"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            )}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="condoAffordability"
              stroke="var(--color-condoAffordability)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ChartContainer>
        <div className="mt-3 text-xs text-muted-foreground">
          Percentage of median income required for mortgage payments
        </div>
      </CardContent>
    </Card>
  );
}
