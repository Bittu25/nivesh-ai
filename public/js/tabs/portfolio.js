window.PortfolioTab = {
  render: function() {
    var portfolio = window.State.portfolio;
    var holdings  = portfolio.holdings || [];
    var totalReturn = portfolio.totalValue - portfolio.totalInvested;
    var returnPct   = portfolio.totalInvested > 0 ? ((totalReturn / portfolio.totalInvested) * 100).toFixed(1) : '0.0';

    // THIS MONTH — actual gain since investing started (all gain is from this month for new user)
    var thisMonthGain = Math.max(0, portfolio.totalValue - portfolio.totalInvested);
    var thisMonthPct  = portfolio.totalInvested > 0 ? ((thisMonthGain / portfolio.totalInvested) * 100).toFixed(2) : '0.00';

    // Fund count from actual holdings
    var fundCount = holdings.length;

    // Bar chart — only funds user actually holds
    var barLabels = holdings.map(function(h) { return h.name.split(' ').slice(0,2).join(' '); });
    var barData   = holdings.map(function(h) { return h.returns; });
    var barColors = holdings.map(function(h) { return h.logoColor || '#1a6b5a'; });

    var el = document.getElementById('tab-portfolio');
    if (!el) return;

    el.innerHTML = `
      <div class="page-header"><h1>My Portfolio</h1><p>All your investments in one place</p></div>

      <div class="portfolio-header-stats">
        <div class="stat-card accent-green">
          <div class="stat-label">Total Value</div>
          <div class="stat-value">${window.Utils.fmtK(portfolio.totalValue)}</div>
          <div class="stat-change up">↑ +${portfolio.xirr}% XIRR</div>
        </div>
        <div class="stat-card accent-blue">
          <div class="stat-label">Invested</div>
          <div class="stat-value">${window.Utils.fmtK(portfolio.totalInvested)}</div>
          <div class="stat-change neutral">Across ${fundCount} fund${fundCount !== 1 ? 's' : ''}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Returns</div>
          <div class="stat-value" style="color:var(--green-dark);">${window.Utils.fmtK(totalReturn)}</div>
          <div class="stat-change up">+${returnPct}% gain</div>
        </div>
        <div class="stat-card accent-amber">
          <div class="stat-label">This Month</div>
          <div class="stat-value" style="color:var(--green-dark);">+${window.Utils.fmtK(thisMonthGain)}</div>
          <div class="stat-change up">+${thisMonthPct}% MTD</div>
        </div>
      </div>

      <div class="portfolio-two-col">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Holdings</div>
            <button class="btn btn-secondary btn-sm" onclick="window.Router.go('invest')">+ Add Fund</button>
          </div>
          <div class="card-body" style="padding-top:4px;">
            <div class="holdings-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Fund</th>
                    <th class="right">Invested</th>
                    <th class="right">Current</th>
                    <th class="right">Returns</th>
                    <th class="right">SIP</th>
                  </tr>
                </thead>
                <tbody>
                  ${holdings.length === 0
                    ? '<tr><td colspan="5" style="text-align:center;color:var(--text-3);padding:24px;">No holdings yet — start a SIP from the Invest tab</td></tr>'
                    : holdings.map(function(h) {
                        return `<tr>
                          <td>
                            <div style="display:flex;align-items:center;gap:8px;">
                              <div style="width:34px;height:34px;border-radius:8px;background:${h.logoBg};color:${h.logoColor};font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${h.logo}</div>
                              <div>
                                <div style="font-weight:600;font-size:13px;">${h.name.split(' ').slice(0,3).join(' ')}</div>
                                <div style="font-size:11px;color:var(--text-3);">${h.type}</div>
                              </div>
                            </div>
                          </td>
                          <td class="right">${window.Utils.fmt(h.invested)}</td>
                          <td class="right" style="font-weight:600;">${window.Utils.fmt(h.current)}</td>
                          <td class="right" style="color:var(--green-dark);font-weight:600;">+${h.returns}%</td>
                          <td class="right">${h.sipAmount ? window.Utils.fmt(h.sipAmount) + '/mo' : '<span style="color:var(--text-3);">—</span>'}</td>
                        </tr>`;
                      }).join('')
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div class="card" style="margin-bottom:16px;">
            <div class="card-header"><div class="card-title">SIP Schedule</div></div>
            <div class="card-body">
              <div style="font-size:12px;color:var(--text-3);margin-bottom:14px;">Next debit: <strong>10 May 2026</strong></div>
              ${holdings.filter(function(h){ return h.sipAmount > 0; }).length === 0
                ? '<div style="color:var(--text-3);font-size:13px;text-align:center;padding:16px;">No active SIPs yet</div>'
                : holdings.filter(function(h){ return h.sipAmount > 0; }).map(function(h, i) {
                    return `<div class="sip-card ${i===0?'active-sip':''}">
                      <div>
                        <div style="font-size:13px;font-weight:600;color:${i===0?'var(--brand)':'var(--text)'};">${h.name.split(' ').slice(0,3).join(' ')}</div>
                        <div style="font-size:11px;color:var(--text-3);">10th every month</div>
                      </div>
                      <div style="font-size:15px;font-weight:700;color:${i===0?'var(--brand)':'var(--text)'};">${window.Utils.fmt(h.sipAmount)}</div>
                    </div>`;
                  }).join('')
              }
              <div style="border-top:1px solid var(--border);padding-top:12px;margin-top:4px;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:13px;color:var(--text-2);">Total monthly</span>
                <span style="font-size:15px;font-weight:700;color:var(--brand);">${window.Utils.fmt(window.State.user.monthlySavings)}</span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><div class="card-title">Fund Performance</div></div>
            <div class="card-body">
              ${holdings.length === 0
                ? '<div style="color:var(--text-3);font-size:13px;text-align:center;padding:24px;">Add funds to see performance</div>'
                : '<div class="chart-container" style="height:170px;"><canvas id="perfChart"></canvas></div>'
              }
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Transaction History</div>
          <button class="btn btn-ghost btn-sm">Download</button>
        </div>
        <div class="card-body" style="padding-top:4px;">
          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead><tr><th>Date</th><th>Fund</th><th>Type</th><th class="right">Amount</th><th class="right">Status</th></tr></thead>
              <tbody>
                ${portfolio.transactions && portfolio.transactions.length > 0
                  ? portfolio.transactions.map(function(t) {
                      return `<tr>
                        <td class="muted">${t.date}</td>
                        <td style="font-weight:500;">${t.fund}</td>
                        <td><span class="txn-type txn-${t.type}">${t.type==='sip'?'SIP':t.type==='lump'?'Lumpsum':'Redeem'}</span></td>
                        <td class="right">${window.Utils.fmt(t.amount)}</td>
                        <td class="right"><span style="color:var(--green-dark);font-weight:600;">✓ Done</span></td>
                      </tr>`;
                    }).join('')
                  : '<tr><td colspan="5" style="text-align:center;color:var(--text-3);padding:24px;">No transactions yet — your first SIP will appear here</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Draw bar chart only with actual holdings
    if (holdings.length > 0) {
      setTimeout(function() {
        window.Charts.bar('perfChart', barLabels, [{
          label: 'Returns %',
          data: barData,
          backgroundColor: barColors,
          borderRadius: 6,
        }]);
      }, 80);
    }
  },
};
