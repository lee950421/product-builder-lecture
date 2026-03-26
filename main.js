// Teachable Machine Logic
const URL = "https://teachablemachine.withgoogle.com/models/55RpVuTm-/";
let model, labelContainer, maxPredictions;

async function loadModel() {
    if (!model) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }
}

async function predict(imageElement) {
    await loadModel();
    const prediction = await model.predict(imageElement);
    
    // Clear previous results
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = '';
    
    for (let i = 0; i < maxPredictions; i++) {
        const classTitle = model.getClassLabels()[i];
        const probability = (prediction[i].probability * 100).toFixed(0);
        
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
        barFill.style.width = probability + "%";
        
        const barPercent = document.createElement("div");
        barPercent.className = "bar-percent";
        barPercent.textContent = probability + "%";
        
        barContainer.appendChild(barFill);
        barContainer.appendChild(barPercent);
        barWrapper.appendChild(label);
        barWrapper.appendChild(barContainer);
        labelContainer.appendChild(barWrapper);
    }
}

// File Upload Event
document.getElementById('file-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const imgElement = document.getElementById('face-image');
        imgElement.src = event.target.result;
        imgElement.style.display = 'block';
        
        // Wait for image to load before predicting
        imgElement.onload = function() {
            predict(imgElement);
        };
    };
    reader.readAsDataURL(file);
});

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
