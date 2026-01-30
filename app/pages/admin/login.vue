<template>
    <div class="page">
        <div class="card">
            <h1 class="title">Admin</h1>
            <p class="sub">Вход в панель заказов</p>

            <label class="label">
                Login
                <input v-model="login" class="input" placeholder="login" autocomplete="username" @input="error = ''"
                    @keyup.enter="doLogin" />
            </label>

            <label class="label">
                Password
                <input v-model="password" class="input" type="password" placeholder="********"
                    autocomplete="current-password" @input="error = ''" @keyup.enter="doLogin" />
            </label>

            <button class="btn" type="button" @click="doLogin">Войти</button>
            <p v-if="error" class="error">{{ error }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
useHead({ title: "Admin login" })

const login = ref("")
const password = ref("")
const error = ref("")

onMounted(async () => {
    // если уже залогинен — сразу в заказы
    try {
        const me = await $fetch<{ ok: boolean }>("/api/admin/me")
        if (me.ok) navigateTo("/admin/orders")
    } catch {
        // ignore
    }
})

async function doLogin() {
    error.value = ""
    try {
        await $fetch("/api/admin/login", {
            method: "POST",
            body: { login: login.value, password: password.value },
        })
        navigateTo("/admin/orders")
    } catch {
        error.value = "Неверный логин или пароль"
    }
}

</script>

<style scoped>
.page {
    min-height: 100vh;
    padding: 140px 18px 64px;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: linear-gradient(180deg, #fff 0%, #fbf5f1 45%, #f5ede8 100%);
}

.card {
    max-width: 420px;
    margin: 0 auto;
    border-radius: 22px;
    padding: 18px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(80, 55, 48, 0.12);
    box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1);
    backdrop-filter: blur(10px);
}

.title {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.01em;
}

.sub {
    margin: 6px 0 14px;
    opacity: 0.75;
}

.label {
    display: grid;
    gap: 6px;
    margin-top: 10px;
    font-weight: 700;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.75);
}

.input {
    width: 100%;
    padding: 12px 12px;
    border-radius: 14px;
    border: 1px solid rgba(80, 55, 48, 0.18);
    background: rgba(255, 255, 255, 0.7);
    outline: none;
}

.btn {
    margin-top: 14px;
    width: 100%;
    border: none;
    cursor: pointer;
    border-radius: 999px;
    padding: 14px 16px;
    font-weight: 900;
    background: #b24a4a;
    color: #fff;
    box-shadow: 0 10px 24px rgba(178, 74, 74, 0.26);
}

.btn:hover {
    background: #933737;
}

.error {
    margin-top: 10px;
    color: #b00020;
    font-weight: 800;
}
</style>
