# Figma Messaging

> Messaging library for Figma plugin developers

## Overview

Figma Messaging is a type-safe, auto-completing wrapper for Figma's [Messaging API](https://www.figma.com/plugin-docs/creating-ui/#sending-messages-between-the-ui-and-plugin-code).

Set up correctly, it can auto-complete...

...handler **ids**:

![screenshot](https://github.com/davestewart/figma-messaging/raw/main/docs/assets/ide-id.png)

...handler **parameters**:

![screenshot](https://github.com/davestewart/figma-messaging/raw/main/docs/assets/ide-params.png)

...handler **responses**:

![screenshot](https://github.com/davestewart/figma-messaging/raw/main/docs/assets/ide-return.png)

You can use Figma Messaging in any [Figma Plugin](https://www.figma.com/plugin-docs/) for robust, two-way messaging between `main` and `ui` processes.

## Services

The package comprises two services, `ipc` and `bus`:

`ipc` is a low-level inter-process communication service which provides:

- two-way communication between `main` and `ui` processes
- awaitable call and response
- catchable errors
- optional logging

`bus` is a higher-level message bus service (which wraps `ipc`) to provide:

- a formalised routing and handler setup
- IDE auto-completion of known route names and parameters
- typed parameter and return data for known routes
- flexibility to call arbitrary / unknown routes 
- fallback handler for arbitrary / unknown routes

Generally, [bus](docs/bus.md) will be your first choice as it's more feature-rich and user-friendly.

## Next steps

- [Documentation](./docs)

