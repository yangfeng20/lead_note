// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log('脚本执行')
    setInterval(() => {
        console.log("hello world")
    }, 1000)
})();