// ==================== إحصاءات الكلمات الملونة ====================

let coloredWordsData = [];
let currentFileName = '';
let currentColorFilter = 'all';
let currentPagesData = [];

// أسماء الألوان مع رموز HTML للعرض
const colorStyles = {
    'c1': 'style="color:#FF0000;"',
    'c2': 'style="color:#753701;"',
    'c3': 'style="color:#e2d51f;"',
    'c4': 'style="color:#ffbb00;"',
    'c5': 'style="color:#86cbec;"',
    'c6': 'style="color:#062264;"',
    'c7': 'style="color:#0B9DF4;"',
    'c8': 'style="color:#25FB13;"',
    'c9': 'style="color:#0004FF;"',
    'c10': 'style="color:#06EED8;"',
    'c11': 'style="color:#F98F1F;"',
    'c12': 'style="color:#EE1E80;"',
    'c13': 'style="color:#CD12E7;"',
    'c14': 'style="color:#880D0D;"',
    'c15': 'style="color:#1255D6;"',
    'c16': 'style="color:#e2d51f;"',
    'c17': 'style="color:#602DBA;"',
    'c18': 'style="color:#e2d51f;"',
    'c19': 'style="color:#e2d51f;"',
    'c20': 'style="color:#e2d51f;"',
    'c21': 'style="color:#e2d51f;"',
    'c22': 'style="color:#e2d51f;"',
    'c23': 'style="color:#e2d51f;"',
    'c24': 'style="color:#e2d51f;"',
    'c25': 'style="color:#e2d51f;"'
};

// أسماء الألوان للعرض النصي
const colorNames = {
    'c1': 'الكلمات الفرشية',
    'c2': 'عد الآيات',
    'c3': 'قاعدة 3',
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
    'c16': 'قاعدة 16',
    'c17': 'الانفرادات',
    'c18': 'قاعدة 18',
    'c19': 'قاعدة 19',
    'c20': 'قاعدة 20',
    'c21': 'قاعدة 21',
    'c22': 'قاعدة 22',
    'c23': 'قاعدة 23',
    'c24': 'قاعدة 24',
    'c25': 'قاعدة 25'
};

// استخراج البيانات من النص
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

// بناء صفحات المصحف
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

// استخراج الكلمات مع الحفاظ على الألوان
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
    
    // تقسيم إلى كلمات مع الحفاظ على الألوان
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

// تحليل الكلمات الملونة
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
                if (ayah.ayah === 0 || ayah.text.includes("سُورَةُ")) continue;
                
                let words = extractColoredWordsWithColors(ayah.text);
                
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

// تحديث البطاقات
function updateSummaryCards(data) {
    let total = data.length;
    let c1 = data.filter(d => d.colorCode === 'c1').length;
    let c4 = data.filter(d => d.colorCode === 'c4').length;
    let c8 = data.filter(d => d.colorCode === 'c8').length;
    let c11 = data.filter(d => d.colorCode === 'c11').length;
    let c12 = data.filter(d => d.colorCode === 'c12').length;
    let c13 = data.filter(d => d.colorCode === 'c13').length;
    
    let totalEl = document.getElementById('totalWords');
    let c1El = document.getElementById('totalC1');
    let c4El = document.getElementById('totalC4');
    let c8El = document.getElementById('totalC8');
    let c11El = document.getElementById('totalC11');
    let c12El = document.getElementById('totalC12');
    let c13El = document.getElementById('totalC13');
    
    if (totalEl) totalEl.textContent = total;
    if (c1El) c1El.textContent = c1;
    if (c4El) c4El.textContent = c4;
    if (c8El) c8El.textContent = c8;
    if (c11El) c11El.textContent = c11;
    if (c12El) c12El.textContent = c12;
    if (c13El) c13El.textContent = c13;
}

// عرض الجدول مع الحفاظ على الألوان
function displayTable(data) {
    let tbody = document.getElementById('statsTableBody');
    if (!tbody) return;
    
    let filteredData = data;
    if (currentColorFilter !== 'all') {
        filteredData = data.filter(item => item.colorCode === currentColorFilter);
    }
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">لا توجد كلمات ملونة للعرض<body>';
        return;
    }
    
    tbody.innerHTML = '';
    for (let i = 0; i < filteredData.length; i++) {
        let item = filteredData[i];
        let row = tbody.insertRow();
        row.className = `bg-${item.colorCode}`;
        
        row.insertCell(0).textContent = i + 1;
        row.insertCell(1).textContent = item.sura;
        row.insertCell(2).textContent = item.ayah;
        row.insertCell(3).textContent = item.page;
        // الكلمة مع ألوانها
        row.insertCell(4).innerHTML = item.wordHtml || item.word;
        row.insertCell(5).innerHTML = `<span style="color:${getColorCode(item.colorCode)}">●</span> ${item.colorCode.toUpperCase()}`;
        row.insertCell(6).textContent = 1;
        row.insertCell(7).textContent = item.coloredLetter;
        
        row.style.cursor = 'pointer';
        row.title = `سورة ${item.sura} آية ${item.ayah} - صفحة ${item.page}`;
        row.onclick = (function(page) {
            return function() {
                window.location.href = `../index.html?page=${page}`;
            };
        })(item.page);
    }
}

