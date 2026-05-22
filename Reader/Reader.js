// ==================== قارئ المصاحف ====================

console.log('Reader.js يعمل');

// ==================== بيانات المصاحف والقراء المناسبين لكل مصحف ====================
const mushafData = {
    hafs: { 
        name: "مصحف حفص عن عاصم", 
        file: "mushaf_hafs.js",
        reciters: [
            { name: "مشاري راشد العفاسي", code: "afs" },       // afs بدلاً من afasy
            { name: "عبد الباسط عبد الصمد", code: "abdulbasit" }, // abdulbasit بدلاً من abdul_basit_murattal
            { name: "محمود خليل الحصري", code: "hsh" }         // hsh بدلاً من husary
        ]
    },
    
    warsh: { 
        name: "مصحف ورش (توسط البدل/تقليل)", 
        file: "mushaf_warsh2.js",
        reciters: [
            { name: "مشاري راشد العفاسي", code: "afs" },
            { name: "عبد الباسط عبد الصمد", code: "abdulbasit" }
        ]
    },
    qalun: { 
        name: "مصحف قالون (قصر/صلة)", 
        file: "mushaf_qalun2.js",
        reciters: [
            { name: "عبد الباسط عبد الصمد", code: "abdulbasit" },
            { name: "محمود خليل الحصري", code: "hsh" }
        ]
    },
    shubah: { 
        name: "مصحف شعبة عن عاصم", 
        file: "mushaf_shubah.js",
        reciters: [
            { name: "مشاري راشد العفاسي", code: "afs" },
            { name: "محمود خليل الحصري", code: "hsh" }
        ]
    }
};

// أسماء السور
const surahNames = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
];

let currentMushafKey = null;
let currentMushaf = null;
let currentReciter = null;
let currentSurah = null;
let currentAudio = null;
let isPlaying = false;

// بناء قائمة المصاحف
function buildMushafSelect() {
    const select = document.getElementById('mushafSelect');
    if (!select) return;
    
    for (let key in mushafData) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `📖 ${mushafData[key].name}`;
        select.appendChild(option);
    }
    
    select.onchange = function() {
        currentMushafKey = this.value;
        currentMushaf = mushafData[currentMushafKey];
        updateReciterSelect();
        document.getElementById('status').innerHTML = `✅ تم اختيار ${currentMushaf.name}`;
    };
    
    // اختيار أول مصحف افتراضياً
    if (Object.keys(mushafData).length > 0) {
        select.value = Object.keys(mushafData)[0];
        currentMushafKey = Object.keys(mushafData)[0];
        currentMushaf = mushafData[currentMushafKey];
        updateReciterSelect();
    }
}

// بناء قائمة القراء (تتغير حسب المصحف المختار)
function updateReciterSelect() {
    const select = document.getElementById('reciterSelect');
    if (!select || !currentMushaf) return;
    
    select.innerHTML = '';
    
    for (let reciter of currentMushaf.reciters) {
        const option = document.createElement('option');
        option.value = reciter.code;
        option.textContent = `🎙️ ${reciter.name}`;
        select.appendChild(option);
    }
    
    select.onchange = function() {
        const selected = currentMushaf.reciters.find(r => r.code === this.value);
        if (selected) {
            currentReciter = selected;
            document.getElementById('status').innerHTML = `✅ تم اختيار القارئ: ${selected.name}`;
        }
    };
    
    // اختيار أول قارئ افتراضياً
    if (currentMushaf.reciters.length > 0) {
        select.value = currentMushaf.reciters[0].code;
        currentReciter = currentMushaf.reciters[0];
        document.getElementById('status').innerHTML = `🎙️ القارئ الافتراضي: ${currentReciter.name}`;
    }
}

// بناء قائمة السور (مربعات)
function buildSurahGrid() {
    const container = document.getElementById('surahGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < surahNames.length; i++) {
        const card = document.createElement('div');
        card.className = 'surah-card';
        card.dataset.surah = i + 1;
        card.innerHTML = `
            <span class="surah-number">${(i + 1).toString().padStart(3, '0')}</span>
            <span class="surah-name">${surahNames[i]}</span>
        `;
        card.onclick = (function(surahNum, surahName) {
            return function() {
                document.querySelectorAll('.surah-card').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                currentSurah = surahNum;
                document.getElementById('status').innerHTML = `📖 تم اختيار سورة ${surahName}`;
                playSurah();
            };
        })(i + 1, surahNames[i]);
        container.appendChild(card);
    }
}

