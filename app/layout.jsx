import "./globals.css";

export const metadata = {
  title: "Suncoast Home Lists",
  description: "Curated South Florida home lists with fast alerts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Makes site scale and respect the iPhone notch */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          paddingTop: "env(safe-area-inset-top)",
          paddingRight: "env(safe-area-inset-right)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          background: "#0b1220",
          color: "#e2e8f0",
        }}
      >
        {children}
      </body>
    </html>
  );
}
