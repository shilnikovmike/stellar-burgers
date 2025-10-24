import tokens from '../fixtures/token.json';
import orderData from '../fixtures/order.json';

const API_PATH = '**/api';
const { accessToken, refreshToken } = tokens;
const { order } = orderData;

beforeEach(() => {
  cy.intercept('GET', `${API_PATH}/auth/user`, {
    fixture: 'user.json'
  }).as('getUser');

  cy.intercept('POST', `${API_PATH}/auth/token`, {
    fixture: 'token.json'
  }).as('refreshToken');

  cy.intercept('POST', `${API_PATH}/orders`, {
    fixture: 'order.json'
  }).as('createOrder');
});

afterEach(() => {
  cy.clearAllCookies();
  cy.window().then((win) => {
    win.localStorage.removeItem('refreshToken');
  });
});

describe('Тесты страницы конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API_PATH}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', refreshToken);
        win.document.cookie = `accessToken=${accessToken}`;
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');
    cy.get('[data-cy=bun]').should('exist');
  });

  describe('Загрузка ингредиентов и взаимодействие с конструктором', () => {
    it('Добавляет булку и начинку в конструктор', () => {
      cy.get('[data-cy=bun] .common_button').first().click();
      cy.get('[data-cy=main] .common_button').first().click();

      cy.get('[data-cy="constructor-item"]').should('have.length', 1);
      cy.get('[data-cy="constructor-item"]')
        .first()
        .should('contain.text', 'Beef Patty');
      cy.get('[data-cy=total-price]').should('contain.text', '400');
    });
  });

  describe('Тесты модального окна ингредиента', () => {
    it('Открывает модальное окно ингредиента', () => {
      cy.get('[data-cy=bun]').first().find('a').click();

      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal] h3').should('contain.text', 'Light Bun');
    });

    it('Закрывает модальное окно кнопкой', () => {
      cy.get('[data-cy=bun]').first().find('a').click();

      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('Закрывает модальное окно по оверлею', () => {
      cy.get('[data-cy=bun]').first().find('a').click();

      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.get('[data-cy=modal]').should('not.exist');
    });
  });

  describe('Процесс создания заказа', () => {
    it('Отправляет заказ и очищает конструктор', () => {
      cy.get('[data-cy=bun] .common_button').first().click();
      cy.get('[data-cy=main] .common_button').first().click();

      cy.get('[data-cy=order-button]').click();
      cy.wait('@createOrder');

      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=order-number]').should('contain.text', order.number);

      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');

      cy.get(
        '[data-cy="constructor-ingredients"] [data-cy="constructor-item"]'
      ).should('have.length', 0);
      cy.get('[data-cy=total-price]').should('contain.text', '0');
    });
  });
});