// تصدير إلى CSV مع الحفاظ على النص (بدون ألوان HTML)
function exportToCSV() {
    let filteredData = coloredWordsData;
    if (currentColorFilter !== 'all') {
        filteredData = coloredWordsData.filter(item => item.colorCode === currentColorFilter);
    }
    if (filteredData.length === 0) { alert('لا توجد بيانات للتصدير'); return; }
    
    // إزالة HTML tags للتصدير
    let headers = ['#', 'السورة', 'رقم الآية', 'الصفحة', 'الكلمة', 'اللون', 'نوع اللون'];
    let rows = filteredData.map((item, i) => [
        i + 1, 
        item.sura, 
        item.ayah, 
        item.page, 
        item.word,  // النص العادي بدون HTML
        item.colorCode, 
        item.coloredLetter
    ]);
    
    let csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    let blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement('a');
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `stats_${currentFileName.replace('.js', '')}_${new Date().toISOString().slice(0,19)}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
    alert('تم التصدير بنجاح!');
}

function getColorCode(colorCode) {
    const colors = {
        'c1': '#FF0000',
        'c2': '#753701',
        'c3': '#e2d51f',
        'c4': '#ffbb00',
        'c5': '#86cbec',
        'c6': '#062264',
        'c7': '#0B9DF4',
        'c8': '#25FB13',
        'c9': '#0004FF',
        'c10': '#06EED8',
        'c11': '#F98F1F',
        'c12': '#EE1E80',
        'c13': '#CD12E7',
        'c14': '#880D0D',
        'c15': '#1255D6',
        'c16': '#e2d51f',
        'c17': '#602DBA',
        'c18': '#e2d51f',
        'c19': '#e2d51f',
        'c20': '#e2d51f',
        'c21': '#e2d51f',
        'c22': '#e2d51f',
        'c23': '#e2d51f',
        'c24': '#e2d51f',
        'c25': '#e2d51f'
    };
    return colors[colorCode] || '#c9a86b';
}


// تحميل ملف من المسار
async function loadFileFromPath(fileName) {
    try {
        let response = await fetch(`../${fileName}`);
        if (!response.ok) throw new Error('File not found');
        let text = await response.text();
        let data = extractDataFromText(text);
        if (data.length === 0) { alert('لم يتم العثور على بيانات صالحة في هذا الملف'); return false; }
        currentPagesData = buildPagesArray(data);
        let results = await analyzeColoredWords(currentPagesData);
        coloredWordsData = results;
        updateSummaryCards(results);
        displayTable(results);
        alert(`✅ تم تحليل ${results.length} كلمة ملونة`);
        return true;
    } catch(e) {
        alert(`فشل تحميل الملف: ${fileName}`);
        return false;
    }
}

// تحميل ملف من الجهاز
async function loadFileFromDevice(file) {
    let text = await file.text();
    let data = extractDataFromText(text);
    if (data.length === 0) { alert('لم يتم العثور على بيانات صالحة في هذا الملف'); return; }
    currentPagesData = buildPagesArray(data);
    let results = await analyzeColoredWords(currentPagesData);
    coloredWordsData = results;
    updateSummaryCards(results);
    displayTable(results);
    alert(`✅ تم تحليل ${results.length} كلمة ملونة`);
}
// تصدير إلى HTML مع الحفاظ على الألوان
function exportToHTML() {
    let filteredData = coloredWordsData;
    if (currentColorFilter !== 'all') {
        filteredData = coloredWordsData.filter(item => item.colorCode === currentColorFilter);
    }
    if (filteredData.length === 0) { 
        alert('لا توجد بيانات للتصدير'); 
        return; 
    }
    
    let htmlContent = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>إحصاءات الكلمات الملونة</title>
    <style>
        body { 
            font-family: 'Amiri', 'Traditional Arabic', 'NouariAbdelkabir', serif; 
            margin: 20px; 
            background: #f5f0e0;
        }
        h1 { 
            text-align: center; 
            color: #c9a86b; 
            border-bottom: 2px solid #c9a86b;
            padding-bottom: 10px;
        }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin-top: 20px; 
            direction: rtl;
        }
        th, td { 
            border: 1px solid #c9a86b; 
            padding: 10px; 
            text-align: center; 
        }
        th { 
            background: #c9a86b; 
            color: #2e241a; 
            font-weight: bold;
        }
        tr:nth-child(even) { 
            background: #f9f5e8; 
        }
        tr:hover {
            background: #e8ddc0;
        }
        .c1 { color: #FF0000; }
        .c2 { color: #753701; }
        .c3 { color: #e2d51f; }
        .c4 { color: #ffbb00; }
        .c5 { color: #86cbec; }
        .c6 { color: #062264; }
        .c7 { color: #0B9DF4; }
        .c8 { color: #25FB13; }
        .c9 { color: #0004FF; }
        .c10 { color: #06EED8; }
        .c11 { color: #F98F1F; }
        .c12 { color: #EE1E80; }
        .c13 { color: #CD12E7; }
        .c14 { color: #880D0D; }
        .c15 { color: #1255D6; }
        .c17 { color: #602DBA; }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #a8884a;
            font-size: 0.8rem;
        }
    </style>
</head>
<body>
    <h1>📊 إحصاءات الكلمات الملونة</h1>
    <table>
        <thead>
            <tr><th>#</th><th>السورة</th><th>رقم الآية</th><th>الصفحة</th><th>الكلمة</th><th>اللون</th><th>نوع اللون</th></tr>
        </thead>
        <tbody>`;
    
    for (let i = 0; i < filteredData.length; i++) {
        let item = filteredData[i];
        htmlContent += `<tr>
            <td>${i + 1}</td>
            <td>${item.sura}</td>
            <td>${item.ayah}</td>
            <td>${item.page}</td>
            <td>${item.wordHtml || item.word}</td>
            <td><span class="${item.colorCode}">${item.colorCode.toUpperCase()}</span></td>
            <td>${item.coloredLetter}</td>
        </tr>`;
    }
    
    htmlContent += `</tbody>
    </table>
    <div class="footer">
        تم التصدير من تطبيق القراءات العشر | تاريخ: ${new Date().toLocaleDateString('ar')}
    </div>
</body>
</html>`;
    
    let blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    let link = document.createElement('a');
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `stats_colored_words_${new Date().toISOString().slice(0,19)}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('✅ تم التصدير بنجاح! افتح الملف في المتصفح لمشاهدة الألوان');
}

// تصدير إلى Excel باستخدام SheetJS
function exportToExcel() {
    let filteredData = coloredWordsData;
    if (currentColorFilter !== 'all') {
        filteredData = coloredWordsData.filter(item => item.colorCode === currentColorFilter);
    }
    if (filteredData.length === 0) { 
        alert('لا توجد بيانات للتصدير'); 
        return; 
    }
    
    // تحضير البيانات
    let data = [['#', 'السورة', 'رقم الآية', 'الصفحة', 'الكلمة', 'اللون', 'نوع اللون']];
    
    for (let i = 0; i < filteredData.length; i++) {
        let item = filteredData[i];
        data.push([
            i + 1,
            item.sura,
            item.ayah,
            item.page,
            item.word,
            item.colorCode.toUpperCase(),
            item.coloredLetter
        ]);
    }
    
    // إنشاء ورقة عمل
    let ws = XLSX.utils.aoa_to_sheet(data);
    
    // تعيين عرض الأعمدة
    ws['!cols'] = [{wch:5}, {wch:20}, {wch:10}, {wch:8}, {wch:35}, {wch:8}, {wch:20}];
    
    // إنشاء مصنف
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'إحصاءات الكلمات الملونة');
    
    // تصدير
    XLSX.writeFile(wb, `stats_${new Date().toISOString().slice(0,19)}.xlsx`);
    alert('✅ تم التصدير بنجاح!');
}

function bindEvents() {
    document.getElementById('loadFileBtn').onclick = async () => {
        let select = document.getElementById('rawiSelect');
        currentFileName = select.value;
        await loadFileFromPath(currentFileName);
    };
    document.getElementById('selectFileBtn').onclick = () => document.getElementById('fileInput').click();
    document.getElementById('fileInput').onchange = async (e) => { if (e.target.files[0]) await loadFileFromDevice(e.target.files[0]); };
    document.getElementById('exportCsvBtn').onclick = exportToCSV;
    document.getElementById('colorFilterSelect').onchange = (e) => { currentColorFilter = e.target.value; displayTable(coloredWordsData); };
    document.getElementById('copyTableBtn').onclick = copyTableToClipboard;
}

document.addEventListener('DOMContentLoaded', bindEvents);
console.log(typeof XLSX);


// نسخ الجدول إلى الحافظة مع الحفاظ على الألوان
// نسخ الجدول إلى الحافظة مع الحفاظ على تلوين الحروف
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
                <th style="padding: 8px; border: 1px solid #ddd;">#</th>
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
        // استخدام wordHtml للحفاظ على تلوين الحروف
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
    
    tableHtml += `</tbody>~table>`;
    
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

// نسخة نصية عادية للجدول (بديلة)
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