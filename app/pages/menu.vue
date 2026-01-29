<template>
  <div class="page">
    <!-- BACKGROUND -->
    <div class="bg" aria-hidden="true">
      <div class="bg__warm" />
      <div class="bg__grain" />
      <div class="bg__blob bg__blob--1" />
      <div class="bg__blob bg__blob--2" />
    </div>

    <main class="wrap">
      <!-- HEADER -->
      <section class="head">
        <div class="head__badge">☕ Меню — For-L∞ve</div>

        <h1 class="head__title">
          Выбирай вкус <span class="dot">с любовью.</span>
        </h1>

        <p class="head__text">
          Слева — кофе и напитки, справа — блинчики. Всё свежее и вкусное ✨
        </p>

        <div class="head__actions">
          <NuxtLink class="btn btn--primary" to="/booking">Забронировать столик</NuxtLink>
          <NuxtLink class="btn btn--ghost" to="/contacts">Контакты</NuxtLink>

          <button class="btn btn--ghost cartBtn" type="button" @click="openCart">
            Корзина
            <span v-if="totalQty" class="cartBadge">{{ totalQty }}</span>
          </button>
        </div>
      </section>

      <!-- GRID -->
      <section class="menuGrid">
        <!-- LEFT -->
        <article class="card">
          <div class="card__head">
            <h2 class="card__title">Кофе & напитки</h2>
            <p class="card__subtitle">
              Сиропы, мороженое, настроение — выбирай своё.
            </p>
          </div>

          <!-- COFFEE -->
          <div class="group">
            <div class="group__top">
              <div class="group__badge">For-L∞ve coffee</div>
              <div class="group__title">Кофе</div>
            </div>

            <div class="items">
              <div v-for="p in coffee" :key="p.id" class="item">
                <div class="item__imgWrap">
                  <img class="item__img" :src="p.img" :alt="p.title" loading="lazy" />
                </div>

                <div class="item__body">
                  <div class="item__row">
                    <div class="item__name">{{ p.title }}</div>
                    <div class="item__price">{{ p.price }} MDL</div>
                  </div>

                  <div class="item__desc">{{ p.desc }}</div>

                  <div class="item__meta">
                    <span class="pill">{{ p.tag }}</span>
                    <button class="buyBtn" type="button" @click="buy(p)">Купить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- DRINKS -->
          <div class="group">
            <div class="group__top">
              <div class="group__badge group__badge--soft">For-L∞ve drinks</div>
              <div class="group__title">Чай / напитки</div>
            </div>

            <div class="items">
              <div v-for="p in drinks" :key="p.id" class="item">
                <div class="item__imgWrap">
                  <img class="item__img" :src="p.img" :alt="p.title" loading="lazy" />
                </div>

                <div class="item__body">
                  <div class="item__row">
                    <div class="item__name">{{ p.title }}</div>
                    <div class="item__price">{{ p.price }} MDL</div>
                  </div>

                  <div class="item__desc">{{ p.desc }}</div>

                  <div class="item__meta">
                    <span class="pill pill--green">{{ p.tag }}</span>
                    <span class="mini">лёд</span>
                    <span class="mini">цитрус</span>

                    <button class="buyBtn" type="button" @click="buy(p)">Купить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- RIGHT -->
        <aside class="card card--accent right">
          <div class="card__head">
            <h2 class="card__title">Блинчики</h2>
            <p class="card__subtitle">Сладкие, нежные — идеальны к кофе.</p>
          </div>

          <div class="items items--single">
            <div v-for="p in crepes" :key="p.id" class="item item--big">
              <div class="item__imgWrap item__imgWrap--big">
                <img class="item__img" :src="p.img" :alt="p.title" loading="lazy" />
              </div>

              <div class="item__body">
                <div class="item__row">
                  <div class="item__name">{{ p.title }}</div>
                  <div class="item__price">{{ p.price }} MDL</div>
                </div>

                <div class="item__desc">{{ p.desc }}</div>

                <div class="item__meta">
                  <span class="pill">{{ p.tag }}</span>
                  <span class="mini">добавки</span>
                  <span class="mini">шоколад</span>

                  <button class="buyBtn" type="button" @click="buy(p)">Купить</button>
                </div>
              </div>
            </div>
          </div>

          <div class="cta">
            <div class="ctaLeft">
              <div class="ctaTitle">Хочешь помочь выбрать?</div>
              <div class="ctaText">Напиши нам — подскажем по вкусу.</div>
            </div>

            <NuxtLink class="btn btn--primary" to="/contacts">Написать</NuxtLink>
          </div>
        </aside>
      </section>
    </main>

    <!-- TOAST -->
    <div class="toast" :data-show="toast.show">
      {{ toast.text }}
    </div>

    <!-- CART DRAWER -->
    <div class="drawer" :data-open="cartOpen" @click.self="cartOpen = false">
      <div class="drawerPanel">
        <div class="drawerTop">
          <div class="drawerTitle">Корзина</div>
          <button class="iconBtn" type="button" @click="cartOpen = false">✕</button>
        </div>

        <div v-if="cart.length" class="drawerList">
          <div v-for="i in cart" :key="i.id" class="drawerItem">
            <img class="drawerImg" :src="i.img" :alt="i.title" loading="lazy" />

            <div class="drawerInfo">
              <div class="drawerName">{{ i.title }}</div>
              <div class="drawerSub">{{ i.price }} MDL • {{ i.tag }}</div>

              <div class="qtyRow">
                <button class="qtyBtn" type="button" @click="dec(i.id)">−</button>
                <div class="qtyNum">{{ i.qty }}</div>
                <button class="qtyBtn" type="button" @click="inc(i.id)">+</button>

                <button class="removeBtn" type="button" @click="remove(i.id)">Удалить</button>
              </div>
            </div>

            <div class="drawerLinePrice">{{ i.price * i.qty }} MDL</div>
          </div>
        </div>

        <div v-else class="empty">
          <div class="emptyTitle">Пусто</div>
          <div class="emptyText">Добавь что-нибудь вкусное 🙂</div>
        </div>

        <div class="drawerBottom">
          <div class="sumRow">
            <div class="sumLabel">Итого</div>
            <div class="sumValue">{{ totalPrice }} MDL</div>
          </div>

          <div class="drawerActions">
            <button class="btn btn--ghost" type="button" @click="clear" :disabled="!cart.length">
              Очистить
            </button>

           <button
  class="btn btn--primary"
  type="button"
  :disabled="!cart.length"
  @click="goCheckout"
