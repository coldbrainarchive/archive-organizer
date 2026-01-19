export async function onRequest(context) {
  const { env } = context;

  let objects = [];
  let cursor;

  do {
    const res = await env.ARCHIVE_BUCKET.list({
      prefix: "uploads/", // 🔒 uploads ONLY
      cursor
    });

    objects.push(...res.objects);
    cursor = res.truncated ? res.cursor : undefined;
  } while (cursor);

  if (objects.length === 0) {
    return json({ ok: false, error: "No uploaded videos found" });
  }

  const file = objects[Math.floor(Math.random() * objects.length)];

  return json({
    ok: true,
    key: file.key,
    url: `https://pub-f7c8d1cb51b44748a4cad84d525b6c0c.r2.dev/${encodeURIComponent(file.key)}`
  });
}
