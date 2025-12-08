import { z } from "zod"

export const SignInFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
})

export type SignInFormData = z.infer<typeof SignInFormSchema>
