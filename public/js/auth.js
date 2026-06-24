$(document).ready(function () {
  if (window.lucide) { window.lucide.createIcons(); }

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (token) {
    let navLinks = '<a href="/catalog" class="nav-link">Catalog</a>';
    if (role === 'admin' || role === 'head_admin') {
      navLinks += '<a href="/admin/dashboard" class="nav-link">Admin Panel</a>';
      navLinks += '<a href="/cart" class="nav-link" id="cartLink">My Cart<span class="cart-badge" id="cartBadge" style="display: none;">0</span></a>';
    } else {
      navLinks += '<a href="/profile" class="nav-link">My Profile</a>';
      navLinks += '<a href="/cart" class="nav-link" id="cartLink">My Cart<span class="cart-badge" id="cartBadge" style="display: none;">0</span></a>';
    }
    navLinks += '<a href="#" id="logoutBtn" class="nav-link">Logout</a>';

    if ($('#navLinks').length > 0 && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      $('#navLinks').html(navLinks);

      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
        const badge = document.getElementById('cartBadge');
        if (totalItems > 0 && badge) {
          badge.textContent = totalItems;
          badge.style.display = 'inline-flex';
        }
      } catch (e) { }
    }
  }

  $(document).on('click', '#logoutBtn', function (e) {
    e.preventDefault();
    if (token) {
      $.ajax({
        url: '/api/auth/logout',
        type: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        success: function () {
          localStorage.clear();
          window.location.href = '/login';
        },
        error: function () {
          localStorage.clear();
          window.location.href = '/login';
        }
      });
    } else {
      localStorage.clear();
      window.location.href = '/login';
    }
  });

  window.showToast = function (message, type = 'success') {
    const toastContainer = $('#toast-container').length ? $('#toast-container') : $('<div id="toast-container" class="toast-container"></div>').appendTo('body');
    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
    const toast = $(`<div class="toast toast-${type}"><i data-lucide="${iconName}"></i> <span>${message}</span></div>`);

    toastContainer.append(toast);
    if (window.lucide) { window.lucide.createIcons(); }

    setTimeout(() => toast.addClass('show'), 10);

    setTimeout(() => {
      toast.removeClass('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  $.validator.addMethod("strongPassword", function (value, element) {
    return this.optional(element) || value.length >= 6;
  }, "Password must be at least 6 characters long");

  $('#firstName, #lastName').on('input', function() {
    let val = $(this).val();
    val = val.replace(/[^a-zA-Z\s]/g, '');
    val = val.replace(/\b[a-z]/g, char => char.toUpperCase());
    if (val.length > 50) val = val.substring(0, 50);
    $(this).val(val);
  });

  if ($('#loginForm').length > 0) {
    $("#loginForm").validate({
      rules: {
        email: { required: true, email: true },
        password: { required: true }
      },
      messages: {
        email: "Please enter a valid email address.",
        password: "Password is required."
      },
      submitHandler: function (form) {
        const data = {
          email: $("#email").val(),
          password: $("#password").val()
        };

        $('.auth-error-banner').remove();

        $.ajax({
          url: '/api/auth/login',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function (response) {
            if (response.token && response.user) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('userRole', response.user.role);
              localStorage.setItem('userFirstName', response.user.firstName);
              localStorage.setItem('userLastName', response.user.lastName);

              showToast('Login successful!', 'success');

              setTimeout(() => {
                if (response.user.role === 'admin' || response.user.role === 'head_admin') {
                  window.location.href = '/admin/dashboard';
                } else {
                  window.location.href = '/catalog';
                }
              }, 500);
            }
          },
          error: function (xhr) {
            if (xhr.status === 0) {
              showToast('Cannot connect to server', 'error');
              return;
            }
            const res = xhr.responseJSON;
            const errMsg = res ? res.error : 'Login failed. Please try again.';
            $('<div class="auth-error-banner"><i data-lucide="alert-circle" style="width: 20px; height: 20px;"></i> <span>' + errMsg + '</span></div>')
              .insertBefore('#loginForm');
            if (window.lucide) { window.lucide.createIcons(); }
          }
        });
        return false;
      }
    });
  }

  if ($('#registerForm').length > 0) {
    $("#registerForm").validate({
      rules: {
        firstName: { required: true },
        lastName: { required: true },
        email: { required: true, email: true },
        password: { required: true, strongPassword: true },
        confirm_password: { required: true, equalTo: "#password" }
      },
      messages: {
        confirm_password: { equalTo: "Passwords do not match." }
      },
      submitHandler: function (form) {
        let formData = new FormData(form);

        $('.auth-error-banner').remove();

        $.ajax({
          url: '/api/auth/register',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
            $('#registerForm').html('<div style="background: rgba(22, 101, 52, 0.1); color: #166534; padding: 16px; border-radius: 4px; border: 1px solid #166534; text-align: center; margin-bottom: 20px;"><i data-lucide="check-circle" style="width: 24px; height: 24px; margin-bottom: 8px;"></i><br><strong>Registration successful!</strong><br>Please check your email to verify your account.</div>');
            if (window.lucide) { window.lucide.createIcons(); }
          },
          error: function (xhr) {
            if (xhr.status === 0) {
              showToast('Cannot connect to server', 'error');
              return;
            }
            const res = xhr.responseJSON;
            const errMsg = res ? res.error : 'Registration failed. Please try again.';
            $('<div class="auth-error-banner"><i data-lucide="alert-circle" style="width: 20px; height: 20px;"></i> <span>' + errMsg + '</span></div>')
              .insertBefore('#registerForm');
            if (window.lucide) { window.lucide.createIcons(); }
          }
        });
        return false;
      }
    });
  }
  if ($('#registerForm').length > 0 && $('#avatarPreview').length > 0) {
    $('#avatarPreview').on('click', function () {
      $('#profilePicture').click();
    });

    $('#profilePicture').on('change', function (e) {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          $('#avatarPreview').css({
            'background-image': `url('${e.target.result}')`,
            'border': '2px solid var(--accent-gold)'
          }).html('');
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
});
