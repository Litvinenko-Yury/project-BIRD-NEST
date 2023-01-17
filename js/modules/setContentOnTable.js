export function setContentOnTable(arr) {
    // arr - array of objects with pilot data
    if (arr != undefined) {
        arr.forEach((item) => { //item - data on the pilot
            insertRowOnTable(item); // add new entry
        })
    } else {
        return;
    }

    /***/
    function insertRowOnTable(data) {
        // data - data on the pilot

        const tableHead = document.querySelector('#tableHead');
        const userTimezoneOffset = (new Date().getTimezoneOffset()) * 60000; // here is the user's time zone offset, ms
        const localTime = new Date(Date.parse(data.timeIntruder) - userTimezoneOffset).toISOString(); // string in ISO
        const strTimeIntruder = localTime.slice(localTime.indexOf('T') + 1, localTime.length - 5); // part of the string to display in the table

        const timeBDStart = data.timeIntruder; // string
        const timeUserStart = new Date().toISOString(); // string, get current date
        const diff = Date.parse(timeBDStart) - Date.parse(timeUserStart);

        const newDistance = data.distance.toFixed(2); // distance new

        const table = document.querySelector('#table');
        let rows = table.querySelectorAll('[data-tableBody]');

        if (rows.length > 0) {
            // table is not empty
            // check all entries and if there is a match, take action
            let coindencePilotID = 0;
            rows.forEach((itemRows, i) => {
                // look at the itemRows table row, is there such a pilot?
                if (itemRows.getAttribute('data-pilotID') === data.pilotId) {
                    // record/pilot is
                    coindencePilotID++;

                    // check distance
                    const oldDistance = itemRows.querySelector('[data-distance]').getAttribute('data-distance');

                    if (newDistance < oldDistance) {
                        // write newDistance
                        itemRows.querySelector('[data-distance]').setAttribute('data-distance', `${newDistance}m`);
                        itemRows.querySelector('[data-distance]').innerHTML = `${newDistance}m`;
                    } else {
                        // leave oldDistance
                    }
                }
            });

            if (coindencePilotID == 0) {
                // there is no record/pilot in the table
                saveNewDataOnTable(); //write new line
            }
        }
        else {
            // the table is empty, write a new line
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