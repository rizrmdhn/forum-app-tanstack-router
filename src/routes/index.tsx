import { Button } from "@/components/ui/button"
import { useAppSelector } from "../hooks/use-store"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: HomeComponent,
})

function HomeComponent() {
  const auth = useAppSelector((state) => state.auth)

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
        <div className="rounded-md bg-red-100 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Auth State</h3>
              <pre className="mt-2 text-xs text-red-700">
                {JSON.stringify(auth, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
