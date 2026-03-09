import { Link } from "@tanstack/react-router"
import { LayoutList, LogIn, Trophy } from "lucide-react"

const items = [
  { to: "/leaderboards", label: "Leaderboard", icon: Trophy },
  { to: "/", label: "Threads", icon: LayoutList },
  { to: "/login", label: "Login", icon: LogIn },
] as const

export function BottomNavBar() {
  return (
    <nav className="flex h-14 items-center justify-around border-t bg-background px-4">
      {items.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground [&.active]:text-primary"
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
