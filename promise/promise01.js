let p = new Promise((resolve, reject) => {
    console.log("执行bbb")
    let number = Math.ceil(Math.random() * 10);
    if (number % 2 === 0) {
        // 逻辑正常调用
        resolve(number)
    } else {
        // 逻辑异常调用
        reject(number)
    }
})

console.log("执行111")


p.then((e) => {
    console.log("当前为奇数", e)
}).catch(e => {
    console.log("当前为偶数", e)
}).finally(() => {
    console.log("结束")
})