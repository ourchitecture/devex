import { URL } from 'url'

import which from 'which'

import * as cmd from '../../../libraries/node/cmd.js'
import * as host from '../../../libraries/node/host.js'
import * as log from '../../../libraries/node/log.js'

const __filename = new URL('', import.meta.url).pathname

const cleanEngineVersion = (engineVersion) => {
    // TODO: search for a npm package that enables smarter version comparisons
    return engineVersion.replace(/[<=>]/g, '')
}

const main = async (scriptFilePath) => {
    await host.loadDotenv()

    log.registerLoggerSingleton(scriptFilePath)

    log.info('Checking versions...')

    const results = []

    const nodePackageFilePath = host.getRelativeToRootPath('./package.json')
    const nodePackageInfo = await host.readJson(nodePackageFilePath)

    const backstagePackageFilePath = host.getRelativeToRootPath(
        './src/backstage/ourstage/package.json'
    )
    const backstagePackageInfo = await host.readJson(backstagePackageFilePath)

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
        expectedNodePackageNpmVersion,
        expectedBackstagePackageNpmVersion,
        npmVersionFilePath,
        expectedNpmVersion,
        actualNpmCommandPath,
        actualNpmVersion,
    })

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

    const expectedBackstagePackageYarnVersion = cleanEngineVersion(
        backstagePackageInfo.engines.yarn
    )
    const actualYarnCommandPath = (await which('yarn')).trim()
    const actualYarnVersion = (
        await cmd.runWithProgressAndExpectStdOutCommand('yarn', ['--version'])
    ).trim()

    log.debug('yarn command versions', {
        expectedBackstagePackageYarnVersion,
        actualYarnCommandPath,
        actualYarnVersion,
    })

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

    const expectedNodePackagePnpmVersion = cleanEngineVersion(
        nodePackageInfo.engines.pnpm
    )
    const pnpmVersionFilePath = host.getRelativeToRootPath('./.pnpmrc')
    const expectedPnpmVersion = (
        await host.readFile(pnpmVersionFilePath)
    ).trim()
    const actualPnpmCommandPath = (await which('pnpm')).trim()
    const actualPnpmVersion = (
        await cmd.runWithProgressAndExpectStdOutCommand('pnpm', ['--version'])
    ).trim()

    log.debug('npm command versions', {
        expectedNodePackagePnpmVersion,
        pnpmVersionFilePath,
        expectedPnpmVersion,
        actualPnpmCommandPath,
        actualPnpmVersion,
    })

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

    log.info('Successfully checked versions.')
}

main(__filename).then({})
