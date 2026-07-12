/**
 * al-usul.js
 * صفحة الأصول الموحدة - قائمة الأبواب + الجدول + الملاحظات + الاستثناءات
 */

// ============================
// 1. البيانات
// ============================

const BAB_FILES = [
    { id: 1, file: 'bab-001.json', title: 'التعريف بالطرق والرواة', class: 'c6' },
    { id: 2, file: 'bab-002.json', title: 'البسملة بين السورتين', class: 'c5' },
    { id: 4, file: 'bab-004.json', title: 'ميم الجمع', class: 'c12' },
    { id: 5, file: 'bab-005.json', title: 'الإدغام الكبير (المتماثلين)', class: 'c3' },
    { id: 6, file: 'bab-006.json', title: 'الإدغام الكبير (المتقاربين)', class: 'c3' },
    { id: 7, file: 'bab-007.json', title: 'هاء الكناية', class: 'c18' },
    { id: 8, file: 'bab-008.json', title: 'المد والقصر', class: 'c6' },
    { id: 9, file: 'bab-009.json', title: 'الهمزتين من كلمة', class: 'c25' },
    { id: 9.1, file: 'bab-0091.json', title: 'الاستفهام المكرر', class: 'c25' },
    { id: 10, file: 'bab-010.json', title: 'الهمزتين من كلمتين', class: 'c25' },
    { id: 11, file: 'bab-011.json', title: 'الهمز المفرد (الساكن)', class: 'c7' },
    { id: 12, file: 'bab-012.json', title: 'الهمز المفرد (المتحرك)', class: 'c7' },
    { id: 13, file: 'bab-013.json', title: 'النقل والسكت', class: 'c9' },
    { id: 14, file: 'bab-014.json', title: 'وقف حمزة وهشام على الهمز المتطرف', class: 'c19' },
    { id: 15, file: 'bab-015.json', title: 'وقف حمزة على الهمز المتوسط', class: 'c19' },
    { id: 16, file: 'bab-016.json', title: 'الإدغام الصغير', class: 'c15' },
    { id: 17, file: 'bab-017.json', title: 'حروف قربت مخارجها', class: 'c15' },
    { id: 18, file: 'bab-018.json', title: 'أحكام النون الساكنة والتنوين', class: 'c15' },
    { id: 19, file: 'bab-019.json', title: 'الفتح والإمالة', class: 'c4' },
    { id: 20, file: 'bab-020.json', title: 'مذهب الكسائي في إمالة هاء التأنيث', class: 'c4' },
    { id: 21, file: 'bab-021.json', title: 'مذاهبهم في الراءات', class: 'c11' },
    { id: 22, file: 'bab-022.json', title: 'اللامات', class: 'c8' },
    { id: 23, file: 'bab-023.json', title: 'الوقف على أواخر الكلم', class: 'c21' },
    { id: 24, file: 'bab-024.json', title: 'الوقف على مرسوم الخط', class: 'c21' },
    { id: 25, file: 'bab-025.json', title: 'مذاهبهم في ياءات الإضافة', class: 'c14' },
    { id: 26, file: 'bab-026.json', title: 'ياءات الزوائد', class: 'c24' },
    { id: 27, file: 'bab-027.json', title: 'التكبير', class: 'c23' },
    { id: 28, file: 'bab-028.json', title: 'الألفات السبع', class: 'c1' },
    { id: 29, file: 'bab-029.json', title: 'مواضع الإختلاس', class: 'c20' },
    { id: 30, file: 'bab-030.json', title: 'مواضع الإشمام', class: 'c20' },
    { id: 31, file: 'bab-031.json', title: 'تحريك الحرف الساكن', class: 'c16' },
    { id: 32, file: 'bab-032.json', title: 'فرش الحروف', class: 'c1' }
];

const RUWAT_NAMES = [
    'قالون', 'ورش', 'البزي', 'قنبل', 'الدوري', 'السوسي',
    'هشام', 'ابن ذكوان', 'شعبة', 'حفص', 'خلف', 'خلاد',
    'أبو الحارث', 'دوري كسائي', 'ابن وردان', 'ابن جماز',
    'رويس', 'روح', 'إسحق', 'إدريس'
];

