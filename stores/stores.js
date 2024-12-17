import { defineStore } from "pinia";
import { ref } from 'vue'
export const useStores = defineStore("news", () => {
    let roomDetail = ref(null);

    return {
        roomDetail
    }
   });
   