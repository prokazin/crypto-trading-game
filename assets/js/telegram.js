// Telegram Web Apps integration

function initTelegram() {
    if (!window.Telegram || !Telegram.WebApp) {
        console.log('Telegram Web Apps not available');
        return;
    }
    
    // Expand the app to full height
    Telegram.WebApp.expand();
    
    // Set background color
    Telegram.WebApp.setBackgroundColor('#0b0e11');
    
    // Set header color
    Telegram.WebApp.setHeaderColor('#161a1e');
    
    // Enable closing confirmation
    Telegram.WebApp.enableClosingConfirmation();
    
    // Check if user is premium for bonuses
    const user = Telegram.WebApp.initDataUnsafe.user;
    if (user && user.is_premium) {
        // Give bonus to premium users
        balance += 500;
        equity = balance;
        availableBalance = balance;
        
        const eventEl = document.createElement('div');
        eventEl.className = 'event-item positive';
        eventEl.innerHTML = `
            <div>⭐ Премиум пользователь! Бонус: +$500</div>
            <small>${new Date().toLocaleTimeString()}</small>
        `;
        
        const feed = document.getElementById('eventsFeed');
        feed.insertBefore(eventEl, feed.firstChild);
        
        saveGameData();
        updateUI();
    }
    
    // Setup payment system
    setupTelegramPayments();
    
    // Setup cloud storage sync
    setupCloudStorage();
}

function setupTelegramPayments() {
    if (!Telegram.WebApp) return;
    
    // Check if payments are available
    if (Telegram.WebApp.isVersionAtLeast('6.1')) {
        console.log('Telegram Payments available');
    }
}

function setupCloudStorage() {
    if (!Telegram.WebApp || !Telegram.WebApp.CloudStorage) {
        console.log('Cloud Storage not available');
        return;
    }
    
    // Sync every minute
    setInterval(() => {
        Telegram.WebApp.CloudStorage.getItem(STORAGE_KEY, (err, data) => {
            if (!err && data) {
                try {
                    const cloudData = JSON.parse(data);
                    const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                    
                    // Use newer data
                    const cloudTime = cloudData.timestamp || 0;
                    const localTime = localData.timestamp || 0;
                    
                    if (cloudTime > localTime) {
                        applyGameData(cloudData);
                        updateUI();
                    }
                } catch (e) {
                    console.error('Error syncing cloud storage:', e);
                }
            }
        });
    }, 60000); // Every minute
}

function purchaseStars(starsAmount, gameDollars) {
    if (!window.Telegram || !Telegram.WebApp) {
        // Simulate purchase for local testing
        stars += starsAmount;
        alert(`В демо-режиме: куплено ${starsAmount} звезд`);
        
        document.getElementById('starsModal').style.display = 'none';
        updateUI();
        return;
    }
    
    // Real Telegram Stars purchase
    if (Telegram.WebApp.isVersionAtLeast('6.10')) {
        Telegram.WebApp.openInvoice({
            title: `Покупка ${starsAmount} Telegram Stars`,
            description: `Получите ${gameDollars} игровых долларов`,
            currency: 'XTR',
            prices: [{ label: `${starsAmount} Stars`, amount: starsAmount * 100 }]
        }, (status) => {
            if (status === 'paid') {
                // Success
                stars += starsAmount;
                
                const eventEl = document.createElement('div');
                eventEl.className = 'event-item positive';
                eventEl.innerHTML = `
                    <div>⭐ Куплено ${starsAmount} звезд</div>
                    <small>${new Date().toLocaleTimeString()}</small>
                `;
                
                const feed = document.getElementById('eventsFeed');
                feed.insertBefore(eventEl, feed.firstChild);
                
                document.getElementById('starsModal').style.display = 'none';
                saveGameData();
                updateUI();
            }
        });
    } else {
        alert('Покупка звезд доступна в последней версии Telegram');
    }
}

function convertStarsToDollars() {
    const conversionRate = 100; // 1 star = 100 game dollars
    
    if (stars <= 0) {
        alert('У вас нет звезд для конвертации');
        return;
    }
    
    const dollars = stars * conversionRate;
    
    if (confirm(`Конвертировать ${stars} звезд в $${dollars}?`)) {
        balance += dollars;
        equity = balance;
        stars = 0;
        
        const eventEl = document.createElement('div');
        eventEl.className = 'event-item positive';
        eventEl.innerHTML = `
            <div>💵 Конвертировано ${stars} звезд в $${dollars}</div>
            <small>${new Date().toLocaleTimeString()}</small>
        `;
        
        const feed = document.getElementById('eventsFeed');
        feed.insertBefore(eventEl, feed.firstChild);
        
        saveGameData();
        updateUI();
    }
}

// Add convert button to stars display
function addConvertButton() {
    const starsSection = document.querySelector('.stars');
    if (!starsSection.querySelector('.convert-btn')) {
        const convertBtn = document.createElement('button');
        convertBtn.className = 'btn-small';
        convertBtn.textContent = 'Конвертировать';
        convertBtn.onclick = convertStarsToDollars;
        convertBtn.style.marginLeft = '5px';
        starsSection.appendChild(convertBtn);
    }
}

// Call this after Telegram init
setTimeout(addConvertButton, 1000);
