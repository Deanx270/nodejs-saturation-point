$(document).ready(function () {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token || (role !== 'admin' && role !== 'head_admin')) {
    window.location.replace('/404');
    return;
  }

  $('body').fadeIn(200);

  let loggedInUserId = null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    loggedInUserId = payload.id;
  } catch (e) { }

  $.ajaxSetup({
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  $.fn.dataTable.ext.errMode = 'none';
  const table = $('#usersTable').on('xhr.dt', function (e, settings, json, xhr) {
    if (xhr && xhr.status === 401) {
      localStorage.removeItem('token');
      window.location.replace('/login');
    }
  }).on('error.dt', function (e, settings, techNote, message) {
    if (settings && settings.jqXHR && settings.jqXHR.status !== 401) {
      Swal.fire('Data Error', 'Failed to load or update data. Access may be restricted.', 'error');
    }
  }).DataTable({
    ajax: {
      url: '/api/admin/users',
      dataSrc: ''
    },
    columns: [
      {
        data: 'id', render: function (data, type, row) {
          if (type === 'display' && data.length > 8) {
            return `<span class="copyable-id" data-clipboard-text="${data}" title="Click to copy ${data}" style="cursor: pointer; border-bottom: 1px dotted #ccc; color: var(--accent-gold); transition: color 0.2s ease;">${data.substr(0, 8)}...</span>`;
          }
          return `<span class="copyable-id" data-clipboard-text="${data}" title="Click to copy ${data}" style="cursor: pointer; border-bottom: 1px dotted #ccc; color: var(--accent-gold); transition: color 0.2s ease;">${data}</span>`;
        }
      },
      {
        data: null, render: function (data, type, row) {
          const name = `${row.firstName} ${row.lastName}`;
          const safeData = name.replace(/"/g, '&quot;');
          return `<span class="dt-truncate" title="${safeData}">${name}</span>`;
        }
      },
      {
        data: 'email', render: function (data, type, row) {
          if (!data) return '-';
          const safeData = typeof data === 'string' ? data.replace(/"/g, '&quot;') : data;
          if (type === 'display' && data.length > 20) {
            return `<span title="${safeData}" style="cursor: help; border-bottom: 1px dotted #ccc;">${data.substr(0, 20)}...</span>`;
          }
          return `<span title="${safeData}">${data}</span>`;
        }
      },
      {
        data: 'role',
        render: function (data, type, row) {
          let disabled = '';
          if (row.id === loggedInUserId) disabled = 'disabled';
          if (role === 'admin' && (row.role === 'admin' || row.role === 'head_admin')) disabled = 'disabled';
          if (role === 'head_admin' && row.role === 'head_admin' && row.id !== loggedInUserId) disabled = 'disabled';

          return `
            <select class="action-select role-select" data-id="${row.id}" ${disabled}>
              <option value="customer" ${data === 'customer' ? 'selected' : ''}>Customer</option>
              <option value="admin" ${data === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          `;
        }
      },
      {
        data: 'status',
        render: function (data, type, row) {
          let disabled = '';
          if (row.id === loggedInUserId) disabled = 'disabled';
          if (role === 'admin' && (row.role === 'admin' || row.role === 'head_admin')) disabled = 'disabled';
          if (role === 'head_admin' && row.role === 'head_admin' && row.id !== loggedInUserId) disabled = 'disabled';

          return `
            <select class="action-select status-select" data-id="${row.id}" ${disabled}>
              <option value="active" ${data === 'active' ? 'selected' : ''}>Active</option>
              <option value="deactivated" ${data === 'deactivated' ? 'selected' : ''}>Deactivated</option>
            </select>
          `;
        }
      },
      {
        data: 'id',
        render: function (data, type, row) {
          let disabledAttr = '';
          let opacity = '1';
          let cursor = 'pointer';

          if (row.id === loggedInUserId) { disabledAttr = 'data-disabled="true"'; opacity = '0.5'; cursor = 'not-allowed'; }
          if (role === 'admin' && (row.role === 'admin' || row.role === 'head_admin')) { disabledAttr = 'data-disabled="true"'; opacity = '0.5'; cursor = 'not-allowed'; }
          if (role === 'head_admin' && row.role === 'head_admin' && row.id !== loggedInUserId) { disabledAttr = 'data-disabled="true"'; opacity = '0.5'; cursor = 'not-allowed'; }

          return `
            <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-start;">
              <button class="edit-btn" data-id="${data}" ${disabledAttr} style="font-family: 'Montserrat', sans-serif; background:none; border:none; color:var(--accent-gold); cursor:${cursor}; opacity:${opacity}; font-size:0.8rem; font-weight:500; display:flex; align-items:center;"><i data-lucide="edit-2" style="width:14px;height:14px;margin-right:4px;"></i> Edit</button>
              <button class="delete-btn" data-id="${data}" ${disabledAttr} style="font-family: 'Montserrat', sans-serif; background:none; border:none; color:#991b1b; cursor:${cursor}; opacity:${opacity}; font-size:0.8rem; font-weight:500; display:flex; align-items:center;"><i data-lucide="trash-2" style="width:14px;height:14px;margin-right:4px;"></i> Delete</button>
            </div>
          `;
        }
      }
    ],
    drawCallback: function () {
      if (window.lucide) { lucide.createIcons(); }
    }
  });

  $('#usersTable').on('click', '.copyable-id', function () {
    const text = $(this).data('clipboard-text');
    navigator.clipboard.writeText(text).then(() => {
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, customClass: { popup: 'swal2-toast' } });
      Toast.fire({ icon: 'success', title: 'ID copied to clipboard!' });
    });
  });

  $('#usersTable tbody').on('change', '.role-select', function () {
    const userId = $(this).data('id');
    const newRole = $(this).val();

    $.ajax({
      url: `/api/admin/users/${userId}/role`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ role: newRole }),
      success: function (res) {
        const Toast = Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000, customClass: { popup: 'swal2-toast' } });
        Toast.fire({ icon: 'success', title: 'Role Updated' });
        table.ajax.reload(null, false);
      },
      error: function (xhr) {
        Swal.fire('Error', xhr.responseJSON.error || 'Failed to update role', 'error');
        table.ajax.reload(null, false);
      }
    });
  });

  $('#usersTable tbody').on('change', '.status-select', function () {
    const userId = $(this).data('id');
    const newStatus = $(this).val();

    $.ajax({
      url: `/api/admin/users/${userId}/status`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ status: newStatus }),
      success: function (res) {
        const Toast = Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000, customClass: { popup: 'swal2-toast' } });
        Toast.fire({ icon: 'success', title: 'Status Updated' });
        table.ajax.reload(null, false);
      },
      error: function (xhr) {
        Swal.fire('Error', xhr.responseJSON?.error || 'Failed to update status', 'error');
        table.ajax.reload(null, false);
      }
    });
  });

  $('#closeModal').on('click', function () {
    $('#userModal').removeClass('active');
  });

  $(window).on('click', function (e) {
    if ($(e.target).is('#userModal')) {
      $('#userModal').removeClass('active');
    }
  });
  $(document).on('keydown', function (e) {
    if (e.key === "Escape") {
      $('#userModal').removeClass('active');
    }
  });

  $('#usersTable tbody').on('click', '.edit-btn', function () {
    if ($(this).attr('data-disabled') === 'true') {
      const Toast = Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000, customClass: { popup: 'swal2-toast' } });
      Toast.fire({ icon: 'error', title: 'Permission Denied: You cannot modify this user.' });
      return;
    }

    const tr = $(this).closest('tr');
    const rowData = table.row(tr).data();

    $('#modalTitle').text('Edit User');
    $('#userId').val(rowData.id);
    $('#firstName').val(rowData.firstName);
    $('#lastName').val(rowData.lastName);
    $('#email').val(rowData.email).prop('disabled', true).css({ 'background': '#f9fafb', 'color': '#9ca3af', 'cursor': 'not-allowed' });
    $('#passwordGroup').show();
    $('#passwordGroup label').text('NEW PASSWORD (Optional)');
    $('#password').val('');
    $('#roleGroup').hide();
    $('.auth-error-banner').remove();
    $('#userModal').addClass('active');
  });

  $('#usersTable tbody').on('click', '.delete-btn', function () {
    if ($(this).attr('data-disabled') === 'true') {
      const Toast = Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000, customClass: { popup: 'swal2-toast' } });
      Toast.fire({ icon: 'error', title: 'Permission Denied: You cannot modify this user.' });
      return;
    }

    const id = $(this).data('id');
    Swal.fire({
      title: 'Delete User?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `/api/admin/users/${id}`,
          type: 'DELETE',
          success: function (res) {
            Swal.fire('Deleted!', res.message, 'success');
            table.ajax.reload();
          },
          error: function (xhr) {
            Swal.fire('Error!', xhr.responseJSON?.error || 'Error deleting user', 'error');
          }
        });
      }
    });
  });

  $('#closeModal').on('click', function () {
    $('#userModal').removeClass('active');
  });

  $(window).on('click', function (e) {
    if ($(e.target).is('#userModal')) {
      $('#userModal').removeClass('active');
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $('#userModal').hasClass('active')) {
      $('#userModal').removeClass('active');
    }
  });

  $('#userForm').validate({
    rules: {
      firstName: "required",
      lastName: "required"
    },
    messages: {
      firstName: "First name is required",
      lastName: "Last name is required"
    },
    submitHandler: function (form) {
      const id = $('#userId').val();
      const method = 'PUT';
      const url = `/api/admin/users/${id}`;

      const data = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val()
      };

      const pwd = $('#password').val();
      if (pwd) {
        data.password = pwd;
      }

      $('.auth-error-banner').remove();

      $.ajax({
        url: url,
        type: method,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
          $('#userModal').removeClass('active');
          Swal.fire('Success', res.message, 'success');
          table.ajax.reload();
        },
        error: function (xhr) {
          const errMsg = xhr.responseJSON?.error || 'Failed to save user.';
          $('<div class="auth-error-banner"><i data-lucide="alert-circle" style="width: 20px; height: 20px;"></i> <span>' + errMsg + '</span></div>')
            .insertBefore('#userForm');
          if (window.lucide) { window.lucide.createIcons(); }
        }
      });
    }
  });

  $('#logoutBtn').click(function (e) {
    e.preventDefault();
    $.post('/api/auth/logout', function () {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }).fail(function () {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    });
  });
});
