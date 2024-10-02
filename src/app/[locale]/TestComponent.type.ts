import React from 'react'

export interface TestComponentMessages {
  title: string
  content: string
}

interface TestComponentProps { messages: TestComponentMessages }

export type TestComponentInterface = (props: TestComponentProps) => React.ReactElement | null
