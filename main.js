// Teachable Machine Logic
const URL = "https://teachablemachine.withgoogle.com/models/55RpVuTm-/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const startBtn = document.getElementById('start-btn');
    startBtn.textContent = '모델 로딩 중...';
    startBtn.disabled = true;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    
    // Create bars for each class
    for (let i = 0; i < maxPredictions; i++) {
        const classTitle = model.getClassLabels()[i];
        const barWrapper = document.createElement("div");
        barWrapper.className = "result-bar-wrapper";
        
        const label = document.createElement("div");
        label.className = "result-label";
        const lowerClass = classTitle.toLowerCase();
        if (lowerClass.includes("dog")) {
            label.textContent = "🐶 강아지";
        } else if (lowerClass.includes("cat")) {
            label.textContent = "🐱 고양이";
        } else {
            label.textContent = classTitle;
        }
        
        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";
        
        const barFill = document.createElement("div");
        barFill.className = "bar-fill";
        barFill.id = `bar-fill-${i}`;
        
        const barPercent = document.createElement("div");
        barPercent.className = "bar-percent";
        barPercent.id = `bar-percent-${i}`;
        
        barContainer.appendChild(barFill);
        barContainer.appendChild(barPercent);
        barWrapper.appendChild(label);
        barWrapper.appendChild(barContainer);
        labelContainer.appendChild(barWrapper);
    }

    startBtn.style.display = 'none';
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const probability = (prediction[i].probability * 100).toFixed(0);
        const barFill = document.getElementById(`bar-fill-${i}`);
        const barPercent = document.getElementById(`bar-percent-${i}`);
        
        barFill.style.width = probability + "%";
        barPercent.textContent = probability + "%";
    }
}

document.getElementById('start-btn').addEventListener('click', init);

// Lotto Logic
document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    sortedNumbers.forEach(number => {
        const circle = document.createElement('div');
        circle.classList.add('lotto-number');
        circle.textContent = number;
        circle.style.backgroundColor = getNumberColor(number);
        lottoNumbersContainer.appendChild(circle);
    });
});

function getNumberColor(number) {
    if (number <= 10) return '#fbc400';
    if (number <= 20) return '#69c8f2';
    if (number <= 30) return '#ff7272';
    if (number <= 40) return '#aaa';
    return '#b0d840';
}

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '라이트 모드';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '라이트 모드';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '다크 모드';
    }
});
