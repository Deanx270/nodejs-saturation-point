$(document).ready(function () {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  let currentPage = 1;
  const limit = 12;
  let isLoading = false;
  let hasMore = true;

  const grid = $('#productGrid');
  const spinner = $('#catalogSpinner');

  const loadCategories = $.ajax({ url: '/api/categories', type: 'GET' });
  const loadBrands = $.ajax({ url: '/api/brands', type: 'GET' });

  $.when(loadCategories, loadBrands).done(function (catArgs, brandArgs) {
    const categories = catArgs[0];
    const brands = brandArgs[0];

    let catOptions = '';
    categories.forEach(c => {
      catOptions += `<option value="${c.id}">${c.name}</option>`;
    });
    $('#categoryFilter').append(catOptions);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
      $('#categoryFilter').val(urlParams.get('category'));
    }

    let brandOptions = '';
    brands.forEach(b => {
      brandOptions += `<option value="${b.id}">${b.name}</option>`;
    });
    $('#brandFilter').append(brandOptions);

    loadProducts(currentPage);
  });

  function getFilters() {
    return {
      search: $('#searchFilter').val(),
      categoryId: $('#categoryFilter').val(),
      brandId: $('#brandFilter').val(),
      sort: $('#sortFilter').val(),
      minPrice: $('#minPrice').val(),
      maxPrice: $('#maxPrice').val()
    };
  }

  function loadProducts(page) {
    if (isLoading || !hasMore) return;
    isLoading = true;
    spinner.show();

    const filters = getFilters();

    $.ajax({
      url: '/api/products',
      type: 'GET',
      data: { page: page, limit: limit, ...filters },
      success: function (products) {
        if (products.length < limit) {
          hasMore = false;
        }

        if (page === 1 && products.length === 0) {
          grid.html('<div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; font-family: \'Montserrat\', sans-serif; color: #4A4A4A;">No products matched your search.</div>');
          spinner.hide();
          isLoading = false;
          return;
        }

        products.forEach((product, index) => {
          const defaultImg = product.images && product.images.length > 0 ? product.images[0] : '/images/hero_luxury_pen.png';
          const price = parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 });

          const card = `
            <a href="/product/${product.id}" class="product-card fade-in-up" style="animation-delay: ${(index % limit) * 50}ms;">
              <div style="position: relative; width: 100%; padding-top: 100%; background-color: #FFFFFF; overflow: hidden; border-bottom: 1px solid rgba(27,38,59,0.05);">
                <img src="${defaultImg}" alt="${product.name}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; padding: 1rem; box-sizing: border-box;">
              </div>
              <div class="product-card-details">
                <h3 class="product-card-title">${product.name}</h3>
                <p class="product-card-desc">${product.description || 'Premium Stationery'}</p>
                <div class="product-card-footer">
                  <span class="product-card-price">₱${price}</span>
                  <button type="button" class="btn-cart add-to-cart" data-id="${product.id}" data-name="${product.name.replace(/"/g, '&quot;')}" data-price="${product.price}" data-image="${defaultImg}" title="Add to Cart">
                    <i data-lucide="shopping-cart" style="width: 18px; height: 18px;"></i>
                  </button>
                </div>
              </div>
            </a>
          `;
          grid.append(card);
        });

        if (window.lucide) {
          window.lucide.createIcons();
        }

        isLoading = false;
        spinner.hide();
        currentPage++;
      },
      error: function () {
        if (page === 1) {
          grid.html('<div style="grid-column: span 3; text-align: center; color: #991b1b; font-family: \'Montserrat\', sans-serif;">Failed to load the catalog.</div>');
        }
        isLoading = false;
        spinner.hide();
      }
    });
  }

  $('#toggleFilterMenu').on('click', function (e) {
    e.stopPropagation();
    $('#filterMenu').toggleClass('show');
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.filter-dropdown-container').length) {
      $('#filterMenu').removeClass('show');
    }
  });

  function applyFilters() {
    currentPage = 1;
    hasMore = true;
    grid.empty();

    const url = new URL(window.location);
    const catId = $('#categoryFilter').val();
    if (catId) {
      url.searchParams.set('category', catId);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState({}, '', url);

    loadProducts(1);
  }

  $('#categoryFilter, #brandFilter, #sortFilter').on('change', applyFilters);

  let searchTimeout;
  $('#searchFilter, #minPrice, #maxPrice').on('keyup change', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 400);
  });

  $(window).on('scroll', function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
      loadProducts(currentPage);
    }
  });

  grid.on('click', '.add-to-cart', function (e) {
    e.preventDefault();
    const btn = $(this);
    const id = btn.data('id');
    const name = btn.data('name');
    const price = parseFloat(btn.data('price'));
    const image = btn.data('image');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1, imageUrl: image });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = $('#cartBadge');
    badge.text(totalItems).css('display', 'inline-flex').addClass('bump');
    setTimeout(() => badge.removeClass('bump'), 300);

    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      customClass: { popup: 'swal2-toast' }
    });
    Toast.fire({ icon: 'success', title: 'Item added to cart' });
  });
});
