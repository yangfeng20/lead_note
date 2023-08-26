let logger = Logger.log("error")

let student = {
    "name": "张三",
    "age": 20,
}


logger.debug("debug", student)
logger.debug("这是数据比较多的时候")
logger.debug("debug", student, student, [1,2,3])

logger.info("info")
logger.info("这是数据比较多的时候", student)

logger.warn("warn")
logger.warn("这是数据比较多的时候", student)

logger.error("error")
logger.error("这是数据比较多的时候", student)