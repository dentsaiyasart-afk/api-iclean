// api/index.js - Vercel Serverless Function
// ====================================================

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ====================================================
// UTILITY FUNCTIONS
// ====================================================

async function sendEmail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: '"i-Clean" <noreply@i-clean.co.th>',
            to: to,
            subject: subject,
            html: html
        });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// ====================================================
// HEALTH CHECK ENDPOINT
// ====================================================

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'i-Clean API is running on Vercel',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'i-Clean API',
        endpoints: [
            'GET  /api/health',
            'POST /api/wholesale-inquiry',
            'POST /api/newsletter-subscribe'
        ]
    });
});

// ====================================================
// WHOLESALE INQUIRY ENDPOINT
// ====================================================

app.post('/api/wholesale-inquiry', async (req, res) => {
    try {
        const { fullname, email, phone, business_type, message } = req.body;
        
        // Validation
        if (!fullname || !email || !phone || !business_type) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'รูปแบบอีเมลไม่ถูกต้อง'
            });
        }
        
        // Create inquiry object
        const inquiry = {
            id: Date.now().toString(),
            fullname,
            email,
            phone,
            business_type,
            message: message || '',
            submitted_at: new Date().toISOString(),
            status: 'pending'
        };
        
        // Send confirmation email to customer
        const customerEmailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Kanit', Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #4A7C4E 0%, #5B9BD5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .button { display: inline-block; background: #4A7C4E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌿 i-Clean</h1>
                        <h2>ขอบคุณที่สนใจร่วมเป็นตัวแทนจำหน่าย!</h2>
                    </div>
                    <div class="content">
                        <p>สวัสดีคุณ ${fullname},</p>
                        <p>เราได้รับข้อมูลของคุณเรียบร้อยแล้ว! ทีมงาน i-Clean จะติดต่อกลับภายใน 24 ชั่วโมง เพื่อส่งเอกสารราคาส่งและแผนการตลาด</p>
                        
                        <h3>📋 ข้อมูลที่ได้รับ:</h3>
                        <ul>
                            <li><strong>ชื่อ:</strong> ${fullname}</li>
                            <li><strong>อีเมล:</strong> ${email}</li>
                            <li><strong>โทรศัพท์:</strong> ${phone}</li>
                            <li><strong>ประเภทธุรกิจ:</strong> ${business_type}</li>
                            ${message ? `<li><strong>ข้อความ:</strong> ${message}</li>` : ''}
                        </ul>
                        
                        <p>ในระหว่างนี้ คุณสามารถ:</p>
                        <ul>
                            <li>✅ ดูข้อมูลผลิตภัณฑ์เพิ่มเติมบนเว็บไซต์</li>
                            <li>✅ ติดตามเพจ Facebook: I-Clean น้ำยาล้างจานสับปะรด Organic 100%</li>
                            <li>✅ สอบถามเพิ่มเติมทาง Line: @i_clean</li>
                        </ul>
                        
                        <center>
                            <a href="https://i-clean.vercel.app/" class="button">เยี่ยมชมเว็บไซต์</a>
                        </center>
                    </div>
                    <div class="footer">
                        <p>© 2024 i-Clean - Organic Dish Washing Liquid<br>
                        Made with 💚 in Thailand</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        await sendEmail(email, '🎉 ยินดีต้อนรับสู่ i-Clean - ได้รับข้อมูลของคุณแล้ว', customerEmailHTML);
        
        // Send notification email to admin
        const adminEmailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <h2>🔔 Wholesale Inquiry ใหม่!</h2>
                <p><strong>ชื่อ:</strong> ${fullname}</p>
                <p><strong>อีเมล:</strong> ${email}</p>
                <p><strong>โทรศัพท์:</strong> ${phone}</p>
                <p><strong>ประเภทธุรกิจ:</strong> ${business_type}</p>
                <p><strong>ข้อความ:</strong> ${message || '-'}</p>
                <p><strong>วันที่:</strong> ${new Date().toLocaleString('th-TH')}</p>
                <hr>
                <p><em>กรุณาติดต่อกลับภายใน 24 ชั่วโมง</em></p>
            </body>
            </html>
        `;
        
        await sendEmail(
            process.env.ADMIN_EMAIL || 'aongartfarm@gmail.com', 
            `🆕 Wholesale Inquiry - ${fullname}`, 
            adminEmailHTML
        );
        
        // Log inquiry (since we can't save to file in serverless)
        console.log('New Wholesale Inquiry:', inquiry);
        
        // Return success response
        res.json({
            success: true,
            message: 'ส่งข้อมูลสำเร็จ! ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
            inquiry_id: inquiry.id
        });
        
    } catch (error) {
        console.error('Error processing wholesale inquiry:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
        });
    }
});

// ====================================================
// NEWSLETTER SUBSCRIPTION ENDPOINT
// ====================================================

app.post('/api/newsletter-subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกอีเมล'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'รูปแบบอีเมลไม่ถูกต้อง'
            });
        }
        
        // Create subscriber object
        const subscriber = {
            id: Date.now().toString(),
            email,
            subscribed_at: new Date().toISOString(),
            status: 'active'
        };
        
        // Send welcome email
        const welcomeEmailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Kanit', Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #4A7C4E 0%, #5B9BD5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #4A7C4E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌿 i-Clean</h1>
                        <h2>ยินดีต้อนรับสู่ครอบครัว i-Clean!</h2>
                    </div>
                    <div class="content">
                        <p>สวัสดีค่ะ,</p>
                        <p>ขอบคุณที่สมัครรับข่าวสารจาก i-Clean 💚</p>
                        
                        <p>คุณจะได้รับ:</p>
                        <ul>
                            <li>🎁 โปรโมชั่นและส่วนลดพิเศษ</li>
                            <li>📰 ข่าวสารผลิตภัณฑ์ใหม่</li>
                            <li>💡 เคล็ดลับการล้างจานและรักษาสิ่งแวดล้อม</li>
                            <li>🌱 ความรู้เกี่ยวกับ Organic Living</li>
                        </ul>
                        
                        <p><strong>🎉 รับส่วนลด 10% สำหรับคำสั่งซื้อแรก!</strong></p>
                        <p>ใช้โค้ด: <strong style="color: #4A7C4E; font-size: 18px;">WELCOME10</strong></p>
                        
                        <center>
                            <a href="https://i-clean.vercel.app/" class="button">เริ่มช้อปปิ้ง</a>
                        </center>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        await sendEmail(email, '🎉 ยินดีต้อนรับสู่ i-Clean + รับส่วนลด 10%!', welcomeEmailHTML);
        
        // Log subscriber
        console.log('New Newsletter Subscriber:', subscriber);
        
        // Return success response
        res.json({
            success: true,
            message: 'สมัครรับข่าวสารสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ',
            subscriber_id: subscriber.id
        });
        
    } catch (error) {
        console.error('Error processing newsletter subscription:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
        });
    }
});

// ====================================================
// ERROR HANDLING
// ====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// ====================================================
// EXPORT FOR VERCEL
// ====================================================

module.exports = app;