'use strict';

import {getDataFromXML} from './modules/getDataFromXML.js';
import {checkDronesViolation} from './modules/checkDronesViolation.js';
import {getDataPilotsIntruder} from './modules/getDataPilotsIntruder.js';
import {setContentOnTable} from './modules/setContentOnTable.js';
import {removeContentOnPage} from './modules/removeContentOnPage.js';
import {setCurrentTimeOnPage} from './modules/setCurrentTimeOnPage.js';
import {showTableFooter} from './modules/showTableFooter.js';


setInterval(() => {
    processRequest();
    showTableFooter();
}, 2000);

setTimeout(() => {
    setInterval(() => {
        removeContentOnPage(); // checking the record in the table for a period of 10 min.
    }, 1000);
}, 600000); // start in 10 min


function processRequest() {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://assignments.reaktor.com/birdnest/drones', true);
    request.responseType = 'document';
    request.send();

    request.addEventListener('load', () => {
        if (request.status === 200) {
            chain();
            async function chain() {
                const dataDrones = await getDataFromXML(request); // data of all drones, an array of objects
                const dronesIntruder = await checkDronesViolation(dataDrones); // data of all intruder drones, an array of objects
                const pilotsIntruder = await getDataPilotsIntruder(dronesIntruder); // data of all violating pilots + drone data: SN+distanse+timeIntruder, array of objects
                setContentOnTable(pilotsIntruder);
                setCurrentTimeOnPage();
            }
        }
    })
}
