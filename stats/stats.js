// ==================== إحصاءات الكلمات الملونة ====================

let coloredWordsData = [];
let currentFileName = '';
let currentColorFilter = 'all';
let currentPagesData = [];
let currentMushafFile = '';

// أسماء الألوان مع رموزها للإحصائيات
const colorInfo = {
    'c1': { icon: '🔴', name: 'الكلمات الفرشية' },
    'c2': { icon: '🟤', name: 'عد الايات' },
    'c3': { icon: '🌸', name: 'الإدغام الكبير' },
    'c4': { icon: '📀', name: 'الإمالة أوالتقليل' },
    'c5': { icon: '🔵', name: 'البسملة بين السورتين' },
    'c6': { icon: '🔵', name: 'علامات الارباع أوالوقف' },
    'c7': { icon: '🔵', name: 'الهمز المفرد أو المزدوج' },
    'c8': { icon: '🟢', name: 'تغليظ اللامات' },
    'c9': { icon: '🔵', name: 'النقل أوالسكت' },
    'c10': { icon: '🔵', name: 'مد البدل' },
    'c11': { icon: '🟠', name: 'ترقيق الراء لورش' },
    'c12': { icon: '🌸', name: 'صلة ميم الجمع' },
    'c13': { icon: '🟣', name: 'مد اللين' },
    'c14': { icon: '🔴', name: 'الياءات المتطرفة' },
    'c15': { icon: '🔵', name: 'الإدغام والإظهار' },
    'c16': { icon: '🟢', name: 'تحريك الساكن او ما قبله' },
    'c17': { icon: '🟣', name: 'الانفرادات' },
    'c18': { icon: '🟢', name: 'هاء الكناية' },
    'c19': { icon: '🌸', name: 'الوقف على الهمز' },
    'c20': { icon: '🟢', name: 'الاختلاس أوالاشمام' },
    'c21': { icon: '🔴', name: 'الوقف على أواخر الكلم' },
    'c22': { icon: '🟡', name: 'قاعدة ' },

};

// ألوان العرض
const colorStyles = {
    'c1': 'style="color:#FF0000;"',
    'c2': 'style="color:#C65911;"',
    'c3': 'style="color:#FF00FF;"',
    'c4': 'style="color:#FFC000;"',
    'c5': 'style="color:#5B9BD5;"',
    'c6': 'style="color:#002060;"',
    'c7': 'style="color:#00B0F0;"',
    'c8': 'style="color:#00FF00;"',
    'c9': 'style="color:#0000FF;"',
    'c10': 'style="color:#00FFFF;"',
    'c11': 'style="color:#ED7D31;"',
    'c12': 'style="color:#FF0066;"',
    'c13': 'style="color:#CC00CC;"',
    'c14': 'style="color:#C00000;"',
    'c15': 'style="color:#0070C0;"',
    'c16': 'style="color:#00B050;"',
    'c17': 'style="color:#7030A0;"',
    'c18': 'style="color:#548235;"',
    'c19': 'style="color:#CC0099;"',
    'c20': 'style="color:#92D050;"',
    'c21': 'style="color:#970573;"',
    'c22': 'style="color:#FFFF00;"',
    'c23': 'style="color:#FFFF00;"',
    'c24': 'style="color:#FFFF00;"',
    'c25': 'style="color:#FFFF00;"'
};

const colorNames = {
    'c1': 'الكلمات الفرشية',
    'c2': 'عد الايات',
    'c3': 'الإدغام الكبير',
    'c4': 'الإمالة والتقليل',
    'c5': 'البسملة بين السورتين',
    'c6': 'علامات الوقف',
    'c7': 'الهمز المفرد والمزدوج',
    'c8': 'اللامات لورش',
    'c9': 'النقل والسكت',
    'c10': 'مد البدل لورش',
    'c11': 'الراءات لورش',
    'c12': 'ميم الجمع',
    'c13': 'مد اللين لورش',
    'c14': 'الياءات المتطرفة',
    'c15': 'الإدغام والإظهار',
    'c16': 'تحريك الساكن ',
    'c17': 'الانفرادات',
    'c18': 'هاء الكناية',
    'c19': ' ٱلوقف على ٱلهمز',
    'c20': 'الاختلاس والاشمام',
    'c21': 'ٱلوقف على أواخر الكلم',
    'c22': 'قاعدة 22',
    'c23': 'قاعدة 23',
    'c24': 'قاعدة 24',
    'c25': 'قاعدة 25'
};

