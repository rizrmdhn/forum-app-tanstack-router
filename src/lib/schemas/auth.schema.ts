import * as z from "zod"

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export const registerSchema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak cocok",
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
