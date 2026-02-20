// ========== ВИЗУАЛЬНЫЕ ЭФФЕКТЫ ==========

function createClickEffect(event, material) {
    const clickPower = material.clickPower;
    const resources = calculateResourcesFromDirt(clickPower);
    
    let offsetY = 0;
    
    if (resources.dirt > 0) {
        createSingleEffect(event, resources.dirt, 'DIRT', '#8B4513', offsetY);
        offsetY += 25;
    }
    if (resources.grass > 0) {
        createSingleEffect(event, resources.grass, 'GRASS', '#228B22', offsetY);
        offsetY += 25;
    }
    if (resources.wood > 0) {
        createSingleEffect(event, resources.wood, 'WOOD', '#D2691E', offsetY);
        offsetY += 25;
    }
    if (resources.stone > 0) {
        createSingleEffect(event, resources.stone, 'STONE', '#808080', offsetY);
        offsetY += 25;
    }
    if (resources.metal > 0) {
        createSingleEffect(event, resources.metal, 'METAL', '#C0C0C0', offsetY);
    }
}

function createSingleEffect(event, amount, name, color, offsetY) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = `+${amount} ${name}`;
    effect.style.color = color;
    effect.style.left = event.clientX + 'px';
    effect.style.top = (event.clientY - offsetY) + 'px';
    document.body.appendChild(effect);

    setTimeout(() => effect.remove(), 1500);
}

function createParticles(event, color) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.background = color;
        particle.style.left = event.clientX + 'px';
        particle.style.top = event.clientY + 'px';

        const angle = (Math.PI * 2 * i) / 6;
        const distance = 40 + Math.random() * 40;
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
}

function updateProgress() {
    const totalClicks = gameState.currentPixelClicks + gameState.autoPixelClicks;
    const progress = (totalClicks / gameState.clicksPerPixel) * 100;
    document.getElementById('material-progress').style.width = progress + '%';
    document.getElementById('current-pixel-progress').textContent = Math.floor(totalClicks);
    document.getElementById('current-pixel-required').textContent = gameState.clicksPerPixel;
}
