// server/api/admin/orders.get.ts
import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const { all } = await getDb()

  const orders = await all<any>(`SELECT * FROM orders ORDER BY datetime(createdAt) DESC`)

  // подтягиваем items для каждого заказа (проще, но достаточно для начала)
  const withItems = await Promise.all(
    orders.map(async (o) => {
      const items = await all<any>(
        `SELECT id, title, price, qty, category FROM order_items WHERE orderId = ?`,
        [o.id]
      )
      return { ...o, paid: !!o.paid, items }
    })
  )

  return { ok: true, orders: withItems }
})
