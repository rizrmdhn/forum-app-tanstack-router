import { createFileRoute, Link } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema"
import { useLogin } from "@/hooks/use-login"
import { TEST_IDS } from "@/test-ids"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldError } from "@/components/ui/field"

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
})

function RouteComponent() {
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: standardSchemaResolver(loginSchema),
  })

  const onSubmit = (data: LoginInput) => {
    login(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Masukkan email dan password untuk masuk ke akun Anda
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                data-testid={TEST_IDS.LOGIN.EMAIL_INPUT}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                data-testid={TEST_IDS.LOGIN.PASSWORD_INPUT}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isPending} data-testid={TEST_IDS.LOGIN.SUBMIT}>
              {isPending ? "Memproses..." : "Login"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary underline underline-offset-4">
                Daftar sekarang
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
