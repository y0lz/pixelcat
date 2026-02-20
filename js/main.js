// ========== ИНИЦИАЛИЗАЦИЯ ИГРЫ ==========

function init() {
    // Инициализация уровня
    initLevel();
    initGrid();
    setupUpgrades();
    
    // Обработчик кликов
    document.getElementById('pixel-canvas').addEventListener('click', handleClick);

    // Автоматическая добыча каждые 100мс
    setInterval(autoMine, 100);

    // Автосохранение каждые 30 секунд
    setInterval(saveGame, 30000);

    // Загрузка сохранения
    loadGame();

    updateUI();
}

// Запуск игры
init();
