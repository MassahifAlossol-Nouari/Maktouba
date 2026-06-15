// ==================== بيانات المميزات (رقم الصفحة كما هو في PDF) ====================
const featuresData = [
    { id: "bidayah", name: "🌟 البداية", page: 1 },
    { id: "fihris", name: "📑 فهرس بأسماء السور", page: 2 },
    { id: "doaa", name: "🤲 دُعَاءُ خَـتۡـمِ ٱلۡقُرۡ آـــنِ", page: 3 },
    { id: "dhabt", name: "⚙️ ضبط المصحف ودلالات الرموز ", page: 4 },
    { id: "tareef", name: "📖 تعريف ألوان الأصول لجميع المصاحف", page: 7 },
    { id: "osoul", name: "📖 تلخيص لأصول ٱلإمام ", page: 8 }
];

// ==================== قائمة المصاحف ====================
const mushafsList = [
            // نافع المدني
        { name: "رواية قالون (قصر/إسكان)", file: "mushaf_qalun1.js" },
        { name: "رواية قالون (قصر/صلة)", file: "mushaf_qalun2.js" },
        { name: "رواية قالون (توسط/إسكان)", file: "mushaf_qalun3.js" },
        { name: "رواية قالون (توسط/صلة)", file: "mushaf_qalun4.js" },
        { name: "رواية ورش (قصر البدل/فتح)", file: "mushaf_warsh1.js" },
        { name: "رواية ورش (توسط البدل/تقليل)", file: "mushaf_warsh2.js" },
        { name: "رواية ورش (إشباع البدل/الفتح)", file: "mushaf_warsh3.js" },
        { name: "رواية ورش (إشباع البدل/تقليل)", file: "mushaf_warsh4.js" },
        { name: "رواية ورش (طريق الأصبهاني)", file: "mushaf_warsh5.js" },
        
        // ابن كثير المكي
        { name: "رواية البزي", file: "mushaf_bazzi.js" },
        { name: "رواية قنبل", file: "mushaf_qunbul.js" },
        
        // أبو عمرو البصري
        { name: "رواية الدوري (توسط المنفصل)", file: "mushaf_doori.js" },
        { name: "رواية الدوري (قصر المنفصل)", file: "mushaf_doori1.js" },
        { name: "رواية السوسي", file: "mushaf_soosi.js" },
        
        // ابن عامر الشامي
        { name: "رواية هشام", file: "mushaf_hisham.js" },
        { name: "رواية ابن ذكوان", file: "mushaf_ibnDhakwan.js" },
        
        // عاصم الكوفي
        { name: "رواية حفص", file: "mushaf_hafs.js" },
        { name: "رواية شعبة", file: "mushaf_shubah.js" },
        
        // حمزة الكوفي
        { name: "رواية خلف (بالسكت على ال وشيء)", file: "mushaf_khalaf1.js" },
        { name: "رواية خلف (بالسكت على ال وشيء والمفصول)", file: "mushaf_khalaf2.js" },
        { name: "رواية خلاد (بالسكت على ال وشيء)", file: "mushaf_khallad1.js" },
        { name: "رواية خلاد (بلا سكت)", file: "mushaf_khallad2.js" },
        
        // الكسائي الكوفي
        { name: "رواية أبو الحارث", file: "mushaf_abuHarith.js" },
        { name: "رواية الدوري كسائي", file: "mushaf_doori_kisai.js" },
        
        // أبو جعفر المدني
        { name: "رواية ابن وردان", file: "mushaf_ibnWardan.js" },
        { name: "رواية ابن جماز", file: "mushaf_ibnJammaz.js" },
        
        // يعقوب الحضرمي
        { name: "رواية رويس", file: "mushaf_ruways.js" },
        { name: "رواية روح", file: "mushaf_ruh.js" },
        
        // خلف العاشر
        { name: "رواية إسحاق", file: "mushaf_ishaq.js" },
        { name: "رواية إدريس", file: "mushaf_idris.js" }
    ];
 

// ==================== المتغيرات العامة ====================
let currentMushafFile = null;
let currentPage = 1;
let currentFeatureId = null;


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
        btn.onclick = () => selectMushaf(mushaf.file, mushaf.name);
        grid.appendChild(btn);
    });
    
    select.onchange = (e) => {
        if (e.target.value) {
            const selected = mushafsList.find(m => m.file === e.target.value);
            if (selected) selectMushaf(selected.file, selected.name);
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
        option.textContent = `${feature.name}`;
        select.appendChild(option);
        
        const btn = document.createElement('button');
        btn.className = 'feature-btn';
        btn.textContent = `${feature.name}`;
        btn.onclick = () => {
            currentPage = feature.page;
            currentFeatureId = feature.id;
            updatePageDisplay();
            loadPdfPage(currentPage);
        };
        container.appendChild(btn);
    });
    
    select.onchange = (e) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page)) {
            currentPage = page;
            const feature = featuresData.find(f => f.page === page);
            currentFeatureId = feature ? feature.id : null;
            updatePageDisplay();
            loadPdfPage(currentPage);
        }
    };
}

