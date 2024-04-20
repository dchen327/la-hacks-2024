import { Inter } from "next/font/google";
import "./globals.css";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { Navbar } from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TODO",
  description: "Encouraging outdoor activity!",
};

export default function RootLayout({ children }) {
  return (
    <html className="has-navbar-fixed-bottom" lang="en">
      <body className={inter.className}>
        <Navbar />
        {/* Hacky invisible div to offset navbar on desktop but not mobile */}
        <div className="h-[3.25rem] is-hidden-touch"></div>
        <main>{children}</main>
      </body>
    </html>
  );
}
