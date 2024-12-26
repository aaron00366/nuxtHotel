<script setup>
import { Icon } from '@iconify/vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw'; // 引入中文本地化
// import 'bootstrap/js/dist/modal';
import CancelModal from '@/components/CancelModal.vue';
import { useRouter } from 'vue-router';
// pinia
import { storeToRefs } from 'pinia';
const Store = useStores()
const { cannotOrder } = storeToRefs(Store)
const router = useRouter();
const cancelOrderModal = ref(null);
const openModal = () => {
  cancelOrderModal.value.openModal();
}
// const { $bootstrap } = useNuxtApp();
const result = ref(null);
const recentOrder = ref(null);

const formatDate = (date) => {
  return dayjs(date).format('MM 月 DD 日 dddd');
}
onMounted(() => {
  getOrder();
  cannotOrder.value = true;
});

const getOrder = async () => {
  const getUserCookie = useCookie("auth");
  const { data } = await useFetch("https://nuxr3.zeabur.app/api/v1/orders/",{
    headers: {
      Authorization: `Bearer ${getUserCookie.value}`
    },
  });
  result.value = data.value.result;
  console.log('獲取訂單列表:', result.value);
  console.log('訂單數量:', result.value.length);
  const ordersLength = result.value.length;
  if (result.value.length === 0) {
    return;
  }
  recentOrder.value = result.value[ordersLength - 1];
}

const cancelOrder = async () => {
  try {
    console.log('點刪除');
    const getUserCookie = useCookie("auth");
    
    // 等待刪除請求完成
    const { data, error } = await useFetch(
      `https://nuxr3.zeabur.app/api/v1/orders/${recentOrder.value._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getUserCookie.value}`
      },
    });

    if (error.value) {
      console.error('刪除失敗:', error.value);
      return;
    }

    console.log('刪除成功:', data.value);
    // 等待一小段時間確保後端處理完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 確保刪除完成後才重新獲取訂單
    await getOrder();
  } catch (err) {
    console.error('刪除過程發生錯誤:', err);
  }
}
const getOrderDetail = () => {
  router.push(`/RoomDetail/${recentOrder.value.roomId._id}`);
}
</script>

<template>
  <div>
    <ClientOnly>
    <div class="row gap-6 gap-md-0">
      <div class="col-12 col-md-7">
      <div
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
        style="max-width: 730px;"
      >
        <div>
          <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">
            預訂參考編號：
            {{ recentOrder._id }}
          </p>
          <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
            即將來的行程
          </h2>
        </div>

        <img
          class="img-fluid rounded-3"
          :src="recentOrder.roomId.imageUrl"
          alt="room-a"
        >

        <section class="d-flex flex-column gap-6">
          <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
            <p class="mb-0">
              {{ recentOrder.roomId.name }}, 1晚
            </p>
            <span
              class="d-inline-block mx-4 bg-neutral-80"
              style="width: 1px;height: 18px;"
            />
            <p class="mb-0">
              住宿人數：{{ recentOrder.peopleNum }} 位
            </p>
          </h3>

          <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
            <p class="title-deco mb-2">
              入住：{{ formatDate(result[0].checkInDate) }}，15:00 可入住
            </p>
            <p
              class="title-deco mb-0"
            >
              退房：{{ formatDate(result[0].checkOutDate) }}，12:00 前退房
            </p>
          </div>

          <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
            NT$ {{ Number(recentOrder.roomId.price) }}
          </p>
        </section>

        <hr class="my-0 opacity-100 text-neutral-40">

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            房內設備
          </h3>
          <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
            <li class="flex-item d-flex gap-2" v-for="facility in recentOrder.roomId.facilityInfo" :key="facility.title">
              <Icon
                class="fs-5 text-primary-100"
                icon="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">
                {{ facility.title }}
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            備品提供
          </h3>
          <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
            <li class="flex-item d-flex gap-2" v-for="amenityInfo in recentOrder.roomId.amenityInfo" :key="amenityInfo.title">
              <Icon
                class="fs-5 text-primary-100"
                icon="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">
                {{ amenityInfo.title }}
              </p>
            </li>
          </ul>
        </section>

        <div class="d-flex gap-4">
          <button
            @click="openModal"
            class="btn btn-outline-primary-100 w-50 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
          >
            取消預訂
          </button>
          <button
            to="/RoomDetail"
            class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
            type="button" @click="getOrderDetail"
          >
            查看詳情
          </button>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-5">
      <div
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
      >
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
          歷史訂單
        </h2>

        <div v-for="resultObj in result" :key="resultObj._id">
          <div class="d-flex flex-column flex-lg-row gap-6">
          <img
            class="img-fluid object-fit-cover rounded-3"
            style="max-width: 120px; height: 80px;"
            :src="resultObj.roomId.imageUrl"
            alt="room-a"
          >
          <section class="d-flex flex-column gap-4">
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
              預訂參考編號： {{ resultObj._id }}
            </p>
          
            <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
              {{ resultObj.roomId.name }}
            </h3>

            <div class="text-neutral-80 fw-medium">
              <p class="mb-2">
                住宿天數： 1 晚
              </p>
              <p class="mb-0">
                住宿人數：{{ resultObj.peopleNum }} 位
              </p>
            </div>

            <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
              <p class="title-deco mb-2">
                入住：{{ formatDate(resultObj.checkInDate) }}，15:00 可入住
              </p>
              <p
                class="title-deco mb-0"
              >
                退房：{{ formatDate(resultObj.checkOutDate) }}，12:00 前退房
              </p>
            </div>
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
              NT$ {{ Number(resultObj.roomId.price) }}
            </p>
          </section>
        </div>

        <hr class="my-0 opacity-100 text-neutral-40 mt-4">
        </div>
        


        <button
          class="btn btn-outline-primary-100 py-4 fw-bold"
          style="--bs-btn-hover-color: #fff"
          type="button"
        >
          查看更多
        </button>
      </div>
    </div>
    </div>
    <!-- modal -->
    <!-- <div
      id="cancelModal"
      class="modal fade"
      tabindex="-1" ref="modalRef"
    >
      <div class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold">
            確定要取消此房型的預訂嗎？
          </div>
          <div class="modal-footer d-flex gap-4">
            <button
              type="button"
              class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
              style="--bs-btn-hover-color: #fff"
              data-bs-dismiss="modal"
            >
              關閉視窗
            </button>
            <button
              type="button"
              class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold" @click="cancelOrder"
            >
              確定取消
            </button>
          </div>
        </div>
      </div>
    </div> -->
    <CancelModal 
    ref="cancelOrderModal" @handleCancelOrder="cancelOrder"/>
  </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px
);


.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #BF9D7D;
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}


// .modal {
//   // backdrop-filter: blur(10px);

//   // @include media-breakpoint-down(md) {
//   //   backdrop-filter: none;
//   // }
// }

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>