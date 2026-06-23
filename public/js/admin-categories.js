$(document).ready(function () {
  if (window.lucide) { window.lucide.createIcons(); }

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  $('body').fadeIn(200);

  $.fn.dataTable.ext.errMode = 'none';
  const table = $('#categoriesTable').on('xhr.dt', function (e, settings, json, xhr) {
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
      url: '/api/categories',
      type: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
      dataSrc: ''
    },
    columns: [
      { data: 'id' },
      { data: 'name' },
      {
        data: 'description',
        render: function (data) {
          return data ? (data.length > 50 ? data.substring(0, 50) + '...' : data) : 'No description';
        }
      },
      {
        data: 'productCount',
        render: function (data) {
          return `<span class="badge" style="background: var(--bg-subtle); color: var(--text-main); border: 1px solid var(--border-subtle);">${data || 0} Products</span>`;
        }
      },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
            <div style="display:flex; gap: 8px;">
              <button class="edit-btn" data-id="${row.id}" style="background:none;border:none;cursor:pointer;color:var(--text-main); transition: color 0.2s;" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="delete-btn" data-id="${row.id}" data-count="${row.productCount || 0}" style="background:none;border:none;cursor:pointer;color:#dc2626; transition: color 0.2s;" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </div>
          `;
        }
      }
    ],
    drawCallback: function () {
      if (window.lucide) { lucide.createIcons(); }
    }
  });

  $('#addCategoryBtn').click(function () {
    $('#isEdit').val('false');
    $('#modalTitle').text('Add Category');
    $('#categoryForm')[0].reset();
    $('#categoryId').prop('readonly', false).css('background', '#fff');
    $('#categoryModal').addClass('active');
  });

  $('#closeCategoryModal').click(function () {
    $('#categoryModal').removeClass('active');
  });

  $('#categoriesTable').on('click', '.edit-btn', function () {
    const id = $(this).data('id');
    const rowData = table.row($(this).parents('tr')).data();

    $('#isEdit').val('true');
    $('#modalTitle').text('Edit Category');
    $('#categoryForm').data('original-id', rowData.id);

    $('#categoryId').val(rowData.id).prop('readonly', true).css('background', '#f3f4f6');
    $('#categoryName').val(rowData.name);
    $('#categoryDescription').val(rowData.description);

    $('#categoryModal').addClass('active');
  });

  $('#categoryForm').submit(function (e) {
    e.preventDefault();

    const isEdit = $('#isEdit').val() === 'true';
    const id = $('#categoryId').val().trim();
    const name = $('#categoryName').val().trim();
    const description = $('#categoryDescription').val().trim();

    if (!isEdit) {
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(id)) {
        showToast('ID must contain only lowercase letters, numbers, and hyphens.', 'error');
        return;
      }
    }

    const payload = { id, name, description };

    let url = '/api/categories';
    if (isEdit) {
      const originalId = $('#categoryForm').data('original-id');
      url = `/api/categories/${originalId}`;
    }

    const type = isEdit ? 'PUT' : 'POST';

    const btn = $('#saveCategoryBtn');
    const originalText = btn.text();
    btn.text('Saving...').prop('disabled', true);

    $.ajax({
      url: url,
      type: type,
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + token },
      data: JSON.stringify(payload),
      success: function (response) {
        $('#categoryModal').removeClass('active');
        table.ajax.reload(null, false);
        showToast(isEdit ? 'Category updated successfully' : 'Category created successfully');
      },
      error: function (err) {
        const msg = err.responseJSON && err.responseJSON.error ? err.responseJSON.error : 'Failed to save category';
        showToast(msg, 'error');
      },
      complete: function () {
        btn.text(originalText).prop('disabled', false);
      }
    });
  });

  $('#categoriesTable').on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    const count = parseInt($(this).data('count') || 0);

    if (count > 0) {
      Swal.fire({
        title: 'Cannot Delete',
        text: `This category contains ${count} product(s). Please reassign or delete them first.`,
        icon: 'error',
        confirmButtonColor: '#1B263B',
        customClass: { popup: 'premium-swal-popup' }
      });
      return;
    }

    Swal.fire({
      title: 'Delete Category?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#E5E7EB',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: '<span style="color: #374151">Cancel</span>',
      customClass: { popup: 'premium-swal-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `/api/categories/${id}`,
          type: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token },
          success: function (res) {
            table.ajax.reload(null, false);
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, customClass: { popup: 'swal2-toast' } });
            Toast.fire({ icon: 'success', title: 'Category deleted' });
          },
          error: function (err) {
            const errorMsg = err.responseJSON && err.responseJSON.error ? err.responseJSON.error : 'Delete failed';
            Swal.fire({
              title: 'Error',
              text: errorMsg,
              icon: 'error',
              confirmButtonColor: '#1B263B'
            });
          }
        });
      }
    });
  });
});
