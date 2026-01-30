import { createError, readBody, setCookie } from "h3"

export default defineEventHandler(async (event) => {
  const body = await readBody<any>(event)
  const login = String(body?.login ?? "")
  const password = String(body?.password ?? "")

  // поменяй на свои значения
  if (login !== "admin" || password !== "admin") {
    throw createError({ statusCode: 401, statusMessage: "Bad credentials" })
  }

  setCookie(event, "admin_session", "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return { ok: true }
})
