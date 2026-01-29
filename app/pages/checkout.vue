<template>
  <div class="page">
    <main class="wrap">
      <section class="card">
        <h1 class="title">Оформление заказа</h1>
        <p class="sub">Заполни данные — и мы подготовим заказ.</p>

        <div v-if="!cart.length" class="empty">
          <div class="emptyTitle">Корзина пустая</div>
          <NuxtLink class="btn btn--primary" to="/menu">Вернуться в меню</NuxtLink>
        </div>

        <div v-else class="grid">
          <!-- LEFT -->
          <form class="form" @submit.prevent="submit">
            <label class="field">
              <span class="label">Имя</span>
              <input v-model.trim="form.name" class="input" type="text" placeholder="Иван" />
            </label>

            <label class="field">
              <span class="label">Телефон</span>
              <input v-model.trim="form.phone" class="input" type="tel" placeholder="+373 ..." />
            </label>

            <label class="field">
              <span class="label">Способ</span>
              <select v-model="form.type" class="input">
                <option value="pickup">Самовывоз</option>
                <option value="delivery">Доставка (Кишинёв)</option>
              </select>
            </label>

            <label class="field">
              <span class="label">Время выдачи</span>
              <select v-model="form.pickupTime" class="input">
                <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
              </select>
              <small class="hint">
                {{ form.type === "delivery" ? "Доставка: минимум +30 минут" : "Самовывоз: ближайшее время" }}
              </small>
            </label>

            <!-- DELIVERY -->
            <template v-if="form.type === 'delivery'">
              <label class="field">
                <span class="label">Адрес (только Кишинёв)</span>
                <input
                  v-model.trim="form.address"
                  class="input"
                  type="text"
                  placeholder="Кишинёв, ул. ... дом ..."
                />
                <small class="hint">Адрес должен содержать “Кишинев / Chișinău / Chisinau”.</small>
              </label>

              <label class="field">
                <span class="label">Расстояние (км)</span>
                <select v-model.number="form.distanceKm" class="input">
                  <option v-for="n in kmOptions" :key="n" :value="n">{{ n }} км</option>
                </select>
                <small class="hint">Стоимость доставки: 10 MDL за 1 км.</small>
              </label>

              <div class="deliveryBox">
                <div>Доставка: <b>{{ deliveryFee }} MDL</b></div>
                <div class="small">({{ form.distanceKm }} км × 10 MDL)</div>
              </div>
            </template>

            <!-- ✅ Оплата -->
            <div class="payBox">
              <div class="payTitle">Оплата</div>

              <label class="radio">
                <input v-model="form.pay" type="radio" value="cash" />
                <span>Наличными при получении</span>
              </label>

              <label class="radio">
                <input v-model="form.pay" type="radio" value="card" />
                <span>Картой при получении</span>
              </label>

              <!-- ✅ Сдача с -->
              <label v-if="form.pay === 'cash'" class="field" style="margin-top: 8px">
                <span class="label">Сдача с (MDL)</span>
                <input
                  v-model.number="form.changeFrom"
                  class="input"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Например: 200"
                />
                <small class="hint">Если не нужно — оставь пустым.</small>
              </label>
            </div>

            <label class="field">
              <span class="label">Комментарий</span>
              <textarea
                v-model.trim="form.comment"
                class="input textarea"
                rows="3"
                placeholder="Без сахара / позвонить заранее и т.д."
              />
            </label>

            <div class="actions">
              <NuxtLink class="btn btn--ghost" to="/menu">Назад</NuxtLink>
              <button class="btn btn--primary" type="submit">Подтвердить заказ</button>
            </div>

            <p v-if="error" class="error">{{ error }}</p>
          </form>

          <!-- RIGHT -->
          <aside class="summary">
            <div class="sumTitle">Твой заказ</div>

            <div class="list">
              <div v-for="i in cart" :key="i.id" class="row">
                <div class="rowLeft">
                  <div class="name">{{ i.title }}</div>
                  <div class="meta">{{ i.qty }} × {{ i.price }} MDL</div>
                </div>
                <div class="rowPrice">{{ i.qty * i.price }} MDL</div>
              </div>
            </div>

            <div class="totalLine">
              <div>Товары</div>
              <div class="money">{{ totalPrice }} MDL</div>
            </div>

            <div v-if="form.type === 'delivery'" class="totalLine">
              <div>Доставка</div>
              <div class="money">{{ deliveryFee }} MDL</div>
            </div>

            <div class="total">
              <div>Итого</div>
              <div class="totalPrice">{{ totalWithDelivery }} MDL</div>
            </div>

            <div class="hintBox">
              После подтверждения будет страница <b>“Успешно”</b> с чек-квитанцией.
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCart } from "~/composables/useCart"

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
  items: any[]
  subtotal: number
  total: number
}

