<template>
  <div class="item">
    <div class="item__imgWrap" :class="{ 'item__imgWrap--big': big }">
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
        <slot name="meta" />
        <button class="buyBtn" type="button" @click="$emit('buy', p)">Купить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/composables/useCart"

defineProps<{ p: Product; big?: boolean }>()
defineEmits<{ (e: "buy", p: Product): void }>()
</script>

<style scoped>
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

.mini {
  font-size: 12px;
  font-weight: 1000;
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.55);
}

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
</style>
