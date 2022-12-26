const request = new XMLHttpRequest();
request.open('GET', 'https://assignments.reaktor.com/birdnest/drones', true);
request.responseType = 'document';
// request.responseType = 'text';
request.send();

request.addEventListener('load', () => {
    if (request.status === 200) {
        let answer = request.responseXML;

        console.log(answer);
        console.log(typeof (answer));

        const xpath = "//drone";
        const result = document.evaluate(xpath, answer, null, XPathResult.ANY_TYPE, null);
        let node = null;
        let drone = null;
        let arrTmpChildDrone = null;
        let arrChildDrone = null;
        const dataDrones = []; // будет массив объектов

        while (node = result.iterateNext()) {
            console.log('=====')
            drone = node;
            console.log(drone);

            arrTmpChildDrone = Array.from(drone.childNodes); // записать в nodeList детей и преобразовать в массив
            arrChildDrone = arrTmpChildDrone.filter(item => item.nodeName != '#text'); // удалить #text
            // console.log(arrChildDrone);
            // console.log(arrChildDrone.length);
            // console.log(arrChildDrone[0]);

            arrChildDrone.forEach(item => {
                console.log(item);

                
            })




            // dataDrones.push(drone);
        }
        // console.log(dataDrones)

    }
})