import { URL } from 'url'

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

const __dirname = new URL('.', import.meta.url).pathname

const ansiRegex = ({ onlyFirst = false } = {}) => {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
    ].join('|')

    return new RegExp(pattern, onlyFirst ? undefined : 'g')
}

const escapeAnsiRegex = ansiRegex()

export const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export const pathExists = async (hostPath) => {
    try {
        fs.accessSync(hostPath, fs.constants.F_OK)
        return true
    } catch (e) {
        return false
    }
}

export const getPathName = (hostPath) => {
    return path.basename(hostPath).replace(path.extname(hostPath), '')
}

export const getCurrentWorkingDirectoryPath = () => {
    return __dirname
}

export const getRelativePath = (...args) => {
    return path.join(...args)
}

export const getRelativeToRootPath = (hostPath) => {
    const relativePath = path.relative(
        path.join(getCurrentWorkingDirectoryPath(), '../../../'),
        hostPath
    )

    return relativePath && relativePath.trim().length > 0 ? relativePath : './'
}

export const getProjectRootPath = () => {
    return path.join(getCurrentWorkingDirectoryPath(), '../../../')
}

export const deletePath = async (hostPath) => {
    return fs.promises.unlink(hostPath)
}

export const readFile = async (hostPath) => {
    return fs.promises.readFile(hostPath, { encoding: 'utf-8' })
}

export const readJson = async (hostPath) => {
    const content = await readFile(hostPath)
    return JSON.parse(content)
}

export const writeFile = async (
    hostPath,
    content,
    { cleanAnsiCharacters = true } = {}
) => {
    const cleanContent = cleanAnsiCharacters
        ? content.replace(escapeAnsiRegex, '')
        : content

    return fs.promises.writeFile(hostPath, cleanContent, { encoding: 'utf-8' })
}

export const writeJson = async (hostPath, value) => {
    const content = JSON.stringify(value)
    return await writeFile(hostPath, content)
}

export const loadDotenv = async () => {
    dotenv.config()
}

export const getTaskOutputDirectoryPath = (scriptFilePath) => {
    const relativeScriptPath = getRelativeToRootPath(scriptFilePath)
    return `./.task-output/${relativeScriptPath}/`
}

export const getTaskOutputFilePath = (scriptFilePath, relativeFilePath) => {
    const taskOutputFilePath = path.join(
        getTaskOutputDirectoryPath(scriptFilePath),
        `./${relativeFilePath}`
    )
    return taskOutputFilePath
}

export const mkdir = async (directoryPath, isRecursive) => {
    if (!(await pathExists(directoryPath))) {
        await fs.promises.mkdir(directoryPath, { recursive: isRecursive })
    }
}
