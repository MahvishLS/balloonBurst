
const pumps = document.querySelectorAll('.pump'); // now supports multiple pumps
const balloonContainer = document.getElementById('balloon-container');
const maxInflationLevel = 3;

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
    const randAlphabet = Math.floor(Math.random() * 26) + 1;
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

pumps.forEach((pump) => {
  const pumpTop = pump.querySelector('.pumpTop');

  // --- Attach the animationend listener ONCE (persistent) ---
  // This removes the 'pump-active' class whenever the animation finishes.
  // IMPORTANT: do NOT use { once: true } here, otherwise the listener
  // will be removed after the first animation and won't run on subsequent clicks.
  pumpTop.addEventListener('animationend', () => {
    pumpTop.classList.remove('pump-active');
  });

  // Click handler only adds the class (animation will auto-remove via above listener)
  pump.addEventListener('click', () => {
    pumpTop.classList.add('pump-active');
    handlePumpAction(); // your existing pump logic
  });
});

// Attach click listeners to both pumps
pumps.forEach((pump) => {
    const pumpTop = pump.querySelector('.pumpTop');

    pump.addEventListener('click', () => {
        pumpTop.classList.add('pump-active');
        pumpTop.addEventListener('animationend', () => {
            pumpTop.classList.remove('pump-active');
        }, { once: true });
        handlePumpAction();
    });
});

// Handle balloon pumping
function handlePumpAction() {
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
}

function inflateBalloon(balloonDiv) {
    const balloon = balloonDiv.querySelector('.balloon');
    const alphabetOverlay = balloonDiv.querySelector('.alphabet-overlay');
    const balloonString = balloonDiv.querySelector('.balloonString');
    const currentInflationLevel = parseInt(balloon.dataset.inflationLevel);

    if (currentInflationLevel < maxInflationLevel) {
        balloonDiv.style.transform = `scale(${1 + currentInflationLevel * 0.55})`;
        balloon.dataset.inflationLevel = currentInflationLevel + 1;
    }

    balloonDiv.onclick = () => burstBalloon(balloonDiv);
}

function burstBalloon(balloonDiv) {
    const balloon = balloonDiv.querySelector('.balloon');
    const alphabetOverlay = balloonDiv.querySelector('.alphabet-overlay');
    const balloonString = balloonDiv.querySelector('.balloonString');

    if (alphabetOverlay) alphabetOverlay.style.display = 'none';
    if (balloonString) balloonString.style.display = 'none';

    balloon.src = 'assets/burst2.png';
    balloonDiv.style.height = '130px';
    setTimeout(() => {
        balloonDiv.remove();
    }, 300);
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

//Keyboard controls: Space = pump, Enter = burst last balloon
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handlePumpAction(); // pump balloon
    }
    if (e.code === 'Enter') {
        const existingBalloons = document.querySelectorAll('.balloonDiv');
        if (existingBalloons.length > 0) {
            const lastBalloonDiv = existingBalloons[existingBalloons.length - 1];
            burstBalloon(lastBalloonDiv);
        }
    }
});
