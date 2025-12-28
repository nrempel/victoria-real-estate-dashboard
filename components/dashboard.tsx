'use client';

import { useState, useMemo } from 'react';
import { RealEstateData } from '@/lib/types';
import { MetricCard } from '@/components/metric-card';
import { PriceTrendChart } from '@/components/charts/price-trend-chart';
import { SalesVolumeChart } from '@/components/charts/sales-volume-chart';
import { MarketHealthChart } from '@/components/charts/market-health-chart';
import { AffordabilityChart } from '@/components/charts/affordability-chart';
import { InventoryChart } from '@/components/charts/inventory-chart';
import { PriceIndexChart } from '@/components/charts/price-index-chart';
import { MortgagePaymentChart } from '@/components/charts/mortgage-payment-chart';
import { InterestRateChart } from '@/components/charts/interest-rate-chart';
import { ChartErrorBoundary } from '@/components/chart-error-boundary';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardProps {
  data: RealEstateData[];
}

const DATE_RANGES = ['1y', '5y', '10y', 'all'] as const;
type DateRange = (typeof DATE_RANGES)[number];

export function Dashboard({ data }: DashboardProps) {
  const [dateRange, setDateRange] = useState<DateRange>('5y');

  const hydratedData = useMemo(() => {
    return data.map((row) => {
      const dateStr = String(row.date);
      const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const [, year, month, day] = match;
        return {
          ...row,
          date: new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0),
        };
      }
      return { ...row, date: new Date(row.date) };
    });
  }, [data]);

  const sortedData = useMemo(() => {
    return [...hydratedData].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [hydratedData]);

  const filteredData = useMemo(() => {
    if (sortedData.length === 0) return sortedData;

    const latestDate = sortedData[sortedData.length - 1].date;
    let cutoffDate: Date;

    switch (dateRange) {
      case '1y':
        cutoffDate = new Date(latestDate.getFullYear() - 1, latestDate.getMonth(), 1);
        break;
      case '5y':
        cutoffDate = new Date(latestDate.getFullYear() - 5, latestDate.getMonth(), 1);
        break;
      case '10y':
        cutoffDate = new Date(latestDate.getFullYear() - 10, latestDate.getMonth(), 1);
        break;
      case 'all':
      default:
        return sortedData;
    }

    return sortedData.filter((row) => row.date >= cutoffDate);
  }, [sortedData, dateRange]);

  if (sortedData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const latestData = sortedData[sortedData.length - 1];

  const oneYearAgo = new Date(latestData?.date || new Date());
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const yearAgoData = sortedData.find(
    (row) =>
      row.date.getMonth() === oneYearAgo.getMonth() &&
      row.date.getFullYear() === oneYearAgo.getFullYear()
  );

  const sfhPriceChange = calculateChange(latestData?.sfhMedian, yearAgoData?.sfhMedian);
  const condoPriceChange = calculateChange(latestData?.condoMedian, yearAgoData?.condoMedian);
  const salesChange = calculateChange(latestData?.allSales, yearAgoData?.allSales);

  const latestMonth = latestData?.date?.toLocaleDateString('en-CA', { month: 'long' }) ?? 'N/A';
  const latestYear = latestData?.date?.getFullYear() ?? '';

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px bg-border/60 flex-1 max-w-[80px]" />
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            {latestMonth} {latestYear}
          </p>
          <div className="h-px bg-border/60 flex-1 max-w-[80px]" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Single Family Home"
            value={latestData?.sfhMedian ?? 'N/A'}
            format="currency"
            change={sfhPriceChange}
          />
          <MetricCard
            title="Condominium"
            value={latestData?.condoMedian ?? 'N/A'}
            format="currency"
            change={condoPriceChange}
          />
          <MetricCard
            title="Monthly Sales"
            value={latestData?.allSales ?? 'N/A'}
            format="number"
            change={salesChange}
          />
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-4">
          <MetricCard
            title="Months of Inventory"
            value={latestData?.residentialMoi?.toFixed(1) ?? 'N/A'}
            format="number"
          />
          <MetricCard
            title="Sales to Listings"
            value={latestData?.salesToNewListings ?? 'N/A'}
            format="percent"
          />
          <MetricCard
            title="New Listings"
            value={latestData?.newListings ?? 'N/A'}
            format="number"
          />
          <MetricCard
            title="5-Year Rate"
            value={latestData?.fiveYearMortgageRate ?? 'N/A'}
            format="percent"
          />
          <MetricCard
            title="Affordability"
            value={latestData?.detachedAffordability ?? 'N/A'}
            format="percent"
          />
          <MetricCard
            title="Condos per SFH"
            value={latestData?.medianCondosForMedianSfh?.toFixed(1) ?? 'N/A'}
            format="number"
          />
        </div>
      </section>

      <section className="pt-6">
        <div className="flex flex-col items-center gap-5 mb-8">
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-px bg-border/60 flex-1 max-w-[60px]" />
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Historical Trends
            </p>
            <div className="h-px bg-border/60 flex-1 max-w-[60px]" />
          </div>

          <Tabs value={dateRange} onValueChange={(v) => {
            if ((DATE_RANGES as readonly string[]).includes(v)) {
              setDateRange(v as DateRange);
            }
          }}>
            <TabsList className="h-9 p-1 bg-secondary/40 rounded-full">
              <TabsTrigger value="1y" className="text-xs h-7 px-3 sm:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">1Y</TabsTrigger>
              <TabsTrigger value="5y" className="text-xs h-7 px-3 sm:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">5Y</TabsTrigger>
              <TabsTrigger value="10y" className="text-xs h-7 px-3 sm:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">10Y</TabsTrigger>
              <TabsTrigger value="all" className="text-xs h-7 px-3 sm:px-4 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-6 min-w-0">
          <div className="grid gap-6 lg:grid-cols-2 min-w-0">
            <ChartErrorBoundary>
              <PriceTrendChart data={filteredData} />
            </ChartErrorBoundary>
            <ChartErrorBoundary>
              <SalesVolumeChart data={filteredData} />
            </ChartErrorBoundary>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 min-w-0">
            <ChartErrorBoundary>
              <MarketHealthChart data={filteredData} />
            </ChartErrorBoundary>
            <ChartErrorBoundary>
              <AffordabilityChart data={filteredData} />
            </ChartErrorBoundary>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 min-w-0">
            <ChartErrorBoundary>
              <InventoryChart data={filteredData} />
            </ChartErrorBoundary>
            <ChartErrorBoundary>
              <PriceIndexChart data={filteredData} />
            </ChartErrorBoundary>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 min-w-0">
            <ChartErrorBoundary>
              <MortgagePaymentChart data={filteredData} />
            </ChartErrorBoundary>
            <ChartErrorBoundary>
              <InterestRateChart data={filteredData} />
            </ChartErrorBoundary>
          </div>
        </div>
      </section>

      <footer className="text-center pt-8">
        <div className="divider max-w-lg mx-auto mb-6" />
        <p className="text-sm text-muted-foreground">
          Data as of {latestData?.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })}
          <span className="mx-2">·</span>
          {filteredData.length} months shown
        </p>
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 text-xs text-muted-foreground">
          <span>
            Data compiled by{' '}
            <a
              href="https://househuntvictoria.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              House Hunt Victoria
            </a>
          </span>
          <span className="hidden sm:inline mx-2">·</span>
          <a
            href="https://docs.google.com/spreadsheets/d/1UXbrFD-19QmdNAWj5cswQkzSgaiAjApr_XubOVUmCxc/edit?gid=19292275#gid=19292275"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View Source Data
          </a>
          <span className="hidden sm:inline mx-2">·</span>
          <span>
            Built by{' '}
            <a
              href="https://nrempel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Nicholas Rempel
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

function calculateChange(current: number | null | undefined, previous: number | null | undefined): number | undefined {
  if (current === null || current === undefined || previous === null || previous === undefined || previous === 0) {
    return undefined;
  }
  return ((current - previous) / previous) * 100;
}
