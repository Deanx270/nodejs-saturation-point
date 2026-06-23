$(document).ready(function () {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  $('body').fadeIn(200);

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    $.ajax({
      url: '/api/auth/me',
      headers: { 'Authorization': 'Bearer ' + token },
      success: function (user) {
        $('#firstName').val(user.firstName);
        $('#lastName').val(user.lastName);
        $('#email').val(user.email);

        if (user.profilePicture) {
          $('#avatarImage').attr('src', user.profilePicture);
        }
        $('#avatarImage').show();
        $('#avatarPreview').addClass('has-image');
      },
      error: function () {
        $('#firstName').val(payload.firstName || '');
        $('#lastName').val(payload.lastName || '');
        $('#email').val(payload.email || '');

        $('#avatarImage').show();
        $('#avatarPreview').addClass('has-image');
      }
    });
  } catch (e) {
    window.location.href = '/login';
    return;
  }

  $('#avatarUploadTrigger').click(function () {
    $('#profilePicture').click();
  });

  $('#profilePicture').change(function (e) {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $('#avatarImage').attr('src', e.target.result).show();
        $('#avatarPreview').addClass('has-image');
      }
      reader.readAsDataURL(this.files[0]);
    }
  });

  $('#profileForm').submit(function (e) {
    e.preventDefault();

    const btn = $('#saveProfileBtn');
    const originalText = btn.text();
    btn.text('Saving...').prop('disabled', true);
    $('.auth-error-banner').remove();

    const formData = new FormData(this);

    $.ajax({
      url: '/api/users/profile',
      type: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token },
      data: formData,
      processData: false,
      contentType: false,
      success: function (res) {

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          customClass: { popup: 'swal2-toast' }
        });
        Toast.fire({ icon: 'success', title: 'Profile updated successfully!' });

        $('#password').val('');
      },
      error: function (err) {
        const errorMsg = err.responseJSON && err.responseJSON.error ? err.responseJSON.error : 'Failed to update profile';
        $('<div class="auth-error-banner"><i data-lucide="alert-circle" style="width: 20px; height: 20px;"></i> <span>' + errorMsg + '</span></div>')
          .insertBefore('#profileForm');
        if (window.lucide) { lucide.createIcons(); }
      },
      complete: function () {
        btn.text(originalText).prop('disabled', false);
      }
    });
  });
});
