import axios from "axios"
import { verificationRolesNotAllowed } from "@/helpers/auth/authUtils"
import {
  CODE_401_UNAUTHORIZED,
  CODE_403_FORBIDDEN,
  UNKNOWN_SERVER_ERROR,
} from "@/shared/errors"
import { Roles } from "@/shared/roles"
import { defineStore } from "pinia"

export enum ErrorAuthType {
  UNEXPECTED = "UNEXPECTED",
  TOKEN_NOTFOUND = "TOKEN_NOTFOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export class ErrorAuth extends Error {
  type: ErrorAuthType

  constructor(type: ErrorAuthType, message?: string) {
    super(message)
    this.type = type
  }
}

const utilisateurApi = new UtilisateurApi(
  new Configuration({
    basePath: process.env.VUE_APP_UTILISATEURSERVICE_ROOT
      ? process.env.VUE_APP_UTILISATEURSERVICE_ROOT
      : process.env.VUE_APP_ISIS_MS_ROOT,
  })
)
const authentApi = new AuthentApi(
  new ConfigAuthApi({
    basePath: process.env.VUE_APP_AUTHSERVICE_ROOT
      ? process.env.VUE_APP_AUTHSERVICE_ROOT
      : process.env.VUE_APP_TELEPAC_AUTH_ROOT,
  })
)

interface AuthentStoreState {
  refreshError: boolean
  refreshErrorMessage: string | null
  authState: AuthentState
}

const useAuthentStore = defineStore("authentStore", {
  state: (): AuthentStoreState => ({
    refreshError: false,
    refreshErrorMessage: null,
    authState: {
      accessToken: undefined,
      refreshToken: undefined,
      utilisateur: undefined,
    },
  }),
  getters: {
    getState: (state) => state.authState,
    getRefreshError: (state) => state.refreshError,
    getRefreshErrorMessage: (state) => state.refreshErrorMessage,
    hasRoleToSeeDossier: (state) =>
      state.authState.utilisateur.roles &&
      (state.authState.utilisateur.roles.indexOf(Roles.FONCTION_SUIVI) !== -1 ||
        state.authState.utilisateur.roles.indexOf(
          Roles.FONCTION_INSTRUCTION
        ) !== -1),
    hasRoleToInstructDossier: (state) =>
      state.authState.utilisateur.roles &&
      state.authState.utilisateur.roles.indexOf(Roles.FONCTION_INSTRUCTION) !==
        -1,
    hasRoleToPrepareDT: (state) =>
      state.authState.utilisateur.roles &&
      state.authState.utilisateur.roles.indexOf(Roles.PREPARER_DT) !== -1,
  },
  actions: {
    setRefreshError(newRefreshError: boolean): void {
      this.refreshError = newRefreshError
    },
    setRefreshErrorMessage(message: string): void {
      this.refreshErrorMessage = message
    },
    setAuthInfo(payload: {
      accessToken: string
      refreshToken: string
      utilisateur: UtilisateurTO
    }): void {
      this.authState = { ...this.authState, ...payload }
    },
    async refreshTokens(): Promise<void> {
      console.log("Refresh token action called")
      try {
        const nouvelAccessToken = await refreshTokens(
          this.getState.refreshToken
        )

        // mise à jour authState
        const newAuthState = { ...this.getState }
        newAuthState.accessToken = nouvelAccessToken.accessToken
        this.setAuthInfo(newAuthState)

        // mise à jour header Authorization
        axios.defaults.headers.common.Authorization =
          "Bearer " + nouvelAccessToken.accessToken
      } catch (err) {
        this.setRefreshError(true)

        if (err instanceof Error && err.message === "NO_TOKEN") {
          this.setRefreshErrorMessage(CODE_401_UNAUTHORIZED)
          throw new ErrorAuth(
            ErrorAuthType.TOKEN_NOTFOUND,
            CODE_401_UNAUTHORIZED
          )
        }
        this.setRefreshErrorMessage(UNKNOWN_SERVER_ERROR)
        throw new ErrorAuth(ErrorAuthType.UNEXPECTED, UNKNOWN_SERVER_ERROR)
      }
    },
  },
})

export function refreshTokens(refreshToken: string): Promise<{
  accessToken: string
}> {
  console.log("Refresh token utility function called")
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const reponse = await authentApi.refreshToken(refreshToken)
      resolve({ accessToken: reponse.data })
    } catch (err) {
      reject(err)
    }
  })
}

export function authenticate(): Promise<{
  accessToken: string
  refreshToken: string
  utilisateur: UtilisateurTO
}> {
  console.log("Authenticate function called")
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      // Récupération tokens
      const tokens = await getTokens()
      axios.defaults.headers.common.Authorization =
        "Bearer " + tokens.accessToken
      // Get utilisateur
      const utilisateurResp = await utilisateurApi.getUtilisateur()
      await verificationHabilitation(utilisateurResp.data)
      resolve({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        utilisateur: utilisateurResp.data,
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getTokens(): Promise<{ accessToken: string; refreshToken: string }> {
  return new Promise((resolve, reject) => {
    const accessToken: string | undefined =
      process.env.VUE_APP_TELEPAC_SESSION_JWT
    const refreshToken: string | undefined =
      process.env.VUE_APP_TELEPAC_REFRESH_JWT
    if (!accessToken || !refreshToken) {
      authentApi
        .getJWTTokens()
        .then((resp) => {
          resolve({
            accessToken: resp.data.accessToken,
            refreshToken: resp.data.refreshToken,
          })
        })
        .catch((err: Error) => {
          if (err.message === "NO_TOKEN") {
            reject(
              new ErrorAuth(ErrorAuthType.TOKEN_NOTFOUND, CODE_401_UNAUTHORIZED)
            )
          }
          reject(new ErrorAuth(ErrorAuthType.UNEXPECTED, UNKNOWN_SERVER_ERROR))
        })
    } else {
      resolve({ accessToken, refreshToken })
    }
  })
}

function verificationHabilitation(utilisateur: UtilisateurTO): void {
  const rolesNotAllowed = verificationRolesNotAllowed(
    ["MON"],
    utilisateur.roles
  )
  if (rolesNotAllowed) {
    throw new ErrorAuth(ErrorAuthType.UNAUTHORIZED, CODE_403_FORBIDDEN)
  }
}

export default useAuthentStore
