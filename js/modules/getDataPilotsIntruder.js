export async function getDataPilotsIntruder(arr) {

    if (arr.length > 0) { // the function will take an array of offenders
        const arrTmp = [];
        const arrPromise = [];

        for (let i = 0; i < arr.length; i++) {
            // write each promise to an array
            arrPromise.push(new Promise((resolve, reject) => {
                const path = `https://assignments.reaktor.com/birdnest/pilots/${arr[i].serialNumber}`; // string with serialNumber

                const requestPilot = new XMLHttpRequest();
                requestPilot.open('GET', path, true);
                requestPilot.send();

                requestPilot.addEventListener('load', () => {
                    if (requestPilot.status === 200) {
                        const dataPilot = JSON.parse(requestPilot.response); // server response
                        dataPilot.serialNumber = arr[i].serialNumber;
                        dataPilot.distance = arr[i].distance;
                        dataPilot.timeIntruder = arr[i].timeStamp;

                        arrTmp.push(dataPilot); // write intruder pilot data + drone data from dronesIntruder[i] - SN+distance+timeIntruder into the object
                        
                        resolve();
                    }
                    else {
                        console.warn('404');
                        reject();
                    }
                })


            }))
        }

        await Promise.allSettled(arrPromise);
        return arrTmp;
    }
}