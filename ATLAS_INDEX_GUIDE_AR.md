# خطوات إنشاء Vector Search Index في MongoDB Atlas

## الإعدادات المطلوبة:

**اسم الـ Index**: `vector_index`

**الـ JSON Configuration**:
```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding_vector",
      "numDimensions": 384,
      "similarity": "cosine"
    }
  ]
}
```

---

## الخطوات بالتفصيل:

### 1. تسجيل الدخول إلى MongoDB Atlas
- اذهب إلى: https://cloud.mongodb.com
- سجل دخول بحسابك

### 2. اختر الـ Cluster الخاص بك
- اضغط على `Cluster0store`

### 3. اذهب إلى تبويب Search
- في القائمة الجانبية، اضغط على **"Atlas Search"** أو **"Search"**
- ستجد زر **"Create Search Index"** - اضغط عليه

### 4. اختر JSON Editor
- ستظهر لك خيارين:
  - Visual Editor
  - JSON Editor
- **اختر "JSON Editor"**
- اضغط **"Next"**

### 5. املأ البيانات:

#### أ) Index Name (اسم الـ Index):
```
vector_index
```

#### ب) Database and Collection:
- **Database**: `almadina_store`
- **Collection**: `products`

#### ج) Index Definition (تعريف الـ Index):
الصق هذا الكود بالضبط:
```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding_vector",
      "numDimensions": 384,
      "similarity": "cosine"
    }
  ]
}
```

### 6. إنشاء الـ Index
- اضغط **"Next"**
- راجع الإعدادات
- اضغط **"Create Search Index"**

### 7. انتظر حتى يكتمل البناء
- سيظهر الـ Index بحالة **"Building"** (جاري البناء)
- انتظر من 2-5 دقائق
- عندما يتحول إلى **"Active"** يكون جاهز للاستخدام ✅

---

## التحقق من نجاح الإنشاء:

بعد إنشاء الـ Index، يمكنك التحقق:

1. **في MongoDB Atlas**:
   - اذهب إلى تبويب "Search"
   - يجب أن ترى `vector_index` بحالة "Active"

2. **اختبار من الكود**:
   ```bash
   cd backend
   curl -X POST http://localhost:5000/api/ai/recommendation \
     -H "Content-Type: application/json" \
     -d "{\"message\": \"أريد لابتوب للألعاب\"}"
   ```

---

## ملاحظات مهمة:

⚠️ **تأكد من الأرقام**:
- `numDimensions`: **384** (وليس 768 أو أي رقم آخر)
- هذا لأننا نستخدم نموذج `multilingual-e5-small`

⚠️ **اسم الحقل**:
- `path`: **"embedding_vector"** (يجب أن يطابق اسم الحقل في الـ Schema)

⚠️ **دالة التشابه**:
- `similarity`: **"cosine"** (الأفضل للـ embeddings)

---

## إذا واجهت مشاكل:

### المشكلة: "Index not found"
- **الحل**: تأكد أن اسم الـ Index هو `vector_index` بالضبط

### المشكلة: "$vectorSearch is not supported"
- **الحل**: تأكد أنك تستخدم MongoDB Atlas (وليس MongoDB محلي)

### المشكلة: "No results returned"
- **الحل**: تأكد أن المنتجات لديها `embedding_vector`
- شغل: `node generateEmbeddings.js`

---

## بعد إنشاء الـ Index:

جرب النظام:
1. افتح: http://localhost:5173
2. اذهب إلى "🤖 مساعد AI"
3. اختر تبويب "🤝 ترشيح الأجهزة"
4. اكتب: "أحتاج لابتوب للبرمجة"
5. يجب أن يعطيك توصيات من المنتجات الموجودة! 🎉
