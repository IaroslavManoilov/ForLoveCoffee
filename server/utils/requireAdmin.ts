// server/utils/requireAdmin.ts
import { getCookie, createError } from "h3"

export function requireAdmin(event: any) {
  const ok = getCookie(event, "admin_session") === "ok"
  if (!ok) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
}
