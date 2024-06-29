import { sendSubscription } from "../Backend";

const publicVapidKey =
    "BKr2V1iW4iK7ug_Wsp0FRLObRnBgkV7GdPPFoACp7f6sdKH-muu7UMp8pQsdPXCztIf-d3CecoGmffSXffO62cs";

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function send(title = "Push Sent", message = "Hello push") {
    await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
    });

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready
            .then(function (registration) {
                if (!registration.pushManager) {
                    return;
                }

                registration.pushManager
                    .getSubscription()
                    .then(function (existingSubscription) {
                        if (existingSubscription === null) {
                            registration.pushManager
                                .subscribe({
                                    applicationServerKey:
                                        urlBase64ToUint8Array(publicVapidKey),
                                    userVisibleOnly: true,
                                })
                                .then(function (newSubscription) {
                                    sendSubscription(
                                        newSubscription,
                                        title,
                                        message
                                    );
                                })
                                .catch(function (e) {
                                    if (Notification.permission !== "granted") {
                                    } else {
                                        console.error(e);
                                    }
                                });
                        } else {
                            sendSubscription(
                                existingSubscription,
                                title,
                                message
                            );
                        }
                    })
                    .then((subscription) =>
                        console.log(subscription.keys.auth)
                    );
            })
            .catch(function (e) {
                console.error(e);
            });
    }
}

export async function getExistingSubscription() {
    // Ensure service worker is supported and registered
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("/sw.js", { scope: "/" });

            // Wait for the service worker to be ready
            const readyRegistration = await navigator.serviceWorker.ready;

            // Attempt to retrieve an existing push subscription
            const subscription =
                await readyRegistration.pushManager.getSubscription();

            // if (subscription) {
            //     const subscriptionJson = subscription.toJSON();
            //     console.log("Auth key:", subscriptionJson.keys.auth);
            //     console.log("p256dh key:", subscriptionJson.keys.p256dh);
            // }

            return subscription; // This will be null if there is no existing subscription
        } catch (error) {
            console.error(
                "Service Worker registration or getting subscription failed:",
                error
            );
            return null;
        }
    } else {
        console.log("Service Workers are not supported in this browser.");
        return null;
    }
}

export async function createSubscription() {
    // Ensure service worker is supported and registered
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("/sw.js", { scope: "/" });

            // Wait for the service worker to be ready
            const readyRegistration = await navigator.serviceWorker.ready;

            // Attempt to subscribe to push notifications
            const newSubscription =
                await readyRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                });

            return newSubscription;
        } catch (error) {
            console.error(
                "Service Worker registration or subscription creation failed:",
                error
            );
            return null;
        }
    } else {
        console.log("Service Workers are not supported in this browser.");
        return null;
    }
}
