// ========================================
// البيانات والفلاتر (نفس الكود القديم)
// ========================================

let tahriratData = [];
let currentFilter = {
    sura: 1,
    page: '',
    reader: 'all'
};
let currentAyahFilter = 'all';
let allReaders = [];
let currentData = [];

// تحديد المسار
let dataUrl;
if (window.location.port === '5500' || window.location.protocol === 'file:') {
    dataUrl = './tahrirat/';
} else {
    dataUrl = '/Maktouba/tahrirat/';
}

// دالة التحقق من المرجعية
function isReferenceItem(item) {
    return !item.reader && !item.rule && !item.rank;
}

// ========================================
// هيكل القراء والرواة
// ========================================

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
    baqoon: {
        name: "الباقون",
        rawis: [
            "ابن كثير", "أبو عمرو", "ابن عامر",
            "عاصم", "حمزة", "الكسائي", "أبو جعفر",
            "يعقوب", "العاشر",
            "ورش", "البزي", "قنبل", "دوري أبو عمرو",
            "السوسي", "هشام", "ابن ذكوان", "شعبة",
            "حفص", "خلف", "خلاد", "أبو الحارث",
            "دوري كسائي", "ابن وردان", "ابن جماز",
            "رويس", "روح", "إسحاق", "إدريس"
        ]
    }
};

// ========================================
// دوال الفلاتر (نفس الكود القديم)
// ========================================

function getAllReaders() {
    const readers = new Set();
    for (let key in readerHierarchy) {
        const group = readerHierarchy[key];
        readers.add(group.name);
        group.rawis.forEach(rawi => readers.add(rawi));
    }
    return Array.from(readers).sort();
}

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