>
  Оформить
</button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart, type Product } from "~/composables/useCart"


const router = useRouter()

function goCheckout() {
  cartOpen.value = false
  router.push("/checkout")
}



useHead({
  title: "Меню — For Love Coffee",
  meta: [
    { name: "description", content: "Меню For Love Coffee: кофе, чай и сладкие блинчики." },
  ],
})

const { cart, totalQty, totalPrice, add, remove, inc, dec, clear } = useCart()

const cartOpen = ref(false)
const toast = ref({ show: false, text: "" })

let toastTimer: any = null
function showToast(text: string) {
  toast.value = { show: true, text }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value.show = false), 1600)
}

function buy(p: Product) {
  add(p, 1)
  showToast(`Добавлено: ${p.title}`)
}

function openCart() {
  cartOpen.value = true
}

// ✅ public/ — картинки должны лежать в /public и тогда путь просто "image-10.png"
const coffee: Product[] = [
  {
    id: "coffee-raspberry",
    category: "coffee",
    title: "Raspberry Ice Coffee",
    desc: "Холодный кофе с мороженым и малиновым акцентом.",
    price: 59,
    img: "image-10.png",
    tag: "sweet",
  },
  {
    id: "coffee-pistachio",
    category: "coffee",
    title: "Pistachio Ice Coffee",
    desc: "Нежный вкус фисташки + малина.",
    price: 59,
    img: "image-11.png",
    tag: "nutty",
  },
  {
    id: "coffee-oreo",
    category: "coffee",
    title: "Oreo Ice Coffee",
    desc: "Кремовая текстура и крошка печенья Oreo.",
    price: 59,
    img: "image-12.png",
    tag: "creamy",
  },
  {
    id: "coffee-bounty",
    category: "coffee",
    title: "Bounty Ice Coffee",
    desc: "Шоколадный топпинг и кокосовое настроение.",
    price: 59,
    img: "image-13.png",
    tag: "choco",
  },
]

