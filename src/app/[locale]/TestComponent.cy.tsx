import React from 'react'
import TestComponent from '@/app/[locale]/TestComponent'
import { TestComponentMessages } from '@/app/[locale]/TestComponent.type'

describe('<TestComponent />', () => {
  const messages: TestComponentMessages = {
    title: 'aaa',
    content: 'bbb'
  }

  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TestComponent messages={messages} />)
  })

  it('modifies the text', () => {
    cy.mount(<TestComponent messages={messages} />)

    cy.get('button').click()
    cy.get('.text-xl').should('contain.text', messages.title.toUpperCase())

    cy.get('button').click()
    cy.get('.text-xl').should('contain.text', messages.title)
  })
})