function filterByReaderAdvanced(data, selectedReader) {
    if (selectedReader === 'all') return data;
    const results = [];
    const seen = new Set();
    if (selectedReader === 'الباقون') {
        data.forEach(item => {
            const key = `${item.sura}-${item.ayah}-${item.rank}`;
            if (seen.has(key)) return;
            const isNotQalun = (item.reader && !item.reader.includes('قالون')) ||
                               (item.with && !item.with.includes('قالون'));
            const isInBaqoon = (item.reader && readerHierarchy.baqoon.rawis.some(r => item.reader.includes(r))) ||
                               (item.with && readerHierarchy.baqoon.rawis.some(r => item.with.includes(r)));
            if (isNotQalun || isInBaqoon) {
                seen.add(key);
                results.push(item);
            }
        });
        return results;
    }
    data.forEach(item => {
        const key = `${item.sura}-${item.ayah}-${item.rank}`;
        if (seen.has(key)) return;
        let match = false;
        if (item.reader && item.reader.includes(selectedReader)) match = true;
        if (item.with && item.with.includes(selectedReader)) match = true;
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

// ========================================
// بناء قائمة السور
// ========================================

function buildSurahSelect() {
    const select = document.getElementById('surahSelect');
    if (!select) return;
    select.innerHTML = '';
    const surahNames = [
        "سُورَةُ الفَاتِحَةِ", "سُورَةُ البَقَرَةِ", "سُورَةُ آلِ عِمۡرَانَ", "سُورَةُ النِّسَاءِ", "سُورَةُ المَائـِدَةِ", "سُورَةُ الأَنۡعَامِ", "سُورَةُ الأَعۡرَافِ", "سُورَةُ الأَنفَالِ",
        "سُورَةُ التَّوۡبَةِ", "سُورَةُ يُونُسَ", "سُورَةُ هُودٍ", "سُورَةُ يُوسُفَ", "سُورَةُ الرَّعۡدِ", "سُورَةُ إِبۡرَاهِيمَ", "سُورَةُ الحِجۡرِ", "سُورَةُ النَّحۡلِ", "سُورَةُ الإِسۡرَاءِ",
        "سُورَةُ الكَهۡفِ", "سُورَةُ مَرۡيَمَ", "سُورَةُ طه", "سُورَةُ الأَنبِيَاءِ", "سُورَةُ الحَجِّ", "سُورَةُ المُؤۡمِنُونَ", "سُورَةُ النُّورِ", "سُورَةُ الفُرۡقَانِ",
        "سُورَةُ الشُّعَرَاءِ", "سُورَةُ النَّمۡلِ", "سُورَةُ القَصَصِ", "سُورَةُ العَنكَبُوتِ ", "سُورَةُ الرُّومِ", "سُورَةُ لُقۡمَانَ", "سُورَةُ السَّجۡدَةِ", "سُورَةُ الأَحۡزَابِ",
        "سُورَةُ سَبَإٍ", "سُورَةُ فَاطِرٍ", "سُورَةُ يسٓ", "سُورَةُ الصَّافَّاتِ", "سُورَةُ صٓ", "سُورَةُ الزُّمَرِ", "سُورَةُ غَافِرٍ", "سُورَةُ فُصِّلَتۡ",
        "سُورَةُ الشُّورَىٰ", "سُورَةُ الزُّخۡرُفِ", "سُورَةُ الدُّخَانِ", "سُورَةُ الجَاثِيَةِ", "سُورَةُ الأَحۡقَافِ", "سُورَةُ مُحَمَّدٍ", "سُورَةُ الفَتۡحِ", "سُورَةُ الحُجُرَاتِ",
        "سُورَةُ قٓ", "سُورَةُ الذَّارِيَاتِ", "سُورَةُ الطُّورِ", "سُورَةُ النَّجۡمِ", "سُورَةُ القَمَرِ", "سُورَةُ الرَّحۡمَٰن", "سُورَةُ الوَاقِعَةِ", "سُورَةُ الحَدِيدِ",
        "سُورَةُ المُجَادلَةِ", "سُورَةُ الحَشۡرِ", "سُورَةُ المُمۡتَحنَةِ", "سُورَةُ الصَّفِّ", "سُورَةُ الجُمُعَةِ", "سُورَةُ المُنَافِقُونَ ", "سُورَةُ التَّغَابُنِ",
        "سُورَةُ الطَّلَاقِ", "سُورَةُ التَّحۡرِيمِ", "سُورَةُ المُلۡكِ", "سُورَةُ القَلَمِ", "سُورَةُ الحَاقَّةِ", "سُورَةُ المَعَارِجِ", "سُورَةُ نُوحٍ", "سُورَةُ الجِنِّ", "سُورَةُ المُزَّمِّلِ",
        "سُورَةُ المُدَّثِّرِ", "سُورَةُ القِيَامَةِ", "سُورَةُ الإِنسَانِ", "سُورَةُ المُرۡسَلَاتِ ", "سُورَةُ النَّبَإِ", "سُورَةُ النَّازِعَاتِ", "سُورَةُ عَبَسَ", "سُورَةُ التَّكۡوِيرِ",
        "سُورَةُ الانفِطَارِ", "سُورَةُ المُطَفِّفِينَ ", "سُورَةُ الانشِقَاقِ", "سُورَةُ البُرُوجِ", "سُورَةُ الطَّارِقِ", "سُورَةُ الأَعۡلَىٰ", "سُورَةُ الغَاشِيَةِ",
        "سُورَةُ الفَجۡرِ", "سُورَةُ البَلَدِ", "سُورَةُ الشَّمۡسِ", "سُورَةُ اللَّيۡلِ", "سُورَةُ الضُّحَىٰ", "سُورَةُ الشَّرۡحِ", "سُورَةُ التِّينِ", "سُورَةُ العَلَقِ", "سُورَةُ القَدۡرِ",
        "سُورَةُ البَيِّنَةِ", "سُورَةُ الزَّلۡزَلَةِ", "سُورَةُ العَادِيَاتِ", "سُورَةُ القَارِعَةِ", "سُورَةُ التَّكَاثُرِ", "سُورَةُ العَصۡرِ", "سُورَةُ الهُمَزَةِ", "سُورَةُ الفِيلِ",
        "سُورَةُ قُرَيۡشٍ", "سُورَةُ المَاعُونِ", "سُورَةُ الكَوۡثَرِ", "سُورَةُ الكَافِرُونَ", "سُورَةُ النَّصۡرِ", "سُورَةُ المَسَدِ", "سُورَةُ الإِخۡلَاصِ ", "سُورَةُ الفَلَقِ", "سُورَةُ النَّاسِ"
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

function buildReaderFilter() {
    const select = document.getElementById('readerFilter');
    if (!select) return;
    select.innerHTML = '<option value="all">جميع القراء</option>';
    const mainReaders = ["نافع", "ابن كثير", "أبو عمرو", "ابن عامر", "عاصم", "حمزة", "الكسائي", "أبو جعفر", "يعقوب", "العاشر"];
    mainReaders.forEach(reader => {
        const option = document.createElement('option');
        option.value = reader;
        option.textContent = reader;
        select.appendChild(option);
    });
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

// ========================================
// تحميل البيانات
// ========================================

function loadTahrirat() {
    const sura = currentFilter.sura;
    const fileUrl = dataUrl + `tahrirat_${sura}.json`;
    console.log(`📂 جاري تحميل سورة ${sura}:`, fileUrl);
    
    // تحديث واجهة الجدول
    const tbody = document.getElementById('tahriratBody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px;">⏳ جاري تحميل البيانات...</td></tr>';
    }
    
    // تحديث عرض الهاتف
    const mobileContent = document.getElementById('mobileContent');
    if (mobileContent) {
        mobileContent.innerHTML = '<div class="no-data-mobile">⏳ جاري تحميل البيانات...</div>';
    }
    
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
            const tbody = document.getElementById('tahriratBody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:red;">❌ لا توجد تحريرات لهذه السورة بعد</td></tr>';
            }
            const mobileContent = document.getElementById('mobileContent');
            if (mobileContent) {
                mobileContent.innerHTML = '<div class="no-data-mobile">❌ لا توجد تحريرات لهذه السورة بعد</div>';
            }
        });
}

// ========================================
// عرض الجدول (للكمبيوتر)
// ========================================

// ========================================
// عرض الجدول (للكمبيوتر)
// ========================================

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
            // ===== الآيات المرجعية بتنسيق خاص =====
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
            // ===== الآيات العادية =====
            tr.innerHTML = `
                <td>${item.sura || ''}</td>
                <td>${item.ayah || ''}</td>
                <td>${item.rank || ''}</td>
                <td style="font-size:1.2rem; text-align:right; direction:rtl;">${item.text || ''}</td>
                <td>${item.rule || '-'}</td>
                <td style="color:#06202B;">${item.reader || '-'}</td>
                <td>${item.with || '-'}</td>
                <td>${item.page || ''}</td>
            `;
        }
        tbody.appendChild(tr);
    });
}

