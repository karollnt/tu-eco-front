const User = (function () {
  const checkSession = function (currentUser) {
    if (currentUser == null) {
      app.loadRegisterDepartments();
      setTimeout(function () {
        $('.js-open-login').trigger('click');
      }, 500);
      return;
    }
    $('.js-main-view').removeClass('display-none');
    if (typeof currentUser.nombre === 'undefined') {
      getUserData(currentUser.id);
      return;
    }
    setUserDataStrings(currentUser);
    if (typeof isUserDetailsPage !== 'undefined' && isUserDetailsPage) {
      setDetailsEvents();
      loadDepartment('.js-edit-user-department');
    }
  };

  const checkLoginForm = function (ev) {
    ev.preventDefault();
    let form = $(ev.target);
    let request = $.ajax({
      url: Variables.backendURL + 'user/login',
      method: 'POST',
      data: form.serialize()
    });
    request.done(function (data) {
      if (data.valid == false) {
        $('.js-login-error').html('Por favor revise la informaci&oacute;n ingresada');
        return;
      } else if (data.valid == true) {
        const user = {id: data.id};
        const userString = JSON.stringify(user);
        app.user = JSON.parse(userString);
        window.localStorage.setItem('user', userString);
        location.reload();
      }
    })
    .fail(function (data) {
      if (data.valid == false) {
        $('.js-login-error').html('Por favor revise la informaci&oacute;n ingresada');
      }
    });
    return false;
  };

  const getUserData = function (id) {
    let request = $.ajax({
      url: Variables.backendURL + 'user/get_user_data',
      method: 'GET',
      data: {id: id}
    });
    request.done(function (data) {
      if (data.length === 0) {
        return;
      }
      const userString = JSON.stringify(data);
      app.user = JSON.parse(userString);
      window.localStorage.setItem('user', userString);
      setUserDataStrings(app.user);
    });
  };

  const setUserDataStrings = function (user) {
    $('.js-user-name-tag').html(user.nombre);
    $('.js-user-image').prop('src', user.foto);
    if (typeof isUserDetailsPage !== 'undefined' && isUserDetailsPage) {
      $('.js-user-data-name').html(user.nombre + ' ' + user.apellido);
      $('.js-user-data-address').html(user.direccion + (', ' + user.ciudad + ', ' + user.departamento));
      $('.js-user-data-phone').html(user.telefono);

      $('.js-edit-user-name').html(user.nombre);
      $('.js-edit-user-surname').html(user.apellido);
      $('.js-edit-user-identity').html(user.identificacion);
      $('.js-edit-user-phone').html(user.telefono);
      $('.js-edit-user-address').html(user.direccion);
    }
  };

  const logout = function (ev) {
    ev.preventDefault();
    app.user = null;
    window.localStorage.removeItem('user');
    const link = ev.currentTarget || ev.target;
    location.href = link.getAttribute('href');
    return false;
  };

  const checkRegisterForm = function (ev) {
    ev.preventDefault();
    let form = $(ev.target);
    let request = $.ajax({
      url: Variables.backendURL + 'user/create_user',
      method: 'POST',
      data: form.serialize()
    });
    request.done(function (data) {
      if (data.valid == true) {
        const user = { id: data.id };
        const userString = JSON.stringify(user);
        app.user = JSON.parse(userString);
        window.localStorage.setItem('user', userString);
        location.reload();
        return;
      }
    });
  };

  const setDetailsEvents = function () {
    $(document)
      .on('click', '.js-show-edit-form', showEditDataForm)
      .on('change', '.js-edit-user-department', app.fillCitiesSelect)
      .on('submit', '.js-edit-user-data-form', sendEditDataForm);
  };

  const showEditDataForm = function (ev) {
    ev.preventDefault();
    const button = ev.target;
    const selector = button.getAttribute('data-target');
    $('.js-user-data').addClass('display-none');
    $(selector).removeClass('display-none');
  };

  const loadDepartment = function (inputSelector) {
    let request = $.ajax({
      url: Variables.backendURL + 'department/list_departments',
      method: 'GET'
    });
    request.done(function (data) {
      const html = data.reduce(function (prev, current) {
        const selected = user.id_departamento == current.id ? ' selected' : '';
        return prev + '<option value="' + current.id + '"' + selected + '>' + current.nombre + '</option>';
      }, '<option value="">Departamento</option>');
      $(inputSelector).html(html).trigger('change');
    });
  };

  const sendEditDataForm = function (ev) {
    ev.preventDefault();
    let form = $(ev.target);
    let request = $.ajax({
      url: Variables.backendURL + 'user/edit_data',
      method: 'POST',
      data: form.serialize()
    });
    request.done(function (data) {
      if (data.valid == true) {
        const user = { id: data.id };
        const userString = JSON.stringify(user);
        app.user = JSON.parse(userString);
        window.localStorage.setItem('user', userString);
        location.reload();
        return;
      }
    });
  };

  return {
    checkRegisterForm: checkRegisterForm,
    checkLoginForm: checkLoginForm,
    checkSession: checkSession,
    logout: logout
  };
})();