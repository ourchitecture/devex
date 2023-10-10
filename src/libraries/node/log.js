import winston from 'winston'

import * as env from './env.js'
import * as host from './host.js'

let logger

const ansiRegex = ({ onlyFirst = false } = {}) => {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
    ].join('|')

    return new RegExp(pattern, onlyFirst ? undefined : 'g')
}

const escapeAnsiRegex = ansiRegex()

export const log = (level, message, metadata) => {
    if (!logger) {
        throw new Error(
            'Missing registered logger singleton. Did you forget to call `registerNamedLoggerSingleton`?'
        )
    }

    const winstonMetadata = Array.isArray(metadata)
        ? metadata.length === 0
            ? {}
            : metadata.length === 1
            ? metadata[0]
            : { argv: metadata }
        : metadata

    const cleanMessage = message.replace(escapeAnsiRegex, '')

    logger.log(level, cleanMessage, winstonMetadata)
}

export const debug = (message, ...args) => log('debug', message, args)
export const info = (message, ...args) => log('info', message, args)
export const warn = (message, ...args) => log('warn', message, args)
export const error = (message, ...args) => log('error', message, args)

export const registerLoggerSingleton = (scriptFilePath) => {
    const scriptRelativeFilePath = host.getRelativeToRootPath(scriptFilePath)
    const outputDirectoryPath = host.getTaskOutputDirectoryPath(scriptFilePath)
    const cleanId = scriptRelativeFilePath.replace(/[\\.]/gi, '-')
    const logFileName = `${outputDirectoryPath}output.log`
    const errorLogFileName = `${outputDirectoryPath}error.log`

    if (logger) {
        return logger
    }

    logger = winston.createLogger({
        level: env.isDebugMode() ? 'debug' : 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        defaultMeta: { id: cleanId },
        transports: [
            //
            // - Write all logs with importance level of `error` or less to `error.log`
            // - Write all logs with importance level of `info` or less to `output.log`
            //
            new winston.transports.File({
                filename: errorLogFileName,
                level: 'error',
            }),
            new winston.transports.File({ filename: logFileName }),
        ],
    })

    if (env.isNonProductionMode()) {
        logger.add(
            new winston.transports.Console({
                format: winston.format.simple(),
            })
        )
    }

    return logger
}
