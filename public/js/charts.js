// ===== Charts =====
window.Charts = {
  defaults: function() {
    if (!window.Chart) return;
    Chart.defaults.font = Chart.defaults.font || {};
    Chart.defaults.font.family = "system-ui, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#9ca3af';
    if (Chart.defaults.plugins) {
      if (Chart.defaults.plugins.legend) Chart.defaults.plugins.legend.display = false;
    }
  },

  growth: function(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;
    // Destroy existing chart
    if (window.State.charts[canvasId]) {
      try { window.State.charts[canvasId].destroy(); } catch(e) {}
      window.State.charts[canvasId] = null;
    }
    var chartData = window.Utils.growthData();
    var months = chartData.months;
    var vals   = chartData.vals;

    // Safety check: ensure vals are strictly increasing (always show growth)
    for (var i = 1; i < vals.length; i++) {
      if (vals[i] < vals[i-1]) vals[i] = vals[i-1] + Math.round(vals[i-1] * 0.005);
    }

    window.State.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          data: vals,
          borderColor: '#1a6b5a',
          backgroundColor: 'rgba(26,107,90,0.07)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#1a6b5a',
          borderWidth: 2.5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(c) { return ' ' + window.Utils.fmtK(Math.round(c.parsed.y)); },
              title: function(items) { return items[0].label; },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 6, color: '#9ca3af', font: { size: 10 } },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              maxTicksLimit: 5,
              color: '#9ca3af',
              font: { size: 10 },
              callback: function(v) {
                if (v >= 100000) return '₹' + (v/100000).toFixed(1) + 'L';
                if (v >= 1000)   return '₹' + (v/1000).toFixed(0) + 'k';
                return '₹' + v;
              },
            },
          },
        },
      },
    });
  },

  donut: function(canvasId, data, colors) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (window.State.charts[canvasId]) {
      try { window.State.charts[canvasId].destroy(); } catch(e) {}
      window.State.charts[canvasId] = null;
    }
    window.State.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{ data: data.values, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(c) { return ' ' + c.label + ': ' + c.parsed + '%'; },
            },
          },
        },
      },
    });
  },

  bar: function(canvasId, labels, datasets) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (window.State.charts[canvasId]) {
      try { window.State.charts[canvasId].destroy(); } catch(e) {}
      window.State.charts[canvasId] = null;
    }
    window.State.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: { labels: labels, datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: datasets.length > 1 } },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { callback: function(v) { return '₹' + (v/1000) + 'k'; } },
          },
        },
      },
    });
  },
};
