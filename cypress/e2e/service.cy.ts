// Протестировано добавление ингредиента из списка в конструктор. Минимальные требования — добавление одного ингредиента, в идеале — добавление булок и добавление начинок.
//   Протестирована работа модальных окон:
//   открытие модального окна ингредиента;
// закрытие по клику на крестик;
// закрытие по клику на оверлей (желательно);
// Создание заказа:
//   Созданы моковые данные ответа на запрос данных пользователя.
//   Созданы моковые данные ответа на запрос создания заказа.
//   Подставляются моковые токены авторизации.
//   Собирается бургер.
//   Вызывается клик по кнопке «Оформить заказ».
//   Проверяется, что модальное окно открылось и номер заказа верный.
//   Закрывается модальное окно и проверяется успешность закрытия.
//   Проверяется, что конструктор пуст.
describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Ingredients', () => {
    it('Should display ingredients list', () => {
      cy.get(`[data-cy-ingredient="Краторная булка N-200i"]`).should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get(
        `[data-cy-ingredient="Мясо бессмертных моллюсков Protostomia"]`
      ).should('contain.text', 'Мясо бессмертных моллюсков Protostomia');
    });

    it('Should add bun to constructor', () => {
      cy.get(`[data-cy-ingredient="Краторная булка N-200i"]`)
        .find('button')
        .click();
      cy.get('[data-cy="constructor-bun-top"]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy="constructor-bun-bottom"]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
    });

    it('Should add filling to constructor', () => {
      cy.get(`[data-cy-ingredient="Краторная булка N-200i"]`)
        .find('button')
        .click();
      cy.get(`[data-cy-ingredient="Мясо бессмертных моллюсков Protostomia"]`)
        .find('button')
        .click();
      cy.get('[data-cy="constructor-fillings"]')
        .find(
          `[data-cy-constructor-item-name="Мясо бессмертных моллюсков Protostomia"]`
        )
        .should('exist');
    });

    it('Should add bun and multiple fillings to constructor', () => {
      cy.get(`[data-cy-ingredient="Краторная булка N-200i"]`)
        .find('button')
        .click();
      cy.get(`[data-cy-ingredient="Мясо бессмертных моллюсков Protostomia"]`)
        .find('button')
        .click();
      cy.get(`[data-cy-ingredient="Соус с шипами Антарианского плоскоходца"]`)
        .find('button')
        .click();

      cy.get('[data-cy="constructor-bun-top"]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy="constructor-bun-bottom"]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy="constructor-fillings"]')
        .find(
          `[data-cy-constructor-item-name="Мясо бессмертных моллюсков Protostomia"]`
        )
        .should('exist');
      cy.get('[data-cy="constructor-fillings"]')
        .find(
          `[data-cy-constructor-item-name="Соус с шипами Антарианского плоскоходца"]`
        )
        .should('exist');
      cy.get('[data-cy="constructor-fillings"]')
        .children()
        .should('have.length', 2);
    });
  });

  describe('Ingredient Modal', () => {
    it('Should open and close ingredient modal correctly', () => {
      cy.get(
        `[data-cy-ingredient="Мясо бессмертных моллюсков Protostomia"]`
      ).click();
      cy.get('[data-cy-modal]').should('exist');
      cy.get('[data-cy="modal-ingredient-name"]').should(
        'contain.text',
        'Мясо бессмертных моллюсков Protostomia'
      );
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy-modal]').should('not.exist');
    });

    it('Should close modal by clicking overlay and esc', () => {
      cy.get(
        `[data-cy-ingredient="Мясо бессмертных моллюсков Protostomia"]`
      ).click();
      cy.get('[data-cy-modal]').should('exist');
      cy.get('[data-cy-modal-overlay]').click({ force: true });
      cy.get('[data-cy-modal]').should('not.exist');

      cy.get(
        `[data-cy-ingredient="Мясо бессмертных моллюсков Protostomia"]`
      ).click();
      cy.get('[data-cy-modal]').should('exist');
      cy.get('body').type('{esc}');
      cy.get('[data-cy-modal]').should('not.exist');
    });
  });

  describe('Order Creation', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'access_token');
      });
      cy.setCookie('refreshToken', 'refresh_token');

      cy.intercept('GET', '**/api/auth/user', { fixture: 'user' }).as(
        'getUserData'
      );
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );
    });

    it('Should create order, show modal with order number and clear constructor', () => {
      cy.get(`[data-cy-ingredient="Краторная булка N-200i"]`)
        .find('button')
        .click();
      cy.get(`[data-cy-ingredient="Мясо бессмертных моллюсков Protostomia"]`)
        .find('button')
        .click();
      cy.get(`[data-cy-ingredient="Соус с шипами Антарианского плоскоходца"]`)
        .find('button')
        .click();

      cy.get('[data-cy="constructor-bun-top"]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy="constructor-fillings"]')
        .children()
        .should('have.length', 2);

      cy.get('.button.button_type_primary').click();

      cy.wait('@createOrder').then((interception) => {
        expect(interception.request.body.ingredients).to.be.an('array').and.not
          .be.empty;
      });

      cy.get('[data-cy-modal]').should('exist');
      cy.fixture('order.json').then((orderData) => {
        cy.get('[data-cy="modal-order-number"]').should(
          'contain.text',
          orderData.order.number.toString()
        );
      });

      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy-modal]').should('not.exist');

      cy.get('[data-cy="constructor-fillings"]')
        .find('div')
        .children()
        .should('have.length', 0);
    });

    afterEach(() => {
      cy.clearLocalStorage('accessToken');
      cy.clearCookie('refreshToken');
    });
  });
});
