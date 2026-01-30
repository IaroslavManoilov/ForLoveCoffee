import { getCookie } from "h3"

export default defineEventHandler((event) => {
  return { ok: getCookie(event, "admin_session") === "ok" }
})
