import { Filter, Search } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Button } from "./ui/button"
import { useThread } from "@/hooks/use-thread"
import { useNavigate, useSearch } from "@tanstack/react-router"

export function NavBar() {
  const navigate = useNavigate()
  const { search } = useSearch({
    from: "/",
  })

  const threads = useThread(search)

  return (
    <nav className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
      {/* Filter */}
      <Button size="icon" aria-label="Submit">
        <Filter className="text-primary-foreground" />
      </Button>
      {/* Search bar */}
      <InputGroup className="max-w-xs">
        <InputGroupInput
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            navigate({
              to: "/",
              search: (prev) => ({
                ...prev,
                search: e.target.value || undefined,
              }),
            })
          }
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {threads.data?.length} Threads
        </InputGroupAddon>
      </InputGroup>
      <h1 className="text-xl font-bold">Forums App</h1>
    </nav>
  )
}
