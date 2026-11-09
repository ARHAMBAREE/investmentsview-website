/**
 * Investmentsview.de - Velocity Runner EA
 * Ultra-Premium Algorithmic Trading Interactive Engine
 */

function initApp() {
  initBackgroundCanvas();
  initTickerStream();
  initSpotlightEffect();
  initAudioEngine();
  initPricingTabs();
  initCheckoutController();
  initGalleryTabs();
  initCalculator();
  initFaqAccordions();
  initModals();
  initContactForm();
  initReviews();
  initInvestorAccounts();
  initLanguageEngine();
  initNavbarScroll();
  initVipDesk();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   1. Dynamic Background Grid & Energy Floating Particles
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 50;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(200, 150, 88,' : 'rgba(34, 197, 94,';
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color.includes('200') ? '#c89658' : '#22c55e';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Subtle trading grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.016)';
    ctx.lineWidth = 1;
    const gridSize = 75;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200, 150, 88, ${0.12 * (1 - dist / 130)})`;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   2. Live Forex & Gold Ticker Simulation
   ========================================================================== */
function initTickerStream() {
  const pairs = [
    { symbol: 'XAU/USD', price: 2684.50, pip: 0.10, isUp: true },
    { symbol: 'EUR/USD', price: 1.0842, pip: 0.0001, isUp: true },
    { symbol: 'GBP/USD', price: 1.2985, pip: 0.0001, isUp: false },
    { symbol: 'USD/JPY', price: 153.22, pip: 0.01, isUp: true },
    { symbol: 'BTC/USD', price: 91420.00, pip: 2.50, isUp: true },
    { symbol: 'USD/CHF', price: 0.8812, pip: 0.0001, isUp: false },
    { symbol: 'NAS100', price: 20950.00, pip: 1.00, isUp: true }
  ];

  const tickerContainer = document.querySelector('.ticker-content');
  if (!tickerContainer) return;

  function renderTickerItems() {
    const listHtml = pairs.map(p => `
      <div class="ticker-item" data-symbol="${p.symbol}">
        <span class="symbol">${p.symbol}</span>
        <span class="val">${p.price.toFixed(p.symbol.includes('USD/') && !p.symbol.includes('XAU') ? 4 : 2)}</span>
        <span class="${p.isUp ? 'up' : 'down'}">${p.isUp ? '▲ +' : '▼ -'}${((Math.random() * 0.4) + 0.1).toFixed(2)}%</span>
        <span class="badge">EA ACTIVE</span>
      </div>
    `).join('');

    tickerContainer.innerHTML = listHtml + listHtml;
  }

  renderTickerItems();

  setInterval(() => {
    const randomIdx = Math.floor(Math.random() * pairs.length);
    const item = pairs[randomIdx];
    const delta = (Math.random() - 0.48) * (item.pip * 5);
    item.price += delta;
    item.isUp = delta >= 0;

    const elements = document.querySelectorAll(`[data-symbol="${item.symbol}"] .val`);
    elements.forEach(el => {
      el.textContent = item.price.toFixed(item.symbol.includes('USD/') && !item.symbol.includes('XAU') ? 4 : 2);
      el.style.color = item.isUp ? '#22c55e' : '#ef4444';
      setTimeout(() => { el.style.color = ''; }, 700);
    });
  }, 2200);
}

/* ==========================================================================
   3. Interactive Spotlight Hover Effect on Cards
   ========================================================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.product-card, .pricing-card, .results-chart-box, .calc-box-glass');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   4. Tactile Sound Engine (Web Audio API Synthesizer - Zero External Files)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioEngine() {
  const audioBtn = document.getElementById('btn-audio-toggle');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    audioBtn.innerHTML = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    audioBtn.style.color = soundEnabled ? '#ffffff' : '#94a3b8';
    if (soundEnabled) {
      playTactileTone(880, 0.04, 'sine');
      showToast('Sound effects enabled');
    } else {
      showToast('Sound effects muted');
    }
  });

  // Attach soft clicks to buttons
  document.querySelectorAll('button, .btn-nav-buy, .btn-primary-gold').forEach(el => {
    el.addEventListener('click', () => {
      if (soundEnabled) playTactileTone(620, 0.03, 'sine');
    });
  });
}

function playTactileTone(freq = 600, duration = 0.05, type = 'sine') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context safe fallback
  }
}

/* ==========================================================================
   5. Product Gallery Filter (Current 1, Upcoming 1, Past 2)
   Matches Screenshot 1
   ========================================================================== */
let allProducts = [];

async function initGalleryTabs() {
  const tabButtons = document.querySelectorAll('.gallery-tab-btn');
  const productGrid = document.querySelector('.product-grid');
  if (!productGrid) return;

  try {
    const res = await fetch('/api/products');
    allProducts = await res.json();
    renderProducts('current');
  } catch (err) {
    console.error('Failed to load products:', err);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderProducts(filter);
    });
  });

  function renderProducts(filter) {
    let filtered = allProducts;
    if (filter !== 'all') {
      filtered = allProducts.filter(p => p.status === filter);
    }

    if (!filtered.length) {
      productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
          No products found in this category.
        </div>
      `;
      return;
    }

    productGrid.innerHTML = filtered.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-card-preview">
          <span class="product-status-tag">${p.badge}</span>
          <img src="${p.image}" alt="${p.name}" onerror="this.src='/assets/box-velocity-runner.svg'">
        </div>
        <div class="product-card-body">
          <h3 class="product-card-title">${p.name}</h3>
          <p class="product-card-desc">${p.description}</p>
          <ul class="product-features-list">
            ${p.features.map(f => `
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                ${f}
              </li>
            `).join('')}
          </ul>
          <div class="product-card-footer">
            <div class="product-price-block">
              <span class="price-current">${p.price}</span>
              ${p.originalPrice ? `<span class="price-original">${p.originalPrice}</span>` : ''}
            </div>
            ${p.isAvailable ? `
              <button class="btn-product-download gold-fill trigger-buy-flow" data-plan="Pro Trader Edition - ${p.name}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download EA
              </button>
            ` : `
              <button class="btn-product-download" onclick="showToast('You are added to the VIP priority notification list!')">
                Join Waitlist
              </button>
            `}
          </div>
        </div>
      </div>
    `).join('');

    initSpotlightEffect();
    attachCheckoutButtons();
  }
}

/* ==========================================================================
   5b. Investor Account Credentials Controller (Low Risk vs High Risk)
   ========================================================================== */
function initInvestorAccounts() {
  const tabBtns = document.querySelectorAll('.investor-tab-btn');
  const cardLow = document.getElementById('investor-card-low');
  const cardHigh = document.getElementById('investor-card-high');
  const dualContainer = document.getElementById('investor-dual-container');

  if (tabBtns.length && cardLow && cardHigh) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;

        if (mode === 'low') {
          cardLow.style.display = 'block';
          cardHigh.style.display = 'none';
          if (dualContainer) dualContainer.classList.remove('side-by-side');
        } else if (mode === 'high') {
          cardLow.style.display = 'none';
          cardHigh.style.display = 'block';
          if (dualContainer) dualContainer.classList.remove('side-by-side');
        } else if (mode === 'both') {
          cardLow.style.display = 'block';
          cardHigh.style.display = 'block';
          if (dualContainer) dualContainer.classList.add('side-by-side');
        }
        playTactileTone(720, 0.04, 'sine');
      });
    });
  }

  // Copy Buttons for credentials
  const copyBtns = document.querySelectorAll('.cred-copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const val = btn.dataset.copy || '';
      const label = btn.dataset.label || 'Credentials';
      if (!val) return;

      try {
        await navigator.clipboard.writeText(val);
      } catch (err) {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = val;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      // Visual feedback on button
      const originalSvg = btn.innerHTML;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
      btn.classList.add('copied');

      showToast(`Copied ${label}: ${val}`);
      playTactileTone(880, 0.08, 'triangle');

      setTimeout(() => {
        btn.innerHTML = originalSvg;
        btn.classList.remove('copied');
      }, 2000);
    });
  });

  // Clicking the credential value box itself also triggers the copy button
  const valBoxes = document.querySelectorAll('.cred-value-box');
  valBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const copyBtn = box.querySelector('.cred-copy-btn');
      if (copyBtn) copyBtn.click();
    });
  });
}

/* ==========================================================================
   6. Advanced Chart (Equity Curve + Candlestick OHLC View Toggle)
   ========================================================================== */
function initAdvancedChart() {
  const canvas = document.getElementById('equity-chart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let currentMode = 'equity'; // 'equity' or 'candles'
  let currentTf = '6M';

  const modeBtns = document.querySelectorAll('.chart-mode-btn');
  const timeframeBtns = document.querySelectorAll('.tf-btn');

  const datasets = {
    '1M': [10000, 10420, 10890, 10750, 11200, 11680, 12150, 12840, 13420],
    '3M': [10000, 11200, 12400, 12100, 13800, 15200, 16900, 18450, 20200],
    '6M': [10000, 12800, 15400, 14900, 18200, 22100, 26400, 30100, 34280],
    '1Y': [10000, 14500, 19200, 24800, 31000, 39500, 48200, 56900, 68400],
    'ALL': [10000, 16800, 24500, 34200, 46800, 62000, 81400, 104000, 134800]
  };

  // Sample Candlestick OHLC bars for XAUUSD M15
  const candleBars = [
    { o: 2642, h: 2650, l: 2638, c: 2648, up: true },
    { o: 2648, h: 2654, l: 2645, c: 2652, up: true },
    { o: 2652, h: 2655, l: 2644, c: 2646, up: false },
    { o: 2646, h: 2658, l: 2644, c: 2657, up: true, signal: 'BUY 0.50' },
    { o: 2657, h: 2668, l: 2655, c: 2665, up: true },
    { o: 2665, h: 2672, l: 2662, c: 2670, up: true },
    { o: 2670, h: 2674, l: 2663, c: 2666, up: false },
    { o: 2666, h: 2682, l: 2665, c: 2680, up: true },
    { o: 2680, h: 2694, l: 2678, c: 2690, up: true, signal: 'TP HIT +$412' },
    { o: 2690, h: 2695, l: 2684, c: 2686, up: false },
    { o: 2686, h: 2698, l: 2685, c: 2696, up: true },
    { o: 2696, h: 2704, l: 2694, c: 2701, up: true }
  ];

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 270;
    render();
  }
  window.addEventListener('resize', resize);

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentMode === 'equity') {
      renderEquity();
    } else {
      renderCandles();
    }
  }

  function renderEquity() {
    const data = datasets[currentTf] || datasets['6M'];
    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 30, right: 25, bottom: 35, left: 20 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const min = Math.min(...data) * 0.95;
    const max = Math.max(...data) * 1.05;

    // Horizontal lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    const points = data.map((val, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y = padding.top + chartH - ((val - min) / (max - min)) * chartH;
      return { x, y, val };
    });

    const grad = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    grad.addColorStop(0, 'rgba(34, 197, 94, 0.28)');
    grad.addColorStop(0.5, 'rgba(200, 150, 88, 0.12)');
    grad.addColorStop(1, 'rgba(18, 19, 25, 0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
    ctx.lineTo(points[0].x, h - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Glowing tip
    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#22c55e';
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`$${last.val.toLocaleString()}`, last.x - 10, last.y - 12);
  }

  function renderCandles() {
    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 35, right: 30, bottom: 35, left: 25 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const min = 2630;
    const max = 2710;
    const step = chartW / candleBars.length;
    const candleWidth = Math.min(22, step * 0.65);

    // Horizontal grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      const priceVal = max - ((max - min) / 4) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(priceVal.toFixed(1), padding.left - 5, y + 3);
    }

    candleBars.forEach((bar, idx) => {
      const cx = padding.left + step * idx + step / 2;
      const yOpen = padding.top + chartH - ((bar.o - min) / (max - min)) * chartH;
      const yClose = padding.top + chartH - ((bar.c - min) / (max - min)) * chartH;
      const yHigh = padding.top + chartH - ((bar.h - min) / (max - min)) * chartH;
      const yLow = padding.top + chartH - ((bar.l - min) / (max - min)) * chartH;

      const isUp = bar.c >= bar.o;
      const color = isUp ? '#22c55e' : '#ef4444';

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, yHigh);
      ctx.lineTo(cx, yLow);
      ctx.stroke();

      // Body
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));
      ctx.fillStyle = color;
      ctx.fillRect(cx - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

      // Signal Marker
      if (bar.signal) {
        ctx.fillStyle = isUp ? 'rgba(34, 197, 94, 0.9)' : 'rgba(200, 150, 88, 0.9)';
        const tagY = isUp ? yHigh - 16 : yLow + 16;
        ctx.beginPath();
        ctx.roundRect(cx - 36, tagY - 10, 72, 18, 4);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(bar.signal, cx, tagY + 3);
      }
    });
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      render();
    });
  });

  timeframeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeframeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTf = btn.dataset.tf;
      render();
    });
  });

  setTimeout(resize, 40);
}

/* ==========================================================================
   7. Myfxbook Monthly Returns Heatmap Loader
   ========================================================================== */
async function initHeatmap() {
  const container = document.getElementById('myfxbook-heatmap-target');
  if (!container) return;

  try {
    const res = await fetch('/api/stats/myfxbook');
    const data = await res.json();

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let html = `
      <table class="heatmap-table">
        <thead>
          <tr>
            <th>Year</th>
            ${months.map(m => `<th>${m}</th>`).join('')}
            <th>YTD</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.monthlyHistory.forEach(row => {
      let ytdTotal = 0;
      html += `<tr><td style="font-weight:700; color:#fff;">${row.year}</td>`;

      months.forEach(m => {
        const found = row.months.find(x => x.m === m);
        if (found) {
          const num = parseFloat(found.return.replace('+', '').replace('%', ''));
          ytdTotal += num;
          const isSuper = num > 25;
          html += `<td><span class="heat-cell ${isSuper ? 'super' : ''}">${found.return}</span></td>`;
        } else {
          html += `<td style="color:#334155;">-</td>`;
        }
      });

      html += `<td style="color:#22c55e; font-weight:800;">+${ytdTotal.toFixed(1)}%</td></tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  } catch (e) {
    console.error('Heatmap load error:', e);
  }
}

/* ==========================================================================
   8. Live Trades Stream (Simulated Bot Executions)
   ========================================================================== */
function initLiveTradesStream() {
  const container = document.getElementById('trades-stream');
  if (!container) return;

  const mockPairs = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY'];
  const mockTypes = ['BUY', 'SELL'];

  function addTradeRow() {
    const symbol = mockPairs[Math.floor(Math.random() * mockPairs.length)];
    const type = mockTypes[Math.floor(Math.random() * mockTypes.length)];
    const lot = (Math.random() * 0.8 + 0.1).toFixed(2);
    const profit = (Math.random() * 260 + 45).toFixed(2);
    const pips = (Math.random() * 35 + 8).toFixed(1);

    const row = document.createElement('div');
    row.className = 'trade-row';
    row.style.opacity = '0';
    row.style.transform = 'translateY(-10px)';

    row.innerHTML = `
      <div class="trade-left">
        <span class="trade-type-tag ${type.toLowerCase()}">${type}</span>
        <div>
          <div class="trade-symbol">${symbol}</div>
          <div class="trade-lot">${lot} Lots • +${pips} pips</div>
        </div>
      </div>
      <div class="trade-right">
        <div class="trade-profit">+$${profit}</div>
        <div class="trade-time">Just now</div>
      </div>
    `;

    container.insertBefore(row, container.firstChild);

    setTimeout(() => {
      row.style.transition = 'all 0.3s ease';
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    }, 20);

    if (container.children.length > 6) {
      container.removeChild(container.lastChild);
    }
  }

  for (let i = 0; i < 4; i++) {
    addTradeRow();
  }

  setInterval(() => {
    addTradeRow();
  }, 7500);
}

/* ==========================================================================
   9. Interactive Profit & Risk Calculator
   ========================================================================== */
function initCalculator() {
  const slider = document.getElementById('calc-balance-slider');
  const balanceDisplay = document.getElementById('calc-balance-display');
  const riskBtns = document.querySelectorAll('.risk-btn');
  const outputDaily = document.getElementById('calc-out-daily');
  const outputMonthly = document.getElementById('calc-out-monthly');
  const outputDrawdown = document.getElementById('calc-out-drawdown');
  const outputYearly = document.getElementById('calc-out-yearly');

  if (!slider || !balanceDisplay) return;

  let currentRiskRate = 0.38;
  let currentRiskName = 'balanced';

  const riskRates = {
    conservative: { monthlyRate: 0.22, maxDd: '2.8% Hard Capped', dailyMultiplier: 0.009 },
    balanced: { monthlyRate: 0.38, maxDd: '4.2% Dynamic Shield', dailyMultiplier: 0.016 },
    aggressive: { monthlyRate: 0.52, maxDd: '6.5% Trailing Trail', dailyMultiplier: 0.023 }
  };

  function updateCalc() {
    const balance = parseFloat(slider.value);
    balanceDisplay.textContent = `$${balance.toLocaleString()}`;

    const config = riskRates[currentRiskName];
    const dailyEst = balance * config.dailyMultiplier;
    const monthlyEst = balance * config.monthlyRate;
    const yearlyEst = balance * Math.pow(1 + config.monthlyRate * 0.7, 12) - balance;

    outputDaily.textContent = `+$${Math.round(dailyEst).toLocaleString()}`;
    outputMonthly.textContent = `+$${Math.round(monthlyEst).toLocaleString()}`;
    outputDrawdown.textContent = config.maxDd;
    outputYearly.textContent = `+$${Math.round(yearlyEst).toLocaleString()}`;
  }

  slider.addEventListener('input', updateCalc);

  riskBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      riskBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRiskName = btn.dataset.risk;
      updateCalc();
    });
  });

  updateCalc();
}

/* ==========================================================================
   10. Frequently Asked Questions (2-Column Accordion)
   Matches Screenshot 2
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const icon = item.querySelector('.faq-icon-circle');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      if (isActive) {
        item.classList.remove('active');
        if (icon) icon.textContent = '+';
      } else {
        item.classList.add('active');
        if (icon) icon.textContent = '−';
      }
    });
  });
}

/* ==========================================================================
   11. Modals & Production Checkout Engine
   ========================================================================== */
function initModals() {
  const videoCard = document.querySelector('.video-player-card');
  const videoModal = document.getElementById('modal-video');

  if (videoCard && videoModal) {
    videoCard.addEventListener('click', () => {
      videoModal.classList.add('active');
    });
  }

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn')) {
        modal.classList.remove('active');
      }
    });
  });

  // Review Modal
  const writeReviewBtn = document.querySelector('.btn-write-review');
  const reviewModal = document.getElementById('modal-review');

  if (writeReviewBtn && reviewModal) {
    writeReviewBtn.addEventListener('click', () => {
      reviewModal.classList.add('active');
    });
  }

  // Star Rating Selector
  const starBtns = document.querySelectorAll('.star-rating-select button');
  let selectedRating = 5;

  starBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedRating = parseInt(btn.dataset.rating);
      updateStars(selectedRating);
    });

    btn.addEventListener('mouseenter', () => {
      const rating = parseInt(btn.dataset.rating);
      starBtns.forEach((b, i) => {
        b.classList.toggle('hovered', i < rating);
      });
    });

    btn.addEventListener('mouseleave', () => {
      starBtns.forEach(b => b.classList.remove('hovered'));
    });
  });

  function updateStars(rating) {
    starBtns.forEach((b, i) => {
      b.classList.toggle('selected', i < rating);
    });
  }

  // Review Form Submit
  const reviewForm = document.getElementById('form-submit-review');
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = reviewForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      const payload = {
        name: document.getElementById('review-name').value,
        email: document.getElementById('review-email').value,
        accountType: document.getElementById('review-account').value,
        rating: selectedRating,
        content: document.getElementById('review-content').value
      };

      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
          showToast('Thank you! Your verified review has been published.');
          reviewModal.classList.remove('active');
          reviewForm.reset();
          updateStars(5);
          loadReviews();
        } else {
          showToast(data.error || 'Failed to submit review');
        }
      } catch (err) {
        showToast('Submission error. Please check your network.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Verified Review';
      }
    });
  }
}

/* ==========================================================================
   11. Ultra-Luxury Two-Column Institutional Checkout Controller
   ========================================================================== */
function attachCheckoutButtons() {
  initCheckoutController();
}

/* ==========================================================================
   Pricing Bot Selector (Velocity Runner vs GDAS EA vs Dual Fleet)
   ========================================================================== */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-bot-tab');
  const panelVelocity = document.getElementById('pricing-panel-velocity');
  const panelGdas = document.getElementById('pricing-panel-gdas');
  const panelBundle = document.getElementById('pricing-panel-bundle');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const bot = tab.dataset.bot;
      if (panelVelocity) panelVelocity.style.display = (bot === 'velocity') ? 'block' : 'none';
      if (panelGdas) panelGdas.style.display = (bot === 'gdas') ? 'block' : 'none';
      if (panelBundle) panelBundle.style.display = (bot === 'bundle') ? 'block' : 'none';

      playTactileTone(650, 0.04, 'sine');
    });
  });
}

window.openFlyerModal = function(imgSrc) {
  const modal = document.getElementById('flyer-modal');
  const modalImg = document.getElementById('flyer-modal-img');
  if (modal && modalImg) {
    modalImg.src = imgSrc;
    modal.classList.add('active');
    playTactileTone(780, 0.04, 'sine');
  }
};

window.closeFlyerModal = function(e) {
  const modal = document.getElementById('flyer-modal');
  if (modal) {
    modal.classList.remove('active');
  }
};

let checkoutCurrentAmount = 200;
let appliedVoucherDiscount = 0;
let checkoutCountdownTimer = null;

function initCheckoutController() {
  const checkoutModal = document.getElementById('modal-checkout');
  const planInput = document.getElementById('checkout-plan-name');
  const baseAmountInput = document.getElementById('checkout-base-amount');

  function configureCheckout(planName, priceVal, botType) {
    const isGdas = (botType === 'gdas') || (planName && planName.toLowerCase().includes('gdas'));
    const isBundle = (botType === 'bundle') || (planName && planName.toLowerCase().includes('bundle'));

    let finalPrice = parseFloat(priceVal) || 200;
    if (!priceVal) {
      if (planName.includes('150')) finalPrice = 150;
      else if (planName.includes('200')) finalPrice = 200;
      else if (planName.includes('300')) finalPrice = 300;
      else if (planName.includes('400')) finalPrice = 400;
      else if (planName.includes('500')) finalPrice = 500;
      else if (planName.includes('700')) finalPrice = 700;
      else if (planName.includes('1,000') || planName.includes('1000')) finalPrice = 1000;
      else if (planName.includes('1,200') || planName.includes('1200')) finalPrice = 1200;
      else if (planName.includes('1,800') || planName.includes('1800')) finalPrice = 1800;
    }

    checkoutCurrentAmount = finalPrice;
    let originalPrice = finalPrice * 2;
    let discountVal = originalPrice - finalPrice;

    let tierLabel = planName;
    let prodName = 'Velocity Runner EA';
    let prodDesc = 'Institutional quantitative trading engine for Gold (XAUUSD). Dynamic escape & delta-neutral recovery.';
    let imgPath = '/assets/box-velocity-runner.jpg';

    if (isGdas) {
      prodName = 'GDAS EA — Gold Digger Account Saver';
      prodDesc = 'Low-risk capital defense & stabilized grid EA for Gold (XAUUSD). Rapid basket clearance & safeguard sensor.';
      imgPath = '/assets/box-gdas-ea.jpg';
    } else if (isBundle) {
      prodName = 'Dual Fleet VIP Enterprise Bundle';
      prodDesc = 'Both Bots Included: Velocity Runner EA + GDAS EA (8 Live MT4/MT5 Licenses) & Dedicated White-Glove VPS Concierge.';
      imgPath = '/assets/box-velocity-runner.jpg';
    }

    const tierBadge = document.getElementById('summary-tier-badge');
    const prodNameEl = document.getElementById('summary-product-name');
    const basePriceEl = document.getElementById('summary-base-price');
    const discountEl = document.getElementById('summary-discount-val');
    const prodImg = document.getElementById('summary-product-img');

    if (tierBadge) tierBadge.textContent = tierLabel;
    if (prodNameEl) prodNameEl.textContent = prodName;
    if (basePriceEl) basePriceEl.textContent = `$${originalPrice.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${discountVal.toFixed(2)}`;
    if (prodImg) prodImg.src = imgPath;

    appliedVoucherDiscount = 0;
    const voucherRow = document.getElementById('summary-voucher-row');
    if (voucherRow) voucherRow.style.display = 'none';

    if (planInput) planInput.value = planName;
    if (baseAmountInput) baseAmountInput.value = finalPrice;

    renderFinalPrice();
  }

  // Global click delegate for all buy buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.trigger-buy-flow, .btn-nav-buy, .btn-pricing-v2, .btn-pricing-checkout');
    if (!btn) return;

    const planName = btn.dataset.plan || 'Velocity Runner EA - 1 Month ($200)';
    const priceVal = btn.dataset.price || '200';
    const botType = btn.dataset.bot || 'velocity';

    configureCheckout(planName, priceVal, botType);

    if (checkoutModal) {
      e.preventDefault();
      checkoutModal.classList.add('active');
      startCheckoutCountdown();
      playTactileTone(750, 0.05, 'sine');
    }
  });

  // URL Query Parameters support (e.g. /checkout?bot=gdas&price=500&plan=GDAS%20EA%20-%206%20Months)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const qPlan = urlParams.get('plan');
    const qPrice = urlParams.get('price');
    const qBot = urlParams.get('bot');
    if (qPlan || qPrice || qBot) {
      configureCheckout(qPlan || (qBot === 'gdas' ? 'GDAS EA - 1 Month ($150)' : 'Velocity Runner EA - 1 Month ($200)'), qPrice, qBot);
    }
  } catch(e) {}

  function renderFinalPrice() {
    const totalEl = document.getElementById('summary-total-price');
    const ctaBtn = document.getElementById('btn-submit-checkout-main');
    const finalAmount = Math.max(1, checkoutCurrentAmount - appliedVoucherDiscount);

    if (totalEl) totalEl.textContent = `$${finalAmount.toFixed(2)}`;
    if (ctaBtn) {
      ctaBtn.querySelector('span').textContent = `Pay $${finalAmount.toFixed(2)} & Activate License`;
    }
  }

  // Countdown Timer (14:59 -> 00:00)
  function startCheckoutCountdown() {
    if (checkoutCountdownTimer) clearInterval(checkoutCountdownTimer);
    let secondsLeft = 14 * 60 + 59;
    const countdownEl = document.getElementById('checkout-countdown');

    checkoutCountdownTimer = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(checkoutCountdownTimer);
        if (countdownEl) countdownEl.textContent = '00:00';
        return;
      }
      const mins = Math.floor(secondsLeft / 60);
      const secs = secondsLeft % 60;
      if (countdownEl) {
        countdownEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  // Platform Selector (MT5 / MT4)
  const platformTiles = document.querySelectorAll('.platform-tile');
  const platformValInput = document.getElementById('checkout-platform-val');

  platformTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      platformTiles.forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
      const selected = tile.dataset.platform;
      if (platformValInput) platformValInput.value = selected;
      playTactileTone(680, 0.03, 'sine');
    });
  });

  // Payment Tabs (Card, Crypto, SEPA)
  const payTabs = document.querySelectorAll('.pay-tab-btn');
  const payPanes = document.querySelectorAll('.pay-pane');
  const submitBtnMain = document.getElementById('btn-submit-checkout-main');

  function updateSubmitBtnLabel(tabType) {
    if (!submitBtnMain) return;
    const finalAmount = Math.max(0, checkoutCurrentAmount - appliedVoucherDiscount);
    const amountStr = `$${finalAmount.toFixed(2)}`;
    if (tabType === 'card') {
      submitBtnMain.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>Pay ${amountStr} via Stripe &amp; Activate License</span>`;
    } else if (tabType === 'crypto') {
      submitBtnMain.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V18h-2v-1.07c-2.3-.23-4-1.28-4-3.43h2.5c0 1.13.9 1.75 2.5 1.75 1.48 0 2.5-.66 2.5-1.65 0-.9-.72-1.4-2.52-1.78l-1.3-.28C8.5 11.08 7 9.8 7 7.75c0-1.95 1.5-3.08 3.5-3.35V3h2v1.4c2.05.27 3.5 1.4 3.5 3.1h-2.5c0-.98-.75-1.5-2-1.5-1.3 0-2 .6-2 1.4 0 .78.6 1.25 2.1 1.57l1.3.28c2.4.52 3.6 1.7 3.6 3.8 0 2.1-1.6 3.23-3.5 3.43z"/></svg><span>Confirm ${amountStr} Crypto Payment &amp; Activate</span>`;
    } else if (tabType === 'sepa') {
      submitBtnMain.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 4v10h16V8H4zm2 2h4v2H6v-2z"/></svg><span>Lock SEPA Bank Transfer &amp; Issue License</span>`;
    }
  }

  payTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      payTabs.forEach(t => t.classList.remove('active'));
      payPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(`pane-${tab.dataset.tab}`);
      if (targetPane) targetPane.classList.add('active');

      updateSubmitBtnLabel(tab.dataset.tab);
      playTactileTone(720, 0.03, 'sine');
    });
  });

  // Credit Card Live Mockup Synchronizer
  const nameInput = document.getElementById('checkout-name');
  const cardHolderMock = document.getElementById('card-mock-holder');
  const cardNumberInput = document.getElementById('input-card-number');
  const cardNumberMock = document.getElementById('card-mock-number');
  const cardExpiryInput = document.getElementById('input-card-expiry');
  const cardExpiryMock = document.getElementById('card-mock-expiry');

  if (nameInput && cardHolderMock) {
    nameInput.addEventListener('input', () => {
      cardHolderMock.textContent = nameInput.value.toUpperCase() || 'ALEX MORGAN';
    });
  }

  if (cardNumberInput && cardNumberMock) {
    cardNumberInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      cardNumberInput.value = formatted;
      cardNumberMock.textContent = formatted || '•••• •••• •••• 4242';
    });
  }

  if (cardExpiryInput && cardExpiryMock) {
    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      cardExpiryInput.value = val;
      cardExpiryMock.textContent = val || '12/28';
    });
  }

  // Crypto Network Selector & Address Copy
  const cryptoNetBtns = document.querySelectorAll('.crypto-net-btn');
  const cryptoAddrText = document.getElementById('crypto-current-address');
  const copyCryptoBtn = document.getElementById('btn-copy-crypto-addr');

  cryptoNetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cryptoNetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (cryptoAddrText) {
        cryptoAddrText.textContent = btn.dataset.addr;
      }
      playTactileTone(650, 0.03, 'sine');
    });
  });

  if (copyCryptoBtn && cryptoAddrText) {
    copyCryptoBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(cryptoAddrText.textContent);
      copyCryptoBtn.textContent = 'Copied!';
      showToast('Merchant crypto address copied to clipboard!');
      playTactileTone(900, 0.06, 'triangle');
      setTimeout(() => { copyCryptoBtn.textContent = 'Copy'; }, 2000);
    });
  }

  // Voucher Promo Code Engine
  const voucherInput = document.getElementById('voucher-input');
  const applyVoucherBtn = document.getElementById('btn-apply-voucher');
  const voucherRow = document.getElementById('summary-voucher-row');
  const voucherLabel = document.getElementById('summary-voucher-label');
  const voucherAmount = document.getElementById('summary-voucher-amount');

  if (applyVoucherBtn && voucherInput) {
    applyVoucherBtn.addEventListener('click', async () => {
      const code = voucherInput.value.trim();
      if (!code) {
        showToast('Please enter a voucher code.');
        return;
      }

      applyVoucherBtn.textContent = 'Checking...';

      try {
        const res = await fetch('/api/voucher/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        const data = await res.json();

        if (res.ok && data.valid) {
          let discountVal = 0;
          if (data.discountFixed) {
            discountVal = parseFloat(data.discountFixed);
          } else if (data.discountPct) {
            discountVal = (checkoutCurrentAmount * (data.discountPct / 100));
          }
          appliedVoucherDiscount = discountVal;

          if (voucherRow) voucherRow.style.display = 'flex';
          if (voucherLabel) voucherLabel.textContent = `Promo Code (${data.code}):`;
          if (voucherAmount) voucherAmount.textContent = `-$${discountVal.toFixed(2)}`;

          renderFinalPrice();
          playTactileTone(980, 0.09, 'sine');
          showToast(`Success! ${data.description} applied.`);
          applyVoucherBtn.textContent = 'Applied ✓';
          applyVoucherBtn.style.color = '#22c55e';
          applyVoucherBtn.style.borderColor = '#22c55e';
        } else {
          showToast(data.error || 'Invalid voucher code.');
          applyVoucherBtn.textContent = 'Apply';
        }
      } catch (e) {
        showToast('Error validating voucher code.');
        applyVoucherBtn.textContent = 'Apply';
      }
    });
  }

  // Form Submit Handler
  const checkoutForm = document.getElementById('form-checkout');
  if (checkoutForm) {
    checkoutForm.onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-submit-checkout-main');
      submitBtn.disabled = true;

      const activePayTab = document.querySelector('.pay-tab-btn.active');
      const isCardPayment = activePayTab ? activePayTab.dataset.tab === 'card' : true;
      const paymentMethodName = activePayTab ? activePayTab.querySelector('span').textContent : 'Credit Card';
      const curPlan = planInput ? planInput.value : 'Velocity Runner EA - 1 Month ($200)';
      const isGdas = curPlan.toLowerCase().includes('gdas');

      const payload = {
        plan: curPlan,
        bot: isGdas ? 'gdas' : 'velocity',
        name: document.getElementById('checkout-name').value,
        email: document.getElementById('checkout-email').value,
        broker: document.getElementById('checkout-broker').value || 'Raw Spread ECN',
        platform: platformValInput ? platformValInput.value : 'MetaTrader 5 (MT5)',
        paymentMethod: paymentMethodName,
        amount: checkoutCurrentAmount,
        voucherDiscount: appliedVoucherDiscount
      };

      // If Card payment: route directly to Stripe Checkout
      if (isCardPayment) {
        submitBtn.innerHTML = `<span>Connecting to 256-Bit Stripe Terminal...</span>`;
        try {
          const stripeRes = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const stripeData = await stripeRes.json();
          if (stripeRes.ok && stripeData.url) {
            playTactileTone(1050, 0.12, 'sine');
            showToast('Redirecting to Stripe 256-Bit SSL Checkout...');
            window.location.href = stripeData.url;
            return;
          } else {
            console.warn('Stripe checkout session response:', stripeData);
            showToast(stripeData.error || 'Stripe initialization in progress. Completing order...');
          }
        } catch (err) {
          console.warn('Stripe direct session redirect error:', err);
        }
      }

      // Fallback or Crypto / SEPA Direct Processing
      submitBtn.innerHTML = `<span>Securing Order &amp; Generating License...</span>`;
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
          playTactileTone(1050, 0.15, 'triangle');

          // Render Ultra-Luxury Celebration Receipt
          const containerToReplace = document.querySelector('.checkout-split-grid') || (checkoutModal ? checkoutModal.querySelector('.modal-box') : null);
          if (containerToReplace) {
            containerToReplace.innerHTML = `
              <div class="checkout-success-view" style="width: 100%; grid-column: 1 / -1; padding: 40px 24px; text-align: center;">
                <div class="success-check-badge">✓</div>
                <h2 style="font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
                  ${data.bot || 'Velocity Runner EA'} License Activated!
                </h2>
                <p style="color: #94a3b8; font-size: 14px; max-width: 580px; margin: 0 auto 24px auto;">
                  Your institutional license key has been bound to <strong>${payload.email}</strong>. Download your pre-optimized presets below.
                </p>

                <!-- Golden License Box -->
                <div style="background: #090a0f; border: 1px dashed #c89658; border-radius: 12px; padding: 22px; max-width: 540px; margin: 0 auto 24px auto; text-align: left;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Official MetaTrader Activation Key</span>
                    <button id="btn-copy-license-key" style="background: rgba(200,150,88,0.2); border: 1px solid #c89658; color: #c89658; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 4px; cursor: pointer;">Copy License</button>
                  </div>
                  <div style="font-size: 22px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #c89658; letter-spacing: 2px;">
                    ${data.licenseKey}
                  </div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Order Ref: <code>${data.orderId}</code> &bull; Platform: ${data.platform}</div>
                </div>

                <!-- Instant Downloads Actions -->
                <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px;">
                  <a href="${data.downloadUrl}" class="btn-primary-gold" style="padding: 14px 28px; font-size: 14px;">
                    ⬇ Download Verified Preset (.set) Bundle
                  </a>
                  <a href="https://t.me/investmentsview_support" target="_blank" class="btn-secondary-dark" style="padding: 14px 24px; font-size: 14px;">
                    💬 VIP Telegram Onboarding Desk
                  </a>
                </div>

                <div style="font-size: 12px; color: #94a3b8;">
                  Need help installing on your VPS? Our Frankfurt desk provides complimentary remote AnyDesk setup: <strong>support@investmentsview.de</strong>.
                </div>
              </div>
            `;

            const copyKeyBtn = document.getElementById('btn-copy-license-key');
            if (copyKeyBtn) {
              copyKeyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(data.licenseKey).then(() => {
                  copyKeyBtn.textContent = 'Copied ✓';
                  showToast('License key copied to clipboard!');
                });
              });
            }
          }
        } else {
          showToast(data.error || 'Checkout failed. Please check your inputs.');
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Complete Order</span>`;
        }
      } catch (err) {
        showToast('Network error during checkout. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Complete Order</span>`;
      }
    };
  }

  // Handle Stripe Success Callback (?session_id=...&success=true)
  const urlParams = new URLSearchParams(window.location.search);
  const stripeSessionId = urlParams.get('session_id');
  const isStripeSuccess = urlParams.get('success') === 'true';

  if (stripeSessionId && isStripeSuccess) {
    const containerToReplace = document.querySelector('.checkout-split-grid') || (checkoutModal ? checkoutModal.querySelector('.modal-box') : null);
    if (containerToReplace) {
      if (checkoutModal) checkoutModal.classList.add('active');
      containerToReplace.innerHTML = `
        <div class="checkout-success-view" style="width: 100%; grid-column: 1 / -1; padding: 40px 24px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 12px; animation: pulse 1.5s infinite;">⏳</div>
          <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
            Verifying 256-Bit Stripe Payment...
          </h2>
          <p style="color: #94a3b8; font-size: 14px;">
            Please hold while your institutional license key is generated.
          </p>
        </div>
      `;

      fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(stripeSessionId)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.paid) {
            playTactileTone(1050, 0.2, 'triangle');
            containerToReplace.innerHTML = `
              <div class="checkout-success-view" style="width: 100%; grid-column: 1 / -1; padding: 40px 24px; text-align: center;">
                <div class="success-check-badge">✓</div>
                <div style="display: inline-block; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); color: #22c55e; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;">
                  💳 Stripe Verified Payment &bull; $${data.amountTotal} ${data.currency}
                </div>
                <h2 style="font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
                  ${data.bot || 'Velocity Runner EA'} License Activated!
                </h2>
                <p style="color: #94a3b8; font-size: 14px; max-width: 580px; margin: 0 auto 24px auto;">
                  Your institutional license key has been bound to <strong>${data.email}</strong>. Download your pre-optimized presets below.
                </p>

                <!-- Golden License Box -->
                <div style="background: #090a0f; border: 1px dashed #c89658; border-radius: 12px; padding: 22px; max-width: 540px; margin: 0 auto 24px auto; text-align: left;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Official MetaTrader Activation Key</span>
                    <button id="btn-copy-license-key" style="background: rgba(200,150,88,0.2); border: 1px solid #c89658; color: #c89658; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 4px; cursor: pointer;">Copy License</button>
                  </div>
                  <div style="font-size: 22px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #c89658; letter-spacing: 2px;">
                    ${data.licenseKey}
                  </div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Order Ref: <code>${data.orderId}</code> &bull; Platform: ${data.platform}</div>
                </div>

                <!-- Instant Downloads Actions -->
                <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px;">
                  <a href="${data.downloadUrl}" class="btn-primary-gold" style="padding: 14px 28px; font-size: 14px;">
                    ⬇ Download Verified Preset (.set) Bundle
                  </a>
                  <a href="https://t.me/investmentsview_support" target="_blank" class="btn-secondary-dark" style="padding: 14px 24px; font-size: 14px;">
                    💬 VIP Telegram Onboarding Desk
                  </a>
                </div>

                <div style="font-size: 11.5px; color: #64748b; line-height: 1.6;">
                  A confirmation email with your license certificate and installation parameters has been sent to <strong>${data.email}</strong>.
                </div>
              </div>
            `;
            const copyBtn = document.getElementById('btn-copy-license-key');
            if (copyBtn) {
              copyBtn.onclick = () => {
                navigator.clipboard.writeText(data.licenseKey);
                copyBtn.textContent = 'Copied!';
                showToast('License key copied to clipboard!');
                setTimeout(() => { copyBtn.textContent = 'Copy License'; }, 2000);
              };
            }
          }
        })
        .catch(err => {
          console.warn('Verify session error:', err);
        });
    }
  }
}

