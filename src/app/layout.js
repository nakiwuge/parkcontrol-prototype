import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "ParkControl ",
  description:
    "Parking records, payment tracking, and owner visibility for parking business owners.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
