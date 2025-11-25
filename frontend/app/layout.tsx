import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Navbar from "@/components/Navbar";
import { BackendProvider } from "@/context/BackendContext";

export const metadata: Metadata = {
  title: "Tienda de Ecommerce",
  description: "Compra y gestiona productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <BackendProvider>
          <Navbar />
          {children}
        </BackendProvider>
      </body>
    </html>
  );
}