// ==================== دوال تحليل البيانات ====================

function extractDataFromText(text) {
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
    
    // طريقة يدوية
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

function buildPagesArray(data) {
    let pages = new Map();
    for (let item of data) {
        if (!pages.has(item.page)) pages.set(item.page, []);
        pages.get(item.page).push(item);
    }
    let result = [];
    for (let p = 1; p <= 604; p++) result.push(pages.get(p) || []);
    return result;
}

function extractColoredWordsWithColors(text) {
    let words = [];
    let spanPattern = /<span\s+class=['"]([^'"]+)['"]>([^<]*)<\/span>/g;
    let match;
    let lastIndex = 0;
    let plainText = '';
    let colorMap = [];
    let colorTextMap = [];
    
    while ((match = spanPattern.exec(text)) !== null) {
        let colorClass = match[1];
        let coloredContent = match[2];
        let startPos = match.index;
        
        let beforeText = text.substring(lastIndex, startPos);
        for (let i = 0; i < beforeText.length; i++) {
            colorMap.push(null);
            colorTextMap.push(beforeText[i]);
        }
        plainText += beforeText;
        
        for (let i = 0; i < coloredContent.length; i++) {
            colorMap.push(colorClass);
            colorTextMap.push(coloredContent[i]);
        }
        plainText += coloredContent;
        
        lastIndex = startPos + match[0].length;
    }
    
    let afterText = text.substring(lastIndex);
    for (let i = 0; i < afterText.length; i++) {
        colorMap.push(null);
        colorTextMap.push(afterText[i]);
    }
    plainText += afterText;
    
    let currentWord = '';
    let currentWordHtml = '';
    let currentColors = [];
    let currentColorsHtml = [];
    
    for (let i = 0; i < plainText.length; i++) {
        let char = plainText[i];
        let color = colorMap[i];
        
        if (char !== ' ' && char !== '\n' && char !== '\t') {
            currentWord += char;
            if (color && !currentColors.includes(color)) {
                currentColors.push(color);
            }
            if (color) {
                currentWordHtml += `<span ${colorStyles[color]}>${char}</span>`;
                currentColorsHtml.push(color);
            } else {
                currentWordHtml += char;
            }
        } else {
            if (currentWord.length > 0 && currentColors.length > 0) {
                words.push({ 
                    word: currentWord, 
                    wordHtml: currentWordHtml,
                    colors: [...currentColors],
                    colorsHtml: [...currentColorsHtml]
                });
            }
            currentWord = '';
            currentWordHtml = '';
            currentColors = [];
            currentColorsHtml = [];
        }
    }
    
    if (currentWord.length > 0 && currentColors.length > 0) {
        words.push({ 
            word: currentWord, 
            wordHtml: currentWordHtml,
            colors: [...currentColors],
            colorsHtml: [...currentColorsHtml]
        });
    }
    
    return words;
}

// ==================== دمج الكلمات المتجاورة حسب القواعد (بدون حد أقصى) ====================

function mergeAdjacentWords(words) {
    if (words.length < 2) return words;
    
    // تعريف قواعد كل كلاس
    const classRules = {
        'c1': { type: 'normal', separator: ' - ' },
        'c2': { type: 'normal', separator: ' - ' },
        'c3': { type: 'idgham', separator: ' ' },
        'c4': { type: 'normal', separator: ' - ' },
        'c5': { type: 'basmala', separator: ' ' },
        'c6': { type: 'normal', separator: ' - ' },
        'c7': { type: 'idgham_or_normal', separator: ' ', separatorExtra: ' - ' },
        'c8': { type: 'normal', separator: ' - ' },
        'c9': { type: 'normal', separator: ' - ' },
        'c10': { type: 'idgham_or_normal', separator: ' ', separatorExtra: ' - ' },
        'c11': { type: 'normal', separator: ' - ' },
        'c12': { type: 'normal', separator: ' - ' },
        'c13': { type: 'normal', separator: ' - ' },
        'c14': { type: 'normal', separator: ' - ' },
        'c15': { type: 'idgham', separator: ' ' },
        'c16': { type: 'normal', separator: ' - ' },
        'c17': { type: 'normal', separator: ' - ' },
        'c18': { type: 'normal', separator: ' - ' },
        'c19': { type: 'normal', separator: ' - ' },
        'c20': { type: 'normal', separator: ' - ' },
        'c21': { type: 'normal', separator: ' - ' }
    };
    
    // دالة للحصول على أول كلاس في الكلمة
    function getFirstClass(word) {
        if (!word.colors || word.colors.length === 0) return null;
        return word.colors[0];
    }
    
    // دالة للتحقق من أن جميع الكلمات لها نفس الكلاس
    function hasSameColor(word1, word2) {
        if (!word1.colors || !word2.colors) return false;
        if (word1.colors.length === 0 || word2.colors.length === 0) return false;
        return word1.colors[0] === word2.colors[0];
    }
    
    let merged = [];
    let i = 0;
    
    while (i < words.length) {
        let current = words[i];
        let mainClass = getFirstClass(current);
        let rule = classRules[mainClass] || { type: 'normal', separator: ' - ' };
        
        // جمع كل الكلمات المتجاورة التي لها نفس اللون
        let sameColorWords = [current];
        let j = i + 1;
        
        while (j < words.length && hasSameColor(current, words[j])) {
            sameColorWords.push(words[j]);
            j++;
        }
        
        let count = sameColorWords.length;
        
        // ===== حالة خاصة: c5 (البسملة) تدمج كلها =====
        if (mainClass === 'c5') {
            let allWords = sameColorWords.map(w => w.word);
            let allHtml = sameColorWords.map(w => w.wordHtml);
            
            merged.push({
                word: allWords.join(' '),
                wordHtml: allHtml.join(' '),
                colors: ['c5'],
                isMerged: true,
                isBasmala: true,
                sura: current.sura,
                suraNum: current.suraNum,
                ayah: current.ayah,
                page: current.page,
                coloredLetter: 'البسملة',
                colorCode: 'c5'
            });
            i += count;
            continue;
        }
        
        // ===== حالة: c3, c15 (إدغام - كلمتان فقط) =====
        if (rule.type === 'idgham') {
            if (count >= 2) {
                // نأخذ كلمتين فقط
                let wordsToMerge = sameColorWords.slice(0, 2).map(w => w.word);
                let htmlToMerge = sameColorWords.slice(0, 2).map(w => w.wordHtml);
                
                merged.push({
                    word: wordsToMerge.join(' '),
                    wordHtml: htmlToMerge.join(' '),
                    colors: [mainClass],
                    isMerged: true,
                    sura: current.sura,
                    suraNum: current.suraNum,
                    ayah: current.ayah,
                    page: current.page,
                    coloredLetter: current.coloredLetter,
                    colorCode: mainClass
                });
                i += 2;
            } else {
                merged.push(current);
                i++;
            }
            continue;
        }
        
        // ===== حالة: c7, c10 (إدغام مع إمكانية تجاوز 2) =====
        if (rule.type === 'idgham_or_normal') {
            let separator = (count <= 2) ? ' ' : ' - ';
            let allWords = sameColorWords.map(w => w.word);
            let allHtml = sameColorWords.map(w => w.wordHtml);
            
            merged.push({
                word: allWords.join(separator),
                wordHtml: allHtml.join(separator),
                colors: [mainClass],
                isMerged: true,
                sura: current.sura,
                suraNum: current.suraNum,
                ayah: current.ayah,
                page: current.page,
                coloredLetter: current.coloredLetter,
                colorCode: mainClass
            });
            i += count;
            continue;
        }
        
        // ===== حالة: Normal (غير إدغام) =====
        if (rule.type === 'normal' && count >= 2) {
            let allWords = sameColorWords.map(w => w.word);
            let allHtml = sameColorWords.map(w => w.wordHtml);
            
            merged.push({
                word: allWords.join(' - '),
                wordHtml: allHtml.join(' - '),
                colors: [mainClass],
                isMerged: true,
                sura: current.sura,
                suraNum: current.suraNum,
                ayah: current.ayah,
                page: current.page,
                coloredLetter: current.coloredLetter,
                colorCode: mainClass
            });
            i += count;
            continue;
        }
        
        // إذا لم يتحقق شرط الدمج، نضيف الكلمة الحالية كما هي
        merged.push(current);
        i++;
    }
    
    return merged;
}


async function analyzeColoredWords(pagesData) {
    let results = [];
    let totalPages = pagesData.length;
    
    let progressContainer = document.getElementById('progressContainer');
    let progressBar = document.getElementById('progressBar');
    let progressText = document.getElementById('progressText');
    
    if (progressContainer) progressContainer.style.display = 'block';
    
    for (let page = 1; page <= totalPages; page++) {
        let ayahs = pagesData[page - 1];
        if (ayahs && ayahs.length > 0) {
            let surahName = ayahs.find(a => a.ayah !== 0)?.name?.replace(/_/g, '') || '';
            let suraNum = ayahs.find(a => a.ayah !== 0)?.sura || '';
            
            for (let ayah of ayahs) {
                if (ayah.text.includes("سُورَةُ")) continue;
                
                let words = extractColoredWordsWithColors(ayah.text);
                words = mergeAdjacentWords(words); // ← إضافة هذا السطر
                
                for (let word of words) {
                    if (word.colors && word.colors.length > 0) {
                        for (let color of word.colors) {
                            results.push({
                                sura: surahName,
                                suraNum: suraNum,
                                ayah: ayah.ayah,
                                page: page,
                                word: word.word,
                                wordHtml: word.wordHtml,
                                coloredLetter: colorNames[color] || color,
                                colorCode: color
                            });
                        }
                    }
                }
            }
        }
        
        let percent = (page / totalPages) * 100;
        if (progressBar) progressBar.style.width = percent + '%';
        if (progressText) progressText.textContent = `جاري التحليل... ${page} / ${totalPages} صفحة (${Math.round(percent)}%)`;
        await new Promise(r => setTimeout(r, 5));
    }
    
    if (progressContainer) progressContainer.style.display = 'none';
    console.log(`✅ تم العثور على ${results.length} كلمة ملونة`);
    return results;
}

// ==================== دالة بناء فلتر الألوان مع الإحصائيات ====================

function buildColorFilterWithStats(data) {
    const select = document.getElementById('colorFilterSelect');
    if (!select) {
        console.warn('⚠️ عنصر colorFilterSelect غير موجود');
        return;
    }
    
    // عد التكرارات لكل لون
    const colorCounts = {};
    data.forEach(item => {
        if (item.colorCode) {
            colorCounts[item.colorCode] = (colorCounts[item.colorCode] || 0) + 1;
        }
    });
    
    // بناء الخيارات
    let html = `<option value="all">🎨 جميع الألوان (${data.length})</option>`;
    for (const [code, info] of Object.entries(colorInfo)) {
        const count = colorCounts[code] || 0;
        html += `<option value="${code}">${info.icon} ${info.name} (${count})</option>`;
    }
    select.innerHTML = html;
    
    // استعادة الفلتر المحدد مسبقاً
    if (currentColorFilter && currentColorFilter !== 'all') {
        select.value = currentColorFilter;
    }
    
    console.log(`✅ تم بناء قائمة الألوان مع ${data.length} كلمة ملونة`);
}

// ==================== تحديث الإحصائيات ====================

function updateSummaryCards(data) {
    buildColorFilterWithStats(data);
    document.title = `📊 إحصاءات الكلمات الملونة (${data.length})`;
}

// ==================== عرض الجدول ====================
function displayTable(data) {
    let tbody = document.getElementById('statsTableBody');
    if (!tbody) return;
    
    let filteredData = data;
    if (currentColorFilter !== 'all') {
        filteredData = data.filter(item => item.colorCode === currentColorFilter);
    }
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">لا توجد كلمات ملونة للعرض</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    for (let i = 0; i < filteredData.length; i++) {
        let item = filteredData[i];
        let row = tbody.insertRow();
        
        // 1. السورة
        row.insertCell(0).textContent = item.sura;
        
        // 2. رقم الآية
        row.insertCell(1).textContent = item.ayah;
        
        // 3. الصفحة
        row.insertCell(2).textContent = item.page;
        
        // 4. الكلمة
        let wordCell = row.insertCell(3);
        wordCell.innerHTML = item.wordHtml || item.word;
        wordCell.style.cursor = 'pointer';
        wordCell.style.color = '#000000';
        //wordCell.style.textDecoration = 'underline';
        
        wordCell.setAttribute('data-page', item.page);
        wordCell.setAttribute('data-sura', item.suraNum);
        wordCell.setAttribute('data-ayah', item.ayah);
        
        wordCell.onclick = function(e) {
            e.stopPropagation();
            let page = this.getAttribute('data-page');
            let sura = this.getAttribute('data-sura');
            let ayah = this.getAttribute('data-ayah');
            let targetFile = currentFileName || currentMushafFile;
            window.location.href = `../index.html?page=${page}&sura=${sura}&ayah=${ayah}&mushaf=${targetFile}`;
        };
        
        // 5. عدد الحروف
        const cleanWord = item.word.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
        row.insertCell(4).textContent = cleanWord.length;
        
        row.style.cursor = 'pointer';
        row.title = `انتقال إلى سورة ${item.sura} آية ${item.ayah} (صفحة ${item.page})`;
        row.onclick = function(e) {
            if (e.target.tagName === 'TD' && e.target.cellIndex === 3) return;
            let page = this.cells[2].textContent;
            let sura = this.cells[0].textContent;
            let ayah = this.cells[1].textContent;
            let targetFile = currentFileName || currentMushafFile;
            window.location.href = `../index.html?page=${page}&sura=${sura}&ayah=${ayah}&mushaf=${encodeURIComponent(targetFile)}`;
        };
    }
}

