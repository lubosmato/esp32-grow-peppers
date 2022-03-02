self.addEventListener("message", async (e) => {
  if (e.data === "subscribe") {
    try {
      const mySub = await self.registration.pushManager.getSubscription()
      if (mySub !== null) {
        return
      }

      const applicationServerKey = urlB64ToUint8Array(
        "BDJMvQAb07is9fMkNv0ZwHjc_1eXW_j5aAglkhWlwFaT6prYBClK1wjsNavG4Ps5JtxUxMcquq0eN_WVuJTw_Z8"
      )
      const subscription = await self.registration.pushManager.subscribe({ 
        applicationServerKey, 
        userVisibleOnly: true,
      })
  
      await saveSubscription(subscription)

    } catch (err) {
      console.error("Error", err)
    }
  }
})

self.addEventListener("push", function (e) {
  const {title, body} = e.data.json()

  const notificationOptions = {
    body: body,
    icon: "/logo.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 1000],
  }
  e.waitUntil(
    self.registration.showNotification(title, notificationOptions)
  )
})

const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const saveSubscription = async subscription => {
  const response = await fetch("/api/v1/subscribe", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription
    }),
  })
  return response.json()
}
