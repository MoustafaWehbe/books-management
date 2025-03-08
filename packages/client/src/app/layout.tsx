import type { Metadata } from "next";
import Providers from "@/app/providers";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "Book Management App",
  description: "App to manage books",
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
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
