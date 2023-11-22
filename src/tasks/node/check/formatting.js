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
    await host.loadDotenv()

    log.registerLoggerSingleton(scriptFilePath)

    log.info('Checking formatting...')

    await checkFormattingWithPrettier(scriptFilePath)

    await checkFormattingWithMarkdownlint(scriptFilePath)

    const ourStageYarnLockFilePath = host.getRelativeToRootPath(
        './src/backstage/ourstage/yarn.lock'
    )

    const ourStageYarnLockFileContent = await host.readFile(
        ourStageYarnLockFilePath
    )

    const localhostNexusNpmRegistryUrl =
        'http://localhost:8081/repository/npm-all/'

    const ourStageYarnLockFileContainsLocalhostRegistryReference =
        ourStageYarnLockFileContent.indexOf(localhostNexusNpmRegistryUrl) >= 0

    log.debug('Checking the yarn lock file for localhost registry usage...', {
        ourStageYarnLockFilePath,
        ourStageYarnLockFileContainsLocalhostRegistryReference,
        localhostNexusNpmRegistryUrl,
    })

    if (ourStageYarnLockFileContainsLocalhostRegistryReference) {
        log.warn(
            'The Ourstage yarn lockfile contains references to a localhost Nexus NPM registry URL that need to be replaced with the Yarn registry URL.'
        )

        const yarnRegistryUrl = 'https://registry.yarnpkg.com/'

        const cleanOurStageYarnLockFileContent =
            ourStageYarnLockFileContent.replaceAll(
                localhostNexusNpmRegistryUrl,
                yarnRegistryUrl
            )

        await host.writeFile(
            ourStageYarnLockFilePath,
            cleanOurStageYarnLockFileContent,
            { cleanAnsiCharacters: false }
        )

        log.info(
            'The Ourstage "yarn.lock" file has been updated with the Yarn registry URL. Commit the changed files and try again.'
        )
    }

    log.info('Successfully checked formatting.')
}

main(__filename).then({})
