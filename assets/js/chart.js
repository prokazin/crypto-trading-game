// Chart initialization and management
let chartData = [];
let lastUpdateTime = Date.now();

function initChart() {
    const chartContainer = document.getElementById('chart');
    
    // Clear previous chart
    chartContainer.innerHTML = '';
    
    // Create chart
    chart = LightweightCharts.createChart(chartContainer, {
        layout: {
            background: { color: 'transparent' },
            textColor: '#848e9c',
        },
        grid: {
            vertLines: { color: '#2b3139' },
            horzLines: { color: '#2b3139' },
        },
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight,
        timeScale: {
            borderColor: '#2b3139',
            timeVisible: true,
            secondsVisible: false,
        },
        rightPriceScale: {
            borderColor: '#2b3139',
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
    });
    
    // Create candlestick series
    chartSeries = chart.addCandlestickSeries({
        upColor: '#0ecb81',
        downColor: '#f6465d',
        borderVisible: false,
        wickUpColor: '#0ecb81',
        wickDownColor: '#f6465d',
    });
    
    // Generate initial data
    generateInitialChartData();
    
    // Update chart on resize
    new ResizeObserver(updateChartSize).observe(chartContainer);
}

function updateChartSize() {
    const chartContainer = document.getElementById('chart');
    chart.applyOptions({
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight,
    });
}

function generateInitialChartData() {
    chartData = [];
    const now = Math.floor(Date.now() / 1000);
    let price = marketData[currentCoin].price;
    
    // Generate 100 candles
    for (let i = 100; i >= 0; i--) {
        const time = now - i * 60; // 1 minute candles
        
        // Realistic price movement with volatility
        const volatility = currentCoin === 'BTC' ? 0.002 : currentCoin === 'DOGE' ? 0.005 : 0.008;
        const change = (Math.random() - 0.5) * 2 * volatility * price;
        price += change;
        
        const open = price;
        const close = price + (Math.random() - 0.5) * volatility * price;
        const high = Math.max(open, close) + Math.random() * volatility * price * 0.3;
        const low = Math.min(open, close) - Math.random() * volatility * price * 0.3;
        
        chartData.push({
            time: time,
            open: open,
            high: high,
            low: low,
            close: close,
        });
    }
    
    chartSeries.setData(chartData);
}

function updateChartData() {
    const now = Math.floor(Date.now() / 1000);
    const currentData = chartData[chartData.length - 1];
    const coinData = marketData[currentCoin];
    
    // Create new candle every 5 seconds (for demo purposes)
    if (now - lastUpdateTime >= 5) {
        lastUpdateTime = now;
        
        // Add realistic market impact from positions
        let impact = 0;
        positions.forEach(pos => {
            if (pos.coin === currentCoin) {
                // Buying pressure increases price, selling decreases
                impact += pos.type === 'long' ? pos.size * 0.000001 : -pos.size * 0.000001;
            }
        });
        
        // Add some randomness
        const volatility = currentCoin === 'BTC' ? 0.001 : currentCoin === 'DOGE' ? 0.003 : 0.005;
        const randomChange = (Math.random() - 0.5) * 2 * volatility * coinData.price;
        
        // Apply changes
        coinData.price += randomChange + impact;
        coinData.change = ((coinData.price - chartData[0].open) / chartData[0].open) * 100;
        
        // Ensure price doesn't go below 0
        coinData.price = Math.max(coinData.price, 0.00000001);
        
        // Update last candle or create new one
        if (currentData && now - currentData.time < 60) {
            // Update current candle
            currentData.close = coinData.price;
            currentData.high = Math.max(currentData.high, coinData.price);
            currentData.low = Math.min(currentData.low, coinData.price);
        } else {
            // Create new candle
            chartData.push({
                time: now,
                open: currentData ? currentData.close : coinData.price,
                high: coinData.price,
                low: coinData.price,
                close: coinData.price,
            });
            
            // Keep only last 200 candles
            if (chartData.length > 200) {
                chartData.shift();
            }
        }
        
        chartSeries.update(chartData[chartData.length - 1]);
        updateUI();
        
        // Check stop losses
        checkStopLosses();
    }
    
    // Update market depth based on new price
    updateMarketDepth();
}

function addEntryMarker(price, type) {
    const markers = [];
    
    // Add entry marker
    markers.push({
        time: chartData[chartData.length - 1].time,
        position: 'aboveBar',
        color: type === 'long' ? '#0ecb81' : '#f6465d',
        shape: 'arrowDown',
        text: type === 'long' ? 'LONG' : 'SHORT',
    });
    
    chartSeries.setMarkers(markers);
}

function updateChartDataOnTrade(size, type) {
    // Market impact simulation
    const impact = type === 'long' ? size * 0.000005 : -size * 0.000005;
    marketData[currentCoin].price += impact;
    
    // Add marker to chart
    addEntryMarker(marketData[currentCoin].price, type);
}
