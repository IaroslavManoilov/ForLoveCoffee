// server/db/sqlite.ts
import fs from "node:fs"
import path from "node:path"
import sqlite3 from "sqlite3"

sqlite3.verbose()

const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const dbPath = path.join(dataDir, "forlove.sqlite")
export const db = new sqlite3.Database(dbPath)

// --- promisified helpers
export function run(sql: string, params: any[] = []) {
  return new Promise<{ lastID: number; changes: number }>((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err)
      resolve({ lastID: (this as any).lastID, changes: (this as any).changes })
    })
  })
}

export function get<T = any>(sql: string, params: any[] = []) {
  return new Promise<T | undefined>((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err)
      resolve(row as T)
    })
  })
}

export function all<T = any>(sql: string, params: any[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err)
      resolve(rows as T[])
    })
  })
}

// --- init tables
let inited = false
export async function initDb() {
  if (inited) return
  inited = true

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_type TEXT NOT NULL,
      delivery_address TEXT,
      delivery_distance_km INTEGER,
      delivery_fee INTEGER NOT NULL,
      prep_minutes INTEGER NOT NULL,
      ready_at TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      payment_paid INTEGER NOT NULL DEFAULT 0,
      change_from INTEGER,
      change_due INTEGER,
      comment TEXT,
      items_json TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL
    )
  `)
}
