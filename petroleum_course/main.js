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
            // 最后一个章节超时计数
            this.timeCount = 0;
            videoElement.muted = true;


            this.studyVideo = function () {
                if (!this.chapterStudying) {
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
                    console.log("点击评估")
                    this.clickCourseEvaluate()
                }

                // 开始学习当前课程
                this.studyVideo()

                this.reload()
            }


            this.reload = function () {
                // 最后一个章节时，已经看完暂停，页面可能不会刷新章节完成状态，直接超过一分钟刷新
            if(videoElement.paused && !this.chapterList[this.index + 1] && ++this.timeCount > 10){
                location.reload()
            }
            }


            this.chapterFinish = function () {
                if (this.currentChapter === null || this.currentChapter === undefined) {
                    return false;
                }
                return this.currentChapter.classList.contains("cl-catalog-link-done");
            }

            this.finished = function () {
                return this.currentChapter === null || this.currentChapter === undefined;
            }


            this.next = function () {
                if (this.index === this.chapterList.length - 1) {
                    this.currentChapter = null;
                }
                this.currentChapter = this.chapterList[++this.index]
            }

            this.clickCourseEvaluate = function () {
                let linkEleList = document.querySelectorAll(".cs-menu-link");
                for (let i = 0; i < linkEleList.length; i++) {
                    if (linkEleList[i].innerText.includes("课程评估")) {
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

                console.log("所有章节列表：")
                console.log(chapterList)
                instance = new VideoStudy(chapterList)
                return instance
            }
        }
    }())


    let chapterListEleList = document.querySelectorAll(".cl-catalog-item");
    if (!chapterListEleList) {
        return;
    }

    let allChapterList = []
    chapterListEleList.forEach(chapterListEle => {
        let chapterList = chapterListEle.querySelectorAll("a")
        chapterList.forEach(item => allChapterList.push(item))
    })

    //  开始学习
    VideoStudy.getSingletonInstance(allChapterList).start();


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

    window.location.href = 'https://e-learning.cnpcint.com/rtr-frontend/student/allTask?type=kecheng'
}

function selectCourse() {
    // 所有进度
    let allScheduleEle = document.querySelectorAll(".status-item");
    for (let i = 0; i < allScheduleEle.length; i++) {
        let text = allScheduleEle[i].querySelector("i").innerText;
        if (text === "课后考试" || text === "课前测试") {
            continue;
        }

        console.log(allScheduleEle[i])
        allScheduleEle[i].click();
        return;
    }

    document.querySelector(".ant-pagination-next").click()
    this.selectCourse()
}


function goCourse() {
    document.querySelector("#goStudy").click()
}