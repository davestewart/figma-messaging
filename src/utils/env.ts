export const source = typeof figma === 'undefined'
  ? 'UI'
  : 'MAIN'

export const context = source === 'UI'
  ? window
  : figma.ui
