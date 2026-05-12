let colors = {};

fetch('colors.json')
  .then(res => res.json())
  .then(data => {
      colors = data;
      applyColors();
  });
  function applyColors() {
    let style = document.createElement('style');
    let css = '';

    for (let key in colors) {
        css += `
            .${key} {
                background-color: ${colors[key]};
            }
        `;
    }

    style.innerHTML = css;
    document.head.appendChild(style);
}

// ==================== script.js - النسخة النهائية الصحيحة ====================
// التأكد من بناء قائمة السور بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log("الصفحة تحميلت");
    setTimeout(function() {
        buildSurahList();
        console.log("تم بناء قائمة السور");
    }, 500);
});
// ==================== القسم الأول: البيانات الثابتة ====================

const qiraatData = {
    nafi: { name: "نافع المدني", rawis: [{ id: "qalun", name: "قالون (قصر/إسكان)", file: "mushaf_qalun1.js" },{ id: "qalun", name: "قالون (قصر/صلة)", file: "mushaf_qalun2.js" },{ id: "qalun", name: "قالون (توسط/إسكان)", file: "mushaf_qalun3.js" },{ id: "qalun", name: "قالون (توسط/صلة)", file: "mushaf_qalun4.js" }, { id: "warsh", name: "ورش (قصر البدل/فتح)", file: "mushaf_warsh1.js" }, { id: "warsh", name: "ورش (توسط البدل/تقليل)", file: "mushaf_warsh2.js" }, { id: "warsh", name: "ورش (إشباع البدل/الفتح)", file: "mushaf_warsh3.js" }, { id: "warsh", name: "ورش (إشباع البدل/تقليل)", file: "mushaf_warsh4.js" }, { id: "warsh", name: "ورش (طريق الأصبهاني)", file: "mushaf_warsh5.js" }] },
    ibnKathir: { name: "ابن كثير المكي", rawis: [{ id: "bazzi", name: "البزي", file: "mushaf_bazzi.js" }, { id: "qunbul", name: "قنبل", file: "mushaf_qunbul.js" }] },
    abuAmr: { name: "أبو عمرو البصري", rawis: [{ id: "doori", name: "الدوري", file: "mushaf_doori.js" }, { id: "soosi", name: "السوسي", file: "mushaf_soosi.js" }] },
    ibnAmir: { name: "ابن عامر الشامي", rawis: [{ id: "hisham", name: "هشام", file: "mushaf_hisham.js" }, { id: "ibnDhakwan", name: "ابن ذكوان", file: "mushaf_ibnDhakwan.js" }] },
    asim: { name: "عاصم الكوفي", rawis: [{ id: "hafs", name: "حفص", file: "mushaf_hafs.js" }, { id: "shubah", name: "شعبة", file: "mushaf_shubah.js" }] },
    hamza: { name: "حمزة الكوفي", rawis: [{ id: "khalaf", name: "خلف", file: "mushaf_khalaf.js" }, { id: "khallad", name: "خلاد", file: "mushaf_khallad.js" }] },
    kisai: { name: "الكسائي الكوفي", rawis: [{ id: "abuHarith", name: "أبو الحارث", file: "mushaf_abuHarith.js" }, { id: "dooriKisai", name: "الدوري", file: "mushaf_doori_kisai.js" }] },
    abuJafar: { name: "أبو جعفر المدني", rawis: [{ id: "ibnWardan", name: "ابن وردان", file: "mushaf_ibnWardan.js" }, { id: "ibnJammaz", name: "ابن جماز", file: "mushaf_ibnJammaz.js" }] },
    yaqub: { name: "يعقوب الحضرمي", rawis: [{ id: "ruways", name: "رويس", file: "mushaf_ruways.js" }, { id: "ruh", name: "روح", file: "mushaf_ruh.js" }] },
    khalafAsher: { name: "خلف العاشر", rawis: [{ id: "ishaq", name: "إسحاق", file: "mushaf_ishaq.js" }, { id: "idris", name: "إدريس", file: "mushaf_idris.js" }] }
};

const totalPages = 604;

