'use strict';

chain();
async function chain() {
    // просто функция, в которой, что-бы использовать  await, нужно добавить async

    let data = await func1(2); // будет ждать выполнение func1()
    console.log(data);

    data = await func2(data); // будет ждать выполнение func21()
    console.log(data);

    data = await func3(data); // будет ждать выполнение func3()
    console.log(data);
}

/***/
function func1(a) {
    // просто функция, которая вернет промис через 1сек
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = a * 2;
            resolve(result);
        }, 1000);
    })
}

function func2(a) {
    // просто функция, которая вернет промис через 1сек
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = a * 4;
            resolve(result);
        }, 1000);
    })
}

function func3(a) {
    // просто функция, которая вернет промис через 1сек
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = a * 8;
            resolve(result);
        }, 1000);
    })
}

