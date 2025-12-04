// Market simulation and depth

function startMarketSimulation() {
    // Update market data every second
    setInterval(() => {
        updateChartData();
    }, 1000);
    
    // Update market depth every 2 seconds
    setInterval(() => {
        generateMarketDepth();
    }, 2000);
}

function generateMarketDepth() {
    const coinData = marketData[currentCoin];
    const currentPrice = coinData.price;
    
    // Clear previous depth
    coinData.bids = [];
    coinData.asks = [];
    
    // Generate realistic order book
    for (let i = 0; i < 10; i++) {
        // Bids (buy orders) - slightly below current price
        const bidPrice = currentPrice * (1 - (i + 1) * 0.001 - Math.random() * 0.0005);
        const bidSize = Math.random() * 100 + 50; // Random size
        
        coinData.bids.push({
            price: bidPrice,
            size: bidSize,
            total: bidPrice * bidSize
        });
        
        // Asks (sell orders) - slightly above current price
        const askPrice = currentPrice * (1 + (i + 1) * 0.001 + Math.random() * 0.0005);
        const askSize = Math.random() * 100 + 50;
        
        coinData.asks.push({
            price: askPrice,
            size: askSize,
            total: askPrice * askSize
        });
    }
    
    // Sort bids descending, asks ascending
    coinData.bids.sort((a, b) => b.price - a.price);
    coinData.asks.sort((a, b) => a.price - b.price);
    
    updateMarketDepth();
}

function updateMarketDepth() {
    const coinData = marketData[currentCoin];
    const bidsList = document.getElementById('bidsList');
    const asksList = document.getElementById('asksList');
    
    bidsList.innerHTML = '';
    asksList.innerHTML = '';
    
    // Calculate total volume for percentage calculation
    let totalBidVolume = coinData.bids.reduce((sum, bid) => sum + bid.size, 0);
    let totalAskVolume = coinData.asks.reduce((sum, ask) => sum + ask.size, 0);
    
    // Display bids (buy orders)
    coinData.bids.forEach(bid => {
        const percentage = (bid.size / totalBidVolume * 100).toFixed(1);
        const depthItem = document.createElement('div');
        depthItem.className = 'depth-item';
        depthItem.innerHTML = `
            <span>${bid.price.toFixed(currentCoin === 'BTC' ? 2 : 6)}</span>
            <span>${bid.size.toFixed(2)}</span>
            <span style="color: #0ecb81">${percentage}%</span>
        `;
        bidsList.appendChild(depthItem);
    });
    
    // Display asks (sell orders)
    coinData.asks.forEach(ask => {
        const percentage = (ask.size / totalAskVolume * 100).toFixed(1);
        const depthItem = document.createElement('div');
        depthItem.className = 'depth-item';
        depthItem.innerHTML = `
            <span>${ask.price.toFixed(currentCoin === 'BTC' ? 2 : 6)}</span>
            <span>${ask.size.toFixed(2)}</span>
            <span style="color: #f6465d">${percentage}%</span>
        `;
        asksList.appendChild(depthItem);
    });
}

