export async function onRequest(context) {
  const { env } = context;

  let objects = [];
  let cursor;

  do {
    const res = await env.ARCHIVE_BUCKET.list({ cursor });
    objects.push(...res.objects);
    cursor = res.truncated ? res.cursor : undefined;
  } while (cursor);

  // 🎥 Videos
  const videos = objects.filter(o =>
    o.key.match(/\.(mp4|webm|mov|m4v)$/i)
  );

  // 🖼️ Images (all common formats)
  const images = objects.filter(o =>
    o.key.match(/\.(jpg|jpeg|png|gif|webp|avif|heic)$/i)
  );

  const media = [...videos, ...images];

  if (media.length === 0) {
    return json({ ok: false, error: "No media found" });
  }

  const file = media[Math.floor(Math.random() * media.length)];

  const isVideo = file.key.match(/\.(mp4|webm|mov|m4v)$/i);

  return json({
    ok: true,
    type: isVideo ? "video" : "image",
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
