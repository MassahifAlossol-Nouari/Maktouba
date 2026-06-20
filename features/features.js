// ==================== بيانات المميزات ====================
const featuresData = [
    { id: "bidayah", name: "🌟 البداية", page: 1 },
    { id: "fihris", name: "📑 فهرس بأسماء السور", page: 2 },
    { id: "doaa", name: "🤲 دُعَاءُ خَـتۡـمِ ٱلۡقُرۡ آـــنِ", page: 3 },
    { id: "dhabt", name: "⚙️ ضبط المصحف ودلالات الرموز", page: 4 },
    { id: "tareef", name: "📖 تعريف ألوان الأصول لجميع المصاحف", page: 7 },
    { id: "osoul", name: "📖 تلخيص لأصول الإمام", page: 8 }
];

// ==================== قائمة المصاحف ====================
const mushafsList = [
    { name: "رواية قالون", file: "mushaf_qalun1.js" },
    { name: "رواية ورش", file: "mushaf_warsh1.js" },
    { name: "رواية ورش (طريق الأصبهاني)", file: "mushaf_warsh5.js" },
    { name: "رواية البزي", file: "mushaf_bazzi.js" },
    { name: "رواية قنبل", file: "mushaf_qunbul.js" },
    { name: "رواية الدوري", file: "mushaf_doori.js" },
    { name: "رواية السوسي", file: "mushaf_soosi.js" },
    { name: "رواية هشام", file: "mushaf_hisham.js" },
    { name: "رواية ابن ذكوان", file: "mushaf_ibnDhakwan.js" },
    { name: "رواية حفص", file: "mushaf_hafs.js" },
    { name: "رواية شعبة", file: "mushaf_shubah.js" },
    { name: "رواية خلف", file: "mushaf_khalaf1.js" },
    { name: "رواية خلاد", file: "mushaf_khallad1.js" },
    { name: "رواية أبو الحارث", file: "mushaf_abuHarith.js" },
    { name: "رواية الدوري كسائي", file: "mushaf_doori_kisai.js" },
    { name: "رواية ابن وردان", file: "mushaf_ibnWardan.js" },
    { name: "رواية ابن جماز", file: "mushaf_ibnJammaz.js" },
    { name: "رواية رويس", file: "mushaf_ruways.js" },
    { name: "رواية روح", file: "mushaf_ruh.js" },
    { name: "رواية إسحاق", file: "mushaf_ishaq.js" },
    { name: "رواية إدريس", file: "mushaf_idris.js" }
];

// ==================== المتغيرات العامة ====================
let currentMushafFile = null;
let currentPage = 1;
let currentFeatureId = null;


// ==================== تعريف الدوال قبل أي شيء (لضمان عملها) ====================

window.loadPdfPage = function(page) {
    if (!currentMushafFile) {
        alert('⚠️ الرجاء اختيار مصحف أولاً');
        return;
    }
    
    const object = document.getElementById('pdfFrame');
    if (!object) return;
    
    const pdfPath = `./features-pdfs/${currentMushafFile}.pdf#toolbar=0&navpanes=0&page=${page}`;
    
    // إفراغ الكائن أولاً
    object.data = '';
    
    // ثم تعيين المسار الجديد بعد تأخير
    setTimeout(() => {
        object.data = pdfPath;
        console.log("✅ تحميل PDF:", pdfPath);
    }, 150);
};


window.nextPage = function() {
    if (!currentMushafFile) return;
    currentPage++;
    updatePageDisplay();
    window.loadPdfPage(currentPage);
};

window.prevPage = function() {
    if (!currentMushafFile || currentPage <= 1) return;
    currentPage--;
    updatePageDisplay();
    window.loadPdfPage(currentPage);
};

window.selectMushaf = function(file, name) {
    currentMushafFile = file.replace('.js', '');
    localStorage.setItem('selectedMushaf', currentMushafFile);
    const select = document.getElementById('mushafSelect');
    if (select) select.value = file;
    currentPage = 1;
    currentFeatureId = "bidayah";
    updatePageDisplay();
    window.loadPdfPage(currentPage);
};

window.selectFeature = function(page, featureId) {
    currentPage = page;
    currentFeatureId = featureId;
    updatePageDisplay();
    window.loadPdfPage(currentPage);
};

function updatePageDisplay() {
    const desktopSpan = document.getElementById('pageNumberDisplay');
    const mobileSpan = document.getElementById('mobilePageNumber');
    const pageText = `صفحة ${currentPage}`;
    if (desktopSpan) desktopSpan.textContent = pageText;
    if (mobileSpan) mobileSpan.textContent = currentPage.toString();
}

// ==================== بناء واجهة الحاسوب ====================
function buildMushafsList() {
    const select = document.getElementById('mushafSelect');
    const grid = document.getElementById('mushafsGrid');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- اختر المصحف --</option>';
    grid.innerHTML = '';
    
    mushafsList.forEach(mushaf => {
        const option = document.createElement('option');
        option.value = mushaf.file;
        option.textContent = mushaf.name;
        select.appendChild(option);
        
        const btn = document.createElement('button');
        btn.className = 'mushaf-btn';
        btn.textContent = mushaf.name;
        btn.onclick = () => window.selectMushaf(mushaf.file, mushaf.name);
        grid.appendChild(btn);
    });
    
    select.onchange = (e) => {
        if (e.target.value) {
            const selected = mushafsList.find(m => m.file === e.target.value);
            if (selected) window.selectMushaf(selected.file, selected.name);
        }
    };
}

