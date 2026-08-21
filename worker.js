// AUTO-GENERATED — Telegram bot on Cloudflare Workers (single-file deployment).
// Scaffold head: imports, app, Telegram helpers. Engine code is appended after CONFIG.
import { Hono } from "hono";

const app = new Hono();

const api = (env) => `https://api.telegram.org/bot${env.BOT_TOKEN}`;

const HELP = `🤖 AI Meeting Transcriber

Send a transcript or notes and receive a summary, action items, decisions and tasks automatically

Available commands:
/notes <input> – Summarize meeting notes or a transcript
/help – Show this help

/help – show this message

Just send text, or use /notes <input>.`;

// ===========================================================================
// Telegram helpers
// ===========================================================================
async function sendMessage(chatId, text, env, extra = {}) {
  return fetch(`${api(env)}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: String(text).slice(0, 4096), ...extra }),
  });
}

async function sendChatAction(chatId, action, env) {
  return fetch(`${api(env)}/sendChatAction`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action }),
  });
}

async function sendPhoto(chatId, bytes, caption, env, filename = "image.png") {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("photo", new Blob([bytes], { type: "image/png" }), filename);
  if (caption) form.append("caption", caption.slice(0, 1024));
  return fetch(`${api(env)}/sendPhoto`, { method: "POST", body: form });
}

async function sendDocument(chatId, bytes, filename, caption, env) {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("document", new Blob([bytes]), filename);
  if (caption) form.append("caption", caption.slice(0, 1024));
  return fetch(`${api(env)}/sendDocument`, { method: "POST", body: form });
}

async function sendLong(chatId, text, env) {
  text = String(text || "");
  const MAX = 4000;
  if (text.length <= MAX) return sendMessage(chatId, text, env);
  let i = 0;
  while (i < text.length) {
    const chunk = text.slice(i, i + MAX);
    await sendMessage(chatId, chunk, env);
    i += MAX;
  }
}

const CONFIG = {
  "name": "AI Meeting Transcriber",
  "system": "You are a meeting assistant. Given a transcript or notes, produce: 1) Summary, 2) Action items (with owners if mentioned), 3) Decisions, 4) Open tasks.",
  "primary": "notes",
  "primaryDesc": "Summarize meeting notes or a transcript"
};

// ===== ENGINE: ai =====
// ENGINE: ai  — uses Cloudflare Workers AI (@cf/meta/llama-3-8b-instruct).
// CONFIG: { name, system, primary, needsUrl, urlInstruction, feedUrls, feedInstruction, plainOk }
async function aiRun(prompt, env) {
  if (!env.AI) return null;
  try {
    const r = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        { role: "system", content: CONFIG.system },
        { role: "user", content: prompt },
      ],
    });
    return (r && (r.response || r.result)) || null;
  } catch (e) {
    console.error("ai error", e);
    return null;
  }
}

async function fetchText(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 12000);
  } catch (e) {
    return null;
  }
}

async function fetchFeeds(urls) {
  let out = "";
  for (const u of urls.slice(0, 6)) {
    try {
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(u)}`,
        { headers: { "user-agent": "Mozilla/5.0" } }
      );
      const j = await res.json();
      const items = (j.items || [])
        .slice(0, 8)
        .map((it) => `- ${it.title}: ${(it.description || "").replace(/<[^>]+>/g, " ")}`)
        .join("\n");
      out += `\nSource: ${u}\n${items}\n`;
    } catch (e) {}
  }
  return out.slice(0, 12000);
}

async function engineHandle(message, env, cmd, args, chatId) {
  let prompt = null;
  if (cmd === null) prompt = (message.text || "").trim();
  else if (cmd === CONFIG.primary) prompt = args;
  else return false;

  if (!prompt && !CONFIG.feedUrls) {
    await sendMessage(chatId, `Usage: /${CONFIG.primary} <your input>`, env);
    return true;
  }

  let finalPrompt = prompt || "";
  if (CONFIG.needsUrl && prompt) {
    const txt = await fetchText(prompt);
    if (!txt) {
      await sendMessage(chatId, "❌ Could not fetch that URL.", env);
      return true;
    }
    finalPrompt = `URL: ${prompt}\n\nContent:\n${txt}\n\n${CONFIG.urlInstruction || "Analyze the above content."}`;
  }
  if (CONFIG.feedUrls && !prompt) {
    const feeds = await fetchFeeds(CONFIG.feedUrls);
    finalPrompt = `${CONFIG.feedInstruction || "Summarize the following:"}\n\n${feeds}`;
  }

  await sendChatAction(chatId, "typing", env);
  const out = await aiRun(finalPrompt, env);
  if (!out) {
    await sendMessage(
      chatId,
      "⚠️ Workers AI is not configured.\nAdd `ai = { binding = \"AI\" }` to wrangler.toml and enable Workers AI in your Cloudflare dashboard (free tier).",
      env
    );
    return true;
  }
  await sendLong(chatId, out, env);
  return true;
}

// ===========================================================================
// Message dispatcher
// ===========================================================================
async function handleMessage(message, env) {
  const chatId = message?.chat?.id;
  if (!chatId) return;

  // Non-text messages (photos, documents, voice, etc.) go to the engine if it wants them.
  if (!message.text) {
    if (typeof engineHandleMedia === "function") {
      const ok = await engineHandleMedia(message, env, chatId);
      if (!ok) await sendMessage(chatId, "Send /start to begin, or use /help.", env);
    } else {
      await sendMessage(chatId, "Send /start to begin, or use /help.", env);
    }
    return;
  }

  const text = message.text;
  const m = text.match(/^\/([a-zA-Z0-9_]+)(?:@\S+)?\s*([\s\S]*)$/);

  if (!m) {
    // Plain text message.
    const handled = await engineHandle(message, env, null, text.trim(), chatId);
    if (!handled) await sendMessage(chatId, "Try /help for available commands.", env);
    return;
  }

  const cmd = m[1].toLowerCase();
  const args = m[2].trim();

  if (cmd === "start" || cmd === "help") {
    await sendMessage(chatId, HELP, env);
    return;
  }

  const handled = await engineHandle(message, env, cmd, args, chatId);
  if (!handled) await sendMessage(chatId, `Unknown command "/${cmd}". Try /help.`, env);
}

// Engine may register additional routes (redirects, votes, ...).
if (typeof engineRoutes === "function") engineRoutes(app);

app.get("/", (c) =>
  c.json({ name: CONFIG.name, status: "ok", runtime: "Cloudflare Workers" })
);

// Register the Telegram webhook. Visit /register (or /register?url=https://.../webhook).
app.get("/register", async (c) => {
  const url = new URL(c.req.url);
  const target = url.searchParams.get("url") || `${url.origin}/webhook`;
  const res = await fetch(`${api(c.env)}/setWebhook?url=${encodeURIComponent(target)}`);
  const json = await res.json();
  return c.json(json);
});

app.post("/webhook", async (c) => {
  try {
    const update = await c.req.json();
    if (update.message) await handleMessage(update.message, c.env);
    if (update.edited_message) await handleMessage(update.edited_message, c.env);
    if (update.callback_query && typeof engineHandleCallback === "function") {
      await engineHandleCallback(update.callback_query, c.env);
    }
  } catch (e) {
    console.error("webhook error", e);
  }
  return c.text("OK");
});

// Cron handler (only does work if the engine defines engineScheduled).
export async function scheduled(event, env, ctx) {
  if (typeof engineScheduled === "function") {
    try {
      await engineScheduled(env, event);
    } catch (e) {
      console.error("scheduled error", e);
    }
  }
}

export default app;
