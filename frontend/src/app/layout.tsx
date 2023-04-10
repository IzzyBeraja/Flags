import "./globals.css";

export const metadata = {
  description: "An easy way to handle all of your flags",
  title: "Flags",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
