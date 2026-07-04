$(document).ready(function () {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  $('body').fadeIn(200);

  let payload;
  try {
    payload = JSON.parse(atob(token.split('.')[1]));

    $.ajax({
      url: '/api/auth/me',
      headers: { 'Authorization': 'Bearer ' + token },
      success: function (user) {
        $('#firstName').val(user.firstName).trigger('input');
        $('#lastName').val(user.lastName).trigger('input');
        $('#email').val(user.email);

        if (user.profilePicture) {
          $('#avatarImage').attr('src', user.profilePicture);
        }
        $('#avatarImage').show();
        $('#avatarPreview').addClass('has-image');
      },
      error: function () {
        $('#firstName').val(payload.firstName || '').trigger('input');
        $('#lastName').val(payload.lastName || '').trigger('input');
        $('#email').val(payload.email || '');

        $('#avatarImage').show();
        $('#avatarPreview').addClass('has-image');
      }
    });
  } catch (e) {
    window.location.href = '/login';
    return;
  }

  $('#avatarPreview').click(function () {
    $('#profilePicture').click();
  });

  $('#profilePicture').click(function(e) {
    e.stopPropagation();
  });

  $('#firstName, #lastName').on('input', function() {
    let val = $(this).val();
    val = val.replace(/[^a-zA-Z\s]/g, '');
    val = val.replace(/\b[a-z]/g, char => char.toUpperCase());
    if (val.length > 50) val = val.substring(0, 50);
    $(this).val(val);
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

  $('#profileForm').validate({
    rules: {
      firstName: { required: true },
      lastName: { required: true }
    },
    submitHandler: function (form) {
      const btn = $('#saveProfileBtn');
      const originalText = btn.text();
      btn.text('Saving...').prop('disabled', true);
      $('.auth-error-banner').remove();

      const formData = new FormData(form);

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
    }
  });

  $.fn.dataTable.ext.errMode = 'none';
  const table = $('#myTransactionsTable').DataTable({
    ajax: {
      url: '/api/transactions/me',
      headers: { 'Authorization': 'Bearer ' + token },
      dataSrc: ''
    },
    columns: [
      { 
        data: 'id',
        render: function(data, type, row) {
          if (type !== 'display') return data;
          const shortId = data.split('-')[0];
          let imgHtml = '';
          if (row.TransactionItems && row.TransactionItems.length > 0) {
            const product = row.TransactionItems[0].Product;
            const imgUrl = product && product.images && product.images.length > 0 ? product.images[0] : '/images/default-avatar.png';
            imgHtml = `<div style="width: 40px; height: 40px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-subtle); display: inline-block; vertical-align: middle; margin-right: 12px;"><img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;"></div>`;
          }
          return `<div style="display: flex; align-items: center;">${imgHtml}<span style="font-family: monospace; font-weight: 500;">#${shortId}</span></div>`;
        }
      },
      { 
        data: 'createdAt',
        render: function(data, type) {
          if (type !== 'display') return data;
          return new Date(data).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
      },
      { 
        data: 'totalAmount',
        render: function(data, type) {
          if (type !== 'display') return parseFloat(data) || 0;
          return `PHP ${parseFloat(data).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        }
      },
      { 
        data: 'status',
        render: function(data, type) {
          if (type === 'sort') {
            const statusOrder = { 'pending': 1, 'shipped': 2, 'delivered': 3, 'cancelled': 4 };
            return statusOrder[data] || 99;
          }
          if (type !== 'display') return data;

          let badgeClass = 'badge customer';
          if(data === 'delivered') badgeClass = 'badge active';
          else if(data === 'cancelled') badgeClass = 'badge deactivated';
          else if(data === 'shipped') badgeClass = 'badge admin';
          else if(data === 'pending') badgeClass = 'badge pending_verification';
          
          return `<span class="${badgeClass}">${data}</span>`;
        }
      },
      { data: 'paymentMethod' }
    ],
    order: [[1, 'desc']],
    pageLength: 10,
    dom: '<"top"f>rt<"bottom"p><"clear">',
    language: {
      search: "",
      searchPlaceholder: "Search orders...",
      emptyTable: "You have no previous orders"
    }
  });

  $('#myTransactionsTable tbody').on('click', 'tr', function(e) {
    const rowData = table.row(this).data();
    if (!rowData) return;

    $('#modalCustomerName').text($('#firstName').val() + ' ' + $('#lastName').val());
    $('#modalCustomerEmail').text($('#email').val());

    $('#modalDate').text(new Date(rowData.createdAt).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    }));
    $('#modalPayment').text(rowData.paymentMethod);
    
    let badgeClass = 'badge customer';
    if(rowData.status === 'delivered') badgeClass = 'badge active';
    else if(rowData.status === 'cancelled') badgeClass = 'badge deactivated';
    else if(rowData.status === 'shipped') badgeClass = 'badge admin';
    else if(rowData.status === 'pending') badgeClass = 'badge pending_verification';

    $('#modalStatusBadge').attr('class', badgeClass).text(rowData.status);

    $('#modalTotal').text('PHP ' + parseFloat(rowData.totalAmount).toLocaleString(undefined, {minimumFractionDigits: 2}));

    const productsList = $('#modalProductsList');
    productsList.empty();

    if (rowData.TransactionItems && rowData.TransactionItems.length > 0) {
      rowData.TransactionItems.forEach(item => {
        const product = item.Product;
        const name = product ? product.name : 'Unknown Product';
        const img = product && product.images && product.images.length > 0 ? product.images[0] : '/images/default-avatar.png';
        const price = parseFloat(item.price).toLocaleString(undefined, {minimumFractionDigits: 2});
        
        productsList.append(`
          <div style="display: flex; gap: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
            <div style="width: 60px; height: 60px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-subtle); flex-shrink: 0;">
              <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
              <span style="font-weight: 500; font-size: 0.95rem;">${name}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Qty: ${item.quantity} &times; PHP ${price}</span>
            </div>
            <div style="display: flex; align-items: center; font-weight: 600;">
              PHP ${(item.quantity * item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
          </div>
        `);
      });
      
      const subtotal = parseFloat(rowData.totalAmount) - 150;
      productsList.append(`
        <div style="display: flex; justify-content: space-between; padding-top: 12px; font-size: 0.9rem;">
          <span style="color: var(--text-muted);">Subtotal</span>
          <span style="font-weight: 500;">PHP ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
          <span style="color: var(--text-muted);">Shipping Fee</span>
          <span style="font-weight: 500;">PHP 150.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 12px; margin-top: 4px; border-top: 1px dashed var(--border-subtle); font-size: 1.1rem;">
          <span style="font-weight: 600; color: var(--text-main);">Grand Total</span>
          <span style="font-weight: 700; color: var(--accent-gold);">PHP ${parseFloat(rowData.totalAmount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
      `);
    }

    $('#transactionModal').addClass('active');
  });

  $('#closeTransactionModal').on('click', function() { $('#transactionModal').removeClass('active'); });
  $(window).on('click', function(e) { if ($(e.target).is('#transactionModal')) { $('#transactionModal').removeClass('active'); } });
  $(document).on('keydown', function(e) { if (e.key === "Escape") { $('#transactionModal').removeClass('active'); } });

});
