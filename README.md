# Telegram Bot: AI Meeting Transcriber — Free & Open Source 🤖

**AI Meeting Transcriber** is a free, open-source Telegram bot that turns transcripts and notes into summaries, action items and decisions using AI. Self-host it for free on Cloudflare Workers — full source code included (MIT).

> 🪪 **License:** MIT — free for personal and commercial use.

---

## ✨ Features

- Summarize meeting notes
- Extract action items & decisions
- List owners and tasks
- AI on the edge
- Free tier

---

## 🧱 Tech stack

| Component | Choice |
| --- | --- |
| Runtime | Cloudflare Workers |
| Web framework | [Hono](https://hono.dev) |
| AI | Cloudflare Workers AI (`@cf/meta/llama-3-8b-instruct`) |
| Bot transport | Telegram Bot API (webhooks) |

---

## 📋 Prerequisites

- A **Cloudflare account** (free tier is fine).
- **Node.js** (v18+) and **npm** installed.
- A **Telegram account** (to talk to [@BotFather](https://t.me/BotFather)).

---

## 🚀 Step-by-step setup & deployment

### 1. Create a Cloudflare account

1. Go to <https://dash.cloudflare.com/sign-up>.
2. Sign up with your email (or Google/Apple).
3. Verify your email.
4. No credit card is needed for the free plan.

### 2. Install Wrangler

```bash
npm install -g wrangler
wrangler login
wrangler --version
```

### 3. Create your Telegram bot

1. Start a chat with [@BotFather](https://t.me/BotFather).
2. Send `/newbot`.
3. Choose a **name** and a **username** ending in `bot`.
4. Keep the returned token secret.

### 4. Get the project

```bash
git clone https://github.com/botlabz/telegram-bot-ai-meeting-transcriber.git
cd telegram-bot-ai-meeting-transcriber
npm install
```

### 5. Configure the bot token

```bash
wrangler secret put BOT_TOKEN
# paste your token when prompted
```


Workers AI is enabled on the free plan; the `ai` binding is already in wrangler.toml.

### 6. Run locally & deploy

```bash
wrangler dev        # local testing
wrangler deploy      # live at https://telegram-bot-ai-meeting-transcriber.<subdomain>.workers.dev
```

### 7. Connect the webhook

باز کنید در مرورگر: / Open in browser:

```text
https://telegram-bot-ai-meeting-transcriber.<your-subdomain>.workers.dev/register
```

✅ Done! Send the bot a message.

---

## 💬 Usage

| Command | What it does |
| --- | --- |
| `/notes` <input> | Summarize meeting notes or a transcript |
| `/help` | Show this help |

---

## 🗂 Project structure

```text
telegram-bot-ai-meeting-transcriber/
├── worker.js      # complete bot code (single file)
├── wrangler.toml    # Cloudflare Workers config
├── package.json
├── .gitignore
├── LICENSE          # MIT
├── README.md        # English
└── README.fa.md     # Persian
```

---

## 🔧 Customization

- Edit commands, help text and messages in `worker.js`.
- For AI bots, change the system prompt in `CONFIG.system`.
- For trackers, adjust the type and sources in `CONFIG`.

---

## 🆓 Free & open source

This project is released under the **MIT License** — free for personal and commercial use.

---

## 🤖 More free Telegram bots

Part of a free, open-source Telegram bot collection by [botlabz](https://github.com/botlabz):

- [AI Code Fixer](https://github.com/botlabz/telegram-bot-ai-code-fixer)
- [AI Content Generator](https://github.com/botlabz/telegram-bot-ai-content-generator)
- [AI Document Chat](https://github.com/botlabz/telegram-bot-ai-document-chat)
- [AI File Analyzer](https://github.com/botlabz/telegram-bot-ai-file-analyzer)
- [AI GitHub Tracker](https://github.com/botlabz/telegram-bot-ai-github-tracker)
- [AI News Digest](https://github.com/botlabz/telegram-bot-ai-news-digest)

Browse all bots in the [tele-bot](https://github.com/botlabz/tele-bot) org.

---

Let's Build Something Together 🚀

https://tally.so/r/q4q1L9
