import { defineStore } from 'pinia'

export interface AppConfigStoreState {
  applicationName: string
  campagne: number
  numeroPacage: string | null
}

const params = new URLSearchParams(window.location.search)

const useAppConfigStore = defineStore('appConfig', {
  state: (): AppConfigStoreState => ({
    applicationName:
      params?.get('titreApplication') || 'Instruction suivi des surfaces 2023',
    campagne: parseInt(params.get('campagne') || '2023'),
    numeroPacage: params.get('numeroPacage'),
  }),
  getters: {
    getApplicationName: (state) => state.applicationName,
    getCampagne: (state) => state.campagne,
  },
  actions: {
    setCampagne(campagne: number) {
      this.campagne = campagne
    },
    setNumeroPacage(numeroPacage: string | null) {
      this.numeroPacage = numeroPacage
    },
  },
})

export default useAppConfigStore
