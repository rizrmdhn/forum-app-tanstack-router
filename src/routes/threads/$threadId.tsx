import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/threads/$threadId")({
  component: ThreadDetailComponent,
})

function ThreadDetailComponent() {
  const { threadId } = Route.useParams()

  return (
    <div className="p-6">
      <p>Thread: {threadId}</p>
    </div>
  )
}
