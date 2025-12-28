# Victoria Real Estate Dashboard

A real-time dashboard tracking housing market metrics for Victoria, BC. Built with Next.js 16 and powered by data from a public Google Sheet.

## Features

- **Price Trends** — Median prices by property type (SFH, Condo, Townhouse)
- **Sales Volume** — Monthly sales broken down by property type
- **Market Health** — Sales-to-listings ratio and months of inventory
- **Affordability Index** — % of median income required for mortgage payments
- **Inventory Levels** — Active listings and new listings over time
- **Price Index** — MLS HPI and Teranet index for smoothed price trends
- **Mortgage Payments** — Monthly payment vs median income comparison
- **Interest Rates** — BoC rate, 5-year bond yields, and mortgage rates
- **Synchronized Charts** — Hover on one chart to highlight the same date across all charts

## Tech Stack

- **Framework**: Next.js 16.1 with App Router and Turbopack
- **Runtime**: React 19 with React Compiler
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **UI Components**: shadcn/ui (Radix primitives)
- **Data Source**: Google Sheets API
- **Caching**: Next.js `'use cache'` directive

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
git clone https://github.com/nrempel/victoria-real-estate-dashboard.git
cd victoria-real-estate-dashboard
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Add your Google Sheets API key:

```
GOOGLE_SHEETS_API_KEY=your_api_key_here
```

To get an API key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Enable the Google Sheets API
4. Create an API key
5. Restrict the key to Google Sheets API for security

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
pnpm build
pnpm start
```

## Deployment

### Vercel

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable: `GOOGLE_SHEETS_API_KEY`
4. Deploy

## Data Source

Data is pulled from a [public Google Sheet](https://docs.google.com/spreadsheets/d/1UXbrFD-19QmdNAWj5cswQkzSgaiAjApr_XubOVUmCxc) containing historical Victoria real estate metrics compiled from VREB (Victoria Real Estate Board) reports, Bank of Canada data, and other public sources.

## License

MIT