// ============================
// 2. المتغيرات
// ============================

let currentBabData = null;
let selectedBabId = null;
let selectedRawi = RUWAT_NAMES[0];
let allBabData = {};

// ============================
// 3. دالة تحديد لون الكلاس
// ============================

function getColorClass(value) {
    if (!value || value === '-') return '';
    const v = value.toLowerCase();
    if (v.includes('إثبات') || v.includes('اثبات')) return 'c1';
    if (v.includes('سكت') || v.includes('السكت')) return 'c2';
    if (v.includes('وصل')) return 'c3';
    if (v.includes('إسكان') || v.includes('اسكان')) return 'c4';
    if (v.includes('صلة')) return 'c5';
    if (v.includes('ضم')) return 'c6';
    if (v.includes('كسر')) return 'c7';
    if (v.includes('تفخيم')) return 'c8';
    if (v.includes('ترقيق')) return 'c9';
    if (v.includes('إمالة')) return 'c10';
    if (v.includes('تقليل')) return 'c11';
    return '';
}

// ============================
// دالة لدمج الخلايا المتشابهة في الأعمدة
// ============================
function mergeCells(rows, columnName) {
    if (!rows || rows.length === 0) return rows;
    
    const mergedRows = [];
    let i = 0;
    
    while (i < rows.length) {
        let j = i + 1;
        // البحث عن الصفوف المتشابهة في العمود المحدد
        while (j < rows.length && rows[j][columnName] === rows[i][columnName]) {
            j++;
        }
        
        // إذا كان هناك أكثر من صف متشابه، ندمجهم
        if (j - i > 1) {
            const mergedRow = { ...rows[i] };
            mergedRow._rowspan = j - i; // عدد الصفوف المدمجة
            mergedRow._merged = true;
            mergedRows.push(mergedRow);
        } else {
            // إذا كان الصف فردياً، نضيفه كما هو
            mergedRows.push({ ...rows[i], _rowspan: 1, _merged: false });
        }
        
        i = j;
    }
    
    return mergedRows;
}
// ============================
// دالة عرض الجدول
// ============================
function renderTableForRawi(rawiName) {
    const wrapper = document.getElementById('tableWrapper');
    const notesContainer = document.getElementById('notesContainer');
    const exceptionsContainer = document.getElementById('exceptionsContainer');
    
    if (!wrapper) return;

    if (!currentBabData || !currentBabData.rows || currentBabData.rows.length === 0) {
        wrapper.innerHTML = '<div class="empty-state">📭 لا توجد بيانات لهذا الباب</div>';
        document.getElementById('generalNotes').style.display = 'none';
        document.getElementById('exceptionsSection').style.display = 'none';
        resetRawiStates();
        return;
    }

    // ============================
    // 1. التحقق من وجود الأعمدة
    // ============================
    const hasCase2 = currentBabData.has_case2 || false;
    const hasExample = currentBabData.has_example || false;

    // ============================
    // 2. تسمية الأعمدة
    // ============================
    const colNames = {
        case1: currentBabData.columnNames?.case1 || 'الحالة',
        case2: currentBabData.columnNames?.case2 || 'الحالة 2',
        example: currentBabData.columnNames?.example || 'المثال',
        rule: currentBabData.columnNames?.rule || 'الحكم'
    };

    // ============================
    // 3. حساب الرواة النشطين
    // ============================
    const activeRuwat = new Set();
    const rawiRules = {};

    currentBabData.rows.forEach(row => {
        if (row.ruwat) {
            Object.keys(row.ruwat).forEach(name => {
                const rule = row.ruwat[name];
                if (rule && rule !== '-') {
                    activeRuwat.add(name);
                    if (!rawiRules[name]) rawiRules[name] = [];
                    rawiRules[name].push(rule);
                }
            });
        }
    });

    // ============================
    // ============================
    // 4. تجميع الرواة حسب الاتفاق (جميع الصفوف)
    // ============================
    const agreementGroups = {};
    const processed = new Set();
    const activeList = Array.from(activeRuwat);

    // مقارنة كل راوٍ مع الآخر
    for (let i = 0; i < activeList.length; i++) {
        const name1 = activeList[i];
        if (processed.has(name1)) continue;
        
        const group = [name1];
        
        // جمع أحكام الراوي الأول
        const rules1 = currentBabData.rows.map(row => {
            return row.ruwat && row.ruwat[name1] ? row.ruwat[name1] : '-';
        });
        
        // مقارنة مع باقي الرواة
        for (let j = i + 1; j < activeList.length; j++) {
            const name2 = activeList[j];
            if (processed.has(name2)) continue;
            
            // جمع أحكام الراوي الثاني
            const rules2 = currentBabData.rows.map(row => {
                return row.ruwat && row.ruwat[name2] ? row.ruwat[name2] : '-';
            });
            
            // مقارنة جميع الصفوف
            let isFullyAgreed = true;
            
            // إذا كان عدد الصفوف مختلفاً، فهما غير متفقين
            if (rules1.length !== rules2.length) {
                isFullyAgreed = false;
            } else {
                // مقارنة كل صف على حدة
                for (let k = 0; k < rules1.length; k++) {
                    if (rules1[k] !== rules2[k]) {
                        isFullyAgreed = false;
                        break;
                    }
                }
            }
            
            // إذا كانا متفقين، نضيف الراوي الثاني إلى المجموعة
            if (isFullyAgreed) {
                group.push(name2);
                processed.add(name2);
            }
        }
        
        // إذا كانت المجموعة تحتوي على أكثر من راوٍ، نضيفها إلى مجموعات الاتفاق
        if (group.length > 1) {
            const key = group.sort().join('|');
            agreementGroups[key] = group;
        }
        
        processed.add(name1);
    }

    // ============================
    // 5. تلوين الرواة
    // ============================
    const groupColors = [
        '#E74C3C', // أحمر قوي
        '#2ECC71', // أخضر زمردي
        '#3498DB', // أزرق سماوي
        '#F1C40F', // أصفر ذهبي
        '#9B59B6', // بنفسجي
        '#1ABC9C', // فيروزي
        '#E67E22', // برتقالي
        '#2C3E50', // أزرق داكن
        '#E84393', // وردي فاقع
        '#00B894', // أخضر مائي
        '#6C5CE7', // بنفسجي نيلي
        '#FDCB6E', // أصفر فاتح
        '#00CEC9', // فيروزي غامق
        '#D63031', // أحمر قرميدي
        '#0984E3', // أزرق ملكي
        '#F368E0', // وردي ساطع
        '#00B894', // أخضر زمردي غامق
        '#FF7675', // أحمر وردي
        '#74B9FF', // أزرق فاتح
        '#55EFC4'  // أخضر نيون
    ];

    const rawiColorMap = {};
    let colorIndex = 0;
    Object.values(agreementGroups).forEach(group => {
        const color = groupColors[colorIndex % groupColors.length];
        group.forEach(name => { rawiColorMap[name] = color; });
        colorIndex++;
    });

    // ============================
    // ============================
    // 6. تحديث واجهة الرواة
    // ============================
    // إزالة جميع الأيقونات القديمة أولاً
    document.querySelectorAll('.rawi-item .agreement-icon').forEach(icon => icon.remove());
    document.querySelectorAll('.rawi-item').forEach(el => el.removeAttribute('title'));

    // ثم إعادة بناء الأيقونات من جديد
    document.querySelectorAll('.rawi-item').forEach(el => {
        const name = el.dataset.rawi;
        if (activeRuwat.has(name)) {
            el.classList.remove('disabled');
            el.style.opacity = '1';
            el.style.cursor = 'pointer';
            el.style.pointerEvents = 'auto';
            const color = rawiColorMap[name];
            if (color) {
                el.style.borderColor = color;
                el.style.borderWidth = '2px';
                el.style.borderStyle = 'solid';
                
                const rawiOrder = ['قالون', 'ورش', 'البزي', 'قنبل', 'الدوري', 'السوسي', 
                                'هشام', 'ابن ذكوان', 'شعبة', 'حفص', 'خلف', 'خلاد', 
                                'أبو الحارث', 'الدوري2', 'ابن وردان', 'ابن جماز', 
                                'رويس', 'روح', 'إسحق', 'إدريس'];
                
                let groupMembers = [];
                Object.values(agreementGroups).forEach(group => {
                    if (group.includes(name)) {
                        groupMembers = group.filter(n => n !== name)
                                            .sort((a, b) => rawiOrder.indexOf(a) - rawiOrder.indexOf(b));
                    }
                });
                
                if (groupMembers.length > 0) {
                    el.setAttribute('title', `متفق مع: ${groupMembers.join(', ')}`);
                    if (!el.querySelector('.agreement-icon')) {
                        const icon = document.createElement('span');
                        icon.className = 'agreement-icon';
                        icon.textContent = '';
                        el.appendChild(icon);
                    }
                } else {
                    el.removeAttribute('title');
                    const icon = el.querySelector('.agreement-icon');
                    if (icon) icon.remove();
                }
            } else {
                el.style.borderColor = 'transparent';
                el.removeAttribute('title');
                const icon = el.querySelector('.agreement-icon');
                if (icon) icon.remove();
            }
        } else {
            el.classList.add('disabled');
            el.style.opacity = '0.4';
            el.style.cursor = 'not-allowed';
            el.style.pointerEvents = 'none';
            el.style.borderColor = 'transparent';
            el.classList.remove('active');
            el.removeAttribute('title');
            const icon = el.querySelector('.agreement-icon');
            if (icon) icon.remove();
        }
    });

    if (activeRuwat.size === 0) {
        wrapper.innerHTML = '<div class="empty-state">📭 لا توجد أحكام في هذا الباب لأي راوٍ</div>';
        document.getElementById('generalNotes').style.display = 'none';
        document.getElementById('exceptionsSection').style.display = 'none';
        disableAllRawi();
        return;
    }

    if (!activeRuwat.has(rawiName)) {
        const firstActive = activeRuwat.values().next().value;
        if (firstActive) selectedRawi = firstActive;
    }

    // ============================
    // 7. بناء رأس الجدول
    // ============================
    let headerHtml = `<tr><th>${colNames.case1}</th>`;
    if (hasCase2) headerHtml += `<th>${colNames.case2}</th>`;
    if (hasExample) headerHtml += `<th>${colNames.example}</th>`;
    headerHtml += `<th>${colNames.rule}</th></tr>`;

   // ============================
    // 8. بناء صفوف الجدول
    // ============================
    // ============================
    // 8. بناء صفوف الجدول (مع منطق التنبيهات الذكي)
    // ============================
    let bodyHtml = '';
    let hasData = false;
    let rawiNotes = [];
    let rawiExceptions = [];

    // 8.1. تحليل التنبيهات والسطور التي تليها
    const rows = currentBabData.rows;
    const alertData = [];
    let currentAlert = null;

    // تجميع السطور تحت كل تنبيه
    rows.forEach((row, index) => {
        const isAlert = row.case1 && row.case1.includes('تنبيه');
        if (isAlert) {
            // بداية تنبيه جديد
            currentAlert = {
                alertRow: row,
                alertIndex: index,
                followingRows: []
            };
            alertData.push(currentAlert);
        } else if (currentAlert) {
            // إضافة السطر إلى التنبيه الحالي
            currentAlert.followingRows.push(row);
        }
    });

    // 8.2. فلترة الصفوف مع مراعاة التنبيهات
    const filteredRows = [];
    const alertRowsToShow = new Set();

    // معالجة كل تنبيه على حدة
    alertData.forEach(({ alertRow, alertIndex, followingRows }) => {
        // التحقق مما إذا كان الراوي المختار له حكم صحيح في جميع السطور التالية
        let hasValidRule = false;
        followingRows.forEach(row => {
            const rule = row.ruwat && row.ruwat[selectedRawi] ? row.ruwat[selectedRawi] : '-';
            if (rule !== '_' && rule !== '') {
                hasValidRule = true;
            }
        });

        // إذا كان للراوي حكم صحيح في أي من السطور التالية، نعرض التنبيه
        if (hasValidRule) {
            alertRowsToShow.add(alertIndex);
        }
    });

    // بناء قائمة الصفوف النهائية (باستثناء التنبيهات المخفية)
    rows.forEach((row, index) => {
        const isAlert = row.case1 && row.case1.includes('تنبيه');
        const rule = row.ruwat && row.ruwat[selectedRawi] ? row.ruwat[selectedRawi] : '-';
        
        if (isAlert) {
            // نضيف التنبيه فقط إذا كان في القائمة
            if (alertRowsToShow.has(index)) {
                filteredRows.push(row);
            }
        } else {
            // نضيف الصف العادي فقط إذا كان له حكم صحيح (ليس '_')
            if (rule !== '_' && rule !== '') {
                filteredRows.push(row);
            }
        }
    });

    // 8.3. حساب عدد الصفوف المدمجة لكل قيمة في case1 (بعد الفلترة)
    const case1Groups = [];
    let i = 0;
    while (i < filteredRows.length) {
        let j = i + 1;
        while (j < filteredRows.length && filteredRows[j].case1 === filteredRows[i].case1) {
            j++;
        }
        case1Groups.push({
            value: filteredRows[i].case1,
            start: i,
            end: j - 1,
            count: j - i
        });
        i = j;
    }

    // 8.4. بناء الجدول (باستخدام الصفوف المفلترة)
    filteredRows.forEach((row, index) => {
        const rule = row.ruwat && row.ruwat[selectedRawi] ? row.ruwat[selectedRawi] : '-';
        
        if (row.note && row.note.trim() !== '') rawiNotes.push(row.note);
        if (row.exception && row.exception.trim() !== '' && row.exception !== '-') rawiExceptions.push(row.exception);

        // التحقق من وجود تنبيه
        const isAlert = row.case1 && row.case1.includes('تنبيه');
        
        hasData = true;
        const colorClass = getColorClass(rule);
        
        // إذا كان تنبيهاً، نضيف كلاس خاص
        const rowClass = isAlert ? 'alert-row' : '';
        bodyHtml += `<tr class="${rowClass}">`;
        
        // ----- عمود case1 -----
        if (isAlert) {
            // التنبيه: دمج جميع الخلايا في خلية واحدة
            const colspan = 1 + (hasCase2 ? 1 : 0) + (hasExample ? 1 : 0) + 1;
            const alertText = row.case1 + (row.case2 ? ': ' + row.case2 : '');
            bodyHtml += `<td class="col-case1 alert-cell" colspan="${colspan}">📌 ${alertText}</td>`;
        } else {
            // الصفوف العادية: عرض case1 مع دمج
            const group = case1Groups.find(g => index >= g.start && index <= g.end);
            if (group && index === group.start) {
                bodyHtml += `<td class="col-case1" rowspan="${group.count}">${row.case1 || ''}</td>`;
            } else if (group && index > group.start) {
                bodyHtml += `<td class="col-case1" style="display: none;"></td>`;
            } else {
                bodyHtml += `<td class="col-case1">${row.case1 || ''}</td>`;
            }
            
            // باقي الأعمدة (للصفوف العادية فقط)
            if (hasCase2) {
                bodyHtml += `<td class="col-case2">${row.case2 || ''}</td>`;
            }
            
            if (hasExample) {
                bodyHtml += `<td class="col-example">${row.example || ''}</td>`;
            }
            
            bodyHtml += `<td class="col-rule rule-${colorClass}">${rule}</td>`;
        }
        
        bodyHtml += '</tr>';
    });

    if (!hasData) {
        const colspan = 1 + (hasCase2 ? 1 : 0) + (hasExample ? 1 : 0) + 1;
        bodyHtml += `<tr><td colspan="${colspan}" style="text-align:center;padding:30px;color:#7AE2CF;background:#f5f0e8;">📭 لا توجد أحكام للراوي ${selectedRawi} في هذا الباب</td></tr>`;
    }

    wrapper.innerHTML = `<table class="bab-table"><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table>`;
    
    // ============================
    // 9. عرض الملاحظات والاستثناءات
    // ============================
    const notesSection = document.getElementById('generalNotes');
    if (rawiNotes.length > 0) {
        notesSection.style.display = 'block';
        notesContainer.innerHTML = rawiNotes.map(n => `<div class="note-item">📌 ${n}</div>`).join('');
    } else {
        notesSection.style.display = 'none';
    }

    const excSection = document.getElementById('exceptionsSection');
    if (rawiExceptions.length > 0) {
        excSection.style.display = 'block';
        exceptionsContainer.innerHTML = rawiExceptions.map(e => `<div class="exception-item">⚠️ ${e}</div>`).join('');
    } else {
        excSection.style.display = 'none';
    }

    document.querySelectorAll('.rawi-item').forEach(el => {
        el.classList.toggle('active', el.dataset.rawi === selectedRawi && !el.classList.contains('disabled'));
    });
}


