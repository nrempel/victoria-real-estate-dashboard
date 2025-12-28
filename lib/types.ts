export interface RealEstateDataRaw {
  date: string;
  sfhSales: string;
  condoSales: string;
  townhouseSales: string;
  manSales: string;
  residentialSales: string;
  allSales: string;
  newListings: string;
  residentialInventory: string;
  allInventory: string;
  offMarket: string;
  sfhMedian: string;
  sfhAverage: string;
  teranetIndex: string;
  mlsHpiSfh: string;
  yearlySfhMedian: string;
  condoAverage: string;
  condoMedian: string;
  yearlyCondoMedian: string;
  townhouseAverage: string;
  townhouseMedian: string;
  salesToNewListings: string;
  yearlySalesToNewListings: string;
  residentialMoi: string;
  residentialYearlyMoi: string;
  allMoi: string;
  yearlyMoi: string;
  bankRate: string;
  fiveYearBond: string;
  mortgageRate: string;
  fiveYearMortgageRate: string;
  avgNominalMortgagePayment: string;
  canadaCpi: string;
  income: string;
  sfhAvgMomChange: string;
  medianCondosForMedianSfh: string;
  detachedAffordability: string;
  townhouseAffordability: string;
  condoAffordability: string;
  saSales: string;
  saNewListings: string;
  saActiveListings: string;
  saMoi: string;
  saSnlr: string;
}

export interface RealEstateData {
  date: Date;
  sfhSales: number | null;
  condoSales: number | null;
  townhouseSales: number | null;
  manSales: number | null;
  residentialSales: number | null;
  allSales: number | null;
  newListings: number | null;
  residentialInventory: number | null;
  allInventory: number | null;
  offMarket: number | null;
  sfhMedian: number | null;
  sfhAverage: number | null;
  yearlySfhMedian: number | null;
  condoAverage: number | null;
  condoMedian: number | null;
  yearlyCondoMedian: number | null;
  townhouseAverage: number | null;
  townhouseMedian: number | null;
  teranetIndex: number | null;
  mlsHpiSfh: number | null;
  salesToNewListings: number | null;
  yearlySalesToNewListings: number | null;
  residentialMoi: number | null;
  residentialYearlyMoi: number | null;
  allMoi: number | null;
  yearlyMoi: number | null;
  bankRate: number | null;
  fiveYearBond: number | null;
  mortgageRate: number | null;
  fiveYearMortgageRate: number | null;
  avgNominalMortgagePayment: number | null;
  canadaCpi: number | null;
  income: number | null;
  sfhAvgMomChange: number | null;
  medianCondosForMedianSfh: number | null;
  detachedAffordability: number | null;
  townhouseAffordability: number | null;
  condoAffordability: number | null;
  saSales: number | null;
  saNewListings: number | null;
  saActiveListings: number | null;
  saMoi: number | null;
  saSnlr: number | null;
}

export const COLUMN_MAP: Record<string, keyof RealEstateDataRaw> = {
  'Date': 'date',
  'SFH Sales': 'sfhSales',
  'Condo Sales': 'condoSales',
  'Townhouse Sales': 'townhouseSales',
  'Man. Sales': 'manSales',
  'Residential Sales': 'residentialSales',
  'All Sales': 'allSales',
  'New Listings': 'newListings',
  'Residential Inventory': 'residentialInventory',
  'All Inventory': 'allInventory',
  'Off Market': 'offMarket',
  'SFH Median': 'sfhMedian',
  'SFH Average': 'sfhAverage',
  'Teranet index': 'teranetIndex',
  'MLS HPI SFH': 'mlsHpiSfh',
  'Yearly SFH Median': 'yearlySfhMedian',
  'Condo Average': 'condoAverage',
  'Condo Median': 'condoMedian',
  'Yearly Condo Median': 'yearlyCondoMedian',
  'Townhouse Average': 'townhouseAverage',
  'Townhouse Median': 'townhouseMedian',
  'Sales to New Listings': 'salesToNewListings',
  'Yearly Sales to New Listings': 'yearlySalesToNewListings',
  'Residential MOI': 'residentialMoi',
  'Residential Yearly MOI': 'residentialYearlyMoi',
  'All MOI': 'allMoi',
  'Yearly MOI': 'yearlyMoi',
  'Bank Rate': 'bankRate',
  '5 year bond': 'fiveYearBond',
  'Mortgage Rate': 'mortgageRate',
  '5 Year Mortgage Rate': 'fiveYearMortgageRate',
  'Average Nominal Mortgage Payment on SFH (20% down, 25 year)': 'avgNominalMortgagePayment',
  'Canada All Items CPI (326-0020)': 'canadaCpi',
  'Income': 'income',
  'SFH Avg MoM Change': 'sfhAvgMomChange',
  'Median Condos for a Median SFH': 'medianCondosForMedianSfh',
  'Detached Affordability': 'detachedAffordability',
  'Townhouse Affordability': 'townhouseAffordability',
  'Condo Affordability': 'condoAffordability',
  'SA Sales': 'saSales',
  'SA New Listings': 'saNewListings',
  'SA Active Listings': 'saActiveListings',
  'SA MOI': 'saMoi',
  'SA SNLR': 'saSnlr',
};