// ==================== دالة الحصول على لون الكود ====================

function getColorCode(colorCode) {
    const colors = {
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
        'c22': '#FFFF00',
        'c23': '#FFFF00',
        'c24': '#FFFF00',
        'c25': '#FFFF00'
    };
    return colors[colorCode] || '#c9a86b';
}

// ==================== نسخ الجدول إلى Excel ====================

async function copyTableToClipboard() {
    let filteredData = coloredWordsData;
    if (currentColorFilter !== 'all') {
        filteredData = coloredWordsData.filter(item => item.colorCode === currentColorFilter);
    }
    
    if (filteredData.length === 0) {
        alert('لا توجد بيانات للنسخ');
        return;
    }
    
    // بناء الجدول مع الحفاظ على HTML الأصلي للكلمة
    let tableHtml = `<table border="1" cellpadding="8" cellspacing="0" dir="rtl" style="border-collapse: collapse; font-family: 'Amiri', 'Traditional Arabic', 'NouariAbdelkabir', serif; font-size: 14px;">
        <thead>
            <tr style="background-color: #c9a86b; color: #2e241a;">
                <th style="padding: 8px; border: 1px solid #ddd;">عدد</th>
                <th style="padding: 8px; border: 1px solid #ddd;">السورة</th>
                <th style="padding: 8px; border: 1px solid #ddd;">رقم الآية</th>
                <th style="padding: 8px; border: 1px solid #ddd;">الصفحة</th>
                <th style="padding: 8px; border: 1px solid #ddd;">الكلمة</th>
                <th style="padding: 8px; border: 1px solid #ddd;">اللون</th>
                <th style="padding: 8px; border: 1px solid #ddd;">نوع اللون</th>
            </tr>
        </thead>
        <tbody>`;
    
    for (let i = 0; i < filteredData.length; i++) {
        let item = filteredData[i];
        let coloredWord = item.wordHtml || item.word;
        tableHtml += `<tr>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${i + 1}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.sura}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.ayah}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.page}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-family: 'Amiri', 'Traditional Arabic', 'NouariAbdelkabir', serif;">${coloredWord}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: ${getColorCode(item.colorCode)}; font-weight: bold;">${item.colorCode.toUpperCase()}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.coloredLetter}</td>
        </tr>`;
    }
    
    tableHtml += `</tbody></table>`;
    
    // نسخ إلى الحافظة
    try {
        const blob = new Blob([tableHtml], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({
            'text/html': blob,
            'text/plain': new Blob([getPlainTextTable(filteredData)], { type: 'text/plain' })
        });
        
        await navigator.clipboard.write([clipboardItem]);
        alert('✅ تم نسخ الجدول بنجاح مع الحفاظ على ألوان الحروف!\nيمكنك الآن لصقه في Excel (Ctrl + V)');
    } catch (err) {
        // طريقة بديلة
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHtml;
        document.body.appendChild(tempDiv);
        
        const range = document.createRange();
        range.selectNode(tempDiv);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
        document.execCommand('copy');
        
        window.getSelection().removeAllRanges();
        document.body.removeChild(tempDiv);
        
        alert('✅ تم نسخ الجدول بنجاح!\nيمكنك الآن لصقه في Excel (Ctrl + V)');
    }
}

function getPlainTextTable(data) {
    let rows = [['#', 'السورة', 'رقم الآية', 'الصفحة', 'الكلمة', 'اللون', 'نوع اللون']];
    for (let i = 0; i < data.length; i++) {
        rows.push([
            i + 1,
            data[i].sura,
            data[i].ayah,
            data[i].page,
            data[i].word,
            data[i].colorCode.toUpperCase(),
            data[i].coloredLetter
        ]);
    }
    return rows.map(row => row.join('\t')).join('\n');
}

// ==================== تحميل الملفات ====================

async function loadFileFromPath(fileName) {
    currentMushafFile = fileName;
    currentFileName = fileName;
    
    try {
        let response = await fetch(`../Data/${fileName}`);
        if (!response.ok) throw new Error('File not found');
        let text = await response.text();
        let data = extractDataFromText(text);
        if (data.length === 0) { alert('لم يتم العثور على بيانات صالحة في هذا الملف'); return false; }
        currentPagesData = buildPagesArray(data);
        let results = await analyzeColoredWords(currentPagesData);
        coloredWordsData = results;
        // ===== إضافة هذا السطر لحفظ البيانات =====
        saveAnalysisData(currentFileName, currentFileName, results);

        updateSummaryCards(results);
        displayTable(results);
        alert(`✅ تم تحليل ${results.length} كلمة ملونة`);
        return true;
    } catch(e) {
        alert(`فشل تحميل الملف: ${fileName}`);
        return false;
    }
}

// ==================== حفظ واستعادة البيانات ====================

function saveAnalysisData(data, fileName, results) {
    const analysisData = {
        fileName: fileName,
        results: results,
        timestamp: new Date().toISOString(),
        currentMushafFile: currentMushafFile
    };
    localStorage.setItem('quranStatsAnalysis', JSON.stringify(analysisData));
    console.log('تم حفظ بيانات التحليل في localStorage');
}

function loadAnalysisData() {
    const saved = localStorage.getItem('quranStatsAnalysis');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            console.log('تم استعادة بيانات التحليل من localStorage', data);
            return data;
        } catch(e) {
            console.error('خطأ في قراءة البيانات المحفوظة');
        }
    }
    return null;
}

