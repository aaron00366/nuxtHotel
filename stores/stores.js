import { defineStore } from "pinia";
import { ref } from 'vue'
import { encrypt, decrypt } from "@/utils/crypto/helper/cryptoHelper";

export const useStores = defineStore("news", () => {
    let roomDetail = ref(null);
    let setBookingInfo = ref({});
    let isLoading = ref(false);
    let token = ref('');
    let userInfo = ref({});
    let BookingConfirmData = ref({});
    let cannotOrder = ref(false);
    let storePW = ref('');
    let userCity = ref('');
    let userDistrict = ref('');
    return {
        roomDetail,
        setBookingInfo,
        isLoading,
        token,
        userInfo,
        BookingConfirmData,
        cannotOrder,
        storePW,
        userCity,
        userDistrict,
    }
   },
   {
    persist: true,
    storage: piniaPluginPersistedstate.localStorage(),
  },
);
   