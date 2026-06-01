# دیپلوی لایو (Vercel)

این پروژه **Next.js** با **API Route** و **Supabase** است. سرویس‌های فقط‌استاتیک مثل **Surge** یا **GitHub Pages** برای آن مناسب نیستند؛ **Vercel** (سازندهٔ Next.js) بهترین گزینه است: رایگان، SSL، و پشتیبانی کامل از App Router.

## پیش‌نیاز

1. اسکیمای دیتابیس در Supabase اجرا شده باشد: [`supabase/schema.sql`](./supabase/schema.sql)
2. فایل `.env.local` با کلیدهای Supabase (از `.env.example` کپی کنید)

## روش ۱ — یک دستور (CLI)

```bash
# ۱) لاگین — حتماً تا انتها در مرورگر تأیید کنید (Authorize)
npx --yes vercel@latest login

# ۲) باید ایمیل/یوزرنیم نشان دهد (نه خطای token)
npx --yes vercel@latest whoami

# ۳) دیپلوی production
./scripts/deploy-vercel.sh
```

اگر خطای `The specified token is not valid` دیدید، لاگین ناقص مانده است. دوباره `vercel login` بزنید و در صفحهٔ Vercel دکمه **Authorize** را بزنید تا `whoami` کار کند.

بعد از اولین `vercel link`، متغیرهای محیطی را در داشبورد Vercel اضافه کنید:

| نام | مقدار |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL پروژه Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | کلید anon / publishable |

سپس **Redeploy** از پنل Vercel بزنید تا env اعمال شود.

یا از ترمینال:

```bash
npx vercel@latest env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel@latest env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
```

## روش ۲ — اتصال GitHub به Vercel

1. پروژه را به GitHub پوش کنید
2. در [vercel.com/new](https://vercel.com/new) ریپو را Import کنید
3. Framework: **Next.js** (خودکار تشخیص داده می‌شود)
4. Environment Variables همان دو متغیر بالا را اضافه کنید
5. Deploy — هر push به `main` به‌صورت خودکار لایو می‌شود

## روش ۳ — GitHub Actions

اگر `VERCEL_TOKEN` و شناسهٔ پروژه را در Secrets گیت‌هاب بگذارید، workflow در [`.github/workflows/deploy-vercel.yml`](./.github/workflows/deploy-vercel.yml) روی هر push به `main` دیپلوی می‌کند.

```bash
npx vercel@latest link    # یک‌بار — .vercel/project.json ساخته می‌شود
```

سپس در GitHub → Settings → Secrets:

- `VERCEL_TOKEN` — از [vercel.com/account/tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` و `VERCEL_PROJECT_ID` — از `.vercel/project.json`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## دسترسی عمومی بدون لاگین Vercel

**بله، امکان‌پذیر است.** اپ شما برای بازدیدکننده لاگین نمی‌خواهد؛ اگر صفحهٔ «Sign in to Vercel» می‌بینید، معمولاً یکی از این دو دلیل است:

### ۱) لینک اشتباه است

| نوع لینک | عمومی؟ | مثال |
| --- | --- | --- |
| **Production (درست)** | بله | `https://ai-tools-benchmark.vercel.app` |
| **Inspect / Dashboard** | خیر — فقط برای شما | `https://vercel.com/.../ai-tools-benchmark/...` |
| **Preview / deployment URL** | اغلب خیر (روی پلن رایگان) | `https://ai-tools-benchmark-xxxxx-username.vercel.app` |

لینکی که به دوستان بدهید:

**https://ai-tools-benchmark.vercel.app**

(همان **Aliased** که بعد از `deploy` در ترمینال چاپ می‌شود.)

### ۲) Deployment Protection روشن است

در [Vercel Dashboard](https://vercel.com) → پروژه **ai-tools-benchmark** → **Settings** → **Deployment Protection**:

1. برای **Production**: گزینهٔ **Vercel Authentication** را **خاموش** کنید (یا Protection را فقط برای Preview بگذارید).
2. اگر **Password Protection** یا **Trusted IPs** فعال است، برای Production غیرفعالش کنید.
3. یک بار **Redeploy** بزنید.

بعد در مرورگر ناشناس (Incognito) همان لینک production را باز کنید — باید بدون لاگین Vercel سایت را ببینید.

> **نکته:** لاگین `vercel login` فقط برای **شما** (دیپلوی از CLI) است؛ بازدیدکننده هرگز به آن نیاز ندارد.

## چرا نه Surge؟

Surge فقط فایل‌های استاتیک (HTML/CSS/JS) را میزبانی می‌کند. این اپ به `/api/tools` و رندر سمت سرور نیاز دارد؛ بدون بازنویسی کامل معماری روی Surge کار نمی‌کند.

## اسکریپت‌های npm

| دستور | توضیح |
| --- | --- |
| `npm run deploy` | دیپلوی production با Vercel CLI |
| `npm run deploy:preview` | پیش‌نمایش (URL موقت) |