useHead({ title: "Оформление — For Love Coffee" })

const router = useRouter()
const { cart, totalPrice, clear } = useCart()

const KEY_ORDERS = "forlove_orders_v1"
const KEY_SEQ = "forlove_order_seq_v1"

const kmOptions = Array.from({ length: 20 }, (_, i) => i + 1)

const form = reactive({
  name: "",
  phone: "",
  type: "pickup" as "pickup" | "delivery",
  address: "",
  distanceKm: 1,
  pickupTime: "",
  pay: "cash" as "cash" | "card",
  changeFrom: null as number | null,
  comment: "",
})

const deliveryFee = computed(() => {
  if (form.type !== "delivery") return 0
  const km = Number(form.distanceKm || 0)
  return Math.max(0, Math.ceil(km) * 10)
})

const totalWithDelivery = computed(() => totalPrice.value + deliveryFee.value)

const timeOptions = computed(() => buildTimeOptions("10:00", "20:00", 15))

const error = ref("")

watch(
  () => form.type,
  () => {
    // при переключении способа — пересчитать ближайшее время (самовывоз +15, доставка +45)
    const minOffset = form.type === "delivery" ? 45 : 15
    form.pickupTime = getNearestTimeOption(timeOptions.value, minOffset) ?? timeOptions.value[0] ?? "10:00"

    // дефолт по доставке
    if (form.type === "delivery" && !form.distanceKm) form.distanceKm = 1
  },
  { immediate: true }
)

watch(
  () => [form.distanceKm, form.type],
  () => {
    // если вдруг distance пустой
    if (form.type === "delivery" && (!form.distanceKm || form.distanceKm < 1)) form.distanceKm = 1
  }
)

function validate() {
  error.value = ""

  if (!form.name) return "Введите имя"
  if (!form.phone) return "Введите телефон"
  if (!form.pickupTime) return "Выберите время выдачи"
  if (!form.pay) return "Выберите способ оплаты"

  if (form.type === "delivery") {
    if (!form.address) return "Введите адрес доставки"
    if (!isChisinauAddress(form.address)) return "Доставка только по Кишинёву"
    if (!form.distanceKm || form.distanceKm < 1) return "Выберите расстояние (км)"
  }

  if (form.pay === "cash" && form.changeFrom != null && form.changeFrom !== 0) {
    if (form.changeFrom < totalWithDelivery.value) {
      return `Сдача с должна быть ≥ ${totalWithDelivery.value} MDL`
    }
  }

  return ""
}

function generateShortOrderId(): string {
  if (!import.meta.client) return `FL-${1000 + Date.now()}`

  const raw = localStorage.getItem(KEY_SEQ)
  const current = raw ? Number(raw) : 1041
  const next = current + 1
  localStorage.setItem(KEY_SEQ, String(next))
  return `FL-${next}`
}

function submit() {
  const err = validate()
  if (err) {
    error.value = err
    return
  }

  const orderId = generateShortOrderId()

  const order: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    status: "created",
    customer: { name: form.name, phone: form.phone },
    pickupTime: form.pickupTime,
    delivery: {
      type: form.type,
      address: form.type === "delivery" ? form.address : "",
      distanceKm: form.type === "delivery" ? Number(form.distanceKm) : 0,
      fee: deliveryFee.value,
    },
    payment: {
      method: form.pay,
      paid: false,
      changeFrom: form.pay === "cash" ? form.changeFrom : null,
    },
    comment: form.comment,
    items: cart.value,
    subtotal: totalPrice.value,
    total: totalWithDelivery.value,
  }

  if (import.meta.client) {
    const raw = localStorage.getItem(KEY_ORDERS)
    const prev = raw ? JSON.parse(raw) : []
    prev.unshift(order)
    localStorage.setItem(KEY_ORDERS, JSON.stringify(prev))
  }

  clear()
  router.push(`/success?orderId=${encodeURIComponent(orderId)}`)
}

