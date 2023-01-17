export function showTableFooter() {
    const arr = document.querySelectorAll('[data-tableBody]');

    if (arr.length > 1) {
        document.querySelector('#tableFooter').classList.add('table__footer--show');
    } else {
        document.querySelector('#tableFooter').classList.remove('table__footer--show');
    }
}