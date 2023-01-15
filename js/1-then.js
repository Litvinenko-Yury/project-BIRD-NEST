'use strict';

new Promise((resolve) => {
    let data = func1(2);
    console.log(data);
    resolve(data);
    // resolve(func1(2));

}).then((value) => {

    return new Promise((resolve) => {
        // console.log(value);

        setTimeout(() => {
            // console.log(value);
            let data = func2(value);
            console.log(data);
            resolve(data);
            // resolve(func2(value));
        }, 2000);

    });
}).then((value) => {
    // console.log(value);

    return new Promise((resolve) => {
        setTimeout(() => {
            // console.log(value);
            let data = func3(value);
            console.log(data);
            resolve(data);
            // resolve(func3(value));
        }, 2000);

    });
}).then((value) => {
    console.log(value);
})


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
