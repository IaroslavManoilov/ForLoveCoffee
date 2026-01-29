<template>
  <div class="page">
    <main class="wrap">
      <section class="card">
        <div class="top">
          <div>
            <h1 class="title">Заказы</h1>
            <p class="sub">Локально (localStorage). Для демо — отлично.</p>
          </div>

          <div class="topActions">
            <button class="btn btn--ghost" type="button" @click="load">Обновить</button>
            <button class="btn btn--ghost" type="button" @click="clearAll" :disabled="!orders.length">
              Очистить все
            </button>
          </div>
        </div>

        <div v-if="!orders.length" class="empty">Пока нет заказов.</div>

        <div v-else class="list">
          <div v-for="o in orders" :key="o.id" class="item">
            <div class="row">
              <div class="left">
                <div class="id">#{{ o.id }}</div>

                <div class="meta">
                  {{ formatDate(o.createdAt) }} • {{ o.customer.name }} • {{ o.customer.phone }}
                </div>

                <div class="meta">
                  Время: <b>{{ o.pickupTime }}</b> •
                  {{ o.delivery.type === "delivery" ? "Доставка" : "Самовывоз" }}
                  <span v-if="o.delivery.address"> • {{ o.delivery.address }}</span>
                </div>

                <div v-if="o.delivery.type === 'delivery'" class="meta">
                  Доставка: <b>{{ o.delivery.distanceKm }} км</b> • <b>{{ o.delivery.fee }} MDL</b>
                </div>

                <div class="meta">
                  Оплата: <b>{{ o.payment.method === "cash" ? "Наличные" : "Карта" }}</b>
                  <span v-if="o.payment.method === 'cash' && o.payment.changeFrom">
                    • Сдача с: <b>{{ o.payment.changeFrom }} MDL</b>
                  </span>
                </div>
              </div>

              <div class="right">
                <div class="sum">{{ o.total }} MDL</div>
                <div class="badge" :data-paid="o.payment.paid">
                  {{ o.payment.paid ? "Оплачен" : "Ожидает оплаты" }}
                </div>
              </div>
            </div>

            <div class="items">
              <div v-for="i in o.items" :key="i.id" class="miniRow">
                <span class="miniName">{{ i.title }}</span>
                <span class="miniMeta">{{ i.qty }}×{{ i.price }}</span>
                <span class="miniPrice">{{ i.qty * i.price }} MDL</span>
              </div>
            </div>

            <div class="actions">
              <button class="btn btn--primary" type="button" @click="markPaid(o.id)" :disabled="o.payment.paid">
                Отметить “Оплачен”
              </button>

              <NuxtLink class="btn btn--ghost" :to="`/success?orderId=${encodeURIComponent(o.id)}`">
                Открыть чек
              </NuxtLink>

              <button class="btn btn--ghost" type="button" @click="copyReceipt(o)">Скопировать чек</button>

              <button class="btn btn--danger" type="button" @click="removeOrder(o.id)">
                Удалить
              </button>
            </div>
          </div>
        </div>

        <p v-if="toast" class="toast">{{ toast }}</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
type Order = {
  id: string
  createdAt: string
  status: "created" | "paid"
  customer: { name: string; phone: string }
  delivery: {
    type: "pickup" | "delivery"
    address: string
    distanceKm: number
    fee: number
  }
  pickupTime: string
  payment: { method: "cash" | "card"; paid: boolean; changeFrom?: number | null }
  comment: string
  items: Array<{ id: string; title: string; price: number; qty: number; tag: string; img: string }>
  subtotal: number
  total: number
}

useHead({ title: "Admin — Orders" })

const KEY = "forlove_orders_v1"
const orders = ref<Order[]>([])
const toast = ref("")

function showToast(text: string) {
  toast.value = text
  setTimeout(() => (toast.value = ""), 1500)
}

function load() {
  if (!import.meta.client) return
  const raw = localStorage.getItem(KEY)
  orders.value = raw ? JSON.parse(raw) : []
}

onMounted(load)

function save(list: Order[]) {
  if (!import.meta.client) return
  localStorage.setItem(KEY, JSON.stringify(list))
  orders.value = list
}

