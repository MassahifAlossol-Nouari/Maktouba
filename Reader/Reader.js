// ==================== قارئ المصاحف ====================
console.log('Reader.js يعمل');

// ==================== ربط القارئ بكل مصحف ====================
// أضف القارئ المناسب عندما تتوفر التلاوات

const reciterMapping = {
    // المصاحف المتوفرة حالياً (مع قارئها)
    "mushaf_hafs": { name: "مشاري راشد العفاسي", code: "afs", available: true },
    "mushaf_shubah": { name: "محمد إسماعيل دبان - رواية شعبة", code: "deban/Rewayat-Sho-bah-A-n-Asim", available: true },
    "mushaf_doori_kisai": { name: "محمد عبدالحكيم سعيد عبدالله - رواية الدوري عن الكسائي", code: "abdullah/Rewayat-AlDorai-A-n-Al-Kisa-ai", available: true },

    "mushaf_qalun1": { name: "محمود خليل الحصري - رواية قالون", code: "husr/Rewayat-Qalon-A-n-Nafi", available: true },
    "mushaf_qalun2": { name: "صابر عبد الحكم - رواية قالون (قصر الصلة)", code: "The-ten-readings/Rewayat-Qalon-A-n-Nafi-Qaser-Jame/Sabdulhakam", available: true },
    "mushaf_qalun3": { name: "", code: "", available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_qalun4": { name: "", code: "", available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_warsh1": { name: "القارئ ياسين الجزائري - رواية ورش (قصر البدل)", code: "qari", available: true },
    "mushaf_warsh2": { name: "محمود خليل الحصري - رواية ورش (توسط البدل)", code: "husr/Rewayat-Warsh-A-n-Nafi", available: true },
    "mushaf_warsh3": { name: "", code: "", available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_warsh4": { name: "", code: "", available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_warsh5": { name: "القارئ محمد عبدالكريم - رواية ورش (طريق الأصبهاني)", code: "m_krm/Rewayat-Warsh-A-n-Nafi-Men-Tariq-Abi-Baker-Alasbahani", available: true },
    "mushaf_bazzi": { name: "محمد إسماعيل دبان - رواية البزي", code: "deban/Rewayat-Albizi-A-n-Ibn-Katheer", available: true },
    "mushaf_qunbul": { name: "محمد إسماعيل دبان - رواية قنبل", code: "deban/Rewayat-Qunbol-A-n-Ibn-Katheer", available: true },
    "mushaf_doori1": { name: "محمد إسماعيل دبان - رواية الدوري (توسط المنفصل)", code: "deban/Rewayat-Aldori-A-n-Abi-Amr", available: true },
    "mushaf_doori": { name: "صابر عبد الحكم - رواية الدوري (توسط المنفصل)", code: "The-ten-readings/Rewayat-Aldori-A-n-Abi-Amr-madd/Sabdulhakam", available: true },
    "mushaf_soosi": { name: "القارئ عبد الرشيد صوفي - رواية السوسي", code: "soufi/Rewayat-Assosi-A-n-Abi-Amr", available: true },
    "mushaf_hisham": { name: "أحمد ديبان - رواية هشام عن ابن عامر", code: "deban/Rewayat-Hesham-A-n-Abi-A-mer", available: true },   // السور غير مكتملة)
    "mushaf_ibnDhakwan": { name: " مفتاح السلطني - رواية ابن ذكوان عن ابن عامر", code: "muftah_sultany/Rewayat_Ibn-Thakwan-A-n-Ibn-Amer", available: true },
    "mushaf_khalaf": { name: "القارئ عبد الرشيد صوفي - رواية خلف عن حمزة", code: "soufi/Rewayat-Khalaf-A-n-Hamzah", available: true },
    "mushaf_khallad": { name: "مفتاح سُلطاني - رواية خلاد عن حمزة", code: "khalladsaltani", available: true },
    "mushaf_abuHarith": { name: "عبد الرشيد صوفي - رواية أبي الحارث عن الكسائي", code: "abdul-rashid-soufi/abi-al-harith-an-al-kisai", available: true },
    "mushaf_ibnWardan": { name: "علي عبد الكريم عبد الحكم - رواية ابن وردان عن أبي جعفر", code: "bvc65457689565732453567786745635466786878987565y2018_gmail_002_201806", available: true },
    "mushaf_ibnJammaz": { name: "مفتاح السلطني - رواية ابن جماز", code: "555_20vvvvvv", available: true },
    "mushaf_ruways": { name: "", code: "", available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_ruh": { name: "عبد الله بن محمد الحميد - رواية روح عن يعقوب الحضرمي", code: "rawhhameed", available: true },
    "mushaf_ishaq": { name: "مفتاح محمد السلطني - رواية إسحاق عن خلف", code: "ishaq_an_khalaf", available: true },
    "mushaf_idris": { name: "مفتاح محمد السلطني - رواية إدريس عن خلف", code: "ishaq_an_khalaf", available: true },
};
// قائمة المصاحف المستخرجة من qiraatData
let availableMushafs = [];

// استخراج المصاحف من البيانات الرئيسية
function loadMushafsFromMainData() {
    if (typeof qiraatData !== 'undefined') {
        for (let key in qiraatData) {
            const reader = qiraatData[key];
            for (let rawi of reader.rawis) {
                availableMushafs.push({
                    id: rawi.file.replace('.js', ''),
                    name: rawi.name,
                    fileName: rawi.file
                });
            }
        }
    }
    
    // إذا لم توجد البيانات، نستخدم بيانات افتراضية
    if (availableMushafs.length === 0) {
        availableMushafs = [
            { id: "mushaf_hafs", name: "حفص عن عاصم", fileName: "mushaf_hafs.js" },
            { id: "mushaf_warsh", name: "ورش عن نافع", fileName: "mushaf_warsh2.js" },
            { id: "mushaf_qalun", name: "قالون عن نافع", fileName: "mushaf_qalun2.js" }
        ];
    }
}

// بناء قائمة المصاحف
function buildMushafSelect() {
    const select = document.getElementById('mushafSelect');
    if (!select) return;
    select.innerHTML = '';
    
    for (let mushaf of availableMushafs) {
        const option = document.createElement('option');
        option.value = mushaf.id;
        option.textContent = `📖 ${mushaf.name}`;
        select.appendChild(option);
    }
    
    select.onchange = function() {
        const selectedId = this.value;
        const selectedMushaf = availableMushafs.find(m => m.id === selectedId);
        if (selectedMushaf) {
            updateReciterSelect(selectedMushaf.id);
            document.getElementById('status').innerHTML = `✅ تم اختيار ${selectedMushaf.name}`;
        }
    };
    
    if (availableMushafs.length > 0) {
        select.value = availableMushafs[0].id;
        updateReciterSelect(availableMushafs[0].id);
    }
}

// تحديث قائمة القراء حسب المصحف المختار
function updateReciterSelect(mushafId) {
    const select = document.getElementById('reciterSelect');
    if (!select) return;
    select.innerHTML = '';
    
    // البحث عن القارئ المناسب لهذا المصحف
    let matchedReciter = null;
    for (let key in reciterMapping) {
        if (mushafId.includes(key)) {
            matchedReciter = reciterMapping[key];
            break;
        }
    }
    
    if (matchedReciter && matchedReciter.available === true) {
        // قارئ متوفر
        const option = document.createElement('option');
        option.value = matchedReciter.code;
        option.textContent = `🎙️ ${matchedReciter.name}`;
        select.appendChild(option);
        select.disabled = false;
        document.getElementById('status').innerHTML = `🎙️ القارئ: ${matchedReciter.name}`;
    } else if (matchedReciter && matchedReciter.available === false) {
        // قارئ غير متوفر - نعرض رسالة انتظار فقط
        const option = document.createElement('option');
        option.value = "";
        option.textContent = `⏳ ${matchedReciter.waitMessage || "سيتم إضافة القارئ المناسب قريباً"}`;
        select.appendChild(option);
        select.disabled = true;
        document.getElementById('status').innerHTML = `⏳ المصحف المختار: ${matchedReciter.waitMessage || "سيتم إضافة تلاواته قريباً"}`;
    } else {
        // لم نجد أي تطابق
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "❌ لا توجد تلاوات متوفرة حالياً";
        select.appendChild(option);
        select.disabled = true;
        document.getElementById('status').innerHTML = `⚠️ لا توجد تلاوات صوتية لهذا المصحف حالياً`;
    }
}

// بناء شبكة السور
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

let currentMushafId = null;
let currentReciterCode = null;
let currentSurah = null;
let currentAudio = null;
let isPlaying = false;
let currentSpeed = 1.0;

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

function playSurah() {
    const mushafSelect = document.getElementById('mushafSelect');
    const reciterSelect = document.getElementById('reciterSelect');
    
    if (!mushafSelect.value || !reciterSelect.value || reciterSelect.disabled) {
        alert('⚠️ الرجاء اختيار مصحف وقارئ متوفر');
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
    
    const reciterCode = reciterSelect.value;
    const suraNum = currentSurah.toString().padStart(3, '0');
    let audioUrl;

    // 1. رواية أبي الحارث (عبد الرشيد صوفي - way2quran)
    if (reciterCode === 'abdul-rashid-soufi/abi-al-harith-an-al-kisai') {
        audioUrl = `https://media.way2quran.com/${reciterCode}/${currentSurah}.mp3`; 
        console.log('تشغيل رواية أبي الحارث من way2quran:', audioUrl);
    }
 // روابط archive.org المنظمة
    if (reciterCode === 'khalladsaltani' || 
        reciterCode === 'a625_202506a' || 
        reciterCode === 'bvc65457689565732453567786745635466786878987565y2018_gmail_002_201806' ||
        reciterCode === '555_20vvvvvv' ||
        reciterCode === 'rawhhameed' ||
        reciterCode === 'ishaq_an_khalaf') {
        audioUrl = `https://archive.org/download/${reciterCode}/${suraNum}.mp3`;
    }
    // 2. رواية خلاد (archive.org)
    else if (reciterCode === 'khalladsaltani') {
        audioUrl = `https://archive.org/download/${reciterCode}/${suraNum}.mp3`;
    }
    // 2. روابط الخادم server16
    else if (reciterCode.includes('deban/Rewayat') || reciterCode.includes('soufi/Rewayat') || reciterCode.includes('The-ten-readings')) {
        audioUrl = `https://server16.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    } 
    // 3. روابط الخادم server13 (روايات الحصري)
    else if (reciterCode.includes('husr/Rewayat')) {
        audioUrl = `https://server13.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    } 
    // 4. روابط الخادم server9 (روايات عبد الله بصفر)
    else if (reciterCode.includes('abdullah/Rewayat')) {
        audioUrl = `https://server9.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    } 
    // 5. روابط الخادم server12 (رواية ورش بطريق الأصبهاني)
    else if (reciterCode.includes('m_krm/Rewayat')) {
        audioUrl = `https://server12.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    } 
    // 6. روابط الخادم server14 (رواية ابن ذكوان)
    else if (reciterCode.includes('muftah_sultany/Rewayat')) {
        audioUrl = `https://server14.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    } 
    // 7. روابط الخادم server11 (رواية ورش بقصر البدل)
    else if (reciterCode === 'qari') {
        audioUrl = `https://server11.mp3quran.net/qari/${suraNum}.mp3`;
    } 
    // 8. جميع الروايات الأخرى (الافتراضي: الخادم server8)
    else {
        audioUrl = `https://server8.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    } 
    
    document.getElementById('status').innerHTML = `⏳ جاري تحميل سورة ${surahNames[currentSurah - 1]}...`;
    currentAudio = new Audio(audioUrl);
    currentAudio.playbackRate = currentSpeed;
    
    currentAudio.addEventListener('canplay', () => {
        document.getElementById('status').innerHTML = `🎧 تشغيل: ${surahNames[currentSurah - 1]} - ${reciterSelect.options[reciterSelect.selectedIndex]?.text}`;
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
        document.getElementById('status').innerHTML = `❌ خطأ في التحميل، حاول لاحقاً`;
    });
    
    currentAudio.play();
    isPlaying = true;
    document.getElementById('playBtn').innerHTML = '⏸️';
}

// دوال التحكم (مثل السابق)
function playAudio() {
    if (currentAudio && currentAudio.src) {
        if (currentAudio.paused) {
            currentAudio.play();
            isPlaying = true;
            document.getElementById('playBtn').innerHTML = '⏸️';
        }
    } else if (currentSurah) {
        playSurah();
    }
}

function pauseAudio() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        isPlaying = false;
        document.getElementById('playBtn').innerHTML = '▶️';
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

function restartAudio() {
    if (currentAudio) {
        currentAudio.currentTime = 0;
        currentAudio.playbackRate = currentSpeed;
        if (!isPlaying) {
            currentAudio.play();
            isPlaying = true;
            document.getElementById('playBtn').innerHTML = '⏸️';
        }
    } else if (currentSurah) {
        playSurah();
    }
}

function setSpeed(speed) {
    currentSpeed = speed;
    if (currentAudio) currentAudio.playbackRate = speed;
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseFloat(btn.dataset.speed) === speed) btn.classList.add('active');
    });
}

function toggleMute() {
    if (currentAudio) {
        currentAudio.muted = !currentAudio.muted;
        document.getElementById('volumeBtn').innerHTML = currentAudio.muted ? '🔇' : '🔊';
    }
}

function setVolume(value) {
    if (currentAudio) currentAudio.volume = value / 100;
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

function bindEvents() {
    document.getElementById('playBtn').onclick = playAudio;
    document.getElementById('pauseBtn').onclick = pauseAudio;
    document.getElementById('stopBtn').onclick = stopAudio;
    document.getElementById('restartBtn').onclick = restartAudio;
    document.getElementById('volumeBtn').onclick = toggleMute;
    document.getElementById('volumeSlider').oninput = (e) => setVolume(e.target.value);
    document.getElementById('progressBar').oninput = (e) => seekProgress(e.target.value);
    
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.onclick = () => setSpeed(parseFloat(btn.dataset.speed));
    });
    
    document.getElementById('backBtn').onclick = () => window.location.href = '../index.html';
}

// التهيئة
loadMushafsFromMainData();
buildMushafSelect();
buildSurahGrid();
bindEvents();