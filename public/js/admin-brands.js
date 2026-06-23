$(document).ready(function () {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token || (role !== 'admin' && role !== 'head_admin')) {
    window.location.replace('/404');
    return;
  }

  $('body').fadeIn(200);

  $.fn.dataTable.ext.errMode = 'none';
  const dt = $('#brandsTable').on('xhr.dt', function (e, settings, json, xhr) {
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
      url: '/api/brands',
      dataSrc: ''
    },
    columns: [
      {
        data: 'name', render: function (data, type) {
          if (!data) return '-';
          const safeData = typeof data === 'string' ? data.replace(/"/g, '&quot;') : data;
          if (type === 'display' && data.length > 20) {
            return `<span title="${safeData}" style="cursor: help; border-bottom: 1px dotted #ccc;">${data.substr(0, 20)}...</span>`;
          }
          return `<span title="${safeData}">${data}</span>`;
        }
      },
      {
        data: 'origin', render: function (data, type) {
          if (!data) return '-';
          const safeData = typeof data === 'string' ? data.replace(/"/g, '&quot;') : data;
          if (type === 'display' && data.length > 20) {
            return `<span title="${safeData}" style="cursor: help; border-bottom: 1px dotted #ccc;">${data.substr(0, 20)}...</span>`;
          }
          return `<span title="${safeData}">${data}</span>`;
        }
      },
      {
        data: 'status', render: function (data, type, row) {
          if (type !== 'display') return data;
          return `
            <select class="action-select status-select" data-id="${row.id}" style="margin:0;">
              <option value="active" ${data === 'active' ? 'selected' : ''}>Active</option>
              <option value="inactive" ${data === 'inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          `;
        }
      },
      {
        data: 'id', render: function (data, type, row) {
          return `
            <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-start;">
              <button class="edit-btn" data-id="${data}" style="font-family: 'Montserrat', sans-serif; background:none; border:none; color:var(--accent-gold); cursor:pointer; font-size:0.8rem; font-weight:500; display:flex; align-items:center;"><i data-lucide="edit-2" style="width:14px;height:14px;margin-right:4px;"></i> Edit</button>
              <button class="delete-btn" data-id="${data}" style="font-family: 'Montserrat', sans-serif; background:none; border:none; color:#991b1b; cursor:pointer; font-size:0.8rem; font-weight:500; display:flex; align-items:center;"><i data-lucide="trash-2" style="width:14px;height:14px;margin-right:4px;"></i> Delete</button>
            </div>
          `;
        }
      }
    ],
    drawCallback: function () {
      if (window.lucide) { lucide.createIcons(); }
    }
  });

  $('#brandsTable tbody').on('change', '.status-select', function () {
    const id = $(this).data('id');
    const newStatus = $(this).val();

    $.ajax({
      url: `/api/brands/${id}`,
      type: 'PUT',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + token },
      data: JSON.stringify({ status: newStatus }),
      success: function (res) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Status updated', showConfirmButton: false, timer: 3000 });
      },
      error: function (xhr) {
        Swal.fire('Error', xhr.responseJSON?.error || 'Failed to update status', 'error');
        dt.ajax.reload(null, false);
      }
    });
  });

  $('#addBrandBtn').on('click', function () {
    $('#modalTitle').text('Add Brand');
    $('#brandForm')[0].reset();
    $('#brandId').val('');
    $('.auth-error-banner').remove();
    $('#brandModal').addClass('active');
  });

  $('#closeModal').on('click', function () {
    $('#brandModal').removeClass('active');
  });

  $(window).on('click', function (e) {
    if ($(e.target).is('#brandModal')) {
      $('#brandModal').removeClass('active');
    }
  });
  $(document).on('keydown', function (e) {
    if (e.key === "Escape") {
      $('#brandModal').removeClass('active');
    }
  });

  $('#brandsTable tbody').on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    Swal.fire({
      title: 'Delete Brand?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `/api/brands/${id}`,
          type: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token },
          success: function (res) {
            Swal.fire('Deleted!', res.message, 'success');
            dt.ajax.reload();
          },
          error: function (xhr) {
            Swal.fire('Error!', xhr.responseJSON?.error || 'Error deleting brand', 'error');
          }
        });
      }
    });
  });

  $('#brandsTable tbody').on('click', '.edit-btn', function () {
    const id = $(this).data('id');
    $.ajax({
      url: `/api/brands/${id}`,
      type: 'GET',
      success: function (brand) {
        $('#modalTitle').text('Edit Brand');
        $('#brandId').val(brand.id);
        $('#name').val(brand.name);
        $('#origin').val(brand.origin);
        $('#description').val(brand.description);
        $('#status').val(brand.status);
        $('.auth-error-banner').remove();
        $('#brandModal').addClass('active');
      }
    });
  });

  $('#brandForm').validate({
    rules: {
      name: { required: true }
    },
    messages: {
      name: "Please enter a brand name."
    },
    errorElement: 'label',
    submitHandler: function (form) {
      const id = $('#brandId').val();
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/brands/${id}` : '/api/brands';

      const data = {
        name: $('#name').val(),
        origin: $('#origin').val(),
        description: $('#description').val(),
        status: $('#status').val()
      };

      $('.auth-error-banner').remove();

      $.ajax({
        url: url,
        type: method,
        contentType: 'application/json',
        headers: { 'Authorization': 'Bearer ' + token },
        data: JSON.stringify(data),
        success: function (res) {
          $('#brandModal').removeClass('active');
          Swal.fire('Success', res.message, 'success');
          dt.ajax.reload();
        },
        error: function (xhr) {
          const errMsg = xhr.responseJSON?.error || 'Failed to save brand.';
          $('<div class="auth-error-banner"><i data-lucide="alert-circle" style="width: 20px; height: 20px;"></i> <span>' + errMsg + '</span></div>')
            .insertBefore('#brandForm');
          if (window.lucide) { window.lucide.createIcons(); }
        }
      });
      return false;
    }
  });
});
