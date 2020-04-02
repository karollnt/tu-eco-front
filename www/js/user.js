const User = (function () {
  const checkSession = function (currentUser) {
    if (currentUser == null) {
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
      console.log(data);
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
  };

  const logout = function (ev) {
    ev.preventDefault();
    app.user = null;
    window.localStorage.removeItem('user');
    const link = ev.currentTarget || ev.target;
    location.href = link.getAttribute('href');
    return false;
  };

  return {
    checkLoginForm: checkLoginForm,
    checkSession: checkSession,
    logout: logout
  };
})();