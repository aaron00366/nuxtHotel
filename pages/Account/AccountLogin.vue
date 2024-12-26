<script setup>
import { encrypt, decrypt } from "@/utils/crypto/helper/cryptoHelper";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2'

const Store = useStores()
const { isLoading,token,userInfo, storePW } = storeToRefs(Store)
const router = useRouter();
const loginData = ref({
    email: '',
    password: '',
})
const rememberMe = ref(false)

isLoading.value = false
onMounted(() => {
  isLoading.value = false
  const savedEmail = localStorage.getItem('rememberEmail')
  if (savedEmail) {
    loginData.value.email = savedEmail
    rememberMe.value = true
  }
})
const submitLogin = async () => {
if (!loginData.value.email || !loginData.value.password) {
    Swal.fire({
        position: "top-end",
        icon: 'error',
        title: '請輸入帳號密碼',
        showConfirmButton: false,
        timer: 2500,
        toast: true
    })
    return
  }
  if (rememberMe.value) {
    localStorage.setItem('rememberEmail', loginData.value.email)
  } else {
    localStorage.removeItem('rememberEmail')
  }

  const { data } = await useFetch(`https://nuxr3.zeabur.app/api/v1/user/login`,{
        method: "POST", 
        body: loginData.value   
    })
    .then((data) => {
        const { token } = data.data.value
        const { result } = data.data.value
        const cookie = useCookie("auth", {
        // expires: new Date(exp * 1000),
        path: "/",
      });
        cookie.value = token;
        userInfo.value = result
        storePW.value = encrypt(loginData.value.password)
        Swal.fire({
            position: "top-end",
            icon: 'success',
            title: '登入成功',
            showConfirmButton: false,
            timer: 1500,
            toast: true
        })
        setTimeout(() => {
            router.push('/')
        }, 1600)
    })
    .catch((error) => {
        loginData.value = {}
        Swal.fire({
            position: "top-end",
            icon: 'error',
            title: '登入失敗, 請檢查帳號密碼是否正確',
            showConfirmButton: false,
            timer: 2500,
            toast: true
        })
    });
}
</script>

<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="text-neutral-0 fw-bold">
        立即開始旅程
      </h1>
    </div>

    <form class="mb-10">
      <div class="mb-4 fs-8 fs-md-7">
        <label
          class="mb-2 text-neutral-0 fw-bold"
          for="email"
        >
          電子信箱
        </label>
        <input
          id="email"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入信箱"
          type="email" 
          v-model="loginData.email"
        >
      </div>
      <div class="mb-4 fs-8 fs-md-7">
        <label
          class="mb-2 text-neutral-0 fw-bold"
          for="password"
        >
          密碼
        </label>
        <input
            id="password"
            class="form-control p-4 text-neutral-100  fw-medium border-neutral-40"
            placeholder="請輸入密碼"
            type="password"
            v-model="loginData.password"
        >
      </div>
      <div class="d-flex justify-content-between align-items-center mb-10 fs-8 fs-md-7">
        <div class="form-check d-flex align-items-end gap-2 text-neutral-0">
          <input
            id="remember"
            class="form-check-input"
            type="checkbox" v-model="rememberMe"
          >
          <label
            class="form-check-label fw-bold"
            for="remember"
          >
            記住帳號
          </label>
        </div>
        <button
          class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
          type="button"
        >
          忘記密碼？
        </button>
      </div>
      <button
        class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
        type="button" @click="submitLogin"
      >
        會員登入
      </button>
    </form>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">沒有會員嗎？</span>
      <NuxtLink
        to="AccountSignup"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>前往註冊</span>
      </NuxtLink>
    </p>
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


input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #BF9D7D;
  border-color: #BF9D7D;
}
</style>