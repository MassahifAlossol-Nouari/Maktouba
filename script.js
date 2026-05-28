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
            let surahNameText = ayah.text;
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

        // أضف data-sura و data-ayah هنا
        html += `<div class="ayah-wrapper" data-sura="${ayah.sura}" data-ayah="${ayah.ayah}">
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
    document.getElementById('juzDisplay').textContent = 'ٱلۡجُزۡءُ ' + Math.ceil(currentPage / 20);
    if (ayahs && ayahs.length > 0) {
        let firstRealAyah = ayahs.find(a => a.ayah !== 0);
                if (firstRealAyah) document.getElementById('surahNameDisplay').textContent = firstRealAyah.name;
    }
    updatePageInput();  // <--- أضف هذا السطر
    refreshAyahEvents();  // أضف هذا السطر في النهاية
    refreshSwipeGestures();
    refreshColorClicks();
}

function displayDoublePage(pageNum) {
    if (!pagesData.length) return;
    currentPage = Math.min(Math.max(pageNum, 1), totalPages - 1);
    document.getElementById('rightPage').innerHTML = renderPageContent(pagesData[currentPage - 1]);
    document.getElementById('leftPage').innerHTML = renderPageContent(pagesData[currentPage] || []);
    // تم استبداله بمربع الإدخال، لا حاجة لهذا السطر
    document.getElementById('juzDisplay').textContent = 'ٱلۡجُزۡءُ ' + Math.ceil(currentPage / 20);
    let rightAyahs = pagesData[currentPage - 1];
    if (rightAyahs && rightAyahs.length > 0) {
        let firstRealAyah = rightAyahs.find(a => a.ayah !== 0);
        if (firstRealAyah) document.getElementById('surahNameDisplay').textContent = firstRealAyah.name;
    }
    updatePageInput();  // <--- أضف هذا السطر
    refreshAyahEvents();  // أضف هذا السطر في النهاية
    refreshSwipeGestures();  // <-- أضف هذا السطر
    refreshColorClicks();
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
    
    fetch(`Data/${fileName}`).then(response => response.text()).then(text => {
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
     // أضف هذا السطر لتفعيل شريط المعلومات في المقارنة
    setTimeout(initColorClicks, 100);
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
    console.log("setMode تم استدعاؤها بـ:", mode);
    currentMode = mode;
    document.getElementById('singleView').classList.remove('active');
    document.getElementById('doubleView').classList.remove('active');
    document.getElementById('compareView').classList.remove('active');
    
    if (mode === 'single') { 
        document.getElementById('singleView').classList.add('active'); 
        if (pagesData.length) displayPage(currentPage); 
    }
    else if (mode === 'double') { 
        document.getElementById('doubleView').classList.add('active'); 
        if (pagesData.length) displayDoublePage(currentPage); 
    }
    else if (mode === 'compare') { 
        document.getElementById('compareView').classList.add('active'); 
    }
    
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(mode === 'single' ? 'singleModeBtn' : (mode === 'double' ? 'doubleModeBtn' : 'compareModeBtn'));
    if (activeBtn) activeBtn.classList.add('active');
    
    refreshAyahEvents();
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
    fetch(`Data/${fileName}`).then(response => response.text()).then(text => {
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
// نهاية اللمس
function handleTouchEnd(e) {
    if (!isSwiping) return;
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    let diffX = touchEndX - touchStartX;
    let diffY = Math.abs(touchEndY - touchStartY);
    
    // التأكد من أن السحب أفقي وليس عمودي
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
            // سحب لليمين → الصفحة السابقة
            console.log('سحب لليمين - الصفحة السابقة');
            if (currentMode === 'single' && currentPage > 1) {
                displayPage(currentPage - 1);
                showSwipeFeedback('→ الصفحة السابقة', '#27ae60');
            } else if (currentMode === 'double' && currentPage > 1) {
                displayDoublePage(currentPage - 1);
                showSwipeFeedback('→ الصفحة السابقة', '#27ae60');
            } else {
                showSwipeFeedback('⚠️ أول صفحة', '#e67e22');
            }
        } else {
            // سحب لليسار → الصفحة التالية
            console.log('سحب لليسار - الصفحة التالية');
            if (currentMode === 'single' && currentPage < totalPages) {
                displayPage(currentPage + 1);
                showSwipeFeedback('الصفحة التالية ←', '#27ae60');
            } else if (currentMode === 'double' && currentPage < totalPages - 1) {
                displayDoublePage(currentPage + 1);
                showSwipeFeedback('الصفحة التالية ←', '#27ae60');
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


// ==================== القائمة الجديدة (الفهرس والبحث) ====================

let quranData = null;

// تحميل بيانات القرآن للبحث
async function loadQuranForSearch() {
    if (quranData) return quranData;
    try {
        const response = await fetch('quran.js');
        const text = await response.text();
        let cleanText = text.replace(/const\s+QURAN\s*=\s*/, '');
        cleanText = cleanText.trim();
        if (cleanText.endsWith(';')) cleanText = cleanText.slice(0, -1);
        quranData = eval(cleanText);
        return quranData;
    } catch(e) {
        return [];
    }
}

// البحث
async function searchInQuranSidebar(keyword) {
    if (!keyword || keyword.length < 3) return [];
    const data = await loadQuranForSearch();
    if (!data.length) return [];
    const results = [];
    const term = keyword.toLowerCase();
    for (let ayah of data) {
        if (ayah.contentSimple && ayah.contentSimple.toLowerCase().includes(term)) {
            results.push({
                sura: ayah.suraNumber,
                ayah: ayah.number,
                page: ayah.pageNumber,
                text: ayah.content
            });
        }
        if (results.length >= 20) break;
    }
    return results;
}

// عرض نتائج البحث
// عرض نتائج البحث (تبقى النتائج حتى يتم مسح النص)
// عرض نتائج البحث (مع تظليل الآية)
async function showSidebarSearchResults() {
    const input = document.getElementById('sidebarSearchInput');
    const resultsDiv = document.getElementById('sidebarSearchResults');
    const keyword = input?.value.trim();
    
    if (!keyword) {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
        return;
    }
    
    if (keyword.length < 3) {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<div style="padding:10px;text-align:center;">🔍 اكتب 3 أحرف أو أكثر للبحث</div>';
        return;
    }
    
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '<div style="padding:10px;text-align:center;">🔍 جاري البحث...</div>';
    
    const results = await searchInQuranSidebar(keyword);
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div style="padding:10px;text-align:center;">🔍 لا توجد نتائج</div>';
        return;
    }
    
    resultsDiv.innerHTML = '';
    for (let r of results) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        const suraName = fullSurahNames[r.sura - 1]?.name || `سورة ${r.sura}`;
        item.innerHTML = `
            <div class="result-sura">📖 ${suraName} - آية ${r.ayah} (صفحة ${r.page})</div>
            <div class="result-text">${r.text.substring(0, 80)}...</div>
        `;
        item.onclick = () => {
            // الانتقال إلى الصفحة
            currentPage = r.page;
            if (currentMode === 'single') {
                displayPage(currentPage);
            } else {
                displayDoublePage(currentPage);
            }
            
            // تظليل الآية المحددة
            setTimeout(() => {
                // البحث عن الآية في الصفحة
                let ayahElements = document.querySelectorAll('.ayah-wrapper');
                let targetAyah = null;
                
                for (let el of ayahElements) {
                    if (el.getAttribute('data-ayah') == r.ayah) {
                        targetAyah = el;
                        break;
                    }
                }
                
                if (targetAyah) {
                    // التمرير إلى الآية
                    targetAyah.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // إزالة أي تظليل سابق
                    document.querySelectorAll('.ayah-highlight').forEach(h => h.remove());
                    document.querySelectorAll('.ayah-wrapper.highlighted').forEach(h => h.classList.remove('highlighted'));
                    
                    // إضافة التظليل الجديد
                    targetAyah.classList.add('highlighted');
                    
                    // إنشاء شريط شفاف إضافي
                    let highlightDiv = document.createElement('div');
                    highlightDiv.className = 'ayah-highlight';
                    targetAyah.style.position = 'relative';
                    targetAyah.appendChild(highlightDiv);
                    
                    // إزالة التظليل بعد 3 ثوانٍ
                    setTimeout(() => {
                        highlightDiv.remove();
                        targetAyah.classList.remove('highlighted');
                    }, 3000);
                } else {
                    // إذا لم يتم العثور على الآية، نعطي رسالة
                    console.log('لم يتم العثور على الآية رقم', r.ayah);
                }
            }, 600);
        };
        resultsDiv.appendChild(item);
    }
}

// بناء قائمة الفهرس
// بناء قائمة الفهرس للحاسوب
function buildSidebarIndex() {
    const container = document.getElementById('indexList');
    if (!container) return;
    
    const showSura = document.getElementById('filterSura')?.checked;
    const showJuza = document.getElementById('filterJuza')?.checked;
    const showHizb = document.getElementById('filterHizb')?.checked;
    
    let items = [];
    
    if (showSura) {
        for (let s of fullSurahNames) {
            let page = getSuraPage(s.num);
            items.push({ title: `${s.num.toString().padStart(3, '0')} ${s.name}`, page: page });
        }
    }
    
    if (showJuza) {
        const juzPages = [1,22,42,62,82,102,121,142,162,182,201,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];
        for (let i=0; i<juzPages.length; i++) {
            items.push({ title: `ٱلۡجُزۡءُ ${(i+1).toString().padStart(2,'0')}`, page: juzPages[i] });
        }
    }
    
    if (showHizb) {
        for (let i=1; i<=60; i++) {
            items.push({ title: `الحزب ${i.toString().padStart(2,'0')}`, page: Math.ceil(i*604/60) });
        }
    }
    
    container.innerHTML = '';
    for (let item of items) {
        const div = document.createElement('div');
        div.className = 'index-item';
        div.innerHTML = `<span class="index-item-title">${item.title}</span><span class="index-item-page">صفحة ${item.page}</span>`;
        div.onclick = () => goToPageUniversal(item.page);
        container.appendChild(div);
    }
}

function getSuraPage(num) {
    const pages = {1:1,2:2,3:50,4:77,5:106,6:128,7:151,8:177,9:187,10:208,11:221,12:235,13:249,14:255,15:262,16:267,17:282,18:293,19:305,20:312,21:322,22:332,23:342,24:350,25:359,26:367,27:377,28:385,29:396,30:404,31:411,32:415,33:418,34:428,35:434,36:440,37:446,38:453,39:458,40:467,41:477,42:483,43:489,44:496,45:499,46:502,47:507,48:511,49:515,50:518,51:520,52:523,53:526,54:528,55:531,56:534,57:537,58:542,59:545,60:549,61:551,62:553,63:554,64:556,65:558,66:560,67:562,68:564,69:566,70:568,71:570,72:572,73:574,74:575,75:577,76:578,77:580,78:582,79:583,80:585,81:586,82:587,83:587,84:589,85:590,86:591,87:591,88:592,89:593,90:594,91:595,92:595,93:596,94:596,95:597,96:597,97:598,98:598,99:599,100:599,101:600,102:600,103:601,104:601,105:601,106:602,107:602,108:602,109:603,110:603,111:603,112:604,113:604,114:604};
    return pages[num] || num*5;
}

// ربط الأحداث
function bindSidebarEvents() {
    document.getElementById('sidebarSearchInput')?.addEventListener('input', showSidebarSearchResults);
    document.getElementById('filterSura')?.addEventListener('change', buildSidebarIndex);
    document.getElementById('filterJuza')?.addEventListener('change', buildSidebarIndex);
    document.getElementById('filterHizb')?.addEventListener('change', buildSidebarIndex);
    buildSidebarIndex();
}

// تشغيل
setTimeout(bindSidebarEvents, 500);

// ==================== دوال تبديل الوضع في الهواتف ====================

function mobileSetMode(mode) {
    console.log("تغيير الوضع إلى:", mode);
    
    // تغيير الوضع العام
    if (mode === 'single') {
        setMode('single');
    } else if (mode === 'double') {
        setMode('double');
    } else if (mode === 'compare') {
        setMode('compare');
        // في وضع المقارنة، نبدأ عملية اختيار الرواة
        startCompare();
    }
    
    // تحديث شاشة الهاتف
    setTimeout(function() {
        if (typeof updateMobileDisplay === 'function') {
            updateMobileDisplay();
        }
    }, 100);
    
    // إغلاق القائمة الجانبية
    if (typeof closeRightMenu === 'function') {
        closeRightMenu();
    }
}

// ربط أزرار وضع العرض في الهواتف
function bindMobileModeButtons() {
    const mobileSingleMode = document.getElementById('mobileSingleModeBtn');
    const mobileDoubleMode = document.getElementById('mobileDoubleModeBtn');
    const mobileCompareMode = document.getElementById('mobileCompareModeBtn');
    
    if (mobileSingleMode) {
        mobileSingleMode.onclick = function() {
            mobileSetMode('single');
        };
    }
    
    if (mobileDoubleMode) {
        mobileDoubleMode.onclick = function() {
            mobileSetMode('double');
        };
    }
    
    if (mobileCompareMode) {
        mobileCompareMode.onclick = function() {
            mobileSetMode('compare');
        };
    }
    
    console.log("تم ربط أزرار وضع العرض في الهواتف");
}
// ==================== ربط مباشر لأزرار الهواتف ====================

function setupMobileModeButtons() {
    console.log("جاري ربط أزرار الهواتف...");
    
    // البحث عن الأزرار
    const singleBtn = document.getElementById('mobileSingleModeBtn');
    const doubleBtn = document.getElementById('mobileDoubleModeBtn');
    const compareBtn = document.getElementById('mobileCompareModeBtn');
    
    console.log("singleBtn:", singleBtn);
    console.log("doubleBtn:", doubleBtn);
    console.log("compareBtn:", compareBtn);
    
    // ربط زر صفحة واحدة
    if (singleBtn) {
        singleBtn.onclick = function(e) {
            e.preventDefault();
            console.log("تم الضغط على صفحة واحدة");
            setMode('single');
            if (typeof updateMobileDisplay === 'function') {
                setTimeout(function() {
                    updateMobileDisplay();
                }, 100);
            }
            closeRightMenu();
        };
    }
    
    // ربط زر صفحتان
    if (doubleBtn) {
        doubleBtn.onclick = function(e) {
            e.preventDefault();
            console.log("تم الضغط على صفحتان");
            setMode('double');
            if (typeof updateMobileDisplay === 'function') {
                setTimeout(function() {
                    updateMobileDisplay();
                }, 100);
            }
            closeRightMenu();
        };
    }
    
    // ربط زر مقارنة
    if (compareBtn) {
        compareBtn.onclick = function(e) {
            e.preventDefault();
            console.log("تم الضغط على مقارنة");
            setMode('compare');
            startCompare();
            if (typeof updateMobileDisplay === 'function') {
                setTimeout(function() {
                    updateMobileDisplay();
                }, 100);
            }
            closeRightMenu();
        };
    }
}

// استدعاء الدالة بعد تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileModeButtons);
} else {
    setupMobileModeButtons();
}

// أيضاً استدعائها في initMobileVersion
function initMobileVersion() {
    console.log("تهيئة وضع الهواتف...");
    buildMobileReaders();
    buildMobileSurahs();
    bindMobileAllButtons();
    setupMobileModeButtons();  // استدعاء الربط المباشر هنا أيضاً
    initSwipeGestures(); 
    bindMobileIndexEvents();
    bindMobileSearchEvents();
    bindSettingsToggle();
    setTimeout(function() {
        updateMobileDisplay();
    }, 200);
}
// ==================== تظليل الآية في الهاتف ====================

// دالة لتظليل الآية في الهاتف
function highlightAyahInMobile(ayahNum) {
    console.log("محاولة تظليل الآية:", ayahNum);
    
    // البحث عن الآية في DOM
    let ayahElements = document.querySelectorAll('.ayah-wrapper');
    let targetAyah = null;
    
    for (let el of ayahElements) {
        let ayahAttr = el.getAttribute('data-ayah');
        if (ayahAttr == ayahNum) {
            targetAyah = el;
            break;
        }
    }
    
    if (targetAyah) {
        // التمرير إلى الآية
        targetAyah.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // إزالة أي تظليل سابق
        document.querySelectorAll('.ayah-highlight').forEach(h => h.remove());
        document.querySelectorAll('.ayah-wrapper.highlighted').forEach(h => h.classList.remove('highlighted'));
        
        // إضافة التظليل الجديد
        targetAyah.classList.add('highlighted');
        
        // إنشاء شريط شفاف
        let highlightDiv = document.createElement('div');
        highlightDiv.className = 'ayah-highlight';
        targetAyah.style.position = 'relative';
        targetAyah.appendChild(highlightDiv);
        
        // تحديث شاشة الهاتف
        if (typeof updateMobileDisplay === 'function') {
            updateMobileDisplay();
        }
        
        // إزالة التظليل بعد 3 ثوانٍ
        setTimeout(() => {
            if (highlightDiv) highlightDiv.remove();
            if (targetAyah) targetAyah.classList.remove('highlighted');
        }, 3000);
        
        console.log("تم تظليل الآية:", ayahNum);
    } else {
        console.log("لم يتم العثور على الآية:", ayahNum);
        // محاولة مرة أخرى بعد تأخير
        setTimeout(() => {
            let ayahElements2 = document.querySelectorAll('.ayah-wrapper');
            for (let el of ayahElements2) {
                if (el.getAttribute('data-ayah') == ayahNum) {
                    targetAyah = el;
                    if (targetAyah) {
                        targetAyah.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetAyah.classList.add('highlighted');
                        let highlightDiv = document.createElement('div');
                        highlightDiv.className = 'ayah-highlight';
                        targetAyah.style.position = 'relative';
                        targetAyah.appendChild(highlightDiv);
                        setTimeout(() => {
                            if (highlightDiv) highlightDiv.remove();
                            if (targetAyah) targetAyah.classList.remove('highlighted');
                        }, 3000);
                    }
                    break;
                }
            }
        }, 1000);
    }
}

// تعديل دالة mobileSearch لتضمين التظليل
// ابحث عن هذا ٱلۡجُزۡءُ في دالة mobileSearch وأضف التظليل



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
    
    // فقط إذا لم يكن هناك مصحف محدد في الرابط
    if (!window.location.search.includes('mushaf')) {
        setTimeout(() => loadFileAndDisplay('mushaf_warsh2.js'), 100);
    }
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
    console.log("تحديث شاشة الهاتف - الوضع:", currentMode, "- الصفحة:", currentPage);
    
    let mobileContainer = document.getElementById('mobileSinglePage');
    if (!mobileContainer) {
        console.log("خطأ: mobileSinglePage غير موجود");
        return;
    }
    
    // وضع صفحة واحدة
    if (currentMode === 'single') {
        if (pagesData && pagesData[currentPage - 1]) {
            mobileContainer.innerHTML = renderPageContent(pagesData[currentPage - 1]);
            console.log("تم عرض صفحة واحدة");
        } else {
            mobileContainer.innerHTML = '<div class="welcome-message">لا توجد بيانات</div>';
            console.log("لا توجد بيانات للصفحة", currentPage);
        }
    }
    
    // وضع صفحتين
    else if (currentMode === 'double') {
        if (pagesData && pagesData[currentPage - 1]) {
            // الصفحة اليمنى (الحالية)
            let rightContent = renderPageContent(pagesData[currentPage - 1]);
            // الصفحة اليسرى (التالية)
            let leftContent = pagesData[currentPage] ? renderPageContent(pagesData[currentPage]) : '<div class="welcome-message">لا توجد صفحات</div>';
            
            mobileContainer.innerHTML = `
                <div style="display: flex; gap: 10px; height: 100%; direction: rtl;">
                    <div style="flex: 1; overflow: auto; padding: 0.8cm; background: #fffcf0; border-radius: 15px;">${rightContent}</div>
                    <div style="flex: 1; overflow: auto; padding: 0.8cm; background: #fffcf0; border-radius: 15px;">${leftContent}</div>
                </div>
            `;
            console.log("تم عرض صفحتين (", currentPage, "و", currentPage + 1, ")");
        } else {
            mobileContainer.innerHTML = '<div class="welcome-message">لا توجد بيانات للصفحة</div>';
            console.log("لا توجد بيانات للصفحة", currentPage);
        }
    }
    
    // وضع المقارنة
    else if (currentMode === 'compare') {
        mobileContainer.innerHTML = `
            <div style="display: flex; gap: 10px; height: 100%; direction: rtl;">
                <div style="flex: 1; display: flex; flex-direction: column;">
                    <div style="background: #2e241a; padding: 8px; color: #e8c67a; text-align: center;">الراوي الأول</div>
                    <div id="comparePage1Mobile" style="flex: 1; overflow: auto; padding: 0.8cm; background: #fffcf0; border-radius: 15px;"></div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column;">
                    <div style="background: #2e241a; padding: 8px; color: #e8c67a; text-align: center;">الراوي الثاني</div>
                    <div id="comparePage2Mobile" style="flex: 1; overflow: auto; padding: 0.8cm; background: #fffcf0; border-radius: 15px;"></div>
                </div>
            </div>
        `;
        
        if (comparePages1Data && comparePages1Data[compareCurrentPage - 1]) {
            document.getElementById('comparePage1Mobile').innerHTML = renderPageContent(comparePages1Data[compareCurrentPage - 1]);
        }
        if (comparePages2Data && comparePages2Data[compareCurrentPage - 1]) {
            document.getElementById('comparePage2Mobile').innerHTML = renderPageContent(comparePages2Data[compareCurrentPage - 1]);
        }
        console.log("تم عرض وضع المقارنة");
    }
    
    // تحديث اسم السورة ورقم الجزء في الشريط العلوي للهاتف
    let mobileSurah = document.getElementById('mobileSurahName');
    let mobileJuz = document.getElementById('mobileJuzDisplay');
    let mobileInput = document.getElementById('mobilePageInput');
    
    if (mobileSurah) {
        mobileSurah.textContent = document.getElementById('surahNameDisplay').textContent;
    }
    if (mobileJuz) {
        mobileJuz.textContent = document.getElementById('juzDisplay').textContent;
    }
    if (mobileInput) {
        mobileInput.value = currentPage;
    }
    
    refreshAyahEvents();
    refreshColorClicks();
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
    bindMobileModeButtons();  // هذا السطر مهم
    initSwipeGestures(); 
    bindMobileIndexEvents();
    bindMobileSearchEvents();
    bindSettingsToggle();
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

// ==================== استقبال المعامل من رابط الصفحة ====================

// دالة لاستقبال المعامل من الرابط
// دالة لاستقبال المعامل من الرابط
function getUrlParams() {
    console.log('=== بدء getUrlParams ===');
    console.log('الرابط الكامل:', window.location.href);
    if (!document.querySelector('.surah-name') && !document.querySelector('.juz-number')) {
        setTimeout(getUrlParams, 100);
        return;
    }
    
    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page');
    let sura = urlParams.get('sura');
    let ayah = urlParams.get('ayah');
    let mushafFile = urlParams.get('mushaf');
    console.log('=== المعامل المستقبلة ===');
    console.log('mushaf من الرابط:', mushafFile);
    console.log('نوعه:', typeof mushafFile);
    console.log('هل هو مساوٍ لـ mushaf_qalun2.js؟', mushafFile === 'mushaf_qalun2.js');
    
    console.log(`المعامل المستلمة: page=${page}, mushaf=${mushafFile}`);
    
    // إذا كان هناك مصحف محدد، قم بتحميله
    if (mushafFile) {
        console.log(`جاري تحميل المصحف: ${mushafFile}`);
        loadFileAndDisplay(mushafFile);
        
        setTimeout(() => {
            let selectedReader = document.querySelector('.selected-reader');
            let selectedRawi = document.querySelector('.selected-rawi');
            let rawiName = getRawiNameFromFile(mushafFile);
            
            if (selectedReader) selectedReader.textContent = 'المصحف المحدد';
            if (selectedRawi) selectedRawi.textContent = rawiName;
        }, 100);
    }
    
    if (page) {
        currentPage = parseInt(page);
        
        setTimeout(() => {
            if (currentMode === 'single') {
                displayPage(currentPage);
            } else if (currentMode === 'double') {
                displayDoublePage(currentPage);
            }
            
            if (ayah) {
                setTimeout(() => {
                    let ayahElement = document.querySelector(`.ayah-wrapper[data-ayah="${ayah}"]`);
                    if (ayahElement) {
                        ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        ayahElement.classList.add('highlighted');
                        currentHighlightedAyah = ayahElement;
                        setTimeout(() => ayahElement.classList.remove('highlighted'), 3000);
                    }
                }, 800);
            }
        }, 800);
    }
}

// استدعاء الدالة مرة واحدة فقط
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', getUrlParams);
} else {
    getUrlParams();
}
// استخراج اسم الراوي من اسم الملف
function getRawiNameFromFile(fileName) {
    const names = {
        'mushaf_hafs.js': 'حفص عن عاصم',
        'mushaf_shubah.js': 'شعبة عن عاصم',
        'mushaf_warsh1.js': 'ورش (قصر البدل/فتح)',
        'mushaf_warsh2.js': 'ورش (توسط البدل/تقليل)',
        'mushaf_warsh3.js': 'ورش (إشباع البدل/الفتح)',
        'mushaf_warsh4.js': 'ورش (إشباع البدل/تقليل)',
        'mushaf_warsh5.js': 'ورش (طريق الأصبهاني)',
        'mushaf_qalun1.js': 'قالون (قصر/إسكان)',
        'mushaf_qalun2.js': 'قالون (قصر/صلة)',
        'mushaf_qalun3.js': 'قالون (توسط/إسكان)',
        'mushaf_qalun4.js': 'قالون (توسط/صلة)'
    };
    return names[fileName] || fileName.replace('.js', '');
}


// ==================== الفهرس والبحث للهواتف ====================

// البحث في الهواتف
// ==================== البحث في الهواتف (النتائج تبقى ظاهرة) ====================

// ==================== البحث في الهواتف مع تظليل الآية ====================

async function mobileSearch() {
    const input = document.getElementById('mobileSearchInput');
    const resultsDiv = document.getElementById('mobileSearchResults');
    const keyword = input?.value.trim();
    
    if (!keyword) {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
        return;
    }
    
    if (keyword.length < 3) {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<div style="padding:10px;text-align:center;">✏️ اكتب 3 أحرف أو أكثر للبحث</div>';
        return;
    }
    
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '<div style="padding:10px;text-align:center;">🔍 جاري البحث...</div>';
    
    const data = await loadQuranForSearch();
    if (!data.length) {
        resultsDiv.innerHTML = '<div style="padding:10px;text-align:center;">❌ خطأ في تحميل البيانات</div>';
        return;
    }
    
    const results = [];
    const term = keyword.toLowerCase();
    
    for (let ayah of data) {
        if (ayah.contentSimple && ayah.contentSimple.toLowerCase().includes(term)) {
            results.push({
                sura: ayah.suraNumber,
                ayah: ayah.number,
                page: ayah.pageNumber,
                text: ayah.content
            });
            if (results.length >= 30) break;
        }
    }
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div style="padding:10px;text-align:center;">🔍 لا توجد نتائج</div>';
        return;
    }
    
    resultsDiv.innerHTML = '';
    
    for (let r of results) {
        const item = document.createElement('div');
        item.className = 'mobile-search-result';
        const suraName = fullSurahNames[r.sura - 1]?.name || `سورة ${r.sura}`;
        
        item.innerHTML = `
            <div style="font-size:0.7rem; color:#c9a86b; margin-bottom:4px;">
                📖 ${suraName} - آية ${r.ayah} (صفحة ${r.page})
            </div>
            <div style="font-size:0.8rem; color:#ecdcaa; line-height:1.4;">
                ${r.text.substring(0, 100)}${r.text.length > 100 ? '...' : ''}
            </div>
        `;
        
        item.style.cssText = 'padding:10px; background:#2a1f15; border-radius:8px; margin-bottom:8px; cursor:pointer; transition:all 0.2s;';
        item.onmouseover = () => item.style.background = '#5a402a';
        item.onmouseout = () => item.style.background = '#2a1f15';
        
        item.onclick = (function(page, ayahNum) {
            return function() {
                // الانتقال إلى الصفحة
                currentPage = page;
                
                if (currentMode === 'single') {
                    displayPage(currentPage);
                } else {
                    displayDoublePage(currentPage);
                }
                
                // تظليل الآية بعد تحميل الصفحة
                setTimeout(function() {
                    highlightAyahInMobile(ayahNum);
                }, 800);
            };
        })(r.page, r.ayah);
        
        resultsDiv.appendChild(item);
    }
    
    const countDiv = document.createElement('div');
    countDiv.style.cssText = 'padding:8px; text-align:center; font-size:0.7rem; color:#a8884a; border-top:1px solid #c9a86b40; margin-top:5px;';
    countDiv.textContent = `📊 ${results.length} نتيجة`;
    resultsDiv.appendChild(countDiv);
}

// دالة لتظليل الآية
function highlightAyah(ayahElement) {
    if (!ayahElement) return;
    
    // إزالة أي تظليل سابق
    document.querySelectorAll('.ayah-highlight').forEach(h => h.remove());
    document.querySelectorAll('.ayah-wrapper.highlighted').forEach(h => h.classList.remove('highlighted'));
    
    // التمرير إلى الآية
    ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // إضافة التظليل
    ayahElement.classList.add('highlighted');
    
    // إنشاء شريط شفاف
    let highlightDiv = document.createElement('div');
    highlightDiv.className = 'ayah-highlight';
    ayahElement.style.position = 'relative';
    ayahElement.appendChild(highlightDiv);
    
    // تحديث شاشة الهاتف
    if (typeof updateMobileDisplay === 'function') {
        setTimeout(() => {
            updateMobileDisplay();
        }, 100);
    }
    
    // إزالة التظليل بعد 3 ثوانٍ
    setTimeout(() => {
        if (highlightDiv) highlightDiv.remove();
        if (ayahElement) ayahElement.classList.remove('highlighted');
    }, 3000);
}

// ربط حدث البحث (بدون مسح النتائج)
function bindMobileSearchEvents() {
    const searchInput = document.getElementById('mobileSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', mobileSearch);
        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length >= 3) {
                mobileSearch();
            }
        });
    }
}

// بناء فهرس الهواتف
// بناء فهرس الهواتف
function buildMobileIndex() {
    const container = document.getElementById('mobileIndexList');
    if (!container) return;
    
    const showSura = document.getElementById('mobileFilterSura')?.checked;
    const showJuza = document.getElementById('mobileFilterJuza')?.checked;
    const showHizb = document.getElementById('mobileFilterHizb')?.checked;
    
    let items = [];
    
    if (showSura) {
        for (let s of fullSurahNames) {
            let page = getSuraPage(s.num);
            items.push({ title: `${s.num.toString().padStart(3, '0')} ${s.name}`, page: page });
        }
    }
    
    if (showJuza) {
        const juzPages = [1,22,42,62,82,102,121,142,162,182,201,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];
        for (let i=0; i<juzPages.length; i++) {
            items.push({ title: `ٱلۡجُزۡءُ ${(i+1).toString().padStart(2,'0')}`, page: juzPages[i] });
        }
    }
    
    if (showHizb) {
        for (let i=1; i<=60; i++) {
            items.push({ title: `الحزب ${i.toString().padStart(2,'0')}`, page: Math.ceil(i*604/60) });
        }
    }
    
    container.innerHTML = '';
    for (let item of items) {
        const div = document.createElement('div');
        div.className = 'mobile-index-item';
        div.innerHTML = `<span>${item.title}</span><span style="color:#a8884a;">صفحة ${item.page}</span>`;
        div.onclick = () => goToPageUniversal(item.page);
        container.appendChild(div);
    }
}

// ربط أحداث الهواتف
function bindMobileIndexEvents() {
    document.getElementById('mobileSearchInput')?.addEventListener('input', mobileSearch);
    document.getElementById('mobileFilterSura')?.addEventListener('change', buildMobileIndex);
    document.getElementById('mobileFilterJuza')?.addEventListener('change', buildMobileIndex);
    document.getElementById('mobileFilterHizb')?.addEventListener('change', buildMobileIndex);
    buildMobileIndex();
}

// دالة موحدة للانتقال إلى صفحة معينة في جميع الأوضاع
function goToPageUniversal(pageNum) {
    currentPage = pageNum;
    
    if (currentMode === 'single') {
        displayPage(currentPage);
    } else if (currentMode === 'double') {
        displayDoublePage(currentPage);
    } else if (currentMode === 'compare') {
        // في وضع المقارنة، ننتقل بنفس الصفحة لكلا الجانبين
        compareCurrentPage = pageNum;
        if (comparePages1Data.length) displayComparePage(1, compareCurrentPage);
        if (comparePages2Data.length) displayComparePage(2, compareCurrentPage);
    }
    
    // تحديث شاشة الهاتف
    if (window.innerWidth <= 768 && typeof updateMobileDisplay === 'function') {
        setTimeout(() => updateMobileDisplay(), 100);
    }
    
    // إغلاق القوائم الجانبية في الهواتف
    if (window.innerWidth <= 768) {
        document.querySelector('.left-sidebar')?.classList.remove('open');
        document.getElementById('leftMenu')?.classList.remove('open');
    }
}


// ==================== إظهار/إخفاء مجموعة الإعدادات في الهواتف ====================

function toggleSettings() {
    const settingsGroup = document.querySelector('.settings-group');
    if (settingsGroup) {
        settingsGroup.classList.toggle('open');
    }
}

function bindSettingsToggle() {
    const settingsHeader = document.getElementById('settingsToggle');
    if (settingsHeader) {
        settingsHeader.onclick = toggleSettings;
    }
}

// اختبار مباشر - ضع هذا في نهاية script.js
setTimeout(function() {
    console.log("=== اختبار الأزرار ===");
    var singleBtn = document.getElementById('mobileSingleModeBtn');
    if (singleBtn) {
        singleBtn.click();
        console.log("تم محاكاة الضغط على صفحة واحدة");
    }
}, 3000);

// ==================== شريط المعلومات للأحرف الملونة (بالضغط) ====================

let activeTooltip = null;

// أسماء الألوان (جميعها من c1 إلى c25)
const colorNames = {
    'c1': '🔴 الكلمات الفرشية',
    'c2': '🟤 عد الايات',
    'c3': '🌸 الإدغام الكبير',
    'c4': '🟠 الإمالة والتقليل',
    'c5': '🔵 البسملة بين السورتين',
    'c6': '⚫ علامات الوقف',
    'c7': '🔵 الهمز المفرد والمزدوج',
    'c8': '🟢 اللامات لورش',
    'c9': '🔵 النقل والسكت',
    'c10': '🔵 مد البدل لورش',
    'c11': '🟠 الراءات لورش',
    'c12': '🌸 ميم الجمع',
    'c13': '🟣 مد اللين لورش',
    'c14': '🔴 الياءات المتطرفة',
    'c15': '🔵 الإدغام والإظهار',
    'c16': '🟢 تحريك الساكن',
    'c17': '🟣 الانفرادات',
    'c18': '🟢 هاء الكناية',
    'c19': '🌸 الوقف على الهمز',
    'c20': '🟢 الإشمام والاختلاس',
    'c22': '🟤 قاعدة 1',
    'c23': '🟡 قاعدة 2',
    'c24': '🟡 قاعدة',
    'c25': '🟡 قاعدة 3'
};

// إضافة حدث الضغط على الحروف الملونة
function initColorClicks() {
    // البحث عن جميع العناصر التي تحتوي على class يبدأ بـ c
    const coloredElements = document.querySelectorAll('[class*="c"]');
    
    for (let el of coloredElements) {
        // إزالة الأحداث القديمة
        el.removeEventListener('click', showColorTooltip);
        el.addEventListener('click', showColorTooltip);
    }
}

// عرض شريط المعلومات عند الضغط (يظهر في المكان المناسب)
function showColorTooltip(e) {
    e.stopPropagation();
    
    // إزالة أي شريط سابق
    if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
    }
    
    // الحصول على اسم اللون من class
    let colorClass = '';
    let classList = this.className.split(' ');
    for (let cls of classList) {
        // التحقق من أن class يبدأ بـ c متبوعاً بأرقام
        if (cls.match(/^c[0-9]+$/)) {
            colorClass = cls;
            break;
        }
    }
    
    if (colorNames[colorClass]) {
        let tooltip = document.createElement('div');
        tooltip.className = 'color-tooltip';
        tooltip.textContent = colorNames[colorClass];
        
        // تحديد مكان ظهور الشريط (فوق أو تحت)
        let rect = this.getBoundingClientRect();
        let spaceAbove = rect.top;
        let spaceBelow = window.innerHeight - rect.bottom;
        
        if (spaceAbove > 100) {
            tooltip.classList.add('top');
        } else {
            tooltip.classList.add('bottom');
        }
        
        this.style.position = 'relative';
        this.appendChild(tooltip);
        activeTooltip = tooltip;
        
        // إزالة الشريط بعد 2 ثانية
        setTimeout(function() {
            if (tooltip) tooltip.remove();
            if (activeTooltip === tooltip) activeTooltip = null;
        }, 1000);
    }
}

// تحديث الأحداث بعد تغيير الصفحة
function refreshColorClicks() {
    setTimeout(initColorClicks, 200);
}

// استدعاء التهيئة
setTimeout(initColorClicks, 500);


console.log(pagesData[0]?.[0]?.text);

// ==================== تحريك الشرائط للهواتف ====================
// ==================== إخفاء/إظهار الشرائط للهواتف (نسخة تعمل على اللمس) ====================

let hideTimer;

function hideAll() {
    const topBar = document.querySelector('.top-bar');
    const mobileTop = document.querySelector('.mobile-top-bar');
    const controlBar = document.querySelector('.control-bar');
    const mobileBottom = document.querySelector('.mobile-bottom-bar');
    
    if (topBar) topBar.classList.add('hide-top-bar');
    if (mobileTop) mobileTop.classList.add('hide-top-bar');
    if (controlBar) controlBar.classList.add('hide-bottom-bar');
    if (mobileBottom) mobileBottom.classList.add('hide-bottom-bar');
}

function showAll() {
    const topBar = document.querySelector('.top-bar');
    const mobileTop = document.querySelector('.mobile-top-bar');
    const controlBar = document.querySelector('.control-bar');
    const mobileBottom = document.querySelector('.mobile-bottom-bar');
    
    if (topBar) topBar.classList.remove('hide-top-bar');
    if (mobileTop) mobileTop.classList.remove('hide-top-bar');
    if (controlBar) controlBar.classList.remove('hide-bottom-bar');
    if (mobileBottom) mobileBottom.classList.remove('hide-bottom-bar');
}

function resetTimer() {
    if (hideTimer) clearTimeout(hideTimer);
    showAll();
    hideTimer = setTimeout(hideAll, 4000);
}

// التشغيل على الهواتف فقط
if (window.innerWidth <= 768) {
    window.addEventListener('load', function() {
        setTimeout(resetTimer, 1000);
    });
    
    // استخدام touchstart للأجهزة اللمسية
    document.addEventListener('touchstart', function(e) {
        // إذا كان اللمس على زر أو رابط، لا نعيد الضبط (نترك الأزرار تعمل)
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        resetTimer();
    });
    
    // احتفظ بـ click كاحتياطي للحاسوب
    document.addEventListener('click', function(e) {
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        resetTimer();
    });
}

// ==================== تحديث أسماء المصاحف في المقارنة ====================

// بناء خريطة ربط اسم الملف باسم القارئ والراوي
const fileToReaderMap = {};

// تعبئة الخريطة من qiraatData
for (let key in qiraatData) {
    const reader = qiraatData[key];
    for (let rawi of reader.rawis) {
        fileToReaderMap[rawi.file] = {
            readerName: reader.name,
            rawiName: rawi.name
        };
    }
}

// دالة للحصول على اسم القارئ والراوي من اسم الملف
function getNamesFromFile(fileName) {
    if (fileToReaderMap[fileName]) {
        return {
            readerName: fileToReaderMap[fileName].readerName,
            rawiName: fileToReaderMap[fileName].rawiName
        };
    }
    // إذا لم يتم العثور
    let defaultName = fileName.replace('mushaf_', '').replace('.js', '');
    return {
        readerName: 'مصحف',
        rawiName: defaultName
    };
}

// تحديث دالة loadFileAndDisplayForCompare (مع مراعاة مجلد data)
function loadFileAndDisplayForCompare(fileName, side) {
    // استخدام المسار الصحيح مع مجلد data
    let fullPath = `Data/${fileName}`;
    
    fetch(fullPath).then(response => response.text()).then(text => {
        let data = extractData(text);
        if (!data.length) data = defaultAyahs;
        let pages = buildPagesArray(data);
        
        // الحصول على اسم القارئ والراوي
        const names = getNamesFromFile(fileName);
        
        if (side === 1) {
            comparePages1Data = pages;
            document.getElementById('compareTitle1').innerHTML = `<span>📖 ${names.readerName} - ${names.rawiName}</span><button class="change-rawi-btn" data-side="1">تغيير</button>`;
            displayComparePage(1, 1);
        } else {
            comparePages2Data = pages;
            document.getElementById('compareTitle2').innerHTML = `<span>📖 ${names.readerName} - ${names.rawiName}</span><button class="change-rawi-btn" data-side="2">تغيير</button>`;
            displayComparePage(2, 1);
        }
               // أضف هذا السطر بعد العرض
        setTimeout(initColorClicks, 200);
        attachCompareButtons();
    });
}

// تعديل دالة startCompare لعرض أسماء مناسبة
const originalStartCompare = startCompare;
window.startCompare = function() {
    originalStartCompare();
    // إعادة تعيين أسماء العناوين
    document.getElementById('compareTitle1').innerHTML = '<span>📖 اختر المصحف الأول</span><button class="select-rawi-btn" data-side="1">اختر</button>';
    document.getElementById('compareTitle2').innerHTML = '<span>📖 اختر المصحف الثاني</span><button class="select-rawi-btn" data-side="2">اختر</button>';
};


// ==================== تفعيل أزرار التغيير في المقارنة ====================

// دالة لفتح قائمة اختيار المصحف (لجانب معين)
function openMushafSelector(side) {
    waitingForCompare = true;
    compareStep = side;
    showToast(`📖 اختر المصحف للجانب ${side}`, 2000);
}

// دالة لتحديث عرض المصحف في المقارنة بعد التغيير
function updateCompareMushaf(side, fileName, readerName, rawiName) {
    loadFileAndDisplayForCompare(fileName, side);
    
    // تحديث العنوان
    const titleId = side === 1 ? 'compareTitle1' : 'compareTitle2';
    document.getElementById(titleId).innerHTML = `<span>📖 ${readerName} - ${rawiName}</span><button class="change-rawi-btn" data-side="${side}" onclick="openMushafSelector(${side})">تغيير</button>`;
}

// تعديل دالة attachCompareButtons لتشمل أزرار التغيير
function attachCompareButtons() {
    // أزرار التغيير القديمة
    let changeBtns = document.querySelectorAll('.change-rawi-btn');
    changeBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            let side = parseInt(btn.getAttribute('data-side'));
            openMushafSelector(side);
            // أعد تفعيل شريط المعلومات بعد التغيير
            setTimeout(initColorClicks, 500);
        };
    });
    
    // أزرار الاختيار القديمة
    let selectBtns = document.querySelectorAll('.select-rawi-btn');
    selectBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            let side = parseInt(btn.getAttribute('data-side'));
            openMushafSelector(side);
        };
    });
}

// تعديل دالة selectForCompare لدعم التحديث المباشر
function selectForCompare(rawiName, readerName, fileName, rawiElement) {
    if (!waitingForCompare) return false;
    
    if (compareStep === 1 || compareStep === 2) {
        let side = compareStep;
        
        // تحميل المصحف للجانب المحدد
        loadFileAndDisplayForCompare(fileName, side);
        
        // تحديث العنوان
        const titleId = side === 1 ? 'compareTitle1' : 'compareTitle2';
        document.getElementById(titleId).innerHTML = `<span>📖 ${readerName} - ${rawiName}</span><button class="change-rawi-btn" data-side="${side}">تغيير</button>`;
        
        if (side === 1) {
            compareStep = 2;
            waitingForCompare = true;
            showToast('✓ تم اختيار المصحف الأول، الآن اختر المصحف الثاني', 2000);
        } else {
            compareStep = 0;
            waitingForCompare = false;
            showToast('✓ اكتملت المقارنة! يمكنك تغيير أي مصحف بالضغط على "تغيير"', 2000);
        }
        
        // إعادة ربط أزرار التغيير
        setTimeout(attachCompareButtons, 100);
        
        return true;
    }
    return false;
}