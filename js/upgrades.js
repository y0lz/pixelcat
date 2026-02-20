// ========== СИСТЕМА УЛУЧШЕНИЙ ==========
// Динамический баланс: бонусы растут с каждой покупкой

function setupUpgrades() {
    // За землю качаем землю
    document.getElementById('dirt-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.dirt.click;
        if (gameState.materials.dirt.spendable >= cost) {
            gameState.materials.dirt.spendable -= cost;
            gameState.materials.dirt.clickLevel++;
            
            // Динамический бонус: растет с уровнем (1, 2, 3, 4, 5...)
            const bonus = gameState.materials.dirt.clickLevel;
            gameState.materials.dirt.clickPower += bonus;
            
            gameState.upgradeCosts.dirt.click = Math.floor(cost * 1.15);
            updateUI();
        }
    });

    document.getElementById('dirt-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.dirt.auto;
        if (gameState.materials.dirt.spendable >= cost) {
            gameState.materials.dirt.spendable -= cost;
            gameState.materials.dirt.autoLevel++;
            
            // Динамический бонус: растет с уровнем (0.5, 1, 1.5, 2...)
            const bonus = gameState.materials.dirt.autoLevel * 0.5;
            gameState.materials.dirt.autoPerSec += bonus;
            
            gameState.upgradeCosts.dirt.auto = Math.floor(cost * 1.15);
            updateUI();
        }
    });

    // За траву качаем ЗЕМЛЮ
    document.getElementById('grass-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.grass.click;
        if (gameState.materials.grass.spendable >= cost) {
            gameState.materials.grass.spendable -= cost;
            gameState.materials.grass.clickLevel++;
            
            // Динамический бонус: 5 * уровень (5, 10, 15, 20...)
            const bonus = gameState.materials.grass.clickLevel * 5;
            gameState.materials.dirt.clickPower += bonus;
            
            gameState.upgradeCosts.grass.click = Math.floor(cost * 1.18);
            updateUI();
        }
    });

    document.getElementById('grass-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.grass.auto;
        if (gameState.materials.grass.spendable >= cost) {
            gameState.materials.grass.spendable -= cost;
            gameState.materials.grass.autoLevel++;
            
            // Динамический бонус: 2 * уровень (2, 4, 6, 8...)
            const bonus = gameState.materials.grass.autoLevel * 2;
            gameState.materials.dirt.autoPerSec += bonus;
            
            gameState.upgradeCosts.grass.auto = Math.floor(cost * 1.18);
            updateUI();
        }
    });

    // За дерево качаем ЗЕМЛЮ
    document.getElementById('wood-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.wood.click;
        if (gameState.materials.wood.spendable >= cost) {
            gameState.materials.wood.spendable -= cost;
            gameState.materials.wood.clickLevel++;
            
            // Динамический бонус: 25 * уровень (25, 50, 75, 100...)
            const bonus = gameState.materials.wood.clickLevel * 25;
            gameState.materials.dirt.clickPower += bonus;
            
            gameState.upgradeCosts.wood.click = Math.floor(cost * 1.2);
            updateUI();
        }
    });

    document.getElementById('wood-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.wood.auto;
        if (gameState.materials.wood.spendable >= cost) {
            gameState.materials.wood.spendable -= cost;
            gameState.materials.wood.autoLevel++;
            
            // Динамический бонус: 10 * уровень (10, 20, 30, 40...)
            const bonus = gameState.materials.wood.autoLevel * 10;
            gameState.materials.dirt.autoPerSec += bonus;
            
            gameState.upgradeCosts.wood.auto = Math.floor(cost * 1.2);
            updateUI();
        }
    });

    // За камень качаем ЗЕМЛЮ
    document.getElementById('stone-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.stone.click;
        if (gameState.materials.stone.spendable >= cost) {
            gameState.materials.stone.spendable -= cost;
            gameState.materials.stone.clickLevel++;
            
            // Динамический бонус: 125 * уровень (125, 250, 375, 500...)
            const bonus = gameState.materials.stone.clickLevel * 125;
            gameState.materials.dirt.clickPower += bonus;
            
            gameState.upgradeCosts.stone.click = Math.floor(cost * 1.22);
            updateUI();
        }
    });

    document.getElementById('stone-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.stone.auto;
        if (gameState.materials.stone.spendable >= cost) {
            gameState.materials.stone.spendable -= cost;
            gameState.materials.stone.autoLevel++;
            
            // Динамический бонус: 50 * уровень (50, 100, 150, 200...)
            const bonus = gameState.materials.stone.autoLevel * 50;
            gameState.materials.dirt.autoPerSec += bonus;
            
            gameState.upgradeCosts.stone.auto = Math.floor(cost * 1.22);
            updateUI();
        }
    });

    // За металл качаем ЗЕМЛЮ
    document.getElementById('metal-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.metal.click;
        if (gameState.materials.metal.spendable >= cost) {
            gameState.materials.metal.spendable -= cost;
            gameState.materials.metal.clickLevel++;
            
            // Динамический бонус: 625 * уровень (625, 1250, 1875, 2500...)
            const bonus = gameState.materials.metal.clickLevel * 625;
            gameState.materials.dirt.clickPower += bonus;
            
            gameState.upgradeCosts.metal.click = Math.floor(cost * 1.25);
            updateUI();
        }
    });

    document.getElementById('metal-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.metal.auto;
        if (gameState.materials.metal.spendable >= cost) {
            gameState.materials.metal.spendable -= cost;
            gameState.materials.metal.autoLevel++;
            
            // Динамический бонус: 250 * уровень (250, 500, 750, 1000...)
            const bonus = gameState.materials.metal.autoLevel * 250;
            gameState.materials.dirt.autoPerSec += bonus;
            
            gameState.upgradeCosts.metal.auto = Math.floor(cost * 1.25);
            updateUI();
        }
    });
}
