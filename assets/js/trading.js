// Trading logic

function openPosition(type) {
    const sizeInput = document.getElementById('positionSize');
    const size = parseFloat(sizeInput.value);
    const coinPrice = marketData[currentCoin].price;
    
    // Validation
    if (size < 10) {
        alert('Минимальный объем: $10');
        return;
    }
    
    if (size > availableBalance * leverage) {
        alert('Недостаточно средств. Увеличьте баланс или уменьшите объем.');
        return;
    }
    
    // Calculate margin
    const margin = size / leverage;
    
    // Calculate liquidation price
    let liquidationPrice;
    if (type === 'long') {
        liquidationPrice = coinPrice * (1 - (1 / leverage) + 0.005); // 0.5% buffer
    } else {
        liquidationPrice = coinPrice * (1 + (1 / leverage) - 0.005);
    }
    
    // Create position
    const position = {
        id: Date.now(),
        coin: currentCoin,
        type: type,
        entryPrice: coinPrice,
        size: size,
        margin: margin,
        leverage: leverage,
        liquidationPrice: liquidationPrice,
        timestamp: new Date().toISOString(),
        pnl: 0,
        roe: 0
    };
    
    positions.push(position);
    
    // Update market impact
    updateMarketImpact(size, type);
    
    // Update available balance
    availableBalance -= margin;
    
    // Update chart with trade marker
    updateChartDataOnTrade(size, type);
    
    // Save and update UI
    saveGameData();
    updateUI();
    updatePositionInfo();
    
    alert(`Позиция открыта!\n${type === 'long' ? 'Long' : 'Short'} ${currentCoin} ${size} USDT\nПлечо: ${leverage}x\nМаржа: $${margin.toFixed(2)}`);
}

function closePosition(positionId) {
    const positionIndex = positions.findIndex(p => p.id === positionId);
    
    if (positionIndex === -1) return;
    
    const position = positions[positionIndex];
    const coinPrice = marketData[position.coin].price;
    
    // Calculate P&L
    let pnl;
    if (position.type === 'long') {
        pnl = (coinPrice - position.entryPrice) / position.entryPrice * position.size;
    } else {
        pnl = (position.entryPrice - coinPrice) / position.entryPrice * position.size;
    }
    
    // Calculate ROE
    const roe = (pnl / position.margin) * 100;
    
    // Create history record
    const historyRecord = {
        id: position.id,
        coin: position.coin,
        type: position.type,
        entryPrice: position.entryPrice,
        exitPrice: coinPrice,
        size: position.size,
        margin: position.margin,
        leverage: position.leverage,
        pnl: pnl,
        roe: roe,
        openTime: position.timestamp,
        closeTime: new Date().toISOString()
    };
    
    tradeHistory.push(historyRecord);
    
    // Update balance
    balance += pnl;
    equity = balance;
    
    // Return margin
    availableBalance += position.margin + pnl;
    
    // Remove position
    positions.splice(positionIndex, 1);
    
    // Update market impact (closing reduces impact)
    updateMarketImpact(position.size, position.type === 'long' ? 'short' : 'long');
    
    // Save and update
    saveGameData();
    updateUI();
    
    alert(`Позиция закрыта!\nP&L: $${pnl.toFixed(2)} (${roe.toFixed(2)}% ROE)`);
}

function updateMarketImpact(size, type) {
    // Simulate market impact: buying increases demand (price up), selling increases supply (price down)
    const impactMultiplier = currentCoin === 'BTC' ? 0.000001 : currentCoin === 'DOGE' ? 0.00001 : 0.00002;
    const impact = type === 'long' ? size * impactMultiplier : -size * impactMultiplier;
    
    marketData[currentCoin].price += impact;
    
    // Update change percentage
    const coinData = marketData[currentCoin];
    coinData.change = ((coinData.price - chartData[0].open) / chartData[0].open) * 100;
}

function calculateAvailableBalance() {
    let usedMargin = 0;
    positions.forEach(pos => {
        usedMargin += pos.margin;
    });
    
    availableBalance = Math.max(0, balance - usedMargin);
    
    // Update equity (balance + unrealized P&L)
    let unrealizedPNL = 0;
    positions.forEach(pos => {
        const currentPrice = marketData[pos.coin].price;
        if (pos.type === 'long') {
            unrealizedPNL += (currentPrice - pos.entryPrice) / pos.entryPrice * pos.size;
        } else {
            unrealizedPNL += (pos.entryPrice - currentPrice) / pos.entryPrice * pos.size;
        }
    });
    
    equity = balance + unrealizedPNL;
    
    // Update margin and liquidation displays
    updatePositionInfo();
}

function updatePositionInfo() {
    const sizeInput = document.getElementById('positionSize');
    const size = parseFloat(sizeInput.value) || 100;
    const coinPrice = marketData[currentCoin].price;
    
    // Calculate margin requirement
    const margin = size / leverage;
    document.getElementById('marginAmount').textContent = `$${margin.toFixed(2)}`;
    
    // Calculate liquidation price
    let liquidationPrice;
    if (document.querySelector('.btn-buy').contains(document.activeElement)) {
        // For long
        liquidationPrice = coinPrice * (1 - (1 / leverage) + 0.005);
    } else {
        // For short
        liquidationPrice = coinPrice * (1 + (1 / leverage) - 0.005);
    }
    
    document.getElementById('liqPrice').textContent = `$${liquidationPrice.toFixed(currentCoin === 'BTC' ? 2 : 6)}`;
}

