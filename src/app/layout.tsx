import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: "Blizine - Tech, decoded. Fast. Your source for the latest in tech news, web development, programming, cybersecurity, AI, gadgets, and tutorials.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.blizine.com"),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  verification: {
    google: '75MCSV7iG7JdKa_i1Tt0ceqqQ4Jl-W33sjbIMnrlMQ4',
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "Tech, decoded. Fast.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "Tech, decoded. Fast.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script src="https://www.googletagmanager.com/gtag/js?id=G-YX3H076JBM" async />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YX3H076JBM');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
