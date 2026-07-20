// ========================================
// مقارنة القراءات بين الرواة - نسخة مبسطة
// ========================================

// ===== قائمة الرواة =====
const RAWIS = {
    'qalun1': { name: 'قالون (قصر / إسكان)', file: 'mushaf_qalun1.js' },
    'qalun2': { name: 'قالون (قصر / صلة)', file: 'mushaf_qalun2.js' },
    'qalun3': { name: 'قالون (توسط / إسكان)', file: 'mushaf_qalun3.js' },
    'qalun4': { name: 'قالون (توسط / صلة)', file: 'mushaf_qalun4.js' },
    'warsh1': { name: 'ورش (قصر البدل / فتح)', file: 'mushaf_warsh1.js' },
    'warsh2': { name: 'ورش (توسط البدل / تقليل)', file: 'mushaf_warsh2.js' },
    'warsh3': { name: 'ورش (إشباع البدل / الفتح)', file: 'mushaf_warsh3.js' },
    'warsh4': { name: 'ورش (إشباع البدل / تقليل)', file: 'mushaf_warsh4.js' },
    'asbahani': { name: 'ورش (طريق الأصبهاني)', file: 'mushaf_asbahani.js' },
    'bazzi': { name: 'البزي', file: 'mushaf_bazzi.js' },
    'qunbul': { name: 'قنبل', file: 'mushaf_qunbul.js' },
    'doori': { name: 'الدوري', file: 'mushaf_doori.js' },
    'soosi': { name: 'السوسي', file: 'mushaf_soosi.js' },
    'hisham': { name: 'هشام', file: 'mushaf_hisham.js' },
    'ibnDhakwan': { name: 'ابن ذكوان', file: 'mushaf_ibnDhakwan.js' },
    'hafs': { name: 'حفص', file: 'mushaf_hafs.js' },
    'shubah': { name: 'شعبة', file: 'mushaf_shubah.js' },
    'khalaf1': { name: 'خلف (السكت على ال وشيء)', file: 'mushaf_khalaf1.js' },
    'khalaf2': { name: 'خلف (السكت على ال وشيء والمفصول)', file: 'mushaf_khalaf2.js' },
    'khallad1': { name: 'خلاد (السكت على ال وشيء)', file: 'mushaf_khallad1.js' },
    'khallad2': { name: 'خلاد (بلا سكت)', file: 'mushaf_khallad2.js' },
    'abuHarith': { name: 'أبو الحارث', file: 'mushaf_abuHarith.js' },
    'dooriKisai': { name: 'الدوري كسائي', file: 'mushaf_doori_kisai.js' },
    'ibnWardan': { name: 'ابن وردان', file: 'mushaf_ibnWardan.js' },
    'ibnJammaz': { name: 'ابن جماز', file: 'mushaf_ibnJammaz.js' },
    'ruways': { name: 'رويس', file: 'mushaf_ruways.js' },
    'ruh': { name: 'روح', file: 'mushaf_ruh.js' },
    'ishaq': { name: 'إسحاق', file: 'mushaf_ishaq.js' },
    'idris': { name: 'إدريس', file: 'mushaf_idris.js' }
};

// ===== أسماء الكلاسات بالعربية =====
const CLASS_NAMES = {
    'c1': 'كلمة فرشية',
    'c2': 'عد الايات',
    'c3': 'الإدغام الكبير',
    'c4': 'الإمالة أوالتقليل',
    'c5': 'حذف البسملة بين السورتين',
    'c6': 'بداية الأحزاب والأنصاف والأرباع',
    'c7': 'الهمز المفرد أوالمزدوج',
    'c8': 'تغليظ اللام',
    'c9': 'النقل أوالسكت',
    'c10': 'مد البدل لورش فقط',
    'c11': 'ترقيق الراء',
    'c12': 'صلة ميم الجمع',
    'c13': 'مد اللين المهموز',
    'c14': 'إسكان ياء الإضافة',
    'c15': 'الإدغام الصغير',
    'c16': 'تحريك الساكن لالتقاء الساكنين',
    'c17': 'انفرادة',
    'c18': 'هاء الكناية',
    'c19': 'الوقف على الهمز',
    'c20': 'الإشمام أوالاختلاس',
    'c21': 'الوقف على أواخر الكلم',
    'c22': 'العطف',
    'c23': 'التكبير',
    'c24': 'الياءات الزوائد',
    'c25': 'الهمز المزدوج',
    'c26': 'أخر'
};



