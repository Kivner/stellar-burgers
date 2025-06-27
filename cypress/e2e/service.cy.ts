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
  // Константы ингредиентов
  const INGREDIENTS = {
    BUN: 'Краторная булка N-200i',
    MOLLUSKS_MEAT: 'Мясо бессмертных моллюсков Protostomia',
    SAUCE: 'Соус с шипами Антарианского плоскоходца'
  };

  // Селекторы
  const SELECTORS = {
    ingredient: (name: any) => `[data-cy-ingredient="${name}"]`,
    ingredientButton: (name: any) => `${SELECTORS.ingredient(name)} button`,
    constructorItem: (name: any) => `[data-cy-constructor-item-name="${name}"]`,
    constructor: {
      bunTop: '[data-cy="constructor-bun-top"]',
      bunBottom: '[data-cy="constructor-bun-bottom"]',
      fillings: '[data-cy="constructor-fillings"]',
      fillingsChildren: '[data-cy="constructor-fillings"] > *'
    },
    modal: {
      container: '[data-cy-modal]',
      overlay: '[data-cy-modal-overlay]',
      closeButton: '[data-cy="modal-close-button"]',
      ingredientName: '[data-cy="modal-ingredient-name"]',
      orderNumber: '[data-cy="modal-order-number"]'
    },
    common: {
      orderButton: '.button.button_type_primary'
    }
  };

  // Общие функции
  const addIngredientToConstructor = (name: string) => {
    cy.get(SELECTORS.ingredientButton(name)).click();
  };

  const checkIngredientInConstructor = (name: string, shouldExist = true) => {
    const assertion = shouldExist ? 'exist' : 'not.exist';
    cy.get(SELECTORS.constructor.fillings)
      .find(SELECTORS.constructorItem(name))
      .should(assertion);
  };

  const checkBunsInConstructor = (name: string) => {
    cy.get(SELECTORS.constructor.bunTop).should('contain.text', name);
    cy.get(SELECTORS.constructor.bunBottom).should('contain.text', name);
  };

  const openAndCloseModal = (ingredientName: string, closeMethod: string) => {
    cy.get(SELECTORS.ingredient(ingredientName)).click();
    cy.get(SELECTORS.modal.container).should('exist');

    if (closeMethod === 'button') {
      cy.get(SELECTORS.modal.closeButton).click();
    } else if (closeMethod === 'overlay') {
      cy.get(SELECTORS.modal.overlay).click({ force: true });
    } else if (closeMethod === 'esc') {
      cy.get('body').type('{esc}');
    }

    cy.get(SELECTORS.modal.container).should('not.exist');
  };

  // Настройка тестового окружения
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  // Проверка ингредиентов
  describe('Ingredients', () => {
    it('Should display ingredients list', () => {
      cy.get(SELECTORS.ingredient(INGREDIENTS.BUN)).should(
        'contain.text',
        INGREDIENTS.BUN
      );
      cy.get(SELECTORS.ingredient(INGREDIENTS.MOLLUSKS_MEAT)).should(
        'contain.text',
        INGREDIENTS.MOLLUSKS_MEAT
      );
    });

    it('Should add bun to constructor', () => {
      addIngredientToConstructor(INGREDIENTS.BUN);
      checkBunsInConstructor(INGREDIENTS.BUN);
    });

    it('Should add filling to constructor', () => {
      addIngredientToConstructor(INGREDIENTS.BUN);
      addIngredientToConstructor(INGREDIENTS.MOLLUSKS_MEAT);
      checkIngredientInConstructor(INGREDIENTS.MOLLUSKS_MEAT);
    });

    it('Should add bun and multiple fillings to constructor', () => {
      addIngredientToConstructor(INGREDIENTS.BUN);
      addIngredientToConstructor(INGREDIENTS.MOLLUSKS_MEAT);
      addIngredientToConstructor(INGREDIENTS.SAUCE);

      checkBunsInConstructor(INGREDIENTS.BUN);
      checkIngredientInConstructor(INGREDIENTS.MOLLUSKS_MEAT);
      checkIngredientInConstructor(INGREDIENTS.SAUCE);
      cy.get(SELECTORS.constructor.fillingsChildren).should('have.length', 2);
    });
  });

  // Проверка модального окна
  describe('Ingredient Modal', () => {
    it('Should open and close ingredient modal correctly', () => {
      openAndCloseModal(INGREDIENTS.MOLLUSKS_MEAT, 'button');
    });

    it('Should close modal by clicking overlay and esc', () => {
      openAndCloseModal(INGREDIENTS.MOLLUSKS_MEAT, 'overlay');
      openAndCloseModal(INGREDIENTS.MOLLUSKS_MEAT, 'esc');
    });
  });

  describe('Order Creation', () => {
    beforeEach(() => {
      // Настройка авторизации
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'access_token');
      });
      cy.setCookie('refreshToken', 'refresh_token');

      // Моки API
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user' }).as(
        'getUserData'
      );
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );
    });

    it('Should create order, show modal with order number and clear constructor', () => {
      // Добавление ингредиентов
      addIngredientToConstructor(INGREDIENTS.BUN);
      addIngredientToConstructor(INGREDIENTS.MOLLUSKS_MEAT);
      addIngredientToConstructor(INGREDIENTS.SAUCE);

      // Проверка конструктора
      checkBunsInConstructor(INGREDIENTS.BUN);
      cy.get(SELECTORS.constructor.fillingsChildren).should('have.length', 2);

      // Создание заказа
      cy.get(SELECTORS.common.orderButton).click();

      // Проверка запроса
      cy.wait('@createOrder').then((interception) => {
        expect(interception.request.body.ingredients).to.be.an('array').and.not
          .be.empty;
      });

      // Проверка модального окна
      cy.get(SELECTORS.modal.container).should('exist');
      cy.fixture('order.json').then((orderData) => {
        cy.get(SELECTORS.modal.orderNumber).should(
          'contain.text',
          orderData.order.number.toString()
        );
      });

      // Закрытие модального окна
      cy.get(SELECTORS.modal.closeButton).click();
      cy.get(SELECTORS.modal.container).should('not.exist');

      // Проверка очистки конструктора
      cy.get(SELECTORS.constructor.fillings)
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
