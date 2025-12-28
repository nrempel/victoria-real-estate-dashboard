import { google } from 'googleapis';
import { cacheLife } from 'next/cache';
import { RealEstateData, RealEstateDataRaw, COLUMN_MAP, transformRow } from './types';

const SPREADSHEET_ID = '1UXbrFD-19QmdNAWj5cswQkzSgaiAjApr_XubOVUmCxc';
const SHEET_NAME = 'Data';
const RANGE = 'A:AR';

function getSheets() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_SHEETS_API_KEY environment variable is not set');
  }

  return google.sheets({ version: 'v4', auth: apiKey });
}

export async function fetchSheetData(): Promise<RealEstateData[]> {
  const sheets = getSheets();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${RANGE}`,
  });

  const rows = response.data.values;

  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0] as string[];
  const dataRows = rows.slice(1);

  const headerIndexMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    const normalizedHeader = header.trim();
    if (COLUMN_MAP[normalizedHeader]) {
      headerIndexMap[COLUMN_MAP[normalizedHeader]] = index;
    }
  });

  const data: RealEstateData[] = dataRows
    .filter(row => row[0])
    .map(row => {
      try {
        const rawData: RealEstateDataRaw = {
          date: row[headerIndexMap.date] || '',
          sfhSales: row[headerIndexMap.sfhSales] || '',
          condoSales: row[headerIndexMap.condoSales] || '',
          townhouseSales: row[headerIndexMap.townhouseSales] || '',
          manSales: row[headerIndexMap.manSales] || '',
          residentialSales: row[headerIndexMap.residentialSales] || '',
          allSales: row[headerIndexMap.allSales] || '',
          newListings: row[headerIndexMap.newListings] || '',
          residentialInventory: row[headerIndexMap.residentialInventory] || '',
          allInventory: row[headerIndexMap.allInventory] || '',
          offMarket: row[headerIndexMap.offMarket] || '',
          sfhMedian: row[headerIndexMap.sfhMedian] || '',
          sfhAverage: row[headerIndexMap.sfhAverage] || '',
          teranetIndex: row[headerIndexMap.teranetIndex] || '',
          mlsHpiSfh: row[headerIndexMap.mlsHpiSfh] || '',
          yearlySfhMedian: row[headerIndexMap.yearlySfhMedian] || '',
          condoAverage: row[headerIndexMap.condoAverage] || '',
          condoMedian: row[headerIndexMap.condoMedian] || '',
          yearlyCondoMedian: row[headerIndexMap.yearlyCondoMedian] || '',
          townhouseAverage: row[headerIndexMap.townhouseAverage] || '',
          townhouseMedian: row[headerIndexMap.townhouseMedian] || '',
          salesToNewListings: row[headerIndexMap.salesToNewListings] || '',
          yearlySalesToNewListings: row[headerIndexMap.yearlySalesToNewListings] || '',
          residentialMoi: row[headerIndexMap.residentialMoi] || '',
          residentialYearlyMoi: row[headerIndexMap.residentialYearlyMoi] || '',
          allMoi: row[headerIndexMap.allMoi] || '',
          yearlyMoi: row[headerIndexMap.yearlyMoi] || '',
          bankRate: row[headerIndexMap.bankRate] || '',
          fiveYearBond: row[headerIndexMap.fiveYearBond] || '',
          mortgageRate: row[headerIndexMap.mortgageRate] || '',
          fiveYearMortgageRate: row[headerIndexMap.fiveYearMortgageRate] || '',
          avgNominalMortgagePayment: row[headerIndexMap.avgNominalMortgagePayment] || '',
          canadaCpi: row[headerIndexMap.canadaCpi] || '',
          income: row[headerIndexMap.income] || '',
          sfhAvgMomChange: row[headerIndexMap.sfhAvgMomChange] || '',
          medianCondosForMedianSfh: row[headerIndexMap.medianCondosForMedianSfh] || '',
          detachedAffordability: row[headerIndexMap.detachedAffordability] || '',
          townhouseAffordability: row[headerIndexMap.townhouseAffordability] || '',
          condoAffordability: row[headerIndexMap.condoAffordability] || '',
          saSales: row[headerIndexMap.saSales] || '',
          saNewListings: row[headerIndexMap.saNewListings] || '',
          saActiveListings: row[headerIndexMap.saActiveListings] || '',
          saMoi: row[headerIndexMap.saMoi] || '',
          saSnlr: row[headerIndexMap.saSnlr] || '',
        };

        return transformRow(rawData);
      } catch (error) {
        console.error('Failed to transform row, skipping:', error, row);
        return null;
      }
    })
    .filter((row): row is RealEstateData => row !== null);

  return data;
}

export async function getCachedSheetData(): Promise<RealEstateData[]> {
  'use cache';
  cacheLife('minutes');
  return fetchSheetData();
}

export async function getLatestData(): Promise<RealEstateData | null> {
  const data = await getCachedSheetData();
  if (data.length === 0) return null;

  const sorted = [...data].sort((a, b) => b.date.getTime() - a.date.getTime());
  return sorted[0];
}

export async function getDataInRange(
  startDate: Date,
  endDate: Date
): Promise<RealEstateData[]> {
  if (startDate > endDate) {
    throw new Error(
      `Invalid date range: startDate (${startDate.toISOString()}) must be before endDate (${endDate.toISOString()})`
    );
  }
  const data = await getCachedSheetData();
  return data.filter(
    (row) => row.date >= startDate && row.date <= endDate
  );
}

export async function getYearOverYearData(
  targetDate: Date
): Promise<{ current: RealEstateData | null; previous: RealEstateData | null }> {
  const data = await getCachedSheetData();

  const targetMonth = targetDate.getMonth();
  const targetYear = targetDate.getFullYear();

  const current = data.find(
    (row) =>
      row.date.getMonth() === targetMonth &&
      row.date.getFullYear() === targetYear
  ) || null;

  const previous = data.find(
    (row) =>
      row.date.getMonth() === targetMonth &&
      row.date.getFullYear() === targetYear - 1
  ) || null;

  return { current, previous };
}
