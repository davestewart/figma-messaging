import { Button, Columns, Container, Muted, render, Text, TextboxNumeric, VerticalSpace } from '@create-figma-plugin/ui'
import { h } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { makeBus } from 'figma-messaging'

// import main handler descriptions
import { type MainHandlers } from './main'

// export ui handler descriptions
export type UiHandlers = {
  update: (num: number) => void
}

// plugin code
interface Props {
  numSelected: number
}

function Plugin (props: Props) {
  // local state
  const [count, setCount] = useState<number | null>(5)
  const [selection, setSelection] = useState<number>(props.numSelected)

  // set up bus
  const bus = makeBus<MainHandlers>({
    update (num: number): void {
      setSelection(num)
    },
  })

  // handle ui events
  const onCreateClick = useCallback(
    async function () {
      if (count !== null) {
        // call and wait for message...
        const message = await bus.call('create', count) // auto-complete should work here
        console.log(message)
      }
    },
    [count],
  )

  // user interface
  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text>
        <Muted>Count ({String(selection)} selected)</Muted>
      </Text>
      <VerticalSpace space="small" />
      <TextboxNumeric
        onNumericValueInput={setCount}
        value={String(count)}
        variant="border"
      />
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={onCreateClick}>
          Create
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
