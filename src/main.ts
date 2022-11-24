import { createApp } from 'vue'
import { createPinia } from 'pinia'
import pinia from '@/store/pinia'
import router from '@/router'
import useAppConfigStore from './store/stores/useAppConfigStore'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import './style.css'
import App from './App.vue'

const configApp = (): void => {
  axiosRetry(axios, {
    retries: Number(process.env.VUE_APP_RETRY_COUNT),
    retryDelay: axiosRetry.exponentialDelay,
  })
}
configApp()
const piniaStore = createPinia()
const appConfigStore = useAppConfigStore(pinia)
// appConfigStore.getFeatures()

const app = createApp(App)
app.use(router)
app.use(piniaStore)

app.mount('#app')
