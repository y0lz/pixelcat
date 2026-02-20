// ========== УПРАВЛЕНИЕ СЕТКОЙ ==========
// Отвечает за визуализацию поля и переход между слоями

// Инициализация сетки пикселей
// Создает HTML-структуру и рассчитывает порядок закрашивания
function initGrid() {
    const level = getCurrentLevel();
    const canvas = document.getElementById('pixel-canvas');
    canvas.innerHTML = ''; // Очищаем канвас
    
    // Устанавливаем размер сетки
    canvas.style.gridTemplateColumns = `repeat(${level.gridSize}, 32px)`;
    canvas.style.gridTemplateRows = `repeat(${level.gridSize}, 32px)`;

    // ========== РАСЧЕТ ПОРЯДКА ЗАКРАШИВАНИЯ ==========
    
    // 1. Создаем порядок заполнения ВСЕХ пикселей (для первых слоев)
    const allPositions = [];
    for (let y = 0; y < level.gridSize; y++) {
        for (let x = 0; x < level.gridSize; x++) {
            allPositions.push(y * level.gridSize + x);
        }
    }
    gameState.allPixelsOrder = allPositions;
    
    // 2. Создаем порядок для пикселей изображения (только не фон)
    // Закрашиваем от центра к краям для красивого эффекта
    const centerX = level.gridSize / 2;
    const centerY = level.gridSize / 2;
    const imagePositions = [];
    
    for (let y = 0; y < level.gridSize; y++) {
        for (let x = 0; x < level.gridSize; x++) {
            // Пропускаем фоновые пиксели (значение 0)
            if (level.pixelArt[y][x] !== 0) {
                // Рассчитываем расстояние от центра
                const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                imagePositions.push({ x, y, dist, index: y * level.gridSize + x });
            }
        }
    }
    
    // Сортируем по расстоянию (ближайшие к центру - первые)
    imagePositions.sort((a, b) => a.dist - b.dist);
    gameState.pixelOrder = imagePositions.map(p => p.index);
    
    // Рассчитываем общее количество подпикселей на слой
    gameState.totalPixelsPerLayer = level.gridSize * level.gridSize * 16;

    // ========== СОЗДАНИЕ HTML-ЭЛЕМЕНТОВ ==========
    
    for (let y = 0; y < level.gridSize; y++) {
        for (let x = 0; x < level.gridSize; x++) {
            // Создаем "большой пиксель" (видимый квадрат)
            const bigPixel = document.createElement('div');
            bigPixel.className = 'big-pixel';
            bigPixel.dataset.bigPixelIndex = y * level.gridSize + x;
            bigPixel.dataset.imageValue = level.pixelArt[y][x];

            // Создаем 16 "подпикселей" внутри каждого большого пикселя
            const subPixels = [];
            for (let j = 0; j < 16; j++) {
                const subPixel = document.createElement('div');
                subPixel.className = 'sub-pixel';
                subPixel.dataset.subPixelIndex = j;
                bigPixel.appendChild(subPixel);
                subPixels.push(subPixel);
            }

            // Сохраняем данные пикселя в gameState
            gameState.grid.push({ 
                element: bigPixel, 
                subPixels: subPixels, 
                layers: { dirt: 0, grass: 0, wood: 0, stone: 0, metal: 0 }, // Прогресс каждого слоя
                imageValue: level.pixelArt[y][x],                            // Значение из pixel art
                targetColor: level.colors[level.pixelArt[y][x]],            // Целевой цвет
                isImagePart: level.pixelArt[y][x] !== 0                     // Часть изображения или фон
            });
            canvas.appendChild(bigPixel);
        }
    }
}

