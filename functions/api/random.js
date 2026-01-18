export async function onRequest(context) {
  const { env } = context;

  // List files in R2
  const list = await env.ARCHIVE_BUCKET.list();

  if (!list.objects || list.objects.length === 0) {
    return json({ ok: false, error: "No videos found" });
  }

  // Pick random file
  const file =
    list.objects[Math.floor(Math.random() * list.objects.length)];

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
