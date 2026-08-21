# ربات تلگرام متن‌برگردان جلسه هوش‌مصنوعی — رایگان و متن‌باز 🤖

**متن‌برگردان جلسه هوش‌مصنوعی** یک ربات تلگرام رایگان و متن‌باز است که متن‌برگردان یا یادداشت جلسه را به خلاصه، موارد اقدام و تصمیمات تبدیل می‌کند. سورس ربات روی گیت‌هاب موجود است و روی Cloudflare Workers رایگان میزبانی می‌شود.

> 🪪 **مجوز:** MIT — برای استفاده شخصی و تجاری آزاد است.

---

## ✨ قابلیت‌های پروژه

- خلاصه یادداشت‌های جلسه
- استخراج موارد اقدام و تصمیمات
- فهرست مسئولان و وظایف
- هوش‌مصنوعی روی لبه
- پلن رایگان

---

## 🧱 تکنولوژی‌های استفاده‌شده

| بخش | انتخاب |
| --- | --- |
| محیط اجرا | Cloudflare Workers |
| فریم‌ورک وب | [Hono](https://hono.dev) |
| هوش‌مصنوعی | Cloudflare Workers AI (`@cf/meta/llama-3-8b-instruct`) |
| ارتباط با ربات | Telegram Bot API (webhooks) |

---

## 📋 پیش‌نیازها

- یک **حساب کاربری Cloudflare** (پلن رایگان کافیست).
- **Node.js** (نسخه ۱۸ یا بالاتر) و **npm** نصب‌شده.
- یک **حساب تلگرام** (برای گفتگو با [@BotFather](https://t.me/BotFather)).

---

## 🚀 راهنمای گام‌به‌گام نصب و استقرار

### 1. ساخت حساب کاربری Cloudflare

1. به آدرس <https://dash.cloudflare.com/sign-up> بروید.
2. با ایمیل ثبت‌نام کنید (یا با گوگل/اپل).
3. ایمیل خود را تأیید کنید.
4. برای استفاده از Workers روی پلن رایگان، نیازی به کارت اعتباری نیست.

### 2. نصب Wrangler

```bash
npm install -g wrangler
wrangler login
wrangler --version
```

### 3. ساخت ربات تلگرام

1. در تلگرام گفتگویی با [@BotFather](https://t.me/BotFather) شروع کنید.
2. دستور `/newbot` را بفرستید.
3. یک **نام** و یک **نام‌کاربری** که با `bot` تمام شود انتخاب کنید.
4. توکن دریافتی را محفوظ نگه دارید.

### 4. دریافت پروژه

```bash
git clone https://github.com/botlabz/telegram-bot-ai-meeting-transcriber.git
cd telegram-bot-ai-meeting-transcriber
npm install
```

### 5. تنظیم توکن ربات

```bash
wrangler secret put BOT_TOKEN
# paste your token when prompted
```


هوش‌مصنوعی روی پلن رایگان کلودفلر از طریق Workers AI فعال است؛ اتصال `ai` در wrangler.toml آماده است.

### 6. اجرای محلی و استقرار

```bash
wrangler dev        # local testing
wrangler deploy      # live at https://telegram-bot-ai-meeting-transcriber.<subdomain>.workers.dev
```

### 7. اتصال webhook

باز کنید در مرورگر: / Open in browser:

```text
https://telegram-bot-ai-meeting-transcriber.<your-subdomain>.workers.dev/register
```

✅ انجام شد! برای ربات پیام بفرستید.

---

## 💬 نحوه استفاده

| دستور | عملکرد |
| --- | --- |
| `/notes` <input> | Summarize meeting notes or a transcript |
| `/help` | نمایش راهنما |

---

## 🗂 ساختار پروژه

```text
telegram-bot-ai-meeting-transcriber/
├── worker.js      # کد کامل ربات (تک‌فایل)
├── wrangler.toml    # تنظیمات Cloudflare Workers
├── package.json
├── .gitignore
├── LICENSE          # MIT
├── README.md        # انگلیسی
└── README.fa.md     # فارسی
```

---

## 🔧 شخصی‌سازی

- دستورات، متن راهنما و پیام‌ها را در `worker.js` ویرایش کنید.
- برای بات‌های هوش‌مصنوعی، پrompt سیستم را در `CONFIG.system` تغییر دهید.
- برای بات‌های پایش، نوع و منابع را در `CONFIG` تنظیم کنید.

---

## 🆓 رایگان و متن‌باز

این پروژه تحت مجوز **MIT** منتشر شده است — برای استفاده شخصی و تجاری آزاد است.

---

## 🤖 ربات‌های تلگرام رایگان دیگر

بخشی از مجموعه ربات‌های تلگرام رایگان و متن‌باز توسط [botlabz](https://github.com/botlabz):

- [اصلاح‌کننده کد با هوش‌مصنوعی](https://github.com/botlabz/telegram-bot-ai-code-fixer)
- [تولیدکننده محتوا با هوش‌مصنوعی](https://github.com/botlabz/telegram-bot-ai-content-generator)
- [چت با سند هوش‌مصنوعی](https://github.com/botlabz/telegram-bot-ai-document-chat)
- [تحلیل‌گر فایل هوش‌مصنوعی](https://github.com/botlabz/telegram-bot-ai-file-analyzer)
- [پایش‌گر گیت‌هاب هوش‌مصنوعی](https://github.com/botlabz/telegram-bot-ai-github-tracker)
- [چکیده اخبار هوش‌مصنوعی](https://github.com/botlabz/telegram-bot-ai-news-digest)

همه ربات‌ها در سازمان [tele-bot](https://github.com/botlabz/tele-bot) موجودند.

---

بیایید با هم چیزی بسازیم 🚀

https://tally.so/r/q4q1L9
