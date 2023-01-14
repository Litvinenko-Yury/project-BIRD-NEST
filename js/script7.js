'use strict';


const request = new XMLHttpRequest();
request.open('GET', 'https://assignments.reaktor.com/birdnest/drones', true);
request.responseType = 'document';
request.send();

request.addEventListener('load', () => {
    if (request.status === 200) {
        // console.log(request.responseXML);
        // console.log(request.getAllResponseHeaders());

        chain();

        async function chain() {

            const dataDrones = await getDataFromXML(request); // данные всех дронов, массив объектов
            console.log('данные всех дронов');
            console.log(dataDrones);

            const dronesIntruder = await checkDronesViolation(dataDrones); // данные всех дронов-нарушителей
            console.log('данные всех дронов-нарушителей');
            console.log(dronesIntruder);



            await new Promise(function (resolve) {
                let pilotsIntruder = getDataPilotsIntruder(dronesIntruder); // здесь будут данные всех пилотов-нарушителей + данные по дрону: SN+distanse+timeIntruder
                console.log('данные всех данные пилотов-нарушителей + drone: SN+distanse+timeIntruder');
                console.log(pilotsIntruder);

                resolve(pilotsIntruder);

            });

            await new Promise(function (resolve) {
                setContentOnPage(pilotsIntruder);

                resolve();
            });


            setCurrentTimeOnPage();
        }

    }
})


/***/
/***/
function getDataFromXML(data) {
    // функ., получить answer, вернуть dataDrones
    const answer = data.responseXML;
    const timeStamp = answer.querySelector('capture').getAttribute('snapshotTimestamp');
    const tmpDataDrones = []; // массив объектов. Объекты - данные по каждому дрону

    Array.from(answer.querySelectorAll('drone')).forEach((item, i) => {
        // найти всех drone, NodeList преобразовать в массив, перебрать циклом
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

    return tmpDataDrones;
}

function checkDronesViolation(arr) {
    const arrTmp = [];

    arr.forEach((item) => {
        // перебрать dataDrones, проверить на нарушение
        const [firstReturn, lastReturn] = checkZoneViolation(+item.positionX, +item.positionY);

        if (firstReturn == false) {
            // console.log(item); // есть нарушение
            const clone = JSON.parse(JSON.stringify(item)); // item - это объект, делаем глубокое клонирование объекта
            clone.distance = lastReturn;
            arrTmp.push(clone); // записать нарушителей в массив 
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

function getDataPilotsIntruder(arr) {
    if (arr.length > 0) { // функция примет массив нарушителей

        const arrTmp = [];

        arr.forEach((item) => {
            const path = `https://assignments.reaktor.com/birdnest/pilots/${item.serialNumber}`; // строкa с serialNumber

            const requestPilot = new XMLHttpRequest();
            requestPilot.open('GET', path, true);
            requestPilot.send();

            requestPilot.addEventListener('load', () => {
                if (requestPilot.status === 200) {
                    const dataPilot = JSON.parse(requestPilot.response); // ответ сервера
                    dataPilot.serialNumber = item.serialNumber;
                    dataPilot.distance = item.distance;
                    dataPilot.timeIntruder = item.timeStamp;

                    arrTmp.push(dataPilot);  // записать в объект данные пилота-нарушителя + данные по drone из dronesIntruder[i] - SN+distanse+timeIntruder

                }
                else {
                    console.warn('404')
                }
            })
        })

        return arrTmp;
    }
}

function setCurrentTimeOnPage() {
    const time = document.querySelector('#time');
    let now = new Date();
    time.innerHTML = now;
}

function setContentOnPage(arr) {
    if (arr == undefined) {
        console.log('undefined');
        return;
    } else {
        arr.forEach((item) => {
            console.log(item);
        })
    }
}
