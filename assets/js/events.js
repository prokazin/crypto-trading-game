// Market events data and management

const marketEvents = {
    positive: [
        {
            id: 1,
            title: "Принятие BTC как законного платежного средства",
            description: "Еще одна страна приняла Bitcoin в качестве официального платежного средства",
            impact: {
                BTC: 0.08,
                SHIB: 0.04,
                DOGE: 0.05
            }
        },
        {
            id: 2,
            title: "Крупный институциональный инвестор",
            description: "Хедж-фонд купил 10,000 BTC через OTC сделку",
            impact: {
                BTC: 0.06,
                SHIB: 0.02,
                DOGE: 0.03
            }
        },
        {
            id: 3,
            title: "Успешное обновление сети",
            description: "Хардфорк прошел успешно, повысив пропускную способность",
            impact: {
                BTC: 0.03,
                SHIB: 0.01,
                DOGE: 0.02
            }
        },
        {
            id: 4,
            title: "Партнерство с платежной системой",
            description: "Visa интегрировала поддержку криптовалют",
            impact: {
                BTC: 0.04,
                SHIB: 0.03,
                DOGE: 0.04
            }
        },
        {
            id: 5,
            title: "Увеличение хешрейта",
            description: "Хешрейт сети достиг исторического максимума",
            impact: {
                BTC: 0.02,
                SHIB: 0.01,
                DOGE: 0.015
            }
        },
        {
            id: 6,
            title: "Положительный прогноз аналитиков",
            description: "Известный аналитик предсказал рост на 50%",
            impact: {
                BTC: 0.05,
                SHIB: 0.04,
                DOGE: 0.045
            }
        },
        {
            id: 7,
            title: "Увеличение институционального интереса",
            description: "Еще 5 крупных компаний добавили BTC в баланс",
            impact: {
                BTC: 0.045,
                SHIB: 0.02,
                DOGE: 0.025
            }
        },
        {
            id: 8,
            title: "Снижение регуляторного давления",
            description: "Регулятор смягчил требования для криптобирж",
            impact: {
                BTC: 0.035,
                SHIB: 0.025,
                DOGE: 0.03
            }
        },
        {
            id: 9,
            title: "Запуск нового ETF",
            description: "Одобрен новый крипто-ETF на традиционной бирже",
            impact: {
                BTC: 0.055,
                SHIB: 0.03,
                DOGE: 0.035
            }
        },
        {
            id: 10,
            title: "Рост adoption",
            description: "Количество активных адресов выросло на 20%",
            impact: {
                BTC: 0.025,
                SHIB: 0.015,
                DOGE: 0.02
            }
        },
        {
            id: 11,
            title: "Технологический прорыв",
            description: "Представлено новое масштабирующее решение",
            impact: {
                BTC: 0.04,
                SHIB: 0.035,
                DOGE: 0.038
            }
        },
        {
            id: 12,
            title: "Положительный квартальный отчет",
            description: "Крупная криптокомпания показала рост прибыли",
            impact: {
                BTC: 0.03,
                SHIB: 0.02,
                DOGE: 0.025
            }
        },
        {
            id: 13,
            title: "Интеграция с соцсетью",
            description: "Крупная соцсеть добавила крипто-платежи",
            impact: {
                BTC: 0.035,
                SHIB: 0.045,
                DOGE: 0.05
            }
        },
        {
            id: 14,
            title: "Снижение инфляции",
            description: "Макроэкономические данные лучше ожиданий",
            impact: {
                BTC: 0.028,
                SHIB: 0.018,
                DOGE: 0.022
            }
        },
        {
            id: 15,
            title: "Рост DeFi TVL",
            description: "Общая заблокированная стоимость в DeFi выросла",
            impact: {
                BTC: 0.022,
                SHIB: 0.032,
                DOGE: 0.028
            }
        }
    ],
    
    negative: [
        {
            id: 16,
            title: "Запрет криптовалют",
            description: "Крупная страна запретила криптовалюты",
            impact: {
                BTC: -0.09,
                SHIB: -0.06,
                DOGE: -0.07
            }
        },
        {
            id: 17,
            title: "Взлом биржи",
            description: "Криптобиржа взломана, украдено $200M",
            impact: {
                BTC: -0.07,
                SHIB: -0.05,
                DOGE: -0.06
            }
        },
        {
            id: 18,
            title: "Жесткие регуляторные меры",
            description: "Регулятор ввел новые ограничения",
            impact: {
                BTC: -0.05,
                SHIB: -0.04,
                DOGE: -0.045
            }
        },
        {
            id: 19,
            title: "Крупная продажа",
            description: "Кит продал 15,000 BTC на рынке",
            impact: {
                BTC: -0.065,
                SHIB: -0.03,
                DOGE: -0.04
            }
        },
        {
            id: 20,
            title: "Технические проблемы",
            description: "Сеть остановлена на 3 часа",
            impact: {
                BTC: -0.04,
                SHIB: -0.035,
                DOGE: -0.038
            }
        },
        {
            id: 21,
            title: "Негативный прогноз",
            description: "Известный инвестор предсказал падение",
            impact: {
                BTC: -0.045,
                SHIB: -0.04,
                DOGE: -0.043
            }
        },
        {
            id: 22,
            title: "Повышение ставок ФРС",
            description: "Федеральная резервная система повысила ставки",
            impact: {
                BTC: -0.055,
                SHIB: -0.035,
                DOGE: -0.04
            }
        },
        {
            id: 23,
            title: "Снижение хешрейта",
            description: "Хешрейт упал на 15%",
            impact: {
                BTC: -0.03,
                SHIB: -0.02,
                DOGE: -0.025
            }
        },
        {
            id: 24,
            title: "Отказ от интеграции",
            description: "Крупная компания отказалась от крипто-планов",
            impact: {
                BTC: -0.035,
                SHIB: -0.025,
                DOGE: -0.03
            }
        },
        {
            id: 25,
            title: "Снижение объема торгов",
            description: "Суточный объем упал на 30%",
            impact: {
                BTC: -0.025,
                SHIB: -0.03,
                DOGE: -0.028
            }
        },
        {
            id: 26,
            title: "Провальное обновление",
            description: "Новое обновление вызвало проблемы",
            impact: {
                BTC: -0.038,
                SHIB: -0.028,
                DOGE: -0.032
            }
        },
        {
            id: 27,
            title: "Мошенничество",
            description: "Обнаружен скам-проект на $50M",
            impact: {
                BTC: -0.042,
                SHIB: -0.045,
                DOGE: -0.044
            }
        },
        {
            id: 28,
            title: "Рост инфляции",
            description: "Инфляция превысила ожидания",
            impact: {
                BTC: -0.048,
                SHIB: -0.032,
                DOGE: -0.038
            }
        },
        {
            id: 29,
            title: "Снижение интереса институций",
            description: "Институциональные инвесторы выходят из рынка",
            impact: {
                BTC: -0.052,
                SHIB: -0.035,
                DOGE: -0.042
            }
        },
        {
            id: 30,
            title: "Глобальный риск-офф",
            description: "Рост страха на всех рынках",
            impact: {
                BTC: -0.06,
                SHIB: -0.05,
                DOGE: -0.055
            }
        }
    ]
};

