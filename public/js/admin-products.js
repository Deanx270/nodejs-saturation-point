$(document).ready(function () {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token || (role !== 'admin' && role !== 'head_admin')) {
    window.location.replace('/404');
    return;
  }

  $('body').fadeIn(200);

  let uploadFiles = new DataTransfer();
  let existingImages = [];

  function loadBrands() {
    $.ajax({
      url: '/api/brands',
      type: 'GET',
      success: function (brands) {
        let options = '<option value="">Select a brand...</option>';
        brands.forEach(b => {
          options += `<option value="${b.id}">${b.name}</option>`;
        });
        $('#brandId').html(options);
      }
    });
  }
  loadBrands();

  function loadCategories() {
    $.ajax({
      url: '/api/categories',
      type: 'GET',
      success: function (categories) {
        let options = '<option value="">Select a category...</option>';
        categories.forEach(c => {
          options += `<option value="${c.id}">${c.name}</option>`;
        });
        $('#categoryId').html(options);
      }
    });
  }
  loadCategories();

  $.fn.dataTable.ext.errMode = 'none';
  const dt = $('#productsTable').on('xhr.dt', function (e, settings, json, xhr) {
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
      url: '/api/products?limit=1000',
      dataSrc: ''
    },
    columns: [
      {
        data: 'images', render: function (data) {
          if (data && data.length > 0) {
            return `<img src="${data[0]}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; box-shadow: var(--shadow-hover);">`;
          }
          return `<div style="width: 40px; height: 40px; background: #eee; border-radius: 4px;"></div>`;
        }
      },
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
      { data: 'Brand.name', defaultContent: '-' },
      { data: 'categoryId', render: function (data) { return `<span style="text-transform: capitalize;">${data}</span>`; } },
      { data: 'price', render: function (data) { return `₱${parseFloat(data).toLocaleString('en-US', { minimumFractionDigits: 2 })}`; } },
      { data: 'stock' },
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

  $('#addProductBtn').on('click', function () {
    $('#modalTitle').text('Add Product');
    $('#productForm')[0].reset();
    $('#productId').val('');
    uploadFiles = new DataTransfer();
    updateImageGrid();
    $('.auth-error-banner').remove();
    $('#productModal').addClass('active');
  });

  $('#closeModal').on('click', function () {
    $('#productModal').removeClass('active');
  });

  $(window).on('click', function (e) {
    if ($(e.target).is('#productModal')) {
      $('#productModal').removeClass('active');
    }
  });
  $(document).on('keydown', function (e) {
    if (e.key === "Escape") {
      $('#productModal').removeClass('active');
    }
  });

  const dropzone = $('#dropzone');
  const fileInput = $('#images');

  dropzone.on('click', function () {
    fileInput.click();
  });

  dropzone.on('dragover', function (e) {
    e.preventDefault();
    dropzone.addClass('dragover');
  });

  dropzone.on('dragleave', function (e) {
    e.preventDefault();
    dropzone.removeClass('dragover');
  });

  dropzone.on('drop', function (e) {
    e.preventDefault();
    dropzone.removeClass('dragover');
    const files = e.originalEvent.dataTransfer.files;
    handleFiles(files);
  });

  fileInput.on('change', function (e) {
    handleFiles(e.target.files);
  });

  function handleFiles(files) {
    if (existingImages.length + uploadFiles.files.length + files.length > 5) {
      Swal.fire('Limit Reached', 'You can only have a maximum of 5 images.', 'warning');
      return;
    }

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('File Too Large', `${file.name} exceeds the 5MB limit.`, 'warning');
        return;
      }
      uploadFiles.items.add(file);
    });

    updateImageGrid();
  }

  function updateImageGrid() {
    const grid = $('#imagePreviewGrid');
    grid.empty();

    fileInput[0].files = uploadFiles.files;

    existingImages.forEach((url, index) => {
      const thumb = $(`
        <div class="thumbnail-wrapper is-existing" data-url="${url}">
          <img src="${url}" alt="Preview">
          <button type="button" class="set-main-btn" title="Set as Main Image"><i data-lucide="star" style="width:12px;height:12px;"></i></button>
          <button type="button" class="remove-thumb"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
        </div>
      `);
      grid.append(thumb);
    });

    Array.from(uploadFiles.files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const thumb = $(`
          <div class="thumbnail-wrapper is-new" data-index="${index}">
            <img src="${e.target.result}" alt="Preview">
            <button type="button" class="set-main-btn" title="Set as Main Image"><i data-lucide="star" style="width:12px;height:12px;"></i></button>
            <button type="button" class="remove-thumb"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
          </div>
        `);
        grid.append(thumb);
        if (window.lucide) { window.lucide.createIcons(); }
      }
      reader.readAsDataURL(file);
    });

    setTimeout(() => { if (window.lucide) { window.lucide.createIcons(); } }, 50);
  }

  $('#imagePreviewGrid').on('click', '.remove-thumb', function (e) {
    e.stopPropagation();
    const wrapper = $(this).closest('.thumbnail-wrapper');

    if (wrapper.hasClass('is-existing')) {
      const url = wrapper.data('url');
      existingImages = existingImages.filter(img => img !== url);
      updateImageGrid();
    } else {
      const indexToRemove = wrapper.data('index');
      const dt = new DataTransfer();
      Array.from(uploadFiles.files).forEach((file, index) => {
        if (index !== indexToRemove) {
          dt.items.add(file);
        }
      });
      uploadFiles = dt;
      updateImageGrid();
    }
  });

  $('#imagePreviewGrid').on('click', '.set-main-btn', function (e) {
    e.stopPropagation();
    const wrapper = $(this).closest('.thumbnail-wrapper');
    wrapper.prependTo('#imagePreviewGrid');
  });

  $('#productsTable tbody').on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    Swal.fire({
      title: 'Delete Product?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `/api/products/${id}`,
          type: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token },
          success: function (res) {
            Swal.fire('Deleted!', res.message, 'success');
            dt.ajax.reload(null, false);
          },
          error: function (xhr) {
            Swal.fire('Error!', xhr.responseJSON?.error || 'Error deleting product', 'error');
          }
        });
      }
    });
  });

  $('#productsTable tbody').on('click', '.edit-btn', function () {
    const id = $(this).data('id');
    $.ajax({
      url: `/api/products/${id}`,
      type: 'GET',
      success: function (product) {
        $('#modalTitle').text('Edit Product');
        $('#productId').val(product.id);
        $('#name').val(product.name);
        $('#brandId').val(product.brandId);
        $('#categoryId').val(product.categoryId);
        $('#price').val(product.price);
        $('#stock').val(product.stock);
        $('#description').val(product.description);

        existingImages = product.images || [];
        uploadFiles = new DataTransfer();
        updateImageGrid();

        $('.auth-error-banner').remove();
        $('#productModal').addClass('active');
      }
    });
  });

  $('#productForm').validate({
    rules: {
      name: { required: true },
      brandId: { required: true },
      categoryId: { required: true },
      price: { required: true, number: true, min: 0 },
      stock: { required: true, digits: true, min: 0 }
    },
    errorElement: 'label',
    submitHandler: function (form) {
      const id = $('#productId').val();
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/products/${id}` : '/api/products';

      let formData = new FormData(form);
      if (!id) formData.delete('id');

      let imageOrder = [];
      $('#imagePreviewGrid .thumbnail-wrapper').each(function () {
        if ($(this).hasClass('is-existing')) {
          imageOrder.push($(this).data('url'));
        } else if ($(this).hasClass('is-new')) {
          imageOrder.push('new');
        }
      });
      formData.append('imageOrder', JSON.stringify(imageOrder));

      if (imageOrder.length > 5) {
        Swal.fire('Limit Reached', 'Maximum 5 images allowed.', 'warning');
        return false;
      }

      $('.auth-error-banner').remove();

      $.ajax({
        url: url,
        type: method,
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'Authorization': 'Bearer ' + token },
        success: function (res) {
          $('#productModal').removeClass('active');
          Swal.fire('Success!', res.message, 'success');
          dt.ajax.reload(null, false);
        },
        error: function (xhr) {
          const errMsg = xhr.responseJSON?.error || 'Failed to save product.';
          $('<div class="auth-error-banner"><i data-lucide="alert-circle" style="width: 20px; height: 20px;"></i> <span>' + errMsg + '</span></div>')
            .insertBefore('#productForm');
          if (window.lucide) { window.lucide.createIcons(); }
        }
      });
      return false;
    }
  });
});
