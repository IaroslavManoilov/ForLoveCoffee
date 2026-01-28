<template>
    <header class="topbar">
        <div class="topbar__inner">
            <RouterLink class="logo" to="/">
                <img :src="topLogo" alt="For-love coffee" />
            </RouterLink>

            <nav class="nav">
                <RouterLink class="nav__link" to="/" end>Главная</RouterLink>
                <RouterLink class="nav__link" to="/about">Про нас</RouterLink>
                <RouterLink class="nav__link" to="/contacts">Контакты</RouterLink>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { RouterLink } from "vue-router";
import topLogo from "@/assets/image5.svg";
// если файл у тебя называется "image 5.svg", то:
// import topLogo from "@/assets/image 5.svg";
</script>

<style scoped>
.topbar {
    position: fixed;
    top: 12px;

    /* ✅ вместо left/right */
    left: 50%;
    transform: translateX(-50%);
    width: 100%;

    height: 110px;
    z-index: 50;

    background: rgba(235, 235, 235, 0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border-bottom: 2px solid rgba(255, 255, 255, 0.35);

    /* ✅ страховка от выезда */
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
</style>
