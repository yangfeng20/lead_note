async function test01() {
    console.log("test01")

    let aa = await new Promise((resolve, reject) => {
        resolve("await表达式返回值")
    })
    console.log(aa);
}

test01().then(()=>{
    console.log("test03")
})
console.log("test02")



