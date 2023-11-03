// TODO: check for python and pip versions
// TODO: optionally output pnpm, yarn, and python (requirements.txt) dependency available upgrades

import { URL } from 'url'

import Box from 'cli-box'
import chalk from 'chalk'
import latestVersion from 'latest-version'
import semver from 'semver'
import which from 'which'

import * as cmd from '../../../libraries/node/cmd.js'
import * as host from '../../../libraries/node/host.js'
import * as log from '../../../libraries/node/log.js'

const __filename = new URL('', import.meta.url).pathname

const cleanEngineVersion = (engineVersion) => {
    // TODO: search for a npm package that enables smarter version comparisons
    return engineVersion.replace(/[<=>]/g, '')
}

const checkNodeVersions = async (
    nodePackageFilePath,
    nodePackageInfo,
    backstagePackageFilePath,
    backstagePackageInfo
) => {
    if (!nodePackageInfo.engines || !nodePackageInfo.engines.node) {
        const missingEngineError = `Missing expected configuration "engines.node" key in file "${nodePackageFilePath}".`
        log.error(missingEngineError)
        throw new Error(missingEngineError)
    }

    if (!backstagePackageInfo.engines || !backstagePackageInfo.engines.node) {
        const missingEngineError = `Missing expected configuration "engines.node" key in file "${backstagePackageFilePath}".`
        log.error(missingEngineError)
        throw new Error(missingEngineError)
    }

    const nvmVersionFilePath = host.getRelativeToRootPath('./.nvmrc')
    const expectedNvmVersion = (await host.readFile(nvmVersionFilePath))
        .trim()
        .replace(/^[v]/, '')

    const expectedNodePackageNodeVersion = cleanEngineVersion(
        nodePackageInfo.engines.node
    )
    const expectedBackstagePackageNodeVersion = cleanEngineVersion(
        backstagePackageInfo.engines.node
    )
    const actualNodeCommandPath = (await which('node')).trim()
    const actualNodeVersion = (
        await cmd.runWithProgressAndExpectStdOutCommand('node', ['--version'])
    )
        .trim()
        .replace(/^[v]/, '')

    log.debug('node command versions', {
        nvmVersionFilePath,
        expectedNvmVersion,
        nodePackageFilePath,
        expectedNodePackageNodeVersion,
        backstagePackageFilePath,
        expectedBackstagePackageNodeVersion,
        actualNodeCommandPath,
        actualNodeVersion,
    })

    if (expectedNvmVersion !== expectedNodePackageNodeVersion) {
        log.error('Found incompatible node versions between two files', {
            expectedNvmVersion,
            nvmVersionFilePath,
            expectedNodePackageNodeVersion,
            nodePackageFilePath,
        })
        throw new Error(
            `The node versions do not match from the files "${nvmVersionFilePath}"
        with version "${expectedNvmVersion}" and "${nodePackageFilePath}"
        with version "${expectedNodePackageNodeVersion}".`
        )
    }

    if (
        expectedNodePackageNodeVersion !== expectedBackstagePackageNodeVersion
    ) {
        log.error('Found incompatible node versions between two files', {
            expectedNodePackageNodeVersion,
            nodePackageFilePath,
            expectedBackstagePackageNodeVersion,
            backstagePackageFilePath,
        })
        throw new Error(
            `The node versions do not match from the files "${nodePackageFilePath}"
        with version "${expectedNodePackageNodeVersion}" and
        "${backstagePackageFilePath}" with version
        "${expectedBackstagePackageNodeVersion}".`
        )
    }

    if (expectedNodePackageNodeVersion !== actualNodeVersion) {
        log.error('Expected node version was not the actual version', {
            expectedNodePackageNodeVersion,
            nodePackageFilePath,
            actualNodeCommandPath,
            actualNodeVersion,
        })
        throw new Error(
            `The expected node version "${expectedNodePackageNodeVersion}"
        does not match from "${nodePackageFilePath}" and the actual
        version "${actualNodeVersion}".`
        )
    }
}

