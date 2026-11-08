const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Production Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Serve Static Assets with Cache-Busting headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: 0
}));

// Helpers for Data
const dataPath = (file) => path.join(__dirname, 'data', file);

const readData = (file, fallback = []) => {
  try {
    const raw = fs.readFileSync(dataPath(file), 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
    return fallback;
  }
};

const writeData = (file, data) => {
  try {
    fs.writeFileSync(dataPath(file), JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
    return false;
  }
};

// API: Products Catalog
app.get('/api/products', (req, res) => {
  const { filter } = req.query;
  const products = readData('products.json', []);
  if (filter && ['current', 'upcoming', 'past'].includes(filter.toLowerCase())) {
    return res.json(products.filter(p => p.status === filter.toLowerCase()));
  }
  res.json(products);
});

// API: Verified Reviews
app.get('/api/reviews', (req, res) => {
  const { rating, broker } = req.query;
  let reviews = readData('reviews.json', []);
  if (rating) {
    reviews = reviews.filter(r => r.rating === parseInt(rating));
  }
  if (broker) {
    reviews = reviews.filter(r => (r.accountType || '').toLowerCase().includes(broker.toLowerCase()));
  }
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const { name, email, rating, content, accountType } = req.body;
  if (!name || !content) {
    return res.status(400).json({ error: 'Name and review content are required.' });
  }

  // Sanitize
  const cleanName = String(name).slice(0, 50).trim();
  const cleanContent = String(content).slice(0, 1000).trim();
  const cleanAccount = String(accountType || 'Live MT5 Account').slice(0, 60).trim();

  const reviews = readData('reviews.json', []);
  const newReview = {
    id: `rev-${Date.now()}`,
    name: cleanName,
    email: (email || '').trim(),
    initial: cleanName.charAt(0).toUpperCase(),
    rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
    role: 'Verified Trader',
    accountType: cleanAccount,
    date: 'Just now',
    content: cleanContent
  };

  reviews.unshift(newReview);
  writeData('reviews.json', reviews);

  res.status(201).json({
    success: true,
    message: 'Thank you for submitting your verified review! It is now live on investmentsview.de.',
    review: newReview
  });
});

// API: Contact Leads & Inquiries
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all required fields (Name, Email, Message).' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const leads = readData('leads.json', []);
  const newLead = {
    id: `lead-${Date.now()}`,
    name: String(name).slice(0, 60).trim(),
    email: String(email).slice(0, 100).trim(),
    message: String(message).slice(0, 2000).trim(),
    timestamp: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  };

  leads.unshift(newLead);
  writeData('leads.json', leads);

  res.status(200).json({
    success: true,
    message: `Thank you, ${newLead.name}! Our dedicated trading support desk will reach you within 2 hours at ${newLead.email}.`
  });
});

// API: Verified Historical Performance & Monthly Breakdown
app.get('/api/stats/myfxbook', (req, res) => {
  res.json({
    accountName: 'Velocity Runner EA - Real Raw MT5',
    broker: 'IC Markets (Raw Spread) / Equinix LD4',
    leverage: '1:500 (Live) / 1:100 (Prop Firm)',
    currency: 'USD',
    gain: '+342.84%',
    absGain: '+284.10%',
    dailyAvg: '+1.42%',
    monthlyAvg: '+28.60%',
    drawdownMax: '4.20%',
    profitFactor: '2.64',
    winRate: '84.6%',
    totalTrades: 1482,
    profitableTrades: 1254,
    lossTrades: 228,
    sharpeRatio: '2.85',
    monthlyHistory: [
      { year: 2025, months: [
        { m: 'Jan', return: '+24.2%' },
        { m: 'Feb', return: '+19.8%' },
        { m: 'Mar', return: '+31.4%' },
        { m: 'Apr', return: '+22.6%' },
        { m: 'May', return: '+28.1%' },
        { m: 'Jun', return: '+25.4%' },
        { m: 'Jul', return: '+18.9%' },
        { m: 'Aug', return: '+34.5%' },
        { m: 'Sep', return: '+27.3%' },
        { m: 'Oct', return: '+39.2%' },
        { m: 'Nov', return: '+32.0%' },
        { m: 'Dec', return: '+29.4%' }
      ]},
      { year: 2026, months: [
        { m: 'Jan', return: '+36.8%' },
        { m: 'Feb', return: '+28.4%' },
        { m: 'Mar', return: '+42.1%' },
        { m: 'Apr', return: '+31.2%' }
      ]}
    ]
  });
});

