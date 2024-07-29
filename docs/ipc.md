# IPC

## Overview

The IPC service is a low-level inter-process communication service which provides:

- two-way communication between `main` and `ui` processes
- awaitable call and response
- catchable errors
- optional logging

*Generally, you'll only need to use the [Bus](bus.md) service, but know that the IPC service does the heavy lifting*

## Usage

To work with the IPC service, you'll need to import and initialise it in one or both processes.

The code for either process is looks something like this:

```ts
import { ipc } from 'figma messaging'

// receive messages
function onMessage (handlerId: string, ...args: any[]) {
  switch (handlerId) {
    case 'something':
      // do something
      console.log(handlerId, ...args)
      
      // return a result
      return true

    // fallback for unhandled ids
    default:
      // do something else
  }
}

// handle events
function onSomeEvent (data) {
  // send messages
  ipc.send('something-else', data)
    .then(result => {
      // do something with result
    })
  	.catch(err => {
    	// handle any errors
  	})
})

// attach listener to ipc
ipc.init(onMessage)
```

Note that every request comprises two parts:

- `handlerId`: a `string` to identity what the message intention is (such as `update` , `create`, or such like)
- `...args`: as many additional parameters that need to be sent (such as data, choices, or such like)

## Advanced

### IDE auto-complete

Note that `ipc.send()` is generic in order to provide IDE auto-complete if required.

```ts
// ui.tsx
function greet (handlerId: 'greet', salutation: 'hello' | 'hey' | 'yo') {
  return `${salutation} world!`
}
export Greet = typeof greet
```

```ts
// main.ts
import { ipc } from 'figma-messaging'
import type { Greet } from './ui'

ipc.send<Greet>('greet', 'yo').then(reply => {
  console.log(reply.length)
})
```

Generally though, it's simpler to just to pass raw data; the [Bus](bus.md) service has better and simpler overall support for typing.

### Error handling

The IPC service has built-in error handling.

Any uncaught errors thrown in the target process will be caught, serialised, sent back to the source process, and passed to the `send()` Promise's `reject` handler. 

## API

### Functions

#### ipc.init(handler, logging?)

> Initialise the service and attach a message handler 

Params:

- `handler`: `MessageHandler`
  A function to handle incoming messages
- `logging`: ` boolean` 
  An optional development flag to log incoming and outgoing messages

The handler function may:

- filter intent based on the `handlerId`
- return any value to the calling process
- throw an error which will be sent to the calling process

#### ipc.send(handlerId, ...args)

> Send a message to the opposite process

Params:

- `handlerId`: `string`
  An `id` which identifies the message's purpose
  
- `...args`: `any[]`
  An optional list of arguments to send

Returns:

- `Promise<any>`: Any value returned by the opposite process

Throws:

- Any error thrown and not caught by the opposite process

## Next

Look at:

- [Bus](bus.md)
- [Types](types.md)

