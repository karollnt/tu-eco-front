const Orders = (function () {
  let categories = null;

  const init = function () {
    $('.js-user-id').val(app.user.id);
    if (typeof isCreateOrder !== 'undefined' && isCreateOrder) {
      getOrderCategories();
      setEvents();
    } else if (typeof isListOrders !== 'undefined' && isListOrders) {
      listUserOrders();
    }
  };

  const getOrderCategories = function () {
    let ajax = $.ajax({
      method: 'GET',
      url: Variables.backendURL + 'category/get_categories'
    });
    ajax.done(function (data) {
      if (!data || data.length < 1) {
        return;
      }
      categories = JSON.parse(JSON.stringify(data));
      fillFormCategories();
    });
  };

  const fillFormCategories = function () {
    const html = categories.reduce(function (carry, current) {
      const valueString = current.id + ';' + (current.precio * 1);
      const currentHtml = '<li class="row">' +
        '<div class="col-4">' +
          '<label class="label-checkbox item-content" for="category_' + current.id + '">' +
            '<input type="checkbox" id="category_' + current.id + '" name="category" class="js-category-item" value="' + valueString + '" data-id="' + current.id + '"> ' +
            '<span class="item-title">' + current.nombre + '</span>' +
          '</label>' +
        '</div>' +
        '<div class="col-4">' +
          '$ ' + (current.precio * 1) + ' (' + current.medida +')' +
        '</div>' +
        '<div class="col-4">' +
          '<input type="number" name="cantidad_' + current.id + '" class="form_input js-item-quantity-' + current.id + '" value="0">' +
        '</div>' +
      '</li>';
      return carry + currentHtml;
    }, '');
    $('.js-object-list').html(html);
  };

  const setEvents = function () {
    $(document).on('submit', '.js-create-request-form', createOrder);
  };

  const createOrder = function (ev) {
    ev.preventDefault();
    const categoryCheckboxes = document.querySelectorAll('.js-category-item:checked');
    let categoryValues = '';
    for (let i = 0; i < categoryCheckboxes.length; i++) {
      const element = categoryCheckboxes[i];
      if (categoryValues != '') {
        categoryValues += '|';
      }
      const elementQuantity = document.querySelector('.js-item-quantity-' + element.getAttribute('data-id'));
      categoryValues += element.value + ';' + elementQuantity.value;
    }
    $('.js-request-objects').val(categoryValues);
    let form = $(ev.target);
    let ajax = $.ajax({
      url: Variables.backendURL + 'order/create_order',
      method: 'POST',
      data: form.serialize()
    });
    ajax.done(function (data) {
      if (data.valid == true) {
        location.href = 'success.html';
      }
    });
  };

  const listUserOrders = function () {
    if (app.user == null) {
      return;
    }
    let ajax = $.ajax({
      url: Variables.backendURL + 'order/get_user_orders',
      data: {user_id: app.user.id},
      method: 'GET'
    });
    ajax.done(function (data) {
      if (!data || data.length < 1) {
        return;
      }
      const orderListHtml = data.reduce(function (carry, item) {
        const itemHtml = '<li>'+
          '<div class="row">' +
            '<div class="col-7">' +
              '<p>Fecha: ' + item.fecha + '</p>' +
              '<p>Ciudad: ' + item.ciudad + '</p>' +
              '<p>Departamento: ' + item.departamento + '</p>' +
            '</div>' +
            '<div class="col-5">' +
              '<a href="detalle-orden.html?id=' + item.id + '" class="btn">Ver detalles</a>' +
            '</div>' +
          '</div>' +
        '</li>';
        return carry + itemHtml;
      }, '');
      $('.js-orders-list').html(orderListHtml);
    });
  };

  return {
    init: init
  };
})();

Orders.init();