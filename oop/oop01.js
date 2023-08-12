// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://localhost:63343/lead_note/oop/index.html?_ijt=vlg2h6une3f3ee2vkuk0h8lb2m
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==

'use strict';

// 通过立即执行函数作为范围单例的入口
let Student = (function () {

    // 内部单例对象，外部不能直接访问创建
    class Student {
        constructor() {
            // 定义属性
            this.age = Math.ceil(Math.random() * 10)
        }

        // 方法
        test01() {
            console.log("test01方法")
        }
    }

    // 通过prototype添加方法
    Student.prototype.test02 = () => {
        console.log("test02方法")
    }

    // 构建单例关键代码,用于保存内部单例的变量
    let instance = null;
    // 通过这个立即执行函数的返回值返回一个获取单例对象的函数，函数中创建单例对象
    return {
        getInstance() {
            if (!instance) {
                instance = new Student();
            }

            return instance;
        }
    }
})();


(function () {
    'use strict';

    let student1 = Student.getInstance();
    let student2 = Student.getInstance();
    console.log(student1 === student2)
    student1.test01()
    student1.test02()
})()