const drinks: Product[] = [
  {
    id: "drink-tea-lemon",
    category: "drinks",
    title: "For-L∞ve Tea (Lemon)",
    desc: "Освежающий чай со льдом, лимоном и мятой.",
    price: 39,
    img: "image-15.png",
    tag: "fresh",
  },
  {
    id: "drink-mojito-na",
    category: "drinks",
    title: "Mojito (Non-Alcohol)",
    desc: "Лайм, мята, лёд — бодрит и освежает.",
    price: 45,
    img: "image-14.png",
    tag: "cool",
  },
]

const crepes: Product[] = [
  {
    id: "crepe-strawberry",
    category: "crepes",
    title: "Crepe Strawberry",
    desc: "Клубника, крем и сахарная пудра — нежно и ярко.",
    price: 65,
    img: "image-16.png",
    tag: "berry",
  },
  {
    id: "crepe-banana-choco",
    category: "crepes",
    title: "Crepe Banana & Choco",
    desc: "Банан + шоколад, идеальная пара к кофе.",
    price: 65,
    img: "image-17.png",
    tag: "classic",
  },
  {
    id: "crepe-nutella-coconut",
    category: "crepes",
    title: "Crepe Nutella & Coconut",
    desc: "Шоколадная паста, кокос и орехи — сладкий топ.",
    price: 69,
    img: "image-18.png",
    tag: "top",
  },
]
</script>

<style scoped>
/* твой CSS + добавил интерактив и drawer */

/* BASE */
.page {
  min-height: 100vh;
  padding: 90px 18px 64px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #241b18;
  position: relative;
  overflow: hidden;
}

.bg {
  position: fixed;
  inset: 0;
  z-index: -1;
}

.bg__warm {
  position: absolute;
  inset: 0;
  background: radial-gradient(1100px 700px at 20% 10%, rgba(255, 228, 214, 0.9), transparent 60%),
    radial-gradient(900px 600px at 85% 30%, rgba(255, 214, 196, 0.65), transparent 60%),
    radial-gradient(900px 900px at 45% 100%, rgba(214, 170, 150, 0.35), transparent 60%),
    linear-gradient(180deg, #fff 0%, #fbf5f1 45%, #f5ede8 100%);
}

.bg__grain {
  position: absolute;
  inset: 0;
  opacity: 0.22;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

.bg__blob {
  position: absolute;
  width: 560px;
  height: 560px;
  filter: blur(40px);
  opacity: 0.35;
  border-radius: 999px;
  transform: translate3d(0, 0, 0);
}

.bg__blob--1 {
  left: -140px;
  top: 120px;
  background: radial-gradient(circle at 30% 30%, rgba(196, 88, 52, 0.55), transparent 60%);
  animation: floaty 12s ease-in-out infinite;
}

.bg__blob--2 {
  right: -180px;
  bottom: -140px;
  background: radial-gradient(circle at 30% 30%, rgba(130, 70, 55, 0.55), transparent 60%);
  animation: floaty 14s ease-in-out infinite reverse;
}

@keyframes floaty {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(22px, -18px) scale(1.03);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

.wrap {
  max-width: 1180px;
  margin: 0 auto;
}

.head {
  border-radius: 26px;
  padding: 26px 22px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1), 0 2px 0 rgba(255, 255, 255, 0.6) inset;
  backdrop-filter: blur(10px);
}

.head__badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(196, 88, 52, 0.12);
  border: 1px solid rgba(196, 88, 52, 0.18);
  font-weight: 800;
  color: #7a3b2b;
  font-size: 13px;
}

.head__title {
  margin: 14px 0 6px;
  font-size: clamp(34px, 4vw, 56px);
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.dot {
  color: rgba(233, 68, 68, 0.95);
  text-shadow: 0 10px 25px rgba(196, 88, 52, 0.25);
}

.head__text {
  margin: 0;
  max-width: 72ch;
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.88;
}

.head__actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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
  letter-spacing: 0.2px;
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  background: rgba(0, 0, 0, 0.08);
  color: #111;
  text-decoration: none;
  user-select: none;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0px) scale(0.99);
}

