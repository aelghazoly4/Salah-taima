# Wedding RSVP Backend

Serverless backend (Vercel Functions) + MongoDB لحفظ رسائل الـRSVP وتتبع دخول/خروج الزوار.

## الـEndpoints
- `POST /api/rsvp` — body: `{ name, message }` → يحفظ رسالة تهنئة جديدة (ده اللي الفورم في الموقع بيبعت له).
- `GET /api/rsvp` — يرجع كل الرسائل. محتاج header: `x-admin-password: <ADMIN_PASSWORD>`.
- `POST /api/visits` — body: `{ sessionId, event: "enter" | "leave" }` — يسجل دخول/خروج زائر.
- `GET /api/visits` — يرجع كل سجلات الدخول/الخروج. نفس الـheader بتاع الباسورد.
- `POST /api/admin-login` — يتحقق من الباسورد بس (يستخدمه الـadmin dashboard وقت تسجيل الدخول).

## خطوات النشر (Deploy)

### 1. جهّز MongoDB
- اعمل حساب على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (فيه Free tier).
- اعمل Cluster، واعمل Database User، وخد الـConnection String (يبدأ بـ `mongodb+srv://...`).
- من Network Access سيب `0.0.0.0/0` (Allow access from anywhere) عشان Vercel يقدر يوصل.

### 2. ارفع المشروع على Vercel
```bash
cd backend
npm install
vercel
```
أو اربط الفولدر ده بـ GitHub repo وadd import على [vercel.com](https://vercel.com/new).

### 3. ضيف الـEnvironment Variables في Vercel
في إعدادات المشروع على Vercel → Settings → Environment Variables:
- `MONGODB_URI` = الـconnection string بتاع Atlas
- `MONGODB_DB` = `wedding` (أو أي اسم تحبه)
- `ADMIN_PASSWORD` = باسورد قوي تختاره للـadmin dashboard

بعد ما تضيفهم، اعمل Redeploy.

### 4. اختبار
```bash
curl -X POST https://<your-project>.vercel.app/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","message":"Mabrouk!"}'
```

### 5. اربط الموقع
في ملف `index.html` بتاع الدعوة، غيّر رابط `/api/rsvp` ليكون الرابط الكامل بتاع الباك إند بعد النشر، مثلاً:
`https://your-project.vercel.app/api/rsvp`

### 6. الـAdmin Dashboard
ملف `admin.html` (هيتوصلك في الخطوة الجاية) لازم يتحط فيه رابط الباك إند (API base URL) من فوق، وبعدين تفتحه وتدخل الباسورد بتاع `ADMIN_PASSWORD`.