/* ==========================================================================
   12. Contact Form Submissions (Matches Screenshot 3)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-form-send');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending Message...';

    const payload = {
      name: document.getElementById('contact-name').value,
      email: document.getElementById('contact-email').value,
      message: document.getElementById('contact-message').value
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        playTactileTone(800, 0.08, 'sine');
        showToast(data.message || 'Thank you! Our trading support desk will reach you very soon.');
        form.reset();
      } else {
        showToast(data.error || 'Please fill all required fields correctly.');
      }
    } catch (err) {
      showToast('Error sending message. Please try again.');
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

/* ==========================================================================
   13. Verified Reviews Loader
   ========================================================================== */
async function loadReviews() {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  try {
    const res = await fetch('/api/reviews');
    const reviews = await res.json();

    container.innerHTML = reviews.map(r => `
      <div class="testimonial-card">
        <div>
          <div class="stars-row">
            ${'★'.repeat(r.rating || 5)}
          </div>
          <p class="testimonial-quote">"${r.content}"</p>
        </div>
        <div class="testimonial-author-row">
          <div class="author-avatar-initial">${r.initial || r.name.charAt(0)}</div>
          <div class="author-meta">
            <div class="name">${r.name}</div>
            <div class="account-badge">${r.accountType || 'Live Account'} • <span style="color:#22c55e;">Verified</span></div>
          </div>
        </div>
      </div>
    `).join('');

    initSpotlightEffect();
  } catch (err) {
    console.error('Failed to load reviews:', err);
  }
}

