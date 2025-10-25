import tokens from '../fixtures/token.json';
import orderData from '../fixtures/order.json';

const { accessToken, refreshToken } = tokens;
const { order } = orderData;

beforeEach(() => {
  cy.stubAuthApi();
});

afterEach(() => {
  cy.clearAllCookies();
  cy.window().then((win) => {
    win.localStorage.removeItem('refreshToken');
  });
});

describe('Тесты страницы конструктора', () => {
  beforeEach(() => {
    cy.stubIngredients()
      .loginWithTokens({ accessToken, refreshToken })
      .visitConstructor()
      .aliasConstructorUi();

    cy.wait('@getIngredients').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body).to.have.property('success', true);
      expect(response?.body?.data).to.be.an('array').and.not.be.empty;
    });

    cy.wait('@getUser').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body).to.deep.include({
        success: true,
        user: {
          name: 'Test User',
          email: 'test@example.com'
        }
      });
    });

    cy.get('@bun').should('exist');
  });

  describe('Загрузка ингредиентов и взаимодействие с конструктором', () => {
    it('Добавляет булку и начинку в конструктор', () => {
      cy.constructorPage().then((page) => {
        page
          .addBun()
          .addMainIngredient()
          .expectConstructorItemsCount(1)
          .expectConstructorItemContains(0, 'Beef Patty')
          .expectTotalPrice('400');
      });
    });
  });

  describe('Тесты модального окна ингредиента', () => {
    it('Открывает модальное окно ингредиента', () => {
      cy.constructorPage().then((page) => {
        page
          .openBunDetails()
          .expectModalVisible()
          .expectModalTitle('Light Bun');
      });
    });

    it('Закрывает модальное окно кнопкой', () => {
      cy.constructorPage().then((page) => {
        page
          .openBunDetails()
          .expectModalVisible()
          .closeModal()
          .expectModalNotExist();
      });
    });

    it('Закрывает модальное окно по оверлею', () => {
      cy.constructorPage().then((page) => {
        page
          .openBunDetails()
          .expectModalVisible()
          .closeModalByOverlay()
          .expectModalNotExist();
      });
    });
  });

  describe('Процесс создания заказа', () => {
    it('Отправляет заказ и очищает конструктор', () => {
      cy.constructorPage().then((page) => {
        page.addBun().addMainIngredient().placeOrder();
      });

      cy.wait('@createOrder').then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(response?.body).to.deep.eq({
          success: true,
          name: 'Test Order',
          order: { number: order.number }
        });
      });

      cy.constructorPage().then((page) => {
        page
          .expectModalVisible()
          .expectOrderNumber(order.number)
          .closeModal()
          .expectModalNotExist()
          .expectConstructorItemsCount(0)
          .expectTotalPrice('0');
      });
    });
  });
});
