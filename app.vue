<template>
<ClientOnly>
<div class="vl-parent">
  <loading v-model:active="isLoading"
  :can-cancel="true"
  :on-cancel="onCancel"
  :is-full-page="fullPage"
  >
    <div class="loadingio-spinner-blocks-2by998twmg8">
  <div class="ldio-yzaezf3dcmj">
  <div style='left:46px;top:46px;animation-delay:0s'></div>
  <div style='left:80px;top:46px;animation-delay:0.125s'></div>
  <div style='left:114px;top:46px;animation-delay:0.25s'></div>
  <div style='left:46px;top:80px;animation-delay:0.875s'></div>
  <div style='left:114px;top:80px;animation-delay:0.375s'></div>
  <div style='left:46px;top:114px;animation-delay:0.75s'></div>
  <div style='left:80px;top:114px;animation-delay:0.625s'></div>
  <div style='left:114px;top:114px;animation-delay:0.5s'></div>
  </div>
    </div>
  </loading>
    </div>
    </ClientOnly>
  <AppHeader />
  <div>
    <NuxtPage />
  </div>
  <AppFooter />
</template>
<script setup>
import AppHeader from '@/components/global/AppHeader.vue';
import AppFooter from '@/components/global/AppFooter.vue';
import { storeToRefs } from 'pinia';
const Store = useStores()
const { isLoading } = storeToRefs(Store)
onMounted(() => {
  isLoading.value = false
})
</script>
<style scoped>
@keyframes ldio-yzaezf3dcmj {
  0% { background: #003666 }
  12.5% { background: #003666 }
  12.625% { background: #050f2c }
  100% { background: #050f2c }
}
.ldio-yzaezf3dcmj div {
  position: absolute;
  width: 30px;
  height: 30px;
  background: #050f2c;
  animation: ldio-yzaezf3dcmj 1s linear infinite;
}
.loadingio-spinner-blocks-2by998twmg8 {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  /* background: #ffffff; */
}
.ldio-yzaezf3dcmj {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-yzaezf3dcmj div { box-sizing: content-box; }
/* [ldio] generated by https://loading.io */
</style>
