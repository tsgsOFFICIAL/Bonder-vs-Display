document.addEventListener("DOMContentLoaded", function () {
    fetchData();

    setInterval(() => {
        fetchData();
    }, 10 * 1000);
});

function fetchData() {
    // const options = {
    //     method: 'GET'
    // };

    // fetch('http://192.168.0.50/api/HillBilly/Get/All', options)
    //     .then(response => response.json())
    //     .then(response => updateView(response))
    // .catch(err => console.error(err));
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