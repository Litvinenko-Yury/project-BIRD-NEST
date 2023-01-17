export function setCurrentTimeOnPage() {
    const time = document.querySelector('#time');
    let now = new Date();
    time.innerHTML = now;
}