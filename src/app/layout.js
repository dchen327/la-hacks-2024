import { Inter } from "next/font/google";
import "./globals.css";
import "bulma/css/bulma.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TODO",
  description: "Encouraging outdoor activity!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
