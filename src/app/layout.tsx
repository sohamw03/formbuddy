import styles from "@/app/page.module.css";
import ProfileMenu from "@/components/ProfileMenu";
import SidePanel from "@/components/SidePanel";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GlobalContextProvider } from "@/drivers/GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FormBuddy",
  description: "One stop solution for all your form filling needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalContextProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark", children }}>
            <ProfileMenu />
            <main className={styles.main}>
              <SidePanel />
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </GlobalContextProvider>
  );
}
