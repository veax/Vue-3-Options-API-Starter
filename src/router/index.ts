import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router"
import RechercheAvancee from "@/views/RechercheAvancee.vue"
import About from "@/views/About.vue"
import pinia from "@/store/pinia"
import useAppConfigStore from "@/store/stores/useAppConfigStore"
import * as Routes from "@/shared/routes"
import { CODE_403_FORBIDDEN, CODE_404_NOT_FOUND } from "@/shared/errors"

const routes: Array<RouteRecordRaw> = [
  {
    path: Routes.HOME_ROUTE_PATH,
    name: Routes.HOME_ROUTE_NAME,
    redirect: () => {
      const params = new URLSearchParams(window.location.search)
      if (params.get("numeroPacage")) {
        const appConfigStore = useAppConfigStore(pinia)
        appConfigStore.setNumeroPacage(params.get("numeroPacage"))
        window.history.pushState({}, document.title, window.location.pathname)
        return Routes.SYNTHESE_DOSSIER_ROUTE_PATH
      } else {
        return Routes.RECHERCHE_AVANCEE_ROUTE_PATH
      }
    },
  },
  {
    path: Routes.RECHERCHE_AVANCEE_ROUTE_PATH,
    name: Routes.RECHERCHE_AVANCEE_ROUTE_NAME,
    component: RechercheAvancee,
    // meta: { conditionalRoute: true, source: navigationRoles },
  },
  {
    path: Routes.ABOUT_ROUTE_PATH,
    name: Routes.ABOUT_ROUTE_NAME,
    component: About,
    // meta: { conditionalRoute: true, source: navigationRoles },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  if (to.matched.some((record) => record.meta.conditionalRoute)) {
    // this route requires condition to be accessed
    // if not, redirect to home page.
    if (
      to.params &&
      to.meta.allowedParams &&
      !(to.meta.allowedParams as string[]).includes(
        Object.values(to.params)[0] as string
      )
    ) {
      next({
        name: Routes.ERROR_ACCESS_ROUTE_NAME,
        params: { errorMsg: CODE_404_NOT_FOUND },
      })
    }
    if (to.meta.allowedPath && !(to.meta.allowedPath === to.path)) {
      next({
        name: Routes.ERROR_ACCESS_ROUTE_NAME,
        params: { errorMsg: CODE_404_NOT_FOUND },
      })
    }
    // const authentStore = useAuthentStore(pinia)
    // const userCampagne: number[] =
    //   authentStore.getState?.utilisateur?.campagnesAccesAutorise
    // const accessCampagne = userCampagne?.find((campagne) => {
    //   const appConfigStore = useAppConfigStore(pinia)
    //   return campagne === appConfigStore.getCampagne
    // })
    // if (!accessCampagne) {
    //   next({
    //     name: Routes.ERROR_ACCESS_ROUTE_NAME,
    //     params: { errorMsg: CODE_403_FORBIDDEN },
    //   })
    // }
    // const userRoles: string[] = authentStore.getState?.utilisateur?.roles
    // const accessRoles = findRolesFromSource(
    //   to.meta.source as IsisHeaderMenu[],
    //   to.path
    // )
    // if (
    //   accessRoles?.length > 0 &&
    //   verificationRolesNotAllowed(accessRoles, userRoles)
    // ) {
    //   next({
    //     name: Routes.ERROR_ACCESS_ROUTE_NAME,
    //     params: { errorMsg: CODE_403_FORBIDDEN },
    //   })
    // } else {
    //   next()
    // }
    next()
  } else {
    next()
  }
})

export default router