function clearAnalysisData() {
    localStorage.removeItem('quranStatsAnalysis');
    console.log('تم مسح بيانات التحليل المحفوظة');
}

function restoreLastAnalysis() {
    const savedData = loadAnalysisData();
    if (savedData && savedData.results && savedData.results.length > 0) {
        console.log(`استعادة ${savedData.results.length} كلمة ملونة من التحليل السابق`);
        coloredWordsData = savedData.results;
        currentMushafFile = savedData.currentMushafFile;
        currentFileName = savedData.fileName;
        
        updateSummaryCards(coloredWordsData);
        displayTable(coloredWordsData);
        
        const rawiSelect = document.getElementById('rawiSelect');
        if (rawiSelect && savedData.fileName) {
            rawiSelect.value = savedData.fileName;
        }
        
        alert(`✅ تم استعادة التحليل السابق (${coloredWordsData.length} كلمة ملونة)`);
        return true;
    }
    return false;
}

// ==================== ربط الأحداث ====================

function bindEvents() {
    document.getElementById('loadFileBtn').onclick = async () => {
        let select = document.getElementById('rawiSelect');
        currentFileName = select.value;
        await loadFileFromPath(currentFileName);
    };
    
    document.getElementById('copyTableBtn').onclick = copyTableToClipboard;
    
    document.getElementById('clearCacheBtn').onclick = () => {
        clearAnalysisData();
        coloredWordsData = [];
        updateSummaryCards([]);
        displayTable([]);
        alert('✅ تم مسح البيانات المحفوظة');
    };
    
    document.getElementById('colorFilterSelect').onchange = (e) => {
        currentColorFilter = e.target.value;
        displayTable(coloredWordsData);
    };
}

// ==================== التهيئة ====================

document.addEventListener('DOMContentLoaded', function() {
    bindEvents();
    
    // محاولة استعادة آخر تحليل
    setTimeout(() => {
        const restored = restoreLastAnalysis();
        if (!restored) {
            console.log('لم يتم العثور على تحليل سابق');
        }
    }, 500);
    
    console.log('✅ تم تحميل stats.js بنجاح');
});

console.log('✅ جميع الدوال جاهزة');