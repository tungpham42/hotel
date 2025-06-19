import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ReactNode } from "react";
import { getHostUrl } from "@/utils/getHostUrl";

export async function generateMetadata(): Promise<Metadata> {
  const hostUrl = await getHostUrl();
  return {
    title: "Tìm kiếm khách sạn",
    description: "Danh sách các khách sạn",
    openGraph: {
      title: "Tìm kiếm khách sạn",
      description: "Danh sách các khách sạn",
      url: hostUrl,
      siteName: "Tìm kiếm khách sạn",
      images: [
        {
          url: `${hostUrl}/1200x630.jpg`,
          width: 1200,
          height: 630,
          alt: "Tìm kiếm khách sạn",
        },
      ],
      locale: "vi",
      type: "website",
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
