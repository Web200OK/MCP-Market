<script setup>
import { RouterView } from 'vue-router'
import MarketHeader from '@/components/MarketHeader.vue'
</script>

<template>
  <div class="app-container">
    <MarketHeader />
    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-content {
  flex: 1;
  padding-top: 60px; /* 仅匹配导航栏高度 */
  overflow-y: auto;
}
</style>
