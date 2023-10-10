import { URL } from 'url'

import * as cmd from '../../../libraries/node/cmd.js'
import * as env from '../../../libraries/node/env.js'
import * as host from '../../../libraries/node/host.js'
import * as log from '../../../libraries/node/log.js'

const __filename = new URL('', import.meta.url).pathname

const executePnpmCommand = async (
    scriptFilePath,
    commandLogFileName,
    isLogStdErrAsErrorEnabled,
    commandArgv
) => {
    const commandName = 'pnpm'
    let commandExitCode, commandStdOut, commandStdErr, commandError

    try {
        const { exitCode, stdout, stderr } = await cmd.runWithProgress(
            commandName,
            commandArgv,
            (stdout) => {
                log.info(stdout)
            },
            (stderr) => {
                if (isLogStdErrAsErrorEnabled) {
                    log.error(stderr)
                } else {
                    log.info(stderr)
                }
            }
        )

        commandExitCode = exitCode
        commandStdOut = stdout
        commandStdErr = stderr
    } catch (e) {
        commandError = e
    }

    const logFilePath = host.getTaskOutputFilePath(
        scriptFilePath,
        `./${commandLogFileName}`
    )

    await host.writeFile(
        logFilePath,
        cmd.getStdOutAndOrStdErr(commandStdOut, commandStdErr)
    )

    cmd.expectStdOut(
        commandError,
        commandExitCode,
        commandStdOut,
        commandStdErr
    )
}

const checkFormattingWithPrettier = async (scriptFilePath) => {
    const commandArgv = [
        'prettier',
        '--check',
        ...(env.isDebugMode()
            ? ['--log-level', 'debug']
            : ['--log-level', 'log']),
        '--config',
        host.getRelativeToRootPath('./.prettierrc.yaml'),
        '--ignore-path',
        host.getRelativeToRootPath('./.gitignore'),
        '--ignore-path',
        host.getRelativeToRootPath('./.prettierignore'),
        host.getRelativeToRootPath('./'),
    ]

    return await executePnpmCommand(
        scriptFilePath,
        'prettier.log',
        false, // prettier doesn't appear to use 'stderr'
        commandArgv
    )
}

const checkFormattingWithMarkdownlint = async (scriptFilePath) => {
    const commandArgv = [
        'markdownlint-cli2',
        '--config',
        host.getRelativeToRootPath('./.markdownlint-cli2.yaml'),
    ]

    return await executePnpmCommand(
        scriptFilePath,
        'markdownlint.log',
        true, // BUG: markdownlint seems to use 'stderr' for output
        commandArgv
    )
}

const main = async (scriptFilePath) => {
    log.registerLoggerSingleton(scriptFilePath)

    log.info('Checking formatting...')

    await checkFormattingWithPrettier(scriptFilePath)

    await checkFormattingWithMarkdownlint(scriptFilePath)

    log.info('Successfully checked formatting.')
}

;(async () => {
    await main(__filename)
})()
