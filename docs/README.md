# Figma Messaging

## Installation

Install from NPM using your package manager of choice:

```bash
npm i 'figma-messaging'
```

## Setup

For each process (i.e. `main` or `ui`) you'll need to `import` and initialise the required service.

Messaging can be:

- **one-way**, e.g. sending updates from `ui` to `main` when [the user interacts](https://www.figma.com/plugin-docs/creating-ui/) with the plugin UI
- **two-way**, e.g. as above, but also sending updates from `main` to `ui` when [an event happens](https://www.figma.com/plugin-docs/api/properties/figma-on/) in the editor

Note that the setup for each service in each process will be identical, but the implementation differs between them.

## Usage

Usage for both services is similar, in that:

- Messages are sent with a `handlerId` and `...args`
- Messages are received and can be filtered by their `handlerId`
- Messages can be replied to by simply returning a value (or throwing an error)
- Replies can be handled by awaiting the returned value
- Errors can be handled with `try/catch`

For example:

```ts
// sending
import { ipc } from 'figma-messaging'
ipc
  .send('greet', 'hello from main!')
  .then((reply) => {
    console.log('ui said:', reply)
  })
```

```ts
// receiving
import { ipc } from 'figma-messaging'
ipc.init((handlerId, ...args) => {
  if (handlerId === 'greet') {
    console.log(...args)
    return 'hello from ui!'
  }
})
```

The above example shows the basic [IPC](ipc.md) service, though generally you'll use the more feature-packed [Bus](bus.md) service.

## Next

Choose which service to use:

- [Bus](./bus.md)
- [IPC](./ipc.md)

More information on:

- [Types](types.md)
