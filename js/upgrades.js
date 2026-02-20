// ========== СИСТЕМА УЛУЧШЕНИЙ ==========

function setupUpgrades() {
    // За землю качаем землю
    document.getElementById('dirt-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.dirt.click;
        if (gameState.materials.dirt.spendable >= cost) {
            gameState.materials.dirt.spendable -= cost;
            gameState.materials.dirt.clickLevel++;
            gameState.materials.dirt.clickPower += 1;
            gameState.upgradeCosts.dirt.click = Math.floor(cost * 1.12);
            updateUI();
        }
    });

    document.getElementById('dirt-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.dirt.auto;
        if (gameState.materials.dirt.spendable >= cost) {
            gameState.materials.dirt.spendable -= cost;
            gameState.materials.dirt.autoLevel++;
            gameState.materials.dirt.autoPerSec += 0.3;
            gameState.upgradeCosts.dirt.auto = Math.floor(cost * 1.12);
            updateUI();
        }
    });

    // За траву качаем ЗЕМЛЮ
    document.getElementById('grass-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.grass.click;
        if (gameState.materials.grass.spendable >= cost) {
            gameState.materials.grass.spendable -= cost;
            gameState.materials.dirt.clickLevel++;
            gameState.materials.dirt.clickPower += 3;
            gameState.upgradeCosts.grass.click = Math.floor(cost * 1.13);
            updateUI();
        }
    });

    document.getElementById('grass-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.grass.auto;
        if (gameState.materials.grass.spendable >= cost) {
            gameState.materials.grass.spendable -= cost;
            gameState.materials.dirt.autoLevel++;
            gameState.materials.dirt.autoPerSec += 1.5;
            gameState.upgradeCosts.grass.auto = Math.floor(cost * 1.13);
            updateUI();
        }
    });

    // За дерево качаем ЗЕМЛЮ
    document.getElementById('wood-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.wood.click;
        if (gameState.materials.wood.spendable >= cost) {
            gameState.materials.wood.spendable -= cost;
            gameState.materials.dirt.clickLevel++;
            gameState.materials.dirt.clickPower += 15;
            gameState.upgradeCosts.wood.click = Math.floor(cost * 1.14);
            updateUI();
        }
    });

    document.getElementById('wood-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.wood.auto;
        if (gameState.materials.wood.spendable >= cost) {
            gameState.materials.wood.spendable -= cost;
            gameState.materials.dirt.autoLevel++;
            gameState.materials.dirt.autoPerSec += 7;
            gameState.upgradeCosts.wood.auto = Math.floor(cost * 1.14);
            updateUI();
        }
    });

    // За камень качаем ЗЕМЛЮ
    document.getElementById('stone-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.stone.click;
        if (gameState.materials.stone.spendable >= cost) {
            gameState.materials.stone.spendable -= cost;
            gameState.materials.dirt.clickLevel++;
            gameState.materials.dirt.clickPower += 75;
            gameState.upgradeCosts.stone.click = Math.floor(cost * 1.15);
            updateUI();
        }
    });

    document.getElementById('stone-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.stone.auto;
        if (gameState.materials.stone.spendable >= cost) {
            gameState.materials.stone.spendable -= cost;
            gameState.materials.dirt.autoLevel++;
            gameState.materials.dirt.autoPerSec += 35;
            gameState.upgradeCosts.stone.auto = Math.floor(cost * 1.15);
            updateUI();
        }
    });

    // За металл качаем ЗЕМЛЮ
    document.getElementById('metal-click-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.metal.click;
        if (gameState.materials.metal.spendable >= cost) {
            gameState.materials.metal.spendable -= cost;
            gameState.materials.dirt.clickLevel++;
            gameState.materials.dirt.clickPower += 400;
            gameState.upgradeCosts.metal.click = Math.floor(cost * 1.16);
            updateUI();
        }
    });

    document.getElementById('metal-auto-upgrade').addEventListener('click', () => {
        const cost = gameState.upgradeCosts.metal.auto;
        if (gameState.materials.metal.spendable >= cost) {
            gameState.materials.metal.spendable -= cost;
            gameState.materials.dirt.autoLevel++;
            gameState.materials.dirt.autoPerSec += 200;
            gameState.upgradeCosts.metal.auto = Math.floor(cost * 1.16);
            updateUI();
        }
    });
}