/** utils */
function buildTimeOptions(start: string, end: string, stepMin: number) {
  const toMin = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number)
    return h * 60 + m
  }
  const toHHMM = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
  }

  const s = toMin(start)
  const e = toMin(end)
  const out: string[] = []
  for (let t = s; t <= e; t += stepMin) out.push(toHHMM(t))
  return out
}

// minOffset: +15 для самовывоза, +45 для доставки
function getNearestTimeOption(options: string[], minOffset: number) {
  if (!options.length) return null

  const now = new Date()
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const target = minutesNow + minOffset

  const toMin = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number)
    return h * 60 + m
  }

  for (const t of options) {
    if (toMin(t) >= target) return t
  }
  return options[options.length - 1]
}

function isChisinauAddress(addr: string) {
  const a = addr.toLowerCase()
  return a.includes("кишин") || a.includes("chisinau") || a.includes("chișinău") || a.includes("chisinău")
}
</script>

<style scoped>
.page { min-height: 100vh; padding: 90px 18px 64px; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #241b18; }
.wrap { max-width: 980px; margin: 0 auto; }

.card {
  border-radius: 26px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1);
  backdrop-filter: blur(10px);
}

.title { margin: 0; font-size: 28px; letter-spacing: -0.02em; }
.sub { margin: 8px 0 0; opacity: 0.8; }

.grid { margin-top: 16px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 14px; }
.form { display: grid; gap: 12px; }
.field { display: grid; gap: 6px; }
.label { font-weight: 900; font-size: 13px; opacity: 0.85; }

.input {
  border-radius: 16px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.7);
  padding: 12px 12px;
  outline: none;
  font-weight: 700;
}

.textarea { resize: vertical; }

.actions { margin-top: 6px; display: flex; gap: 10px; flex-wrap: wrap; }

.btn {
  display: inline-flex; align-items: center; gap: 10px;
  border: none; cursor: pointer; border-radius: 999px;
  padding: 14px 22px; font-weight: 800; font-size: 15px;
  transition: transform 0.15s ease, background 0.15s ease;
  background: rgba(0, 0, 0, 0.08); color: #111; text-decoration: none;
}
.btn:hover { transform: translateY(-1px); }
.btn--primary { background: #b24a4a; color: #fff; }
.btn--ghost { background: rgba(163, 147, 147, 0.08); }

.summary {
  border-radius: 22px; padding: 14px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.55);
  height: fit-content;
}
.sumTitle { font-weight: 1000; }

.list { margin-top: 10px; display: grid; gap: 10px; }
.row {
  display: flex; justify-content: space-between; gap: 10px;
  padding: 10px; border-radius: 16px;
  border: 1px solid rgba(80, 55, 48, 0.10);
  background: rgba(255, 255, 255, 0.6);
}
.name { font-weight: 1000; }
.meta { margin-top: 2px; font-size: 12px; opacity: 0.75; }
.rowPrice { font-weight: 1000; color: #b24a4a; white-space: nowrap; }

.totalLine { margin-top: 10px; display: flex; justify-content: space-between; font-weight: 1000; opacity: 0.9; }
.money { color: #b24a4a; }

.total {
  margin-top: 10px; display: flex; justify-content: space-between;
  padding: 12px 10px; border-radius: 16px;
  background: rgba(178, 74, 74, 0.08);
  border: 1px solid rgba(178, 74, 74, 0.16);
  font-weight: 1000;
}
.totalPrice { color: #b24a4a; }

.error { margin: 0; color: #b24a4a; font-weight: 900; }
.hint { font-size: 12px; opacity: 0.7; }
.hintBox { margin-top: 10px; font-size: 12px; opacity: 0.75; line-height: 1.4; }

.payBox {
  border-radius: 18px;
  padding: 12px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}
.payTitle { font-weight: 1000; margin-bottom: 8px; }
.radio { display: flex; align-items: center; gap: 10px; padding: 8px 6px; border-radius: 12px; font-weight: 800; }
.radio input { transform: scale(1.1); }

.deliveryBox{
  margin-top: 6px;
  border-radius: 16px;
  padding: 10px;
  border: 1px solid rgba(80, 55, 48, 0.10);
  background: rgba(255, 255, 255, 0.6);
  font-weight: 900;
}
.small{ font-size: 12px; opacity: 0.75; margin-top: 2px; }

.empty { margin-top: 14px; padding: 14px; border-radius: 18px; border: 1px solid rgba(80, 55, 48, 0.12); background: rgba(255, 255, 255, 0.6); }
.emptyTitle { font-weight: 1000; margin-bottom: 10px; }

@media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
</style>
