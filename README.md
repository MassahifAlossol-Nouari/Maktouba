# Maktouba
# 📖 مصاحف مكتوبة (Maktouba)

<div align="center">
  <img src="covers/cover.png" alt="شعار المشروع" width="200">
  
  **مشروع رقمي متكامل للمصاحف الملونة بروايات متعددة**
  
  [![GitHub Stars](https://img.shields.io/github/stars/MassahifAlossol-Nouari/Maktouba?style=social)](https://github.com/MassahifAlossol-Nouari/Maktouba/stargazers)
  [![GitHub Issues](https://img.shields.io/github/issues/MassahifAlossol-Nouari/Maktouba)](https://github.com/MassahifAlossol-Nouari/Maktouba/issues)
  [![GitHub License](https://img.shields.io/github/license/MassahifAlossol-Nouari/Maktouba)](https://github.com/MassahifAlossol-Nouari/Maktouba/blob/main/LICENSE)
  [![Website](https://img.shields.io/website?url=https%3A%2F%2Fmassahifalossol-nouari.github.io%2FMaktouba%2F)](https://massahifalossol-nouari.github.io/Maktouba/)
</div>

---

## 📖 الفكرة

**مصاحف الأصول الملونة بصيغة مكتوبة** — هو مشروع رقمي يهدف إلى تقديم **نسخ نصية كاملة من المصاحف** مع تطبيق **قواعد التجويد الملوّنة**، تماماً كما في المصاحف المطبوعة بألوان. المشروع موجه لـ **طلبة العلم، القراء، ومشايخ الإقراء**، وليس مجرد تطبيق قرآن عادي، بل يهتم بـ **الفروق بين الروايات** و **التحريرات** و **الطباعة الملونة** بدقة عالية.

---

## ✨ الميزات الرئيسية

### 🎨 **المصاحف الملونة**
- عرض المصحف بألوان تعكس أحكام التجويد المختلفة (14 قاعدة ملوّنة).
- تنسيق دقيق يحاكي المصحف الورقي المطبوع.

### 📚 **تعدد الروايات**
- يحتوي المشروع على أكثر من **30 مصحفاً** لعدة روايات، منها:
  - **ورش** (4 نسخ)
  - **قالون** (4 نسخ)
  - **حفص**
  - **البزي**
  - **الدوري** (3 نسخ)
  - **السوسي**
  - **ابن كثير، ابن ذكوان، هشام، الخلاد، خلف، إسحاق، روح، رويس، شعب، الأصبهاني، أبو حارث، الدوري عن الكسائي، قنبل**
  - وغيرها من الروايات.

### 🖱️ **تفاعلية ذكية**
- اضغط على أي حرف ملون لترى شرح حكمه التجويدي.
- نظام بحث دقيق يعتمد على **الرمز + الكلاس** معاً لتجنب التداخل.

### 🔍 **رموز خاصة**
- دعم الرموز التجويدية النادرة مع شرح مفصل لكل رمز.
- قاعدة بيانات للرموز في ملف `Data/symbols.json`.

### 📱 **تصميم متجاوب**
- يعمل على جميع أحجام الشاشات (الحواسيب، الأجهزة اللوحية، الهواتف).
- دعم كامل للغة العربية والخطوط القرآنية.

### 🎧 **قارئ صوتي**
- صفحة `Reader/` للاستماع إلى التلاوات.

### 📊 **مقارنة المصاحف**
- صفحة `compare/` لمقارنة المصاحف والروايات المختلفة.

### 📈 **إحصاءات**
- صفحة `stats/` لعرض إحصاءات حول المصحف والروايات.

### 📄 **تحريرات**
- بيانات التحريرات (الفروق بين الروايات) بصيغة JSON في مجلد `tahrirat/`.

### 📕 **نسخ PDF**
- نسخ PDF من المصاحف (الأصل المطبوع) في مجلد `features/features-pdfs/`.

---

## 🛠️ التقنيات المستخدمة

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white" alt="JSON">
</div>

- **الواجهة الأمامية**: HTML5، CSS3، JavaScript (ES6+) خالص — بدون أي build step، يعمل مباشرة من المتصفح.
- **الاستضافة**: GitHub Pages مع GitHub Actions للنشر التلقائي (SLSA3 secure supply chain).
- **الخطوط**: خط مصحف مخصص `nouariabdelkabir.ttf`، وخط Amiri.
- **البيانات**: JSON و JS.

---

## 📁 هيكل المشروع
Maktouba/
├── 📂 Data/
│ ├── mushaf_*.js # 30 مصحفاً لأكثر من رواية (حفص، ورش، قالون، البزي، الدوري، السوسي، ابن كثير، ابن ذكوان، هشام، الخلاد، خلف، إسحاق، روح، رويس، شعب، الأصبهاني، أبو حارث، الدوري عن الكسائي، قنبل)
│ ├── tafsir.js # التفسير (6.5 ميجا)
│ ├── symbols.json # قائمة الرموز القرآنية
│ ├── qiraat/ # بيانات القراءات الفرعية
│ └── rules.json # قواعد التلوين لكل رواية (ورش: 14 قاعدة ملوّنة)
├── 📂 Reader/ # قارئ صوتي للاستماع للتلاوات
├── 📂 compare/ # صفحة مقارنة بين المصاحف
├── 📂 stats/ # إحصاءات
├── 📂 tahrirat/ # بيانات التحريرات (الفروق بين الروايات بصيغة JSON)
├── 📂 features/
│ └── features-pdfs/ # نسخ PDF من المصاحف (الأصل المطبوع)
├── 📂 font/
│ └── nouariabdelkabir.ttf # خط مصحف مخصص
├── 📂 covers/ # أغلفة لصفحات الفاتحة والبقرة
├── 📂 image/ # إطارات وزخارف
├── 📂 .github/workflows/ # GitHub Actions للنشر التلقائي
├── 📜 index.html # الصفحة الرئيسية
├── 📜 script.js # منطق التلوين والتفاعل (177 KB)
├── 📜 style.css # تنسيق الألوان وقواعد التجويد
├── 📜 compare.css # تنسيق صفحة المقارنة
├── 📜 quran.js # بيانات العرض (3.7 ميجا)
├── 📜 rules.json # قواعد التلوين
└── 📜 README.md # هذا الملف

text

---

## 🎯 أحكام التجويد 
| الكلاس | اللون | الحكم التجويدي |
| :--- | :--- | :--- |
| `c1` | 🔴 | الكلمات الفرشية |
| `c2` | 🟤 | عد الآيات |
| `c3` | 🌸 | الإدغام الكبير |
| `c4` | 🟠 | الإمالة أو التقليل |
| `c5` | 🔵 | البسملة بين السورتين |
| `c6` | ⚫ | علامات الوقف أو الأرباع |
| `c7` | 🔵 | الهمز المفرد أو المزدوج |
| `c8` | 🟢 | تغليظ اللام |
| `c9` | 🔵 | النقل أو السكت |
| `c10` | 🔵 | مد البدل لورش |
| `c11` | 🟠 | ترقيق الراء |
| `c12` | 🌸 | صلة ميم الجمع |
| `c13` | 🟣 | مد اللين لورش |
| `c14` | 🔴 | الياءات المتطرفة |
| `c15` | 🔵 | الإدغام الصغير |
| `c16` | 🟢 | تحريك الساكن أو ما قبله |
| `c17` | 🟣 | انفرادة له |
| `c18` | 🟢 | هاء الكناية |
| `c19` | 🌸 | الوقف على الهمز |
| `c20` | 🟢 | الإشمام أو الاختلاس |
| `c21` | 🟤 | الوقف على أواخر الكلم |
| `c22` | ⚫ | العطف |
| `c23` | 🟣 | التكبير |
| `c24` | 🔴 | الياءات الزوائد |
| `c25` | 🔵 | الهمز المزدوج |
| `c26` | 🟡 | أخرى |

---

## 🚀 كيفية التشغيل

### 🔧 التشغيل محلياً

1. **استنساخ المستودع**:
```bash

https://massahifalossol-nouari.github.io/Maktouba/
 فتح الملف:
افتح index.html في متصفحك المفضل (يفضل Chrome أو Firefox).

استخدام الموقع:

اضغط على أي حرف ملون لترى شرحه.

استخدم القائمة للتنقل بين المصاحف والروايات.

استخدم صفحة compare/ لمقارنة الروايات.

🌐 النسخة المباشرة
يمكنك زيارة الموقع مباشرة عبر الرابط:
https://massahifalossol-nouari.github.io/Maktouba/

👨‍💻 المطور
المعلومات
الاسم: Nouari Abdelkabir
المشروع: مصاحف مكتوبة (Maktouba)
الغرض: تسهيل قراءة المصاحف الملونة بروايات متعددة
التواصل: GitHub
🤝 المساهمة
نرحب بمساهماتكم! يمكنكم:

الإبلاغ عن الأخطاء عبر Issues.

اقتراح ميزات جديدة.

تحسين الكود عبر Pull Requests.

إضافة روايات جديدة أو تصحيح البيانات.

📜 الترخيص
هذا المشروع مرخص تحت رخصة MIT License.

🙏 شكر وتقدير
جزى الله خيراً كل من ساهم في هذا المشروع.

شكر خاص لكل من ساعد في جمع وتحقيق أحكام التجويد والروايات.

نسأل الله أن يجعله عملاً خالصاً لوجهه الكريم.

🗓️ الميزات القادمة
إضافة خاصية البحث الصوتي.

دعم المزيد من الروايات.

تطبيق للهواتف المحمولة (PWA).

وضع القراءة الليلية.

دعم التفسير التفاعلي.

