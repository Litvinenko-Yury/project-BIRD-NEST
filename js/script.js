'use strict';

document.addEventListener('DOMContentLoaded', () => {

  fetch('https://assignments.reaktor.com/birdnest/drones', {
    method: 'GET',
  })
    // .then(response => response.json())
    .then(response => console.log(response))

});
