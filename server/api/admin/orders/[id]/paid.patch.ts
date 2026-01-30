// server/api/admin/orders/[id]/paid.patch.ts
import { getRouterParam } from "h3"
import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = String(getRouterParam(event, "id") ?? "")
  const { run } = await getDb()

  await run(`UPDATE orders SET paid = 1 WHERE id = ?`, [id])
  return { ok: true }
})