export function parseNumber(value: string | undefined | null): number | null {
  if (value === undefined || value === null || value === '') return null;
  const cleaned = value.replace(/[$,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export function parseDate(value: string): Date {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
}

export function transformRow(raw: RealEstateDataRaw): RealEstateData {
  return {
    date: parseDate(raw.date),
    sfhSales: parseNumber(raw.sfhSales),
    condoSales: parseNumber(raw.condoSales),
    townhouseSales: parseNumber(raw.townhouseSales),
    manSales: parseNumber(raw.manSales),
    residentialSales: parseNumber(raw.residentialSales),
    allSales: parseNumber(raw.allSales),
    newListings: parseNumber(raw.newListings),
    residentialInventory: parseNumber(raw.residentialInventory),
    allInventory: parseNumber(raw.allInventory),
    offMarket: parseNumber(raw.offMarket),
    sfhMedian: parseNumber(raw.sfhMedian),
    sfhAverage: parseNumber(raw.sfhAverage),
    yearlySfhMedian: parseNumber(raw.yearlySfhMedian),
    condoAverage: parseNumber(raw.condoAverage),
    condoMedian: parseNumber(raw.condoMedian),
    yearlyCondoMedian: parseNumber(raw.yearlyCondoMedian),
    townhouseAverage: parseNumber(raw.townhouseAverage),
    townhouseMedian: parseNumber(raw.townhouseMedian),
    teranetIndex: parseNumber(raw.teranetIndex),
    mlsHpiSfh: parseNumber(raw.mlsHpiSfh),
    salesToNewListings: parseNumber(raw.salesToNewListings),
    yearlySalesToNewListings: parseNumber(raw.yearlySalesToNewListings),
    residentialMoi: parseNumber(raw.residentialMoi),
    residentialYearlyMoi: parseNumber(raw.residentialYearlyMoi),
    allMoi: parseNumber(raw.allMoi),
    yearlyMoi: parseNumber(raw.yearlyMoi),
    bankRate: parseNumber(raw.bankRate),
    fiveYearBond: parseNumber(raw.fiveYearBond),
    mortgageRate: parseNumber(raw.mortgageRate),
    fiveYearMortgageRate: parseNumber(raw.fiveYearMortgageRate),
    avgNominalMortgagePayment: parseNumber(raw.avgNominalMortgagePayment),
    canadaCpi: parseNumber(raw.canadaCpi),
    income: parseNumber(raw.income),
    sfhAvgMomChange: parseNumber(raw.sfhAvgMomChange),
    medianCondosForMedianSfh: parseNumber(raw.medianCondosForMedianSfh),
    detachedAffordability: parseNumber(raw.detachedAffordability),
    townhouseAffordability: parseNumber(raw.townhouseAffordability),
    condoAffordability: parseNumber(raw.condoAffordability),
    saSales: parseNumber(raw.saSales),
    saNewListings: parseNumber(raw.saNewListings),
    saActiveListings: parseNumber(raw.saActiveListings),
    saMoi: parseNumber(raw.saMoi),
    saSnlr: parseNumber(raw.saSnlr),
  };
}
