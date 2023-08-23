// ==UserScript==
// @name         哔哩哔哩工具[快捷键|视频时长]
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  快捷键【c】打开关闭弹幕，跳过充电鸣谢，自动下一个，视频时长统计
// @author       maple
// @match        https://www.bilibili.com/*
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// ==/UserScript==

let stop;

window.onload = function () {

    //第一次主动执行一次
    main();

    //跳过片尾充电鸣谢
    pass();

    //10秒运行一次，刷新状态
    stop = setInterval(main,10000);

}


//主函数
function main() {
    console.log("bilibiliTools...")

    let nodeList;
    try{
        //获取视频列表节点
        nodeList = getVideoList();
    }catch (e){
        //console.log("没有视频列表，不是视频选集")
        clearInterval(stop);
        return;
    }

    sleep(2000).then(() => {
        //获取当前观看索引
        let index = getCurrentLookVideoIndex(nodeList);

        //未看视频个数
        let number = nodeList.length-index;

        //获取视频全部时间的数组
        let allTime = getTimeArray(nodeList);
        //所有时间数组，格式 [h,m]
        let all_time_arr = format(allTime);


        //获取未观看的视频时间数组
        let timeArray = getTimeArray(nodeList,index);
        //未看时间数组，格式 [h,m]
        let undone_time_arr = format(timeArray);

        //显示到网页
        show(all_time_arr, undone_time_arr, number);
    })

}

////////////////////////////////快捷键///////////////////////////////////////
//操作弹幕开关函数
function barrage_switch(){
    //找到弹幕input标签，并点击
    let input = document.querySelector(".bui-danmaku-switch-input");
    input.click();
}

//注册按钮监听
window.onkeydown = function(ev){
    //ev表示onkeydown事件对象，63为字母 c
    if(ev.keyCode===67){
        barrage_switch();
    }
}

//自动连播，跳过充电页
function pass() {
    let jumpButton = '.bilibili-player-electric-panel-jump';
    setInterval(() => {
        if($(jumpButton).length > 0) {
            $(jumpButton).trigger('click')
        }
    }, 200)
}
/////////////////////////////////统计时间////////////////////////////////////

//获取视频索引列表
function getVideoList() {
    let list_box = document.getElementsByClassName('list-box')[0];
    return list_box.childNodes;
}

//获取到当前观看视频的索引
function getCurrentLookVideoIndex(nodeList) {
    let index = null;
    for (let i = 0; i < nodeList.length; i++) {
        //当前观看的视频
        let current = nodeList[i];
        //延迟之后获取class值

        let class_name = current.className;

        //当前观看
        if (class_name==='watched on' || class_name==='on'){
            //console.log(class_name)  //类名
            index = i;
            //console.log("当前视频索引："+index)
            break;
        }
        //循环结束时还没有获取到索引(正常不会之前，前面就跳出了)
        if (i === nodeList.length - 1){
            console.log("error")
        }

    }
    return index;
}

//获取到时间时间字符串
function getTimeArray(nodeList,index) {
    //如果没有这个参数(用于统计总时长)
    if (index===undefined){
        index = 0;
    }
    let parent_array = [];
    for (let i = index; i < nodeList.length; i++) {
        // nodeList[i]代表列表中的每一个li
        let div = nodeList[i].getElementsByClassName("duration");
        //每个视频的时长
        let duration = div[0].innerHTML;
        //console.log(duration);   //格式：'09:29'

        //添加到数组
        let child_array = duration.split(":");
        if (child_array.length<3){
            //数组首部添加0
            child_array.unshift('0');
        }
        parent_array.push(child_array);

    }
    return parent_array;
}

function format(timeArray) {

    //console.log("视频列表长度："+timeArray.length);  //如果为0没有数据，就出错了

    let h=0,m=0,s=0;
    for (let i = 0; i < timeArray.length; i++) {
        h += Number(timeArray[i][0]);
        m += Number(timeArray[i][1]);
        s += Number(timeArray[i][2]);
    }

    //将秒转换为分钟
    let m1 = Math.floor(s/60);
    m +=m1;

    //分钟转换为小时
    let temp = m/60;
    let h1 = Math.floor(temp);

    //小于一小时的转换为分钟
    let m2 = ('0.'+String(temp).split('.')[1])*60;


    //最终结果
    h +=h1;
    m =Math.floor(m2);

    //分钟出现NaN,原因是因为没有分钟，全是小时，直接赋值
    if (isNaN(m)){
        m="00";
    }


    //console.log("小时："+h);
    //console.log("分钟："+m);

    return [h,m];

}

//在评论上显示
function show(all, undone, number) {
    //找到显示面板
    let plain = document.getElementsByClassName("video-info-detail")[0];

    let data_tag = document.getElementById("data_tag");

    let isNull = data_tag===null;

    //没有创建过这个标签就创建
    if (isNull){
        //创建
        data_tag = document.createElement("span");
        //console.log(data_tag)
        //id赋值，用于下次更新查找
        data_tag.setAttribute("id", "data_tag");
        data_tag.style = '\n' +
            '    background-color: #24c7b4;\n' +
            '    color: white;\n' +
            '    font-size: 0.1rem;\n' +
            '    text-align: center;\n' +
            '    margin-top: 100rem;\n' +
            '    margin-bottom: 100rem;\n' +
            '    padding:0.5rem;\n' +
            '    cursor: pointer;\n' +
            '    border-radius: 1rem;\n' +
            '    ';
    }


    //写入html
    data_tag.innerHTML = show_Str();

    //数据添加到面板
    if (isNull){
        plain.appendChild(data_tag);
    }


    function show_Str() {
        let all_time = "总时长："+ all.join(' : ');
        let undone_time = "  未观看："+ undone.join(' : ');
        let num = "  未看个数："+number;

        return all_time+undone_time+num;
    }
}




//延时函数
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}