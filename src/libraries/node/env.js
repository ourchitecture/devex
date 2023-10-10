export const hasKey = (key) => {
    return key in process.env
}

export const assertRequired = (key) => {
    if (!hasKey(key)) {
        throw new Error(`Missing required environment variable "${key}"`)
    }
}

export const get = (key) => {
    return process.env[key]
}

export const getAsBoolean = (key) => {
    if (hasKey(key) && process.env[key]) {
        return JSON.parse(process.env[key]) ? true : false
    }

    return false
}

export const getRequired = (key) => {
    assertRequired(key)
    return process.env[key]
}

export const isContinuousIntegrationMode = () => {
    return getAsBoolean('CI') === true
}

export const isDebugMode = () => {
    return getAsBoolean('DEBUG') === true
}

export const isProductionMode = () => {
    return get('NODE_ENV') === 'production'
}

export const isNonProductionMode = () => {
    return !isProductionMode()
}