.btn--primary {
  background: #b24a4a;
  color: #fff;
  box-shadow: 0 10px 24px rgba(178, 74, 74, 0.26);
}

.btn--primary:hover {
  background: #933737;
}

.btn--ghost {
  background: rgba(163, 147, 147, 0.08);
  color: #111;
  box-shadow: none;
}

.btn--ghost:hover {
  background: rgba(232, 13, 13, 0.12);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
}

.menuGrid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 14px;
}

.card {
  border-radius: 26px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1);
  backdrop-filter: blur(10px);
}

.card--accent {
  background: radial-gradient(900px 500px at 30% 10%, rgba(196, 88, 52, 0.16), transparent 55%),
    rgba(255, 255, 255, 0.62);
}

.card__head {
  margin-bottom: 14px;
}

.card__title {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.01em;
}

.card__subtitle {
  margin: 6px 0 0;
  opacity: 0.78;
  line-height: 1.5;
}

.right {
  align-self: start;
}

.group {
  margin-top: 14px;
}

.group__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.group__badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(196, 88, 52, 0.12);
  border: 1px solid rgba(196, 88, 52, 0.18);
  font-weight: 900;
  font-size: 12px;
  color: #7a3b2b;
}

.group__badge--soft {
  background: rgba(178, 74, 74, 0.1);
  border-color: rgba(178, 74, 74, 0.18);
  color: #7c2f2f;
}

.group__title {
  font-weight: 1000;
  letter-spacing: -0.01em;
}

.items {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.items--single {
  grid-template-columns: 1fr;
}

.item {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.54);
  border: 1px solid rgba(80, 55, 48, 0.12);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
}

.item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.72);
  border-color: rgba(196, 88, 52, 0.22);
}

.item__imgWrap {
  position: relative;
  aspect-ratio: 4 / 3;
  background: rgba(255, 255, 255, 0.55);
}

.item__imgWrap--big {
  aspect-ratio: 16 / 11;
}

.item__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  padding: 10px;
}

.item__body {
  padding: 12px 12px 14px;
  min-width: 0;
}

.item__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.item__name {
  font-weight: 1000;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

.item__price {
  font-weight: 1000;
  color: #b24a4a;
  white-space: nowrap;
}

.item__desc {
  margin-top: 6px;
  opacity: 0.82;
  line-height: 1.5;
  font-size: 13px;
}

.item__meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.pill {
  font-size: 12px;
  font-weight: 1000;
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.55);
}

.pill--green {
  border-color: rgba(56, 134, 86, 0.22);
  background: rgba(56, 134, 86, 0.08);
}

.mini {
  font-size: 12px;
  font-weight: 1000;
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.55);
}

