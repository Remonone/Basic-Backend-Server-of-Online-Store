import moment from "moment"
import express from 'express'
import chalk from 'chalk'

// https://codesource.io/creating-a-logging-middleware-in-expressjs/

const getActualRequestDurationInMilliseconds = (start: [number, number]) => {
    const NS_PER_SEC = 1e9; // convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
  };
const logger_middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const date = moment(new Date()).format('YYYY.MM.DD hh:mm:ss')
    const method = req.method
    const url = req.url
    const status = res.statusCode
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    const ip = req.ip
    const log = chalk.green(`[${date}] ${method}: ${url} from ${ip} => ${status} -- ${durationInMilliseconds} ms`)
    console.log(log)
    next()
}

export default logger_middleware