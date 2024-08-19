function Person() {
}

var per = new Person()

// 向 Person 的原型对象中添加 run 方法
Person.prototype.run = function(){
    console.log("我是原型上的run方法")
}
per.run(); // 我是原型上的run方法 ---自身没有 run 方法, 那么就会去原型中寻找

// per 和 Person 自身都不存在 run
console.log(per.hasOwnProperty('run')) // false 
console.log(Person.hasOwnProperty('run')) // false

// 通过 __proto__ 和 prototype 访问原型对象,在原型中可以找到对应的属性
console.log(per.__proto__.hasOwnProperty('run')) // true
console.log(Person.prototype.hasOwnProperty('run')) // true