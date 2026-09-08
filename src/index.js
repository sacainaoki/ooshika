export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // GPS登録の中継口
    if (url.pathname === "/api/spot" && request.method === "POST") {
      try {
        const body = await request.json();
        const payload = {
          token: env.GAS_TOKEN,
          action: "save",
          record: body.record || {}
        };
        const r = await fetch(env.GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const text = await r.text();
        return new Response(text, {
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: String(e) }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // それ以外は今まで通り静的ファイルを返す
    return env.ASSETS.fetch(request);
  }
};
