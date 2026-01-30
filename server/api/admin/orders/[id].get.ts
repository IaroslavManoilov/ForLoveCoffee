import { getDb } from "~~/server/utils/db"

import { getRouterParam, createError } from "h3"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing order id" })
  }

  const { get, all } = await getDb()

  const order = await get<any>(
    `SELECT * FROM orders WHERE id = ?`,
    [id]
  )

  if (!order) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" })
  }

  const items = await all<any>(
    `SELECT * FROM order_items WHERE orderId = ?`,
    [id]
  )

  return {
    ok: true,
    order: {
      ...order,
      paid: Boolean(order.paid),
      items,
    },
  }
})
