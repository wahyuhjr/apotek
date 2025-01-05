import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"

export function Navbar() {
  return (
    <nav className="top-0 w-full border-b bg-background h-14 flex items-center px-4 md:px-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className="font-bold text-xl">Moneker</h1>
        </div>
        {/* Profile section */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Hallo, Admin</span>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium">
                <User className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}