.cta {
  margin-top: 14px;
  border-radius: 22px;
  padding: 14px;
  background: rgba(178, 74, 74, 0.1);
  border: 1px solid rgba(178, 74, 74, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.ctaTitle {
  font-weight: 1000;
}

.ctaText {
  opacity: 0.8;
  margin-top: 2px;
}

/* BUY BUTTON */
.buyBtn {
  margin-left: auto;
  border: 0;
  cursor: pointer;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 900;
  font-size: 12px;
  background: rgba(178, 74, 74, 0.12);
  border: 1px solid rgba(178, 74, 74, 0.22);
  color: #7c2f2f;
  transition: transform 140ms ease, background 140ms ease;
}
.buyBtn:hover {
  transform: translateY(-1px);
  background: rgba(178, 74, 74, 0.18);
}
.buyBtn:active {
  transform: translateY(0px) scale(0.98);
}

/* CART BUTTON BADGE */
.cartBtn {
  position: relative;
}
.cartBadge {
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 1000;
  background: rgba(178, 74, 74, 0.18);
  border: 1px solid rgba(178, 74, 74, 0.28);
}

/* TOAST */
.toast {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%) translateY(14px);
  opacity: 0;
  pointer-events: none;
  z-index: 50;
  padding: 12px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(80, 55, 48, 0.14);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.16);
  backdrop-filter: blur(10px);
  font-weight: 900;
}
.toast[data-show="true"] {
  opacity: 1;
  transform: translateX(-50%) translateY(0px);
  transition: all 160ms ease;
}

/* DRAWER */
.drawer {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(10, 10, 10, 0.35);
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease;
}
.drawer[data-open="true"] {
  opacity: 1;
  pointer-events: auto;
}
.drawerPanel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: min(420px, 92vw);
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(14px);
  border-left: 1px solid rgba(80, 55, 48, 0.14);
  box-shadow: -18px 0 60px rgba(32, 18, 14, 0.18);
  transform: translateX(18px);
  transition: transform 180ms ease;
  display: flex;
  flex-direction: column;
}
.drawer[data-open="true"] .drawerPanel {
  transform: translateX(0px);
}

.drawerTop {
  padding: 14px 14px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(80, 55, 48, 0.12);
}
.drawerTitle {
  font-weight: 1000;
  font-size: 18px;
}
.iconBtn {
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.65);
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 900;
}

.drawerList {
  padding: 12px;
  overflow: auto;
  flex: 1;
  display: grid;
  gap: 10px;
}
.drawerItem {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 10px;
  padding: 10px;
  border-radius: 18px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}
.drawerImg {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(80, 55, 48, 0.10);
  padding: 6px;
}
.drawerInfo {
  min-width: 0;
}
.drawerName {
  font-weight: 1000;
  line-height: 1.2;
}
.drawerSub {
  margin-top: 3px;
  font-size: 12px;
  opacity: 0.78;
}

.qtyRow {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.qtyBtn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-weight: 1000;
}
.qtyNum {
  min-width: 22px;
  text-align: center;
  font-weight: 1000;
}
.removeBtn {
  margin-left: auto;
  border: 1px solid rgba(178, 74, 74, 0.22);
  background: rgba(178, 74, 74, 0.10);
  color: #7c2f2f;
  border-radius: 999px;
  padding: 8px 10px;
  font-weight: 1000;
  cursor: pointer;
}

.drawerLinePrice {
  font-weight: 1000;
  color: #b24a4a;
  white-space: nowrap;
  align-self: start;
  padding-top: 2px;
}

.empty {
  padding: 18px;
  opacity: 0.85;
}
.emptyTitle {
  font-weight: 1000;
}
.emptyText {
  margin-top: 4px;
}

.drawerBottom {
  padding: 12px;
  border-top: 1px solid rgba(80, 55, 48, 0.12);
}
.sumRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 12px;
  border-radius: 18px;
  background: rgba(178, 74, 74, 0.08);
  border: 1px solid rgba(178, 74, 74, 0.16);
}
.sumLabel {
  font-weight: 1000;
  opacity: 0.85;
}
.sumValue {
  font-weight: 1000;
  color: #b24a4a;
}

.drawerActions {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

@media (max-width: 980px) {
  .menuGrid {
    grid-template-columns: 1fr;
  }
  .items {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .page {
    padding-top: 90px;
  }
  .head {
    padding: 22px 16px;
  }
  .card {
    padding: 16px;
  }
}
</style>
