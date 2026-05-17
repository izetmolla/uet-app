import ApiService from "../lib/network/api-service"

export type { AuthorizationState } from "./authorization-store"
export { default } from "./authorization-store"

export function useSignOutApi() {
    return ApiService.fetchData({
        url: "/api/authorization/sign-out",
        method: "post",
    })
}
