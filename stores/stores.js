import { defineStore } from "pinia";
import { ref } from 'vue'
export const useStores = defineStore("news", () => {
    let roomDetail = ref(null);
    let setBookingInfo = ref({});
    let isLoading = ref(false);
    let token = ref('');
    let userInfo = ref({});
    let BookingConfirmData = ref({});
    return {
        roomDetail,
        setBookingInfo,
        isLoading,
        token,
        userInfo,
        BookingConfirmData
    }
   },
   {
    persist: true,
    storage: piniaPluginPersistedstate.localStorage(),
  },
);
   