import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PageLoadingIndicator } from '@/components/PageLoadingIndicator';
import "./globals.css";

export const metadata: Metadata = {
  title: "Ideator - Find Your Next App Idea",
  description: "Discover and explore app ideas tailored to your interests",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <PageLoadingIndicator />
          {children}
          <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#000000',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#000000',
                secondary: '#FFFFFF',
              },
            },
            duration: 1500,
          }}
          containerStyle={{
            top: 20,
          }}
          reverseOrder={false}
          gutter={8}
        />
        </LanguageProvider>
      </body>
    </html>
  );
}
