import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "Create Next App",
  description: "Ocean Blue Serenity Theme",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-merriweather">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
