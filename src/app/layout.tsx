import styles from "@/app/page.module.css";
import ProfileMenu from "@/components/ProfileMenu";
import SidePanel from "@/components/SidePanel";
import { GlobalContextProvider } from "@/drivers/GlobalContext";
import { Divider } from "@nextui-org/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "./providers";

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
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark", children }}>
            <ProfileMenu />
            <main className={styles.main}>
              <SidePanel />
              <Divider orientation="vertical" />
              {children}
            </main>
            <Toaster
              position="bottom-center"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                // Define default options
                className: "",
                style: {
                  background: "#18181b",
                  color: "#fff",
                  fontSize: "0.85rem",
                },

                // Default options for specific types
                success: {
                  duration: 3000,
                },
                loading: {
                  duration: 10000,
                },
                iconTheme: {
                  primary: "green",
                  secondary: "black",
                },
              }}
            />
          </Providers>
        </body>
      </html>
    </GlobalContextProvider>
  );
}
