'use strict';

chain();

async function chain() {
    let data; // временное хранилище результат работы func1/func2/func3

    await new Promise((resolve) => {
        data = func1(2);
        console.log(data);

        setTimeout(() => {
            resolve();
        }, 1000);
    });

    await new Promise((resolve) => {
        data = func2(data);
        console.log(data);

        setTimeout(() => {
            resolve();
        }, 1000);
    });

    await new Promise((resolve) => {
        data = func3(data);
        console.log(data);

        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

/***/
function func1(a) {
    const result = a * 2; // 4
    return result;
}

function func2(a) {
    const result2 = a * 3;  // 12
    return result2;
}

function func3(a) {
    const result3 = a * 4;  // 48
    return result3;
}
