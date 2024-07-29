import { makeBus } from 'figma-messaging'
import { showUI } from '@create-figma-plugin/utilities'
import { UiHandlers } from './ui'

// create handler
function create (count: number) {
  const nodes: Array<SceneNode> = []
  for (let i = 0; i < count; i++) {
    const rect = figma.createRectangle()
    rect.resize(100, 100)
    rect.x = i * 150
    rect.fills = [
      {
        color: { b: 0, g: 0.5, r: 1 },
        type: 'SOLID',
      },
    ]
    figma.currentPage.appendChild(rect)
    nodes.push(rect)
  }

  // update
  figma.currentPage.selection = nodes
  figma.viewport.scrollAndZoomIntoView(nodes)

  // return message to ui
  return `${nodes.length} nodes created!`
}

// create handlers
const handlers = {
  create,
}

// export handlers for UI
export type MainHandlers = typeof handlers

// main code
export default function () {
  // initial plugin state
  const props = {
    numSelected: figma.currentPage.selection.length,
  }

  // add event listeners
  figma.on('selectionchange', () => {
    const selection = figma.currentPage.selection.length
    void bus.call('update', selection)
  })

  // configure bus
  const bus = makeBus<UiHandlers>(handlers)

  showUI({
    height: 137,
    width: 240,
  }, props)
}
