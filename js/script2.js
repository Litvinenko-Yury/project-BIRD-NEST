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

        let txt = "";
        path = "/report/bookcapture/drone"

        if (answer.evaluate) {
            let nodes = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
            let result = nodes.iterateNext();

            while (result) {
                txt += result.childNodes[0].nodeValue + "<br>";
                result = nodes.iterateNext();
            }

        } else {
            console.log('err')

        }

        console.log(txt);

    }
})

