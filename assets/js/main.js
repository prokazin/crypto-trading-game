// Main initialization and global variables
let currentCoin = 'BTC';
let currentPrice = 68423.50;
let balance = 2000;
let equity = 2000;
let availableBalance = 2000;
let stars = 0;
let leverage = 2;
let positions = [];
let stopLosses = [];
let tradeHistory = [];
let marketData = {
    BTC: { price: 68423.50, change: 2.34, bids: [], asks: [] },
    SHIB: { price: 0.000023, change: -1.2, bids: [], asks: [] },
    DOGE: { price: 0.15, change: 0.8, bids: [], asks: [] }
};
let chart = null;
let chartSeries = null;

// Initialize the game
function initGame() {
    loadGameData();
    initChart();
    updateUI();
    startMarketSimulation();
    generateMarketDepth();
    loadMarketEvents();
    
    // Telegram Web Apps integration
    if (window.Telegram && Telegram.WebApp) {
        initTelegram();
    }
    
    // Auto-save every 30 seconds
    setInterval(saveGameData, 30000);
}

// Update all UI elements
function updateUI() {
    // Update balance displays
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('equity').textContent = `$${equity.toFixed(2)}`;
    document.getElementById('availableBalance').textContent = `$${availableBalance.toFixed(2)}`;
    document.getElementById('stars').textContent = stars;
    
    // Update current price display
    const coinData = marketData[currentCoin];
    document.getElementById('currentPrice').textContent = `$${coinData.price.toFixed(currentCoin === 'BTC' ? 2 : 6)}`;
    
    const changeElement = document.getElementById('priceChange');
    changeElement.textContent = `${coinData.change >= 0 ? '+' : ''}${coinData.change.toFixed(2)}%`;
    changeElement.className = coinData.change >= 0 ? 'positive' : 'negative';
    
    // Update positions display
    updatePositionsDisplay();
    
    // Update market depth
    updateMarketDepth();
    
    // Calculate available balance
    calculateAvailableBalance();
    
    // Check for liquidations
    checkLiquidations();
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Activate corresponding button
    document.querySelector(`.tab-btn[onclick*="${tabName}"]`).classList.add('active');
}

// Set position size
function setSize(amount) {
    const input = document.getElementById('positionSize');
    if (amount === 'all') {
        input.value = Math.floor(availableBalance * 0.95); // 95% of available
    } else {
        input.value = amount;
    }
}

// Show modals
function showHistory() {
    updateHistoryDisplay();
    document.getElementById('historyModal').style.display = 'block';
}

function showLeaderboard() {
    updateLeaderboard();
    document.getElementById('leaderboardModal').style.display = 'block';
}

function buyStars() {
    document.getElementById('starsModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Reset game
function resetGame() {
    if (confirm('Вы уверены? Все данные будут сброшены.')) {
        balance = 2000;
        equity = 2000;
        availableBalance = 2000;
        positions = [];
        stopLosses = [];
        tradeHistory = [];
        stars = 0;
        
        // Reset market data
        marketData = {
            BTC: { price: 68423.50, change: 2.34, bids: [], asks: [] },
            SHIB: { price: 0.000023, change: -1.2, bids: [], asks: [] },
            DOGE: { price: 0.15, change: 0.8, bids: [], asks: [] }
        };
        
        saveGameData();
        updateUI();
        initChart();
        generateMarketDepth();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initGame);

// Coin selection change
document.getElementById('coinSelect').addEventListener('change', function(e) {
    currentCoin = e.target.value;
    updateUI();
    updateChartData();
});

// Leverage buttons
document.querySelectorAll('.lev-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.lev-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        leverage = parseInt(this.dataset.leverage);
        updatePositionInfo();
    });
});

// Timeframe buttons
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // In a real app, this would update chart timeframe
    });
});
