// ========== УПРАВЛЕНИЕ СЕТКОЙ ==========

function initGrid() {
    const level = getCurrentLevel();
    const canvas = document.getElementById('pixel-canvas');
    canvas.innerHTML = ''; // Очищаем канвас
    
    canvas.style.gridTemplateColumns = `repeat(${level.gridSize}, 32px)`;
    canvas.style.gridTemplateRows = `repeat(${level.gridSize}, 32px)`;

    // Создаем порядок заполнения ВСЕХ пикселей
    const allPositions = [];
    for (let y = 0; y < level.gridSize; y++) {
        for (let x = 0; x < level.gridSize; x++) {
            allPositions.push(y * level.gridSize + x);
        }
    }
    gameState.allPixelsOrder = allPositions;
    
    // Создаем порядок для пикселей изображения (только не фон)
    const centerX = level.gridSize / 2;
    const centerY = level.gridSize / 2;
    const imagePositions = [];
    
    for (let y = 0; y < level.gridSize; y++) {
        for (let x = 0; x < level.gridSize; x++) {
            if (level.pixelArt[y][x] !== 0) {
                const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                imagePositions.push({ x, y, dist, index: y * level.gridSize + x });
            }
        }
    }
    
    imagePositions.sort((a, b) => a.dist - b.dist);
    gameState.pixelOrder = imagePositions.map(p => p.index);
    gameState.totalPixelsPerLayer = level.gridSize * level.gridSize * 16;

    for (let y = 0; y < level.gridSize; y++) {
        for (let x = 0; x < level.gridSize; x++) {
            const bigPixel = document.createElement('div');
            bigPixel.className = 'big-pixel';
            bigPixel.dataset.bigPixelIndex = y * level.gridSize + x;
            bigPixel.dataset.imageValue = level.pixelArt[y][x];

            const subPixels = [];
            for (let j = 0; j < 16; j++) {
                const subPixel = document.createElement('div');
                subPixel.className = 'sub-pixel';
                subPixel.dataset.subPixelIndex = j;
                bigPixel.appendChild(subPixel);
                subPixels.push(subPixel);
            }

            gameState.grid.push({ 
                element: bigPixel, 
                subPixels: subPixels, 
                layers: { dirt: 0, grass: 0, wood: 0, stone: 0, metal: 0 },
                imageValue: level.pixelArt[y][x],
                targetColor: level.colors[level.pixelArt[y][x]],
                isImagePart: level.pixelArt[y][x] !== 0
            });
            canvas.appendChild(bigPixel);
        }
    }
}

// Заполнение подпикселя
function fillSubPixel() {
    const level = getCurrentLevel();
    const currentLayer = gameState.currentLayer;
    
    // Для последнего слоя - заполняем только пиксели изображения
    // Для остальных - заполняем ВСЁ поле
    let pixelIndex = -1;
    let subPixelIndex = -1;
    
    const isLastLayer = level.layers.indexOf(currentLayer) === level.layers.length - 1;
    const pixelsToCheck = isLastLayer ? gameState.pixelOrder : gameState.allPixelsOrder;
    
    for (let i = 0; i < pixelsToCheck.length; i++) {
        const idx = pixelsToCheck[i];
        const bigPixel = gameState.grid[idx];
        
        // Проверяем, можно ли класть этот слой
        const prevLayer = getPreviousLayer(currentLayer, level.layers);
        if (!prevLayer || bigPixel.layers[prevLayer] >= 16) {
            if (bigPixel.layers[currentLayer] < 16) {
                pixelIndex = idx;
                subPixelIndex = bigPixel.layers[currentLayer];
                break;
            }
        }
    }

    // Если весь слой заполнен, переходим к следующему
    if (pixelIndex === -1) {
        const nextLayer = getNextLayer(currentLayer, level.layers);
        if (nextLayer) {
            unlockLayer(nextLayer);
            gameState.currentLayer = nextLayer;
            gameState.clicksPerPixel = gameState.baseClicksPerPixel[nextLayer];
            fillSubPixel();
            return;
        } else {
            // Все слои заполнены - уровень пройден!
            showLevelComplete();
            return;
        }
    }

    const bigPixel = gameState.grid[pixelIndex];
    const subPixel = bigPixel.subPixels[subPixelIndex];

    // Определяем цвет для заполнения
    let fillColor;
    if (isLastLayer) {
        fillColor = bigPixel.targetColor;
    } else {
        fillColor = gameState.materials[currentLayer].color;
    }

    // Анимация заполнения
    subPixel.classList.add('filling');
    setTimeout(() => {
        subPixel.style.background = fillColor;
        subPixel.classList.remove('filling');
        subPixel.classList.add('filled');
    }, 150);

    bigPixel.layers[currentLayer]++;
    gameState.layerProgress[currentLayer]++;
}

// Получить предыдущий слой
function getPreviousLayer(layer, layers) {
    const index = layers.indexOf(layer);
    return index > 0 ? layers[index - 1] : null;
}

// Получить следующий слой
function getNextLayer(layer, layers) {
    const index = layers.indexOf(layer);
    return index < layers.length - 1 ? layers[index + 1] : null;
}

// Разблокировка слоя
function unlockLayer(layerName) {
    if (gameState.materials[layerName].unlocked) return;
    
    gameState.materials[layerName].unlocked = true;

    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.innerHTML = `
        🎨 NEW LAYER 🎨<br>
        UNLOCKED!<br><br>
        <span style="font-size: 20px;">
            ${layerName.toUpperCase()}
        </span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        notification.style.transition = 'all 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);

    updateUI();
}

// Показать завершение уровня
function showLevelComplete() {
    const level = getCurrentLevel();
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.style.fontSize = '16px';
    notification.innerHTML = `
        🎉 LEVEL COMPLETE! 🎉<br><br>
        <span style="font-size: 18px;">${level.name}</span><br><br>
        <span style="font-size: 14px;">
            Rewards:<br>
            +${level.reward.clickPowerBonus} Click Power<br>
            +${level.reward.autoBonus} Auto/sec
        </span><br><br>
        <button id="next-level-btn" style="
            padding: 10px 20px;
            font-size: 16px;
            background: #4CAF50;
            color: white;
            border: 3px solid #000;
            cursor: pointer;
            font-family: 'Press Start 2P', monospace;
        ">NEXT LEVEL</button>
    `;
    document.body.appendChild(notification);

    document.getElementById('next-level-btn').addEventListener('click', () => {
        notification.remove();
        resetLevel();
    });
}

// Показать экран победы
function showVictoryScreen() {
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.style.fontSize = '16px';
    notification.innerHTML = `
        🏆 CONGRATULATIONS! 🏆<br><br>
        <span style="font-size: 14px;">
            You completed all levels!<br>
            You are a Pixel Master!
        </span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'pixelPopIn 0.4s steps(4) reverse';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}
