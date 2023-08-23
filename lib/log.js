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

        log(str, curLevel, style, structObject) {
            if (!this.isOut(curLevel)) {
                return;
            }

            if (structObject) {
                console.log("%c----------------", style)
            }
            console.log("%c" + str, style)
            if (structObject) {
                console.log(structObject)
                console.log("%c----------------", style)
            }
        }


        debug(str, data) {
            let curLevel = "debug";
            let color = "#e39e4a";
            let style = "color: " + color + ";font-size: 16px;";
            this.log(str, curLevel, style, data);
        }

        info(str, data) {
            let curLevel = "info";
            let color = "#07b4a6";
            let style = "color: " + color + ";font-size: 16px;";
            this.log(str, curLevel, style, data);
        }

        warn(str, data) {
            let curLevel = "warn";
            let color = "#f9f400";
            let style = "color: " + color + ";font-size: 16px;";
            this.log(str, curLevel, style, data);
        }

        error(str, data) {
            let curLevel = "error";
            let color = "#f3063f";
            let style = "color: " + color + ";font-size: 16px;";
            this.log(str, curLevel, style, data);
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





// --------------------- test --------------------------
class Student {
    constructor() {
        this.name = "张三"
        this.age = 12
    }
}


let logger = Logger.log()
logger.debug("测试debug")
logger.info("测试info", new Student())
logger.warn("测试warn")
logger.error("测试error")
logger.error("error:", new Student())