// ============================
// دوال مساعدة
// ============================

function resetRawiStates() {
    document.querySelectorAll('.rawi-item').forEach(el => {
        el.classList.remove('disabled');
        el.style.opacity = '1';
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'auto';
        el.style.borderColor = 'transparent';
        el.style.borderWidth = '0';
        el.style.borderStyle = 'none';
        const icon = el.querySelector('.agreement-icon');
        if (icon) icon.remove();
        el.setAttribute('title', '');
    });
}

function disableAllRawi() {
    document.querySelectorAll('.rawi-item').forEach(el => {
        el.classList.add('disabled');
        el.style.opacity = '0.4';
        el.style.cursor = 'not-allowed';
        el.style.pointerEvents = 'none';
        el.style.borderColor = 'transparent';
        el.classList.remove('active');
        const icon = el.querySelector('.agreement-icon');
        if (icon) icon.remove();
    });
}
// ============================
// دوال مساعدة لإدارة حالة الرواة
// ============================

function resetRawiStates() {
    document.querySelectorAll('.rawi-item').forEach(el => {
        el.classList.remove('disabled');
        el.style.opacity = '1';
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'auto';
    });
}

function disableAllRawi() {
    document.querySelectorAll('.rawi-item').forEach(el => {
        el.classList.add('disabled');
        el.style.opacity = '0.4';
        el.style.cursor = 'not-allowed';
        el.style.pointerEvents = 'none';
        el.classList.remove('active');
    });
}

