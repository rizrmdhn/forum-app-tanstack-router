import * as z from "zod"

export const createThreadSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  category: z.string().optional(),
})

export const createCommentSchema = z.object({
  content: z.string().min(1),
})

export type CreateThreadInput = z.infer<typeof createThreadSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
