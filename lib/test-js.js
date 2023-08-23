let logger = Logger.log("debug")

let student = {
    "name": "张三",
    "age": 20,
}


logger.debug("debug")
logger.debug("debug", student)
logger.debug("debug", student, student, [1,2,3])

logger.info("info")
logger.info("info", student)

logger.warn("warn")
logger.warn("warn", student)

logger.error("error")
logger.error("error", student)