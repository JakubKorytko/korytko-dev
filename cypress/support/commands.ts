import { getRect } from '@/utils/dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@4tw/cypress-drag-drop';

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string,
//         options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      isInParentBounds(selectors:
      { parent: string, element: string }): Chainable<JQuery<HTMLElement>>
      resize(selector: string, delta: { x: number, y: number }): Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('isInParentBounds', (selectors) => cy.get(
  selectors.parent,
).then((parent) => cy
  .get(selectors.element).then((element) => {
    const parentRect = getRect(parent[0]);
    const elementRect = getRect(element[0]);

    expect(elementRect.bottom).to.be.lte(parentRect.bottom);
    expect(elementRect.right).to.be.lte(parentRect.right);
    expect(elementRect.top).to.be.gte(parentRect.top);
    expect(elementRect.left).to.be.gte(parentRect.left);
  })));

Cypress.Commands.add('resize', (selector, delta) => cy
  .get(selector)
  .trigger('mousemove', { position: 'center' })
  .trigger('mousedown')
  .trigger('mousemove', delta.x, delta.y, { force: true })
  .trigger('mouseup', delta.x, delta.y, { force: true })
  .wait(500));