// ==================== اختيار مصحف ====================
function selectMushaf(file, name) {
    currentMushafFile = file.replace('.js', '');
    localStorage.setItem('selectedMushaf', currentMushafFile);
    
    const select = document.getElementById('mushafSelect');
    if (select) select.value = file;
    
    currentPage = 1;
    currentFeatureId = "bidayah";
    updatePageDisplay();
    loadPdfPage(currentPage);
}

// ==================== تحميل صفحة PDF ====================
function loadPdfPage(page) {
    if (!currentMushafFile) {
        alert('الرجاء اختيار مصحف أولاً');
        return;
    }
    // إضافة #toolbar=0 و navpanes=0 لإخفاء شريط الأدوات
    const pdfPath = `../mushaf-pdfs/${currentMushafFile}.pdf#toolbar=0&navpanes=0&scrollbar=0&page=${page}`;
    const iframe = document.getElementById('pdfFrame');
    if (iframe) iframe.src = pdfPath;
}

// ==================== التنقل بين الصفحات ====================
function nextPage() {
    if (!currentMushafFile) return;
    currentPage++;
    updatePageDisplay();
    loadPdfPage(currentPage);
}

function prevPage() {
    if (!currentMushafFile || currentPage <= 1) return;
    currentPage--;
    updatePageDisplay();
    loadPdfPage(currentPage);
}

function updatePageDisplay() {
    const desktopSpan = document.getElementById('pageNumberDisplay');
    const mobileSpan = document.getElementById('mobilePageNumber');
    const pageText = `صفحة ${currentPage}`;
    if (desktopSpan) desktopSpan.textContent = pageText;
    if (mobileSpan) mobileSpan.textContent = currentPage.toString();
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
                selectMushaf(mushaf.file, mushaf.name);
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
            item.textContent = `${feature.name}`;
            item.onclick = () => {
                currentPage = feature.page;
                currentFeatureId = feature.id;
                updatePageDisplay();
                loadPdfPage(currentPage);
                closeMobileDropdowns();
            };
            featuresContainer.appendChild(item);
        });
    }
}

function toggleMobileDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    const otherId = dropdownId === 'mobileMushafDropdown' ? 'mobileFeaturesDropdown' : 'mobileMushafDropdown';
    const other = document.getElementById(otherId);
    if (other) other.classList.remove('show');
    
    dropdown.classList.toggle('show');
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
    
    if (mushafBtn) {
        mushafBtn.onclick = (e) => {
            e.stopPropagation();
            toggleMobileDropdown('mobileMushafDropdown');
        };
    }
    
    if (featuresBtn) {
        featuresBtn.onclick = (e) => {
            e.stopPropagation();
            toggleMobileDropdown('mobileFeaturesDropdown');
        };
    }
    
    if (mobilePrev) {
        mobilePrev.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                updatePageDisplay();
                loadPdfPage(currentPage);
            }
        };
    }
    
    if (mobileNext) {
        mobileNext.onclick = () => {
            currentPage++;
            updatePageDisplay();
            loadPdfPage(currentPage);
        };
    }
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-dropdown-btn')) {
            closeMobileDropdowns();
        }
    });
}

// ==================== العودة إلى الرئيسية ====================
function backToQuran() {
    window.location.href = '../index.html';
}

// ==================== الوضع الليلي ====================
function applyDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// ==================== حفظ آخر مصحف ====================
function loadLastSelectedMushaf() {
    const saved = localStorage.getItem('selectedMushaf');
    if (saved) {
        const matching = mushafsList.find(m => m.file.replace('.js', '') === saved);
        if (matching) {
            selectMushaf(matching.file, matching.name);
        }
    }
}

// ==================== ربط الأحداث العامة ====================
function bindEvents() {
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const backBtn = document.getElementById('backToQuran');
    
    if (prevBtn) prevBtn.onclick = prevPage;
    if (nextBtn) nextBtn.onclick = nextPage;
    if (backBtn) backBtn.onclick = backToQuran;
}

// ==================== التهيئة ====================
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