function initReviews() {
  loadReviews();
}

/* ==========================================================================
   14. Full Bilingual Engine (English & German for investmentsview.de)
   ========================================================================== */
const dictionary = {
  EN: {
    heroTitle: 'Institutional Speed. Disciplined Execution.<br><span class="gradient-gold">Automate Forex &amp; Gold Like A Pro.</span>',
    heroSub: 'Velocity Runner EA is an intelligent automated trading system engineered for MetaTrader 4 &amp; 5. Featuring dual pending-order breakout architecture, dynamic ATR trailing stops, and verified prop-firm safe risk parameters.',
    buyNow: 'Buy Now',
    getInstant: 'Get Instant Access',
    watchTutorial: 'Watch Setup Tutorial',
    productGallery: 'Product Gallery',
    faqTitle: 'Frequently Asked Question',
    contactTitle: "We're Here to Support Your Trading Success",
    contactSub: "Our Forex Trading Bot's dedicated support team will reach you very soon"
  },
  DE: {
    heroTitle: 'Institutionelle Präzision. Disziplinierte Ausführung.<br><span class="gradient-gold">Forex &amp; Gold vollautomatisiert handeln.</span>',
    heroSub: 'Velocity Runner EA ist ein hochentwickeltes algorithmisches Handelssystem für MetaTrader 4 &amp; 5. Ausgestattet mit dualer Pending-Order-Breakout-Architektur, dynamischem ATR-Trailing-Stop und BaFin/ESMA-konformen Risikoparametern.',
    buyNow: 'Jetzt Kaufen',
    getInstant: 'Sofortzugang sichern',
    watchTutorial: 'Installationsanleitung ansehen',
    productGallery: 'Produktgalerie',
    faqTitle: 'Häufig gestellte Fragen (FAQ)',
    contactTitle: 'Wir unterstützen Ihren Handelserfolg rund um die Uhr',
    contactSub: 'Unser deutsches Support-Team antwortet Ihnen innerhalb kürzester Zeit.'
  }
};

