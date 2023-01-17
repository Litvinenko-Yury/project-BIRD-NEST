export async function checkDronesViolation(arr) {

    return new Promise((resolve) => {
        const arrTmp = [];

        arr.forEach((item) => {
            // iterate over dataDrones, check for violation
            const [firstReturn, lastReturn] = checkZoneViolation(+item.positionX, +item.positionY);

            if (firstReturn == false) {
                // there is a violation
                const clone = JSON.parse(JSON.stringify(item)); // item is an object, do a deep clone of the object
                clone.distance = lastReturn;
                arrTmp.push(clone); // write offenders to array
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