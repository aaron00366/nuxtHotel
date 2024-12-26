<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw'; // 引入中文本地化
import { cities } from '../utils/cities'; // 引入城市資料
import { encrypt, decrypt } from "@/utils/crypto/helper/cryptoHelper";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
const Store = useStores()
const { storePW, userInfo, userCity, userDistrict } = storeToRefs(Store)
dayjs.locale('zh-tw');
const formatDate = (date) => {
  return dayjs(date).format('MM 月 DD 日');
}
const isEditPassword = ref(false);
const isEditProfile = ref(false);
// const userInfo = ref({})
const updataInfo = ref({})
const originalData = ref({})
const birthdayYear = ref(null)
const birthdayMonth = ref(null)
const birthdayDay = ref(null)
const getUserCookie = useCookie("auth");
const isModified = computed(() =>
  JSON.stringify(updataInfo.value) !== JSON.stringify(originalData.value)
)

onMounted( async () => {

  const { data } = await useFetch(`https://nuxr3.zeabur.app/api/v1/user`,{
    headers: {
      Authorization: `Bearer ${getUserCookie.value}`
    }
  })
  // console.log(data.value)
  // if(data.value.status == true){
  //   userInfo.value = data.value.result
  //   console.log('userInfo=>',userInfo.value)
  // }
  const parsed = dayjs(userInfo.value.birthday)
  birthdayYear.value = parsed.year()
  birthdayMonth.value = parsed.month() + 1 // month 0-based
  birthdayDay.value = parsed.date()

  updataInfo.value = {
  userId: userInfo.value._id,
  name: userInfo.value.name,
  phone: userInfo.value.phone,
  birthday: userInfo.value.birthday,
  address: {
    zipcode: userInfo.value.address.zipcode,
    detail: userInfo.value.address.detail
  },
  // oldPassword: decrypt(storePW.value),
  // newPassword: ""
}

originalData.value = JSON.parse(JSON.stringify(updataInfo.value))
})

const phoneWithoutZero = computed(() => {
  if (!updataInfo.value.phone) return ''
  return updataInfo.value.phone.replace(/^0/, '')
})


const selectedCity = ref(userCity ? userCity : '');
const selectedDistrict = ref(userDistrict ? userDistrict : '');
const districts = ref(cities.find(city => city.name === selectedCity.value).districts);
const postalCode = ref(districts.value.find(district => district.name === selectedDistrict.value).postalCode);

// 監聽縣市選擇的變化
watch(selectedCity, (newCity) => {
  const city = cities.find(city => city.name === newCity);
  districts.value = city ? city.districts : [];
  selectedDistrict.value = districts.value[0].name;
  postalCode.value = districts.value[0].postalCode;
  userCity.value = newCity
});

// 監聽區域選擇的變化
watch(selectedDistrict, (newDistrict) => {
  const district = districts.value.find(district => district.name === newDistrict);
  postalCode.value = district ? district.postalCode : '';
  userDistrict.value = newDistrict
});

