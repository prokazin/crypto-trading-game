// Data persistence and storage

const STORAGE_KEY = 'crypto_trading_game_data';
const LEADERBOARD_KEY = 'crypto_trading_leaderboard';

function saveGameData() {
    const gameData = {
        balance,
        equity,
        stars,
        positions,
        stopLosses,
        tradeHistory,
        marketData,
        timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
    
    // Also save to leaderboard if signed in via Telegram
    saveToLeaderboard();
    
    // Telegram Cloud Storage if available
    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.CloudStorage) {
        Telegram.WebApp.CloudStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
    }
}

function loadGameData() {
    let loaded = false;
    
    // Try Telegram Cloud Storage first
    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.CloudStorage) {
        Telegram.WebApp.CloudStorage.getItem(STORAGE_KEY, (err, data) => {
            if (data && !err) {
                try {
                    const gameData = JSON.parse(data);
                    applyGameData(gameData);
                    loaded = true;
                } catch (e) {
                    console.error('Error parsing Telegram storage data:', e);
                }
            }
        });
    }
    
    // Fallback to localStorage
    if (!loaded) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const gameData = JSON.parse(saved);
                
                // Check if data is not too old (7 days max)
                const dataAge = Date.now() - (gameData.timestamp || 0);
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
                
                if (dataAge < maxAge) {
                    applyGameData(gameData);
                } else {
                    console.log('Saved data too old, starting fresh');
                }
            } catch (e) {
                console.error('Error parsing saved data:', e);
            }
        }
    }
}

function applyGameData(gameData) {
    if (gameData.balance !== undefined) balance = gameData.balance;
    if (gameData.equity !== undefined) equity = gameData.equity;
    if (gameData.stars !== undefined) stars = gameData.stars;
    if (gameData.positions) positions = gameData.positions;
    if (gameData.stopLosses) stopLosses = gameData.stopLosses;
    if (gameData.tradeHistory) tradeHistory = gameData.tradeHistory;
    
    // Only load market data if it's not corrupted
    if (gameData.marketData) {
        Object.keys(gameData.marketData).forEach(coin => {
            if (marketData[coin]) {
                // Keep current price but update change
                const savedPrice = gameData.marketData[coin].price;
                if (savedPrice && savedPrice > 0) {
                    marketData[coin].price = savedPrice;
                    marketData[coin].change = gameData.marketData[coin].change || 0;
                }
            }
        });
    }
    
    // Update calculations
    calculateAvailableBalance();
}

function saveToLeaderboard() {
    try {
        const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
        
        // Get user identifier (from Telegram or generate anonymous)
        let userId = 'anonymous';
        let userName = 'Анонимный трейдер';
        
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
            const user = Telegram.WebApp.initDataUnsafe.user;
            if (user) {
                userId = user.id.toString();
                userName = user.first_name || 'Telegram User';
                if (user.username) {
                    userName = `@${user.username}`;
                }
            }
        }
        
        // Find existing entry
        const existingIndex = leaderboard.findIndex(entry => entry.userId === userId);
        
        const leaderboardEntry = {
            userId,
            userName,
            balance: equity, // Use equity for ranking
            timestamp: Date.now()
        };
        
        if (existingIndex >= 0) {
            leaderboard[existingIndex] = leaderboardEntry;
        } else {
            leaderboard.push(leaderboardEntry);
        }
        
        // Sort by balance (descending) and keep top 50
        leaderboard.sort((a, b) => b.balance - a.balance);
        if (leaderboard.length > 50) {
            leaderboard.length = 50;
        }
        
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    } catch (e) {
        console.error('Error saving to leaderboard:', e);
    }
}

function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    const container = document.getElementById('leaderboardList');
    
    container.innerHTML = '';
    
    if (leaderboard.length === 0) {
        container.innerHTML = '<div class="event-item">Рейтинг пуст</div>';
        return;
    }
    
    leaderboard.forEach((entry, index) => {
        const rank = index + 1;
        const entryEl = document.createElement('div');
        entryEl.className = 'leaderboard-item';
        
        let rankEmoji = '🥇';
        if (rank === 2) rankEmoji = '🥈';
        else if (rank === 3) rankEmoji = '🥉';
        else rankEmoji = `${rank}.`;
        
        entryEl.innerHTML = `
            <div>
                <span class="leaderboard-rank">${rankEmoji}</span>
                <span>${entry.userName}</span>
            </div>
            <div style="color: #0ecb81">$${entry.balance.toFixed(2)}</div>
        `;
        
        container.appendChild(entryEl);
    });
}

function updateHistoryDisplay() {
    const container = document.getElementById('historyList');
    
    if (tradeHistory.length === 0) {
        container.innerHTML = '<div class="event-item">История сделок пуста</div>';
        return;
    }
    
    // Show last 20 trades
    const recentHistory = tradeHistory.slice(-20).reverse();
    
    recentHistory.forEach(record => {
        const historyEl = document.createElement('div');
        historyEl.className = 'history-item';
        
        const openTime = new Date(record.openTime).toLocaleString();
        const closeTime = new Date(record.closeTime).toLocaleString();
        const pnlClass = record.pnl >= 0 ? 'profit' : 'loss';
        const typeColor = record.type === 'long' ? '#0ecb81' : '#f6465d';
        
        historyEl.innerHTML = `
            <div class="history-header">
                <span style="color: ${typeColor}">${record.coin} ${record.type === 'long' ? 'LONG' : 'SHORT'}</span>
                <span class="${pnlClass}">$${record.pnl.toFixed(2)} (${record.roe.toFixed(2)}%)</span>
            </div>
            <div class="history-details">
                <div>Вход: $${record.entryPrice.toFixed(record.coin === 'BTC' ? 2 : 6)}</div>
                <div>Выход: $${record.exitPrice.toFixed(record.coin === 'BTC' ? 2 : 6)}</div>
                <div>Объем: $${record.size.toFixed(2)}</div>
                <div>Плечо: ${record.leverage}x</div>
                <div>Открыта: ${openTime}</div>
                <div>Закрыта: ${closeTime}</div>
                ${record.liquidated ? '<div style="color: #f6465d">ЛИКВИДАЦИЯ</div>' : ''}
            </div>
        `;
        
        container.appendChild(historyEl);
    });
}
