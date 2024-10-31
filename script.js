const pump = document.querySelector('.pump');
const balloonContainer = document.getElementById('balloon-container');
const maxInflationLevel = 5;

const balloonImages = [
    'assets/balloon1.png',
    'assets/balloon2.png',
    'assets/balloon3.png',
    'assets/balloon4.png',
    'assets/balloon5.png',
    'assets/balloon6.png',
    'assets/balloon7.png',
    'assets/balloon8.png',
    'assets/balloon9.png',
    'assets/balloon10.png'
];

let currentBalloonIndex = 0;

let pumpLoaded = localStorage.getItem('pumpLoaded') === 'true';

function createBalloon() {
    const balloonDiv = document.createElement('div');
    balloonDiv.className = 'balloonDiv';

    const balloon = document.createElement('img');
    balloon.className = 'balloon';
    balloon.src = balloonImages[currentBalloonIndex];
    balloon.dataset.inflationLevel = 1;
    
    const alphabetOverlay = document.createElement('img');
    alphabetOverlay.className = 'alphabet-overlay';
   
    const randAlphabet = Math.floor(Math.random() * 100 % 26) + 1;
    alphabetOverlay.src = `assets/Symbol 100${randAlphabet}.png`; 

    const balloonString = document.createElement('img');
    balloonString.className = 'balloonString';
    balloonString.src = 'assets/string.png';

    balloonDiv.appendChild(balloon);
    balloonDiv.appendChild(alphabetOverlay);
    balloonDiv.appendChild(balloonString);

    balloonContainer.appendChild(balloonDiv);

    return balloonDiv;
}

// Add pump animation listener once, outside the main click event
const pumpTop = pump.querySelector('.pumpTop');
pump.addEventListener('click', () => {
    pumpTop.classList.add('pump-active');
    pumpTop.addEventListener('animationend', () => {
        pumpTop.classList.remove('pump-active');
    }, { once: true });
});

pump.addEventListener('click', () => {
    const existingBalloons = document.querySelectorAll('.balloonDiv');
    
    if (existingBalloons.length > 0 && pumpLoaded) {
        const lastBalloonDiv = existingBalloons[existingBalloons.length - 1];
        const inflationLevel = parseInt(lastBalloonDiv.querySelector('.balloon').dataset.inflationLevel);

        if (inflationLevel < maxInflationLevel) {
            inflateBalloon(lastBalloonDiv);
        } else {
            startFloating(lastBalloonDiv);
            pumpLoaded = false; 
            localStorage.setItem('pumpLoaded', 'false'); 
            const balloonString = lastBalloonDiv.querySelector('.balloonString');
            balloonString.style.opacity = '1';
        }
    } else {
        const newBalloonDiv = createBalloon();
        inflateBalloon(newBalloonDiv);
        pumpLoaded = true; 
        localStorage.setItem('pumpLoaded', 'true');
    }
});

function inflateBalloon(balloonDiv) {
    const balloon = balloonDiv.querySelector('.balloon');
    const alphabetOverlay = balloonDiv.querySelector('.alphabet-overlay');
    const balloonString = balloonDiv.querySelector('.balloonString');
    const currentInflationLevel = parseInt(balloon.dataset.inflationLevel);

    if (currentInflationLevel < maxInflationLevel) {
        balloonDiv.style.transform = `scale(${1 + currentInflationLevel * 0.55})`;
        balloon.dataset.inflationLevel = currentInflationLevel + 1;
    }

    balloonDiv.onclick = () => {
        if (alphabetOverlay) alphabetOverlay.style.display = 'none';
        if (balloonString) balloonString.style.display = 'none';

        balloon.src = 'assets/burst2.png';
        balloonDiv.style.height = '130px';
        setTimeout(() => {
            balloonDiv.style.display = 'none';
            balloonDiv.remove();
        }, 300);
    };
}

function startFloating(balloonDiv) {
    balloonDiv.dataset.floating = 'true'; 

    const floatInterval = setInterval(() => {
        const newLeft = Math.random() * 20; 
        const newTop = Math.random() * 8.5;  
        balloonDiv.style.transform += `translate(-${newLeft}px, -${newTop}px)`;
    }, 200); 

    currentBalloonIndex = (currentBalloonIndex + 1) % balloonImages.length; 
}
