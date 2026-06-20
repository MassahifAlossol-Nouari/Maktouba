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
    { name: "رواية قالون", file: "mushaf_qalun1.pdf" },
    { name: "رواية ورش", file: "mushaf_warsh1.pdf" },
    { name: "رواية ورش (طريق الأصبهاني)", file: "mushaf_warsh5.pdf" },
    { name: "رواية البزي", file: "mushaf_bazzi.pdf" },
    { name: "رواية قنبل", file: "mushaf_qunbul.pdf" },
    { name: "رواية الدوري", file: "mushaf_doori.pdf" },
    { name: "رواية السوسي", file: "mushaf_soosi.pdf" },
    { name: "رواية هشام", file: "mushaf_hisham.pdf" },
    { name: "رواية ابن ذكوان", file: "mushaf_ibnDhakwan.pdf" },
    { name: "رواية حفص", file: "mushaf_hafs.pdf" },
    { name: "رواية شعبة", file: "mushaf_shubah.pdf" },
    { name: "رواية خلف", file: "mushaf_khalaf1.pdf" },
    { name: "رواية خلاد", file: "mushaf_khallad1.pdf" },
    { name: "رواية أبو الحارث", file: "mushaf_abuHarith.pdf" },
    { name: "رواية الدوري كسائي", file: "mushaf_doori_kisai.pdf" },
    { name: "رواية ابن وردان", file: "mushaf_ibnWardan.pdf" },
    { name: "رواية ابن جماز", file: "mushaf_ibnJammaz.pdf" },
    { name: "رواية رويس", file: "mushaf_ruways.pdf" },
    { name: "رواية روح", file: "mushaf_ruh.pdf" },
    { name: "رواية إسحاق", file: "mushaf_ishaq.pdf" },
    { name: "رواية إدريس", file: "mushaf_idris.pdf" }
];

// ==================== المتغيرات العامة ====================
let currentMushafFile = null;
let currentPage = 1;
let currentFeatureId = null;

// ==================== دالة تحميل وعرض PDF باستخدام blob URL ====================
window.loadPdfPage = function(page) {
    if (!currentMushafFile) {
        alert('⚠️ الرجاء اختيار مصحف أولاً');
        return;
    }
    
    currentPage = page || 1;
    const iframe = document.getElementById('pdfFrame');
    const loading = document.getElementById('pdfLoading');
    
    if (!iframe) return;
    
    // إظهار رسالة التحميل وإخفاء iframe
    if (loading) loading.style.display = 'flex';
    iframe.style.display = 'none';
    
    const pdfPath = `./features-pdfs/${currentMushafFile}`;
    console.log(`📄 جاري تحميل: ${pdfPath}`);
    
    // تحميل الملف كـ blob
    fetch(pdfPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('الملف غير موجود');
            }
            return response.blob();
        })
        .then(blob => {
            // إنشاء رابط مؤقت (blob URL)
            const blobUrl = URL.createObjectURL(blob);
            
            // وضع الرابط في iframe
            iframe.src = blobUrl;
            iframe.style.display = 'block';
            if (loading) loading.style.display = 'none';
            
            console.log(`✅ تم تحميل PDF: ${pdfPath}`);
            
            // تنظيف الرابط بعد التحميل (اختياري)
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 60000);
        })
        .catch(err => {
            console.error('❌ خطأ في تحميل PDF:', err);
            if (loading) {
                loading.style.display = 'flex';
                loading.innerHTML = `
                    ❌ لا يمكن تحميل الملف.
                    <br>
                    <small style="color:var(--text-light); font-size:0.8rem;">${pdfPath}</small>
                    <br>
                    <small style="color:var(--text-light); font-size:0.8rem;">تأكد من وجود الملف في المجلد الصحيح</small>
                `;
            }
        });
    
    updatePageDisplay();
};

// ==================== دوال التنقل ====================
window.nextPage = function() {
    if (!currentMushafFile) return;
    currentPage++;
    window.loadPdfPage(currentPage);
};

window.prevPage = function() {
    if (!currentMushafFile || currentPage <= 1) return;
    currentPage--;
    window.loadPdfPage(currentPage);
};

// ==================== دوال الاختيار ====================
window.selectMushaf = function(file) {
    currentMushafFile = file;
    localStorage.setItem('selectedMushaf', currentMushafFile);
    const select = document.getElementById('mushafSelect');
    if (select) select.value = file;
    currentPage = 1;
    currentFeatureId = "bidayah";
    window.loadPdfPage(currentPage);
};

window.selectFeature = function(page, featureId) {
    currentPage = page;
    currentFeatureId = featureId;
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
        btn.onclick = () => window.selectMushaf(mushaf.file);
        grid.appendChild(btn);
    });
    
    select.onchange = (e) => {
        if (e.target.value) {
            window.selectMushaf(e.target.value);
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
                window.selectMushaf(mushaf.file);
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
        mushafBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileDropdown('mobileMushafDropdown');
        });
    }
    
    if (featuresBtn) {
        featuresBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileDropdown('mobileFeaturesDropdown');
        });
    }
    
    if (mobilePrev) {
        mobilePrev.addEventListener('click', function(e) {
            e.preventDefault();
            window.prevPage();
        });
    }
    
    if (mobileNext) {
        mobileNext.addEventListener('click', function(e) {
            e.preventDefault();
            window.nextPage();
        });
    }
    
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
        window.selectMushaf(saved);
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

// ==================== التهيئة ====================
function init() {
    buildMushafsList();
    buildFeaturesList();
    buildMobileDropdowns();
    bindEvents();
    bindMobileEvents();
    loadLastSelectedMushaf();
    applyDarkMode();
    console.log("✅ تم تحميل features.js بنجاح");
}

init();