// ============================
// 5. بناء قائمة الرواة
// ============================

function buildRawiList() {
    const wrapper = document.getElementById('rawiListWrapper');
    if (!wrapper) return;

    let html = '';
    RUWAT_NAMES.forEach(name => {
        const active = name === selectedRawi ? 'active' : '';
        html += `<span class="rawi-item ${active}" data-rawi="${name}" onclick="selectRawi('${name}')">${name}</span>`;
    });
    wrapper.innerHTML = html;
}

// ============================
// 6. اختيار راوٍ
// ============================

function selectRawi(rawiName) {
    selectedRawi = rawiName;
    renderTableForRawi(rawiName);
}

// ============================
// 7. عرض الباب
// ============================

function renderBab(babId) {
    const data = allBabData[babId];
    if (!data) return;

    currentBabData = data;

    // تحديث القائمة
    document.querySelectorAll('.bab-item').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.id) === babId);
    });

    // تحديث اسم الباب في القائمة المنسدلة
    const selectedName = document.getElementById('selectedBabName');
    if (selectedName) {
        const bab = BAB_FILES.find(b => b.id === babId);
        if (bab) selectedName.textContent = bab.title;
    }

    // عرض الجدول
    renderTableForRawi(selectedRawi);
}

// ============================
// 8. اختيار باب
// ============================

