import { getCookie, readBody } from "h3"
import { initDb, run } from "../../../db/sqlite"

export default defineEventHandler(async (event) => {
  if (getCookie(event, "admin_auth") !== "ok") {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }
  await initDb()

  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" })

  const paid = body?.paid ? 1 : 0

  await run(`UPDATE orders SET payment_paid = ? WHERE public_id = ?`, [paid, id])

  return { ok: true }
})
