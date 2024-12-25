<script setup>

const { $bootstrap } = useNuxtApp();
import 'v-calendar/style.css';
import { useScreens } from 'vue-screen-utils';

// import Modal from 'bootstrap/js/dist/modal';
import { Icon } from '@iconify/vue';

const modal = ref(null);
const modalRef = ref(null);
onMounted(() => {
  // modal.value = new Modal(document.getElementById('dateModal'));
  modal.value = $bootstrap.modal(modalRef.value);
})

const openModal = () => {
  // modal.value.show();
  console.log('openModal called')
  if (modal.value) {
    modal.value.show()
  } else {
    console.error('Modal not initialized')
  }
}

const closeModal = () => {
  modal.value.hide();
}

defineExpose({
  openModal,
  closeModal
})

const emit = defineEmits(['handleDateChange']);


const props = defineProps({
  dateTime: {
    type: Object,
    required: true,
  }
})

const confirmCancelOrder = () => {
  console.log('confirmDate called')
  closeModal();
}

</script>

<template>
  <div
    id="dateModal"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true" ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered m-0 mt-9 mx-md-auto">
      <div
        class="modal-content"
      >
        <div class="modal-header border-0">
          <div class="d-flex flex-column gap-4">
            <button
              type="button"
              class="btn-close"
              style="margin-left: -8px !important;"
              @click="closeModal"
            />
            
          </div>
        </div>
        <div class="d-none d-md-flex modal-header gap-15 p-8 pb-0 border-0">
          
        </div>
        <div class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold">
          確定要取消此房型的預訂嗎？
        </div>
        <div
          class="modal-footer d-flex gap-4 modal-footer border-0"
        >
          <button
            type="button"
            class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff" @click="closeModal"
          >
            關閉視窗
          </button>
          <button
            type="button"
            class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold"
            @click="confirmCancelOrder"
          >
          確定取消
          </button>
        </div>

      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.modal {
  backdrop-filter: blur(10px);
}

.modal-dialog {
  max-width: 740px;
}


.date-picker :deep(.vc-primary) {
  --vc-accent-50: #f0f9ff;
  --vc-accent-100: #e0f2fe;
  --vc-accent-200: #F9F9F9;
  --vc-accent-300: #7dd3fc;
  --vc-accent-400: #38bdf8;
  --vc-accent-500: #0ea5e9;
  --vc-accent-600: #000000;
  --vc-accent-700: #FFFFFF;
  --vc-accent-800: #F9F9F9;
  --vc-accent-900: #000000;
}


.date-picker :deep(.vc-container) {
  --vc-font-family: : "Noto Serif TC", serif;
}

.date-picker :deep(.vc-pane-layout) {
  gap: 60px;
}

.date-picker :deep(.vc-header) {
  margin-bottom: 4px;
}



.date-picker :deep(.vc-title) {
  background-color: transparent;
  color: #000000;
  font-size: 1.25rem;
  font-weight: bold;
}

.date-picker :deep(.vc-arrow) {
  width: 24px;
  height: 24px;
  background-color: transparent;
}

.date-picker :deep(.vc-base-icon) {
  width: 12px;
  stroke: #000;
}

.date-picker :deep(.vc-weeks) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-picker :deep(.vc-weeks) {
  padding: 0;
}

.date-picker :deep(.vc-weekday) {
  --vc-weekday-color: #4B4B4B;
  font-size: var(--vc-text-base);
  font-weight: 500;
  padding: 12px 14px 8px 14px;
  line-height: unset;
}

.date-picker :deep(.vc-day-content) {
  font-size: var(--vc-text-base);
  width: 44px;
  height: 44px;
}

.date-picker :deep(.vc-highlight) {
  width: 44px;
  height: 44px;
}

.date-picker :deep(.vc-attr) {
  --vc-highlight-outline-bg: #000000;
}
</style>