// تشغيل السورة
function playSurah() {
    if (!currentMushaf) {
        alert('⚠️ الرجاء اختيار مصحف أولاً');
        return;
    }
    if (!currentReciter) {
        alert('⚠️ الرجاء اختيار قارئ أولاً');
        return;
    }
    if (!currentSurah) {
        alert('⚠️ الرجاء اختيار سورة أولاً');
        return;
    }
    
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    let reciterCode = currentReciter.code;
    let suraNum = currentSurah.toString().padStart(3, '0');
    let audioUrl = `https://server8.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    
    if (reciterCode === 'abdul_basit_murattal') {
        audioUrl = `https://server8.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    }
    
    console.log('تشغيل:', audioUrl);
    document.getElementById('status').innerHTML = `⏳ جاري تحميل سورة ${surahNames[currentSurah - 1]}...`;
    
    currentAudio = new Audio(audioUrl);
    currentAudio.playbackRate = currentSpeed;  // أضف هذا السطر
    
    currentAudio.addEventListener('canplay', () => {
        document.getElementById('status').innerHTML = `🎧 تشغيل: ${currentMushaf.name} - ${currentReciter.name} - سورة ${surahNames[currentSurah - 1]}`;
    });
    
    currentAudio.addEventListener('timeupdate', () => {
        if (currentAudio.duration) {
            document.getElementById('progressBar').value = (currentAudio.currentTime / currentAudio.duration) * 100;
            document.getElementById('currentTime').textContent = formatTime(currentAudio.currentTime);
        }
    });
    
    currentAudio.addEventListener('ended', () => {
        isPlaying = false;
        document.getElementById('playBtn').innerHTML = '▶️';
        document.getElementById('status').innerHTML = `✅ انتهت تلاوة سورة ${surahNames[currentSurah - 1]}`;
    });
    
    currentAudio.addEventListener('error', () => {
        document.getElementById('status').innerHTML = `❌ خطأ في تحميل سورة ${surahNames[currentSurah - 1]}. حاول اختيار قارئ آخر.`;
    });
    
    currentAudio.play();
    isPlaying = true;
    document.getElementById('playBtn').innerHTML = '⏸️';
}

// التحكم في الصوت
function playAudio() {
    if (currentAudio && currentAudio.src) {
        currentAudio.play();
        isPlaying = true;
        document.getElementById('playBtn').innerHTML = '⏸️';
    } else if (currentSurah) {
        playSurah();
    } else {
        alert('⚠️ الرجاء اختيار سورة أولاً');
    }
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        isPlaying = false;
        document.getElementById('playBtn').innerHTML = '▶️';
        document.getElementById('progressBar').value = 0;
        document.getElementById('currentTime').textContent = '00:00';
    }
}

function toggleMute() {
    if (currentAudio) {
        currentAudio.muted = !currentAudio.muted;
        document.getElementById('volumeBtn').innerHTML = currentAudio.muted ? '🔇' : '🔊';
    }
}

function setVolume(value) {
    if (currentAudio) {
        currentAudio.volume = value / 100;
    }
}

function seekProgress(value) {
    if (currentAudio && currentAudio.duration) {
        currentAudio.currentTime = (value / 100) * currentAudio.duration;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ربط الأزرار
function bindEvents() {
    // الأزرار الأساسية
    document.getElementById('playBtn').onclick = playAudio;
    document.getElementById('stopBtn').onclick = stopAudio;
    document.getElementById('volumeBtn').onclick = toggleMute;
    document.getElementById('volumeSlider').oninput = (e) => setVolume(e.target.value);
    document.getElementById('progressBar').oninput = (e) => seekProgress(e.target.value);
    
    // زر الإعادة من البداية
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) restartBtn.onclick = restartAudio;
    
    // أزرار السرعة
    const speedBtns = document.querySelectorAll('.speed-btn');
    speedBtns.forEach(btn => {
        btn.onclick = function() {
            const speed = parseFloat(this.dataset.speed);
            setSpeed(speed);
        };
    });
}

// بدء التشغيل
buildMushafSelect();
buildSurahGrid();
bindEvents();

// ==================== دوال الصوت المتقدمة ====================

let currentSpeed = 1.0;

function setSpeed(speed) {
    currentSpeed = speed;
    if (currentAudio) {
        currentAudio.playbackRate = speed;
    }
    // تحديث مظهر الأزرار
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseFloat(btn.dataset.speed) === speed) {
            btn.classList.add('active');
        }
    });
}

function restartAudio() {
    if (currentAudio) {
        currentAudio.currentTime = 0;
        currentAudio.playbackRate = currentSpeed;  // أضف هذا السطر
        if (!isPlaying) {
            currentAudio.play();
            isPlaying = true;
            document.getElementById('playBtn').innerHTML = '⏸️';
        }
    } else if (currentSurah) {
        playSurah();
    }
}