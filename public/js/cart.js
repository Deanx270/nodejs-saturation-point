$(document).ready(function() {
  const SHIPPING_FEE = 150;
  
  function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }
  
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
  }
  
  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if ($('#cartBadge').length) {
      $('#cartBadge').text(count);
      if (count > 0) {
        $('#cartBadge').show();
      } else {
        $('#cartBadge').hide();
      }
    }
  }

  function renderCart() {
    const cart = getCart();
    const $cartItemsList = $('#cartItemsList');
    const $orderSummary = $('#orderSummary');
    
    $cartItemsList.empty();
    
    if (cart.length === 0) {
      $cartItemsList.html(`
        <div class="empty-cart-message">
          <h3 class="brand-font" style="font-size: 1.5rem; margin-bottom: 1rem;">Your cart is empty</h3>
          <p style="color: var(--text-muted); margin-bottom: 2rem;">Discover our premium selection of fountain pens and accessories.</p>
          <a href="/catalog" class="checkout-btn" style="text-decoration: none; display: inline-block; width: auto; padding: 0.8rem 2rem;">Explore Catalog</a>
        </div>
      `);
      $orderSummary.hide();
      return;
    }
    
    let subtotal = 0;
    
    cart.forEach((item, index) => {
      subtotal += item.price * item.quantity;
      const $card = $(`
        <div class="cart-item-card">
          <img src="${item.imageUrl || '/images/default-product.jpg'}" alt="${item.name}" class="item-thumbnail">
          <div class="item-details">
            <div class="item-title">${item.name}</div>
            <div class="item-price">₱${parseFloat(item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </div>
          <div class="quantity-controls">
            <button class="qty-btn decrease-qty" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn increase-qty" data-index="${index}">+</button>
          </div>
          <button class="remove-btn" data-index="${index}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Remove
          </button>
        </div>
      `);
      $cartItemsList.append($card);
    });
    
    const total = subtotal + SHIPPING_FEE;
    $('#summarySubtotal').text('₱' + subtotal.toLocaleString(undefined, {minimumFractionDigits: 2}));
    $('#summaryTotal').text('₱' + total.toLocaleString(undefined, {minimumFractionDigits: 2}));
    $orderSummary.show();
    
    $('.increase-qty').off('click').on('click', function() {
      const idx = $(this).data('index');
      cart[idx].quantity += 1;
      saveCart(cart);
      renderCart();
    });
    
    $('.decrease-qty').off('click').on('click', function() {
      const idx = $(this).data('index');
      if (cart[idx].quantity > 1) {
        cart[idx].quantity -= 1;
      } else {
        cart.splice(idx, 1);
      }
      saveCart(cart);
      renderCart();
    });
    
    $('.remove-btn').off('click').on('click', function() {
      const idx = $(this).data('index');
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
      const Toast = Swal.mixin({
        toast: true, position: 'bottom-end', showConfirmButton: false, timer: 3000, customClass: { popup: 'swal2-toast' }
      });
      Toast.fire({ icon: 'success', title: 'Item removed from cart' });
    });
  }

  renderCart();
  updateCartBadge();

  $('#proceedCheckoutBtn').on('click', function() {
    const cart = getCart();
    if (cart.length === 0) return;

    Swal.fire({
      title: '<span style="font-family: \'Playfair Display\', serif;">Confirm Your Order</span>',
      html: `
        <div style="font-family: 'Inter', sans-serif; text-align: center; margin-top: 1rem; color: var(--text-muted);">
          Your order will be processed via <strong>Cash on Delivery</strong>.
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm Order',
      confirmButtonColor: '#0C0A09',
      cancelButtonColor: '#E5E7EB',
      cancelButtonText: '<span style="color: #374151">Cancel</span>',
      customClass: {
        popup: 'premium-swal-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const paymentMethod = 'Cash on Delivery';
        const items = cart.map(item => ({
          productId: item.id, // Fixed: use item.id correctly
          quantity: item.quantity
        }));

        const token = localStorage.getItem('token') || '';

        $.ajax({
          url: '/api/transactions',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({ items, paymentMethod }),
          success: function(res) {
            localStorage.removeItem('cart');
            updateCartBadge();
            window.location.href = '/checkout-success';
          },
          error: function(xhr) {
            Swal.fire({
              icon: 'error',
              title: '<span style="font-family: \'Playfair Display\', serif;">Checkout Failed</span>',
              html: xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'An error occurred during checkout.',
              confirmButtonColor: '#EF4444',
              customClass: {
                popup: 'premium-swal-popup'
              }
            });
          }
        });
      }
    });
  });
});
