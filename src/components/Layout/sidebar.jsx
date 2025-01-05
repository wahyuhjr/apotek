
import Link from "next/link"
import { Home, Settings, User, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Obat",
    icon: Home,
    href: "/obat"
  },
  {
    title: "Pelanggan",
    icon: User,
    href: "/pelanggan"
  },
  {
    title: "Pemasok",
    icon: Settings,
    href: "/pemasok"
  },
  {
    title: "Transaksi",
    icon: DollarSign,
    href: "/pemasok"
  }
]

export function Sidebar() {
  return (
    <div className="h-full border-r bg-background px-3 py-4">
      <div className="space-y-4">
        <div className="py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Menu</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}