self.addEventListener("push", (e) => {
    const data = e.data.json();
    console.log("Got push", data);
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: "favicon.ico",
    });
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close(); // Close the notification

    // Define the URL to navigate to
    const urlToOpen = new URL(
        "https://6310-smiley.vercel.app/",
        self.location.origin
    ).href;

    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true,
        })
        .then((windowClients) => {
            let matchingClient = null;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    matchingClient = windowClient;
                    break;
                }
            }

            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return clients.openWindow(urlToOpen);
            }
        });

    event.waitUntil(promiseChain);
});