const defaultAyahs = [
    {sura:1, name:"الفاتحة", ayah:0, text:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", page:1},
    {sura:1, name:"الفاتحة", ayah:1, text:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", page:1},
    {sura:1, name:"الفاتحة", ayah:2, text:"الرَّحْمَٰنِ الرَّحِيمِ", page:1},
    {sura:1, name:"الفاتحة", ayah:3, text:"مَالِكِ يَوْمِ الدِّينِ", page:1},
    {sura:1, name:"الفاتحة", ayah:4, text:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", page:1},
    {sura:1, name:"الفاتحة", ayah:5, text:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", page:1},
    {sura:1, name:"الفاتحة", ayah:6, text:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", page:1}
];

const fullSurahNames = [
    { num: 1, name: "سُورَةُ الفَاتِحَةِ", ayahs: 7 },
    { num: 2, name: "سُورَةُ البَقَرَةِ", ayahs: 286 },
    { num: 3, name: "سُورَةُ آلِ عِمۡرَانَ", ayahs: 200 },
    { num: 4, name: "سُورَةُ النِّسَاءِ", ayahs: 176 },
    { num: 5, name: "سُورَةُ المَائـِدَةِ", ayahs: 120 },
    { num: 6, name: "سُورَةُ الأَنۡعَامِ", ayahs: 165 },
    { num: 7, name: "سُورَةُ الأَعۡرَافِ", ayahs: 206 },
    { num: 8, name: "سُورَةُ الأَنفَالِ", ayahs: 75 },
    { num: 9, name: "سُورَةُ التَّوۡبَةِ", ayahs: 129 },
    { num: 10, name: "سُورَةُ يُونُسَ", ayahs: 109 },
    { num: 11, name: "سُورَةُ هُودٍ", ayahs: 123 },
    { num: 12, name: "سُورَةُ يُوسُفَ", ayahs: 111 },
    { num: 13, name: "سُورَةُ الرَّعۡدِ", ayahs: 43 },
    { num: 14, name: "سُورَةُ إِبۡرَاهِيمَ", ayahs: 52 },
    { num: 15, name: "سُورَةُ الحِجۡرِ", ayahs: 99 },
    { num: 16, name: "سُورَةُ النَّحۡلِ", ayahs: 128 },
    { num: 17, name: "سُورَةُ الإِسۡرَاءِ", ayahs: 111 },
    { num: 18, name: "سُورَةُ الكَهۡفِ", ayahs: 110 },
    { num: 19, name: "سُورَةُ مَرۡيَمَ", ayahs: 98 },
    { num: 20, name: "سُورَةُ طه", ayahs: 135 },
    { num: 21, name: "سُورَةُ الأَنبِيَاءِ", ayahs: 112 },
    { num: 22, name: "سُورَةُ الحَجِّ", ayahs: 78 },
    { num: 23, name: "سُورَةُ المُؤۡمِنُونَ", ayahs: 118 },
    { num: 24, name: "سُورَةُ النُّورِ", ayahs: 64 },
    { num: 25, name: "سُورَةُ الفُرۡقَانِ", ayahs: 77 },
    { num: 26, name: "سُورَةُ الشُّعَرَاءِ", ayahs: 227 },
    { num: 27, name: "سُورَةُ النَّمۡلِ", ayahs: 93 },
    { num: 28, name: "سُورَةُ القَصَصِ", ayahs: 88 },
    { num: 29, name: "سُورَةُ العَنكَبُوتِ", ayahs: 69 },
    { num: 30, name: "سُورَةُ الرُّومِ", ayahs: 60 },
    { num: 31, name: "سُورَةُ لُقۡمَانَ", ayahs: 34 },
    { num: 32, name: "سُورَةُ السَّجۡدَةِ", ayahs: 30 },
    { num: 33, name: "سُورَةُ الأَحۡزَابِ", ayahs: 73 },
    { num: 34, name: "سُورَةُ سَبَإٍ", ayahs: 54 },
    { num: 35, name: "سُورَةُ فَاطِرٍ", ayahs: 45 },
    { num: 36, name: "سُورَةُ يسٓ", ayahs: 83 },
    { num: 37, name: "سُورَةُ الصَّافَّاتِ", ayahs: 182 },
    { num: 38, name: "سُورَةُ صٓ", ayahs: 88 },
    { num: 39, name: "سُورَةُ الزُّمَرِ", ayahs: 75 },
    { num: 40, name: "سُورَةُ غَافِرٍ", ayahs: 85 },
    { num: 41, name: "سُورَةُ فُصِّلَتۡ", ayahs: 54 },
    { num: 42, name: "سُورَةُ الشُّورَىٰ", ayahs: 53 },
    { num: 43, name: "سُورَةُ الزُّخۡرُفِ", ayahs: 89 },
    { num: 44, name: "سُورَةُ الدُّخَانِ", ayahs: 59 },
    { num: 45, name: "سُورَةُ الجَاثِيَةِ", ayahs: 37 },
    { num: 46, name: "سُورَةُ الأَحۡقَافِ", ayahs: 35 },
    { num: 47, name: "سُورَةُ مُحَمَّدٍ", ayahs: 38 },
    { num: 48, name: "سُورَةُ الفَتۡحِ", ayahs: 29 },
    { num: 49, name: "سُورَةُ الحُجُرَاتِ", ayahs: 18 },
    { num: 50, name: "سُورَةُ قٓ", ayahs: 45 },
    { num: 51, name: "سُورَةُ الذَّارِيَاتِ", ayahs: 60 },
    { num: 52, name: "سُورَةُ الطُّورِ", ayahs: 49 },
    { num: 53, name: "سُورَةُ النَّجۡمِ", ayahs: 62 },
    { num: 54, name: "سُورَةُ القَمَرِ", ayahs: 55 },
    { num: 55, name: "سُورَةُ الرَّحۡمَٰن", ayahs: 78 },
    { num: 56, name: "سُورَةُ الوَاقِعَةِ", ayahs: 96 },
    { num: 57, name: "سُورَةُ الحَدِيدِ", ayahs: 29 },
    { num: 58, name: "سُورَةُ المُجَادلَةِ", ayahs: 22 },
    { num: 59, name: "سُورَةُ الحَشۡرِ", ayahs: 24 },
    { num: 60, name: "سُورَةُ المُمۡتَحنَةِ", ayahs: 13 },
    { num: 61, name: "سُورَةُ الصَّفِّ", ayahs: 14 },
    { num: 62, name: "سُورَةُ الجُمُعَةِ", ayahs: 11 },
    { num: 63, name: "سُورَةُ المُنَافِقُونَ", ayahs: 11 },
    { num: 64, name: "سُورَةُ التَّغَابُنِ", ayahs: 18 },
    { num: 65, name: "سُورَةُ الطَّلَاقِ", ayahs: 12 },
    { num: 66, name: "سُورَةُ التَّحۡرِيمِ", ayahs: 12 },
    { num: 67, name: "سُورَةُ المُلۡكِ", ayahs: 30 },
    { num: 68, name: "سُورَةُ القَلَمِ", ayahs: 52 },
    { num: 69, name: "سُورَةُ الحَاقَّةِ", ayahs: 52 },
    { num: 70, name: "سُورَةُ المَعَارِجِ", ayahs: 44 },
    { num: 71, name: "سُورَةُ نُوحٍ", ayahs: 28 },
    { num: 72, name: "سُورَةُ الجِنِّ", ayahs: 28 },
    { num: 73, name: "سُورَةُ المُزَّمِّلِ", ayahs: 20 },
    { num: 74, name: "سُورَةُ المُدَّثِّرِ", ayahs: 56 },
    { num: 75, name: "سُورَةُ القِيَامَةِ", ayahs: 40 },
    { num: 76, name: "سُورَةُ الإِنسَانِ", ayahs: 31 },
    { num: 77, name: "سُورَةُ المُرۡسَلَاتِ", ayahs: 50 },
    { num: 78, name: "سُورَةُ النَّبَإِ", ayahs: 40 },
    { num: 79, name: "سُورَةُ النَّازِعَاتِ", ayahs: 46 },
    { num: 80, name: "سُورَةُ عَبَسَ", ayahs: 42 },
    { num: 81, name: "سُورَةُ التَّكۡوِيرِ", ayahs: 29 },
    { num: 82, name: "سُورَةُ الانفِطَارِ", ayahs: 19 },
    { num: 83, name: "سُورَةُ المُطَفِّفِينَ", ayahs: 36 },
    { num: 84, name: "سُورَةُ الانشِقَاقِ", ayahs: 25 },
    { num: 85, name: "سُورَةُ البُرُوجِ", ayahs: 22 },
    { num: 86, name: "سُورَةُ الطَّارِقِ", ayahs: 17 },
    { num: 87, name: "سُورَةُ الأَعۡلَىٰ", ayahs: 19 },
    { num: 88, name: "سُورَةُ الغَاشِيَةِ", ayahs: 26 },
    { num: 89, name: "سُورَةُ الفَجۡرِ", ayahs: 30 },
    { num: 90, name: "سُورَةُ البَلَدِ", ayahs: 20 },
    { num: 91, name: "سُورَةُ الشَّمۡسِ", ayahs: 15 },
    { num: 92, name: "سُورَةُ اللَّيۡلِ", ayahs: 21 },
    { num: 93, name: "سُورَةُ الضُّحَىٰ", ayahs: 11 },
    { num: 94, name: "سُورَةُ الشَّرۡحِ", ayahs: 8 },
    { num: 95, name: "سُورَةُ التِّينِ", ayahs: 8 },
    { num: 96, name: "سُورَةُ العَلَقِ", ayahs: 19 },
    { num: 97, name: "سُورَةُ القَدۡرِ", ayahs: 5 },
    { num: 98, name: "سُورَةُ البَيِّنَةِ", ayahs: 8 },
    { num: 99, name: "سُورَةُ الزَّلۡزَلَةِ", ayahs: 8 },
    { num: 100, name: "سُورَةُ العَادِيَاتِ", ayahs: 11 },
    { num: 101, name: "سُورَةُ القَارِعَةِ", ayahs: 11 },
    { num: 102, name: "سُورَةُ التَّكَاثُرِ", ayahs: 8 },
    { num: 103, name: "سُورَةُ العَصۡرِ", ayahs: 3 },
    { num: 104, name: "سُورَةُ الهُمَزَةِ", ayahs: 9 },
    { num: 105, name: "سُورَةُ الفِيلِ", ayahs: 5 },
    { num: 106, name: "سُورَةُ قُرَيۡشٍ", ayahs: 4 },
    { num: 107, name: "سُورَةُ المَاعُونِ", ayahs: 7 },
    { num: 108, name: "سُورَةُ الكَوۡثَرِ", ayahs: 3 },
    { num: 109, name: "سُورَةُ الكَافِرُونَ", ayahs: 6 },
    { num: 110, name: "سُورَةُ النَّصۡرِ", ayahs: 3 },
    { num: 111, name: "سُورَةُ المَسَدِ", ayahs: 5 },
    { num: 112, name: "سُورَةُ الإِخۡلَاصِ", ayahs: 4 },
    { num: 113, name: "سُورَةُ الفَلَقِ", ayahs: 5 },
    { num: 114, name: "سُورَةُ النَّاسِ", ayahs: 6 }
];

// ==================== القسم الثاني: المتغيرات العامة ====================

let currentMode = "single";
let currentData = [];
let pagesData = [];
let currentPage = 1;
let currentFontSize = 1.4;

let compareModeActive = false;
let waitingForCompare = false;
let compareStep = 0;
let comparePages1Data = [];
let comparePages2Data = [];
let compareCurrentPage = 1;

// ==================== القسم الثالث: دوال مساعدة ====================

function setGlobalFontSize(size) {
    currentFontSize = Math.min(Math.max(size, 1.0), 2.2);
    document.documentElement.style.setProperty('--quran-font-size', currentFontSize + 'rem');
    localStorage.setItem('quranFontSize', currentFontSize);
}

function increaseFont() { setGlobalFontSize(currentFontSize + 0.1); }
function decreaseFont() { setGlobalFontSize(currentFontSize - 0.1); }

function toArabicEasternNumber(num) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(d => arabicNumbers[parseInt(d)]).join('');
}

function showToast(message, duration) {
    let toast = document.querySelector('.toast-message');
    if (toast) toast.remove();
    toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#2e241a; color:#e8c67a; padding:10px 25px; border-radius:40px; z-index:2000; font-family:inherit; box-shadow:0 4px 12px black;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// ==================== القسم الرابع: دوال عرض النص ====================

function renderPageContent(ayahs) {
    if (!ayahs || ayahs.length === 0) return '<div class="welcome-message">لا توجد آيات</div>';
    
    let html = '<div class="quran-text">';
    let lastSurah = null;
    let lastSurahDisplayed = null;
    
    for (let i = 0; i < ayahs.length; i++) {
        let ayah = ayahs[i];
        let isBismillah = (ayah.ayah === 0) || (ayah.text.includes("بسم") && ayah.text.includes("الله"));
        
        // التحقق من وجود اسم السورة في النص
        let isSurahName = ayah.text.includes("سُورَةُ") && ayah.ayah === 0;
        
        if (isSurahName) {
            // استخراج اسم السورة من النص
            let surahNameText = ayah.text;
            // عرض اسم السورة داخل الإطار بدلاً من النص العادي
            if (lastSurahDisplayed !== ayah.sura) {
                html += '<div class="surah-marker"><span class="surah-name">' + surahNameText + '</span></div>';
                lastSurahDisplayed = ayah.sura;
            }
            continue;
        }
        
        if (isBismillah) {
            html += '<div class="bismillah-line">' + ayah.text + '</div>';
            continue;
        }
        
        if (lastSurah !== ayah.sura && ayah.ayah !== 0 && !isSurahName) {
            lastSurah = ayah.sura;
        }
        let safeText = ayah.text || '';

        html += `<div class="ayah-wrapper">
            <span class="ayah-text">${safeText}</span>
            <span class="ayah-number">${toArabicEasternNumber(ayah.ayah)}</span>
        </div>`;
    }
    html += '</div>';
    return html;
}

function displayPage(pageNum) {
    if (!pagesData.length) return;
    currentPage = Math.min(Math.max(pageNum, 1), totalPages);
    let ayahs = pagesData[currentPage - 1];
    document.getElementById('singlePage').innerHTML = renderPageContent(ayahs);
    // تم استبداله بمربع الإدخال، لا حاجة لهذا السطر
    document.getElementById('juzDisplay').textContent = 'الجزء ' + Math.ceil(currentPage / 20);
    if (ayahs && ayahs.length > 0) {
        let firstRealAyah = ayahs.find(a => a.ayah !== 0);
        if (firstRealAyah) document.getElementById('surahNameDisplay').textContent = firstRealAyah.name;
    }
    updatePageInput();  // <--- أضف هذا السطر
    refreshAyahEvents();  // أضف هذا السطر في النهاية
    refreshSwipeGestures();
}

function displayDoublePage(pageNum) {
    if (!pagesData.length) return;
    currentPage = Math.min(Math.max(pageNum, 1), totalPages - 1);
    document.getElementById('rightPage').innerHTML = renderPageContent(pagesData[currentPage - 1]);
    document.getElementById('leftPage').innerHTML = renderPageContent(pagesData[currentPage] || []);
    // تم استبداله بمربع الإدخال، لا حاجة لهذا السطر
    document.getElementById('juzDisplay').textContent = 'الجزء ' + Math.ceil(currentPage / 20);
    let rightAyahs = pagesData[currentPage - 1];
    if (rightAyahs && rightAyahs.length > 0) {
        let firstRealAyah = rightAyahs.find(a => a.ayah !== 0);
        if (firstRealAyah) document.getElementById('surahNameDisplay').textContent = firstRealAyah.name;
    }
    updatePageInput();  // <--- أضف هذا السطر
    refreshAyahEvents();  // أضف هذا السطر في النهاية
    refreshSwipeGestures();  // <-- أضف هذا السطر
}

// ==================== القسم الخامس: دوال تحميل البيانات ====================

function extractData(text) {
    let results = [];
    let pattern = /\{\s*sura\s*:\s*(\d+)\s*,\s*name\s*:\s*["']([^"']+)["']\s*,\s*ayah\s*:\s*(\d+)\s*,\s*text\s*:\s*["']([\s\S]*?)["']\s*,\s*page\s*:\s*(\d+)\s*\}/g;

    let match;

    while ((match = pattern.exec(text)) !== null) {
        results.push({
            sura: parseInt(match[1]),
            name: match[2].trim(),
            ayah: parseInt(match[3]),
            text: match[4],
            page: parseInt(match[5])
        });
    }

    return results;
}

function buildPagesArray(data) {
    let pages = new Map();
    for (let item of data) {
        let pageNum = item.page;
        if (!pages.has(pageNum)) pages.set(pageNum, []);
        pages.get(pageNum).push(item);
    }
    let result = [];
    for (let p = 1; p <= totalPages; p++) result.push(pages.get(p) || []);
    return result;
}

function loadFileAndDisplay(fileName) {
    let container = document.getElementById('singlePage');
    if (container && currentMode === 'single') container.innerHTML = '<div class="loading-message"><div class="spinner"></div><p>جاري التحميل...</p></div>';
    
    fetch(fileName).then(response => response.text()).then(text => {
        let data = extractData(text);
        if (!data.length) data = defaultAyahs;
        currentData = data;
        pagesData = buildPagesArray(data);
        if (currentMode === "single") displayPage(currentPage);
        else if (currentMode === "double") displayDoublePage(currentPage);
    }).catch(() => {
        pagesData = buildPagesArray(defaultAyahs);
        if (currentMode === "single") displayPage(currentPage);
        else if (currentMode === "double") displayDoublePage(currentPage);
        
        // تحديث شاشة الهاتف
        setTimeout(function() {
            updateMobileDisplay();
            refreshAyahEvents();  // أضف هذا السطر
        }, 100);
    });
}

// ==================== القسم السادس: دوال المقارنة ====================

function displayComparePage(side, pageNum) {
    let pageIndex = Math.min(Math.max(pageNum, 1), totalPages) - 1;
    if (side === 1 && comparePages1Data && comparePages1Data[pageIndex]) {
        document.getElementById('comparePage1').innerHTML = renderPageContent(comparePages1Data[pageIndex]);
    }
    if (side === 2 && comparePages2Data && comparePages2Data[pageIndex]) {
        document.getElementById('comparePage2').innerHTML = renderPageContent(comparePages2Data[pageIndex]);
    }
    updatePageInput();  // <--- أضف هذا السطر
    refreshAyahEvents();  // أضف هذا السطر في النهاية
}

function compareNextPage() { if (compareCurrentPage < totalPages) { compareCurrentPage++; displayComparePage(1, compareCurrentPage); displayComparePage(2, compareCurrentPage); } }
function comparePrevPage() { if (compareCurrentPage > 1) { compareCurrentPage--; displayComparePage(1, compareCurrentPage); displayComparePage(2, compareCurrentPage); } }

// ==================== القسم السابع: دوال الميزات الإضافية ====================

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function addBookmark() {
    let bookmarks = JSON.parse(localStorage.getItem('quranBookmarks') || '[]');
    let surahName = document.getElementById('surahNameDisplay').textContent;
    let current = { sura: surahName, page: currentPage, mode: currentMode, date: new Date().toLocaleDateString('ar') };
    if (!bookmarks.some(b => b.page === currentPage)) {
        bookmarks.push(current);
        localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
        showToast('✓ تم إضافة إشارة مرجعية للصفحة ' + currentPage, 1500);
    } else showToast('⚠️ هذه الصفحة موجودة بالفعل', 1500);
}

function showSearch() {
    let keyword = prompt('🔍 أدخل كلمة للبحث في القرآن:');
    if (!keyword || !keyword.trim()) return;
    let results = [];
    for (let i = 0; i < pagesData.length; i++) {
        for (let ayah of pagesData[i]) {
            if (ayah.text && ayah.text.includes(keyword)) results.push({ page: i + 1, sura: ayah.name });
        }
    }
    if (results.length === 0) showToast('🔍 لم يتم العثور على نتائج', 2000);
    else alert('🔍 نتائج البحث عن "' + keyword + '":\n' + results.slice(0, 15).map(r => '📄 صفحة ' + r.page + ' - ' + r.sura).join('\n'));
}

function saveLastPosition() {
    localStorage.setItem('lastQuranPosition', JSON.stringify({ page: currentPage, mode: currentMode }));
    showToast('✓ تم حفظ آخر موضع (صفحة ' + currentPage + ')', 1500);
}

function loadLastPosition() {
    let position = localStorage.getItem('lastQuranPosition');
    if (position) {
        let pos = JSON.parse(position);
        currentPage = pos.page || 1;
        setMode(pos.mode === 'double' ? 'double' : 'single');
        showToast('▶️ استئناف من الصفحة ' + currentPage, 1500);
    } else showToast('⚠️ لا توجد قراءة سابقة', 1500);
}

function sharePage() {
    let text = '📖 القرآن الكريم\nالصفحة ' + currentPage + '\n' + document.getElementById('surahNameDisplay').textContent;
    if (navigator.share) navigator.share({ title: 'المصحف الشريف', text: text });
    else { navigator.clipboard.writeText(text); showToast('📋 تم نسخ معلومات الصفحة', 1500); }
}

// ==================== القسم الثامن: دوال التحكم ====================

function setMode(mode) {
    currentMode = mode;
    document.getElementById('singleView').classList.remove('active');
    document.getElementById('doubleView').classList.remove('active');
    document.getElementById('compareView').classList.remove('active');
    if (mode === 'single') { document.getElementById('singleView').classList.add('active'); if (pagesData.length) displayPage(currentPage); }
    else if (mode === 'double') { document.getElementById('doubleView').classList.add('active'); if (pagesData.length) displayDoublePage(currentPage); }
    else document.getElementById('compareView').classList.add('active');
    
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(mode === 'single' ? 'singleModeBtn' : (mode === 'double' ? 'doubleModeBtn' : 'compareModeBtn')).classList.add('active');
    refreshAyahEvents();  // أضف هذا السطر في النهاية
    refreshSwipeGestures();
}

function startCompare() {
    compareModeActive = true;
    waitingForCompare = true;
    compareStep = 1;
    setMode('compare');
    comparePages1Data = []; comparePages2Data = [];
    document.getElementById('comparePage1').innerHTML = '<div class="welcome-message">✨ اختر الراوي الأول</div>';
    document.getElementById('comparePage2').innerHTML = '<div class="welcome-message">✨ ثم اختر الراوي الثاني</div>';
    showToast('اختر الراوي الأول من القائمة', 2000);
}

// ==================== القسم التاسع: قائمة السور ====================

function buildSurahList() {
    const container = document.getElementById('surahList');
    if (!container) return;
    container.innerHTML = '';
    for (let surah of fullSurahNames) {
        let item = document.createElement('div');
        item.className = 'surah-item';
        item.dataset.surahNum = surah.num;
        item.innerHTML = `<span class="surah-number">${surah.num}</span><span class="surah-name">${surah.name}</span><span class="surah-ayahs">${surah.ayahs}</span>`;
        item.onclick = () => goToSurah(surah.num);
        container.appendChild(item);
    }
}

function goToSurah(surahNumber) {
    if (!pagesData || pagesData.length === 0) { showToast('الرجاء انتظار تحميل المصحف أولاً', 1500); return; }
    for (let i = 0; i < pagesData.length; i++) {
        let firstRealAyah = pagesData[i].find(a => a.ayah !== 0);
        if (firstRealAyah && firstRealAyah.sura === surahNumber) {
            currentPage = i + 1;
            if (currentMode === 'single') displayPage(currentPage);
            else if (currentMode === 'double') displayDoublePage(currentPage);
            document.querySelectorAll('.surah-item').forEach(item => item.classList.remove('active'));
            document.querySelector(`.surah-item[data-surah-num="${surahNumber}"]`).classList.add('active');
            showToast(`📖 الانتقال إلى سورة ${fullSurahNames[surahNumber-1].name}`, 1500);
            return;
        }
    }
}

// ==================== القسم العاشر: قائمة القراء ====================

function buildReadersTree() {
    let container = document.getElementById('readersTree');
    if (!container) return;
    container.innerHTML = '';
    
    for (let key in qiraatData) {
        let reader = qiraatData[key];
        let node = document.createElement('div');
        node.className = 'reader-node';
        let header = document.createElement('div');
        header.className = 'reader-header';
        header.innerHTML = '<span>📖 ' + reader.name + '</span><span class="reader-toggle">◀</span>';
        let rawisDiv = document.createElement('div');
        rawisDiv.className = 'rawis-list';
        
        for (let rawi of reader.rawis) {
            let item = document.createElement('div');
            item.className = 'rawi-item';
            item.textContent = '🕌 ' + rawi.name;
            item.onclick = (function(fn) {
                return function(e) {
                    e.stopPropagation();
                    if (waitingForCompare) {
                        if (compareStep === 1) {
                            loadFileAndDisplayForCompare(fn, 1);
                            compareStep = 2;
                            showToast('✓ تم اختيار الراوي الأول، الآن اختر الراوي الثاني', 2000);
                        } else if (compareStep === 2) {
                            loadFileAndDisplayForCompare(fn, 2);
                            compareStep = 0;
                            waitingForCompare = false;
                            showToast('✓ اكتملت المقارنة!', 2000);
                        }
                        return;
                    }
                    document.querySelectorAll('.rawi-item').forEach(el => el.classList.remove('active'));
                    this.classList.add('active');
                    loadFileAndDisplay(fn);
                };
            })(rawi.file);
            rawisDiv.appendChild(item);
        }
        header.onclick = function() { this.parentNode.classList.toggle('open'); };
        node.appendChild(header);
        node.appendChild(rawisDiv);
        container.appendChild(node);
    }
}

function loadFileAndDisplayForCompare(fileName, side) {
    fetch(fileName).then(response => response.text()).then(text => {
        let data = extractData(text);
        if (!data.length) data = defaultAyahs;
        let pages = buildPagesArray(data);
        if (side === 1) { comparePages1Data = pages; displayComparePage(1, 1); }
        else { comparePages2Data = pages; displayComparePage(2, 1); }
    });
    // في نهاية دالة loadFileAndDisplay
setTimeout(function() {
    if (window.innerWidth <= 768) {
        updateMobileDisplay();
    }
}, 100);
}

// ==================== القسم الحادي عشر: التنقل والأزرار ====================

function handleNextPage() {
    if (currentMode === 'compare') compareNextPage();
    else if (currentMode === 'single' && currentPage < totalPages) displayPage(currentPage + 1);
    else if (currentMode === 'double' && currentPage < totalPages - 1) displayDoublePage(currentPage + 1);
}

function handlePrevPage() {
    if (currentMode === 'compare') comparePrevPage();
    else if (currentMode === 'single' && currentPage > 1) displayPage(currentPage - 1);
    else if (currentMode === 'double' && currentPage > 1) displayDoublePage(currentPage - 1);
}

function toggleSidebar() { document.querySelector('.sidebar').classList.toggle('collapsed'); }
function toggleSurahSidebar() {
    let surahSidebar = document.getElementById('surahSidebar');
    let showBtn = document.getElementById('showSurahSidebarBtn');
    if (surahSidebar) {
        surahSidebar.classList.toggle('collapsed');
        let isCollapsed = surahSidebar.classList.contains('collapsed');
        localStorage.setItem('surahSidebarCollapsed', isCollapsed);
        if (showBtn) showBtn.style.display = isCollapsed ? 'block' : 'none';
    }
}

function showSurahSidebar() {
    let surahSidebar = document.getElementById('surahSidebar');
    let showBtn = document.getElementById('showSurahSidebarBtn');
    if (surahSidebar) {
        surahSidebar.classList.remove('collapsed');
        localStorage.setItem('surahSidebarCollapsed', 'false');
    }
    if (showBtn) showBtn.style.display = 'none';
}

function updateShowSurahButton() {
    let surahSidebar = document.getElementById('surahSidebar');
    let showBtn = document.getElementById('showSurahSidebarBtn');
    if (surahSidebar && showBtn) {
        showBtn.style.display = surahSidebar.classList.contains('collapsed') ? 'block' : 'none';
    }
}

function bindAllButtons() {
    document.getElementById('singleModeBtn').onclick = () => setMode('single');
    document.getElementById('doubleModeBtn').onclick = () => setMode('double');
    document.getElementById('compareModeBtn').onclick = startCompare;
    document.getElementById('prevBtn').onclick = handlePrevPage;
    document.getElementById('nextBtn').onclick = handleNextPage;
    document.getElementById('darkModeBtn').onclick = toggleDarkMode;
    document.getElementById('fontPlusBtn').onclick = increaseFont;
    document.getElementById('fontMinusBtn').onclick = decreaseFont;
    document.getElementById('bookmarkBtn').onclick = addBookmark;
    document.getElementById('searchBtn').onclick = showSearch;
    document.getElementById('savePositionBtn').onclick = saveLastPosition;
    document.getElementById('resumeBtn').onclick = loadLastPosition;
    document.getElementById('shareBtn').onclick = sharePage;
    document.getElementById('toggleSidebarBtn').onclick = toggleSidebar;
    document.getElementById('toggleSurahSidebarBtn').onclick = toggleSurahSidebar;
    let showBtn = document.getElementById('showSurahSidebarBtn');
    if (showBtn) showBtn.onclick = showSurahSidebar;
    let modalClose = document.querySelector('.modal-close');
    if (modalClose) modalClose.onclick = () => document.getElementById('readerModal').style.display = 'none';
    window.onclick = (e) => { if (e.target === document.getElementById('readerModal')) document.getElementById('readerModal').style.display = 'none'; };
     bindMenuButton();  // <--- أضف هذا السطر
    bindPageInputEvents();  // <--- أضف هذا السطر في نهاية الدالة
}

// ==================== شريط متابعة القراءة على الآيات ====================

// متغير لتخزين الآية المحددة حالياً
let currentHighlightedAyah = null;

// إضافة حدث الضغط على الآيات
function addAyahClickEvents() {
    let ayahs = document.querySelectorAll('.ayah-wrapper');
    for (let i = 0; i < ayahs.length; i++) {
        let ayah = ayahs[i];
        // إزالة الأحداث القديمة لتجنب التكرار
        ayah.removeEventListener('click', handleAyahClick);
        ayah.addEventListener('click', handleAyahClick);
    }
}

// معالجة الضغط على الآية
function handleAyahClick(e) {
    e.stopPropagation();
    let ayahWrapper = this;
    
    // إذا كانت نفس الآية المحددة، نزيل التحديد
    if (currentHighlightedAyah === ayahWrapper) {
        removeCurrentHighlight();
        return;
    }
    
    // إزالة التحديد السابق
    removeCurrentHighlight();
    
    // إضافة التحديد للآية الجديدة
    ayahWrapper.classList.add('highlighted');
    currentHighlightedAyah = ayahWrapper;
    
    // تمرير عمودي فقط (بدون تمرير أفقي)
    let rect = ayahWrapper.getBoundingClientRect();
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let offset = 100; // مسافة من الأعلى
    
    window.scrollTo({
        top: rect.top + scrollTop - offset,
        behavior: 'smooth'
    });
}

// إزالة التحديد الحالي
function removeCurrentHighlight() {
    if (currentHighlightedAyah) {
        currentHighlightedAyah.classList.remove('highlighted');
        currentHighlightedAyah = null;
    }
}



// تحديث أحداث الآيات بعد تحميل المحتوى
function refreshAyahEvents() {
    clearAllAyahHighlights();  // إزالة التحديد عند تغيير الصفحة
    setTimeout(function() {
        addAyahClickEvents();
    }, 100);
}

// ==================== إيماءات اللمس للهواتف ====================

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwiping = false;
let swipeIndicator = null;

// إنشاء مؤشر السحب
function createSwipeIndicator() {
    if (window.innerWidth > 768) return;
    
    swipeIndicator = document.createElement('div');
    swipeIndicator.className = 'swipe-indicator';
    swipeIndicator.innerHTML = '→ اسحب لليمين أو اليسار ←';
    document.body.appendChild(swipeIndicator);
    
    // إخفاء المؤشر بعد 3 ثوان
    setTimeout(function() {
        if (swipeIndicator) swipeIndicator.style.opacity = '0';
        setTimeout(function() {
            if (swipeIndicator) swipeIndicator.style.display = 'none';
        }, 500);
    }, 3000);
}

// بدء اللمس
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = true;
}

// نهاية اللمس
function handleTouchEnd(e) {
    if (!isSwiping) return;
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    let diffX = touchEndX - touchStartX;
    let diffY = Math.abs(touchEndY - touchStartY);
    
    // التأكد من أن السحب أفقي وليس عمودي
    if (Math.abs(diffX) > 50 && diffX > diffY) {
        if (diffX > 0) {
            // سحب لليمين → الصفحة السابقة
            if (currentMode === 'single' && currentPage > 1) {
                displayPage(currentPage - 1);
                showSwipeFeedback('◀ الصفحة السابقة', '#27ae60');
            } else if (currentMode === 'double' && currentPage > 1) {
                displayDoublePage(currentPage - 1);
                showSwipeFeedback('◀ الصفحة السابقة', '#27ae60');
            } else {
                showSwipeFeedback('⚠️ أول صفحة', '#e67e22');
            }
        } else {
            // سحب لليسار → الصفحة التالية
            if (currentMode === 'single' && currentPage < totalPages) {
                displayPage(currentPage + 1);
                showSwipeFeedback('الصفحة التالية ▶', '#27ae60');
            } else if (currentMode === 'double' && currentPage < totalPages - 1) {
                displayDoublePage(currentPage + 1);
                showSwipeFeedback('الصفحة التالية ▶', '#27ae60');
            } else {
                showSwipeFeedback('⚠️ آخر صفحة', '#e67e22');
            }
        }
        
        // تحديث شاشة الهاتف
        if (window.innerWidth <= 768) {
            setTimeout(function() {
                updateMobileDisplay();
            }, 50);
        }
    }
    
    isSwiping = false;
}

// عرض ردود فعل بصرية عند السحب
function showSwipeFeedback(message, color) {
    if (!swipeIndicator) {
        createSwipeIndicator();
        swipeIndicator = document.querySelector('.swipe-indicator');
    }
    
    if (swipeIndicator) {
        swipeIndicator.style.display = 'block';
        swipeIndicator.style.opacity = '1';
        swipeIndicator.style.backgroundColor = color;
        swipeIndicator.innerHTML = message;
        
        setTimeout(function() {
            swipeIndicator.style.opacity = '0';
            setTimeout(function() {
                if (swipeIndicator) swipeIndicator.style.display = 'none';
            }, 500);
        }, 800);
    }
}

// ربط إيماءات اللمس
function bindSwipeGestures() {
    let quranArea = document.querySelector('.mobile-quran-area');
    if (!quranArea && window.innerWidth <= 768) {
        quranArea = document.querySelector('.view-area');
    }
    
    if (quranArea) {
        quranArea.addEventListener('touchstart', handleTouchStart, { passive: false });
        quranArea.addEventListener('touchend', handleTouchEnd);
        console.log("تم تفعيل إيماءات اللمس");
    }
}

// إضافة إيماءات اللمس لوضع المقارنة أيضاً
function bindCompareSwipeGestures() {
    let compareContainer = document.querySelector('.compare-container');
    if (compareContainer && window.innerWidth <= 768) {
        compareContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        compareContainer.addEventListener('touchend', handleTouchEnd);
    }
}

// تهيئة الإيماءات
function initSwipeGestures() {
    if (window.innerWidth <= 768) {
        createSwipeIndicator();
        bindSwipeGestures();
        bindCompareSwipeGestures();
    }
}

// مراقبة تغيير الوضع لإعادة ربط الإيماءات
function refreshSwipeGestures() {
    if (window.innerWidth <= 768) {
        setTimeout(function() {
            bindSwipeGestures();
            bindCompareSwipeGestures();
            
        }, 200);
    }
}

// ==================== القسم الثاني عشر: التهيئة ====================

function init() {
    buildReadersTree();
    buildSurahList();
    bindAllButtons();
    setMode('single');
    
    let savedSurahSidebar = localStorage.getItem('surahSidebarCollapsed');
    let surahSidebar = document.getElementById('surahSidebar');
    if (savedSurahSidebar === 'true') {
        surahSidebar.classList.add('collapsed');
    } else {
        surahSidebar.classList.remove('collapsed');
    }
    updateShowSurahButton();
    
    let savedFontSize = localStorage.getItem('quranFontSize');
    if (savedFontSize) setGlobalFontSize(parseFloat(savedFontSize));
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
    
    setTimeout(() => loadFileAndDisplay('mushaf_hafs.js'), 100);
}

// استدعاء init()
init();


// إزالة جميع تأثيرات الآيات (عند تغيير الصفحة أو الراوي)
function clearAllAyahHighlights() {
    let highlights = document.querySelectorAll('.ayah-highlight');
    for (let i = 0; i < highlights.length; i++) {
        highlights[i].remove();
    }
    currentHighlightedAyah = null;
}


// ==================== الانتقال إلى الصفحة ====================

function goToPage() {
    let input = document.getElementById('pageInput');
    if (!input) return;
    
    let pageNum = parseInt(input.value);
    
    // التحقق من صحة رقم الصفحة
    if (isNaN(pageNum)) {
        showToast('⚠️ الرجاء إدخال رقم صفحة صحيح', 1500);
        input.value = currentPage;
        return;
    }
    
    if (pageNum < 1 || pageNum > totalPages) {
        showToast(`⚠️ الصفحة يجب أن تكون بين 1 و ${totalPages}`, 1500);
        input.value = currentPage;
        return;
    }
    
    // الانتقال إلى الصفحة حسب الوضع الحالي
    if (currentMode === 'single') {
        displayPage(pageNum);
    } else if (currentMode === 'double') {
        displayDoublePage(pageNum);
    } else if (currentMode === 'compare') {
        if (comparePages1Data.length > 0 || comparePages2Data.length > 0) {
            compareCurrentPage = pageNum;
            if (comparePages1Data.length) displayComparePage(1, compareCurrentPage);
            if (comparePages2Data.length) displayComparePage(2, compareCurrentPage);
            showToast(`📖 الانتقال إلى الصفحة ${pageNum} في المقارنة`, 1500);
        } else {
            showToast('⚠️ الرجاء اختيار راويين للمقارنة أولاً', 1500);
            input.value = currentPage;
        }
    }
}

// تحديث قيمة حقل الإدخال عند تغيير الصفحة
function updatePageInput() {
    let input = document.getElementById('pageInput');
    if (input) {
        input.value = currentPage;
    }
}

// الانتقال عند الضغط على Enter
function bindPageInputEvents() {
    let input = document.getElementById('pageInput');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                goToPage();
            }
        });
        
        input.addEventListener('blur', function() {
            let val = parseInt(this.value);
            if (isNaN(val) || val < 1 || val > totalPages) {
                this.value = currentPage;
            }
        });
    }
}

// ==================== القائمة المنسدلة ====================

function toggleDropdown() {
    let dropdown = document.getElementById('dropdownMenu');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// إغلاق القائمة عند النقر خارجها
function closeDropdownOnClickOutside(e) {
    let dropdown = document.getElementById('dropdownMenu');
    let menuBtn = document.getElementById('menuBtn');
    if (dropdown && dropdown.classList.contains('show')) {
        if (!dropdown.contains(e.target) && e.target !== menuBtn) {
            dropdown.classList.remove('show');
        }
    }
}

// ربط زر القائمة
function bindMenuButton() {
    let menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.onclick = toggleDropdown;
    }
    document.addEventListener('click', closeDropdownOnClickOutside);
}
// ==================== دوال الهواتف الكاملة والصحيحة ====================

// فتح وإغلاق القوائم الجانبية
function openRightMenu() { 
    let menu = document.getElementById('rightMenu');
    if (menu) menu.classList.add('open');
}
function closeRightMenu() { 
    let menu = document.getElementById('rightMenu');
    if (menu) menu.classList.remove('open');
}
function openLeftMenu() { 
    let menu = document.getElementById('leftMenu');
    if (menu) menu.classList.add('open');
}
function closeLeftMenu() { 
    let menu = document.getElementById('leftMenu');
    if (menu) menu.classList.remove('open');
}

// تحديث شاشة الهاتف
function updateMobileDisplay() {
    console.log("تحديث شاشة الهاتف - الصفحة: " + currentPage);
    let mobilePage = document.getElementById('mobileSinglePage');
    if (mobilePage && pagesData && pagesData[currentPage - 1]) {
        mobilePage.innerHTML = renderPageContent(pagesData[currentPage - 1]);
    } else if (mobilePage) {
        mobilePage.innerHTML = '<div class="welcome-message">جاري تحميل المصحف...</div>';
    }
    
    let mobileSurah = document.getElementById('mobileSurahName');
    let mobileJuz = document.getElementById('mobileJuzDisplay');
    let mobileInput = document.getElementById('mobilePageInput');
    let titleSurah = document.getElementById('surahNameDisplay');
    let juzDisplay = document.getElementById('juzDisplay');
    
    if (mobileSurah && titleSurah) {
        mobileSurah.textContent = titleSurah.textContent;
    }
    if (mobileJuz && juzDisplay) {
        mobileJuz.textContent = juzDisplay.textContent;
    }
    if (mobileInput) {
        mobileInput.value = currentPage;
    }
    refreshAyahEvents();  // أضف هذا السطر في النهاية
}

// بناء قائمة القراء للهواتف
function buildMobileReaders() {
    let container = document.getElementById('mobileReadersTree');
    if (!container) return;
    container.innerHTML = '';
    
    for (let key in qiraatData) {
        let reader = qiraatData[key];
        let node = document.createElement('div');
        node.className = 'reader-node';
        
        let header = document.createElement('div');
        header.className = 'reader-header';
        header.innerHTML = '<span>📖 ' + reader.name + '</span><span class="reader-toggle">◀</span>';
        
        let rawisDiv = document.createElement('div');
        rawisDiv.className = 'rawis-list';
        
        for (let rawi of reader.rawis) {
            let item = document.createElement('div');
            item.className = 'rawi-item';
            item.textContent = '🕌 ' + rawi.name;
            item.setAttribute('data-file', rawi.file);
            
            item.onclick = (function(fileName, itemName) {
                return function(e) {
                    e.stopPropagation();
                    
                    document.querySelectorAll('#mobileReadersTree .rawi-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    loadFileAndDisplay(fileName);
                    
                    setTimeout(function() {
                        updateMobileDisplay();
                    }, 200);
                    
                    closeRightMenu();
                    showToast('✓ تم تحميل مصحف ' + itemName, 1500);
                };
            })(rawi.file, rawi.name);
            
            rawisDiv.appendChild(item);
        }
        
        header.onclick = function() { 
            this.parentNode.classList.toggle('open'); 
        };
        
        node.appendChild(header);
        node.appendChild(rawisDiv);
        container.appendChild(node);
    }
}

// بناء قائمة السور للهواتف
function buildMobileSurahs() {
    let container = document.getElementById('mobileSurahList');
    if (!container) return;
    container.innerHTML = '';
    for (let surah of fullSurahNames) {
        let item = document.createElement('div');
        item.className = 'surah-item';
        item.innerHTML = '<span class="surah-number">' + surah.num + '</span><span class="surah-name">' + surah.name + '</span><span class="surah-ayahs">' + surah.ayahs + '</span>';
        item.onclick = (function(num, name) {
            return function() { 
                goToSurah(num); 
                closeLeftMenu();
                showToast('📖 ' + name, 1000);
            };
        })(surah.num, surah.name);
        container.appendChild(item);
    }
}

// ربط جميع أزرار الهواتف
function bindMobileAllButtons() {
    // أزرار فتح وإغلاق القوائم
    let openRight = document.getElementById('openRightMenuBtn');
    let openLeft = document.getElementById('openLeftMenuBtn');
    let closeRight = document.getElementById('closeRightMenu');
    let closeLeft = document.getElementById('closeLeftMenu');
    
    if (openRight) openRight.onclick = openRightMenu;
    if (openLeft) openLeft.onclick = openLeftMenu;
    if (closeRight) closeRight.onclick = closeRightMenu;
    if (closeLeft) closeLeft.onclick = closeLeftMenu;
    
    // أزرار التنقل
    let mobilePrev = document.getElementById('mobilePrevBtn');
    let mobileNext = document.getElementById('mobileNextBtn');
    let mobileInput = document.getElementById('mobilePageInput');
    
    if (mobilePrev) {
        mobilePrev.onclick = function() {
            if (currentPage > 1) {
                displayPage(currentPage - 1);
                updateMobileDisplay();
            } else {
                showToast('هذه أول صفحة', 1000);
            }
        };
    }
    
    if (mobileNext) {
        mobileNext.onclick = function() {
            if (currentPage < totalPages) {
                displayPage(currentPage + 1);
                updateMobileDisplay();
            } else {
                showToast('هذه آخر صفحة', 1000);
            }
        };
    }
    
    if (mobileInput) {
        mobileInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                let page = parseInt(this.value);
                if (page >= 1 && page <= totalPages) {
                    displayPage(page);
                    updateMobileDisplay();
                } else {
                    this.value = currentPage;
                    showToast('الصفحة بين 1 و ' + totalPages, 1500);
                }
            }
        });
    }
    
    // أزرار وضع العرض
    let mobileSingleMode = document.getElementById('mobileSingleModeBtn');
    let mobileDoubleMode = document.getElementById('mobileDoubleModeBtn');
    let mobileCompareMode = document.getElementById('mobileCompareModeBtn');
    
    if (mobileSingleMode) {
        mobileSingleMode.onclick = function() { 
            setMode('single'); 
            updateMobileDisplay(); 
            closeRightMenu(); 
        };
    }
    if (mobileDoubleMode) {
        mobileDoubleMode.onclick = function() { 
            setMode('double'); 
            updateMobileDisplay(); 
            closeRightMenu(); 
        };
    }
    if (mobileCompareMode) {
        mobileCompareMode.onclick = function() { 
            startCompare(); 
            closeRightMenu(); 
        };
    }
    
    // أزرار الإعدادات
    let mobileDarkMode = document.getElementById('mobileDarkModeBtn');
    let mobileFontPlus = document.getElementById('mobileFontPlusBtn');
    let mobileFontMinus = document.getElementById('mobileFontMinusBtn');
    let mobileBookmark = document.getElementById('mobileBookmarkBtn');
    let mobileSearch = document.getElementById('mobileSearchBtn');
    let mobileSavePosition = document.getElementById('mobileSavePositionBtn');
    let mobileResume = document.getElementById('mobileResumeBtn');
    let mobileShare = document.getElementById('mobileShareBtn');
    
    if (mobileDarkMode) {
        mobileDarkMode.onclick = function() { 
            toggleDarkMode(); 
            updateMobileDisplay();
            closeLeftMenu(); 
        };
    }
    if (mobileFontPlus) {
        mobileFontPlus.onclick = function() { 
            increaseFont(); 
            updateMobileDisplay(); 
            closeLeftMenu(); 
        };
    }
    if (mobileFontMinus) {
        mobileFontMinus.onclick = function() { 
            decreaseFont(); 
            updateMobileDisplay(); 
            closeLeftMenu(); 
        };
    }
    if (mobileBookmark) mobileBookmark.onclick = function() { addBookmark(); closeLeftMenu(); };
    if (mobileSearch) mobileSearch.onclick = function() { showSearch(); closeLeftMenu(); };
    if (mobileSavePosition) mobileSavePosition.onclick = function() { saveLastPosition(); closeLeftMenu(); };
    if (mobileResume) mobileResume.onclick = function() { loadLastPosition(); updateMobileDisplay(); closeLeftMenu(); };
    if (mobileShare) mobileShare.onclick = function() { sharePage(); closeLeftMenu(); };
}

// التهيئة للهواتف
function initMobileVersion() {
    console.log("تهيئة وضع الهواتف...");
    buildMobileReaders();
    buildMobileSurahs();
    bindMobileAllButtons();
    initSwipeGestures(); 
    setTimeout(function() {
        updateMobileDisplay();
    }, 200);
}

// تشغيل تهيئة الهواتف إذا كانت الشاشة صغيرة
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            initMobileVersion();
        }, 500);
    });
}
