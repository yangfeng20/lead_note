"use strict";

class LogLevelError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "LogLevelError";
    }
}


let Logger = (function () {
    class Logger {
        constructor(level) {
            level = level ? level : "warn"
            this.levelArr = ["debug", "info", "warn", "error"]
            if (!this.levelArr.includes(level)) {
                throw new LogLevelError("日志级别错误");
            }
            this.level = level;
        }

        isOut(level) {
            let curLevel = this.getLogLevel(level);
            let sysLevel = this.getLogLevel(this.level);
            return curLevel >= sysLevel;
        }

        getLogLevel(level) {
            for (let i = 0; i < this.levelArr.length; i++) {
                if (level === this.levelArr[i]) {
                    return i;
                }
            }

            throw new LogLevelError("错误的日志级别");
        }

        log(str, curLevel, style, ...structObject) {
            if (!this.isOut(curLevel)) {
                return;
            }

            if (curLevel!=='debug'){
                console.log(`%c${str}`, style, ...structObject);
                return;
            }

            // 日志级别为debug时：获取堆栈跟踪信息
            const stackTrace = new Error().stack;
            // 获取调用位置的堆栈行
            // 在开发者工具中输出格式：[文件名:行号] 日志内容
            const fileLineNumberInfo = stackTrace.split('\n')[3];

            console.log(`%c${str}`, style, ...structObject, `\n\n${fileLineNumberInfo}`);
            // 格式例子：
            // 字符串key 结构化对象
            //
            //     at http://localhost:63343/lead_note/lib/test-js.js:14:8
        }


        debug(str, ...data) {
            let curLevel = "debug";
            let color = "#e39e4a";
            let style = "color: " + color + ";font-size: 16px;";
            this.log(str, curLevel, style, ...data);
        }

        info(str, ...data) {
            let curLevel = "info";
            let color = "#07b4a6";
            let style = "color: " + color + ";font-size: 16px;";
            this.log(str, curLevel, style, ...data);
        }

        warn(str, ...data) {
            let curLevel = "warn";
            let color = "#f9f400";
            let style = "color: " + color + ";font-size: 16px;";
            this.log(str, curLevel, style, ...data);
        }

        error(str, ...data) {
            let curLevel = "error";
            let color = "#f3063f";
            let style = "color: " + color + ";font-size: 16px;";
            this.log(str, curLevel, style, ...data);
        }

    }


    let instance = null;
    return {
        log(level) {
            if (!instance) {
                instance = new Logger(level);
            }
            return instance;
        }
    }
})();