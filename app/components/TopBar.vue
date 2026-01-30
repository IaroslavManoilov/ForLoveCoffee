<template>
    <header class="topbar">
        <div class="topbar__inner">
            <NuxtLink class="logo" to="/">
                <img :src="topLogo" alt="For-love coffee" />
            </NuxtLink>

            <nav class="nav">
                <NuxtLink class="nav__link" to="/" exact>Главная</NuxtLink>
                <NuxtLink class="nav__link" to="/about">Про нас</NuxtLink>
                <NuxtLink class="nav__link" to="/contacts">Контакты</NuxtLink>

                <!-- 👤 + 🔒/🔓 -->
                <NuxtLink class="adminBtn" to="/admin/login" aria-label="Admin">
                    <span class="adminIcon">👤</span>
                    <span class="lock" :data-ok="isAdminAuthed ? '1' : '0'">
                        {{ isAdminAuthed ? "🔓" : "🔒" }}
                    </span>
                </NuxtLink>
            </nav>
        </div>
    </header>
</template>

<script setup lang="ts">
import topLogo from "@/assets/image5.svg"

const isAdminAuthed = ref(false)
const route = useRoute()

async function checkAdminAuth() {
    if (!import.meta.client) return
    try {
        const me = await $fetch<{ ok: boolean }>("/api/admin/me")
        isAdminAuthed.value = !!me?.ok
    } catch {
        isAdminAuthed.value = false
    }
}

onMounted(checkAdminAuth)

watch(
    () => route.fullPath,
    () => {
        checkAdminAuth()
    }
)

if (import.meta.client) {
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) checkAdminAuth()
    })
}
</script>



<style scoped>
.topbar {
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 110px;
    z-index: 50;

    background: rgba(235, 235, 235, 0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border-bottom: 2px solid rgba(255, 255, 255, 0.35);
    overflow-x: clip;
}

.topbar__inner {
    height: 100%;
    width: 100%;
    padding: 0 clamp(16px, 4vw, 60px);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 100%;
    cursor: pointer;
    text-decoration: none;
}

.logo img {
    width: 110px;
    height: auto;
    display: block;
    transition: transform 0.18s ease;
    transform-origin: center;
}

.logo:hover img {
    transform: scale(1.12);
}

.logo:active img {
    transform: scale(1.18);
}

.nav {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: clamp(16px, 5vw, 70px);
    height: 100%;
}

.nav__link {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.72);
    font-weight: 500;
    font-size: clamp(14px, 1.2vw, 18px);
}

.nav__link.router-link-active,
.nav__link.router-link-exact-active {
    color: #b24a4a;
    position: relative;
}

.nav__link.router-link-active::after,
.nav__link.router-link-exact-active::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    background: #b24a4a;
    bottom: -10px;
    border-radius: 3px;
}

/* 👤 кнопка админа */
.adminBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 56px;
    height: 44px;
    padding: 0 12px;
    border-radius: 999px;
    text-decoration: none;

    background: rgba(0, 0, 0, 0.06);
    color: rgba(0, 0, 0, 0.72);
}

.adminBtn:hover {
    background: rgba(178, 74, 74, 0.14);
}

.adminIcon {
    line-height: 1;
}

.lock {
    font-size: 16px;
    line-height: 1;
    opacity: 0.9;
}

/* чуть выделим 🔓 когда залогинен */
.lock[data-ok="1"] {
    filter: drop-shadow(0 4px 10px rgba(47, 124, 76, 0.25));
}
</style>
