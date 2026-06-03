// ========================================================
// 🌟 KİŞİSELLEŞTİRİLEBİLİR AŞK AYARLARI 🌟
// ========================================================
const ASK_AYARLARI = {
    anaBaslik: "Seni çok seviyorum",
    altBaslik: "",
    kalpAltindakiNot: "Hayatıma",
    tiklamaSubNotu: "()",
    mektupBasligi: "Knkma not;",
    mektupMetni: "Dün seni sıkıştırdığım için özür dilerim biraz moralim bozuk şu sıralar ama cidden seni çok seviyorum bazen seni kaybetmekten korkup seni üzecek rahatsız edecek şeyler yaptığım için beni affet lütfen söz veriyorum birdaha böyle rahatsız etmeyeceğim seni çok seviyorum umarım sonsuza dek beraber oluruz"
};

// 🎵 MÜZİK DOSYA LİSTESİ
// Önemli: GitHub sunucuları büyük/küçük harfe duyarlıdır. Şarkının adı "sarki.mp3" ise burada da öyle olmalıdır.
const playlist = [
    { title: "Şarkımız", artist: "Dolu kadehler sad", url: "sarki.mp3" }, // Öncelikli yerel dosya
];

let currentTrackIndex = 0;
let audioPlayer = new Audio();
let isPlaying = false;

document.addEventListener("DOMContentLoaded", () => {
    // Ayarları HTML sayfasına basıyoruz
    document.getElementById("loveTitle").innerText = ASK_AYARLARI.anaBaslik;
    document.getElementById("loveSubtitle").innerText = ASK_AYARLARI.altBaslik;
    document.getElementById("loveHeartNote").innerText = ASK_AYARLARI.kalpAltindakiNot;
    document.getElementById("loveHeartSubNote").innerText = ASK_AYARLARI.tiklamaSubNotu;
    document.getElementById("loveLetterHeader").innerText = ASK_AYARLARI.mektupBasligi;

    // İlk şarkıyı çalar motoruna yüklüyoruz
    loadTrack(currentTrackIndex);
    
    // Arka plan süzülen parçacıkları başlatıyoruz
    initParticles();
    animateParticles();
});

// Şarkı Seçim Motoru ve Metadata İzleyicisi
function loadTrack(index) {
    const track = playlist[index];
    document.getElementById("trackTitle").innerText = track.title;
    document.getElementById("trackArtist").innerText = track.artist;
    audioPlayer.src = track.url;
    audioPlayer.load();

    // Şarkı yüklenir yüklenmez süresini hemen tespit edip ekrana yazdırır
    audioPlayer.onloadedmetadata = () => {
        document.getElementById("totalDuration").innerText = formatTime(audioPlayer.duration);
        document.getElementById("currentTime").innerText = "00:00";
        document.getElementById("progressBar").style.width = "0%";
    };

    // Eğer sarki.mp3 bulunamazsa veya yükleme hatası olursa otomatik olarak demo şarkıyı devreye alır
    audioPlayer.onerror = () => {
        if (currentTrackIndex === 0) {
            console.warn("Yerel 'sarki.mp3' dosyası yüklenemedi. Yedek demo şarkıya geçiliyor...");
            currentTrackIndex = 1;
            loadTrack(currentTrackIndex);
            if (isPlaying) {
                audioPlayer.play();
            }
        }
    };
}

// Oynatma ve Durdurma Fonksiyonu
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
        }).catch(() => {
            // Tarayıcı ilk etkileşimi engellediyse yedek olarak şarkıyı geçmeye veya yüklemeye zorla
            if (currentTrackIndex === 0) {
                currentTrackIndex = 1;
                loadTrack(currentTrackIndex);
                audioPlayer.play().then(() => {
                    isPlaying = true;
                    playIcon.className = "fa-solid fa-pause";
                    disk.classList.add("rotate-disk");
                });
            } else {
                triggerFileSelect();
            }
        });
    }
}

