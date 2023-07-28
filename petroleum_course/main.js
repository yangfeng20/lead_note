// ==UserScript==
// @name         中石油
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  中石油刷课
// @author       maple
// @match        https://e-learning.cnpcint.com/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=*
// @match        https://e-learning.cnpcint.com/els/html/studyCourse/studyCourse.enterCourse.do?courseId=*
// @match        https://e-learning.cnpcint.com/els/html/course/course.courseInfo.do?courseId=*
// @match        https://e-learning.cnpcint.com/rtr-frontend/student/allTask?type=kecheng*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnpcint.com
// @grant        none
// ==/UserScript==

let instance = null;

(function () {
    'use strict';
    // 评估页面
    if (document.URL.includes("https://e-learning.cnpcint.com/els/html/studyCourse/studyCourse.enterCourse.do?courseId")) {
        setTimeout(courseEvaluate, 500)
        //    课程学习页面
    } else if (document.URL.includes("https://e-learning.cnpcint.com/els/html/courseStudyItem/courseStudyItem.learn.do?courseId")) {
        setInterval(study, 1000)
        //    课程列表
    } else if (document.URL.includes("https://e-learning.cnpcint.com/rtr-frontend/student/allTask")) {
        setTimeout(selectCourse, 2000)
        // 课程详情页
    } else if (document.URL.includes("https://e-learning.cnpcint.com/els/html/course/course.courseInfo.do?courseId")) {
        setTimeout(goCourse, 500)
    }
})();




function study() {

    let VideoStudy = (function () {



        function VideoStudy(chapterList) {
            // 章节学习中
            this.index = 0
            this.chapterStudying = false
            this.chapterList = chapterList
            this.currentChapter = chapterList[this.index]
            let videoElement = document.querySelector("video");
            videoElement.muted = true;


            this.studyVideo = function () {
                if (!this.chapterStudying){
                    this.currentChapter.click()
                }

                this.chapterStudying = true;
            }


            /**
             * 开始刷课，幂等
             */
            this.start = function () {
                while (this.chapterFinish()) {
                    // 当前章节已经完成,下一个章节
                    this.next()
                    this.chapterStudying = false
                }

                if (this.finished()) {
                    // 所有章节都已经完成，点击课程评估
                    this.clickCourseEvaluate()
                }

                // 开始学习当前课程
                this.studyVideo()
            }


            this.chapterFinish = function () {
                if (this.currentChapter === null) {
                    return false;
                }
                return this.currentChapter.classList.contains("cl-catalog-link-done");
            }

            this.finished = function () {
                return this.currentChapter === null;
            }


            this.next = function () {
                if (this.index === this.chapterList.length - 1) {
                    return null;
                }
                this.currentChapter = this.chapterList[++this.index]
            }

            this.clickCourseEvaluate = function () {
                let linkEleList = document.querySelectorAll(".cs-menu-link");
                for (let i = 0; i < linkEleList.length; i++) {
                    if (linkEleList[i].innerText === "2.课程评估") {
                        linkEleList[i].click()
                        break;
                    }
                }
            }
        }

        return {
            getSingletonInstance: function (chapterList) {
                if (instance) {
                    return instance;
                }

                instance = new VideoStudy(chapterList)
                return instance
            }
        }
    }())

    // videoElement = document.querySelector("video");
    // videoElement.muted = true;

    let chapterListEle = document.querySelector(".cl-catalog-item");
    if (!chapterListEle) {
        return;
    }

    let chapterList = chapterListEle.querySelectorAll("a");
    //  开始学习
    VideoStudy.getSingletonInstance(chapterList).start();


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

    window.location.href = 'https://e-learning.cnpcint.com/rtr-frontend/student/allTask?type=kecheng'
}

function selectCourse() {
    // 所有进度
    let allScheduleEle = document.querySelectorAll(".status-item");
    for (let i = 0; i < allScheduleEle.length; i++) {
        let text = allScheduleEle[i].querySelector("i").innerText;
        if (text === "课后考试") {
            continue;
        }

        console.log(allScheduleEle[i])
        allScheduleEle[i].click();
        break;
    }
}


function goCourse() {
    document.querySelector("#goStudy").click()
}


let VideoStudy = (function () {

    let instance = null;

    function VideoStudy(chapterList) {
        // 章节学习中
        this.index = 0
        this.chapterStudying = false
        this.chapterList = chapterList
        this.currentChapter = chapterList[this.index]
        let videoElement = document.querySelector("video");
        videoElement.muted = true;


        this.studyVideo = function () {
            this.currentChapter.click()
            this.chapterStudying = true;
        }


        /**
         * 开始刷课，幂等
         */
        this.start = function () {
            while (this.chapterFinish()) {
                // 当前章节已经完成,下一个章节
                this.next()
            }

            if (this.finished()) {
                // 所有章节都已经完成，点击课程评估
                this.clickCourseEvaluate()
            }

            // 开始学习当前课程
            this.studyVideo()
        }


        this.chapterFinish = function () {
            if (currentChapter === null) {
                return false;
            }
            return currentChapter.classList.contains("cl-catalog-link-done");
        }

        this.finished = function () {
            return currentChapter === null;
        }


        this.next = function () {
            if (this.index === this.chapterList.length - 1) {
                return null;
            }
            return this.chapterList[++this.index]
        }

        this.clickCourseEvaluate = function () {
            let linkEleList = document.querySelectorAll(".cs-menu-link");
            for (let i = 0; i < linkEleList.length; i++) {
                if (linkEleList[i].innerText === "2.课程评估") {
                    linkEleList[i].click()
                    break;
                }
            }
        }
    }

    return {
        getSingletonInstance: function (chapterList) {
            if (instance) {
                return instance;
            }

            return new VideoStudy(chapterList)
        }
    }
}())