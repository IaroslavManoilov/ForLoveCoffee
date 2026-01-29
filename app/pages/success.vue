<template>
  <div class="page">
    <main class="wrap">
      <section class="card" v-if="order">
        <div class="ok">
          <div class="okIcon">✅</div>
          <div>
            <h1 class="title">Заказ оформлен</h1>
            <p class="sub">Номер заказа: <b>{{ order.id }}</b></p>
            <p class="sub">Время выдачи: <b>{{ order.pickupTime }}</b></p>
            <p class="sub">Время оформления: <b>{{ formatDate(order.createdAt) }}</b></p>

          </div>
        </div>

        <div class="receipt">
          <div class="rTitle">Чек-квитанция</div>

          <div class="rMeta">
            <div>Дата: {{ formatDate(order.createdAt) }}</div>
            <div>Оплата: <b>{{ payText }}</b></div>
            <div>Статус: <b>{{ order.payment.paid ? "Оплачен" : "Ожидает оплаты" }}</b></div>

            <div v-if="order.payment.method === 'cash' && order.payment.changeFrom">
              Сдача с: <b>{{ order.payment.changeFrom }} MDL</b>
            </div>

            <div>
              {{ order.delivery.type === "delivery" ? "Доставка" : "Самовывоз" }}
              <span v-if="order.delivery.address"> • {{ order.delivery.address }}</span>
            </div>

            <div v-if="order.delivery.type === 'delivery'">
              Расстояние: <b>{{ order.delivery.distanceKm }} км</b> • Доставка: <b>{{ order.delivery.fee }} MDL</b>
            </div>

            <div>Контакт: {{ order.customer.name }} • {{ order.customer.phone }}</div>
          </div>

          <div class="list">
            <div v-for="i in order.items" :key="i.id" class="row">
              <div class="left">
                <div class="name">{{ i.title }}</div>
                <div class="meta">{{ i.qty }} × {{ i.price }} MDL</div>
              </div>
              <div class="price">{{ i.qty * i.price }} MDL</div>
            </div>
          </div>

          <div class="totalLine">
            <div>Товары</div>
            <div class="money">{{ order.subtotal }} MDL</div>
          </div>

          <div v-if="order.delivery.type === 'delivery'" class="totalLine">
            <div>Доставка</div>
            <div class="money">{{ order.delivery.fee }} MDL</div>
          </div>

          <div class="total">
            <div>Итого</div>
            <div class="totalPrice">{{ order.total }} MDL</div>
          </div>
        </div>

        <div class="actions">
          <button class="btn btn--ghost" type="button" @click="print">Скачать чек (PDF)</button>
          <NuxtLink class="btn btn--primary" to="/menu">Вернуться в меню</NuxtLink>
        </div>

        <p class="printHint">
          Нажми “Скачать чек (PDF)” → в окне печати выбери “Save as PDF”.
        </p>
      </section>

      <section class="card" v-else>
        <h1 class="title">Заказ не найден</h1>
        <p class="sub">Скорее всего, страница открыта без orderId.</p>
        <NuxtLink class="btn btn--primary" to="/menu">В меню</NuxtLink>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
type Order = {
  id: string // FL-####
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

useHead({ title: "Успешно — For Love Coffee" })

const route = useRoute()
const order = ref<Order | null>(null)

onMounted(() => {
  const orderId = String(route.query.orderId || "")
  if (!orderId) return

  const raw = localStorage.getItem("forlove_orders_v1")
  const list: Order[] = raw ? JSON.parse(raw) : []
  order.value = list.find((o) => o.id === orderId) || null
})

const payText = computed(() => {
  if (!order.value) return ""
  return order.value.payment.method === "cash" ? "Наличными при получении" : "Картой при получении"
})

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function print() {
  window.print()
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
  max-width: 860px;
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

.ok {
  display: flex;
  gap: 12px;
  align-items: center;
}
.okIcon {
  font-size: 26px;
}
.title {
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.02em;
}
.sub {
  margin: 6px 0 0;
  opacity: 0.8;
}

.receipt {
  margin-top: 14px;
  border-radius: 22px;
  padding: 14px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}
.rTitle {
  font-weight: 1000;
  font-size: 16px;
}
.rMeta {
  margin-top: 8px;
  display: grid;
  gap: 4px;
  font-weight: 800;
  font-size: 12px;
  opacity: 0.88;
}

.list {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid rgba(80, 55, 48, 0.1);
  background: rgba(255, 255, 255, 0.65);
}
.name {
  font-weight: 1000;
}
.meta {
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.75;
}
.price {
  font-weight: 1000;
  color: #b24a4a;
  white-space: nowrap;
}

.totalLine {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  font-weight: 1000;
  opacity: 0.9;
}
.money {
  color: #b24a4a;
}

.total {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  padding: 12px 10px;
  border-radius: 16px;
  background: rgba(178, 74, 74, 0.08);
  border: 1px solid rgba(178, 74, 74, 0.16);
  font-weight: 1000;
}
.totalPrice {
  color: #b24a4a;
}

.actions {
  margin-top: 14px;
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
  padding: 14px 22px;
  font-weight: 800;
  font-size: 15px;
  transition: transform 0.15s ease, background 0.15s ease;
  background: rgba(0, 0, 0, 0.08);
  color: #111;
  text-decoration: none;
}
.btn:hover {
  transform: translateY(-1px);
}
.btn--primary {
  background: #b24a4a;
  color: #fff;
}
.btn--ghost {
  background: rgba(163, 147, 147, 0.08);
}

.printHint {
  margin: 10px 0 0;
  font-size: 12px;
  opacity: 0.75;
}

/* печать: показываем только чек */
@media print {
  .actions,
  .printHint {
    display: none;
  }
  .page {
    padding: 0;
  }
  .card {
    box-shadow: none;
    border: none;
    background: #fff;
  }
}
</style>
