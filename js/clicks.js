// ========== ОБРАБОТКА КЛИКОВ ==========
// Преобразует действия пользователя и время во внутриигровой прогресс

// Обработчик клика мыши по канвасу
function handleClick(event) {
    processClick(event, false);
}

// Универсальная функция обработки кликов
// @param event - событие клика (для визуальных эффектов)
// @param isAuto - true для авто-добычи, false для ручных кликов
function processClick(event, isAuto = false) {
    // Блокируем клики, пока открыто окно завершения уровня
    if (isLevelCompleteModalOpen()) return;
    
    // ВСЕГДА используем силу клика ЗЕМЛИ (базовая валюта)
    // Это ключевая механика баланса: улучшения других ресурсов усиливают добычу земли
    const dirtMat = gameState.materials.dirt;
    const clickPower = dirtMat.clickPower;
    
    // Добавляем клики в соответствующий счетчик
    if (isAuto) {
        gameState.autoPixelClicks += clickPower;
    } else {
        gameState.currentPixelClicks += clickPower;
    }

    // Добавляем ресурс в ОБА контейнера
    gameState.materials.dirt.earned += clickPower;      // Статистика
    gameState.materials.dirt.spendable += clickPower;   // Для трат

    // Эффекты только для ручных кликов (не для авто-добычи)
    if (!isAuto && event) {
        createClickEffect(event, dirtMat);
        createParticles(event, dirtMat.color);
    }

    // ========== ЛОГИКА ЗАКРАШИВАНИЯ ПИКСЕЛЕЙ ==========
    // Проверяем, нужно ли заполнить подпиксели
    const totalClicks = gameState.currentPixelClicks + gameState.autoPixelClicks;
    const pixelsToFill = Math.floor(totalClicks / gameState.clicksPerPixel);
    
    if (pixelsToFill > 0) {
        // ОПТИМИЗАЦИЯ 1: Ограничиваем количество закрашиваний за один "тик"
        // Это предотвращает зависание браузера при очень быстрой авто-добыче
        const maxFills = 50;
        const actualFills = Math.min(pixelsToFill, maxFills);
        let filledCount = 0;
        
        for (let i = 0; i < actualFills; i++) {
            fillSubPixel();
            filledCount++;
            
            // ОПТИМИЗАЦИЯ 2: Экстренный тормоз при завершении уровня
            // Прерываем цикл, чтобы избежать спама окнами завершения
            if (document.getElementById('next-level-btn')) {
                break;
            }
        }
        
        // Рассчитываем сколько кликов реально потратили
        const usedClicks = filledCount * gameState.clicksPerPixel;
        const isLevelDone = document.getElementById('next-level-btn');
        
        // ОПТИМИЗАЦИЯ 3: Сохранение "сдачи" кликов
        // Если мы уперлись в лимит maxFills, бережно сохраняем остаток
        // чтобы докрасить пиксели в следующем тике
        if (pixelsToFill > maxFills && !isLevelDone) {
            gameState.autoPixelClicks = totalClicks - usedClicks - gameState.currentPixelClicks;
        } else {
            // Оставшиеся клики не сгорают, а переходят на следующий уровень
            gameState.currentPixelClicks = totalClicks - usedClicks;
            gameState.autoPixelClicks = 0;
        }
    }

    // Автоматическая конвертация ресурсов (земля → трава → дерево и т.д.)
    autoConvertResources();
    
    // Обновляем прогресс-бар
    updateProgress();
    
    // Обновляем весь UI
    updateUI();
}

// Автоматическая добыча (вызывается каждые 100мс из игрового цикла)
function autoMine() {
    // Ставим авто-добычу на паузу, пока открыто окно завершения уровня
    if (isLevelCompleteModalOpen()) return;
    
    const dirtMat = gameState.materials.dirt;
    
    // Если есть авто-добыча, генерируем ресурсы
    if (dirtMat.autoPerSec > 0) {
        // Делим на 10, так как функция вызывается 10 раз в секунду
        gameState.materials.dirt.earned += dirtMat.autoPerSec / 10;
        gameState.materials.dirt.spendable += dirtMat.autoPerSec / 10;

        const autoClicksToAdd = dirtMat.autoPerSec / 10;
        gameState.autoPixelClicks += autoClicksToAdd;

        // ========== ЛОГИКА ЗАКРАШИВАНИЯ ПИКСЕЛЕЙ (идентична processClick) ==========
        const totalClicks = gameState.currentPixelClicks + gameState.autoPixelClicks;
        const pixelsToFill = Math.floor(totalClicks / gameState.clicksPerPixel);

        if (pixelsToFill > 0) {
            // Ограничиваем количество закрашиваний за один "тик"
            const maxFills = 50;
            const actualFills = Math.min(pixelsToFill, maxFills);
            let filledCount = 0;
            
            for (let i = 0; i < actualFills; i++) {
                fillSubPixel();
                filledCount++;
                // Экстренный тормоз при завершении уровня
                if (document.getElementById('next-level-btn')) {
                    break;
                }
            }
            
            const usedClicks = filledCount * gameState.clicksPerPixel;
            const isLevelDone = document.getElementById('next-level-btn');
            
            // Сохранение "сдачи" кликов
            if (pixelsToFill > maxFills && !isLevelDone) {
                gameState.autoPixelClicks = totalClicks - usedClicks - gameState.currentPixelClicks;
            } else {
                gameState.currentPixelClicks = totalClicks - usedClicks;
                gameState.autoPixelClicks = 0;
            }
        }
    }

    // Автоматическая конвертация ресурсов
    autoConvertResources();
    
    // Обновляем UI
    updateProgress();
    updateUI();
}