function initLanguageEngine() {
  const langBtn = document.getElementById('btn-lang-toggle');
  let currentLang = 'EN';

  if (!langBtn) return;

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'EN' ? 'DE' : 'EN';
    langBtn.innerHTML = `🌐 ${currentLang}`;

    const dict = dictionary[currentLang];
    const heroTitle = document.querySelector('.hero-title');
    const heroSub = document.querySelector('.hero-subtitle');
    const navBuy = document.querySelector('.btn-nav-buy');

    if (heroTitle && dict.heroTitle) heroTitle.innerHTML = dict.heroTitle;
    if (heroSub && dict.heroSub) heroSub.innerHTML = dict.heroSub;
    if (navBuy && dict.buyNow) navBuy.textContent = dict.buyNow;

    showToast(`Sprache geändert: ${currentLang === 'DE' ? 'Deutsch (investmentsview.de)' : 'English'}`);
  });
}

/* ==========================================================================
   15. Floating VIP Desk Chat Drawer
   ========================================================================== */
function initVipDesk() {
  const triggerBtn = document.getElementById('vip-chat-trigger');
  const drawer = document.getElementById('vip-chat-drawer');
  const closeBtn = document.getElementById('vip-drawer-close');

  if (triggerBtn && drawer) {
    triggerBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      playTactileTone(700, 0.04, 'sine');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    }

    // Quick chip questions
    document.querySelectorAll('.vip-chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const question = chip.dataset.q;
        if (question === 'prop') {
          showToast('Velocity Runner passes FTMO with max 3.2% DD. Full set file provided!');
        } else if (question === 'min') {
          showToast('Minimum balance is $500 on Standard or $50 on Cent accounts.');
        } else if (question === 'telegram') {
          window.open('https://t.me/investmentsview_support', '_blank');
        }
      });
    });
  }
}

/* ==========================================================================
   16. Sticky Navbar Logic
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: #c89658; font-weight: 700;">●</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

window.showToast = showToast;

/**
 * Universal Clipboard Copy Helper
 */
function copyText(text, btn) {
  if (!text) return;
  try {
    navigator.clipboard.writeText(text);
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.color = '#22c55e';
    btn.style.borderColor = '#22c55e';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  }

  if (typeof showToast === 'function') {
    showToast(`Copied to clipboard: ${text}`);
  }
}

window.copyText = copyText;