// ===== ألوان الكلاسات =====
const COLOR_MAP = {
    'c1': '#FF0000',
    'c2': '#C65911',
    'c3': '#FF00FF',
    'c4': '#FFC000',
    'c5': '#5B9BD5',
    'c6': '#002060',
    'c7': '#00B0F0',
    'c8': '#00FF00',
    'c9': '#0000FF',
    'c10': '#00FFFF',
    'c11': '#ED7D31',
    'c12': '#FF0066',
    'c13': '#CC00CC',
    'c14': '#C00000',
    'c15': '#0070C0',
    'c16': '#00B050',
    'c17': '#7030A0',
    'c18': '#548235',
    'c19': '#CC0099',
    'c20': '#92D050',
    'c21': '#970573',
    'c22': '#636261',
    'c23': '#893BC3',
    'c24': '#A50021',
    'c25': '#0099FF',
    'c26': '#FFFF00'
};


// ===== تحميل بيانات الرموز =====
let symbolsData = {};

fetch('../Data/symbols.json')
    .then(response => {
        if (!response.ok) throw new Error('ملف symbols.json غير موجود');
        return response.json();
    })
    .then(data => {
        symbolsData = data;
        console.log('✅ تم تحميل الرموز:', Object.keys(symbolsData).length);
    })
    .catch(err => {
        console.warn('⚠️ فشل تحميل الرموز، سيتم استخدام CLASS_NAMES كبديل:', err.message);
        symbolsData = {};
    });

// ===== دالة لتحويل النص والكلاس إلى اسم الرمز المناسب =====
function getSymbolNameByClassAndText(className, word) {
    if (!className) return 'لا يوجد';
    
    // البحث في بيانات الرموز عن تطابق بين الكلاس والنص
    for (let key in symbolsData) {
        const symbol = symbolsData[key];
        if (symbol.class === className) {
            // التحقق من أن الرمز يظهر في النص
            if (symbol.symbol && word && word.includes(symbol.symbol)) {
                return symbol.meaning || className;
            }
        }
    }
    
    // إذا لم يتم العثور على تطابق، نعيد اسم الكلاس من CLASS_NAMES
    return CLASS_NAMES[className] || className;
}
// ===== دالة للحصول على اسم الرمز من النص والكلاس =====
function getSymbolNameFromText(className, word) {
    if (!className) return 'لا يوجد';
    
    // البحث في بيانات الرموز عن تطابق بين الكلاس والنص
    for (let key in symbolsData) {
        const symbol = symbolsData[key];
        if (symbol.class === className) {
            // التحقق من أن الرمز يظهر في النص
            if (symbol.symbol && word && word.includes(symbol.symbol)) {
                return symbol.meaning || className;
            }
        }
    }
    
    // إذا لم يتم العثور على تطابق، نعيد اسم الكلاس من CLASS_NAMES
    return CLASS_NAMES[className] || className;
}

// ===== المتغيرات العامة =====
let allData = {};
let mainRawi = 'hafs';
let compareRawi = 'warsh1';
let currentSura = 1;
let currentAyah = 1;

