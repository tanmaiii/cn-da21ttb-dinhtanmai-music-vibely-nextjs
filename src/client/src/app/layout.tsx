import { UIProvider } from "@/context/UIContext";
import "@/public/icons/css/all.css";
import { Metadata } from "next";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import "./globals.scss";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "Trang chủ | Sound",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body suppressHydrationWarning={true}>
        <UIProvider>
          <StoreProvider>
            <Toaster
              position="top-center"
              containerStyle={{ zIndex: 999999 }}
              reverseOrder={false}
            />
            <div>{children}</div>
          </StoreProvider>
        </UIProvider>
      </body>
    </html>
  );
}
