<template>
    <main class="landing" :style="{ backgroundImage: `url(${bg})` }">
        <section class="stage">
            <aside class="glass">
               <div class="glass__title">
                   <span class="t1">For-L</span>
                    <img class="glass__inf" :src="infLogo" alt="∞" />
                    <span class="t1 t1--right">ve</span>
                </div>

                <div class="glass__subtitle">coffee</div>

                <div class="glass__text">
                    Вкус который согреет<br />
                    и подарит любовь
                </div>

                <div class="glass__actions">
                    <button class="btn" type="button" @click="goMenu">Посмотреть меню</button>
                    <button class="btn" type="button" @click="goBooking">Забронировать столик</button>
                </div>
            </aside>
        </section>
    </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import infLogo from "@/assets/logo.svg";
import bg from "@/assets/im2.png";

const router = useRouter();
const goMenu = () => router.push("/menu");
const goBooking = () => router.push("/booking");
</script>

<style>
/* ✅ КЛЮЧЕВОЕ: фон должен начинаться С САМОГО ВЕРХА, но контент — ниже топбара */
.landing {
    width: 100%;
    min-height: 100vh;

    /* 🔥 убираем белую полосу: тянем секцию вверх на высоту topbar */
    margin-top: calc(-110px - 12px);

    /* 🔥 возвращаем место для контента, чтобы не залез под topbar */
    padding-top: calc(110px + 12px);

    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    overflow: hidden;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: #111;
}

.stage {
    min-height: calc(100vh - (110px + 12px));
    width: 100%;
    position: relative;
    padding-left: clamp(16px, 4vw, 60px);
    padding-right: clamp(16px, 4vw, 60px);
}

.glass {
    position: absolute;
    right: clamp(16px, 4vw, 60px);
    top: 220px;

    width: clamp(320px, 55vw, 860px);
    min-height: clamp(380px, 42vw, 640px);
    padding: clamp(22px, 4vw, 70px);

    border-radius: clamp(24px, 3.5vw, 52px);
    background: rgba(255, 255, 255, 0.34);
    border: 2px solid rgba(255, 255, 255, 0.4);

    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    box-shadow: 0 22px 60px rgba(0, 0, 0, 0.2);
    z-index: 3;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.glass__title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 12px;

    font-weight: 900;
    font-style: italic;
    font-size: clamp(44px, 6vw, 112px);
    line-height: 0.95;

    margin: 0 0 clamp(12px, 1.5vw, 18px);

}

.glass__inf {
    position: relative;
    top: 12px;
    width: clamp(14px, 8vw, 140px);
    height: auto;
    display: block;
    margin: 0 -10px;
    

}

.t1--right {
    margin-left: clamp(1px, -2vw, -18px);
}
.glass__subtitle {
    width: 100%;
    font-weight: 900;
    font-style: italic;
    font-size: clamp(30px, 4vw, 72px);
    line-height: 1;
    margin: 0 0 clamp(16px, 2vw, 30px);
}

.glass__text {
    width: 100%;
    max-width: 720px;
    font-size: clamp(18px, 2.4vw, 46px);
    line-height: 1.28;
    color: rgba(0, 0, 0, 0.72);
    margin: 0 0 clamp(18px, 2.4vw, 40px);
}

.glass__actions {
    width: 100%;
    display: flex;
    gap: clamp(14px, 2vw, 26px);
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: clamp(12px, 1.8vw, 20px) clamp(22px, 3vw, 44px);
    border-radius: 999px;

    background: #b24a4a;
    color: #fff;

    border: none;
    cursor: pointer;

    font-weight: 600;
    font-size: clamp(14px, 1.2vw, 18px);

    box-shadow: 0 10px 24px rgba(178, 74, 74, 0.26);
    transition: 0.15s ease;
}

.btn:hover {
    background: #933737;
    transform: translateY(-1px);
}

@media (max-width: 820px) {
    .glass {
        position: relative;
        top: auto;
        right: auto;
        margin: 220px auto 40px;
        width: 92vw;
        min-height: auto;
    }
}


@media (max-width: 520px) {
  .glass__inf {
    top: 3px;                 /* меньше вертикальный сдвиг */
    margin-left: -6px;        /* меньше поджим */
    margin-right: -10px;      /* меньше поджим */
    width: 56px;              /* фикс на мобиле, чтобы не прыгал */
  }
}
@media (max-width: 520px) {
    .btn {
        width: 100%;
    }
}
@media (max-width: 520px) {
    .glass__inf {
        top: 3px;
        /* меньше вертикальный сдвиг */
        margin-left: -6px;
        /* меньше поджим */
        margin-right: -10px;
        /* меньше поджим */
        width: 56px;
        /* фикс на мобиле, чтобы не прыгал */
    }
}

@media (max-width: 820px) {
    .glass {
        position: relative;
        top: auto;
        right: auto;

        /* было 220px — делаем адаптивно */
        margin: clamp(24px, 10vh, 80px) auto 24px;

        width: min(92vw, 520px);
        min-height: auto;
    }
}
/* мобила — делаем “дальше/мельче” */


</style>
