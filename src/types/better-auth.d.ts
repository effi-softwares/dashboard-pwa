import "better-auth"

declare module "better-auth" {
  interface User {
    role: string | null
    banned: boolean
    banReason: string | null
    banExpires: Date | null
  }
}