// Заполнение одного подпикселя
// Главная визуальная функция - закрашивает следующий свободный подпиксель
function fillSubPixel() {
    const level = getCurrentLevel();
    const currentLayer = gameState.currentLayer;
    
    // ========== ПОИСК СЛЕДУЮЩЕГО СВОБОДНОГО ПОДПИКСЕЛЯ ==========
    
    // Для последнего слоя - заполняем только пиксели изображения
    // Для остальных слоев - заполняем ВСЁ поле (включая фон)
    let pixelIndex = -1;
    let subPixelIndex = -1;
    
    const isLastLayer = level.layers.indexOf(currentLayer) === level.layers.length - 1;
    const pixelsToCheck = isLastLayer ? gameState.pixelOrder : gameState.allPixelsOrder;
    
    // Ищем первый незакрашенный подпиксель
    for (let i = 0; i < pixelsToCheck.length; i++) {
        const idx = pixelsToCheck[i];
        const bigPixel = gameState.grid[idx];
        
        // Проверяем, можно ли класть этот слой (предыдущий должен быть завершен)
        const prevLayer = getPreviousLayer(currentLayer, level.layers);
        if (!prevLayer || bigPixel.layers[prevLayer] >= 16) {
            if (bigPixel.layers[currentLayer] < 16) {
                pixelIndex = idx;
                subPixelIndex = bigPixel.layers[currentLayer];
                break;
            }
        }
    }

    // ========== ПЕРЕХОД К СЛЕДУЮЩЕМУ СЛОЮ ==========
    
    // Если весь слой заполнен, переходим к следующему
    if (pixelIndex === -1) {
        const nextLayer = getNextLayer(currentLayer, level.layers);
        if (nextLayer) {
            // Разблокируем следующий слой
            unlockLayer(nextLayer);
            gameState.currentLayer = nextLayer;
            gameState.clicksPerPixel = gameState.baseClicksPerPixel[nextLayer];
            // Рекурсивно вызываем себя для закраски первого пикселя нового слоя
            fillSubPixel();
            return;
        } else {
            // Все слои заполнены - уровень пройден!
            showLevelComplete();
            return;
        }
    }

    // ========== ЗАКРАШИВАНИЕ ПОДПИКСЕЛЯ ==========
    
    const bigPixel = gameState.grid[pixelIndex];
    const subPixel = bigPixel.subPixels[subPixelIndex];

    // Определяем цвет для заполнения
    let fillColor;
    if (isLastLayer) {
        // Последний слой - используем целевой цвет из pixel art
        fillColor = bigPixel.targetColor;
    } else {
        // Промежуточные слои - используем цвет материала
        fillColor = gameState.materials[currentLayer].color;
    }

    // Анимация заполнения (плавное появление)
    subPixel.classList.add('filling');
    setTimeout(() => {
        subPixel.style.background = fillColor;
        subPixel.classList.remove('filling');
        subPixel.classList.add('filled');
    }, 150);

    // Обновляем прогресс
    bigPixel.layers[currentLayer]++;
    gameState.layerProgress[currentLayer]++;
}

// Получить предыдущий слой в последовательности
function getPreviousLayer(layer, layers) {
    const index = layers.indexOf(layer);
    return index > 0 ? layers[index - 1] : null;
}

// Получить следующий слой в последовательности
function getNextLayer(layer, layers) {
    const index = layers.indexOf(layer);
    return index < layers.length - 1 ? layers[index + 1] : null;
}

// Разблокировка нового слоя (показывает уведомление)
function unlockLayer(layerName) {
    // Если уже разблокирован - ничего не делаем
    if (gameState.materials[layerName].unlocked) return;
    
    gameState.materials[layerName].unlocked = true;

    // Показываем красивое уведомление
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

    // Автоматически скрываем через 2 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        notification.style.transition = 'all 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);

    updateUI();
}

// Проверка, открыто ли окно завершения уровня
// Используется для блокировки кликов и авто-добычи
function isLevelCompleteModalOpen() {
    return document.getElementById('next-level-btn') !== null;
}

// Показать экран завершения уровня
function showLevelComplete() {
    // Если кнопка перехода уже есть на экране - выходим
    // Это предотвращает спам окнами при быстрой авто-добыче
    if (isLevelCompleteModalOpen()) return;
    
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

    // Обработчик кнопки перехода
    document.getElementById('next-level-btn').addEventListener('click', () => {
        notification.remove();
        resetLevel();
    });
}

// Показать экран победы (все уровни пройдены)
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

    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'pixelPopIn 0.4s steps(4) reverse';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}
