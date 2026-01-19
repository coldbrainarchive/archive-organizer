export async function onRequest(context) {
  const { env } = context;

  let objects = [];
  let cursor;

  do {
    const res = await env.ARCHIVE_BUCKET.list({ cursor });
    objects.push(...res.objects);
    cursor = res.truncated ? res.cursor : undefined;
  } while (cursor);

  // ✅ ONLY playable videos (any folder)
  const videos = objects.filter(o =>
    o.key.match(/\.(mp4|webm|mov|m4v)$/i)
  );

  if (videos.length === 0) {
    return json({ ok: false, error: "No playable videos found" });
  }

  const file = videos[Math.floor(Math.random() * videos.length)];

  return json({
    ok: true,
    key: file.key,
    url: `https://pub-f7c8d1cb51b44748a4cad84d525b6c0c.r2.dev/${encodeURIComponent(file.key)}`
  });
}

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
