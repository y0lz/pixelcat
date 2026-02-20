// ========== ОБРАБОТКА КЛИКОВ ==========

function handleClick(event) {
    processClick(event, false);
}

function processClick(event, isAuto = false) {
    // ВСЕГДА используем силу клика ЗЕМЛИ
    const dirtMat = gameState.materials.dirt;
    const clickPower = dirtMat.clickPower;
    
    if (isAuto) {
        gameState.autoPixelClicks += clickPower;
    } else {
        gameState.currentPixelClicks += clickPower;
    }

    // Добавляем ресурс в ОБА контейнера
    gameState.materials.dirt.earned += clickPower;
    gameState.materials.dirt.spendable += clickPower;

    // Эффекты только для ручных кликов
    if (!isAuto && event) {
        createClickEffect(event, dirtMat);
        createParticles(event, dirtMat.color);
    }

    // Проверяем, нужно ли заполнить подпиксели
    const totalClicks = gameState.currentPixelClicks + gameState.autoPixelClicks;
    const pixelsToFill = Math.floor(totalClicks / gameState.clicksPerPixel);
    
    if (pixelsToFill > 0) {
        for (let i = 0; i < pixelsToFill; i++) {
            fillSubPixel();
        }
        const remainder = totalClicks % gameState.clicksPerPixel;
        gameState.currentPixelClicks = remainder;
        gameState.autoPixelClicks = 0;
    }

    autoConvertResources();
    updateProgress();
    updateUI();
}

// Автоматическая добыча
function autoMine() {
    const dirtMat = gameState.materials.dirt;
    
    if (dirtMat.autoPerSec > 0) {
        gameState.materials.dirt.earned += dirtMat.autoPerSec / 10;
        gameState.materials.dirt.spendable += dirtMat.autoPerSec / 10;

        const autoClicksToAdd = dirtMat.autoPerSec / 10;
        gameState.autoPixelClicks += autoClicksToAdd;

        const totalClicks = gameState.currentPixelClicks + gameState.autoPixelClicks;
        const pixelsToFill = Math.floor(totalClicks / gameState.clicksPerPixel);

        if (pixelsToFill > 0) {
            for (let i = 0; i < pixelsToFill; i++) {
                fillSubPixel();
            }
            const remainder = totalClicks % gameState.clicksPerPixel;
            gameState.currentPixelClicks = remainder;
            gameState.autoPixelClicks = 0;
        }
    }

    autoConvertResources();
    updateProgress();
    updateUI();
}
