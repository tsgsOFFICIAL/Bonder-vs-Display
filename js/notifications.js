let registration;

topLevelFunction();

async function topLevelFunction() {
    registration = await navigator.serviceWorker.getRegistration();
}

const sendNotification = async (notifyTitle, notifyBody) => {
    if (Notification.permission === 'granted') {
        showNotification(notifyTitle, notifyBody);
    } else {
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                showNotification(notifyTitle, notifyBody);
            }
        }
    }
};

const showNotification = (notifyTitle, notifyBody) => {
    const notifyImg = `./assets/icons/128x128.png`;

    const payload = {
        body: notifyBody,
        icon: notifyImg,
    };

    if ('showNotification' in registration) {
        registration.showNotification(notifyTitle, payload);
    } else {
        new Notification(notifyTitle, payload);
    }
};