export async function getDataFromXML(data) {
    return new Promise((resolve) => {
        // accept answer, return dataDrones
        const answer = data.responseXML;
        const timeStamp = answer.querySelector('capture').getAttribute('snapshotTimestamp');
        const tmpDataDrones = []; // array of objects. Objects - data for each drone

        Array.from(answer.querySelectorAll('drone')).forEach((item, i) => {
            // find all drones, convert NodeList to an array, loop through
            const attTags = ['serialNumber', 'positionY', 'positionX'];
            const odjDataDrone = {};

            for (i = 0; i < attTags.length; i++) {
                odjDataDrone[attTags[i]] = item.querySelector(attTags[i]).innerHTML;

                if (i == attTags.length - 1) {
                    odjDataDrone.timeStamp = timeStamp;
                }
            }

            tmpDataDrones.push(odjDataDrone);
        });

        resolve(tmpDataDrones);
    })
}