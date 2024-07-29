# Figma Messaging

## Installation

Install from NPM using your package manager of choice:

```bash
npm i 'figma-messaging'
```

## Usage

Messaging can be:

- **one-way**, e.g. sending updates from `ui` to `main` when [the user interacts](https://www.figma.com/plugin-docs/creating-ui/) with the plugin UI
- **two-way**, e.g. sending updates from `main` to `ui` when [an event happens](https://www.figma.com/plugin-docs/api/properties/figma-on/) in the editor (in addition to the above)

Here's a simple example of one-way communication from the UI to Main using the [Bus](bus.md) service:

```ts
// ui
import { makeBus } from 'figma-messaging'

// create a bus
const bus = makeBus() // no handlers (so ui > main communication only)

// call main
document.querySelector('button').addEventListener('click', event => {
  bus.call('greet', 'hello from ui!').then(result => {
    console.log(value) // hello from main!
  })  
})
```

```ts
// main
import { makeBus } from 'figma-messaging'

// create a bus
const bus = makeBus({
  greet (value) {
    console.log(value) // hello from ui!
    return 'hello from main!'
  }
})
```

This is a basic example, but read on to find out about fallback handlers, error handling, auto-complete, and more.

## Next

Services:

- [Bus](./bus.md)
- [IPC](./ipc.md)

Appendix:

- [Types](types.md)
