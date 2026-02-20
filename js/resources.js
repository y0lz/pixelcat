// ========== СИСТЕМА РЕСУРСОВ ==========

// Автоконвертация ресурсов
function autoConvertResources() {
    // Земля -> Трава (5 земли = 1 трава)
    const dirtEarned = gameState.materials.dirt.earned;
    const grassConv = conversionRates.grass;
    const grassFromDirt = Math.floor(dirtEarned / grassConv.dirtRequired) * grassConv.grassPerConversion;
    if (grassFromDirt > gameState.materials.grass.earned) {
        const newGrass = grassFromDirt - gameState.materials.grass.earned;
        gameState.materials.grass.earned = grassFromDirt;
        gameState.materials.grass.spendable += newGrass;
    }
    
    // Трава -> Дерево (10 травы = 1 дерево)
    const grassEarned = gameState.materials.grass.earned;
    const woodConv = conversionRates.wood;
    const woodFromGrass = Math.floor(grassEarned / woodConv.grassRequired) * woodConv.woodPerConversion;
    if (woodFromGrass > gameState.materials.wood.earned) {
        const newWood = woodFromGrass - gameState.materials.wood.earned;
        gameState.materials.wood.earned = woodFromGrass;
        gameState.materials.wood.spendable += newWood;
    }
    
    // Дерево -> Камень (15 дерева = 1 камень)
    const woodEarned = gameState.materials.wood.earned;
    const stoneConv = conversionRates.stone;
    const stoneFromWood = Math.floor(woodEarned / stoneConv.woodRequired) * stoneConv.stonePerConversion;
    if (stoneFromWood > gameState.materials.stone.earned) {
        const newStone = stoneFromWood - gameState.materials.stone.earned;
        gameState.materials.stone.earned = stoneFromWood;
        gameState.materials.stone.spendable += newStone;
    }
    
    // Камень -> Металл (20 камня = 1 металл)
    const stoneEarned = gameState.materials.stone.earned;
    const metalConv = conversionRates.metal;
    const metalFromStone = Math.floor(stoneEarned / metalConv.stoneRequired) * metalConv.metalPerConversion;
    if (metalFromStone > gameState.materials.metal.earned) {
        const newMetal = metalFromStone - gameState.materials.metal.earned;
        gameState.materials.metal.earned = metalFromStone;
        gameState.materials.metal.spendable += newMetal;
    }
}

// Рассчитать сколько ресурсов получится из земли
function calculateResourcesFromDirt(dirtAmount) {
    const result = {
        dirt: dirtAmount,
        grass: 0,
        wood: 0,
        stone: 0,
        metal: 0
    };
    
    // Земля -> Трава
    if (dirtAmount >= conversionRates.grass.dirtRequired) {
        result.grass = Math.floor(dirtAmount / conversionRates.grass.dirtRequired);
        
        // Трава -> Дерево
        if (result.grass >= conversionRates.wood.grassRequired) {
            result.wood = Math.floor(result.grass / conversionRates.wood.grassRequired);
            
            // Дерево -> Камень
            if (result.wood >= conversionRates.stone.woodRequired) {
                result.stone = Math.floor(result.wood / conversionRates.stone.woodRequired);
                
                // Камень -> Металл
                if (result.stone >= conversionRates.metal.stoneRequired) {
                    result.metal = Math.floor(result.stone / conversionRates.metal.stoneRequired);
                }
            }
        }
    }
    
    return result;
}
