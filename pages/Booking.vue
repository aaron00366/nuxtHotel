<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BookingLoading from '@/components/rooms/BookingLoading.vue';
import { Icon } from '@iconify/vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw'; // 引入中文本地化
import { cities } from '../utils/cities'; // 引入城市資料

dayjs.locale('zh-tw');
const router = useRouter();
import { storeToRefs } from 'pinia';
const Store = useStores()
const { roomDetail, setBookingInfo, isLoading,userInfo } = storeToRefs(Store)
console.log(setBookingInfo.value)
const tempUserInfo = ref({
    address: {
      zipcode: '',
      detail: ""
    },
    name: "",
    phone: "",
    email: ""
  })
const goBack = () => {
  router.back();
}
const isLoadingDialod = ref(false);

const confirmBooking = async () => {
  isLoadingDialod.value = true;
  const body = {
      roomId: roomDetail.value._id,
      checkInDate: setBookingInfo.value.bookingInfo.date.start,
      checkOutDate: setBookingInfo.value.bookingInfo.date.end,
      peopleNum: setBookingInfo.value.bookingPeople,
      userInfo:tempUserInfo.value
    }
  const { data } = await useFetch('https://nuxr3.zeabur.app/api/v1/orders/',{
    method: "POST", 
    body
  });
console.log('確認訂房的資料 ==>',data.value)
  setTimeout(() => {
    isLoadingDialod.value = false;
    router.push(`/BookingConfirm/${roomDetail.value._id}`);
  }, 1500);
}

const formatDate = (date) => {
  return dayjs(date).format('MM 月 DD 日 dddd');
}


const selectedCity = ref('高雄市');
const selectedDistrict = ref('新興區');
const districts = ref(cities.find(city => city.name === selectedCity.value).districts);
const postalCode = ref(districts.value.find(district => district.name === selectedDistrict.value).postalCode);

// 監聽縣市選擇的變化
watch(selectedCity, (newCity) => {
  const city = cities.find(city => city.name === newCity);
  districts.value = city ? city.districts : [];
  selectedDistrict.value = districts.value[0].name;
  postalCode.value = districts.value[0].postalCode;
});

// 監聽區域選擇的變化
watch(selectedDistrict, (newDistrict) => {
  const district = districts.value.find(district => district.name === newDistrict);
  postalCode.value = district ? district.postalCode : '';
});

const applyUserInfo = () => {
  tempUserInfo.value = {
    address: {
      zipcode: userInfo.value.address.zipcode,
      detail: userInfo.value.address.detail
    },
    name: userInfo.value.name,
    phone: userInfo.value.phone,
    email: userInfo.value.email
  }
  selectedCity.value = userInfo.value.address.city;
  selectedDistrict.value = userInfo.value.address.county;
}
</script>

<template>
  <ClientOnly>
    <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="goBack"
        >
          <Icon
            class="fs-5 text-neutral-100"
            icon="mdi:keyboard-arrow-left"
          />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">
            確認訂房資訊
          </h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      選擇房型
                    </h3>
                    <p class="mb-0 fw-medium" v-if="roomDetail">
                      {{ roomDetail.name }}
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button" @click="goBack"
                  >
                    編輯
                  </button>
                </div>
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      訂房日期
                    </h3>
                    <p class="mb-2 fw-medium" v-if="setBookingInfo">
                      入住：{{ formatDate(setBookingInfo.bookingInfo.date.start) }}
                      <!-- 入住：12 月 4 日星期二 -->
                    </p>
                    <p class="mb-0 fw-medium" v-if="setBookingInfo">
                      退房：{{ formatDate(setBookingInfo.bookingInfo.date.end) }}
                      <!-- 退房：12 月 6 日星期三 -->
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button" @click="goBack"
                  >
                    編輯
                  </button>
                </div>
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      房客人數
                    </h3>
                    <p class="mb-0 fw-medium">
                      {{ setBookingInfo.bookingPeople }} 人
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button" @click="goBack"
                  >
                    編輯
                  </button>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

            <section>
              <div class="d-flex justify-content-between align-items-center mb-10">
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button" @click="applyUserInfo"
                >
                  套用會員資料
                </button>
              </div>

              <div class="d-flex flex-column gap-6">
                <div class="text-neutral-100">
                  <label
                    for="name"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >姓名</label>
                  <input
                    id="name"
                    type="text"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    placeholder="請輸入姓名" v-model="tempUserInfo.name"
                  >
                </div>

                <div class="text-neutral-100">
                  <label
                    for="phone"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >手機號碼</label>
                  <input
                    id="phone"
                    type="tel"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    placeholder="請輸入手機號碼" v-model="tempUserInfo.phone"
                  >
                </div>

                <div class="text-neutral-100">
                  <label
                    for="email"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >電子信箱</label>
                  <input
                    id="email"
                    type="email"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    placeholder="請輸入電子信箱" v-model="tempUserInfo.email"
                  >
                </div>

                <div class="text-neutral-100">
                  <label
                    for="address"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >地址</label>
                  <div className="d-flex gap-2 mb-4">
                    <select v-model="selectedCity"
                      class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                    >
                    <option v-for="city in cities" :key="city.name" :value="city.name">
                      {{ city.name }}
                    </option>
                    </select>
                    <select v-model="selectedDistrict"
                      class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                    >
                    <option v-for="district in districts" :key="district" :value="district.name">
                    {{ district.name }}
                  </option>
                    </select>
                  </div>
                  <input
                    id="address"
                    type="text"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    placeholder="請輸入詳細地址" v-model="tempUserInfo.address.detail"
                  >
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomDetail.areaInfo }}

                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomDetail.bedInfo }}

                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        最多 {{ roomDetail.maxPeople }} 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房間格局
                  </h3>
                  <ul class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <li class="d-flex gap-2" v-for="layout in roomDetail.layoutInfo" :key="layout.title">
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ layout.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房內設備
                  </h3>
                  <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <li class="flex-item d-flex gap-2" v-for="facility in roomDetail.facilityInfo" :key="facility.title">
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
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    備品提供
                  </h3>
                  <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <li class="flex-item d-flex gap-2" v-for="amenity in roomDetail.amenityInfo" :key="amenity.title">
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ amenity.title }}
                      </p>
                    </li>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
            >
              <img
                class="img-fluid rounded-3"
                src="@/assets/images/room-a-1.png"
                alt="room-a"
              >

              <div>
                <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="d-flex align-items-center text-neutral-100 fw-medium">
                    <span>NT$ {{ Number(roomDetail.price) }}</span>
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      icon="material-symbols:close"
                    />
                    <span class="text-neutral-80">{{ Number(setBookingInfo.bookingInfo.daysCount) }} 晚</span>
                  </div>
                  <span class="fw-medium">
                    NT$ {{ Number(roomDetail.price) * Number(setBookingInfo.bookingInfo.daysCount) }}
                  </span>
                </div>
                <div class="d-flex justify-content-between align-items-center fw-medium">
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100">
                    -NT$ 1,000
                  </span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40">
                <div class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold">
                  <p class="d-flex align-items-center mb-0">
                    總價
                  </p>
                  <span>
                    NT$ {{ Number(roomDetail.price) * Number(setBookingInfo.bookingInfo.daysCount) - 1000 }}
                  </span>
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="button"
                @click="confirmBooking"
              >
                確認訂房
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BookingLoading v-if="isLoadingDialod" />
  </main>
  </ClientOnly>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #BF9D7D;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}

</style>