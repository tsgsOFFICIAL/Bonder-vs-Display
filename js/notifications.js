let registration;

topLevelFunction();

async function topLevelFunction() {   
    registration = await navigator.serviceWorker.getRegistration();
}

const sendNotification = async () => {
    if (Notification.permission === 'granted') {
        showNotification('RandomShit pt 2');
    } else {
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                showNotification('RandomShit pt 2');
            }
        }
    }
};

const showNotification = (notifyBody, notifyImg = `./assets/icons/128x128.png`) => {
    const notifyTitle = 'What PWA Can Do Today';
    
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



// Notification.requestPermission().then((result) => {
    //     if (result === "granted") {
        //         randomNotification();
        //     }
        // });
        
        // function randomNotification() {
            //     const randomItem = Math.floor(Math.random() * games.length);
            //     const notifTitle = games[randomItem];
            //     const notifBody = `Created by tsgsOFFICIAL.`;
            //     const notifImg = `./assets/icons/128x128.png`;
            // const payload = {
                //     body: notifBody,
                //     icon: notifImg,
                // };
                
                //     if ('showNotification' in registration) {
                    //         registration.showNotification(notifTitle, payload);
                    //     }
//     else {
//         new Notification(notifTitle, payload);
//     }

//     setTimeout(randomNotification, 30000);
// }

// const games = [
    //     "CS2",
    //     "CS:GO",
    //     "PUBG",
    //     "Stranded Deep",
    //     "Viscera Cleanup Detail"
    // ];