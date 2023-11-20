let registration;

topLevelFunction();

document.addEventListener("DOMContentLoaded", function () {
    fetchData();

    setInterval(() => {
        fetchData();
    }, 60 * 1000);
});

function fetchData() {
    const options = {
        method: 'GET'
    };

    fetch('https://hillbillyapi.azurewebsites.net/api/HillBilly/Get/All', options)
        .then(response => response.json())
        .then(response => updateView(response))
        .catch(err => console.error(err));
}

function updateView(logHistoryJson) {
    const main = document.querySelector("main");
    main.innerHTML = ""; // Clear the main element

    // Use Array.reduce to group objects by stableId
    const groupedByStableId = logHistoryJson.reduce((result, obj) => {
        const { stableId } = obj;

        // Use the stableId as the key and create an array if it doesn't exist
        result[stableId] = result[stableId] || [];

        // Push the current object to the corresponding stableId array
        result[stableId].push(obj);

        return result;
    }, {});

    // Function to find the object with the latest logTime in an array
    const findLatestEntry = (array) => {
        return array.reduce((latest, obj) => {
            if (!latest || new Date(obj.logTime) > new Date(latest.logTime)) {
                return obj;
            }
            return latest;
        }, null);
    };

    // Use Array.map() to find the latest entry in each array
    const latestEntries = Object.values(groupedByStableId).map(findLatestEntry);

    latestEntries.forEach(obj => {
        controlValues(obj);

        const logTimeDate = new Date(obj.logTime);

        // Get the current time
        const currentTime = new Date();

        // Calculate the time difference in milliseconds
        const timeDifference = currentTime - logTimeDate;

        // Convert the time difference to minutes
        const minutesAgo = Math.floor(timeDifference / (1000 * 60));

        let article = document.createElement("article");
        article.className = "stable-container";

        let headerSection = document.createElement("section");
        headerSection.className = "header flex-row nowrap";

        let text = document.createElement("h2");
        text.innerText = `Stald ${obj.stableId}`;

        headerSection.appendChild(text);

        text = document.createElement("p");
        text.id = `stable-${obj.stableId}-info`;
        text.className = "time-text";
        text.innerText = `Data is ${minutesAgo} minutes old`;

        headerSection.appendChild(text);

        article.appendChild(headerSection);

        let infoSection = document.createElement("section");
        infoSection.className = "info flex-row nowrap";

        let ol = document.createElement("ol");

        let li = document.createElement("li");
        li.innerText = "Temperatur Celcius:";

        ol.appendChild(li);

        li = document.createElement("li");
        li.innerText = "UV Index:";

        ol.appendChild(li);

        li = document.createElement("li");
        li.innerText = "Water Level:";

        ol.appendChild(li);

        infoSection.appendChild(ol);

        ol = document.createElement("ol");

        li = document.createElement("li");
        li.innerText = `${obj.outsideTemperature}`;

        ol.appendChild(li);

        li = document.createElement("li");
        li.innerText = `${obj.uvIndex}`;

        ol.appendChild(li);

        li = document.createElement("li");
        li.innerText = `${obj.waterLevelPercentage}`;

        ol.appendChild(li);

        infoSection.appendChild(ol);

        article.appendChild(infoSection);

        main.appendChild(article);
    });
}

function controlValues(obj) {
    let title = "";
    let body = "";
    let sendANotification = false;

    if (obj.outsideTemperature > 20) {
        title = "Det for varmt";
        body = "Det er ved at være for varmt, du bør sænke temperaturen";
        sendANotification = true;
    }

    if (obj.uvIndex > 50) {
        title = "Solen smelter din hjerne";
        body = "Dit ansigt smelter snart ved solens kraft!";
        sendANotification = true;
    }

    if (obj.waterLevelPercentage < 25) {
        title = "Der er ikke mere vand";
        body = "Dine stakkels grise har ikke mere vand";
        sendANotification = true;
    }

    if (sendANotification) {
        sendNotification(title, body);
    }
}

async function topLevelFunction() {
    registration = await navigator.serviceWorker.getRegistration();
}

async function sendNotification(notifyTitle, notifyBody) {
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
}

function showNotification(notifyTitle, notifyBody) {
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
}