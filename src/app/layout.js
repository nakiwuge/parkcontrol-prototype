import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "ParkControl ",
  description:
    "Parking records, revenue control, and owner visibility for live demos.",
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
