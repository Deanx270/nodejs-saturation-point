$(document).ready(function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  $('body').fadeIn(200);

  // Chart.js Global Settings for Premium Feel
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#636E72'; // Slate Gray for text
  Chart.defaults.scale.grid.color = 'rgba(226, 232, 240, 0.5)'; // Very subtle grid lines
  
  // Custom Tooltip Configuration
  const premiumTooltip = {
    backgroundColor: '#1B263B',
    titleColor: '#FAF9F6',
    bodyColor: '#FAF9F6',
    borderColor: 'transparent',
    borderWidth: 0,
    padding: 12,
    cornerRadius: 6,
    displayColors: true,
    boxPadding: 4,
    titleFont: { size: 14, family: "'Inter', sans-serif", weight: 'bold' },
    bodyFont: { size: 13, family: "'Inter', sans-serif" },
  };

  $.ajax({
    url: '/api/admin/dashboard/stats',
    type: 'GET',
    cache: false,
    headers: { 'Authorization': 'Bearer ' + token },
    success: function(data) {
      renderRevenueChart(data.revenue);
      renderCategoryChart(data.categories);
      renderStatusChart(data.statusDistribution);
      
      if (data.kpis) {
        $('#kpiRevenue').text('₱' + parseFloat(data.kpis.totalRevenue).toLocaleString('en-US', {minimumFractionDigits: 2}));
        $('#kpiOrders').text(data.kpis.totalOrders.toLocaleString());
        $('#kpiProducts').text(data.kpis.activeProducts.toLocaleString());
        $('#kpiUsers').text(data.kpis.totalUsers.toLocaleString());
      }
    },
    error: function(err) {
      console.error('Failed to load dashboard stats', err);
      showToast('Failed to load dashboard statistics', 'error');
    }
  });

  function renderRevenueChart(revenueData) {
    const ctx = document.getElementById('revenueLineChart').getContext('2d');
    
    // Default to empty if no data
    let labels = [];
    let dataPoints = [];
    
    if (revenueData && revenueData.length > 0) {
      labels = revenueData.map(item => item.month);
      dataPoints = revenueData.map(item => parseFloat(item.revenue));
    } else {
      // Dummy data for empty state
      const date = new Date();
      labels = [`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`];
      dataPoints = [0];
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.4)'); // Gold gradient start
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0.0)'); // Transparent end

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Realized Revenue (₱)',
          data: dataPoints,
          borderColor: '#D4AF37', // Classic Gold
          backgroundColor: gradient,
          borderWidth: 3,
          pointBackgroundColor: '#1B263B', // Deep Blue Ink dots
          pointBorderColor: '#FFF',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4 // Smooth curves
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: premiumTooltip
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              callback: function(value) {
                return '₱' + value.toLocaleString();
              }
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  function renderCategoryChart(categoryData) {
    const ctx = document.getElementById('categoryBarChart').getContext('2d');
    
    let labels = ['No Data'];
    let dataPoints = [0];
    
    if (categoryData && categoryData.length > 0) {
      labels = categoryData.map(item => item.name);
      dataPoints = categoryData.map(item => parseInt(item.count));
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Products Count',
          data: dataPoints,
          backgroundColor: '#1B263B', // Deep Blue Ink
          hoverBackgroundColor: '#2b3c5a',
          borderRadius: 6,
          barThickness: 'flex',
          maxBarThickness: 50
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: premiumTooltip
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { precision: 0 }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  function renderStatusChart(statusData) {
    const ctx = document.getElementById('statusPieChart').getContext('2d');
    
    let labels = ['No Data'];
    let dataPoints = [1];
    
    // Status colors strictly using Brand Palette
    const colorMap = {
      'pending': '#D4AF37',   // Classic Gold
      'shipped': '#1B263B',   // Deep Blue Ink
      'delivered': '#636E72', // Slate Gray
      'cancelled': '#E2E8F0'  // Muted light color to avoid harsh red
    };

    let backgroundColors = ['#FAF9F6']; // Soft Alabaster for empty space

    if (statusData && statusData.length > 0) {
      labels = statusData.map(item => item.status.charAt(0).toUpperCase() + item.status.slice(1));
      dataPoints = statusData.map(item => parseInt(item.count));
      backgroundColors = statusData.map(item => colorMap[item.status] || '#636E72');
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: dataPoints,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: premiumTooltip
        }
      }
    });
  }
});
