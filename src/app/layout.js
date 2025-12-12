import { Poppins, Quicksand } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";


const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const quicksand = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata = {
  title: "FitMeal App",
  description: "Personalized meal plans",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${poppins.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
