Notification.requestPermission().then((result) => {
    if (result === "granted") {
        randomNotification();
    }
});

function randomNotification() {
    const randomItem = Math.floor(Math.random() * games.length);
    const notifTitle = games[randomItem];
    const notifBody = `Created by tsgsOFFICIAL.`;
    const notifImg = `./assets/icons/128x128.png`;
    const options = {
        body: notifBody,
        icon: notifImg,
    };
    new Notification(notifTitle, options);
    setTimeout(randomNotification, 30000);
}

const games = [
    "CS2",
    "CS:GO",
    "PUBG",
    "Stranded Deep",
    "Viscera Cleanup Detail"
];