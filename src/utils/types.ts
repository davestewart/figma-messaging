/**
 * Top-level message handler which points to a route handler
 */
export type MessageHandler = (handlerId: string | any, ...args: any[]) => any

/**
 * Generic type to extract the handlerId from a message handler
 */
export type MessageId<T extends MessageHandler> = Parameters<T>[0]

/**
 * Generic type to extract the handler arguments from a message handler
 */
export type MessageArgs<T extends MessageHandler> = Parameters<T> extends [string, ...infer R]
  ? R
  : []

/**
 * A callable handler at the end of a route
 */
export type Handler = (...args: any[]) => any

/**
 * A Hash of handlers
 */
export type Handlers = {
  [key: string]: Handler;
}

/**
 * A nested hash of route handlers
 */
export type NestedHandlers = {
  [key: string]: NestedHandlers | Handler;
};
