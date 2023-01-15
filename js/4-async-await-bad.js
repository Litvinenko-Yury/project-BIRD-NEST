'use strict';

chain();

async function chain() {

    await new Promise(function (resolve) {
        setTimeout(() => {
            let resFunc1 = func1(2);
            console.log(resFunc1);
            resolve(resFunc1);
        }, 1000);
    });

    await new Promise(function (resolve) {
        setTimeout(() => {
            let resFunc2 = func2(resolve);
            console.log(resFunc2);
            resolve(resFunc2);
        }, 1000);
    });

    await new Promise(function (resolve) {
        setTimeout(() => {
            let resFunc3 = func2(resolve);
            console.log(resFunc3);
            resolve(resFunc3);
        }, 1000);
    });

}


/***/
function func1(a) {
    const result = a * 2; // 4
    return result
}

function func2(a) {
    const result2 = a * 3;  // 12
    return result2
}

function func3(a) {
    const result3 = a * 4;  // 48
    return result3
}
