// ==UserScript==
// @name         兵团职业技能培训平台刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  兵团职业技能培训平台刷课
// @author       maple
// @match        https://xspx.xjbthrss.gov.cn/mizar/*
// @grant        none
// ==/UserScript==


class CourseListHandler {
    constructor() {
        this.init()
    }

    init() {
        let courseList = this.getCourseList();

        // 选择未完成课程并点击
        for (let i = 0; i < courseList.length; i++) {
            let item = courseList[i];
            if (this.selectCourse(item)) {
                item.querySelector('a.btnw80').click()
                break;
            }
        }
    }

    getCourseList() {
        let courseList = [];
        let courseListAll = document.querySelectorAll(".cm_partCon_all.clearfix");
        courseListAll.forEach(item => {
            item.querySelectorAll("li.clearfix").forEach(innerItem => {
                courseList.push(innerItem);
            })
        })
        return courseList;
    }

    selectCourse(courseLiTag) {
        return !courseLiTag.querySelector("em.pa.tag-now");
    }

}

class CourseDetailHandler {
    constructor() {
        this.init()
    }

    init() {
        console.debug("课程详情页-开始分发")
        this.dispatch()
    }

    dispatch() {
        if (document.querySelector("#video_div_video_html5_api")) {
            this.studyVideo()
        } else if (document.querySelector("a.btnw200") || document.querySelector("#submitButton")) {
            this.exam();
        } else {
            console.error("分发失败")
        }
    }

    studyVideo() {
        console.debug("开始学习视频")
        let videoTag = document.querySelector("#video_div_video_html5_api")
        videoTag.click()
        videoTag.play()

        let timeTask = setInterval(() => {
            // 获取视频总时长
            let totalDuration = videoTag.duration;
            // 获取当前播放时长
            let currentDuration = videoTag.currentTime;
            console.debug("返回定时任务", totalDuration, currentDuration)
            if (currentDuration >= totalDuration) {
                console.debug("视频播放完毕，返回")
                this.back();
                clearInterval(timeTask)
            }
        }, 1000);
    }


    /**
     * 正常的考试以及视频中间的iframe考试
     */
    exam() {
        console.debug("开始考试")
        let startBtn = document.querySelector("a.btnw200");
        if (startBtn) {
            startBtn.click();
        }

        // iframe考试【视频中的拦截题目】
        if (document.querySelector("div.itestBody.false")) {
            console.debug("iframe考试")
            let topicTag = document.querySelector(".titleArea.clearfix");
            let topic = topicTag.innerText.substring(0, topicTag.innerText.length - 2);
            let executeResult = eval(topic);
            let selectItemList = document.querySelectorAll(".radio-box.fl");
            for (let i = 0; i < selectItemList.length; i++) {
                if (selectItemList[i].nextSibling.data.includes(executeResult + "")) {
                    selectItemList[i].click();
                    break
                }
            }
            // 提交
            document.querySelector("#submitButton").click();
            // 继续学习
            setTimeout(() => {
                document.querySelector("#submitButton").click();
            }, 300)
            return;
        }

        // 选择题【单选题，多选题】
        let allSelectItemList = document.querySelectorAll("ul.bgc");
        allSelectItemList.forEach(item => {
            // 全部选择a
            item.firstElementChild.querySelector("i").click();
        })

        // 判断题全部正确
        document.querySelectorAll(".fl.mr10.btn.btnLineGray[value='1']").forEach(item => {
            item.click()
        })

        // 提交试卷
        document.querySelector("#submitButton").click();
        // 确认提交
        setTimeout(() => {
            document.querySelector(".ui_state_highlight").click()
        }, 300)
    }


    back() {
        let iTag = document.querySelector("i.cedu-back");
        if (!iTag) {
            return;
        }

        iTag.click();
    }
}

(function () {
    'use strict';

    let listUrl = 'https://xspx.xjbthrss.gov.cn/mizar/study/index/index.do';
    let detailUrl = 'https://xspx.xjbthrss.gov.cn/mizar/study/activity';

    window.addEventListener("load", () => {
        if (document.URL.includes(listUrl)) {
            new CourseListHandler();
        } else if (document.URL.includes(detailUrl)) {
            new CourseDetailHandler();
        }
    })
})();