// ========================================
// عرض الهاتف
// ========================================

function renderMobileView(data) {
    const container = document.getElementById('mobileContent');
    if (!container) return;
    
    if (!data || data.length === 0) {
        container.innerHTML = '<div class="no-data-mobile">📭 لا توجد نتائج</div>';
        return;
    }
    
    let html = '';
    let lineCount = 0;
    
    data.forEach((item) => {
        const ayahText = item.text || '';
        const rank = item.rank || '-';
        const reader = item.reader || '-';
        const withReaders = item.with || '-';
        const rule = item.rule || '-';
        const isReference = !item.reader && !item.rule && !item.rank;
        
        if (isReference) {
            // الآيات المرجعية
            html += `
                <div class="reference-line">
                    <span class="ref-bracket">ﵻ</span>
                    <span class="ref-text">${ayahText}</span>
                    <span class="ref-bracket">ﵺ</span>
                </div>
            `;
            return;
        }
        
        lineCount++;
        // الهروب من علامات الاقتباس
        const safeReader = reader.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const safeWith = withReaders.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const safeRule = rule.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const safeRank = rank.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        html += `
            <div class="ayah-line" id="line-${lineCount}">
                <span class="ayah-circle" 
                      onclick="showPopupMobile('${safeRank}', '${safeReader}', '${safeWith}', '${safeRule}', this)"
                      data-rank="${safeRank}"
                      data-reader="${safeReader}"
                      data-with="${safeWith}"
                      data-rule="${safeRule}">
                    ${rank !== '-' ? rank : '•'}
                </span>
                <span class="ayah-text">${ayahText}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
    console.log(`✅ عرض ${lineCount} سطر على الهاتف`);
}

// ========================================
// البطاقة المنبثقة
// ========================================

// ========================================
// البطاقة المنبثقة (تظهر تحت أو فوق حسب الموقع)
// ========================================

function showPopupMobile(rank, reader, withReaders, rule, element) {
    const overlay = document.getElementById('popupOverlay');
    const card = document.getElementById('popupCard');
    const content = document.getElementById('popupContent');
    
    if (!overlay || !card || !content) return;
    
    // محتوى البطاقة
    content.innerHTML = `
        <div class="popup-item">
            <span class="popup-icon">📌</span>
            <span class="popup-label">الرتبة:</span>
            <span class="popup-value">${rank}</span>
        </div>
        <div class="popup-item">
            <span class="popup-icon">🎙️</span>
            <span class="popup-label">يقرأ:</span>
            <span class="popup-value">${reader}</span>
        </div>
        <div class="popup-item">
            <span class="popup-icon">👥</span>
            <span class="popup-label">المندرجين:</span>
            <span class="popup-value">${withReaders}</span>
        </div>
        <div class="popup-item">
            <span class="popup-icon">📝</span>
            <span class="popup-label">البيان:</span>
            <span class="popup-value">${rule}</span>
        </div>
    `;
    
    // الحصول على موقع الدائرة
    const rect = element.getBoundingClientRect();
    const cardHeight = 180; // ارتفاع تقريبي للبطاقة
    const windowHeight = window.innerHeight;
    
    // تحديد المكان المناسب للبطاقة
    let top;
    let shouldShowAbove = false;
    
    // إذا كانت الدائرة في النصف السفلي من الشاشة
    if (rect.top + cardHeight > windowHeight - 20) {
        // تظهر البطاقة فوق الدائرة
        top = rect.top + window.scrollY - cardHeight - 10;
        shouldShowAbove = true;
    } else {
        // تظهر البطاقة تحت الدائرة
        top = rect.bottom + window.scrollY + 8;
    }
    
    // وضع البطاقة
    card.style.display = 'block';
    card.style.top = top + 'px';
    card.style.left = '50%';
    card.style.transform = 'translateX(-50%)';
    card.style.width = 'auto';
    card.style.maxWidth = '92%';
    card.style.minWidth = '200px';
    
    // إضافة سهم صغير يشير إلى الدائرة (اختياري)
    if (shouldShowAbove) {
        // سهم لأسفل (البطاقة فوق الدائرة)
        card.style.borderBottom = '3px solid var(--primary-gold)';
        card.style.borderTop = 'none';
    } else {
        // سهم لأعلى (البطاقة تحت الدائرة)
        card.style.borderTop = '3px solid var(--primary-gold)';
        card.style.borderBottom = 'none';
    }
    
    // إظهار الخلفية
    overlay.style.display = 'block';
    overlay.classList.add('active');
    
    // منع التمرير (اختياري، يمكنك إزالته إذا أردت)
    // document.body.style.overflow = 'hidden';
    
    console.log('✅ تم عرض البطاقة' + (shouldShowAbove ? ' (فوق)' : ' (تحت)'));
}

// ========================================
// إغلاق البطاقة
// ========================================

function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    const card = document.getElementById('popupCard');
    
    if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('active');
    }
    if (card) {
        card.style.display = 'none';
        // إعادة تعيين الحدود
        card.style.borderTop = '2px solid var(--primary-gold)';
        card.style.borderBottom = '2px solid var(--primary-gold)';
    }
    // إعادة التمرير (إذا كنت قد منعته)
    // document.body.style.overflow = '';
}

// ========================================
// تطبيق الفلاتر
// ========================================

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
    
    // فلتر القارئ
    if (currentFilter.reader !== 'all') {
        filtered = filterByReaderAdvanced(filtered, currentFilter.reader);
    }
    
    currentData = filtered;
    
    // ===== تحديث مشغل الصوت =====
    let audioPage = null;
    
    // 1. نتحقق من حقل إدخال الصفحة
    if (pageInput && pageInput.value) {
        const page = parseInt(pageInput.value);
        if (!isNaN(page) && page > 0) {
            audioPage = page;
        }
    }
    
    // 2. إذا لم توجد صفحة في المدخل، نأخذ أول صفحة في النتائج
    if (!audioPage && currentData && currentData.length > 0) {
        const firstPage = parseInt(currentData[0].page);
        if (firstPage && !isNaN(firstPage)) {
            audioPage = firstPage;
        }
    }
    
    // 3. إذا وجدت صفحة، نحمل الصوت
    if (audioPage) {
        loadAudioForPage(audioPage);
    }
    
    // تحديد وضع العرض حسب حجم الشاشة
    const isMobile = window.innerWidth <= 768;
    const tableContainer = document.querySelector('.tahrirat-table-container');
    const mobileContainer = document.getElementById('mobileContainer');
    
    if (isMobile) {
        // وضع الهاتف
        console.log('📱 وضع الهاتف');
        if (tableContainer) tableContainer.style.display = 'none';
        if (mobileContainer) {
            mobileContainer.style.display = 'block';
        }
        renderMobileView(currentData);
    } else {
        // وضع الكمبيوتر
        console.log('💻 وضع الكمبيوتر');
        if (tableContainer) tableContainer.style.display = 'block';
        if (mobileContainer) mobileContainer.style.display = 'none';
        renderTable();
    }
}

// ========================================
// ربط الأحداث
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // بناء الفلاتر
    buildSurahSelect();
    
    // صفحة
    const pageInput = document.getElementById('pageInput');
    if (pageInput) {
        pageInput.oninput = () => { applyFilters(); };
    }
    
    // إعادة ضبط
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
    
    // العودة للمصحف
    const backBtn = document.getElementById('backToQuran');
    if (backBtn) {
        backBtn.onclick = () => {
            window.location.href = '../index.html';
        };
    }
    
    // الوضع الليلي
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // إغلاق البطاقة عند الضغط خارجها
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });
    }
    
    // تحميل البيانات
    loadTahrirat();
    
    // عند تغيير حجم الشاشة
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            applyFilters();
        }, 300);
    });
});

// ========================================
// دالة الإشعارات
// ========================================

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

// ========================================
// مشغل الصوت (نفس الكود القديم)
// ========================================

let currentAudio = null;
let currentAudioPage = null;

function loadAudioForPage(page) {
    if (!page) return;
    const audioPath = `sond/${page}.mp3`;
    const status = document.getElementById('audioStatus');
    const pageDisplay = document.getElementById('audioPageDisplay');
    const surahDisplay = document.getElementById('audioSurahDisplay');
    // إيقاف الصوت الحالي
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    // تحديث واجهة المستخدم
    pageDisplay.textContent = `📄 الصفحة: ${page}`;
    // الحصول على اسم السورة
    const currentSurah = getSurahNameByPage(page);
    surahDisplay.textContent = currentSurah ? `📖 ${currentSurah}` : '📖 -';
      // إنشاء كائن الصوت الجديد
    currentAudio = new Audio(audioPath);
    currentAudioPage = page;
    currentAudio.addEventListener('canplay', function() {
        status.textContent = '▶️ جاهز للتشغيل';
    });
    currentAudio.addEventListener('error', function() {
        status.textContent = '❌ الملف غير موجود';
        pageDisplay.textContent = `📄 الصفحة: ${page} (غير متوفرة)`;
    });
    currentAudio.addEventListener('ended', function() {
        status.textContent = '⏹️ انتهى';
    });
    status.textContent = '⏸️ جاهز';
}

function toggleAudio() {
    const status = document.getElementById('audioStatus');
    if (!currentAudio) {
        const page = getCurrentPageNumber();
        if (page) {
            loadAudioForPage(page);
            setTimeout(() => {
                if (currentAudio) {
                    currentAudio.play();
                    status.textContent = '▶️ تشغيل';
                }
            }, 200);
        }
        return;
    }
    if (currentAudio.paused) {
        currentAudio.play();
        status.textContent = '▶️ تشغيل';
    } else {
        currentAudio.pause();
        status.textContent = '⏸️ متوقف';
    }
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        document.getElementById('audioStatus').textContent = '⏹️ متوقف';
    }
}

function getCurrentPageNumber() {
    const pageInput = document.getElementById('pageInput');
    if (pageInput && pageInput.value) {
        const page = parseInt(pageInput.value);
        if (!isNaN(page) && page > 0) return page;
    }
    if (currentData && currentData.length > 0) {
        const firstItem = currentData[0];
        if (firstItem && firstItem.page) {
            return parseInt(firstItem.page);
        }
    }
    return 1;
}

function getSurahNameByPage(page) {
    if (tahriratData && tahriratData.length > 0) {
        const item = tahriratData.find(d => parseInt(d.page) === page);
        if (item) {
            const suraNum = parseInt(item.sura);
            const surahNames = [
                "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة",
                "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
                "هود", "يوسف", "الرعد", "إبراهيم", "الحجر",
                "النحل", "الإسراء", "الكهف", "مريم", "طه",
                "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان",
                "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
                "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر",
                "يس", "الصافات", "ص", "الزمر", "غافر",
                "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية",
                "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
                "الذاريات", "الطور", "النجم", "القمر", "الرحمن",
                "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
                "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق",
                "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
                "نوح", "الجن", "المزمل", "المدثر", "القيامة",
                "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
                "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج",
                "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
                "الشمس", "الليل", "الضحى", "الشرح", "التين",
                "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
                "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل",
                "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
                "المسد", "الإخلاص", "الفلق", "الناس"
            ];
            if (suraNum >= 1 && suraNum <= 114) {
                return surahNames[suraNum - 1];
            }
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('playAudioBtn');
    const stopBtn = document.getElementById('stopAudioBtn');
    if (playBtn) playBtn.onclick = toggleAudio;
    if (stopBtn) stopBtn.onclick = stopAudio;
    setTimeout(() => {
        const page = getCurrentPageNumber();
        if (page) loadAudioForPage(page);
    }, 500);
});

console.log('✅ تم تحميل المشروع بنجاح');
// ========================================
// زر إظهار/إخفاء مشغل الصوت
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleAudioPlayerBtn');
    const audioPlayer = document.getElementById('audioPlayer');
    
    if (toggleBtn && audioPlayer) {
        // الحالة الأولية: مشغل الصوت ظاهر
        let isAudioVisible = true;
        
        toggleBtn.addEventListener('click', function() {
            if (isAudioVisible) {
                // إخفاء مشغل الصوت
                audioPlayer.classList.add('hidden');
                this.textContent = '🎵';
                this.title = 'إظهار مشغل الصوت';
                isAudioVisible = false;
            } else {
                // إظهار مشغل الصوت
                audioPlayer.classList.remove('hidden');
                this.textContent = '🎵';
                this.title = 'إخفاء مشغل الصوت';
                isAudioVisible = true;
            }
        });
        
        // تغيير الأيقونة عند التمرير (اختياري)
        // يمكن إضافة تأثير بسيط
    }
});

console.log('✅ تم تفعيل زر إظهار/إخفاء مشغل الصوت');
// ========================================
// الانتقال إلى السورة حسب رقم الصفحة
// ========================================

// خريطة رقم الصفحة → رقم السورة
function getSurahFromPage(page) {
    // أرقام الصفحات التي تبدأ بها كل سورة (تقريبية)
    const surahPages = {
        1: 1,    // الفاتحة
        2: 2,    // البقرة
        50: 3,   // آل عمران
        77: 4,   // النساء
        106: 5,  // المائدة
        128: 6,  // الأنعام
        151: 7,  // الأعراف
        177: 8,  // الأنفال
        187: 9,  // التوبة
        208: 10, // يونس
        221: 11, // هود
        235: 12, // يوسف
        249: 13, // الرعد
        255: 14, // إبراهيم
        262: 15, // الحجر
        267: 16, // النحل
        282: 17, // الإسراء
        293: 18, // الكهف
        305: 19, // مريم
        312: 20, // طه
        322: 21, // الأنبياء
        332: 22, // الحج
        342: 23, // المؤمنون
        350: 24, // النور
        359: 25, // الفرقان
        367: 26, // الشعراء
        377: 27, // النمل
        385: 28, // القصص
        396: 29, // العنكبوت
        404: 30, // الروم
        411: 31, // لقمان
        415: 32, // السجدة
        418: 33, // الأحزاب
        428: 34, // سبأ
        435: 35, // فاطر
        440: 36, // يس
        446: 37, // الصافات
        453: 38, // ص
        458: 39, // الزمر
        467: 40, // غافر
        477: 41, // فصلت
        483: 42, // الشورى
        489: 43, // الزخرف
        496: 44, // الدخان
        499: 45, // الجاثية
        502: 46, // الأحقاف
        507: 47, // محمد
        511: 48, // الفتح
        515: 49, // الحجرات
        518: 50, // ق
        520: 51, // الذاريات
        523: 52, // الطور
        526: 53, // النجم
        529: 54, // القمر
        531: 55, // الرحمن
        534: 56, // الواقعة
        537: 57, // الحديد
        541: 58, // المجادلة
        545: 59, // الحشر
        549: 60, // الممتحنة
        551: 61, // الصف
        553: 62, // الجمعة
        554: 63, // المنافقون
        556: 64, // التغابن
        558: 65, // الطلاق
        560: 66, // التحريم
        562: 67, // الملك
        564: 68, // القلم
        566: 69, // الحاقة
        568: 70, // المعارج
        570: 71, // نوح
        572: 72, // الجن
        574: 73, // المزمل
        575: 74, // المدثر
        577: 75, // القيامة
        578: 76, // الإنسان
        580: 77, // المرسلات
        582: 78, // النبأ
        583: 79, // النازعات
        585: 80, // عبس
        586: 81, // التكوير
        587: 82, // الانفطار
        588: 83, // المطففين
        589: 84, // الانشقاق
        590: 85, // البروج
        591: 86, // الطارق
        592: 87, // الأعلى
        593: 88, // الغاشية
        594: 89, // الفجر
        595: 90, // البلد
        596: 91, // الشمس
        597: 92, // الليل
        598: 93, // الضحى
        599: 94, // الشرح
        600: 95, // التين
        601: 96, // العلق
        602: 97, // القدر
        603: 98, // البينة
        604: 99  // الزلزلة (تقريباً)
    };
    
    // نبحث عن أقرب سورة تبدأ قبل أو عند رقم الصفحة
    let targetSurah = 1;
    for (let [startPage, surah] of Object.entries(surahPages)) {
        if (page >= parseInt(startPage)) {
            targetSurah = surah;
        }
    }
    return targetSurah;
}

// ========================================
// البحث الذكي برقم الصفحة
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const pageInput = document.getElementById('pageInput');
    
    if (pageInput) {
        // عند الضغط على Enter أو عند تغيير القيمة
        pageInput.addEventListener('change', function() {
            const page = parseInt(this.value);
            if (page && !isNaN(page) && page > 0 && page <= 604) {
                
                // نتحقق إذا كانت الصفحة موجودة في البيانات الحالية
                const hasPage = currentData.some(item => parseInt(item.page) === page);
                
                if (!hasPage && tahriratData.length > 0) {
                    // البحث عن السورة التي تحتوي على هذه الصفحة
                    const targetSurah = getSurahFromPage(page);
                    
                    if (targetSurah !== currentFilter.sura) {
                        // تغيير السورة
                        const surahSelect = document.getElementById('surahSelect');
                        if (surahSelect) {
                            surahSelect.value = targetSurah;
                            currentFilter.sura = targetSurah;
                            // إعادة تحميل البيانات
                            loadTahrirat();
                            // بعد التحميل، نعيد تطبيق فلتر الصفحة
                            setTimeout(() => {
                                pageInput.value = page;
                                applyFilters();
                            }, 500);
                        }
                    }
                }
            }
        });
    }
});