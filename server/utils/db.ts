import sqlite3 from "sqlite3"
import { join } from "node:path"

let db: sqlite3.Database | null = null

function run(sql: string, params: any[] = []) {
  return new Promise<void>((resolve, reject) => {
    if (!db) return reject(new Error("DB not initialized"))
    db.run(sql, params, (err) => (err ? reject(err) : resolve()))
  })
}

function all<T = any>(sql: string, params: any[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    if (!db) return reject(new Error("DB not initialized"))
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows as T[])))
  })
}

function get<T = any>(sql: string, params: any[] = []) {
  return new Promise<T | null>((resolve, reject) => {
    if (!db) return reject(new Error("DB not initialized"))
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve((row as T) ?? null)))
  })
}

export async function getDb() {
  if (db) return { run, all, get }

  const file = join(process.cwd(), "data.sqlite")
  db = new sqlite3.Database(file)

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      deliveryType TEXT NOT NULL,
      deliveryAddress TEXT NOT NULL,
      deliveryDistanceKm INTEGER NOT NULL,
      deliveryFee INTEGER NOT NULL,
      prepMinutes INTEGER NOT NULL,
      readyAt TEXT NOT NULL,
      paymentMethod TEXT NOT NULL,
      paid INTEGER NOT NULL,
      changeFrom INTEGER,
      changeDue INTEGER,
      comment TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS order_items (
      orderId TEXT NOT NULL,
      id TEXT NOT NULL,
      title TEXT NOT NULL,
      price INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      category TEXT,
      PRIMARY KEY(orderId, id)
    )
  `)

  return { run, all, get }
}
