import type { Metadata } from "next";
import "./globals.scss";
import { Providers } from './provider';

export const metadata: Metadata = {
  title: "DeFiZen",
  description:
    "Defi Agent to enable cross chain transfers, add liquidity and optimise Your Yield",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="AppWrapper">
            <div className="AppContainer">
              <div style={{ display: "flex", flex: 1, overflow: "auto" }}>
                {children}
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}