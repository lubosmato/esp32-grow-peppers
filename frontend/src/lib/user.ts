import { user, User } from "./store";

export function useLogin() {
  return async (email: string, password: string) => {
    const response = await fetch("/api/v1/auth", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    const responseJson = await response.json()
    if (response.status !== 200) throw new Error(responseJson.error)
    user.set(responseJson.user)
    registerWorker()
  }
}

export function useLogout() {
  return async () => {
    await fetch("/api/v1/logout", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
    user.set(null)
  }
}

export function useMe() {
  return async (): Promise<User> => {
    const response = await fetch("/api/v1/user", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const responseJson = await response.json()
    if (response.status !== 200) throw new Error(responseJson.error)
    return responseJson.user
  }
}

export async function registerWorker() {
  await navigator.serviceWorker.register("sw.js");
  await Notification.requestPermission();
  if (Notification.permission === "granted") {
    try {
      navigator.serviceWorker.controller.postMessage("subscribe")
    } catch { }
  }
};
