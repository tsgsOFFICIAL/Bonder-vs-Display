Notification.requestPermission().then((result) => {
    if (result === "granted") {
        randomNotification();
    }
});

function randomNotification() {
    const randomItem = Math.floor(Math.random() * games.length);
    const notifTitle = games[randomItem].name;
    const notifBody = `Created by ${games[randomItem].author}.`;
    const notifImg = `data/img/${games[randomItem].slug}.jpg`;
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