import { I18nProvider } from "../i18n/index";
import "../index.css";

export const metadata = {
  title: "Minecraft Dashboard",
  description: "Dashboard for Minecraft NBT Saves",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
