// app/layout.tsx
import { ThemeModeScript } from 'flowbite-react';
import './globals.css';
import LayoutWrapper from './partials/LayoutWrapper';
import SessionProviderWrapper from './partials/sessionProvider';

export const metadata = {
  title: 'Affandi Store',
  description: 'Nego sampai jadi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className="dark:bg-gray-900 bg-white">
      <SessionProviderWrapper>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
