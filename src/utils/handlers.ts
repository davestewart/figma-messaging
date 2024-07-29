import { Handler, NestedHandlers } from './types'

/**
 * Traverse a hash of handlers and pass the path and handler for each to a callback
 *
 * @param handlers    A nested hash of handlers
 * @param callback    A callback function to process the handlerId and handler
 * @param delimiter   An optional delimiter, defaults to '/'
 */
export function traverseHandlers (handlers: NestedHandlers, callback: (handlerId: string, handler: Handler) => void, delimiter = '/') {
  function traverse (handlers: NestedHandlers, _prefix = '') {
    for (const [name, handler] of Object.entries(handlers)) {
      const handlerId = _prefix
        ? `${_prefix}${delimiter}${name}`
        : name
      if (handler && typeof handler === 'object') {
        traverse(handler, handlerId)
      }
      else if (typeof handler === 'function') {
        callback(handlerId, handler)
      }
    }
  }

  traverse(handlers)
}
