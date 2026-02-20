// ========== ИГРОВОЕ СОСТОЯНИЕ ==========

const gameState = {
    currentLevel: 0,
    materials: {
        dirt: { 
            earned: 0,
            spendable: 0,
            clickPower: 1, 
            autoPerSec: 0, 
            clickLevel: 1, 
            autoLevel: 0, 
            unlocked: true, 
            color: '#8B4513', 
            emoji: '🟤'
        },
        grass: { 
            earned: 0,
            spendable: 0,
            clickPower: 1, 
            autoPerSec: 0, 
            clickLevel: 1, 
            autoLevel: 0, 
            unlocked: false, 
            color: '#228B22', 
            emoji: '🟢'
        },
        wood: { 
            earned: 0,
            spendable: 0,
            clickPower: 1, 
            autoPerSec: 0, 
            clickLevel: 1, 
            autoLevel: 0, 
            unlocked: false, 
            color: '#D2691E', 
            emoji: '🟫'
        },
        stone: { 
            earned: 0,
            spendable: 0,
            clickPower: 1, 
            autoPerSec: 0, 
            clickLevel: 1, 
            autoLevel: 0, 
            unlocked: false, 
            color: '#808080', 
            emoji: '⚫'
        },
        metal: { 
            earned: 0,
            spendable: 0,
            clickPower: 1, 
            autoPerSec: 0, 
            clickLevel: 1, 
            autoLevel: 0, 
            unlocked: false, 
            color: '#C0C0C0', 
            emoji: '⚪'
        }
    },
    currentLayer: 'dirt',
    currentPixelClicks: 0,
    autoPixelClicks: 0,
    layerProgress: { dirt: 0, grass: 0, wood: 0, stone: 0, metal: 0 },
    totalPixelsPerLayer: 0,
    clicksPerPixel: 4,
    baseClicksPerPixel: {
        dirt: 3,
        grass: 50,
        wood: 300,
        stone: 1500,
        metal: 8000
    },
    upgradeCosts: {
        dirt: { click: 10, auto: 50 },
        grass: { click: 15, auto: 75 },
        wood: { click: 20, auto: 100 },
        stone: { click: 30, auto: 150 },
        metal: { click: 50, auto: 250 }
    },
    grid: [],
    pixelOrder: [],
    allPixelsOrder: []
};

// Конвертация ресурсов - более плавная прогрессия
const conversionRates = {
    grass: { dirtRequired: 4, grassPerConversion: 1 },
    wood: { grassRequired: 8, woodPerConversion: 1 },
    stone: { woodRequired: 12, stonePerConversion: 1 },
    metal: { stoneRequired: 16, metalPerConversion: 1 }
};

// Порядок слоёв
const layerOrder = ['dirt', 'grass', 'wood', 'stone', 'metal'];
