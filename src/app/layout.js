import Navbar from "../components/layout/Navbar";
import './globals.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Tax Hummer ERP</title>
      </head>
      <body className="pt-16"> {/* Add top padding to account for the fixed navbar */}
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
