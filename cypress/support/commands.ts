type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

type ConstructorSelectors = {
  bun?: string;
  main?: string;
  totalPrice?: string;
  modal?: string;
  modalClose?: string;
  modalOverlay?: string;
  constructorItem?: string;
  orderButton?: string;
  orderNumber?: string;
};

type ConstructorSelectorMap = Required<ConstructorSelectors>;

type ConstructorPageActions = {
  addBun(): ConstructorPageActions;
  addMainIngredient(): ConstructorPageActions;
  openBunDetails(index?: number): ConstructorPageActions;
  expectModalVisible(): ConstructorPageActions;
  expectModalTitle(expectedText: string): ConstructorPageActions;
  closeModal(): ConstructorPageActions;
  closeModalByOverlay(): ConstructorPageActions;
  expectModalNotExist(): ConstructorPageActions;
  expectConstructorItemsCount(expected: number): ConstructorPageActions;
  expectConstructorItemContains(
    index: number,
    text: string
  ): ConstructorPageActions;
  expectTotalPrice(expected: string | number): ConstructorPageActions;
  placeOrder(): ConstructorPageActions;
  expectOrderNumber(expected: string | number): ConstructorPageActions;
};

type VisitConstructorOptions = Partial<Cypress.VisitOptions> & {
  url?: string;
  tokens?: AuthTokens;
};

const API_PATH = '**/api';
const CONSTRUCTOR_SELECTORS_ENV_KEY = 'constructorSelectors';

const DEFAULT_CONSTRUCTOR_SELECTORS: ConstructorSelectorMap = {
  bun: '[data-cy=bun]',
  main: '[data-cy=main]',
  totalPrice: '[data-cy=total-price]',
  modal: '[data-cy=modal]',
  modalClose: '[data-cy=modal-close]',
  modalOverlay: '[data-cy=modal-overlay]',
  constructorItem: '[data-cy="constructor-item"]',
  orderButton: '[data-cy=order-button]',
  orderNumber: '[data-cy=order-number]'
};

const mergeConstructorSelectors = (
  overrides?: ConstructorSelectors
): ConstructorSelectorMap => ({
  ...DEFAULT_CONSTRUCTOR_SELECTORS,
  ...(overrides ?? {})
});

const getConstructorSelectors = (): ConstructorSelectorMap =>
  mergeConstructorSelectors(
    Cypress.env(CONSTRUCTOR_SELECTORS_ENV_KEY) as
      | ConstructorSelectors
      | undefined
  );

Cypress.Commands.add('stubAuthApi', () => {
  cy.intercept('GET', `${API_PATH}/auth/user`, {
    fixture: 'user.json'
  }).as('getUser');

  cy.intercept('POST', `${API_PATH}/auth/token`, {
    fixture: 'token.json'
  }).as('refreshToken');

  cy.intercept('POST', `${API_PATH}/orders`, {
    fixture: 'order.json'
  }).as('createOrder');

  return cy.wrap(null);
});

Cypress.Commands.add('stubIngredients', () => {
  cy.intercept('GET', `${API_PATH}/ingredients`, {
    fixture: 'ingredients.json'
  }).as('getIngredients');

  return cy.wrap(null);
});

Cypress.Commands.add('loginWithTokens', (tokens: AuthTokens) => {
  Cypress.env('authTokens', tokens);
  return cy.wrap(null);
});

Cypress.Commands.add(
  'visitConstructor',
  (options: VisitConstructorOptions = {}) => {
    const { url = '/', tokens, ...visitOptions } = options;
    const storedTokens =
      tokens ?? (Cypress.env('authTokens') as AuthTokens | undefined);
    const originalOnBeforeLoad = visitOptions.onBeforeLoad;

    return cy.visit(url, {
      ...visitOptions,
      onBeforeLoad(win) {
        if (storedTokens?.refreshToken) {
          win.localStorage.setItem('refreshToken', storedTokens.refreshToken);
        }
        if (storedTokens?.accessToken) {
          win.document.cookie = `accessToken=${storedTokens.accessToken}`;
        }
        originalOnBeforeLoad?.(win);
      }
    });
  }
);

Cypress.Commands.add(
  'aliasConstructorUi',
  (selectors: ConstructorSelectors = {}) => {
    const resolvedSelectors = mergeConstructorSelectors(selectors);

    Cypress.env(CONSTRUCTOR_SELECTORS_ENV_KEY, resolvedSelectors);

    cy.get(resolvedSelectors.bun).as('bun');
    cy.get(resolvedSelectors.main).as('mainSection');
    cy.get(resolvedSelectors.totalPrice).as('totalPrice');

    return cy.wrap(resolvedSelectors);
  }
);

Cypress.Commands.add('constructorPage', () => {
  const selectors = getConstructorSelectors();

  const actions: ConstructorPageActions = {
    addBun() {
      cy.get('@bun').find('.common_button').first().click();
      return actions;
    },
    addMainIngredient() {
      cy.get('@mainSection').find('.common_button').first().click();
      return actions;
    },
    openBunDetails(index = 0) {
      cy.get('@bun').eq(index).find('a').click();
      return actions;
    },
    expectModalVisible() {
      cy.get(selectors.modal).as('modal').should('be.visible');
      return actions;
    },
    expectModalTitle(expectedText: string) {
      cy.get(selectors.modal)
        .should('be.visible')
        .find('h3')
        .should('contain.text', expectedText);
      return actions;
    },
    closeModal() {
      cy.get(selectors.modalClose).click();
      return actions;
    },
    closeModalByOverlay() {
      cy.get(selectors.modalOverlay).click({ force: true });
      return actions;
    },
    expectModalNotExist() {
      cy.get(selectors.modal).should('not.exist');
      return actions;
    },
    expectConstructorItemsCount(expected: number) {
      cy.get(selectors.constructorItem).should('have.length', expected);
      return actions;
    },
    expectConstructorItemContains(index: number, text: string) {
      cy.get(selectors.constructorItem).eq(index).should('contain.text', text);
      return actions;
    },
    expectTotalPrice(expected: string | number) {
      cy.get('@totalPrice').should('contain.text', expected);
      return actions;
    },
    placeOrder() {
      cy.get(selectors.orderButton).click();
      return actions;
    },
    expectOrderNumber(expected: string | number) {
      cy.get(selectors.modal)
        .should('be.visible')
        .find(selectors.orderNumber)
        .should('contain.text', expected);
      return actions;
    }
  };

  return cy.wrap(actions, { log: false });
});

declare global {
  namespace Cypress {
    interface Chainable {
      stubAuthApi(): Chainable<null>;
      stubIngredients(): Chainable<null>;
      loginWithTokens(tokens: AuthTokens): Chainable<null>;
      visitConstructor(options?: VisitConstructorOptions): Chainable<AUTWindow>;
      aliasConstructorUi(
        selectors?: ConstructorSelectors
      ): Chainable<ConstructorSelectorMap>;
      constructorPage(): Chainable<ConstructorPageActions>;
    }
  }
}

export {};
