import type { Handler, MessageArgs, MessageHandler, MessageId } from '../utils/types'
import { logInfo, setLogging, warn } from '../utils/logging'
import { context, source } from '../utils/env'

// ---------------------------------------------------------------------------------------------------------------------
// common
// ---------------------------------------------------------------------------------------------------------------------

type Payload = {
  handlerId?: string
  messageId?: number
  error?: unknown
  args?: any[]
}

function postMessage (payload: Payload) {
  logInfo('Sending:', payload)
  source === 'UI'
    ? parent.postMessage({ pluginMessage: payload }, '*')
    : figma.ui.postMessage(payload)
}

// ---------------------------------------------------------------------------------------------------------------------
// sending
// ---------------------------------------------------------------------------------------------------------------------

type ResolverId = number

let lastId: ResolverId = 0

const resolvers: Map<ResolverId, {
  resolve: Handler,
  reject: (error: unknown) => void,
}> = new Map()

/**
 * Send a message to the opposite process
 *
 * @param handlerId   An id which identifies the message's purpose
 * @param args        An optional list of arguments to send
 * @returns           Any value returned by the opposite process
 * @throws            Any error thrown by the opposite process
 */
async function send<T extends MessageHandler | undefined = undefined> (
  handlerId: T extends MessageHandler
    ? MessageId<T>
    : string,
  ...args: T extends MessageHandler
    ? MessageArgs<T>
    : any[]
): Promise<T extends MessageHandler
  ? ReturnType<T>
  : any> {
  return new Promise((resolve, reject) => {
    // response
    const messageId = ++lastId
    resolvers.set(messageId, { resolve, reject })

    // request
    const payload: Payload = { args, handlerId, messageId }
    postMessage(payload)
  })
}

// ---------------------------------------------------------------------------------------------------------------------
// receiving
// ---------------------------------------------------------------------------------------------------------------------

let messageHandler: MessageHandler | undefined

function defaultHandler () {
  warn('No registered message handler! Call ipc.init() before use')
}

/**
 * Initialise the service and attach a message handler
 *
 * @param handler   A function to handle incoming messages
 * @param logging   An optional development flag to log incoming and  outgoing messages
 */
function init (handler?: MessageHandler, logging = false) {
  messageHandler = handler
  setLogging(logging)
}

context.onmessage = function onMessage (event: MessageEvent) {
  // variables
  const payload: Payload = source === 'UI'
    ? event.data?.pluginMessage || event.data
    : event
  const { args = [], error, handlerId, messageId } = payload

  // call
  logInfo('Receiving:', payload)
  if (handlerId) {
    const handler = messageHandler || defaultHandler
    const resolve = (...args: any[]) => postMessage({ args, messageId })
    const reject = (e: unknown) => {
      const error = e instanceof Error
        ? { type: e.constructor.name, message: e.message }
        : e
      postMessage({ error, messageId })
    }
    try {
      const result = handler(handlerId, ...args)
      result instanceof Promise
        ? result
          .then(resolve)
          .catch(reject)
        : resolve(result)
    }
    catch (err) {
      reject(err)
    }
  }

  // reply
  else if (messageId) {
    const resolver = resolvers.get(messageId)
    if (resolver) {
      resolvers.delete(messageId)
      error
        ? resolver.reject(error)
        : resolver.resolve(...args)
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// exports
// ---------------------------------------------------------------------------------------------------------------------

export {
  init,
  send,
}