const checkNpmVersions = async (
    nodePackageFilePath,
    nodePackageInfo,
    backstagePackageFilePath,
    backstagePackageInfo
) => {
    if (!nodePackageInfo.engines || !nodePackageInfo.engines.npm) {
        const missingEngineError = `Missing expected configuration "engines.npm" key in file "${nodePackageFilePath}".`
        log.error(missingEngineError)
        throw new Error(missingEngineError)
    }

    if (!backstagePackageInfo.engines || !backstagePackageInfo.engines.npm) {
        const missingEngineError = `Missing expected configuration "engines.npm" key in file "${backstagePackageFilePath}".`
        log.error(missingEngineError)
        throw new Error(missingEngineError)
    }

    const latestNpmVersion = await latestVersion('npm')

    const expectedNodePackageNpmVersion = cleanEngineVersion(
        nodePackageInfo.engines.npm
    )
    const expectedBackstagePackageNpmVersion = cleanEngineVersion(
        backstagePackageInfo.engines.npm
    )
    const npmVersionFilePath = host.getRelativeToRootPath('./.npmrc')
    const expectedNpmVersion = (await host.readFile(npmVersionFilePath)).trim()
    const actualNpmCommandPath = (await which('npm')).trim()
    const actualNpmVersion = (
        await cmd.runWithProgressAndExpectStdOutCommand('npm', ['--version'])
    ).trim()

    log.debug('npm command versions', {
        latestNpmVersion,
        expectedNodePackageNpmVersion,
        expectedBackstagePackageNpmVersion,
        npmVersionFilePath,
        expectedNpmVersion,
        actualNpmCommandPath,
        actualNpmVersion,
    })

    const isNewVersionAvailable = semver.gt(latestNpmVersion, actualNpmVersion)

    if (isNewVersionAvailable) {
        log.warn(
            `Update available for npm! ${actualNpmVersion} → ${latestNpmVersion}`
        )
        const purple = chalk.hex('800080')
        const updateBox = Box(
            '60x5',
            `Update available for npm! ${chalk.red(
                actualNpmVersion
            )} → ${chalk.green(latestNpmVersion)}\n
            Run "${purple('npm install --location=global npm')}" to update.`
        )
        console.log(updateBox.toString())
    }

    if (expectedNodePackageNpmVersion !== expectedNpmVersion) {
        log.error('Found incompatible npm versions between two files', {
            expectedNodePackageNpmVersion,
            nodePackageFilePath,
            expectedNpmVersion,
            npmVersionFilePath,
        })
        throw new Error(
            `The npm versions do not match from the files "${nodePackageFilePath}"
      with version "${expectedNodePackageNpmVersion}" and
      "${npmVersionFilePath}" with version "${expectedNpmVersion}".`
        )
    }

    if (expectedNodePackageNpmVersion !== expectedBackstagePackageNpmVersion) {
        log.error('Found incompatible npm versions between two files', {
            expectedNodePackageNpmVersion,
            nodePackageFilePath,
            expectedBackstagePackageNpmVersion,
            backstagePackageFilePath,
        })
        throw new Error(
            `The npm versions do not match from the files "${nodePackageFilePath}"
      with version "${expectedNodePackageNpmVersion}" and
      "${backstagePackageFilePath}" with version
      "${expectedBackstagePackageNpmVersion}".`
        )
    }

    if (expectedNodePackageNpmVersion !== actualNpmVersion) {
        log.error('Expected npm version was not the actual version', {
            expectedNodePackageNpmVersion,
            nodePackageFilePath,
            actualNpmCommandPath,
            actualNpmVersion,
        })
        throw new Error(
            `The expected npm version "${expectedNodePackageNpmVersion}"
      does not match from "${nodePackageFilePath}" and the actual
      version "${actualNpmVersion}".`
        )
    }
}

const checkYarnVersions = async (
    backstagePackageFilePath,
    backstagePackageInfo
) => {
    if (!backstagePackageInfo.engines || !backstagePackageInfo.engines.yarn) {
        const missingEngineError = `Missing expected configuration "engines.yarn" key in file "${backstagePackageFilePath}".`
        log.error(missingEngineError)
        throw new Error(missingEngineError)
    }

    if (!backstagePackageInfo.packageManager) {
        const missingPackageManagerError = `Missing expected configuration "packageManager" key in file "${backstagePackageFilePath}".`
        log.error(missingPackageManagerError)
        throw new Error(missingPackageManagerError)
    }

    const latestYarnVersion = await latestVersion('yarn')

    const expectedBackstagePackageYarnVersion = cleanEngineVersion(
        backstagePackageInfo.engines.yarn
    )

    const expectedNodePackageManager = `yarn@${expectedBackstagePackageYarnVersion}`

    if (backstagePackageInfo.packageManager != expectedNodePackageManager) {
        const unexpectedPackageManagerError = `Expected node configuration key "packageManager" to have a value of "${expectedNodePackageManager}" in file "${backstagePackageFilePath}".`
        log.error(unexpectedPackageManagerError)
        throw new Error(unexpectedPackageManagerError)
    }

    const actualYarnCommandPath = (await which('yarn')).trim()
    const actualYarnVersion = (
        await cmd.runWithProgressAndExpectStdOutCommand('yarn', ['--version'])
    ).trim()

    log.debug('yarn command versions', {
        expectedBackstagePackageYarnVersion,
        actualYarnCommandPath,
        actualYarnVersion,
    })

    const isNewVersionAvailable = semver.gt(
        latestYarnVersion,
        actualYarnVersion
    )

    if (isNewVersionAvailable) {
        log.warn(
            `Update available for yarn! ${actualYarnVersion} → ${latestYarnVersion}`
        )
        const purple = chalk.hex('800080')
        const updateBox = Box(
            '60x5',
            `Update available for yarn! ${chalk.red(
                actualYarnVersion
            )} → ${chalk.green(latestYarnVersion)}\n
            Run "${purple('npm install --location=global yarn')}" to update.`
        )
        console.log(updateBox.toString())
    }

    if (expectedBackstagePackageYarnVersion !== actualYarnVersion) {
        log.error('Expected yarn version was not the actual version', {
            expectedBackstagePackageYarnVersion,
            backstagePackageFilePath,
            actualYarnCommandPath,
            actualYarnVersion,
        })
        throw new Error(
            `The expected yarn version "${expectedBackstagePackageYarnVersion}"
      does not match from "${backstagePackageFilePath}" and the actual
      version "${actualYarnVersion}".`
        )
    }
}

