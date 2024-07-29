import { source } from './env'

let logging = false

export function setLogging (state: boolean) {
  logging = state
}

const leader = `[ipc][${source.toLowerCase()}]`

export function log (message: string, ...args: any[]) {
  console.info(`%c${leader} ${message}`, 'color: #009CE1; font-weight: 500', ...args)
}

export function warn (message: string, ...args: any[]) {
  console.warn(`${leader} ${message}`, ...args)
}

export function logInfo (message: string, ...args: any[]) {
  if (logging) {
    warn(message, ...args)
  }
}
