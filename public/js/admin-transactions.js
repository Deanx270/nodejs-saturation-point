$(document).ready(function() {
  if (window.lucide) { window.lucide.createIcons(); }

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  $('body').fadeIn(200);

  const table = $('#transactionsTable').DataTable({
    ajax: {
      url: '/api/admin/transactions',
      type: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
      dataSrc: ''
    },
    createdRow: function(row, data, dataIndex) {
      $(row).css('cursor', 'pointer');
      $(row).hover(
        function() { $(this).css('background-color', '#fafafa'); },
        function() { $(this).css('background-color', ''); }
      );
    },
    order: [[2, 'desc']],
    columns: [
      { data: 'id', render: function(data, type, row) {
          if (type === 'display' && data.length > 8) {
              return `<span title="Order ID: ${data}" style="border-bottom: 1px dotted #ccc; color: var(--accent-gold); transition: color 0.2s ease;">${data.substr(0, 8)}...</span>`;
          }
          return `<span title="Order ID: ${data}" style="border-bottom: 1px dotted #ccc; color: var(--accent-gold); transition: color 0.2s ease;">${data}</span>`;
      }},
      { 
        data: null,
        render: function(data, type, row) {
          if (row.User) {
            return `${row.User.firstName} ${row.User.lastName} <br><small style="color:var(--text-muted)">${row.User.email}</small>`;
          }
          return 'Guest';
        }
      },
      { 
        data: 'createdAt',
        render: function(data) {
          return new Date(data).toLocaleString();
        }
      },
      { 
        data: 'totalAmount',
        render: function(data) {
          return '₱' + parseFloat(data).toLocaleString(undefined, {minimumFractionDigits: 2});
        }
      },
      { data: 'paymentMethod' },
      { 
        data: 'status',
        render: function(data, type, row) {
          if (type !== 'display') return data;
          const statuses = ['pending', 'shipped', 'delivered', 'cancelled'];
          const isDisabled = (data === 'cancelled' || data === 'delivered') ? 'disabled' : '';
          
          let options = '';
          statuses.forEach(s => {
            if (data !== 'pending' && s === 'pending') return;
            if (data === 'pending' && s === 'delivered') return;
            const selected = s === data ? 'selected' : '';
            options += `<option value="${s}" ${selected}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`;
          });
          
          return `
            <select class="action-select status-select" data-id="${row.id}" data-original="${data}" ${isDisabled}>
              ${options}
            </select>
          `;
        }
      }
    ],
    language: {
      emptyTable: "No transactions found"
    }
  });

  // Handle copyable IDs
  $('#transactionsTable').on('click', '.copyable-id', function(e) {
    e.stopPropagation();
    const text = $(this).data('clipboard-text');
    navigator.clipboard.writeText(text).then(() => {
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, customClass: { popup: 'swal2-toast' } });
      Toast.fire({ icon: 'success', title: 'Order ID copied to clipboard!' });
    });
  });

  function updateTransactionStatus($selectElement, isModal) {
    const id = $selectElement.data('id');
    const newStatus = $selectElement.val();
    const originalStatus = $selectElement.data('original');

    Swal.fire({
      title: '<span style="font-family: \'Playfair Display\', serif;">Update Status?</span>',
      html: `<div style="font-family: 'Inter', sans-serif;">Change order status to <strong>${newStatus}</strong>?</div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it',
      confirmButtonColor: '#0C0A09',
      cancelButtonColor: '#E5E7EB',
      cancelButtonText: '<span style="color: #374151">Cancel</span>',
      customClass: { popup: 'premium-swal-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `/api/admin/transactions/${id}/status`,
          type: 'PUT',
          contentType: 'application/json',
          headers: { 'Authorization': 'Bearer ' + token },
          data: JSON.stringify({ status: newStatus }),
          success: function(res) {
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, customClass: { popup: 'swal2-toast' } });
            Toast.fire({ icon: 'success', title: 'Status updated' });
            table.ajax.reload(null, false);
            if (isModal) {
              $selectElement.data('original', newStatus);
              $('#modalStatusBadge').text(newStatus).css({
                background: newStatus === 'pending' ? '#fefce8' : (newStatus === 'shipped' ? '#eff6ff' : (newStatus === 'delivered' ? '#f0fdf4' : '#fef2f2')),
                color: newStatus === 'pending' ? '#854d0e' : (newStatus === 'shipped' ? '#1e40af' : (newStatus === 'delivered' ? '#166534' : '#991b1b'))
              });
              if (newStatus === 'cancelled' || newStatus === 'delivered') {
                $selectElement.prop('disabled', true);
              }
            }
          },
          error: function(err) {
            $selectElement.val(originalStatus);
            const errorMsg = err.responseJSON && err.responseJSON.error ? err.responseJSON.error : 'Update failed';
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, customClass: { popup: 'swal2-toast' } });
            Toast.fire({ icon: 'error', title: errorMsg });
          }
        });
      } else {
        $selectElement.val(originalStatus);
      }
    });
  }

  $('#transactionsTable').on('change', '.status-select', function() {
    updateTransactionStatus($(this), false);
  });

  let pendingModalStatusUpdate = null;

  $('#modalStatusSelect').on('change', function() {
    const $select = $(this);
    const newStatus = $select.val();
    const originalStatus = $select.data('original');
    
    $('#inlineStatusFeedback').slideUp(150);

    if (newStatus === originalStatus) {
      $('#inlineStatusConfirm').slideUp(150);
      pendingModalStatusUpdate = null;
      return;
    }

    pendingModalStatusUpdate = { id: $select.data('id'), newStatus, originalStatus };
    
    $('#inlineStatusMsg strong').text(newStatus);
    $('#inlineStatusConfirm').slideDown(200).css('display', 'flex');
  });

  $('#inlineRejectBtn').on('click', function() {
    if (!pendingModalStatusUpdate) return;
    $('#modalStatusSelect').val(pendingModalStatusUpdate.originalStatus);
    $('#inlineStatusConfirm').slideUp(150);
    
    $('#inlineFeedbackIcon').attr('data-lucide', 'x-circle').css('color', '#9ca3af');
    $('#inlineFeedbackMsg').text('Update cancelled').css('color', '#9ca3af');
    $('#inlineStatusFeedback').slideDown(200).css('display', 'flex');
    if (window.lucide) { window.lucide.createIcons(); }
    
    setTimeout(() => { $('#inlineStatusFeedback').slideUp(200); }, 3000);
    pendingModalStatusUpdate = null;
  });

  $('#inlineConfirmBtn').on('click', function() {
    if (!pendingModalStatusUpdate) return;
    const { id, newStatus, originalStatus } = pendingModalStatusUpdate;
    const $selectElement = $('#modalStatusSelect');
    const btn = $(this);
    
    btn.text('Updating...').prop('disabled', true);

    $.ajax({
      url: `/api/admin/transactions/${id}/status`,
      type: 'PUT',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + token },
      data: JSON.stringify({ status: newStatus }),
      success: function(res) {
        table.ajax.reload(null, false);
        
        $selectElement.data('original', newStatus);
        $('#modalStatusBadge').text(newStatus).css({
          background: newStatus === 'pending' ? '#fefce8' : (newStatus === 'shipped' ? '#eff6ff' : (newStatus === 'delivered' ? '#f0fdf4' : '#fef2f2')),
          color: newStatus === 'pending' ? '#854d0e' : (newStatus === 'shipped' ? '#1e40af' : (newStatus === 'delivered' ? '#166534' : '#991b1b'))
        });
        if (newStatus === 'cancelled' || newStatus === 'delivered') {
          $selectElement.prop('disabled', true);
        }

        $('#inlineStatusConfirm').slideUp(150);
        btn.text('Confirm').prop('disabled', false);
        
        $('#inlineFeedbackIcon').attr('data-lucide', 'check-circle').css('color', '#16a34a');
        $('#inlineFeedbackMsg').text('Status successfully updated').css('color', '#16a34a');
        $('#inlineStatusFeedback').slideDown(200).css('display', 'flex');
        if (window.lucide) { window.lucide.createIcons(); }
        
        setTimeout(() => { $('#inlineStatusFeedback').slideUp(200); }, 3000);
        pendingModalStatusUpdate = null;
      },
      error: function(err) {
        $selectElement.val(originalStatus);
        const errorMsg = err.responseJSON && err.responseJSON.error ? err.responseJSON.error : 'Update failed';
        
        $('#inlineStatusConfirm').slideUp(150);
        btn.text('Confirm').prop('disabled', false);
        
        $('#inlineFeedbackIcon').attr('data-lucide', 'alert-circle').css('color', '#dc2626');
        $('#inlineFeedbackMsg').text(errorMsg).css('color', '#dc2626');
        $('#inlineStatusFeedback').slideDown(200).css('display', 'flex');
        if (window.lucide) { window.lucide.createIcons(); }
        
        setTimeout(() => { $('#inlineStatusFeedback').slideUp(200); }, 3000);
        pendingModalStatusUpdate = null;
      }
    });
  });

  // Row Click for Modal
  $('#transactionsTable tbody').on('click', 'tr', function(e) {
    if ($(e.target).closest('select, button, .copyable-id').length > 0) return;
    
    const rowData = table.row(this).data();
    if (!rowData) return;

    $('#inlineStatusConfirm, #inlineStatusFeedback').hide();
    pendingModalStatusUpdate = null;

    $('#modalOrderId').text(rowData.id);
    $('#modalCopyBtn').data('clipboard-text', rowData.id);
    $('#modalDate').text(new Date(rowData.createdAt).toLocaleString());
    $('#modalPayment').text(rowData.paymentMethod);
    $('#modalTotal').text('₱' + parseFloat(rowData.totalAmount).toLocaleString(undefined, {minimumFractionDigits: 2}));
    
    if (rowData.User) {
      $('#modalCustomerName').text(`${rowData.User.firstName} ${rowData.User.lastName}`);
      $('#modalCustomerEmail').text(rowData.User.email);
    } else {
      $('#modalCustomerName').text('Guest User');
      $('#modalCustomerEmail').text('N/A');
    }

    const $modalSelect = $('#modalStatusSelect');
    $modalSelect.empty();
    ['pending', 'shipped', 'delivered', 'cancelled'].forEach(s => {
      if (rowData.status !== 'pending' && s === 'pending') return;
      if (rowData.status === 'pending' && s === 'delivered') return;
      $modalSelect.append(`<option value="${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</option>`);
    });
    
    $modalSelect.val(rowData.status).data('id', rowData.id).data('original', rowData.status);
    $modalSelect.prop('disabled', (rowData.status === 'cancelled' || rowData.status === 'delivered'));
    $('#modalStatusBadge').text(rowData.status).css({
      background: rowData.status === 'pending' ? '#fefce8' : (rowData.status === 'shipped' ? '#eff6ff' : (rowData.status === 'delivered' ? '#f0fdf4' : '#fef2f2')),
      color: rowData.status === 'pending' ? '#854d0e' : (rowData.status === 'shipped' ? '#1e40af' : (rowData.status === 'delivered' ? '#166534' : '#991b1b'))
    });

    const $productsList = $('#modalProductsList');
    $productsList.empty();
    
    if (rowData.TransactionItems && rowData.TransactionItems.length > 0) {
      rowData.TransactionItems.forEach(item => {
        const product = item.Product;
        const img = (product && product.images && product.images.length > 0) ? product.images[0] : '';
        const imgHtml = img ? `<img src="${img}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; box-shadow: var(--shadow-liquid);">` : `<div style="width: 50px; height: 50px; background: #eee; border-radius: 4px;"></div>`;
        const name = product ? product.name : 'Unknown Product';
        const price = parseFloat(item.price).toLocaleString(undefined, {minimumFractionDigits: 2});
        const subtotal = parseFloat(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2});
        
        $productsList.append(`
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #fff; border: 1px solid var(--border-subtle); border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.02); transition: transform 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 16px;">
              ${imgHtml}
              <div>
                <p style="margin: 0; font-weight: 500; font-size: 0.95rem; color: var(--text-main);">${name}</p>
                <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: var(--text-muted);">${item.quantity} × ₱${price}</p>
              </div>
            </div>
            <div style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">₱${subtotal}</div>
          </div>
        `);
      });
    } else {
      $productsList.append('<p style="color: var(--text-muted); font-size: 0.9rem;">No items found.</p>');
    }

    $('#transactionModal').addClass('active');
  });

  // Modal Close Actions
  $('#closeTransactionModal').on('click', function() { $('#transactionModal').removeClass('active'); });
  $(window).on('click', function(e) { if ($(e.target).is('#transactionModal')) { $('#transactionModal').removeClass('active'); } });
  $(document).on('keydown', function(e) { if (e.key === "Escape") { $('#transactionModal').removeClass('active'); } });

  $('#modalCopyBtn').on('click', function() {
    const text = $(this).data('clipboard-text');
    navigator.clipboard.writeText(text).then(() => {
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, customClass: { popup: 'swal2-toast' } });
      Toast.fire({ icon: 'success', title: 'Order ID copied to clipboard!' });
    });
  });
});