// ===== أسماء السور =====
const SURAH_NAMES = [
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

// ===== استخراج البيانات من النص =====
function extractData(text) {
    let results = [];
    let cleanText = text.replace(/const\s+quranData\s*=\s*/, '');
    cleanText = cleanText.replace(/export\s+default\s+/, '');
    cleanText = cleanText.trim();
    
    if (!cleanText.startsWith('[')) {
        let startIndex = cleanText.indexOf('[');
        let endIndex = cleanText.lastIndexOf(']');
        if (startIndex !== -1 && endIndex !== -1) {
            cleanText = cleanText.substring(startIndex, endIndex + 1);
        }
    }
    
    try {
        let data = eval(cleanText);
        if (Array.isArray(data)) {
            return data;
        }
    } catch(e) {}
    
    let lines = text.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('{') || (line.startsWith('},') && !line.startsWith('const'))) {
            let cleanLine = line.replace(/},?$/, '}').trim();
            
            let suraMatch = cleanLine.match(/sura\s*:\s*(\d+)/);
            let nameMatch = cleanLine.match(/name\s*:\s*['"]([^'"]+)['"]/);
            let ayahMatch = cleanLine.match(/ayah\s*:\s*(\d+)/);
            let pageMatch = cleanLine.match(/page\s*:\s*(\d+)/);
            let textMatch = cleanLine.match(/text\s*:\s*['"](.+?)['"]\s*,?\s*\}/);
            
            if (!textMatch) {
                textMatch = cleanLine.match(/text\s*:\s*['"](.+)$/);
                if (textMatch) {
                    textMatch[1] = textMatch[1].replace(/['"]\s*},?\s*$/, '');
                }
            }
            
            if (suraMatch && nameMatch && ayahMatch && pageMatch && textMatch) {
                results.push({
                    sura: parseInt(suraMatch[1]),
                    name: nameMatch[1].trim(),
                    ayah: parseInt(ayahMatch[1]),
                    page: parseInt(pageMatch[1]),
                    text: textMatch[1]
                });
            }
        }
    }
    return results;
}

// ===== تحميل جميع المصاحف =====
async function loadAllMushafs() {
    const loadingText = '⏳ جاري تحميل المصاحف...';
    document.getElementById('mainText').innerHTML = `<div class="loading-text">${loadingText}</div>`;
    document.getElementById('compareText').innerHTML = `<div class="loading-text">${loadingText}</div>`;
    
    let loaded = 0;
    const total = Object.keys(RAWIS).length;
    
    for (let [key, rawi] of Object.entries(RAWIS)) {
        try {
            const response = await fetch(`../Data/${rawi.file}`);
            if (!response.ok) throw new Error(`ملف ${rawi.file} غير موجود`);
            const text = await response.text();
            allData[key] = extractData(text);
            loaded++;
            console.log(`✅ تم تحميل: ${rawi.name} (${loaded}/${total})`);
        } catch (e) {
            console.warn(`⚠️ فشل تحميل ${rawi.name}: ${e.message}`);
            allData[key] = [];
        }
    }
    
    console.log(`✅ تم تحميل ${loaded} مصحفاً`);
    displayComparison();
}

// ===== الحصول على نص الاية =====
function getAyahText(data, sura, ayah) {
    if (!data || data.length === 0) return null;
    const ayahData = data.find(item => item.sura === sura && item.ayah === ayah);
    return ayahData ? ayahData.text : null;
}

// ===== استخراج الحروف الملونة فقط (وليس الكلمة كاملة) =====
// ===== استخراج محتوى الكلاس كاملاً (مع الحفاظ على المسافات) =====
function extractAllClasses(text) {
    if (!text) return [];
    const results = [];
    const seen = new Set();
    
    // 1. البحث عن <span class="cX">
    const spanRegex = /<span[^>]*class=["']([^"']*)["'][^>]*>([^<]*)<\/span>/g;
    let match;
    
    while ((match = spanRegex.exec(text)) !== null) {
        const classAttr = match[1];
        let content = match[2];
        if (content === undefined || content === null) continue;
        
        // ننظف المحتوى من الكشيدات فقط (لا نحذف التشكيل ولا المسافات)
        content = content.replace(/[ـ]/g, '');
        
        const classes = classAttr.match(/c[0-9]+/g);
        if (classes) {
            classes.forEach(cls => {
                // نستخدم المحتوى الكامل كمفتاح (مع الحفاظ على المسافات)
                const key = `${cls}-${content}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    results.push({
                        className: cls,
                        word: content,  // ← المحتوى كاملاً مع المسافات
                        fullContent: content,
                        position: match.index
                    });
                }
            });
        }
    }
    
    // 2. البحث عن الكلاسات في النص العادي (بدون span)
    const directRegex = /c[0-9]+/g;
    let directMatch;
    while ((directMatch = directRegex.exec(text)) !== null) {
        const cls = directMatch[0];
        const before = text.substring(Math.max(0, directMatch.index - 10), directMatch.index);
        if (before.includes('<span')) continue;
        
        const start = Math.max(0, directMatch.index - 10);
        const end = Math.min(text.length, directMatch.index + 10);
        const context = text.substring(start, end);
        
        // نبحث عن النص المحيط بالكلاس (مع الحفاظ على المسافات)
        const wordMatch = context.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u064B-\u065F\u0670\u0640\s]+/);
        if (wordMatch) {
            const key = `${cls}-${wordMatch[0].trim()}`;
            if (!seen.has(key)) {
                seen.add(key);
                results.push({
                    className: cls,
                    word: wordMatch[0].trim(),
                    fullContent: wordMatch[0].trim(),
                    position: directMatch.index
                });
            }
        }
    }
    
    return results;
}
// ===== مقارنة الكلاسات مع دمج المتشابهة =====
// ===== مقارنة الكلاسات مع دمج المتشابهة =====
function compareClasses(classes1, classes2) {
    const diffs = [];
    const ignoreClasses = ['c6'];
    
    const allClassNames = new Set([
        ...classes1.map(c => c.className),
        ...classes2.map(c => c.className)
    ]);
    
    allClassNames.forEach(cls => {
        if (ignoreClasses.includes(cls)) return;
        
        const words1 = classes1.filter(c => c.className === cls).map(c => c.word);
        const words2 = classes2.filter(c => c.className === cls).map(c => c.word);
        
        // ندمج الكلمات بعلامة + فقط إذا كان هناك أكثر من كلمة واحدة
        // ونحذف العلامة + الزائدة من النهاية
        const mergedWords1 = words1.length > 1 ? words1.join(' + ') : (words1.length === 1 ? words1[0] : '(-)');
        const mergedWords2 = words2.length > 1 ? words2.join(' + ') : (words2.length === 1 ? words2[0] : '(-)');
        
        // ننظف النتيجة من العلامة + الزائدة
        const cleanMerged1 = mergedWords1.replace(/\s*\+\s*$/, '');
        const cleanMerged2 = mergedWords2.replace(/\s*\+\s*$/, '');
        
        if (cleanMerged1 !== cleanMerged2) {
            diffs.push({
                className: cls,
                word1: cleanMerged1,
                word2: cleanMerged2
            });
        }
    });
    
    return diffs;
}
// ===== الحصول على اسم الكلاس بالعربية =====
function getClassNameArabic(className) {
    return CLASS_NAMES[className] || className;
}

// ===== الحصول على لون الكلاس =====
function getColorFromClass(className) {
    return COLOR_MAP[className] || '#ffffff';
}

// ===== عرض الاختلافات في جدول =====
function displayDifferences(diffs, rawi1, rawi2) {
    const diffList = document.getElementById('diffList');
    if (!diffList) return;
    
    if (diffs.length === 0) {
        diffList.innerHTML = '<div class="diff-empty">✅ لا توجد اختلافات</div>';
        return;
    }
    
    let html = `
        <table class="diff-table">
            <thead>
                <tr>
                    <th>الرقم</th>
                    <th>أصول الرواية</th>
                    <th>${RAWIS[rawi1]?.name || rawi1}</th>
                    <th>${RAWIS[rawi2]?.name || rawi2}</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    diffs.forEach((diff, index) => {
        const color1 = getColorFromClass(diff.className);
        const color2 = getColorFromClass(diff.className);
        
        // ✅ الحصول على اسم الرمز لكل راوٍ (تجاهل (-) و (لا يوجد))
        let symbolName1 = '';
        let symbolName2 = '';
        
        if (diff.word1 !== '(-)') {
            symbolName1 = getSymbolNameFromText(diff.className, diff.word1);
        }
        if (diff.word2 !== '(-)') {
            symbolName2 = getSymbolNameFromText(diff.className, diff.word2);
        }
        
        // ✅ دمج الأسماء إذا كانت مختلفة وكلاهما موجود
        let combinedSymbol = symbolName1 || symbolName2;
        if (symbolName1 && symbolName2 && symbolName1 !== symbolName2) {
            combinedSymbol = `${symbolName1} / ${symbolName2}`;
        }
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${combinedSymbol}</td>
                <td style="color: ${color1};">${diff.word1}</td>
                <td style="color: ${color2};">${diff.word2}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    diffList.innerHTML = html;
}

// ===== عرض المقارنة =====
function displayComparison() {
    const mainData = allData[mainRawi];
    const compareData = allData[compareRawi];
    
    if (!mainData || !compareData) {
        document.getElementById('mainText').innerHTML = '<div class="loading-text">❌ لم يتم تحميل البيانات</div>';
        document.getElementById('compareText').innerHTML = '<div class="loading-text">❌ لم يتم تحميل البيانات</div>';
        return;
    }
    
    const mainText = getAyahText(mainData, currentSura, currentAyah);
    const compareText = getAyahText(compareData, currentSura, currentAyah);
    
    if (!mainText || !compareText) {
        document.getElementById('mainText').innerHTML = '<div class="loading-text">❌ لا توجد اية</div>';
        document.getElementById('compareText').innerHTML = '<div class="loading-text">❌ لا توجد اية</div>';
        return;
    }
    
    document.getElementById('mainText').innerHTML = mainText;
    document.getElementById('compareText').innerHTML = compareText;
    
    document.getElementById('mainRawiName').textContent = RAWIS[mainRawi]?.name || mainRawi;
    document.getElementById('compareRawiName').textContent = RAWIS[compareRawi]?.name || compareRawi;
    
    const classes1 = extractAllClasses(mainText);
    const classes2 = extractAllClasses(compareText);
    
    console.log('📊 الكلاسات في النص الأول:', classes1);
    console.log('📊 الكلاسات في النص الثاني:', classes2);
    
    const diffs = compareClasses(classes1, classes2);
    displayDifferences(diffs, mainRawi, compareRawi);
}

// ===== التنقل بين الآيات (مع الانتقال بين السور) =====
function prevAyah() {
    // نبحث عن الآية السابقة في نفس السورة
    const maxAyah = getMaxAyah(currentSura);
    
    if (currentAyah > 1) {
        // آية سابقة في نفس السورة
        currentAyah--;
    } else if (currentSura > 1) {
        // ننتقل إلى السورة السابقة
        currentSura--;
        currentAyah = getMaxAyah(currentSura);
        // تحديث قائمة السور
        document.getElementById('suraSelect').value = currentSura;
    } else {
        // لا توجد سورة سابقة
        showToast('⚠️ هذه أول آية في المصحف');
        return;
    }
    
    document.getElementById('ayahDisplay').textContent = currentAyah;
    displayComparison();
}

function nextAyah() {
    const maxAyah = getMaxAyah(currentSura);
    
    if (currentAyah < maxAyah) {
        // آية تالية في نفس السورة
        currentAyah++;
    } else if (currentSura < 114) {
        // ننتقل إلى السورة التالية
        currentSura++;
        currentAyah = 1;
        // تحديث قائمة السور
        document.getElementById('suraSelect').value = currentSura;
    } else {
        // لا توجد سورة تالية
        showToast('⚠️ هذه آخر آية في المصحف');
        return;
    }
    
    document.getElementById('ayahDisplay').textContent = currentAyah;
    displayComparison();
}
// ===== دالة مساعدة لعرض رسائل (إذا لم تكن موجودة) =====
function showToast(message) {
    const oldToast = document.querySelector('.toast-message');
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(6, 32, 43, 0.95);
        color: #FDEB9E;
        padding: 10px 25px;
        border-radius: 30px;
        z-index: 9999;
        font-family: inherit;
        font-size: 0.9rem;
        border: 1px solid #FDEB9E;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
// ===== تعديل دالة getMaxAyah لتأخذ السورة كمعامل =====
function getMaxAyah(sura) {
    const hafsData = allData['hafs'];
    if (!hafsData) return 1;
    const maxAyah = hafsData.filter(item => item.sura === sura).length;
    return maxAyah > 0 ? maxAyah : 1;
}

// ===== بناء قائمة السور =====
function buildSuraSelect() {
    const select = document.getElementById('suraSelect');
    if (!select) return;
    
    select.innerHTML = '';
    for (let i = 0; i < SURAH_NAMES.length; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = `${i + 1} - ${SURAH_NAMES[i]}`;
        select.appendChild(option);
    }
    select.value = currentSura;
}

// ===== بناء قائمة الرواة =====
function buildRawiSelects() {
    const mainSelect = document.getElementById('mainRawiSelect');
    const compareSelect = document.getElementById('compareRawiSelect');
    if (!mainSelect || !compareSelect) return;
    
    mainSelect.innerHTML = '';
    compareSelect.innerHTML = '';
    
    for (let [key, rawi] of Object.entries(RAWIS)) {
        const option1 = document.createElement('option');
        option1.value = key;
        option1.textContent = rawi.name;
        mainSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = key;
        option2.textContent = rawi.name;
        compareSelect.appendChild(option2);
    }
    
    mainSelect.value = mainRawi;
    compareSelect.value = compareRawi;
}

// ===== ربط الأحداث =====
function bindEvents() {
    document.getElementById('suraSelect')?.addEventListener('change', function() {
        currentSura = parseInt(this.value);
        currentAyah = 1;
        document.getElementById('ayahDisplay').textContent = currentAyah;
        displayComparison();
    });
    
    document.getElementById('mainRawiSelect')?.addEventListener('change', function() {
        mainRawi = this.value;
        displayComparison();
    });
    
    document.getElementById('compareRawiSelect')?.addEventListener('change', function() {
        compareRawi = this.value;
        displayComparison();
    });
    
    document.getElementById('prevAyahBtn')?.addEventListener('click', prevAyah);
    document.getElementById('nextAyahBtn')?.addEventListener('click', nextAyah);
    
    document.getElementById('backToHome')?.addEventListener('click', function() {
        window.location.href = '../index.html';
    });
}

// ===== التهيئة =====
async function init() {
    buildSuraSelect();
    buildRawiSelects();
    bindEvents();
    document.getElementById('ayahDisplay').textContent = currentAyah;
    await loadAllMushafs();
}

init();
// ========================================
// إضافة حقل إدخال رقم الآية في شريط التنقل (لنفس الصفحة)
// ========================================

(function() {
    const ayahNav = document.querySelector('.ayah-nav');
    if (!ayahNav) {
        console.warn('⚠️ عنصر .ayah-nav غير موجود');
        return;
    }
    
    // إنشاء حقل إدخال الآية
    const pageInput = document.createElement('input');
    pageInput.type = 'number';
    pageInput.id = 'ayahInputNav';
    pageInput.placeholder = 'اية';
    pageInput.min = 1;
    pageInput.max = 604;
    pageInput.style.cssText = `
        width: 45px;
        height: 24px;
        padding: 0 4px;
        border-radius: 10px;
        border: 1px solid #FDEB9E;
        background: #0A3040;
        color: #FDEB9E;
        font-size: 0.9rem;
        font-family: inherit;
        text-align: center;
        outline: none;
        margin: 0 2px;
    `;
    
    // إضافة حدث Enter للانتقال إلى الآية في نفس الصفحة
    pageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const ayah = parseInt(this.value);
            if (ayah >= 1) {
                // تغيير الآية الحالية
                currentAyah = ayah;
                document.getElementById('ayahDisplay').textContent = currentAyah;
                displayComparison();
                this.value = '';
            } else {
                alert('⚠️ رقم الآية غير صحيح');
                this.value = '';
            }
        }
    });
    
    // وضع الحقل في وسط عنصر التنقل
    const ayahDisplay = ayahNav.querySelector('.ayah-number');
    const nextBtn = ayahNav.querySelector('#nextAyahBtn');
    
    if (ayahDisplay && nextBtn) {
        ayahNav.insertBefore(pageInput, nextBtn);
    } else {
        ayahNav.appendChild(pageInput);
    }
    
    // تنسيق عنصر التنقل
    ayahNav.style.cssText = `
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        padding: 4px 8px !important;
        height: 30px !important;
        min-width: auto !important;
        background: var(--bg-card-dark) !important;
        border-radius: 10px !important;
        border: 1px solid var(--primary-gold) !important;
        flex: 0 1 auto !important;
    `;
    
    console.log('✅ تم إضافة حقل رقم الآية في شريط التنقل');
})();