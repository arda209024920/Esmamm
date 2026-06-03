// AŞK AYARLARI VE METİNLER
const ASK_AYARLARI = {
    anaBaslik: "Sonsuza Dek",
    altBaslik: "Sen ve Ben",
    kalpAltindakiNot: "Ruhumun Eşsiz Diğer Yarısı... 💖",
    tiklamaSubNotu: "(Kalbe dokun, aşkın melodisini başlat ve sırrı keşfet)",
    mektupBasligi: "Sevgilime;",
    mektupMetni: "Hayatımdaki en değerli, en zarif varlığa...\n\nBu kalbin mor yarısı seninleyken hissettiğim o benzersiz huzuru, sarı yarısı ise hayatıma kattığın o parlak neşeyi temsil ediyor. Sen benim gökyüzündeki en parlak yıldızım, ömrümün en güzel manzarasısın. İyi ki benimlesin, seni sonsuz bir aşkla seviyorum... ✨"
};

// ÇALMA LİSTESİ (İstediğin şarkıların linkini/dosya adını buraya ekleyebilirsin)
const playlist = [
    { title: "Cambaz", artist: "Mor ve Ötesi", url: "assets/cambaz.mp3" },
    { title: "Aşk Şarkısı", artist: "Sana Özel", url: "assets/ozel.mp3" }
];

let currentTrackIndex = 0;
let audioPlayer = new Audio();
let isPlaying = false;

// DOM Yüklendiğinde Başlat
document.addEventListener("DOMContentLoaded", () => {
    // Metinleri Yerleştir
    document.getElementById("loveTitle").innerText = ASK_AYARLARI.anaBaslik;
    document.getElementById("loveSubtitle").innerText = ASK_AYARLARI.altBaslik;
    document.getElementById("loveHeartNote").innerText = ASK_AYARLARI.kalpAltindakiNot;
    document.getElementById("loveHeartSubNote").innerText = ASK_AYARLARI.tiklamaSubNotu;
    document.getElementById("loveLetterHeader").innerText = ASK_AYARLARI.mektupBasligi;

    // İlk Şarkıyı Yükle
    loadTrack(currentTrackIndex);

    // Canvas Parçacık Sistemini Başlat
    initParticles();
    animateParticles();
});

// Şarkı Yükleme
function loadTrack(index) {
    const track = playlist[index];
    document.getElementById("trackTitle").innerText = track.title;
    document.getElementById("trackArtist").innerText = track.artist;
    audioPlayer.src = track.url;
    audioPlayer.load();
}

// Oynat & Durdur
function togglePlayPause() {
    const playIcon = document.getElementById("playIcon");
    const disk = document.getElementById("albumDisk");

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playIcon.className = "fa-solid fa-play";
        disk.classList.remove("rotate-disk");
    } else {
        audioPlayer.play().then(() => {
            isPlaying = true;
            playIcon.className = "fa-solid fa-pause";
            disk.classList.add("rotate-disk");
        }).catch(err => {
            // Tarayıcı güvenlik engeli varsa dosya seçtir
            triggerFileSelect();
        });
    }
}

// Şarkı Değiştirme
function changeTrack(direction) {
    currentTrackIndex += direction;
    if (currentTrackIndex < 0) currentTrackIndex = playlist.length - 1;
    if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;
    
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

// Zaman ve İlerleme Çubuğu Güncellemesi
audioPlayer.ontimeupdate = () => {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        document.getElementById("progressBar").style.width = progress + "%";
        document.getElementById("currentTime").innerText = formatTime(audioPlayer.currentTime);
        document.getElementById("totalDuration").innerText = formatTime(audioPlayer.duration);
    }
};

function formatTime(secs) {
    let min = Math.floor(secs / 60) || 0;
    let sec = Math.floor(secs % 60) || 0;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function seekAudio(event) {
    if (!audioPlayer.duration) return;
    const rect = document.getElementById("progressBarContainer").getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percentage * audioPlayer.duration;
}

function triggerFileSelect() {
    document.getElementById("fileInput").click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById("trackTitle").innerText = file.name.replace(/\.[^/.]+$/, "");
    document.getElementById("trackArtist").innerText = "Sevgilinin Şarkısı";

    audioPlayer.src = URL.createObjectURL(file);
    audioPlayer.load();
    isPlaying = false;
    togglePlayPause();
}

// ==========================================
// 💥 Kalp Patlama ve Mektup Açılma Mekaniği
// ==========================================
let heartPopped = false;

function onHeartClick(event) {
    if (heartPopped) return;
    heartPopped = true;

    playHarpSymphony();
    createExplosionSparkles(event);

    const wrapper = document.getElementById("heartWrapper");
    wrapper.classList.add("heart-pop-active");

    // Patlama süresi bittikten sonra mektubu göster
    setTimeout(() => {
        wrapper.style.display = "none";
        document.getElementById("loveHeartNote").style.display = "none";
        document.getElementById("loveHeartSubNote").style.display = "none";

        const paper = document.getElementById("paperContent");
        paper.classList.add("reveal");
        typeElegantMessage();
    }, 1100);
}

// Daktilo Efekti
let textCharIndex = 0;
function typeElegantMessage() {
    const typingContainer = document.getElementById("elegantTyping");
    const text = ASK_AYARLARI.mektupMetni;

    if (textCharIndex < text.length) {
        let char = text.charAt(textCharIndex);
        typingContainer.innerHTML += char === '\n' ? '<br>' : char;
        textCharIndex++;
        setTimeout(typeElegantMessage, 45);
    }
}

// Tıklama Parçacıkları (Patlama için)
function createExplosionSparkles(event) {
    const viewport = document.getElementById("premiumHeartBtn");
    const rect = viewport.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (let i = 0; i < 40; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-gold';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        sparkle.style.setProperty('--x', `${x}px`);
        sparkle.style.setProperty('--y', `${y}px`);
        sparkle.style.left = `${clickX}px`;
        sparkle.style.top = `${clickY}px`;
        
        const size = Math.random() * 8 + 4;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        viewport.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
}

// ==========================================
// ✨ Arka Plan Altın Tozu Efektleri (Canvas)
// ==========================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function Particle() {
    this.reset();
}

Particle.prototype.reset = function() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 3 + 1;
    this.speedY = -(Math.random() * 0.8 + 0.3);
    this.speedX = Math.sin(Math.random() * Math.PI) * 0.3;
    const colors = ['rgba(212,175,55,0.45)', 'rgba(255,215,0,0.35)', 'rgba(186,114,131,0.3)', 'rgba(255,255,255,0.5)'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.angle = Math.random() * Math.PI * 2;
};

Particle.prototype.update = function() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.y < 0) this.reset();
};

Particle.prototype.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#ffd700';
    ctx.fill();
    ctx.restore();
};

function initParticles() {
    for (let i = 0; i < 40; i++) particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

// Akor Ses Sentezleyici
let audioCtx = null;
function playHarpSymphony() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                let osc = audioCtx.createOscillator();
                let gainNode = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 1.6);
            }, idx * 100);
        });
    } catch(e){}
}