function markPaid(id: string) {
  const list = orders.value.map((o) => {
    if (o.id !== id) return o
    return { ...o, payment: { ...o.payment, paid: true }, status: "paid" }
  })
  save(list)
  showToast("Отмечено как оплачено ✅")
}

function removeOrder(id: string) {
  const list = orders.value.filter((o) => o.id !== id)
  save(list)
  showToast("Удалено")
}

function clearAll() {
  save([])
  showToast("Все очищено")
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function copyReceipt(o: Order) {
  const lines: string[] = []
  lines.push(`For Love Coffee — Чек`)
  lines.push(`Заказ: ${o.id}`)
  lines.push(`Дата: ${formatDate(o.createdAt)}`)
  lines.push(`Время: ${o.pickupTime}`)
  lines.push(`Клиент: ${o.customer.name} (${o.customer.phone})`)

  lines.push(`Способ: ${o.delivery.type === "delivery" ? "Доставка" : "Самовывоз"}`)
  if (o.delivery.address) lines.push(`Адрес: ${o.delivery.address}`)
  if (o.delivery.type === "delivery") {
    lines.push(`Доставка: ${o.delivery.distanceKm} км × 10 = ${o.delivery.fee} MDL`)
  }

  lines.push(`Оплата: ${o.payment.method === "cash" ? "Наличными" : "Картой"} при получении`)
  if (o.payment.method === "cash" && o.payment.changeFrom) lines.push(`Сдача с: ${o.payment.changeFrom} MDL`)

  lines.push(`Статус: ${o.payment.paid ? "Оплачен" : "Ожидает оплаты"}`)
  lines.push(`---`)
  for (const i of o.items) lines.push(`${i.title} — ${i.qty}×${i.price} = ${i.qty * i.price} MDL`)
  lines.push(`---`)
  lines.push(`Товары: ${o.subtotal} MDL`)
  if (o.delivery.type === "delivery") lines.push(`Доставка: ${o.delivery.fee} MDL`)
  lines.push(`Итого: ${o.total} MDL`)

  navigator.clipboard.writeText(lines.join("\n"))
  showToast("Чек скопирован")
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 90px 18px 64px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #241b18;
}
.wrap {
  max-width: 980px;
  margin: 0 auto;
}
.card {
  border-radius: 26px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1);
  backdrop-filter: blur(10px);
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.title {
  margin: 0;
  font-size: 28px;
}
.sub {
  margin: 6px 0 0;
  opacity: 0.75;
}
.topActions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.list {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}
.item {
  border-radius: 22px;
  padding: 14px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.id {
  font-weight: 1000;
}
.meta {
  margin-top: 3px;
  font-size: 12px;
  opacity: 0.78;
}
.right {
  text-align: right;
}
.sum {
  font-weight: 1000;
  color: #b24a4a;
}
.badge {
  display: inline-flex;
  margin-top: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 1000;
  font-size: 12px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.65);
}
.badge[data-paid="true"] {
  border-color: rgba(56, 134, 86, 0.22);
  background: rgba(56, 134, 86, 0.10);
}

.items {
  margin-top: 10px;
  display: grid;
  gap: 6px;
}
.miniRow {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  font-weight: 800;
  font-size: 12px;
  opacity: 0.92;
}
.miniName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.miniMeta {
  opacity: 0.75;
}
.miniPrice {
  color: #b24a4a;
  white-space: nowrap;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 900;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.08);
  color: #111;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.15s ease;
}
.btn:hover {
  transform: translateY(-1px);
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
}
.btn--primary {
  background: #b24a4a;
  color: #fff;
}
.btn--ghost {
  background: rgba(163, 147, 147, 0.08);
}
.btn--danger {
  background: rgba(178, 74, 74, 0.14);
  border: 1px solid rgba(178, 74, 74, 0.22);
}

.empty {
  margin-top: 14px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
  font-weight: 900;
  opacity: 0.8;
}

.toast {
  margin-top: 12px;
  font-weight: 1000;
  color: #2f7c4c;
}
</style>
