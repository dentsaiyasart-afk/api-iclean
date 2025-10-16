# 🚀 Deploy i-Clean API to Vercel

## วิธีที่ 1: Deploy ผ่าน Vercel CLI (แนะนำ)

### ขั้นตอนที่ 1: ติดตั้ง Vercel CLI

```bash
npm install -g vercel
```

### ขั้นตอนที่ 2: เตรียมโปรเจค

```bash
# สร้างโฟลเดอร์ api/
mkdir api

# ย้ายไฟล์ api/index.js ไปที่ api/
# (ใช้ไฟล์ที่สร้างให้)

# ตรวจสอบว่ามี vercel.json แล้ว
ls -la vercel.json
```

### ขั้นตอนที่ 3: โครงสร้างโปรเจค

```
i-clean-backend/
├── api/
│   └── index.js          # Serverless function
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── .gitignore
```

### ขั้นตอนที่ 4: Login Vercel

```bash
vercel login
```

เลือก login ผ่าน:
- GitHub
- GitLab
- Bitbucket
- Email

### ขั้นตอนที่ 5: Deploy

```bash
# Deploy to preview
vercel

# หรือ Deploy to production
vercel --prod
```

ตอบคำถาม:
```
? Set up and deploy "~/i-clean-backend"? [Y/n] y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] n
? What's your project's name? i-clean-api
? In which directory is your code located? ./
```

### ขั้นตอนที่ 6: ตั้งค่า Environment Variables

```bash
# ผ่าน CLI
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add ADMIN_EMAIL

# หรือผ่าน Dashboard (แนะนำ)
# ไปที่ https://vercel.com/dashboard
# เลือก Project > Settings > Environment Variables
```

ตัวอย่าง Environment Variables:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ADMIN_EMAIL=info@i-clean.co.th
```

### ขั้นตอนที่ 7: Redeploy หลังตั้งค่า ENV

```bash
vercel --prod
```

### ขั้นตอนที่ 8: ทดสอบ

```bash
# เปลี่ยน URL ตามที่ Vercel ให้มา
curl https://i-clean-api.vercel.app/api/health

# ควรได้
# {"status":"OK","message":"i-Clean API is running on Vercel"}
```

---

## วิธีที่ 2: Deploy ผ่าน GitHub (Auto Deploy)

### ขั้นตอนที่ 1: Push โค้ดขึ้น GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/i-clean-api.git
git push -u origin main
```

### ขั้นตอนที่ 2: Import Project ใน Vercel

1. ไปที่ https://vercel.com/new
2. เลือก "Import Git Repository"
3. เชื่อมต่อ GitHub account
4. เลือก repository `i-clean-api`
5. คลิก "Import"

### ขั้นตอนที่ 3: Configure Project

```
Framework Preset: Other
Root Directory: ./
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: npm install
```

### ขั้นตอนที่ 4: Add Environment Variables

ใน Settings > Environment Variables เพิ่ม:
```
EMAIL_USER
EMAIL_PASS
SMTP_HOST
SMTP_PORT
ADMIN_EMAIL
```

### ขั้นตอนที่ 5: Deploy

คลิก "Deploy" และรอสักครู่

---

## 📝 อัพเดท Frontend ให้ใช้ Vercel API

แก้ไขไฟล์ `script.js`:

```javascript
// เปลี่ยน API URL
const API_BASE_URL = 'https://i-clean-api.vercel.app/api';

// หรือใช้ custom domain
const API_BASE_URL = 'https://api.i-clean.co.th/api';
```

---

## 🌐 ตั้งค่า Custom Domain (Optional)

### ในหน้า Vercel Dashboard:

1. ไปที่ Project Settings > Domains
2. เพิ่ม domain: `api.i-clean.co.th`
3. ตั้งค่า DNS ตามที่ Vercel แนะนำ:

```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

4. รอ DNS propagate (5-30 นาที)
5. Vercel จะออก SSL certificate อัตโนมัติ

---

## ✅ Checklist หลัง Deploy

- [ ] ทดสอบ `/api/health` endpoint
- [ ] ทดสอบส่ง wholesale inquiry
- [ ] ทดสอบ newsletter subscription
- [ ] ตรวจสอบว่าได้รับ email
- [ ] เช็ค Vercel Logs: `vercel logs`
- [ ] เทสจาก frontend
- [ ] Setup custom domain (ถ้าต้องการ)

---

## 🔍 ตรวจสอบ Logs

### ผ่าน CLI:
```bash
vercel logs your-deployment-url
vercel logs --follow  # Real-time logs
```

### ผ่าน Dashboard:
1. ไปที่ Project > Deployments
2. คลิกที่ deployment ล่าสุด
3. ดู Runtime Logs

---

## 📊 Monitor Performance

### Vercel Analytics (ฟรี):
1. ไปที่ Project > Analytics
2. ดู:
   - Request count
   - Response time
   - Error rate
   - Geographic distribution

---

## 🐛 Troubleshooting

### ปัญหา: Email ไม่ส่ง

**ตรวจสอบ:**
1. Environment variables ตั้งค่าถูกต้องหรือไม่
   ```bash
   vercel env ls
   ```
2. Gmail App Password ถูกต้องหรือไม่
3. ดู logs: `vercel logs`

**แก้ไข:**
```bash
# Remove wrong variable
vercel env rm EMAIL_PASS

# Add correct one
vercel env add EMAIL_PASS

# Redeploy
vercel --prod
```

### ปัญหา: 404 Not Found

**ตรวจสอบ:**
- `vercel.json` มี routes ถูกต้องหรือไม่
- `api/index.js` อยู่ในตำแหน่งที่ถูกต้องหรือไม่

**แก้ไข:**
```bash
vercel --prod --force  # Force rebuild
```

### ปัญหา: CORS Error

**แก้ไข** ใน `api/index.js`:
```javascript
app.use(cors({
    origin: ['https://i-clean.co.th', 'http://localhost:5500'],
    credentials: true
}));
```

### ปัญหา: Function Timeout

Vercel Free tier มี limit 10 seconds.

**แก้ไข** ใน `vercel.json`:
```json
{
  "functions": {
    "api/index.js": {
      "maxDuration": 10
    }
  }
}
```

---

## 💰 Vercel Pricing (ข้อมูล ณ 2024)

### Free (Hobby):
- ✅ 100 GB bandwidth/month
- ✅ 100 deployments/day
- ✅ Serverless functions
- ✅ SSL certificates
- ✅ Custom domains
- ⚠️ 10s function timeout
- ⚠️ 4.5s edge functions

### Pro ($20/month):
- ✅ 1 TB bandwidth
- ✅ Unlimited deployments
- ✅ 60s function timeout
- ✅ Password protection
- ✅ Analytics

---

## 🔐 Security Best Practices

### 1. ใช้ Environment Variables
```bash
# ห้าม hardcode sensitive data
❌ const password = "mypassword123"

# ใช้ ENV แทน
✅ const password = process.env.EMAIL_PASS
```

### 2. Rate Limiting (เพิ่มเข้าไปใน api/index.js)
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 10 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. CORS Configuration
```javascript
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://i-clean.co.th'],
    credentials: true
}));
```

---

## 📈 Performance Optimization

### 1. Enable Caching (ใน vercel.json)
```json
{
  "headers": [
    {
      "source": "/api/health",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

### 2. Optimize Dependencies
```bash
# ใช้เฉพาะ dependencies ที่จำเป็น
npm install --production
```

---

## 🔄 Auto Deploy on Push

เมื่อ connect กับ GitHub แล้ว:
- Push to `main` branch = Auto deploy to production
- Push to `dev` branch = Auto deploy to preview
- Pull Request = Preview deployment

---

## 📱 Test API จาก Frontend

```javascript
// script.js
const API_BASE_URL = 'https://i-clean-api.vercel.app/api';

// Test
fetch(`${API_BASE_URL}/health`)
    .then(res => res.json())
    .then(data => console.log(data));
```

---

## ✨ Bonus: Webhook Notifications

### Setup Slack/Discord Notification:

1. ไปที่ Project Settings > Git Integration
2. เพิ่ม Deploy Webhook
3. ใส่ Slack/Discord Webhook URL
4. จะได้รับแจ้งเตือนทุกครั้งที่ deploy

---

## 🎉 เสร็จสิ้น!

API ของคุณพร้อมใช้งานบน Vercel แล้ว!

**Next Steps:**
1. ทดสอบทุก endpoint
2. เชื่อมต่อกับ frontend
3. Monitor logs และ analytics
4. Setup custom domain (ถ้าต้องการ)

---

**Need Help?**
- 📚 Vercel Docs: https://vercel.com/docs
- 💬 Vercel Community: https://github.com/vercel/vercel/discussions
- 📧 Email: info@i-clean.co.th