// Şarkı Değiştirici (İleri / Geri Okları)
function changeTrack(direction) {
    currentTrackIndex += direction;
    if (currentTrackIndex < 0) currentTrackIndex = playlist.length - 1;
    if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;
    
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audioPlayer.play().then(() => {
            document.getElementById("playIcon").className = "fa-solid fa-pause";
            document.getElementById("albumDisk").classList.add("rotate-disk");
        });
    }
}

// Müzik İlerleme Çubuğunun Zamanla Güncellenmesi
audioPlayer.ontimeupdate = () => {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        document.getElementById("progressBar").style.width = progress + "%";
        document.getElementById("currentTime").innerText = formatTime(audioPlayer.currentTime);
        // Yedek olarak süreyi güncel tut
        document.getElementById("totalDuration").innerText = formatTime(audioPlayer.duration);
    }
};

function formatTime(secs) {
    if (isNaN(secs)) return "00:00";
    let min = Math.floor(secs / 60) || 0;
    let sec = Math.floor(secs % 60) || 0;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// İlerleme çubuğuna tıklayarak şarkıyı sarma
function seekAudio(event) {
    if (!audioPlayer.duration) return;
    const rect = document.getElementById("progressBarContainer").getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percentage * audioPlayer.duration;
}

// Dosya seçme tetiği
function triggerFileSelect() {
    document.getElementById("fileInput").click();
}

// Kullanıcı kendi cihazından müzik yüklerse
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById("trackTitle").innerText = file.name.replace(/\.[^/.]+$/, "");
    document.getElementById("trackArtist").innerText = "Seçilen Şarkı";

    audioPlayer.src = URL.createObjectURL(file);
    audioPlayer.load();
    isPlaying = false;
    togglePlayPause();
}

// ========================================================
// 💥 KALBE TIKLAYINCA OLUŞACAK PATLAMA VE METİN YAZMA
// ========================================================
let heartPopped = false;

function onHeartClick(event) {
    if (heartPopped) return;
    heartPopped = true;

    // Arp ses sentezleyicisini çal
    playHarpSymphony();
    
    // Altın parçacık kıvılcımları saç
    createExplosionSparkles(event);

    const wrapper = document.getElementById("heartWrapper");
    wrapper.classList.add("heart-pop-active");

    // Müzik çaları kalp tıklamasıyla otomatik de başlatmaya çalışıyoruz
    if (!isPlaying) {
        togglePlayPause();
    }

    // Kalp patladıktan sonra mektubun pürüzsüzce süzülerek açılması
    setTimeout(() => {
        wrapper.style.display = "none";
        document.getElementById("loveHeartNote").style.display = "none";
        document.getElementById("loveHeartSubNote").style.display = "none";

        const paper = document.getElementById("paperContent");
        paper.classList.add("reveal");
        typeElegantMessage();
    }, 1050);
}

// Daktilo Efektli Mektup Yazıcı
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

// Altın Parçacık Patlama Simülasyonu
function createExplosionSparkles(event) {
    const viewport = document.getElementById("premiumHeartBtn");
    const rect = viewport.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (let i = 0; i < 45; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-gold';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 160 + 70;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        sparkle.style.setProperty('--x', `${x}px`);
        sparkle.style.setProperty('--y', `${y}px`);
        sparkle.style.left = `${clickX}px`;
        sparkle.style.top = `${clickY}px`;
        
        const size = Math.random() * 9 + 4;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        viewport.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1200);
    }
}

// ========================================================
// ✨ CANVAS CANLI IŞIK TOZLARI SİMÜLASYONU
// ========================================================
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
    this.speedY = -(Math.random() * 0.8 + 0.4); // Akış hızı
    this.speedX = Math.sin(Math.random() * Math.PI) * 0.3;
    
    // Parlak ve asil renkler (Altın Sarı, Kraliyet Moru, Beyaz ve Sıcak Pembe)
    const colors = ['#FFD300', '#8e44ad', '#ffffff', '#ff1a66'];
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
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
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

// Premium Arp Ses Sentezleyicisi (Yedek Klik Melodisi)
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