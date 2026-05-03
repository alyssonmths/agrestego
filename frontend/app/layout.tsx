import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className= "h-full antialiased"
      style={{scrollBehavior: "smooth"}}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
