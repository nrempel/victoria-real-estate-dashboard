import { getCachedSheetData } from '@/lib/google-sheets';
import { Dashboard } from '@/components/dashboard';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Victoria Real Estate Dashboard',
  description: 'Live market data and trends for Greater Victoria, BC real estate.',
  url: 'https://victoria-real-estate-dashboard.vercel.app',
  applicationCategory: 'Finance',
  operatingSystem: 'Web',
  author: {
    '@type': 'Person',
    name: 'Nick Rempel',
    url: 'https://nrempel.com',
  },
  about: {
    '@type': 'Place',
    name: 'Greater Victoria',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Victoria',
      addressRegion: 'BC',
      addressCountry: 'CA',
    },
  },
};

export default async function Home() {
  let data: Awaited<ReturnType<typeof getCachedSheetData>> = [];
  let error: string | null = null;

  try {
    data = await getCachedSheetData();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch data';
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Greater Victoria, BC
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Real Estate Market
          </h1>
          <div className="divider max-w-xs mx-auto mt-6 mb-4" />
          <p className="text-sm text-muted-foreground">
            Live market data and trends
          </p>
        </header>

        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
            <h2 className="text-lg font-semibold text-destructive">Error loading data</h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <p className="mt-4 text-sm">
              Make sure you have set the <code className="bg-muted px-1 py-0.5 rounded">GOOGLE_SHEETS_API_KEY</code> environment variable.
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <Dashboard data={data} />
        )}
      </div>
    </div>
    </>
  );
}
