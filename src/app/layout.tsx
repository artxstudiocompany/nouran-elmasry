import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/store/DataContext";

export const metadata: Metadata = {
  title: {
    default: "Eng/Nouran El-Masry | MEP Engineer Portfolio",
    template: "%s | Eng/Nouran El-Masry",
  },
  description:
    "Portfolio of Eng/Nouran El-Masry - MEP Engineer specializing in HVAC, Electrical, Plumbing, Fire Fighting, and BIM Coordination.",
  keywords: [
    "MEP Engineer",
    "HVAC",
    "Electrical",
    "Plumbing",
    "Fire Fighting",
    "BIM",
    "Revit",
    "AutoCAD",
    "Nouran El-Masry",
    "مهندس MEP",
  ],
  authors: [{ name: "Eng/Nouran El-Masry" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
    title: "Eng/Nouran El-Masry | MEP Engineer",
    description:
      "Portfolio of Eng/Nouran El-Masry - MEP Engineer specializing in building systems design and coordination.",
    siteName: "Eng/Nouran El-Masry Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eng/Nouran El-Masry | MEP Engineer",
    description:
      "Portfolio of Eng/Nouran El-Masry - MEP Engineer specializing in building systems design and coordination.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const setDirectionScript = `
(function() {
  try {
    var locale = localStorage.getItem('locale');
    if (locale === 'en') {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    } else {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setDirectionScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Eng/Nouran El-Masry",
              jobTitle: "MEP Engineer",
              description:
                "MEP Engineer specializing in HVAC, Electrical, Plumbing, Fire Fighting, and BIM Coordination.",
              url: "https://nouran-portfolio.example.com",
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-night-deep text-ink antialiased">
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