// Market events functionality
function addMarketEvent() {
    const events = [
        // Positive events (15)
        { text: "📈 Крупный инвестор купил 5000 BTC", impact: 0.03, type: 'positive' },
        { text: "✅ SEC одобрила BTC ETF", impact: 0.05, type: 'positive' },
        { text: "🏦 Банк начал предлагать криптоуслуги", impact: 0.02, type: 'positive' },
        { text: "💼 Tesla добавляет Bitcoin в баланс", impact: 0.04, type: 'positive' },
        { text: "🌍 Страна приняла Bitcoin как законное платежное средство", impact: 0.06, type: 'positive' },
        { text: "⚡ Обновление сети увеличило скорость транзакций", impact: 0.015, type: 'positive' },
        { text: "🤝 Крупное партнерство с Visa/Mastercard", impact: 0.025, type: 'positive' },
        { text: "📊 Увеличилось число активных кошельков", impact: 0.01, type: 'positive' },
        { text: "🛡️ Улучшена безопасность сети", impact: 0.008, type: 'positive' },
        { text: "🎯 Крупный хедж-фонд вошел в рынок", impact: 0.035, type: 'positive' },
        { text: "📱 Запущено массовое крипто-приложение", impact: 0.018, type: 'positive' },
        { text: "🌉 Внедрен новый мост между сетями", impact: 0.012, type: 'positive' },
        { text: "🏛️ Правительство снизило налоги на крипто", impact: 0.022, type: 'positive' },
        { text: "🔗 Крупный DeFi проект запущен", impact: 0.016, type: 'positive' },
        { text: "🚀 Запуск нового протокола стейкинга", impact: 0.014, type: 'positive' },
        
        // Negative events (15)
        { text: "📉 Крупный инвестор продал 3000 BTC", impact: -0.04, type: 'negative' },
        { text: "❌ SEC отклонила заявку на ETF", impact: -0.06, type: 'negative' },
        { text: "🏛️ Правительство запретило криптовалюты", impact: -0.08, type: 'negative' },
        { text: "🔓 Взлом биржи: украдено $100M", impact: -0.07, type: 'negative' },
        { text: "⚡ Сбой в сети на 2 часа", impact: -0.03, type: 'negative' },
        { text: "📰 Негативные новости в СМИ", impact: -0.025, type: 'negative' },
        { text: "💸 Крупный продавец на рынке", impact: -0.035, type: 'negative' },
        { text: "🌍 Глобальный экономический кризис", impact: -0.05, type: 'negative' },
        { text: "⚖️ Новые регуляторные ограничения", impact: -0.028, type: 'negative' },
        { text: "🔧 Технические проблемы с сетью", impact: -0.015, type: 'negative' },
        { text: "📊 Снижение объема торгов", impact: -0.012, type: 'negative' },
        { text: "🚨 Мошенничество на $50M", impact: -0.045, type: 'negative' },
        { text: "🏦 Банк закрывает крипто-счета", impact: -0.032, type: 'negative' },
        { text: "⚡ Атака 51% на сеть", impact: -0.065, type: 'negative' },
        { text: "📉 Падение всего рынка", impact: -0.055, type: 'negative' }
    ];
    
    // Pick random event
    const event = events[Math.floor(Math.random() * events.length)];
    
    // Apply impact to all coins (with different intensity)
    Object.keys(marketData).forEach(coin => {
        // Different coins react differently to events
        let multiplier = 1;
        if (coin === 'SHIB') multiplier = 1.5; // Meme coins more volatile
        if (coin === 'DOGE') multiplier = 1.3;
        
        const impact = event.impact * multiplier;
        marketData[coin].price *= (1 + impact);
        
        // Update change percentage
        const coinData = marketData[coin];
        if (chartData.length > 0) {
            coinData.change = ((coinData.price - chartData[0].open) / chartData[0].open) * 100;
        }
    });
    
    // Display event
    displayEvent(event);
    
    // Update UI
    updateUI();
}

function displayEvent(event) {
    const feed = document.getElementById('eventsFeed');
    const eventEl = document.createElement('div');
    eventEl.className = `event-item ${event.type}`;
    eventEl.innerHTML = `
        <div>${event.text}</div>
        <small>${new Date().toLocaleTimeString()}</small>
    `;
    
    // Add to top
    feed.insertBefore(eventEl, feed.firstChild);
    
    // Keep only last 10 events
    while (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
}

function loadMarketEvents() {
    // Display initial events
    const initialEvents = [
        { text: "🟢 Рынок открыт. Начало торгов.", type: 'positive' },
        { text: "📊 Объем торгов выше среднего", type: 'positive' },
        { text: "⚡ Быстрое исполнение ордеров", type: 'positive' }
    ];
    
    initialEvents.forEach(event => {
        displayEvent(event);
    });
}
