'use strict';

setInterval(() => {
    processRequest();
    showTableFooter();
}, 2000);

setTimeout(() => {
    setInterval(() => {
        removeContentOnPage(); // проверить записи в таблице на срок 10 мин
    }, 1000);
}, 2000); // старт через 10мин


function processRequest() {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://assignments.reaktor.com/birdnest/drones', true);
    request.responseType = 'document';
    request.send();

    request.addEventListener('load', () => {
        if (request.status === 200) {
            chain();
            async function chain() {
                const dataDrones = await getDataFromXML(request); // данные всех дронов, массив объектов
                const dronesIntruder = await checkDronesViolation(dataDrones); // данные всех дронов-нарушителей, массив объектов
                const pilotsIntruder = await getDataPilotsIntruder(dronesIntruder); // данные всех пилотов-нарушителей + данные по дрону: SN+distanse+timeIntruder, массив объектов
                setContentOnTable(pilotsIntruder);
                setCurrentTimeOnPage();
            }
        }
    })
}


/***/
/***/
async function getDataFromXML(data) {
    return new Promise((resolve) => {
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

        resolve(tmpDataDrones);
    })
}

async function checkDronesViolation(arr) {
    
    return new Promise((resolve) => {
        const arrTmp = [];

        arr.forEach((item) => {
            // перебрать dataDrones, проверить на нарушение
            const [firstReturn, lastReturn] = checkZoneViolation(+item.positionX, +item.positionY);

            if (firstReturn == false) {
                // есть нарушение
                const clone = JSON.parse(JSON.stringify(item)); // item - это объект, делаем глубокое клонирование объекта
                clone.distance = lastReturn;
                arrTmp.push(clone); // записать нарушителей в массив 
            }
        });

        resolve(arrTmp);
    })

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

async function getDataPilotsIntruder(arr) {

    if (arr.length > 0) { // функция примет массив нарушителей
        const arrTmp = [];
        const arrPromise = [];

        for (let i = 0; i < arr.length; i++) {
            //каждый промис записать в массив

            arrPromise.push(new Promise((resolve, reject) => {
                const path = `https://assignments.reaktor.com/birdnest/pilots/${arr[i].serialNumber}`; // строкa с serialNumber

                const requestPilot = new XMLHttpRequest();
                requestPilot.open('GET', path, true);
                requestPilot.send();

                requestPilot.addEventListener('load', () => {
                    if (requestPilot.status === 200) {
                        const dataPilot = JSON.parse(requestPilot.response); // ответ сервера
                        dataPilot.serialNumber = arr[i].serialNumber;
                        dataPilot.distance = arr[i].distance;
                        dataPilot.timeIntruder = arr[i].timeStamp;

                        arrTmp.push(dataPilot);  // записать в объект данные пилота-нарушителя + данные по drone из dronesIntruder[i] - SN+distanse+timeIntruder

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

function setContentOnTable(arr) {
    // arr - массив объектов с данными пилотов
    if (arr != undefined) {
        arr.forEach((item) => { //item - данные по пилоту
            insertRowOnTable(item); // add new entry
        })
    } else {
        return;
    }

    /***/
    function insertRowOnTable(data) {
        // data - данные по пилоту

        const tableHead = document.querySelector('#tableHead');
        const userTimezoneOffset = (new Date().getTimezoneOffset()) * 60000; // здесь смещение часового пояса пользователя, мс
        const localTime = new Date(Date.parse(data.timeIntruder) - userTimezoneOffset).toISOString(); // string in ISO
        const strTimeIntruder = localTime.slice(localTime.indexOf('T') + 1, localTime.length - 5); // часть строки для показа в таблице

        const timeBDStart = data.timeIntruder; // string
        const timeUserStart = new Date().toISOString(); // string, получить текущую дату
        const diff = Date.parse(timeBDStart) - Date.parse(timeUserStart);

        const newDistance = data.distance.toFixed(2); // distance свежая

        const table = document.querySelector('#table');
        let rows = table.querySelectorAll('[data-tableBody]');

        if (rows.length > 0) {
            // таблица не пустая
            // ПРОВЕРИТЬ ВСЕ ЗАПИСИ, И ЕСЛИ ЕСТЬ СОВПАДЕНИЕ, СДЕЛАТЬ ДЕЙСТВИЕ
            let coindencePilotID = 0;
            rows.forEach((itemRows, i) => {
                // посмотреть строку таблицы itemRows, есть такой пилот?
                if (itemRows.getAttribute('data-pilotID') === data.pilotId) {
                    coindencePilotID++;
                    // запись/пилот есть
                    // проверить distance
                    const oldDistance = itemRows.querySelector('[data-distance]').getAttribute('data-distance');

                    if (newDistance < oldDistance) {
                        // записываю newDistance
                        itemRows.querySelector('[data-distance]').setAttribute('data-distance', `${newDistance}m`);
                        itemRows.querySelector('[data-distance]').innerHTML = `${newDistance}m`;
                    } else {
                        // оставляю oldDistance
                    }
                }
            });

            if (coindencePilotID == 0) {
                // в таблице записи/пилотa нет
                saveNewDataOnTable();  //записать новую строку
            }
        }
        // таблица пустая
        else {
            // таблица пустая, записать новую строку
            saveNewDataOnTable();
        }

        function saveNewDataOnTable() {
            tableHead.insertAdjacentHTML('afterend',
                `<tbody class="table__body" data-tableBody data-pilotID="${data.pilotId}" data-timeIntruder="${data.timeIntruder}" data-diff="${diff}">
        <tr class="table__row">
          <td class="table__data">${strTimeIntruder}</td>
          <td class="table__data" data-distance="${data.distance.toFixed(2)}">${data.distance.toFixed(2)}m</td>
          <td class="table__data">${data.firstName} ${data.lastName}</td>
          <td class="table__data">${data.email}</td>
          <td class="table__data">${data.phoneNumber}</td>
        </tr>
      </tbody>`
            );
        }
    }
}

/**/
function removeContentOnPage() {
    const TIME_INTERVAL = 300000; // 10minutes - 600000
    const table = document.querySelector('#table');
    const rows = table.querySelectorAll('[data-tableBody]');
    const timeUserCurrent = new Date(); // здесь получить текущую дату

    rows.forEach(item => {
        const timeBDStart = item.getAttribute('data-timeintruder');
        const diff = item.getAttribute('data-diff');
        if ((Date.parse(timeUserCurrent) - Math.abs(diff) - Date.parse(timeBDStart)) > TIME_INTERVAL) {
            item.remove(); // > 10minute, remove row
        }
    })
}

function setCurrentTimeOnPage() {
    const time = document.querySelector('#time');
    let now = new Date();
    time.innerHTML = now;
}

function showTableFooter() {
    const arr = document.querySelectorAll('[data-tableBody]');

    if (arr.length > 1) {
        document.querySelector('#tableFooter').classList.add('table__footer--show');
    } else {
        document.querySelector('#tableFooter').classList.remove('table__footer--show');
    }
}


/***/
// visualizeDrones();
function visualizeDrones() {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const radius = 100;
    const startAngle = 0;
    const endAngle = 360;

    ctx.beginPath();
    ctx.strokeStyle = '#FF0000'; // line color
    ctx.lineWidth = 1; // line width
    ctx.arc(x, y, radius, startAngle, endAngle, false); // Внешняя окружность
    ctx.moveTo(x, y);
    ctx.arc(x, y, 1, 0, 360, false); // Внешняя окружность
    ctx.stroke();

}