const handleSubmitUpdate = async () => {
  if (!isModified.value) {
    alert('尚未修改資料。')
    return
  }
    const { data } = await useFetch(`https://nuxr3.zeabur.app/api/v1/user`,{
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getUserCookie.value}`
      },
      body: updataInfo.value
    })
    console.log(data.value)
    if(data.value.status == true){
      userInfo.value = data.value.result
      console.log('新的 userInfo=>',userInfo.value)
      alert('修改成功')
    }
  }
</script>

<template>
  <ClientOnly>
    <div class="row gap-6 gap-md-0">
      <div class="col-12 col-md-5">
        <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
          <h2 class="fs-6 fs-md-5 fw-bold">
            修改密碼
          </h2>
          <div class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <p class="mb-2 text-neutral-80 fw-medium">
                電子信箱
              </p>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              >{{ userInfo.email }}</span>
            </div>
  
            <div
              class="d-flex justify-content-between align-items-center"
              :class="{'d-none': isEditPassword}"
            >
              <div>
                <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                  密碼
                </label>
                <input
                  class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                  type="password"
                  value="**********"
                >
              </div>
  
              <button
                class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
                type="button"
                @click="isEditPassword = !isEditPassword"
              >
                重設
              </button>
            </div>
  
            <div
              class="d-flex flex-column gap-4 gap-md-6"
              :class="{'d-none': !isEditPassword}"
            >
              <div>
                <label
                  for="oldPassword"
                  class="form-label fs-8 fs-md-7 fw-bold"
                >舊密碼</label>
                <input
                  id="oldPassword"
                  type="password"
                  class="form-control p-4 fs-7 rounded-3"
                  placeholder="請輸入舊密碼"
                >
              </div>
  
              <div>
                <label
                  for="newPassword"
                  class="form-label fs-8 fs-md-7 fw-bold"
                >新密碼</label>
                <input
                  id="newPassword"
                  type="password"
                  class="form-control p-4 fs-7 rounded-3"
                  placeholder="請輸入新密碼"
                >
              </div>
  
              <div>
                <label
                  for="confirmPassword"
                  class="form-label fs-8 fs-md-7 fw-bold"
                >確認新密碼</label>
                <input
                  id="confirmPassword"
                  type="password"
                  class="form-control p-4 fs-7 rounded-3"
                  placeholder="請再輸入一次新密碼"
                >
              </div>
            </div>
  
            <button
              :class="{'d-none': !isEditPassword}"
              class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
              type="button"
            >
              儲存設定
            </button>
          </div>
        </section>
      </div>
  
      <div class="col-12 col-md-7">
        <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
          <h2 class="fs-6 fs-md-5 fw-bold">
            基本資料
          </h2>
          <div class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile}"
                for="name"
              >
                姓名
              </label>
              <input
                id="name"
                name="name"
                class="form-control text-neutral-100 fw-bold"
                :class="{'pe-none p-0 border-0': !isEditProfile, 'p-4': isEditProfile}"
                type="text"
                v-model="updataInfo.name"
              >
            </div>
  
            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile}"
                for="phone"
              >
                手機號碼
              </label>
              <div class="input-group">
                <span class="input-group-text">+886</span>
                <input
                  id="phone"
                  name="phone"
                  class="form-control text-neutral-100 fw-bold"
                  :class="{'pe-none p-0 border-0': !isEditProfile, 'p-4': isEditProfile}"
                  type="tel"
                  v-model="phoneWithoutZero"
                >
              </div>
            </div>
  
            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile}"
                for="birth"
              >
                生日
              </label>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                :class="{'d-none': isEditProfile}"
              >{{ formatDate(updataInfo.birthday) }}</span>
              <div
                class="d-flex gap-2"
                :class="{'d-none': !isEditProfile}"
              >
                <select
                  id="birth" v-model="birthdayYear"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3" disabled
                >
                <option
                  v-for="y in 65"
                  :key="y"
                  :value="1958 + y"
                >
                  {{ 1958 + y }} 年
                </option>
                </select>
                <select v-model="birthdayMonth"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3" disabled
                >
                <option
                  v-for="m in 12"
                  :key="m"
                  :value="m"
                >
                  {{ m }} 月
                </option>
                </select>
                <select v-model="birthdayDay"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3" disabled
                >
                <option
                  v-for="d in 31"
                  :key="d"
                  :value="d"
                >
                  {{ d }} 日
                </option>
                </select>
              </div>
            </div>
  
            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile}"
                for="address"
              >
                地址
              </label>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                :class="{'d-none': isEditProfile}"
              >{{ updataInfo.address.detail }}</span>
              <div :class="{'d-none': !isEditProfile}">
                <div
                  class="d-flex gap-2 mb-2"
                >
                  <select
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="selectedCity"
                  >
                    <option v-for="city in cities" :key="city.name" :value="city.name">
                      {{ city.name }}
                    </option>
                  </select>
                  <select v-model="selectedDistrict"
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  >
                  <option v-for="district in districts" :key="district" :value="district.name">
                    {{ district.name }}
                  </option>
                  </select>
                </div>
                <input
                  id="address"
                  type="text"
                  class="form-control p-4 rounded-3"
                  placeholder="請輸入詳細地址" v-model="updataInfo.address.detail"
                >
              </div>
            </div>
          </div>
          <button
            :class="{'d-none': isEditProfile}"
            class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
            type="button"
            @click="isEditProfile = !isEditProfile"
          >
            編輯
          </button>
  
          <button
            :class="{'d-none': !isEditProfile}"
            class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
            type="button" @click="handleSubmitUpdate"
          >
            儲存設定
          </button>
        </section>
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type="password"] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>