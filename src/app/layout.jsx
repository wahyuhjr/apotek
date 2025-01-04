// app/layout.jsx
import '@/styles/globals.css'
import { Navbar } from "@/components/Layout/navbar"
import { Sidebar } from "@/components/Layout/sidebar"


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="relative flex min-h-screen">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
            <Sidebar />
          </div>
          
          <div className="flex-1 md:pl-64">
            <Navbar />
            {/* Main content */}
            <main className="pt-14 px-4 md:px-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
