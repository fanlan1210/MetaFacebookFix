const { parser } = require("html-metadata-parser");
const Koa = require("koa");
const Router = require("@koa/router");
const { get } = require("koa/lib/response");
const serve = require("koa-static");
const path = require("path");

const app = new Koa();
const router = new Router();

app.use(serve(path.join(__dirname, "public")));

async function generateHtmlWithMetadata(url) {
  const metadata = await parser(url, { maxRedirects: 5 }).then((result) => {
    // console.log(JSON.stringify(result, null, 3));
    return result;
  });
  // .replace(`"`, `&#34;`)
  let title = `${metadata.og.title} &#128588; Facebook 分享連結預覽好幫手`;
  let description = `${metadata.og.description ?? ""}${metadata.og.description != null ? " - " : ""}${metadata.og.title}`;
  let img = metadata.og.image ?? "/og.jpg";
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="${title}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${img}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${img}" />

    <!-- Telegram -->
    <meta property="og:image" content="${img}" />
    <meta property="telegram_channel" content="turbolabit">

    <!-- Redirect to Facebook -->
    <meta http-equiv="refresh" content="2; url = ${url}" />

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap');
      * {
        font-family: "Heiti TC", "Noto Sans TC", sans-serif;
      }
      .message {
        margin: 20px 10px;
      }
      .message a {
        background: #0D5C33;
        padding: 4px 10px;
        color: #FFF;
        border-radius: 15px;
        text-decoration: none;
      }
      .message a:hover, .message a:active {
        color: #FFF;
        text-decoration: none;
      }
      .message a::before {
        content: "🔗 ";
      }
    </style>

  </head>
  <body>
    <div class="message">
      Facebook 分享連結預覽好幫手 🙌 正在帶您前往 <a href="${url}">${url}</a>。
    </div>
  </body>
  </html>
  `;
  return html;
}

router.get("/", async (ctx, next) => {
  let title = "Facebook 分享連結預覽好幫手 🙌";
  let description = "分享 Facebook 連結有預覽資訊的神奇魔法！✨";
  let img = `https://maps.dstw.dev/og.jpg`;
  let url = `https://maps.dstw.dev/`;
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="${title}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${img}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${img}" />

    <!-- Telegram -->
    <meta property="og:image" content="${img}" />
    <meta property="telegram_channel" content="turbolabit">

    <!-- Redirect to README -->
    <meta http-equiv="refresh" content="0; url = https://github.com/yc97463/GMapsFix/blob/main/README.md" />
  </head>
  <body></body>
  </html>
  `;
  ctx.body = html;
  ctx.type = "text/html";
});

router.get("/share/:type/:id", async (ctx, next) => {
  const url = `https://www.facebook.com/share/${ctx.params.type}/${ctx.params.id}`;
  // console.log(ctx.params.id);

  ctx.body = await generateHtmlWithMetadata(url);
  ctx.type = "text/html";
});

router.get("/share/:id", async (ctx, next) => {
  const url = `https://www.facebook.com/share/${ctx.params.id}`;
  // console.log(ctx.params.id);

  ctx.body = await generateHtmlWithMetadata(url);
  ctx.type = "text/html";
});

router.get("/:username/posts/:id", async (ctx, next) => {
  const url = `https://www.facebook.com/${ctx.params.username}/posts/${ctx.params.id}`;
  // console.log(ctx.params.id);

  ctx.body = await generateHtmlWithMetadata(url);
  ctx.type = "text/html";
});

router.get("/:id", async (ctx, next) => {
  const url = `https://www.facebook.com/share/${ctx.params.id}`;
  const metadata = await parser(url).then((result) => {
    return result;
  });
  ctx.body = await generateHtmlWithMetadata(url);
  ctx.type = "text/html";
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on ${process.env.PORT || 3000}\n`);
});
