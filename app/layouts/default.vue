<template>
  <TopBar />
  <div class="page">
    <slot />
  </div>
</template>

<style>
.page {
  padding-top: calc(110px + 12px);
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}
</style>