function checkLiquidations() {
    positions.forEach((position, index) => {
        const currentPrice = marketData[position.coin].price;
        
        if ((position.type === 'long' && currentPrice <= position.liquidationPrice) ||
            (position.type === 'short' && currentPrice >= position.liquidationPrice)) {
            
            // Position liquidated
            const liquidationRecord = {
                id: position.id,
                coin: position.coin,
                type: position.type,
                entryPrice: position.entryPrice,
                exitPrice: currentPrice,
                size: position.size,
                margin: position.margin,
                leverage: position.leverage,
                pnl: -position.margin, // Lose all margin
                roe: -100,
                openTime: position.timestamp,
                closeTime: new Date().toISOString(),
                liquidated: true
            };
            
            tradeHistory.push(liquidationRecord);
            
            // Update balance (lose margin)
            balance -= position.margin;
            
            // Remove position
            positions.splice(index, 1);
            
            // Update UI
            updateUI();
            
            alert(`Позиция ликвидирована! Потеряно: $${position.margin.toFixed(2)}`);
        }
    });
}

function updatePositionsDisplay() {
    const container = document.getElementById('positionsContainer');
    const noPositions = document.getElementById('noPositions');
    
    if (positions.length === 0) {
        container.innerHTML = '';
        noPositions.style.display = 'block';
        return;
    }
    
    noPositions.style.display = 'none';
    container.innerHTML = '';
    
    positions.forEach(position => {
        const currentPrice = marketData[position.coin].price;
        let pnl;
        let roe;
        
        if (position.type === 'long') {
            pnl = (currentPrice - position.entryPrice) / position.entryPrice * position.size;
        } else {
            pnl = (position.entryPrice - currentPrice) / position.entryPrice * position.size;
        }
        
        roe = (pnl / position.margin) * 100;
        
        const positionEl = document.createElement('div');
        positionEl.className = `position-item ${position.type}`;
        positionEl.innerHTML = `
            <div class="position-header">
                <span>${position.coin} ${position.type === 'long' ? 'LONG' : 'SHORT'}</span>
                <span style="color: ${pnl >= 0 ? '#0ecb81' : '#f6465d'}">
                    $${pnl.toFixed(2)} (${roe.toFixed(2)}%)
                </span>
            </div>
            <div class="position-details">
                <div>Вход: $${position.entryPrice.toFixed(position.coin === 'BTC' ? 2 : 6)}</div>
                <div>Текущая: $${currentPrice.toFixed(position.coin === 'BTC' ? 2 : 6)}</div>
                <div>Объем: $${position.size.toFixed(2)}</div>
                <div>Плечо: ${position.leverage}x</div>
                <div>Маржа: $${position.margin.toFixed(2)}</div>
                <div>Ликвидация: $${position.liquidationPrice.toFixed(position.coin === 'BTC' ? 2 : 6)}</div>
            </div>
            <button class="close-btn" onclick="closePosition(${position.id})">Закрыть</button>
        `;
        
        container.appendChild(positionEl);
    });
}

function setStopLoss() {
    const priceInput = document.getElementById('stopPrice');
    const price = parseFloat(priceInput.value);
    
    if (!price || price <= 0) {
        alert('Введите корректную цену');
        return;
    }
    
    const stopLoss = {
        id: Date.now(),
        coin: currentCoin,
        price: price,
        timestamp: new Date().toISOString()
    };
    
    stopLosses.push(stopLoss);
    priceInput.value = '';
    
    updateStopsDisplay();
    saveGameData();
    
    alert(`Стоп-лосс установлен на $${price.toFixed(currentCoin === 'BTC' ? 2 : 6)}`);
}

function checkStopLosses() {
    const currentPrice = marketData[currentCoin].price;
    
    stopLosses.forEach((stop, index) => {
        if (stop.coin === currentCoin) {
            // Check if price hits stop loss
            if (currentPrice <= stop.price) {
                // Close all positions for this coin
                positions.filter(p => p.coin === currentCoin).forEach(position => {
                    closePosition(position.id);
                });
                
                // Remove stop loss
                stopLosses.splice(index, 1);
                
                alert(`Стоп-лосс сработал! Цена: $${currentPrice.toFixed(6)}`);
            }
        }
    });
}

function updateStopsDisplay() {
    const container = document.getElementById('stopsContainer');
    container.innerHTML = '';
    
    stopLosses.filter(stop => stop.coin === currentCoin).forEach(stop => {
        const stopEl = document.createElement('div');
        stopEl.className = 'position-item';
        stopEl.innerHTML = `
            <div class="position-header">
                <span>${stop.coin} Стоп-лосс</span>
                <span style="color: #f6465d">${new Date(stop.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="position-details">
                <div>Цена: $${stop.price.toFixed(currentCoin === 'BTC' ? 2 : 6)}</div>
                <div>Текущая: $${marketData[currentCoin].price.toFixed(currentCoin === 'BTC' ? 2 : 6)}</div>
            </div>
        `;
        container.appendChild(stopEl);
    });
}
