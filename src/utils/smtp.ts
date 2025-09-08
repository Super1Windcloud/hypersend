import nodemailer from 'nodemailer'
const email = 'ss1178933440@gmail.com'
const ownMail = '1178933440@qq.com'
import dotenv from 'dotenv'
dotenv.config()
// 创建邮件发送的 transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com', // QQ 邮箱的 SMTP 服务器
  port: 465, // 使用 SSL 的端口
  secure: true,
  auth: {
    user: ownMail, // 发件人邮箱地址
    pass: process.env.qq_password // SMTP 邮箱授权码
  }
})

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000) // 生成6位数验证码
}

// 发送验证码邮件
async function sendVerificationEmail(toEmail) {
  const verificationCode = generateVerificationCode() // 生成验证码

  const mailOptions = {
    from: ownMail, // 发件人地址
    to: toEmail, // 收件人邮箱
    subject: '邮箱验证码 Fuck you ', // 邮件主题
    text: `您的验证码是: ${verificationCode}` // 邮件内容
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('验证码已发送:', info.response)
    return verificationCode // 返回生成的验证码
  } catch (error) {
    console.error('发送邮件失败:', error)
    throw error // 抛出异常
  }
}

// 测试发送验证码
sendVerificationEmail(email)
  .then((code) => {
    console.log('验证码:', code) // 显示发送的验证码
  })
  .catch((error) => {
    console.error('发送邮件过程中发生错误:', error)
  })
