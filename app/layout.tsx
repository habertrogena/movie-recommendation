import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";

export const metadata: Metadata = {
  title: "Movie Recommendation App",
  description: "This is a movie recommendation App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
