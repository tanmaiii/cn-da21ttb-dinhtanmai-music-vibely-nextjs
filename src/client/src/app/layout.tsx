import { UIProvider } from "@/context/UIContext";
import "@/public/icons/css/all.css";
import { Metadata } from "next";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import "./globals.scss";
import StoreProvider from "./StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "@/context/authContex";

export const metadata: Metadata = {
  title: "Trang chủ | Sound",
};

const CLIENT_ID = process.env.NEXT_PUBLIC_API_GOOGLE_CLIENT_ID || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(CLIENT_ID);

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
            <AuthProvider>
              <GoogleOAuthProvider clientId={CLIENT_ID}>
                <div>{children}</div>
              </GoogleOAuthProvider>
            </AuthProvider>
          </StoreProvider>
        </UIProvider>
      </body>
    </html>
  );
}
