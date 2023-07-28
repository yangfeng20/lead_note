// ==UserScript==
// @name         中石油
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  中石油刷课
// @author       maple
// @match        https://e-learning.cnpcint.com/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=*
// @match        https://e-learning.cnpcint.com/els/html/studyCourse/studyCourse.enterCourse.do?courseId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnpcint.com
// @grant        none
// ==/UserScript==

let learning;
let videoElement;


(function () {
    'use strict';
    // 评估
    if (document.URL.includes("https://e-learning.cnpcint.com/els/html/studyCourse/studyCourse.enterCourse.do?courseId")) {
        courseEvaluate()
    } else {
        setInterval(study, 1000)
    }
})();


function study() {

    videoElement = document.querySelector("video");
    videoElement.muted = true;

    let chapterListEle = document.querySelector(".cl-catalog-item");
    if (!chapterListEle || learning) {
        return;
    }

    // 视频学习中 状态
    let videoLearning = false;
    let chapterList = chapterListEle.querySelectorAll("a");
    for (let i = 0; i < chapterList.length; i++) {
        let chapterItem = chapterList[i];
        // 完成标记
        let finishFlag = chapterItem.classList.contains("cl-catalog-link-done");
        if (!finishFlag) {
            chapterItem.click()
            learning = videoLearning = true;
            console.log("开始学习：" + chapterItem.title)
            break;
        }
        console.log("已完成：" + chapterItem.title)
    }

    // 没有点击任何课程，说明学习完毕
    if (!videoLearning) {
        console.log("课程学习完毕")
        // 点击课程评估
        clickCourseEvaluate()
    }
}


function clickCourseEvaluate() {
    let linkEleList = document.querySelectorAll(".cs-menu-link");
    for (let i = 0; i < linkEleList.length; i++) {
        if (linkEleList[i].innerText === "2.课程评估") {
            linkEleList[i].click()
            break;
        }
    }
}

function courseEvaluate() {
    // 总评分
    document.querySelector(".cs-input-star[value='5']").click()

    // 所有满分单选项
    let optionList = document.querySelectorAll(".cs-test-option.cs-test-radio.cs-test-radio-last");
    for (let i = 0; i < optionList.length; i++) {
        optionList[i].click()
    }

    // 提交
    document.querySelector("#courseEvaluateSubmit").click()
    console.log("提交")

    // 确认提交
    document.querySelector(".layui-layer-btn1").click()

    document.querySelector(".layui-layer-btn1").click()

}