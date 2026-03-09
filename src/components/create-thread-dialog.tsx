import { useState } from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { createThreadSchema, type CreateThreadInput } from "@/lib/schemas/thread.schema"
import { useCreateThread } from "@/hooks/use-create-thread"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Field, FieldError } from "@/components/ui/field"
import { Plus } from "lucide-react"

export function CreateThreadDialog() {
  const [open, setOpen] = useState(false)
  const { mutate: createThread, isPending } = useCreateThread()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateThreadInput>({
    resolver: standardSchemaResolver(createThreadSchema),
  })

  const onSubmit = (data: CreateThreadInput) => {
    createThread(data, {
      onSuccess: () => {
        setOpen(false)
        reset()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="icon"
            className="fixed bottom-20 right-4 size-14 rounded-full shadow-lg"
          />
        }
      >
        <Plus className="size-6" />
        <span className="sr-only">Buat thread</span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Thread Baru</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
          <Field>
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              placeholder="Judul thread"
              {...register("title")}
            />
            <FieldError errors={[errors.title]} />
          </Field>

          <Field>
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              placeholder="Opsional"
              {...register("category")}
            />
            <FieldError errors={[errors.category]} />
          </Field>

          <Field>
            <Label htmlFor="body">Isi</Label>
            <Textarea
              id="body"
              placeholder="Tulis isi thread..."
              rows={5}
              {...register("body")}
            />
            <FieldError errors={[errors.body]} />
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Buat Thread"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
