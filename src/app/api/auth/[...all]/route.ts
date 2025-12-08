import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth/auth"

const authHandler = toNextJsHandler(auth.handler)
export const { GET, POST } = authHandler
