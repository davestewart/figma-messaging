import type { Handler, Handlers, MessageHandler } from '../utils/types'
import { makeLooseFlatCaller as makeCaller } from '../utils/messaging'
import { traverseHandlers } from '../utils/handlers'
import * as ipc from './ipc'

/**
 * Bus error
 */
class BusError extends Error {}

/**
 * Bus options
 *
 * @property  fallback  An optional handler to receive calls to non-existent paths
 * @property  logging   An optional boolean to log sending and receiving calls in the console
 */
type BusOptions = {
  fallback?: MessageHandler
  logging?: boolean
}

/**
 * Create a Bus object to send and receive messages to and from Figma Main and UI processes
 *
 * @param handlers            An optional hash of handlers to be called from the other process
 * @param options             An optional hash of options to modify the behaviour of the bus
 */
export function makeBus <T extends Handlers | undefined = undefined> (handlers?: Handlers, options?: BusOptions) {

  const handlerMap: Map<string, Handler> = new Map()

  function onMessage (handlerId: string, ...args: any[]): any {
    const handler = handlerMap.get(handlerId)
    if (handler) {
      return handler(...args)
    }
    if (options?.fallback) {
      return options.fallback(handlerId, ...args)
    }
    throw new BusError(`No handler for path "${handlerId}"`)
  }

  /**
   * Add one or more handlers for incoming messages
   *
   * @param handlerId
   * @param listener
   */
  function on (handlerId: string, listener: Handler): void
  function on (handlers: Handlers): void
  function on (handlerId: string | Handlers, listener?: Handler): void {
    // single handler
    if (typeof handlerId === 'string' && typeof listener === 'function') {
      handlerMap.set(handlerId, listener)
    }

    // hash of handlers
    else if (handlerId && typeof handlerId === 'object') {
      traverseHandlers(handlerId, on)
    }
  }

  /**
   * Remove one or more handlers for incoming messages
   *
   * @param handlerId
   */
  function off (handlerId: string | true) {
    if (typeof handlerId === 'string') {
      handlerMap.delete(handlerId)
    }
    else {
      Object
        .keys(handlerMap)
        .forEach((handlerId: string) => off(handlerId))
    }
  }

  /**
   * Call a handler in the opposite process
   */
  function _call (handlerId: string, ...args: any[]) {
    return ipc.send(handlerId, ...args)
  }

  // typed call
  const call = makeCaller<T>(_call)

  // attach route handlers
  if (handlers) {
    on(handlers)
  }

  // init message handler
  ipc.init(onMessage, options?.logging)

  // return
  return {
    on,
    off,
    call,
  }
}

export type Bus = ReturnType<typeof makeBus>
