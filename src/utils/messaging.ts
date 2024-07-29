import { Handlers, MessageHandler } from './types'

/**
 * Call flat handler with key or string
 */
export function makeLooseFlatCaller<T extends Handlers | undefined = undefined>(call: MessageHandler) {
  return async function <K extends keyof T | (string & {})>(
    handlerId: K,
    ...args: T extends Handlers
      ? K extends keyof T
        ? Parameters<T[K]>
        : any[]
      : any[]
  ): Promise<T extends Handlers
    ? K extends keyof T
      ? ReturnType<T[K]>
      : any
    : any> {
    return await call(handlerId as string, ...args) as any;
  }
}

/**
 * Call flat handler with key only
 */
export function makeFlatCaller<T extends Handlers | undefined = undefined>(call: MessageHandler) {
  return async function <K extends keyof T>(
    handlerId: K,
    ...args: T extends Handlers
      ? Parameters<T[K]>
      : any[]
  ): Promise<T extends Handlers
    ? ReturnType<T[K]>
    : any> {
    return await call(handlerId as string, ...args) as any;
  }
}
