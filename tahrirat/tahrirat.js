// ==================== تحميل بيانات التحريرات ====================
let tahriratData = [];
let currentFilter = {
    sura: 1,
    page: '',
    reader: 'all'
};
let currentAyahFilter = 'all';
let allReaders = [];
let currentData = [];

// تحديد المسار الصحيح
let dataUrl;
if (window.location.port === '5500' || window.location.protocol === 'file:') {
    dataUrl = '../Data/tahrirat/'; // مسارك المحلي
} else {
    // على GitHub Pages، ابدأ المسار من جذر المستودع
    dataUrl = '/Maktouba/Data/tahrirat/';
}

// ==================== دالة التحقق من الاية المرجعية ====================
function isReferenceItem(item) {
    return !item.reader && !item.rule && !item.rank;
}

// ==================== هيكل الرواة والقراء والمجموعات ====================

    // القراء العشرة فقط
    const readerHierarchy = {
    nafi: { name: "نافع", rawis: ["قالون", "ورش"] },
    ibnKathir: { name: "ابن كثير", rawis: ["البزي", "قنبل"] },
    abuAmr: { name: "أبو عمرو", rawis: ["دوري أبو عمرو", "السوسي"] },
    ibnAmir: { name: "ابن عامر", rawis: ["هشام", "ابن ذكوان"] },
    asim: { name: "عاصم", rawis: ["شعبة", "حفص"] },
    hamza: { name: "حمزة", rawis: ["خلف", "خلاد"] },
    kisai: { name: "الكسائي", rawis: ["أبو الحارث", "دوري كسائي"] },
    abuJafar: { name: "أبو جعفر", rawis: ["ابن وردان", "ابن جماز"] },
    yaqub: { name: "يعقوب", rawis: ["رويس", "روح"] },
    khalaf: { name: "العاشر", rawis: ["إسحاق", "إدريس"] },
     // مجموعة الباقون (جميع القراء)
 baqoon: { 
        name: "الباقون", 
        rawis: [
            // القراء (الشيوخ) ما عدا نافع (لأن نافع له قالون وورش)
            "ابن كثير", "أبو عمرو", "ابن عامر", 
            "عاصم", "حمزة", "الكسائي", "أبو جعفر", 
            "يعقوب", "العاشر",
            // الرواة (التلاميذ) ما عدا قالون
            "ورش", "البزي", "قنبل", "دوري أبو عمرو", 
            "السوسي", "هشام", "ابن ذكوان", "شعبة", 
            "حفص", "خلف", "خلاد", "أبو الحارث", 
            "دوري كسائي", "ابن وردان", "ابن جماز", 
            "رويس", "روح", "إسحاق", "إدريس"
        ]
    }
};


// ==================== استخراج جميع القراء ====================
function getAllReaders() {
    const readers = new Set();
    for (let key in readerHierarchy) {
        const group = readerHierarchy[key];
        readers.add(group.name);
        group.rawis.forEach(rawi => readers.add(rawi));
    }
    return Array.from(readers).sort();
}

// ==================== البحث عن القراء المرتبطين ====================
function getRelatedReaders(selectedReader) {
    const related = new Set();
    related.add(selectedReader);
    
    for (let key in readerHierarchy) {
        const group = readerHierarchy[key];
        
        if (group.rawis.includes(selectedReader)) {
            related.add(group.name);
        }
        
        if (group.name === selectedReader) {
            group.rawis.forEach(rawi => related.add(rawi));
        }
    }
    
    return Array.from(related);
}

// ==================== فلتر الرواة المتقدم ====================
function filterByReaderAdvanced(data, selectedReader) {
    if (selectedReader === 'all') return data;
    
    const results = [];
    const seen = new Set();
    
    // 1. إذا اختار "الباقون"
    if (selectedReader === 'الباقون') {
        data.forEach(item => {
            const key = `${item.sura}-${item.ayah}-${item.rank}`;
            if (seen.has(key)) return;
            
            // يظهر إذا كان القارئ ليس قالون
            const isNotQalun = (item.reader && !item.reader.includes('قالون')) ||
                               (item.with && !item.with.includes('قالون'));
            
            // أو إذا كان القارئ من ضمن مجموعة الباقون
            const isInBaqoon = (item.reader && readerHierarchy.baqoon.rawis.some(r => item.reader.includes(r))) ||
                               (item.with && readerHierarchy.baqoon.rawis.some(r => item.with.includes(r)));
            
            if (isNotQalun || isInBaqoon) {
                seen.add(key);
                results.push(item);
            }
        });
        return results;
    }
    
    // 2. المنطق العام للفلتر
    data.forEach(item => {
        const key = `${item.sura}-${item.ayah}-${item.rank}`;
        if (seen.has(key)) return;
        
        let match = false;
        
        // البحث المباشر في reader و with
        if (item.reader && item.reader.includes(selectedReader)) match = true;
        if (item.with && item.with.includes(selectedReader)) match = true;
        
        // البحث عن المرتبطين (الشيخ أو التلاميذ)
        if (!match) {
            const relatedReaders = getRelatedReaders(selectedReader);
            relatedReaders.forEach(reader => {
                if (item.reader && item.reader.includes(reader)) match = true;
                if (item.with && item.with.includes(reader)) match = true;
            });
        }
        
        if (match) {
            seen.add(key);
            results.push(item);
        }
    });
    
    return results;
}

