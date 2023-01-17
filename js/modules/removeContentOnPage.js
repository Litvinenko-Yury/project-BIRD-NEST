export function removeContentOnPage() {
    const TIME_INTERVAL = 600000; // 10minutes - 600000
    const table = document.querySelector('#table');
    const rows = table.querySelectorAll('[data-tableBody]');
    const timeUserCurrent = new Date(); // get the current date here

    rows.forEach(item => {
        const timeBDStart = item.getAttribute('data-timeintruder');
        const diff = item.getAttribute('data-diff');
        if ((Date.parse(timeUserCurrent) - Math.abs(diff) - Date.parse(timeBDStart)) > TIME_INTERVAL) {
            item.remove(); // > 10minute, remove row
        }
    })
}