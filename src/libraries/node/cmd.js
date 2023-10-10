import util from 'node:util'
import {
    exec as execClassic,
    execFile as execFileClassic,
} from 'node:child_process'

import * as log from './log.js'

const execFile = util.promisify(execFileClassic)

export const getStdOutAndOrStdErr = (stdout, stderr) => {
    // not really sure what else to do here, especially when the exitCode is zero
    if (stdout && stderr) {
        return String(stdout) + '\n\n' + String(stderr)
    }

    if (stderr) {
        return String(stderr)
    }

    return String(stdout)
}

export const runWithProgress = async (cmd, argv, onStdOut, onStdErr) => {
    return new Promise((resolve, reject) => {
        let stdout = '',
            stderr = '',
            exitCode = 0

        try {
            const fullCommand = cmd + (argv ? ' ' + argv.join(' ') : '')

            const isSensitiveCommand =
                fullCommand.toLocaleLowerCase().indexOf('password') >= 0

            const logSafeCommand = isSensitiveCommand
                ? `Executing a command "${cmd}" that possibly contains sensitive information. The full command will be hidden.`
                : fullCommand

            log.debug(logSafeCommand)

            const childProcess = execClassic(fullCommand)
            // BUG: Windows cannot find certain files
            // const childProcess = execFileClassic(cmd, argv ? argv : [])

            childProcess.stdout.on('data', (childProcessStdOut) => {
                stdout += childProcessStdOut

                if (onStdOut) {
                    onStdOut(childProcessStdOut)
                }
            })

            childProcess.stderr.on('data', (childProcessStdErr) => {
                stderr += childProcessStdErr

                if (onStdErr) {
                    onStdErr(childProcessStdErr)
                }
            })

            childProcess.on('close', (childProcessExitCode) => {
                exitCode = childProcessExitCode

                if (exitCode === 0) {
                    resolve({ stdout, stderr, exitCode, error: undefined })
                } else {
                    log.error('Unexpected exit code during command execution', {
                        fullCommand: logSafeCommand,
                        stdout,
                        stderr,
                        exitCode,
                    })

                    resolve({ stdout, stderr, exitCode, error: undefined })
                }
            })
        } catch (e) {
            log.error('Unexpected error during command execution', {
                fullCommand: logSafeCommand,
                error: JSON.stringify(e),
                stdout,
                stderr,
                exitCode,
            })

            resolve({ stdout, stderr, exitCode, error: e })
        }
    })
}

export const expectStdOut = (error, exitCode, stdout, stderr) => {
    if (error) {
        throw error
    }

    // IMPORTANT: many commands use "stderr" for normal output
    // if (stderr) throw new Error(`Error running command: ${cmd}\n\n${stderr}`)

    if (exitCode !== 0) {
        throw new Error(
            `Non-zero exit code with additional detail:` +
                (stdout && stdout.length > 0 ? `\n\n${stdout}` : '') +
                (stderr && stderr.length > 0 ? `\n\n${stderr}` : '')
        )
    }

    return getStdOutAndOrStdErr(stdout, stderr)
}

export const runWithProgressAndExpectStdOutCommand = async (
    cmd,
    argv,
    onStdOut,
    onStdErr
) => {
    const { exitCode, error, stdout, stderr } = await runWithProgress(
        cmd,
        argv,
        onStdOut,
        onStdErr
    )

    return expectStdOut(error, exitCode, stdout, stderr)
}

export const runWithProgressAndExpectStdErrCommand = async (cmd, argv) => {
    const { exitCode, error, stdout, stderr } = await runWithProgress(cmd, argv)

    if (error) {
        throw error
    }

    return {
        stdout: stdout ? String(stdout) : '',
        stderr: stderr ? String(stderr) : '',
        exitCode,
    }
}

export const runCommand = async (cmd, argv) => {
    const fullCommand = cmd + (argv ? ' ' + argv.join(' ') : '')

    log.debug(fullCommand)

    let exitCode
    let commandStdOut
    let commandStdErr
    let err

    try {
        const { stdout, stderr } = await execFile(cmd, argv ? argv : [])
        exitCode = 0
        commandStdOut = stdout
        commandStdErr = stderr
    } catch (e) {
        // capture errors for return (functional style)
        err = e

        if (e.code) {
            exitCode = e.code
        }

        if (e.stdout) {
            commandStdOut = e.stdout
        }

        if (e.stderr) {
            commandStdErr = e.stderr
        }
    }

    log.debug('Command result', {
        command: fullCommand,
        stdout: commandStdOut,
        stderr: commandStdErr,
        exitCode,
    })

    if (err || exitCode !== 0) {
        log.error('Command error', {
            command: fullCommand,
            error: err ? JSON.stringify(err) : '',
            stdout: commandStdOut,
            stderr: commandStdErr,
            exitCode,
        })
    }

    return {
        stdout: commandStdOut,
        stderr: commandStdErr,
        error: err,
        exitCode,
    }
}

export const runAndExpectStdOutCommand = async (cmd, argv) => {
    const { exitCode, error, stdout, stderr } = await runCommand(cmd, argv)

    if (error) throw error

    // IMPORTANT: many commands use "stderr" for normal output
    // if (stderr) throw new Error(`Error running command: ${cmd}\n\n${stderr}`);

    if (exitCode !== 0) {
        throw new Error(
            `Non-zero exit code without additional detail: ${cmd}\n\n${stdout}`
        )
    }

    if (stdout && stderr) {
        return String(stderr) + '\n' + String(stdout)
    }

    if (stderr) {
        return String(stderr)
    }

    return String(stdout)
}

export const runAndExpectStdErrCommand = async (cmd, argv) => {
    const { exitCode, error, stdout, stderr } = await runCommand(cmd, argv)

    if (error) throw error

    return { stdout: String(stdout), stderr: String(stderr), exitCode }
}
