const request = new XMLHttpRequest();
request.open('GET', 'https://assignments.reaktor.com/birdnest/drones', true);
request.responseType = 'document';
request.send();

request.addEventListener('load', () => {
    if (request.status === 200) {
        console.log(request.responseXML);
        console.log(request.getAllResponseHeaders());

        const dataDrones = getDataFromXML(request); // array
        console.log(dataDrones); // данные всех дронов

        const dronesIntruder = checkDronesViolation(dataDrones);
        console.log(dronesIntruder); // данные всех дронов-нарушителей

        const pilotsIntruder = []// здесь будут данные всех пилотов-нарушителей + данные по дрону: SN+distanse+time

        if (dronesIntruder.length > 0) {
            //запрос делать по одному serialNumber
            //нужна функция, которая будет принимать массив нарушителей,
            // и делать необходимое кол-во запросов.
            // начнем с одного запроса

            let testPath = `https://assignments.reaktor.com/birdnest/pilots/${dronesIntruder[0].serialNumber}`; // строкa с serialNumber

            const requestPilot = new XMLHttpRequest();
            requestPilot.open('GET', testPath, true);
            // request.responseType = 'json';
            requestPilot.send();

            requestPilot.addEventListener('load', () => {
                if (requestPilot.status === 200) {
                    // console.log(JSON.parse(requestPilot.response));
                    

                    pilotsIntruder.push(JSON.parse(requestPilot.response));  // записать в объект данные пилота + данные по этому пилоту из dronesIntruder[i]
                    console.log(pilotsIntruder);



                }
                else {
                    console.warn('404')
                }
            })

        }

    }
})


/***/
/***/
// функ., получить answer, вернуть dataDrones
function getDataFromXML(data) {
    const answer = data.responseXML;
    const timeStamp = answer.querySelector('capture').getAttribute('snapshotTimestamp');
    const tmpDataDrones = []; // массив объектов. Объекты - данные по каждому дрону

    Array.from(answer.querySelectorAll('drone')).forEach((item, i) => {
        // найти всех drone, NodeList преобразовать в массив, перебрать циклом
        attTags = ['serialNumber', 'positionY', 'positionX'];
        const odjDataDrone = {};

        for (i = 0; i < attTags.length; i++) {
            odjDataDrone[attTags[i]] = item.querySelector(attTags[i]).innerHTML;

            if (i == attTags.length - 1) {
                odjDataDrone.timeStamp = timeStamp;
            }
        }

        tmpDataDrones.push(odjDataDrone);
    });

    return tmpDataDrones;
}

function checkDronesViolation(arr) {
    const arrTmp = [];

    arr.forEach((item, i) => {
        // перебрать dataDrones, проверить на нарушение
        const [firstReturn, lastReturn] = checkZoneViolation(+item.positionX, +item.positionY);

        if (firstReturn == false) {
            // console.log(item); // есть нарушение
            item.distance = lastReturn;
            arrTmp.push(item); // записать нарушителей в массив 
        }
    });

    return arrTmp;

    /***/
    function checkZoneViolation(x, y) {
        // return true - the pilot did not violate the unmanned zone
        // return false - the pilot violate the unmanned zone

        if (typeof (x) == 'number' && typeof (y) == 'number') {
            const POS_A_X = 250;
            const POS_A_Y = 250;
            const pos_b_x = Math.floor(x / 1000);
            const pos_b_y = Math.floor(y / 1000);

            const distance = Math.sqrt(Math.pow((pos_b_x - POS_A_X), 2) + Math.pow((pos_b_y - POS_A_Y), 2));


            if (distance > 100) {
                return [true, distance];
            } else {
                return [false, distance];
            }
        } else {
            return [true, distance];
        }
    }
}