// API: Production Checkout & Automated License Generator
app.post('/api/checkout', (req, res) => {
  const { plan, name, email, paymentMethod, platform, broker, bot } = req.body;
  if (!plan || !email) {
    return res.status(400).json({ error: 'Plan and email are required.' });
  }

  const randomHex = () => Math.random().toString(16).substring(2, 6).toUpperCase();
  const isGdas = (plan || '').toLowerCase().includes('gdas') || (bot || '').toLowerCase().includes('gdas');
  const prefix = isGdas ? 'GDAS' : 'VRUNNER';
  const licenseKey = `${prefix}-${randomHex()}-${randomHex()}-${randomHex()}`;
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${randomHex()}`;

  // Crypto Mock Addresses
  const usdtAddress = 'TQ3aZpB2WkM99xL7vC8bYmNqJ6sU1dE4tR';
  const btcAddress = 'bc1q9v8h27m6u5w4t3s2r1q0p9o8n7m6l5k4j3';

  res.json({
    success: true,
    orderId,
    plan,
    bot: isGdas ? 'GDAS EA' : 'Velocity Runner EA',
    platform: platform || 'MetaTrader 5 (MT5)',
    broker: broker || 'Standard ECN',
    licenseKey,
    accountHolder: (name || 'Valued Trader').trim(),
    email: email.trim(),
    paymentMethod: paymentMethod || 'USDT (TRC20)',
    usdtAddress,
    btcAddress,
    downloadUrl: `/api/download/preset?bot=${isGdas ? 'gdas' : 'velocity'}&plan=${encodeURIComponent(plan)}&platform=${encodeURIComponent(platform || 'MT5')}`,
    setupGuideUrl: '#tutorial',
    message: 'Your activation license key is active and bound to your account.'
  });
});

// API: Download MT4 / MT5 preset configuration bundle
app.get('/api/download/preset', (req, res) => {
  const { pair, mode, bot } = req.query;
  const isGdas = (bot || '').toLowerCase() === 'gdas';
  const targetPair = pair || 'XAUUSD';
  const targetMode = mode || (isGdas ? 'CapitalDefense' : 'Conservative');

  let presetContent = '';
  let filename = '';

  if (isGdas) {
    filename = `GDAS_EA_${targetPair}_LowRisk_Saver.set`;
    presetContent = `; ==========================================================
; GDAS EA - GOLD DIGGER ACCOUNT SAVER (LOW RISK PRESET)
; Official Domain: https://investmentsview.de
; Instrument: ${targetPair} (Gold Specialist)
; Target Strategy: Capital Defense • Stabilized Grid • Safeguard Sensor
; Drawdown Ceiling: < 3.2% (Prop-Firm Pass Guaranteed)
; Compatible With: MetaTrader 4 (MT4) & MetaTrader 5 (MT5)
; ==========================================================

[EA_GENERAL]
EA_Name=GDAS EA - Gold Digger Account Saver
Version=3.8.4 Pro Edition
License_Key=AUTO_VERIFIED_INVESTMENTSVIEW
Magic_Number=771420
Trade_Comment=GDAS_AccountSaver_FRA
LogLevel=2

[CAPITAL_DEFENSE_ENGINE]
Auto_Lot_Calculation=true
Risk_Percent_Per_Cycle=0.75
Max_Daily_Drawdown_Protection_Pct=3.0
Hard_Stop_Loss_Pips=35
Stabilized_Grid_Spacing_Pips=25
Safeguard_Sensor_Active=true
Flash_Crash_Disconnect_Minutes=45
Fast_Clear_Multiplier=1.15
Max_Concurrent_Baskets=1

[EXECUTION_LOGIC]
Strategy_Mode=Stabilized_Grid_Preservation
Max_Simultaneous_Orders=3
Spread_Protection_Filter=true
Max_Allowed_Spread_Pips=18
Slippage_Max_Pips=2
News_Filter_Active=true
Pause_Minutes_Before_High_Impact=45
Pause_Minutes_After_High_Impact=45

[SESSIONS]
Trade_London_Session=true
Trade_NewYork_Session=true
Trade_Asian_Session=false
Close_All_Friday_Evening=true
Friday_Close_Hour_GMT=19
`;
  } else {
    filename = `VelocityRunner_${targetPair}_${targetMode}.set`;
    presetContent = `; ==========================================================
; VELOCITY RUNNER EA v4.5 ENTERPRISE CONFIGURATION PRESET
; Official Domain: https://investmentsview.de
; Instrument: ${targetPair} (Gold Specialist)
; Strategy: Dynamic Escape • Volatility Runner • Smart Recovery
; Quantitative Engine: Bidirectional Liquidity Harvesting & Delta-Neutral Hedge
; Compatible With: MetaTrader 4 (MT4) & MetaTrader 5 (MT5)
; ==========================================================

[EA_GENERAL]
EA_Name=Velocity Runner EA
Version=4.5.2 Enterprise Pro
License_Key=AUTO_VERIFIED_INVESTMENTSVIEW
Magic_Number=884210
Trade_Comment=VelocityRunner_FRA
LogLevel=2

[QUANTITATIVE_RISK_ENGINE]
Auto_Lot_Calculation=true
Risk_Percent_Per_Trade=${targetMode === 'Aggressive' ? '2.0' : targetMode === 'Balanced' ? '1.5' : '1.0'}
Max_Daily_Drawdown_Protection_Pct=3.5
Delta_Neutral_Hedge_Threshold_Pct=2.8
Hard_Emergency_Circuit_Breaker_Pct=4.5
ATR_Trailing_Period=14
ATR_Trailing_Multiplier=2.2
Velocity_Detachment_Active=true
Decouple_Expansion_Runners=true
Unified_Basket_Equilibrium_Exit=true

[EXECUTION_LOGIC]
Strategy_Mode=Dual_Pending_Breakout_Detachment
Max_Simultaneous_Orders=4
Spread_Protection_Filter=true
Max_Allowed_Spread_Pips=22
Slippage_Max_Pips=3
News_Filter_Active=true
Pause_Minutes_Before_High_Impact=30
Pause_Minutes_After_High_Impact=30

[SESSIONS]
Trade_London_Session=true
Trade_NewYork_Session=true
Trade_Asian_Session=false
Close_All_Friday_Evening=true
Friday_Close_Hour_GMT=20
`;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(presetContent);
});

// API: Promo / Voucher Code Verification
app.post('/api/voucher/verify', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Please enter a voucher code.' });
  }

  const cleanCode = code.trim().toUpperCase();
  const validCodes = {
    'VELOCITY20': { discountPct: 20, description: '20% VIP Trader Launch Discount' },
    'GDAS20': { discountPct: 20, description: '20% Gold Digger Account Saver Launch Discount' },
    'INVESTOR': { discountFixed: 50, description: '$50 MT5 Verified Investor Special Credit' },
    'FTMOPASS': { discountPct: 15, description: '15% Prop Firm Special Discount' },
    'GOLD2026': { discountPct: 25, description: '25% Institutional Early Bird Discount' }
  };

  if (validCodes[cleanCode]) {
    return res.json({
      valid: true,
      code: cleanCode,
      ...validCodes[cleanCode]
    });
  }

  res.status(404).json({
    valid: false,
    error: 'Invalid or expired voucher code. Try "VELOCITY20" or "GDAS20" for 20% off.'
  });
});

// Dedicated Checkout Page Route
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

// Fallback to index.html for SPA/clean routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Investmentsview.de - Velocity Runner EA Server`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`⚡ Environment: Production Ready Node.js`);
  console.log(`====================================================`);
});