function buildFeaturesList() {
    const select = document.getElementById('featuresSelect');
    const container = document.getElementById('featuresList');
    if (!container) return;
    
    select.innerHTML = '';
    container.innerHTML = '';
    
    featuresData.forEach(feature => {
        const option = document.createElement('option');
        option.value = feature.page;
        option.textContent = feature.name;
        select.appendChild(option);
        
        const btn = document.createElement('button');
        btn.className = 'feature-btn';
        btn.textContent = feature.name;
        btn.onclick = () => window.selectFeature(feature.page, feature.id);
        container.appendChild(btn);
    });
    
    select.onchange = (e) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page)) {
            const feature = featuresData.find(f => f.page === page);
            window.selectFeature(page, feature ? feature.id : null);
        }
    };
}

// ==================== دوال الهاتف ====================
function buildMobileDropdowns() {
    const mushafContainer = document.getElementById('mobileMushafDropdown');
    if (mushafContainer) {
        mushafContainer.innerHTML = '';
        mushafsList.forEach(mushaf => {
            const item = document.createElement('div');
            item.className = 'mobile-dropdown-item';
            item.textContent = mushaf.name;
            item.onclick = () => {
                window.selectMushaf(mushaf.file, mushaf.name);
                closeMobileDropdowns();
            };
            mushafContainer.appendChild(item);
        });
    }
    
    const featuresContainer = document.getElementById('mobileFeaturesDropdown');
    if (featuresContainer) {
        featuresContainer.innerHTML = '';
        featuresData.forEach(feature => {
            const item = document.createElement('div');
            item.className = 'mobile-dropdown-item';
            item.textContent = feature.name;
            item.onclick = () => {
                window.selectFeature(feature.page, feature.id);
                closeMobileDropdowns();
            };
            featuresContainer.appendChild(item);
        });
    }
}

function toggleMobileDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.error("❌ القائمة غير موجودة:", dropdownId);
        return;
    }
    
    // إغلاق القائمة الأخرى
    const otherId = dropdownId === 'mobileMushafDropdown' ? 'mobileFeaturesDropdown' : 'mobileMushafDropdown';
    const other = document.getElementById(otherId);
    if (other) other.classList.remove('show');
    
    // تبديل القائمة الحالية
    dropdown.classList.toggle('show');
    console.log("📱 حالة القائمة:", dropdownId, dropdown.classList.contains('show') ? "مفتوحة" : "مغلقة");
}

function closeMobileDropdowns() {
    const mushaf = document.getElementById('mobileMushafDropdown');
    const features = document.getElementById('mobileFeaturesDropdown');
    if (mushaf) mushaf.classList.remove('show');
    if (features) features.classList.remove('show');
}

function bindMobileEvents() {
    const mushafBtn = document.getElementById('mobileMushafBtn');
    const featuresBtn = document.getElementById('mobileFeaturesBtn');
    const mobilePrev = document.getElementById('mobilePrevBtn');
    const mobileNext = document.getElementById('mobileNextBtn');
    
    // استخدام click بدلاً من touchstart للتوافق مع جميع الأجهزة
    if (mushafBtn) {
        mushafBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMobileDropdown('mobileMushafDropdown');
            console.log("📚 زر المصاحف تم الضغط عليه"); // للتأكد من عمل الزر
        });
    }
    
    if (featuresBtn) {
        featuresBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMobileDropdown('mobileFeaturesDropdown');
            console.log("📋 زر المميزات تم الضغط عليه"); // للتأكد من عمل الزر
        });
    }
    
    if (mobilePrev) {
        mobilePrev.addEventListener('click', function(e) {
            e.preventDefault();
            window.prevPage();
            console.log("⏪ تم الضغط على السابق");
        });
    }
    
    if (mobileNext) {
        mobileNext.addEventListener('click', function(e) {
            e.preventDefault();
            window.nextPage();
            console.log("⏩ تم الضغط على التالي");
        });
    }
    
    // إغلاق القوائم عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-dropdown-btn') && !e.target.closest('.mobile-dropdown-list')) {
            closeMobileDropdowns();
        }
    });
}

function backToQuran() {
    window.location.href = '../index.html';
}

function applyDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

function loadLastSelectedMushaf() {
    const saved = localStorage.getItem('selectedMushaf');
    if (saved) {
        const matching = mushafsList.find(m => m.file.replace('.js', '') === saved);
        if (matching) window.selectMushaf(matching.file, matching.name);
    }
}

function bindEvents() {
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const backBtn = document.getElementById('backToQuran');
    if (prevBtn) prevBtn.onclick = () => window.prevPage();
    if (nextBtn) nextBtn.onclick = () => window.nextPage();
    if (backBtn) backBtn.onclick = backToQuran;
}

function init() {
    buildMushafsList();
    buildFeaturesList();
    buildMobileDropdowns();
    bindEvents();
    bindMobileEvents();
    loadLastSelectedMushaf();
    applyDarkMode();
}

init();

console.log("✅ تم تحميل features.js بنجاح");