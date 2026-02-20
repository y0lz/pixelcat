// ========== ОБНОВЛЕНИЕ UI ==========

function updateUI() {
    const level = getCurrentLevel();
    
    // Обновление информации об уровне
    document.getElementById('level-name').textContent = level.name;
    document.getElementById('level-description').textContent = level.description;
    
    // Обновление ресурсов
    for (const [matName, mat] of Object.entries(gameState.materials)) {
        document.getElementById(`${matName}-amount`).textContent = Math.floor(mat.spendable);
        
        if (matName === 'dirt' && mat.autoPerSec > 0) {
            document.getElementById(`${matName}-rate`).textContent = `+${mat.autoPerSec.toFixed(1)}/s`;
        } else {
            document.getElementById(`${matName}-rate`).textContent = '';
        }
    }

    // Обновление кнопок улучшений
    const dirtMat = gameState.materials.dirt;
    document.getElementById('dirt-click-upgrade').disabled = dirtMat.spendable < gameState.upgradeCosts.dirt.click;
    document.getElementById('dirt-auto-upgrade').disabled = dirtMat.spendable < gameState.upgradeCosts.dirt.auto;
    document.getElementById('dirt-click-cost').textContent = gameState.upgradeCosts.dirt.click;
    document.getElementById('dirt-auto-cost').textContent = gameState.upgradeCosts.dirt.auto;
    document.getElementById('dirt-click-level').textContent = dirtMat.clickLevel - 1;
    document.getElementById('dirt-auto-level').textContent = dirtMat.autoLevel;
    document.getElementById('dirt-click-power').textContent = dirtMat.clickPower;
    document.getElementById('dirt-auto-power').textContent = dirtMat.autoPerSec.toFixed(1);

    const grassMat = gameState.materials.grass;
    document.getElementById('grass-click-upgrade').disabled = grassMat.spendable < gameState.upgradeCosts.grass.click;
    document.getElementById('grass-auto-upgrade').disabled = grassMat.spendable < gameState.upgradeCosts.grass.auto;
    document.getElementById('grass-click-cost').textContent = gameState.upgradeCosts.grass.click;
    document.getElementById('grass-auto-cost').textContent = gameState.upgradeCosts.grass.auto;
    document.getElementById('grass-click-level').textContent = grassMat.clickLevel - 1;
    document.getElementById('grass-auto-level').textContent = grassMat.autoLevel;

    const woodMat = gameState.materials.wood;
    document.getElementById('wood-click-upgrade').disabled = woodMat.spendable < gameState.upgradeCosts.wood.click;
    document.getElementById('wood-auto-upgrade').disabled = woodMat.spendable < gameState.upgradeCosts.wood.auto;
    document.getElementById('wood-click-cost').textContent = gameState.upgradeCosts.wood.click;
    document.getElementById('wood-auto-cost').textContent = gameState.upgradeCosts.wood.auto;
    document.getElementById('wood-click-level').textContent = woodMat.clickLevel - 1;
    document.getElementById('wood-auto-level').textContent = woodMat.autoLevel;

    const stoneMat = gameState.materials.stone;
    document.getElementById('stone-click-upgrade').disabled = stoneMat.spendable < gameState.upgradeCosts.stone.click;
    document.getElementById('stone-auto-upgrade').disabled = stoneMat.spendable < gameState.upgradeCosts.stone.auto;
    document.getElementById('stone-click-cost').textContent = gameState.upgradeCosts.stone.click;
    document.getElementById('stone-auto-cost').textContent = gameState.upgradeCosts.stone.auto;
    document.getElementById('stone-click-level').textContent = stoneMat.clickLevel - 1;
    document.getElementById('stone-auto-level').textContent = stoneMat.autoLevel;

    const metalMat = gameState.materials.metal;
    document.getElementById('metal-click-upgrade').disabled = metalMat.spendable < gameState.upgradeCosts.metal.click;
    document.getElementById('metal-auto-upgrade').disabled = metalMat.spendable < gameState.upgradeCosts.metal.auto;
    document.getElementById('metal-click-cost').textContent = gameState.upgradeCosts.metal.click;
    document.getElementById('metal-auto-cost').textContent = gameState.upgradeCosts.metal.auto;
    document.getElementById('metal-click-level').textContent = metalMat.clickLevel - 1;
    document.getElementById('metal-auto-level').textContent = metalMat.autoLevel;

    // Обновление текущего слоя
    document.getElementById('current-material').textContent = gameState.currentLayer.toUpperCase() + ' LAYER';
    document.getElementById('current-material').style.color = gameState.materials[gameState.currentLayer].color;
}