const checkPnpmVersions = async (nodePackageFilePath, nodePackageInfo) => {
    if (!nodePackageInfo.engines || !nodePackageInfo.engines.pnpm) {
        const missingEngineError = `Missing expected configuration "engines.pnpm" key in file "${nodePackageFilePath}".`
        log.error(missingEngineError)
        throw new Error(missingEngineError)
    }

    if (!nodePackageInfo.packageManager) {
        const missingPackageManagerError = `Missing expected configuration "packageManager" key in file "${nodePackageFilePath}".`
        log.error(missingPackageManagerError)
        throw new Error(missingPackageManagerError)
    }

    const latestPnpmVersion = await latestVersion('pnpm')

    const expectedNodePackagePnpmVersion = cleanEngineVersion(
        nodePackageInfo.engines.pnpm
    )

    const expectedNodePackageManager = `pnpm@${expectedNodePackagePnpmVersion}`

    if (nodePackageInfo.packageManager != expectedNodePackageManager) {
        const unexpectedPackageManagerError = `Expected node configuration key "packageManager" to have a value of "${expectedNodePackageManager}" in file "${nodePackageFilePath}".`
        log.error(unexpectedPackageManagerError)
        throw new Error(unexpectedPackageManagerError)
    }

    const pnpmVersionFilePath = host.getRelativeToRootPath('./.pnpmrc')
    const expectedPnpmVersion = (
        await host.readFile(pnpmVersionFilePath)
    ).trim()
    const actualPnpmCommandPath = (await which('pnpm')).trim()
    const actualPnpmVersion = (
        await cmd.runWithProgressAndExpectStdOutCommand('pnpm', ['--version'])
    ).trim()

    log.debug('pnpm command versions', {
        expectedNodePackagePnpmVersion,
        pnpmVersionFilePath,
        expectedPnpmVersion,
        actualPnpmCommandPath,
        actualPnpmVersion,
    })

    const isNewVersionAvailable = semver.gt(
        latestPnpmVersion,
        actualPnpmVersion
    )

    if (isNewVersionAvailable) {
        log.warn(
            `Update available for npm! ${actualPnpmVersion} → ${latestPnpmVersion}`
        )
        const purple = chalk.hex('800080')
        const updateBox = Box(
            '60x5',
            `Update available for pnpm! ${chalk.red(
                actualPnpmVersion
            )} → ${chalk.green(latestPnpmVersion)}\n
            Run "${purple('npm install --location=global pnpm')}" to update.`
        )
        console.log(updateBox.toString())
    }

    if (expectedNodePackagePnpmVersion !== expectedPnpmVersion) {
        log.error('Found incompatible pnpm versions between two files', {
            expectedNodePackagePnpmVersion,
            nodePackageFilePath,
            expectedPnpmVersion,
            pnpmVersionFilePath,
        })
        throw new Error(
            `The pnpm versions do not match from the files "${nodePackageFilePath}"
      with version "${expectedNodePackagePnpmVersion}" and
      "${pnpmVersionFilePath}" with version "${expectedPnpmVersion}".`
        )
    }

    if (expectedNodePackagePnpmVersion !== actualPnpmVersion) {
        log.error('Expected pnpm version was not the actual version', {
            expectedNodePackagePnpmVersion,
            nodePackageFilePath,
            actualPnpmCommandPath,
            actualPnpmVersion,
        })
        throw new Error(
            `The expected pnpm version "${expectedNodePackagePnpmVersion}" does not
      match from "${nodePackageFilePath}" and the actual version
      "${actualPnpmVersion}".`
        )
    }
}

const main = async (scriptFilePath) => {
    await host.loadDotenv()

    log.registerLoggerSingleton(scriptFilePath)

    log.info('Checking versions...')

    const nodePackageFilePath = host.getRelativeToRootPath('./package.json')
    const nodePackageInfo = await host.readJson(nodePackageFilePath)

    const backstagePackageFilePath = host.getRelativeToRootPath(
        './src/backstage/ourstage/package.json'
    )
    const backstagePackageInfo = await host.readJson(backstagePackageFilePath)

    await checkNodeVersions(
        nodePackageFilePath,
        nodePackageInfo,
        backstagePackageFilePath,
        backstagePackageInfo
    )

    await checkNpmVersions(
        nodePackageFilePath,
        nodePackageInfo,
        backstagePackageFilePath,
        backstagePackageInfo
    )

    await checkYarnVersions(backstagePackageFilePath, backstagePackageInfo)

    await checkPnpmVersions(nodePackageFilePath, nodePackageInfo)

    log.info('Successfully checked versions.')
}

main(__filename).then({})
