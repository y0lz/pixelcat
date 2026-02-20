// ========== СОХРАНЕНИЕ И ЗАГРУЗКА ==========

function saveGame() {
    const saveData = {
        currentLevel: gameState.currentLevel,
        materials: gameState.materials,
        currentLayer: gameState.currentLayer,
        currentPixelClicks: gameState.currentPixelClicks,
        autoPixelClicks: gameState.autoPixelClicks,
        layerProgress: gameState.layerProgress,
        clicksPerPixel: gameState.clicksPerPixel,
        upgradeCosts: gameState.upgradeCosts,
        gridState: gameState.grid.map(g => ({ layers: g.layers }))
    };
    localStorage.setItem('pixelCatIncrementalSave', JSON.stringify(saveData));
}

function loadGame() {
    const save = localStorage.getItem('pixelCatIncrementalSave');
    if (save) {
        const loaded = JSON.parse(save);

        gameState.currentLevel = loaded.currentLevel || 0;

        // Загружаем материалы с миграцией
        for (const [matName, mat] of Object.entries(loaded.materials)) {
            if (mat.amount !== undefined && mat.earned === undefined) {
                gameState.materials[matName].earned = mat.amount;
                gameState.materials[matName].spendable = mat.amount;
            } else {
                gameState.materials[matName].earned = mat.earned || 0;
                gameState.materials[matName].spendable = mat.spendable || 0;
            }
            
            gameState.materials[matName].clickPower = mat.clickPower || 1;
            gameState.materials[matName].autoPerSec = mat.autoPerSec || 0;
            gameState.materials[matName].clickLevel = mat.clickLevel || 1;
            gameState.materials[matName].autoLevel = mat.autoLevel || 0;
            gameState.materials[matName].unlocked = mat.unlocked || false;
        }
        
        gameState.materials.dirt.unlocked = true;
        
        gameState.currentLayer = loaded.currentLayer;
        gameState.currentPixelClicks = loaded.currentPixelClicks || 0;
        gameState.autoPixelClicks = loaded.autoPixelClicks || 0;
        gameState.layerProgress = loaded.layerProgress;
        gameState.clicksPerPixel = loaded.clicksPerPixel || 4;
        gameState.upgradeCosts = loaded.upgradeCosts;

        // Восстановление сетки
        if (loaded.gridState && loaded.gridState.length === gameState.grid.length) {
            const level = getCurrentLevel();
            for (let i = 0; i < gameState.grid.length; i++) {
                if (loaded.gridState[i]) {
                    const bigPixel = gameState.grid[i];
                    bigPixel.layers = loaded.gridState[i].layers;
                    
                    for (const layer of level.layers) {
                        const layerCount = bigPixel.layers[layer];
                        const isLastLayer = level.layers.indexOf(layer) === level.layers.length - 1;
                        
                        for (let j = 0; j < layerCount; j++) {
                            const subPixel = bigPixel.subPixels[j];
                            if (isLastLayer) {
                                subPixel.style.background = bigPixel.targetColor;
                            } else {
                                subPixel.style.background = gameState.materials[layer].color;
                            }
                            subPixel.classList.add('filled');
                        }
                    }
                }
            }
        }

        // Разблокировка UI
        for (const [matName, mat] of Object.entries(gameState.materials)) {
            if (mat.unlocked && matName !== 'dirt') {
                const resourceEl = document.getElementById(`${matName}-resource`);
                if (resourceEl) resourceEl.classList.remove('locked');
            }
        }

        updateProgress();
        updateUI();
    }
}