function selectBab(babId) {
    selectedBabId = babId;
    if (allBabData[babId]) {
        renderBab(babId);
    } else {
        loadBabData(babId);
    }
}

// ============================
// 9. تحميل بيانات الباب
// ============================

async function loadBabData(babId) {
    const bab = BAB_FILES.find(b => b.id === babId);
    if (!bab) return;

    const wrapper = document.getElementById('tableWrapper');
    wrapper.innerHTML = '<div class="loading-state">⏳ جاري تحميل الباب...</div>';

    try {
        const response = await fetch(`data/${bab.file}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        allBabData[babId] = data;
        renderBab(babId);
    } catch (error) {
        wrapper.innerHTML = `
            <div class="empty-state" style="color:#FF6B6B;">
                <small>⚠️تأكد من وجود الملف data/${bab.file}</small>
            </div>
        `;
        document.getElementById('generalNotes').style.display = 'none';
        document.getElementById('exceptionsSection').style.display = 'none';
    }
}

// ============================
// 10. بناء قائمة الأبواب
// ============================

function buildBabList() {
    // القائمة الجانبية (للحواسيب)
    const sidebar = document.getElementById('babSidebar');
    if (sidebar) {
        let html = '';
        BAB_FILES.sort((a, b) => a.id - b.id).forEach(bab => {
            const active = bab.id === selectedBabId ? 'active' : '';
            const color = getBabColor(bab.class);
            html += `
                <div class="bab-item ${active}" data-id="${bab.id}" onclick="selectBab(${bab.id})" style="color:${color};">
                    ${bab.title}
                </div>
            `;
        });
        sidebar.innerHTML = html;
    }

    // القائمة المنسدلة (للهواتف)
    const dropdown = document.getElementById('babDropdownContent');
    if (dropdown) {
        let html = '';
        BAB_FILES.sort((a, b) => a.id - b.id).forEach(bab => {
            const active = bab.id === selectedBabId ? 'active' : '';
            const color = getBabColor(bab.class);
            html += `
                <div class="bab-item ${active}" data-id="${bab.id}" onclick="selectBab(${bab.id}); closeBabDropdown();" style="color:${color};">
                    ${bab.title}
                </div>
            `;
        });
        dropdown.innerHTML = html;
    }

    // تحديث اسم الباب المختار
    const selectedName = document.getElementById('selectedBabName');
    if (selectedName && selectedBabId) {
        const bab = BAB_FILES.find(b => b.id === selectedBabId);
        if (bab) selectedName.textContent = bab.title;
    }
}

// ============================
// 11. الحصول على لون الباب
// ============================

function getBabColor(classKey) {
    const colors = {
        'c1': '#FF0000', 'c2': '#C65911', 'c3': '#FF00FF', 'c4': '#FFC000',
        'c5': '#5B9BD5', 'c6': '#002060', 'c7': '#00B0F0', 'c8': '#00FF00',
        'c9': '#0000FF', 'c10': '#00FFFF', 'c11': '#ED7D31', 'c12': '#FF0066',
        'c13': '#CC00CC', 'c14': '#C00000', 'c15': '#0070C0', 'c16': '#00B050',
        'c17': '#7030A0', 'c18': '#548235', 'c19': '#CC0099', 'c20': '#92D050',
        'c21': '#970573', 'c22': '#636261', 'c23': '#893BC3', 'c24': '#A50021',
        'c25': '#0099FF', 'c26': '#FFFF00'
    };
    return colors[classKey] || '#FFFFFF';
}

// ============================
// 12. التحكم في القائمة المنسدلة
// ============================

function toggleBabDropdown() {
    const content = document.getElementById('babDropdownContent');
    if (content) {
        content.classList.toggle('show');
    }
}

function closeBabDropdown() {
    const content = document.getElementById('babDropdownContent');
    if (content) {
        content.classList.remove('show');
    }
}

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', function(event) {
    const wrapper = document.querySelector('.bab-dropdown-wrapper');
    if (wrapper && !wrapper.contains(event.target)) {
        closeBabDropdown();
    }
});

// ============================
// 13. تهيئة الصفحة
// ============================

document.addEventListener('DOMContentLoaded', function() {
    buildBabList();
    buildRawiList();

    if (BAB_FILES.length > 0) {
        selectBab(BAB_FILES[0].id);
    }
});

// جعل الدوال متاحة عالمياً
window.selectBab = selectBab;
window.selectRawi = selectRawi;
window.toggleBabDropdown = toggleBabDropdown;
window.closeBabDropdown = closeBabDropdown;