// ==================== بناء قائمة السور ====================
function buildSurahSelect() {
    const select = document.getElementById('surahSelect');
    if (!select) return;
    
    select.innerHTML = '';
    const surahNames = [
        
    "سُورَةُ الفَاتِحَةِ", "سُورَةُ البَقَرَةِ", "سُورَةُ آلِ عِمۡرَانَ", "سُورَةُ النِّسَاءِ", "سُورَةُ المَائـِدَةِ", "سُورَةُ الأَنۡعَامِ", "سُورَةُ الأَعۡرَافِ", "سُورَةُ الأَنفَالِ" 
    ,"سُورَةُ التَّوۡبَةِ", "سُورَةُ يُونُسَ", "سُورَةُ هُودٍ", "سُورَةُ يُوسُفَ", "سُورَةُ الرَّعۡدِ", "سُورَةُ إِبۡرَاهِيمَ", "سُورَةُ الحِجۡرِ", "سُورَةُ النَّحۡلِ", "سُورَةُ الإِسۡرَاءِ"
    , "سُورَةُ الكَهۡفِ", "سُورَةُ مَرۡيَمَ", "سُورَةُ طه", "سُورَةُ الأَنبِيَاءِ", "سُورَةُ الحَجِّ", "سُورَةُ المُؤۡمِنُونَ", "سُورَةُ النُّورِ", "سُورَةُ الفُرۡقَانِ"
    , "سُورَةُ الشُّعَرَاءِ", "سُورَةُ النَّمۡلِ", "سُورَةُ القَصَصِ", "سُورَةُ العَنكَبُوتِ ", "سُورَةُ الرُّومِ", "سُورَةُ لُقۡمَانَ", "سُورَةُ السَّجۡدَةِ", "سُورَةُ الأَحۡزَابِ"
    , "سُورَةُ سَبَإٍ", "سُورَةُ فَاطِرٍ", "سُورَةُ يسٓ", "سُورَةُ الصَّافَّاتِ", "سُورَةُ صٓ", "سُورَةُ الزُّمَرِ", "سُورَةُ غَافِرٍ", "سُورَةُ فُصِّلَتۡ"
    ,"سُورَةُ الشُّورَىٰ", "سُورَةُ الزُّخۡرُفِ", "سُورَةُ الدُّخَانِ", "سُورَةُ الجَاثِيَةِ", "سُورَةُ الأَحۡقَافِ", "سُورَةُ مُحَمَّدٍ", "سُورَةُ الفَتۡحِ", "سُورَةُ الحُجُرَاتِ"
    , "سُورَةُ قٓ", "سُورَةُ الذَّارِيَاتِ", "سُورَةُ الطُّورِ", "سُورَةُ النَّجۡمِ", "سُورَةُ القَمَرِ", "سُورَةُ الرَّحۡمَٰن", "سُورَةُ الوَاقِعَةِ", "سُورَةُ الحَدِيدِ"
    , "سُورَةُ المُجَادلَةِ", "سُورَةُ الحَشۡرِ", "سُورَةُ المُمۡتَحنَةِ", "سُورَةُ الصَّفِّ", "سُورَةُ الجُمُعَةِ", "سُورَةُ المُنَافِقُونَ ", "سُورَةُ التَّغَابُنِ" 
    ,"سُورَةُ الطَّلَاقِ", "سُورَةُ التَّحۡرِيمِ", "سُورَةُ المُلۡكِ", "سُورَةُ القَلَمِ", "سُورَةُ الحَاقَّةِ", "سُورَةُ المَعَارِجِ", "سُورَةُ نُوحٍ", "سُورَةُ الجِنِّ", "سُورَةُ المُزَّمِّلِ"
    , "سُورَةُ المُدَّثِّرِ", "سُورَةُ القِيَامَةِ", "سُورَةُ الإِنسَانِ", "سُورَةُ المُرۡسَلَاتِ ", "سُورَةُ النَّبَإِ", "سُورَةُ النَّازِعَاتِ", "سُورَةُ عَبَسَ", "سُورَةُ التَّكۡوِيرِ"
    , "سُورَةُ الانفِطَارِ", "سُورَةُ المُطَفِّفِينَ ", "سُورَةُ الانشِقَاقِ", "سُورَةُ البُرُوجِ", "سُورَةُ الطَّارِقِ", "سُورَةُ الأَعۡلَىٰ", "سُورَةُ الغَاشِيَةِ" 
    ,"سُورَةُ الفَجۡرِ", "سُورَةُ البَلَدِ", "سُورَةُ الشَّمۡسِ", "سُورَةُ اللَّيۡلِ", "سُورَةُ الضُّحَىٰ", "سُورَةُ الشَّرۡحِ", "سُورَةُ التِّينِ", "سُورَةُ العَلَقِ", "سُورَةُ القَدۡرِ"
    , "سُورَةُ البَيِّنَةِ", "سُورَةُ الزَّلۡزَلَةِ", "سُورَةُ العَادِيَاتِ", "سُورَةُ القَارِعَةِ", "سُورَةُ التَّكَاثُرِ", "سُورَةُ العَصۡرِ", "سُورَةُ الهُمَزَةِ", "سُورَةُ الفِيلِ"
    , "سُورَةُ قُرَيۡشٍ", "سُورَةُ المَاعُونِ", "سُورَةُ الكَوۡثَرِ", "سُورَةُ الكَافِرُونَ", "سُورَةُ النَّصۡرِ", "سُورَةُ المَسَدِ", "سُورَةُ الإِخۡلَاصِ ", "سُورَةُ الفَلَقِ", "سُورَةُ النَّاسِ"

    ];
    
    for (let i = 1; i <= 114; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} - ${surahNames[i-1]}`;
        select.appendChild(option);
    }
    
    select.value = 1;
    select.onchange = () => {
        currentFilter.sura = parseInt(select.value);
        loadTahrirat();
    };
}

// ==================== تحميل بيانات السورة ====================
function loadTahrirat() {
    const sura = currentFilter.sura;
    const fileUrl = dataUrl + `tahrirat_${sura}.json`;
    
    console.log(`📂 جاري تحميل سورة ${sura}:`, fileUrl);
    document.getElementById('tahriratBody').innerHTML = 
        '<tr><td colspan="8" style="text-align:center; padding:30px;">⏳ جاري تحميل البيانات...</td></tr>';
    
    fetch(fileUrl)
        .then(res => {
            if (!res.ok) throw new Error('HTTP error! status: ' + res.status);
            return res.json();
        })
        .then(data => {
            console.log(`✅ تم تحميل سورة ${sura}، عدد السجلات:`, data.length);
            tahriratData = data;
            extractReaders(data);
            buildReaderFilter();
            buildAyahSelect(data);
            applyFilters();
        })
        .catch(err => {
            console.error('❌ خطأ:', err);
            document.getElementById('tahriratBody').innerHTML = 
                '<tr><td colspan="8" style="text-align:center; padding:30px; color:red;">❌ لا توجد تحريرات لهذه السورة بعد</td></tr>';
        });
}

// ==================== استخراج القراء ====================
function extractReaders(data) {
    const readers = new Set();
    data.forEach(item => {
        if (item.reader && item.reader.trim()) {
            readers.add(item.reader.trim());
        }
        if (item.with && item.with.trim()) {
            item.with.split(/[+,،]/).forEach(r => {
                const trimmed = r.trim();
                if (trimmed) readers.add(trimmed);
            });
        }
    });
    allReaders = Array.from(readers).sort();
}

// ==================== بناء فلتر القراء المتقدم ====================
function buildReaderFilter() {
    const select = document.getElementById('readerFilter');
    if (!select) return;
    
    const allReaders = getAllReaders();
    
    select.innerHTML = '<option value="all">جميع القراء</option>';
    
    
    // إضافة القراء الرئيسيين
    const mainReaders = ["نافع", "ابن كثير", "أبو عمرو", "ابن عامر", "عاصم", "حمزة", "الكسائي", "أبو جعفر", "يعقوب", "العاشر"];
    mainReaders.forEach(reader => {
        const option = document.createElement('option');
        option.value = reader;
        option.textContent = reader;
        select.appendChild(option);
    });
    
    // إضافة الرواة
    const rawis = ["قالون", "ورش", "البزي", "قنبل", "دوري أبو عمرو", "السوسي", "هشام", "ابن ذكوان", "شعبة", "حفص", "خلف", "خلاد", "أبو الحارث", "دوري كسائي", "ابن وردان", "ابن جماز", "رويس", "روح", "إسحاق", "إدريس"];
    rawis.forEach(reader => {
        const option = document.createElement('option');
        option.value = reader;
        option.textContent = reader;
        select.appendChild(option);
    });
    
    select.value = 'all';
    select.onchange = () => {
        currentFilter.reader = select.value;
        applyFilters();
    };
}

// ==================== فلتر الاية ====================
function buildAyahSelect(data) {
    const select = document.getElementById('ayahSelect');
    if (!select) return;
    
    const ayahs = [...new Set(data.map(item => parseInt(item.ayah)).filter(a => !isNaN(a)))].sort((a, b) => a - b);
    
    select.innerHTML = '<option value="all">جميع الايات</option>';
    ayahs.forEach(ayah => {
        const option = document.createElement('option');
        option.value = ayah;
        option.textContent = `الاية رقم ${ayah}`;
        select.appendChild(option);
    });
    
    select.value = 'all';
    select.onchange = () => {
        currentAyahFilter = select.value;
        applyFilters();
    };
}

// ==================== تطبيق الفلاتر ====================
function applyFilters() {
    let filtered = tahriratData;
    
    // فلتر الصفحة
    const pageInput = document.getElementById('pageInput');
    if (pageInput && pageInput.value) {
        const page = parseInt(pageInput.value);
        if (!isNaN(page) && page > 0) {
            filtered = filtered.filter(item => parseInt(item.page) === page);
        }
    }
    
    // فلتر الآية
    if (currentAyahFilter !== 'all') {
        const ayahNum = parseInt(currentAyahFilter);
        filtered = filtered.filter(item => parseInt(item.ayah) === ayahNum);
    }
    
    // فلتر القارئ (يجب أن يكون هنا)
    if (currentFilter.reader !== 'all') {
        filtered = filterByReaderAdvanced(filtered, currentFilter.reader);
    }
    
    currentData = filtered;
    renderTable();
}

// ==================== عرض الجدول ====================
function renderTable() {
    const tbody = document.getElementById('tahriratBody');
    if (!tbody) return;
    
    if (currentData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px;">📭 لا توجد نتائج</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    currentData.forEach(item => {
        const tr = document.createElement('tr');
        const isReference = isReferenceItem(item);
        
        if (isReference) {
            tr.innerHTML = `
                <td>${item.sura || ''}</td>
                <td>${item.ayah || ''}</td>
                <td></td>
                <td colspan="4" class="reference-ayah">
                    <span class="reference-bracket">ﵻ</span>
                    ${item.text}
                    <span class="reference-bracket">ﵺ</span>
                </td>
                <td>${item.page || ''}</td>
            `;
        } else {
            tr.innerHTML = `
                <td>${item.sura || ''}</td>
                <td>${item.ayah || ''}</td>
                <td>${item.rank || ''}</td>
                <td style="font-size:1.1rem; text-align:right; direction:rtl;">${item.text || ''}</td>
                <td>${item.rule || '-'}</td>
                <td style="color:#c9a86b; font-weight:bold;">${item.reader || '-'}</td>
                <td>${item.with || '-'}</td>
                <td>${item.page || ''}</td>
            `;
        }
        tbody.appendChild(tr);
    });
}

// ==================== ربط الأحداث ====================
document.addEventListener('DOMContentLoaded', function() {
    buildSurahSelect();
    
    const pageInput = document.getElementById('pageInput');
    if (pageInput) {
        pageInput.oninput = () => {
            applyFilters();
        };
    }
    
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.onclick = function() {
            const pageInput = document.getElementById('pageInput');
            if (pageInput) pageInput.value = '';
            
            const readerFilter = document.getElementById('readerFilter');
            if (readerFilter) {
                readerFilter.value = 'all';
                currentFilter.reader = 'all';
            }
            
            const ayahSelect = document.getElementById('ayahSelect');
            if (ayahSelect) {
                ayahSelect.value = 'all';
                currentAyahFilter = 'all';
            }
            
            const surahSelect = document.getElementById('surahSelect');
            if (surahSelect) {
                surahSelect.value = 1;
                currentFilter.sura = 1;
            }
            
            loadTahrirat();
            showToast('🔄 تم إعادة ضبط جميع الفلاتر');
        };
    }
    
    const backBtn = document.getElementById('backToQuran');
    if (backBtn) {
        backBtn.onclick = () => {
            window.location.href = '../index.html';
        };
    }
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    loadTahrirat();
});

// ==================== دالة الإشعارات ====================
function showToast(message) {
    let toast = document.querySelector('.toast-message');
    if (toast) toast.remove();
    
    toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#2e241a; color:#e8c67a; padding:10px 25px; border-radius:40px; z-index:2000; font-family:inherit; box-shadow:0 4px 12px black;';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 2000);
}