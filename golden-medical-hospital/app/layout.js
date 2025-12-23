import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SessionWrapper from "./session-wrapper"; 

export const metadata = {
  title: "Create Next App",
  description: "Ocean Blue Serenity Theme",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-merriweather">
      <body>
        
        <SessionWrapper>
          <Navbar />
          {children}
          <Footer />
        </SessionWrapper>
    
      </body>
    </html>
  );
}
