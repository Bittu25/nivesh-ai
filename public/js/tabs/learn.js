window.LearnTab = {
  articles: [
    {id:1,cat:'basics',emoji:'📘',title:'What is a Mutual Fund?',desc:'Understand why mutual funds beat FDs for long-term wealth, how NAV works, and how to pick your first fund.',time:'5 min',level:'Beginner'},
    {id:2,cat:'basics',emoji:'🔄',title:'How SIP Works — Simply',desc:'Rupee cost averaging, power of compounding, and why starting ₹500/month today beats ₹5,000/month later.',time:'7 min',level:'Beginner'},
    {id:3,cat:'tax',emoji:'💰',title:'ELSS vs PPF vs NPS',desc:'A clear breakdown of India\'s top tax-saving instruments under Section 80C. Which one is right for you?',time:'10 min',level:'Intermediate'},
    {id:4,cat:'strategy',emoji:'⚖️',title:'Rebalancing Your Portfolio',desc:'When and how to rebalance — keeping your asset allocation on track as markets move up and down.',time:'8 min',level:'Intermediate'},
    {id:5,cat:'strategy',emoji:'📊',title:'Large vs Mid vs Small Cap',desc:'Risk-return tradeoffs across market cap segments and how to choose the right mix for your timeline.',time:'9 min',level:'Intermediate'},
    {id:6,cat:'basics',emoji:'🥇',title:'Gold as an Investment',desc:'Role of gold in portfolio diversification. Gold ETFs vs sovereign gold bonds vs physical gold.',time:'6 min',level:'Beginner'},
    {id:7,cat:'advanced',emoji:'🎯',title:'Goal-Based Investing',desc:'How to match investments to specific life goals with timelines, inflation adjustment, and required returns.',time:'12 min',level:'Advanced'},
    {id:8,cat:'advanced',emoji:'🏦',title:'Debt Funds vs Fixed Deposits',desc:'Why debt funds often beat FDs after taxes — and the exact scenarios when each is better.',time:'8 min',level:'Advanced'},
  ],

  render() {
    window.Utils.html(window.Utils.el('tab-learn'), `
      <div class="learn-hero">
        <h2>Invest with Confidence</h2>
        <p>Jargon-free guides, interactive calculators, and AI-powered learning — designed for every Indian investor.</p>
      </div>

      <div class="grid-2" style="margin-bottom:28px;">
        <div class="calc-card">
          <div class="calc-title">📈 SIP Return Calculator</div>
          <div class="field" style="margin-bottom:14px;">
            <label>Monthly SIP Amount</label>
            <div class="input-prefix-wrap"><span class="input-prefix">₹</span><input type="number" id="c-sip" value="5000" min="100" oninput="window.LearnTab.calcSip()"/></div>
          </div>
          <div class="field" style="margin-bottom:14px;">
            <label>Duration — <strong id="c-yr-l">10</strong> years</label>
            <input type="range" id="c-yr" min="1" max="40" value="10" step="1" oninput="document.getElementById('c-yr-l').textContent=this.value;window.LearnTab.calcSip()"/>
          </div>
          <div class="field" style="margin-bottom:4px;">
            <label>Expected Return — <strong id="c-rt-l">12</strong>% p.a.</label>
            <input type="range" id="c-rt" min="4" max="25" value="12" step="1" oninput="document.getElementById('c-rt-l').textContent=this.value;window.LearnTab.calcSip()"/>
          </div>
          <div class="calc-result">
            <div class="calc-result-label">Maturity Value</div>
            <div class="calc-result-value" id="c-result">₹11.6L</div>
            <div class="calc-result-sub" id="c-sub">Invested ₹6L · Gain ₹5.6L (93%)</div>
          </div>
        </div>
        <div class="calc-card">
          <div class="calc-title">🎯 Goal SIP Planner</div>
          <div class="field" style="margin-bottom:14px;">
            <label>Target Amount</label>
            <div class="input-prefix-wrap"><span class="input-prefix">₹</span><input type="number" id="g-target" value="500000" oninput="window.LearnTab.calcGoal()"/></div>
          </div>
          <div class="field" style="margin-bottom:14px;">
            <label>Time to Goal — <strong id="g-yr-l">5</strong> years</label>
            <input type="range" id="g-yr" min="1" max="30" value="5" step="1" oninput="document.getElementById('g-yr-l').textContent=this.value;window.LearnTab.calcGoal()"/>
          </div>
          <div class="field" style="margin-bottom:4px;">
            <label>Expected Return — <strong id="g-rt-l">12</strong>% p.a.</label>
            <input type="range" id="g-rt" min="4" max="25" value="12" step="1" oninput="document.getElementById('g-rt-l').textContent=this.value;window.LearnTab.calcGoal()"/>
          </div>
          <div class="calc-result">
            <div class="calc-result-label">Monthly SIP Needed</div>
            <div class="calc-result-value" id="g-result">₹6,100</div>
            <div class="calc-result-sub" id="g-sub">To reach ₹5L in 5 years</div>
          </div>
        </div>
      </div>

      <div class="section-header">
        <div class="section-title">Investment Guides</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="chip active" onclick="window.LearnTab.filter(this,'all')">All</button>
          <button class="chip" onclick="window.LearnTab.filter(this,'basics')">Basics</button>
          <button class="chip" onclick="window.LearnTab.filter(this,'strategy')">Strategy</button>
          <button class="chip" onclick="window.LearnTab.filter(this,'tax')">Tax Saving</button>
          <button class="chip" onclick="window.LearnTab.filter(this,'advanced')">Advanced</button>
        </div>
      </div>
      <div class="grid-2 stagger-children" id="articles-grid" style="margin-top:16px;">${this.renderArticles(this.articles)}</div>

      <div style="margin-top:28px;">
        <div class="section-header" style="margin-bottom:16px;"><div class="section-title">🚀 Suggested Features</div><div class="section-link" style="font-size:12px;color:var(--text-3);">Vote for what you want next</div></div>
        <div class="grid-2">
          ${LearnTab._featureCard('📲','UPI Auto-Pay','Connect UPI and auto-debit SIPs on due date — no manual transfers.','Coming soon')}
          ${LearnTab._featureCard('📊','XIRR vs Nifty','Track if your portfolio is beating Nifty 50 in real time.','Coming soon')}
          ${LearnTab._featureCard('🔔','Smart Alerts','Get notified when a fund drops 5%+ or when it is time to top up.','Coming soon')}
          ${LearnTab._featureCard('📄','Tax Report','Auto-generate capital gains statement for ITR filing in one click.','Coming soon')}
          ${LearnTab._featureCard('🏦','FD vs MF Compare','Compare Fixed Deposits vs mutual funds returns side by side.','Coming soon')}
          ${LearnTab._featureCard('🤝','Refer and Earn','Invite friends and earn cashback on their first SIP.','Coming soon')}
        </div>
      </div>
    `);
    this.calcSip(); this.calcGoal();
  },

  renderArticles(arr) {
    const lvls = {Beginner:'badge-green',Intermediate:'badge-blue',Advanced:'badge-amber'};
    return arr.map(a=>`
      <div class="learn-card" onclick="window.Router.go('advisor');setTimeout(()=>window.AdvisorTab.sendQ(${JSON.stringify('Tell me about: '+a.title)}),200)">
        <div class="lc-header">
          <div class="lc-icon">${a.emoji}</div>
          <span class="badge ${lvls[a.level]} lc-badge">${a.level}</span>
        </div>
        <div class="lc-title">${a.title}</div>
        <div class="lc-desc">${a.desc}</div>
        <div class="lc-meta">
          <span>⏱ ${a.time} read</span>
          <span>Ask AI →</span>
        </div>
      </div>`).join('');
  },

  filter(btn, cat) {
    window.Utils.qsa('.section-header .chip').forEach(c=>c.classList.remove('active'));
    btn.classList.add('active');
    const filtered = cat==='all'?this.articles:this.articles.filter(a=>a.cat===cat);
    window.Utils.html(window.Utils.el('articles-grid'), this.renderArticles(filtered));
  },

  calcSip() {
    const sip = parseFloat(document.getElementById('c-sip')?.value)||5000;
    const yrs = parseFloat(document.getElementById('c-yr')?.value)||10;
    const rate = parseFloat(document.getElementById('c-rt')?.value)||12;
    const n=yrs*12, r=rate/100/12;
    const mat = sip*((Math.pow(1+r,n)-1)/r)*(1+r);
    const inv = sip*n, gain=mat-inv;
    const el=document.getElementById('c-result'), el2=document.getElementById('c-sub');
    if(el) el.textContent=window.Utils.fmtK(Math.round(mat));
    if(el2) el2.textContent=`Invested ${window.Utils.fmtK(Math.round(inv))} · Gain ${window.Utils.fmtK(Math.round(gain))} (${Math.round(gain/inv*100)}%)`;
  },

  calcGoal() {
    const target=parseFloat(document.getElementById('g-target')?.value)||500000;
    const yrs=parseFloat(document.getElementById('g-yr')?.value)||5;
    const rate=parseFloat(document.getElementById('g-rt')?.value)||12;
    const n=yrs*12, r=rate/100/12;
    const sip=Math.round(target*r/((Math.pow(1+r,n)-1)*(1+r)));
    const el=document.getElementById('g-result'), el2=document.getElementById('g-sub');
    if(el) el.textContent=window.Utils.fmt(sip);
    if(el2) el2.textContent=`To reach ${window.Utils.fmtK(target)} in ${yrs} year${yrs>1?'s':''}`;
  },

  _featureCard: function(emoji, title, desc, tag) {
    return '<div class="learn-card" style="cursor:default;">' +
      '<div class="lc-header">' +
        '<div class="lc-icon">' + emoji + '</div>' +
        '<span class="badge badge-neutral lc-badge">' + tag + '</span>' +
      '</div>' +
      '<div class="lc-title">' + title + '</div>' +
      '<div class="lc-desc">' + desc + '</div>' +
    '</div>';
  },

};