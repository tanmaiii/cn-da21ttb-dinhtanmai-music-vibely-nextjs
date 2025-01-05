import { UIProvider } from "@/context/UIContext";
import "@/public/icons/css/all.css";
import { Metadata } from "next";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import "./globals.scss";
import StoreProvider from "./StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PlayerProvider } from "@/context/PlayerContext";
import AuthProvider from "@/context/authContex";

export const metadata: Metadata = {
  title: "Trang chủ | Vibely",
  description: "Vibely - Music for everyone",
};

const CLIENT_ID = process.env.NEXT_PUBLIC_API_GOOGLE_CLIENT_ID || "";

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
        <StoreProvider>
          <PlayerProvider>
            <UIProvider>
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
            </UIProvider>
          </PlayerProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
