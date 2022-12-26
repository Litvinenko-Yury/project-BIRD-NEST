  fetch('https://assignments.reaktor.com/birdnest/drones', {
                method: 'GET',
            })
                .then(response => console.log(response.responseXML));