// Random event generator
function generateRandomEvent() {
    // 70% chance positive, 30% negative (for demo)
    const isPositive = Math.random() > 0.3;
    const eventList = isPositive ? marketEvents.positive : marketEvents.negative;
    const event = eventList[Math.floor(Math.random() * eventList.length)];
    
    return event;
}

// Apply event impact
function applyEventImpact(event) {
    Object.keys(event.impact).forEach(coin => {
        if (marketData[coin]) {
            const impact = event.impact[coin];
            marketData[coin].price *= (1 + impact);
            
            // Ensure price doesn't go too low
            if (marketData[coin].price < 0.00000001) {
                marketData[coin].price = 0.00000001;
            }
            
            // Update change percentage
            const coinData = marketData[coin];
            if (chartData.length > 0) {
                coinData.change = ((coinData.price - chartData[0].open) / chartData[0].open) * 100;
            }
        }
    });
    
    return event;
}

// Display event in feed
function displayMarketEvent(event) {
    const feed = document.getElementById('eventsFeed');
    const isPositive = marketEvents.positive.some(e => e.id === event.id);
    
    const eventEl = document.createElement('div');
    eventEl.className = `event-item ${isPositive ? 'positive' : 'negative'}`;
    eventEl.innerHTML = `
        <div><strong>${event.title}</strong></div>
        <div style="font-size: 11px; margin: 3px 0">${event.description}</div>
        <small>${new Date().toLocaleTimeString()}</small>
    `;
    
    // Add to top
    feed.insertBefore(eventEl, feed.firstChild);
    
    // Keep only last 10 events
    while (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
    
    // Show notification
    showEventNotification(event.title, isPositive);
}

function showEventNotification(title, isPositive) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isPositive ? '#0ecb81' : '#f6465d'};
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <strong>${isPositive ? '📈' : '📉'} ${title}</strong>
        <div style="font-size: 12px; margin-top: 5px">Событие повлияло на рынок</div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Auto-generate events every 30-60 seconds
function startEventGenerator() {
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of event
            const event = generateRandomEvent();
            const appliedEvent = applyEventImpact(event);
            displayMarketEvent(appliedEvent);
            updateUI();
        }
    }, 30000 + Math.random() * 30000); // 30-60 seconds
}

// Start event generator when page loads
setTimeout(startEventGenerator, 10000);
