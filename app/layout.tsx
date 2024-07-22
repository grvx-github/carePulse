import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { cn } from "../lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "500", "400", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "CarePulse",
  description: "A healtcare management system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
